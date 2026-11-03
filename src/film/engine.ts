import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anchors from "./anchors.json";
import { FrameSequence } from "./frameSequence";
import { daylightFrames, filmLastFrame, framesOf, revealEndFrame, sceneFor, sceneIds, signalStages, stageBeats, turnFrames, variants, type Variant } from "./scenes";

gsap.registerPlugin(ScrollTrigger);

type Segment = { element: HTMLElement; top: number; bottom: number; from: number; to: number };
type Anchors = { firstFrame: number; screen: number[]; stages: Record<string, number[][]> };

const pickVariant = (): Variant => (window.innerWidth < 768 || window.innerWidth / window.innerHeight < 1 ? "mobile" : "desktop");
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const revealSeconds = 1.3;
const posterAfterMs = 2500;

// Drives the film: maps scroll to a frame, draws it, and places everything attached to the picture.
export function startFilm(root: HTMLElement, onFailure: () => void) {
  const stage = root.querySelector<HTMLElement>(".film-stage")!;
  const poster = root.querySelector<HTMLElement>(".film-stage-poster")!;
  const daylight = root.querySelector<HTMLElement>(".film-daylight")!;
  const chapters = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
  const callouts = [...root.querySelectorAll<HTMLElement>("[data-stage]")];
  const progressCells = [...document.querySelectorAll<HTMLElement>("[data-progress-cell]")];

  const canvas = document.createElement("canvas");
  canvas.className = "film-canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.prepend(canvas);
  const context = canvas.getContext("2d", { alpha: false })!;

  let variant = pickVariant();
  let segments: Segment[] = [];
  let stageWidth = 0;
  let stageHeight = 0;
  let cover = { x: 0, y: 0, width: 0, height: 0 };
  let needsDraw = true;
  let revealDone = false;
  let failed = false;

  const playhead = { frame: 1 };
  const pointer = { turn: 0 };
  const moveTo = gsap.quickTo(playhead, "frame", { duration: 0.45, ease: "power3.out" });
  const turnTo = gsap.quickTo(pointer, "turn", { duration: 0.7, ease: "power3.out" });

  const onFrameReady = () => {
    needsDraw = true;
  };
  const onFrameFailed = (frame: number) => {
    // A missing frame deep in the film is survivable; losing the opening is not.
    if (frame > revealEndFrame || failed) return;
    failed = true;
    onFailure();
  };
  let sequence = new FrameSequence(variant, onFrameReady, onFrameFailed);

  function measure() {
    stageWidth = stage.clientWidth;
    stageHeight = stage.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(stageWidth * ratio);
    canvas.height = Math.round(stageHeight * ratio);

    const source = variants[variant];
    const scale = Math.max(canvas.width / source.width, canvas.height / source.height);
    const width = source.width * scale;
    const height = source.height * scale;
    cover = { x: (canvas.width - width) / 2, y: (canvas.height - height) / 2, width, height };

    const scrollY = window.scrollY;
    segments = chapters.map((element, index) => {
      const top = element.getBoundingClientRect().top + scrollY;
      const next = chapters[index + 1];
      const bottom = next ? next.getBoundingClientRect().top + scrollY : top + element.offsetHeight - stageHeight;
      return { element, top, bottom, from: Number(element.dataset.from), to: Number(element.dataset.to) };
    });

    placeScreen();
    needsDraw = true;
  }

  // The fractions come from the Blender camera, so page elements line up with the rendered picture.
  function toStage(x: number, y: number) {
    const ratio = stageWidth / canvas.width;
    return { x: (cover.x + x * cover.width) * ratio, y: (cover.y + y * cover.height) * ratio };
  }

  function placeScreen() {
    const [x, y, width, height] = (anchors as Record<Variant, Anchors>)[variant].screen;
    const topLeft = toStage(x, y);
    const bottomRight = toStage(x + width, y + height);
    root.style.setProperty("--screen-x", `${topLeft.x}px`);
    root.style.setProperty("--screen-y", `${topLeft.y}px`);
    root.style.setProperty("--screen-w", `${bottomRight.x - topLeft.x}px`);
    root.style.setProperty("--screen-h", `${bottomRight.y - topLeft.y}px`);
  }

  function frameForScroll(scrollY: number) {
    for (const segment of segments) {
      if (scrollY < segment.bottom) {
        const t = clamp01((scrollY - segment.top) / (segment.bottom - segment.top));
        return segment.from + (segment.to - segment.from) * t;
      }
    }
    return filmLastFrame;
  }

  function drawCover(bitmap: ImageBitmap, alpha: number) {
    context.globalAlpha = alpha;
    context.drawImage(bitmap, cover.x, cover.y, cover.width, cover.height);
  }

  function drawFrame(frame: number) {
    const low = sequence.snap(frame);
    const base = sequence.nearest(low);
    if (!base) return false;
    drawCover(base, 1);
    // A cross-fade to the next frame keeps slow scrolling from stepping visibly.
    const high = low + sequence.step;
    const mix = (frame - low) / sequence.step;
    const next = sequence.bitmapAt(high);
    if (next && mix > 0.02 && sequence.bitmapAt(low) === base) drawCover(next, mix);
    return true;
  }

  function currentFrame() {
    // At the top of the page the hero follows the pointer, using its own short turn sequence.
    const turnWeight = revealDone ? clamp01(1 - window.scrollY / (stageHeight * 0.35)) : 0;
    if (turnWeight > 0 && Math.abs(pointer.turn) > 0.01) {
      const turned = turnFrames.center + pointer.turn * turnWeight * (turnFrames.last - turnFrames.center);
      if (sequence.isDecoded(sequence.snap(turned))) return turned;
    }
    return playhead.frame;
  }

  function updateCallouts(frame: number) {
    if (!callouts.length) return;
    const data = (anchors as Record<Variant, Anchors>)[variant];
    const lastIndex = data.stages[signalStages[0].id].length - 1;
    const index = Math.min(lastIndex, Math.max(0, Math.round(frame) - data.firstFrame));
    for (const callout of callouts) {
      const stageIndex = Number(callout.dataset.index);
      const beat = stageBeats.first + stageIndex * stageBeats.step;
      const arrived = clamp01((frame - beat + 2) / 3);
      const active = frame >= beat - 2 && frame < beat + stageBeats.step - 2;
      const point = data.stages[callout.dataset.stage!][index];
      const anchor = toStage(point[0], point[1]);
      callout.style.setProperty("--anchor-x", `${anchor.x}px`);
      callout.style.setProperty("--anchor-y", `${anchor.y}px`);
      callout.style.setProperty("--arrived", String(arrived));
      callout.dataset.active = String(active || (stageIndex === signalStages.length - 1 && frame >= beat));
    }
  }

  function updateProgress(scrollY: number) {
    for (const cell of progressCells) {
      const group = segments.filter((segment) => segment.element.dataset.group === cell.dataset.progressCell);
      if (!group.length) continue;
      const start = group[0].top;
      const end = group[group.length - 1].bottom;
      const local = clamp01((scrollY - start) / (end - start));
      cell.style.setProperty("--fill", String(local));
      cell.dataset.active = String(scrollY >= start && scrollY < end);
    }
  }

  let lastDrawn = -1;
  let lastSnapped = -1;
  function tick() {
    const frame = currentFrame();
    const snapped = sequence.snap(frame);
    if (snapped !== lastSnapped) {
      lastSnapped = snapped;
      sequence.setPlayhead(snapped);
      sequence.loadScene(sceneFor(snapped).id, true);
    }
    if (!needsDraw && Math.abs(frame - lastDrawn) < 0.01) return;
    needsDraw = false;
    if (drawFrame(frame)) {
      lastDrawn = frame;
      if (poster.dataset.visible === "true" && frame >= revealEndFrame) poster.dataset.visible = "false";
    }
    updateCallouts(frame);
    daylight.style.opacity = String(clamp01((frame - daylightFrames.first) / (daylightFrames.last - daylightFrames.first)));
  }

  function onScroll() {
    const scrollY = window.scrollY;
    updateProgress(scrollY);
    const last = segments[segments.length - 1];
    if (last) document.documentElement.dataset.navSolid = String(scrollY > last.bottom + stageHeight - 64);
    if (!revealDone) return;
    moveTo(frameForScroll(scrollY));

    // Start the next chapter's frames when it is one viewport away.
    const upcoming = sceneFor(Math.min(filmLastFrame, frameForScroll(scrollY + stageHeight)));
    sequence.loadScene(upcoming.id);
  }

  function onPointerMove(event: PointerEvent) {
    if (!revealDone || event.pointerType !== "mouse" || window.scrollY > stageHeight * 0.35) return;
    turnTo(clamp01(event.clientX / window.innerWidth) * 2 - 1);
  }

  function onResize() {
    const next = pickVariant();
    if (next !== variant) {
      variant = next;
      sequence.dispose();
      sequence = new FrameSequence(variant, onFrameReady, onFrameFailed);
      sequence.loadScene(sceneFor(Math.round(playhead.frame)).id, true);
      lastSnapped = -1;
    }
    measure();
    onScroll();
  }

  // Text arrives and leaves with scroll. Links stay reachable: focusing one brings its chapter on screen.
  function buildTextTimelines() {
    for (const [index, element] of chapters.entries()) {
      const end = () => `+=${(segments[index]?.bottom ?? 0) - (segments[index]?.top ?? 0)}`;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: element, start: "top top", end, scrub: true, toggleClass: { targets: element, className: "is-active" } },
      });
      element.querySelectorAll<HTMLElement>("[data-film-text]").forEach((text) => {
        const entry = text.dataset.in ?? "0.06";
        const exit = Number(text.dataset.out ?? 0.92);
        if (entry === "none") gsap.set(text, { opacity: 1, y: 0 });
        else timeline.fromTo(text, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.08 }, Number(entry));
        timeline.to(text, { opacity: 0, y: -44, duration: Math.min(0.08, 1 - exit) }, exit);
      });
      // Keeps the timeline's length at exactly the chapter's length.
      timeline.set({}, {}, 1);
    }
  }

  function onFocusIn(event: FocusEvent) {
    const chapter = (event.target as HTMLElement).closest<HTMLElement>("[data-chapter]");
    const segment = segments.find((item) => item.element === chapter);
    if (!segment) return;
    const middle = segment.top + (segment.bottom - segment.top) * 0.45;
    window.scrollTo({ top: middle, behavior: "instant" });
  }

  function playReveal() {
    const atTop = window.scrollY < 8 && !window.location.hash;
    if (!atTop) {
      finishReveal();
      return;
    }
    // Its own object: a tween on the playhead itself would fight the scroll tween that takes over after.
    const intro = { frame: 1 };
    gsap.to(intro, {
      frame: revealEndFrame,
      duration: revealSeconds,
      ease: "power2.out",
      onUpdate: () => {
        playhead.frame = intro.frame;
      },
      onComplete: finishReveal,
    });
  }

  function finishReveal() {
    if (revealDone) return;
    revealDone = true;
    sequence.unpin();
    moveTo(frameForScroll(window.scrollY), playhead.frame);
    onScroll();
    sequence.loadScene("turn");
    sequence.loadKeyFrames(sceneIds);
  }

  measure();
  const animations = gsap.context(buildTextTimelines);
  gsap.ticker.add(tick);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  root.addEventListener("focusin", onFocusIn);
  ScrollTrigger.addEventListener("refresh", measure);
  ScrollTrigger.refresh();
  onScroll();

  // Show the finished hero rather than a black screen if the opening frames are slow to arrive.
  const posterTimer = window.setTimeout(() => {
    if (!revealStarted) poster.dataset.visible = "true";
  }, posterAfterMs);

  // The reveal waits until its frames are in hand, so it plays through instead of stuttering.
  let revealStarted = false;
  const openingFrames = framesOf("reveal", variant);
  sequence.loadScene("reveal", true);
  sequence.pin(openingFrames);
  const startWhenReady = () => {
    if (revealStarted) return;
    const ready = openingFrames.filter((frame) => sequence.isDecoded(frame)).length;
    if (ready < openingFrames.length * 0.9) return;
    revealStarted = true;
    gsap.ticker.remove(startWhenReady);
    playReveal();
  };
  gsap.ticker.add(startWhenReady);

  return () => {
    window.clearTimeout(posterTimer);
    gsap.ticker.remove(tick);
    gsap.ticker.remove(startWhenReady);
    gsap.killTweensOf(playhead);
    gsap.killTweensOf(pointer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("focusin", onFocusIn);
    ScrollTrigger.removeEventListener("refresh", measure);
    // Removes every inline style too, so the poster version of the page starts clean.
    animations.revert();
    delete document.documentElement.dataset.navSolid;
    sequence.dispose();
    canvas.remove();
  };
}
