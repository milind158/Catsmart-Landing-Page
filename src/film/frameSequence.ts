import { framesOf, frameUrl, isFilmFrame, stepAt, variants, type Variant } from "./scenes";

const maxFetches = 6;
const maxDecodes = 3;
// A decoded 1080p frame costs about 8 MB, so only those near the playhead stay in memory.
// reach must fit inside half of maxBitmaps: eviction keeps the frames nearest the playhead either side,
// so a longer reach ahead would decode frames only to throw them away again. decodesPerSecond sets how
// many frames to skip when scrolling faster than they can be decoded. fetchAhead is how many frames
// past that are downloaded in advance: about two seconds of medium scrolling, and nothing further.
const limits: Record<Variant, { maxBitmaps: number; behind: number; ahead: number; decodesPerSecond: number; fetchAhead: number }> = {
  desktop: { maxBitmaps: 64, behind: 8, ahead: 18, decodesPerSecond: 120, fetchAhead: 48 },
  mobile: { maxBitmaps: 40, behind: 6, ahead: 14, decodesPerSecond: 60, fetchAhead: 48 },
};
const keyFrameEvery = 32;
// Compressed frames are kept for going back, up to this much, and refetched from the browser's cache after.
const maxBlobBytes = 160 * 1024 * 1024;
// Frames further apart than this are too different to blend into each other cleanly.
const widestBlend = 8;

// Loads film frames in stages and hands back the closest one available, so scrubbing never goes blank.
export class FrameSequence {
  private blobs = new Map<number, Blob>();
  private blobBytes = 0;
  private lastMove = 0;
  private stride = 1;
  private bitmaps = new Map<number, ImageBitmap>();
  private queue: number[] = [];
  private background: number[] = [];
  private queued = new Set<number>();
  private fetching = new Set<number>();
  private decodeQueue: number[] = [];
  private decoding = new Set<number>();
  private loadedScenes = new Set<string>();
  private pinned = new Set<number>();
  private playhead = 1;
  private controller = new AbortController();
  readonly step: number;
  private limits: (typeof limits)[Variant];

  constructor(
    readonly variant: Variant,
    private onFrameReady: () => void,
    private onFrameFailed: (frame: number) => void,
  ) {
    this.step = variants[variant].step;
    this.limits = limits[variant];
  }

  snap(frame: number) {
    const step = stepAt(frame, this.variant);
    return Math.floor((frame - 1) / step) * step + 1;
  }

  nearest(frame: number) {
    const exact = this.bitmaps.get(frame);
    if (exact) return exact;
    for (let offset = 1; offset <= 192; offset += 1) {
      const candidate = this.bitmaps.get(frame - offset) ?? this.bitmaps.get(frame + offset);
      if (candidate) return candidate;
    }
    return this.bitmaps.values().next().value;
  }

  // The closest decoded frames either side, so the picture can blend across any that are not ready yet.
  around(frame: number) {
    const low = this.snap(frame);
    for (let before = low; before > low - widestBlend; before -= this.step) {
      if (!this.bitmaps.has(before)) continue;
      for (let after = before + this.step; after <= before + widestBlend; after += this.step) {
        if (after > frame && this.bitmaps.has(after)) {
          return { before: this.bitmaps.get(before)!, after: this.bitmaps.get(after)!, mix: (frame - before) / (after - before) };
        }
      }
      break;
    }
    return undefined;
  }

  loadScene(sceneId: string) {
    if (this.loadedScenes.has(sceneId)) return;
    this.loadedScenes.add(sceneId);
    this.enqueueBack(framesOf(sceneId, this.variant));
  }

  // Quietly fetches a thin spread across the whole film, so chapter jumps land near the right image.
  loadKeyFrames(sceneIds: string[]) {
    for (const sceneId of sceneIds) {
      this.enqueueBack(framesOf(sceneId, this.variant).filter((_, index) => index % keyFrameEvery === 0));
    }
  }

  setPlayhead(frame: number) {
    const moved = frame - this.playhead;
    this.playhead = frame;
    const now = performance.now();
    const speed = Math.abs(moved) / Math.max(now - this.lastMove, 8) * 1000;
    this.lastMove = now;
    // Faster than decoding can follow, every frame would arrive too late: take fewer, further ahead.
    this.stride = Math.min(8, Math.max(1, Math.ceil(speed / this.step / this.limits.decodesPerSecond)));
    const direction = moved >= 0 ? 1 : -1;
    const ahead = moved >= 0 ? this.limits.ahead : this.limits.behind;
    const behind = moved >= 0 ? this.limits.behind : this.limits.ahead;
    const wanted: number[] = [];
    const start = Math.floor((frame - 1) / (this.step * this.stride)) * this.step * this.stride + 1;
    for (let offset = -behind; offset <= ahead; offset += 1) {
      const target = start + offset * this.stride * this.step;
      if (isFilmFrame(target) && !wanted.includes(target)) wanted.push(target);
    }
    wanted.sort((a, b) => Math.abs(a - frame) - Math.abs(b - frame));

    this.decodeQueue = [...this.pinned].filter((target) => this.blobs.has(target) && !this.bitmaps.has(target) && !this.decoding.has(target));
    const missing: number[] = [];
    for (const target of wanted) {
      if (this.bitmaps.has(target) || this.decoding.has(target)) continue;
      if (this.blobs.has(target)) this.decodeQueue.push(target);
      else missing.push(target);
    }
    // Replaces what was queued: frames the visitor has already passed are no longer worth downloading.
    const reach = (direction > 0 ? ahead : behind) * this.stride * this.step;
    for (let count = 1; count <= this.limits.fetchAhead; count += 1) {
      const target = start + direction * (reach + count * this.stride * this.step);
      if (isFilmFrame(target) && !this.blobs.has(target) && !this.bitmaps.has(target)) missing.push(target);
    }
    this.queue = missing.filter((target) => !this.fetching.has(target));
    this.pumpFetches();
    this.pumpDecodes();
  }

  // Keeps these frames decoded whatever the playhead does, so the reveal can play straight through.
  pin(frames: number[]) {
    frames.forEach((frame) => this.pinned.add(frame));
    this.enqueueFront(frames.filter((frame) => !this.blobs.has(frame)));
    this.decodeQueue.unshift(...frames.filter((frame) => this.blobs.has(frame) && !this.bitmaps.has(frame)));
    this.pumpDecodes();
  }

  unpin() {
    this.pinned.clear();
  }

  isDecoded(frame: number) {
    return this.bitmaps.has(frame);
  }

  private enqueueFront(frames: number[]) {
    const fresh = frames.filter((frame) => !this.blobs.has(frame) && !this.fetching.has(frame));
    const moving = new Set(fresh);
    this.queue = [...fresh, ...this.queue.filter((frame) => !moving.has(frame))];
    this.pumpFetches();
  }

  // Waits behind anything the playhead needs.
  private enqueueBack(frames: number[]) {
    for (const frame of frames) {
      if (this.queued.has(frame) || this.blobs.has(frame) || this.fetching.has(frame)) continue;
      this.queued.add(frame);
      this.background.push(frame);
    }
    this.pumpFetches();
  }

  private pumpFetches() {
    while (this.fetching.size < maxFetches && (this.queue.length || this.background.length)) {
      const frame = this.queue.shift() ?? this.background.shift()!;
      this.queued.delete(frame);
      if (this.blobs.has(frame) || this.fetching.has(frame)) continue;
      this.fetching.add(frame);
      fetch(frameUrl(frame, this.variant), { signal: this.controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.blob();
        })
        .then((blob) => {
          this.blobs.set(frame, blob);
          this.blobBytes += blob.size;
          this.evictBlobs();
          this.fetching.delete(frame);
          if (this.pinned.has(frame) || Math.abs(frame - this.playhead) <= this.limits.ahead * this.step * this.stride) this.decodeQueue.push(frame);
          this.pumpDecodes();
          this.pumpFetches();
        })
        .catch(() => {
          this.fetching.delete(frame);
          if (this.controller.signal.aborted) return;
          this.onFrameFailed(frame);
          this.pumpFetches();
        });
    }
  }

  private pumpDecodes() {
    while (this.decoding.size < maxDecodes && this.decodeQueue.length) {
      const frame = this.decodeQueue.shift()!;
      const blob = this.blobs.get(frame);
      if (!blob || this.bitmaps.has(frame) || this.decoding.has(frame)) continue;
      this.decoding.add(frame);
      createImageBitmap(blob)
        .then((bitmap) => {
          this.decoding.delete(frame);
          if (this.controller.signal.aborted) {
            bitmap.close();
            return;
          }
          this.bitmaps.set(frame, bitmap);
          this.evict();
          this.onFrameReady();
          this.pumpDecodes();
        })
        .catch(() => {
          this.decoding.delete(frame);
          this.pumpDecodes();
        });
    }
  }

  private evict() {
    const limit = this.limits.maxBitmaps;
    if (this.bitmaps.size <= limit) return;
    const farthest = [...this.bitmaps.keys()].filter((frame) => !this.pinned.has(frame)).sort((a, b) => Math.abs(b - this.playhead) - Math.abs(a - this.playhead));
    for (const frame of farthest.slice(0, Math.max(0, this.bitmaps.size - limit))) {
      this.bitmaps.get(frame)?.close();
      this.bitmaps.delete(frame);
    }
  }

  private evictBlobs() {
    if (this.blobBytes <= maxBlobBytes) return;
    const farthest = [...this.blobs.keys()].filter((frame) => !this.pinned.has(frame)).sort((a, b) => Math.abs(b - this.playhead) - Math.abs(a - this.playhead));
    for (const frame of farthest) {
      if (this.blobBytes <= maxBlobBytes * 0.85) break;
      this.blobBytes -= this.blobs.get(frame)!.size;
      this.blobs.delete(frame);
    }
  }

  dispose() {
    this.controller.abort();
    this.bitmaps.forEach((bitmap) => bitmap.close());
    this.bitmaps.clear();
    this.blobs.clear();
    this.queue = [];
    this.background = [];
    this.decodeQueue = [];
  }
}
