// Frame numbers match the files from tools/film/film.py and tools/film/encode.sh: change them together.
export type Variant = "desktop" | "mobile";

// What plays while the film moves. Every frame number exists on disk, but every second one is plenty with cross-fading.
export const variants: Record<Variant, { step: number; width: number; height: number }> = {
  desktop: { step: 2, width: 1920, height: 1080 },
  mobile: { step: 2, width: 720, height: 1280 },
};

// Shown only when the picture is at rest: motion hides the extra detail, so it is not worth downloading while moving.
export const stillSize = { width: 3840, height: 2160 };

export const filmLastFrame = 1981;
export const revealEndFrame = 141;
// Only every fourth number exists: the turn follows a pointer, not scroll, so it needs fewer images.
export const turnFrames = { first: 2001, center: 2033, last: 2065, step: 4 };

const scenes = [
  { id: "reveal", first: 1, last: 141 },
  { id: "teardown", first: 142, last: 461 },
  { id: "light", first: 462, last: 781 },
  { id: "technologies", first: 782, last: 1381 },
  { id: "screen", first: 1382, last: 1661 },
  { id: "close", first: 1662, last: 1981 },
  { id: "turn", first: turnFrames.first, last: turnFrames.last },
];

export const sceneIds = scenes.map((scene) => scene.id);

// The film and the hero's turn are separate runs of numbers, with a gap between them.
export const isFilmFrame = (frame: number) =>
  (frame >= 1 && frame <= filmLastFrame) || (frame >= turnFrames.first && frame <= turnFrames.last && (frame - turnFrames.first) % turnFrames.step === 0);

export const stepAt = (frame: number, variant: Variant) => (frame >= turnFrames.first ? turnFrames.step : variants[variant].step);

export const sceneFor = (frame: number) => scenes.find((scene) => frame <= scene.last) ?? scenes[scenes.length - 1];

export const framesOf = (sceneId: string, variant: Variant) => {
  const scene = scenes.find((item) => item.id === sceneId)!;
  const step = stepAt(scene.first, variant);
  const frames: number[] = [];
  for (let frame = scene.first; frame <= scene.last; frame += 1) {
    if ((frame - 1) % step === 0) frames.push(frame);
  }
  return frames;
};

export const frameUrl = (frame: number, variant: Variant | "uhd") =>
  `/film/${sceneFor(frame).id}/${variant}/${String(frame).padStart(4, "0")}.webp`;

// Each chapter of the page plays one stretch of the film. Length is in viewport heights of scroll.
export type ChapterTiming = { length: number; from: number; to: number };

const technologyFrames = 100;
export const chapterTiming = {
  reveal: { length: 70, from: revealEndFrame, to: 145 },
  teardown: { length: 210, from: 145, to: 461 },
  light: { length: 180, from: 465, to: 781 },
  technology: (index: number): ChapterTiming => ({ length: 75, from: 785 + index * technologyFrames, to: 785 + (index + 1) * technologyFrames }),
  screen: { length: 80, from: 1385, to: 1581 },
  product: { length: 60, from: 1581, to: 1581 },
  screenExit: { length: 30, from: 1581, to: 1661 },
  close: { length: 140, from: 1665, to: filmLastFrame },
} satisfies Record<string, ChapterTiming | ((index: number) => ChapterTiming)>;

// The last frames climb into daylight; the page finishes the step with its own exact ivory.
export const daylightFrames = { first: 1893, solidNav: 1933, last: filmLastFrame };

// The five layers of the teardown, in signal order. Text is from the OAIC overview in technologyDetails.ts.
export const signalStages = [
  { id: "detection", label: "Detection" },
  { id: "conditioning", label: "Conditioning" },
  { id: "processing", label: "Processing" },
  { id: "digitisation", label: "Digitisation" },
  { id: "transmission", label: "Transmission" },
] as const;
export const stageBeats = { first: 337, step: 24 };
