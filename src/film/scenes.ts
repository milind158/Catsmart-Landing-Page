// Frame numbers match the files from tools/film/film.py and tools/film/encode.sh: change them together.
export type Variant = "desktop" | "mobile";

export const variants: Record<Variant, { step: number; width: number; height: number }> = {
  desktop: { step: 1, width: 1920, height: 1080 },
  mobile: { step: 2, width: 720, height: 1280 },
};

export const filmLastFrame = 991;
export const revealEndFrame = 71;
// Only the odd numbers exist: the turn follows a pointer, not scroll, so it needs fewer images.
export const turnFrames = { first: 1001, center: 1017, last: 1033, step: 2 };

const scenes = [
  { id: "reveal", first: 1, last: 71 },
  { id: "teardown", first: 72, last: 231 },
  { id: "light", first: 232, last: 391 },
  { id: "technologies", first: 392, last: 691 },
  { id: "screen", first: 692, last: 831 },
  { id: "close", first: 832, last: 991 },
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

export const frameUrl = (frame: number, variant: Variant) =>
  `/film/${sceneFor(frame).id}/${variant}/${String(frame).padStart(4, "0")}.webp`;

// Each chapter of the page plays one stretch of the film. Length is in viewport heights of scroll.
export type ChapterTiming = { length: number; from: number; to: number };

const technologyFrames = 50;
export const chapterTiming = {
  reveal: { length: 70, from: revealEndFrame, to: 73 },
  teardown: { length: 210, from: 73, to: 231 },
  light: { length: 180, from: 233, to: 391 },
  technology: (index: number): ChapterTiming => ({ length: 75, from: 393 + index * technologyFrames, to: 393 + (index + 1) * technologyFrames }),
  screen: { length: 80, from: 693, to: 791 },
  product: { length: 60, from: 791, to: 791 },
  screenExit: { length: 30, from: 791, to: 831 },
  close: { length: 140, from: 833, to: filmLastFrame },
} satisfies Record<string, ChapterTiming | ((index: number) => ChapterTiming)>;

// The last frames climb into daylight; the page finishes the step with its own exact ivory.
export const daylightFrames = { first: 947, solidNav: 967, last: filmLastFrame };

// The five layers of the teardown, in signal order. Text is from the OAIC overview in technologyDetails.ts.
export const signalStages = [
  { id: "detection", label: "Detection" },
  { id: "conditioning", label: "Conditioning" },
  { id: "processing", label: "Processing" },
  { id: "digitisation", label: "Digitisation" },
  { id: "transmission", label: "Transmission" },
] as const;
export const stageBeats = { first: 169, step: 12 };
