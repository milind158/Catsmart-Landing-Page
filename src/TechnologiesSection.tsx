import FilmScene from "./film/FilmScene";
import { chapterTiming } from "./film/scenes";
import { technologies, technologyRoute } from "./technologies";

export default function TechnologiesSection() {
  return (
    <>
      {technologies.map((technology, index) => (
        <FilmScene key={technology.id} chapter={`technology-${index}`} group="technologies" anchorId={index === 0 ? "technologies" : undefined} poster={technology.id} timing={chapterTiming.technology(index)}>
          <div data-film-text data-in={index === 0 ? "0.02" : "0.1"} data-out="0.86" className="film-copy justify-end">
            <div className="film-container w-full pb-10 md:pb-14">
              {index === 0 ? <h2 className="eyebrow text-brass">Our Technologies</h2> : <p aria-hidden="true" className="eyebrow text-brass">Our Technologies</p>}
              <div className="mt-2 flex items-baseline gap-3 text-xs font-medium tabular-nums tracking-[0.14em] text-ivory/70">
                <span>{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true">/</span><span>{String(technologies.length).padStart(2, "0")}</span>
              </div>
              <h3 className="film-display mt-4">{technology.heading}</h3>
              <div className="mt-5 grid gap-5 md:mt-8 md:grid-cols-12 md:gap-x-8">
                <div className="md:col-span-5">
                  <p className="text-lg leading-7 text-ivory md:text-xl md:leading-8">{technology.supportingText}</p>
                  <a href={technologyRoute(technology.id)} className="group mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass md:mt-5">
                    <span className="link-draw">Learn More<span className="sr-only"> about {technology.heading}</span></span>
                    <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
                  </a>
                </div>
                <div className="film-extra md:col-span-6 md:col-start-7">
                  <p className="text-[0.9375rem] leading-7 text-ivory/85">{technology.introduction}</p>
                  <ul className="mt-3 grid list-disc gap-x-8 gap-y-1 pl-5 text-[0.875rem] leading-6 text-ivory/85 marker:text-brass lg:grid-cols-2">
                    {technology.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FilmScene>
      ))}
    </>
  );
}
