import { framesOf, frameUrl, isFilmFrame, variants, type Variant } from "./scenes";

const maxFetches = 6;
const maxDecodes = 3;
// Decoded 1080p frames cost about 8 MB each, so only those near the playhead stay in memory.
const maxBitmaps: Record<Variant, number> = { desktop: 64, mobile: 40 };
const decodeBehind = 6;
const decodeAhead = 18;
const keyFrameEvery = 8;

// Loads film frames in stages and hands back the closest one available, so scrubbing never goes blank.
export class FrameSequence {
  private blobs = new Map<number, Blob>();
  private bitmaps = new Map<number, ImageBitmap>();
  private queue: number[] = [];
  private queued = new Set<number>();
  private fetching = new Set<number>();
  private decodeQueue: number[] = [];
  private decoding = new Set<number>();
  private loadedScenes = new Set<string>();
  private pinned = new Set<number>();
  private playhead = 1;
  private controller = new AbortController();
  readonly step: number;

  constructor(
    readonly variant: Variant,
    private onFrameReady: () => void,
    private onFrameFailed: (frame: number) => void,
  ) {
    this.step = variants[variant].step;
  }

  snap(frame: number) {
    return Math.floor((frame - 1) / this.step) * this.step + 1;
  }

  bitmapAt(frame: number) {
    return this.bitmaps.get(frame);
  }

  nearest(frame: number) {
    const exact = this.bitmaps.get(frame);
    if (exact) return exact;
    for (let offset = this.step; offset <= 96; offset += this.step) {
      const candidate = this.bitmaps.get(frame - offset) ?? this.bitmaps.get(frame + offset);
      if (candidate) return candidate;
    }
    return this.bitmaps.values().next().value;
  }

  // Key frames first and the rest after, so a scene is usable long before it has fully arrived.
  loadScene(sceneId: string, urgent = false) {
    if (this.loadedScenes.has(sceneId)) return;
    this.loadedScenes.add(sceneId);
    const frames = framesOf(sceneId, this.variant);
    const keys = frames.filter((_, index) => index % keyFrameEvery === 0);
    const rest = frames.filter((_, index) => index % keyFrameEvery !== 0);
    const order = [...keys, ...rest];
    if (urgent) this.enqueueFront(order);
    else this.enqueueBack(order);
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
    const ahead = moved >= 0 ? decodeAhead : decodeBehind;
    const behind = moved >= 0 ? decodeBehind : decodeAhead;
    const wanted: number[] = [];
    for (let offset = -behind; offset <= ahead; offset += 1) {
      const target = this.snap(frame + offset * this.step);
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
    this.enqueueFront(missing);
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
    fresh.forEach((frame) => this.queued.add(frame));
    this.pumpFetches();
  }

  private enqueueBack(frames: number[]) {
    for (const frame of frames) {
      if (this.queued.has(frame) || this.blobs.has(frame) || this.fetching.has(frame)) continue;
      this.queued.add(frame);
      this.queue.push(frame);
    }
    this.pumpFetches();
  }

  private pumpFetches() {
    while (this.fetching.size < maxFetches && this.queue.length) {
      const frame = this.queue.shift()!;
      this.queued.delete(frame);
      this.fetching.add(frame);
      fetch(frameUrl(frame, this.variant), { signal: this.controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.blob();
        })
        .then((blob) => {
          this.blobs.set(frame, blob);
          this.fetching.delete(frame);
          if (this.pinned.has(frame) || Math.abs(frame - this.playhead) <= decodeAhead * this.step) this.decodeQueue.push(frame);
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
    const limit = maxBitmaps[this.variant];
    if (this.bitmaps.size <= limit) return;
    const farthest = [...this.bitmaps.keys()].filter((frame) => !this.pinned.has(frame)).sort((a, b) => Math.abs(b - this.playhead) - Math.abs(a - this.playhead));
    for (const frame of farthest.slice(0, Math.max(0, this.bitmaps.size - limit))) {
      this.bitmaps.get(frame)?.close();
      this.bitmaps.delete(frame);
    }
  }

  dispose() {
    this.controller.abort();
    this.bitmaps.forEach((bitmap) => bitmap.close());
    this.bitmaps.clear();
    this.blobs.clear();
    this.queue = [];
    this.decodeQueue = [];
  }
}
