import type { CSSProperties, ReactNode } from "react";
import type { FilmChapterId } from "./scenes";

type FilmSceneProps = {
  chapter: string;
  group: FilmChapterId;
  anchorId?: string;
  poster?: string;
  timing: { length: number; from: number; to: number };
  showsDevice?: boolean;
  children: ReactNode;
};

// One chapter of the film. All of its text is real HTML rendered at build time, and the poster
// stands in for the film when it does not run: no JavaScript, reduced motion or Save-Data.
export default function FilmScene({ chapter, group, anchorId, poster, timing, showsDevice = false, children }: FilmSceneProps) {
  return (
    <section
      id={anchorId}
      data-chapter={chapter}
      data-group={group}
      data-from={timing.from}
      data-to={timing.to}
      style={{ "--length": timing.length } as CSSProperties}
      className="film-scene"
    >
      {poster && (
        <picture className="film-poster">
          <source media="(max-width: 767px)" srcSet={`/film/posters/mobile/${poster}.webp`} width={720} height={1280} />
          <img src={`/film/posters/desktop/${poster}.webp`} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
        </picture>
      )}
      <div className="film-scene-body">
        {children}
        {/* PLACEHOLDER: remove this tag when the real device replaces the stand-in. See tools/film/film.py. */}
        {showsDevice && <p className="film-stand-in">Stand-in device. Not CATS hardware.</p>}
      </div>
    </section>
  );
}
