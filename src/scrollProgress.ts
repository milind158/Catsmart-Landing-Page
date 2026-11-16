// Scroll-linked effects, without a library. One shared listener, run once per frame.
// Effects run only when the page allows motion (the scroll-fx class set in index.html);
// otherwise every section shows its finished state.

type Mode = "pinned" | "through" | "leaving";
type Watcher = { element: HTMLElement; mode: Mode; update: (progress: number) => void };

const watchers = new Set<Watcher>();
let frame = 0;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function measure() {
  frame = 0;
  const viewport = window.innerHeight;
  for (const { element, mode, update } of watchers) {
    const rect = element.getBoundingClientRect();
    // pinned: 0 when the section's top reaches the top of the screen, 1 when its bottom reaches the bottom.
    // through: 0 when the section enters at the bottom of the screen, 1 when it leaves at the top.
    // leaving: 0 while the section's top is at the top of the screen, 1 once it has scrolled fully away.
    const progress =
      mode === "pinned" ? -rect.top / Math.max(1, rect.height - viewport)
      : mode === "leaving" ? -rect.top / Math.max(1, rect.height)
      : (viewport - rect.top) / (viewport + rect.height);
    update(clamp(progress));
  }
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(measure);
};

export const scrollEffectsOn = () => typeof document !== "undefined" && document.documentElement.classList.contains("scroll-fx");

export function watchScroll(element: HTMLElement, mode: Mode, update: (progress: number) => void) {
  if (!scrollEffectsOn()) return () => {};
  const watcher = { element, mode, update };
  watchers.add(watcher);
  if (watchers.size === 1) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
  return () => {
    watchers.delete(watcher);
    if (watchers.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}
