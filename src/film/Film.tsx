import { useEffect, useRef, type ReactNode } from "react";
import { startReveals } from "../reveal";
import { filmChapters } from "./scenes";

export default function Film({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("film-on")) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    // Falls back to the poster version of the page, with all the same content, if the film cannot start.
    const leaveFilmMode = () => {
      stop?.();
      stop = undefined;
      document.documentElement.classList.remove("film-on");
      startReveals();
    };
    // Loaded here so the poster version of the page never downloads the animation code.
    import("./engine")
      .then(({ startFilm }) => {
        if (!cancelled) stop = startFilm(rootRef.current!, leaveFilmMode);
      })
      .catch(leaveFilmMode);
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="film">
      <div aria-hidden="true" className="film-stage-track">
        <div className="film-stage">
          <picture className="film-stage-poster-wrap">
            <source media="(max-width: 767px)" srcSet="/film/posters/mobile/reveal.webp" />
            <img className="film-stage-poster" data-visible="false" src="/film/posters/desktop/reveal.webp" alt="" />
          </picture>
          <div className="film-scrim" />
          <div className="film-daylight" />
        </div>
      </div>
      <div className="film-chapters">{children}</div>
    </div>
  );
}

export function FilmProgress() {
  return (
    <nav aria-label="Film chapters" className="film-progress">
      <ol>
        {filmChapters.map(({ id, label, href }) => (
          <li key={id}>
            <a href={href} data-progress-cell={id} className="film-progress-cell">
              <span aria-hidden="true" className="film-progress-track" />
              <span className="film-progress-label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
