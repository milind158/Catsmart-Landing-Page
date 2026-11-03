// Frame numbers match tools/film/film.py and tools/film/encode.sh: change them together.
export type Variant = "desktop" | "mobile";

export const variants: Record<Variant, { step: number; width: number; height: number }> = {
  desktop: { step: 1, width: 1920, height: 1080 },
  mobile: { step: 2, width: 720, height: 1280 },
};

export const filmLastFrame = 496;
export const revealEndFrame = 36;
export const turnFrames = { first: 501, center: 509, last: 517 };

const scenes = [
  { id: "reveal", first: 1, last: 36 },
  { id: "teardown", first: 37, last: 116 },
  { id: "light", first: 117, last: 196 },
  { id: "technologies", first: 197, last: 346 },
  { id: "screen", first: 347, last: 416 },
  { id: "close", first: 417, last: 496 },
  { id: "turn", first: turnFrames.first, last: turnFrames.last },
];

export const sceneIds = scenes.map((scene) => scene.id);

export const sceneFor = (frame: number) => scenes.find((scene) => frame <= scene.last) ?? scenes[scenes.length - 1];

export const framesOf = (sceneId: string, variant: Variant) => {
  const scene = scenes.find((item) => item.id === sceneId)!;
  const { step } = variants[variant];
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

const technologyFrames = 25;
export const chapterTiming = {
  reveal: { length: 90, from: revealEndFrame, to: 37 },
  teardown: { length: 300, from: 37, to: 116 },
  light: { length: 240, from: 117, to: 196 },
  technology: (index: number): ChapterTiming => ({ length: 110, from: 197 + index * technologyFrames, to: 197 + (index + 1) * technologyFrames }),
  screen: { length: 110, from: 347, to: 396 },
  product: { length: 80, from: 396, to: 396 },
  screenExit: { length: 40, from: 396, to: 416 },
  close: { length: 180, from: 417, to: filmLastFrame },
} satisfies Record<string, ChapterTiming | ((index: number) => ChapterTiming)>;

// The last frames climb into daylight; the page finishes the step with its own exact ivory.
export const daylightFrames = { first: 480, last: filmLastFrame };

// The five layers of the teardown, in signal order. Text is from the OAIC overview in technologyDetails.ts.
export const signalStages = [
  { id: "detection", label: "Detection" },
  { id: "conditioning", label: "Conditioning" },
  { id: "processing", label: "Processing" },
  { id: "digitisation", label: "Digitisation" },
  { id: "transmission", label: "Transmission" },
] as const;
export const stageBeats = { first: 85, step: 6 };

export const filmChapters = [
  { id: "reveal", label: "Reveal", href: "#film-reveal" },
  { id: "teardown", label: "Teardown", href: "#film-teardown" },
  { id: "light", label: "Light", href: "#film-light" },
  { id: "technologies", label: "Technologies", href: "#technologies" },
  { id: "software", label: "Software", href: "#products" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const;

export type FilmChapterId = (typeof filmChapters)[number]["id"];
