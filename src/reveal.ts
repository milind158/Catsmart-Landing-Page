declare global {
  interface Window {
    __revealsStarted?: boolean;
  }
}

const maxStaggeredItems = 5;

// Marks [data-reveal] elements as they scroll into view; index.css holds the animation itself.
// Items marked data-stagger that arrive together step in one after another, up to a limit.
export function startReveals() {
  window.__revealsStarted = true;

  const observer = new IntersectionObserver((entries) => {
    let staggerIndex = 0;
    for (const entry of entries) {
      // Elements already scrolled past, for example after a deep link, reveal without waiting.
      if (!entry.isIntersecting && entry.boundingClientRect.bottom > 0) continue;
      const element = entry.target as HTMLElement;
      if (element.hasAttribute("data-stagger")) {
        element.style.setProperty("--step", String(Math.min(staggerIndex, maxStaggeredItems)));
        staggerIndex += 1;
      }
      element.setAttribute("data-revealed", "");
      observer.unobserve(element);
    }
  }, { rootMargin: "0px 0px -8% 0px" });

  // In the film, scroll itself moves the chapter text. Without it, chapters fade in like everything else.
  const filmOn = document.documentElement.classList.contains("film-on");
  document.querySelectorAll(`[data-reveal]:not([data-revealed])${filmOn ? "" : ", [data-film-text]:not([data-revealed])"}`).forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}
