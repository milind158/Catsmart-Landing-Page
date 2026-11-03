import FilmScene from "./film/FilmScene";
import { chapterTiming, signalStages } from "./film/scenes";
import { MaskedLine, Rule, delayStyle } from "./motion";
import { technologyDetails } from "./technologyDetails";

const signalPath = technologyDetails.optoelectronics.sections[0];
const [boardOverview] = signalPath.paragraphs ?? [];
const [boardIntro, signalSequence] = boardOverview.split(/(?<=signals\.) /);

export default function HeroSection() {
  return (
    <>
      <FilmScene chapter="reveal" group="reveal" anchorId="film-reveal" poster="reveal" timing={chapterTiming.reveal}>
        <div data-film-text data-in="none" data-out="0.62" data-scrim="short" className="film-copy justify-end">
          <div className="film-container w-full pb-12 md:pb-16">
            <p data-enter="fade" className="eyebrow text-brass">Castle Advanced Technologies &amp; Systems</p>
            <h1 className="film-display mt-5 md:mt-7">
              <MaskedLine trigger="load" delay={100}>Beyond Sensing,</MaskedLine>{" "}
              <MaskedLine trigger="load" delay={220}>Into Intelligence.</MaskedLine>
            </h1>
            <Rule trigger="load" delay={350} className="mt-8 text-brass md:mt-10" />
            <div data-enter="rise" style={delayStyle(450)} className="mt-6 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <p className="text-lg leading-7 text-ivory/90 md:text-xl">From data to decisions. From insights to action.</p>
              <a href="#technologies" className="motion-hover group inline-flex min-h-12 shrink-0 items-center gap-3 border border-ivory/40 px-6 text-sm font-medium text-ivory hover:border-ivory hover:bg-ivory hover:text-studio focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
                Explore technologies <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </FilmScene>

      <FilmScene chapter="teardown" group="teardown" anchorId="film-teardown" poster="teardown" timing={chapterTiming.teardown}>
        <div data-film-text data-in="0.2" data-out="0.95" data-scrim="side" className="film-copy justify-end md:justify-center">
          <div className="film-container w-full pb-28 md:pb-0">
            <div className="max-w-[17rem] lg:max-w-sm">
              <p className="eyebrow text-brass">Optoelectronics</p>
              <h2 className="film-heading mt-4">{technologyDetails.optoelectronics.sections[1].heading}</h2>
              <p className="film-extra mt-4 text-base leading-7 text-ivory/85">{boardIntro}</p>
            </div>
          </div>
        </div>
        <ol data-film-text data-in="0.5" data-out="0.97" className="film-callouts">
          {signalStages.map(({ id, label }, index) => (
            <li key={id} data-stage={id} data-index={index} data-active="false" className="film-callout">
              <span aria-hidden="true" className="film-callout-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{label}</span>
              <span aria-hidden="true" className="film-callout-line" />
            </li>
          ))}
        </ol>
      </FilmScene>

      <FilmScene chapter="light" group="light" anchorId="film-light" poster="light" timing={chapterTiming.light}>
        <div data-film-text data-in="0.3" data-out="0.9" className="film-copy justify-end">
          <div className="film-container w-full pb-16 md:pb-20">
            <h2 className="film-display max-w-[20ch]">{signalPath.heading}</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-ivory/90 md:text-lg md:leading-8">{signalSequence}</p>
          </div>
        </div>
      </FilmScene>
    </>
  );
}
