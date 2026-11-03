import { MaskedLine, Rule, delayStyle } from "./motion";
import { technologies, technologyRoute } from "./technologies";

export default function TechnologiesSection() {
  return (
    <section id="technologies" className="bg-ivory py-24 text-navy md:py-36">
      <div className="site-container">
        <Rule trigger="scroll" className="text-brass" />
        <p data-reveal="fade" style={delayStyle(100)} className="eyebrow mt-8 text-brass-dark">CATS Technologies</p>
        <h2 className="mt-5 font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[1.08] tracking-[-0.015em]">
          <MaskedLine trigger="scroll" delay={150}>Our Technologies</MaskedLine>
        </h2>
        <ol className="mt-14 md:mt-20">
          {technologies.map((technology, index) => (
            <li key={technology.id} data-reveal="rise" data-stagger="" className="group relative grid gap-5 border-t border-line-ivory py-10 last:border-b md:grid-cols-12 md:gap-x-8 md:py-14">
              <span aria-hidden="true" className="text-xs font-medium tabular-nums tracking-[0.14em] text-brass-dark md:col-span-1 md:pt-2.5">{String(index + 1).padStart(2, "0")}</span>
              <div className="md:col-span-5">
                <h3 className="motion-hover font-serif text-[1.75rem] font-normal leading-[1.15] tracking-[-0.01em] group-hover:text-brass-dark md:text-4xl">{technology.heading}</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-on-ivory">{technology.supportingText}</p>
              </div>
              <div className="md:col-span-6">
                <p className="text-[0.9375rem] leading-7 text-on-ivory">{technology.introduction}</p>
                <ul className="mt-4 grid list-disc gap-1.5 pl-5 text-[0.9375rem] leading-7 text-on-ivory marker:text-brass-dark">
                  {technology.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
                {/* The link's overlay makes the whole row clickable. */}
                <a href={technologyRoute(technology.id)} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brass-dark">
                  <span className="link-draw">Learn More<span className="sr-only"> about {technology.heading}</span></span>
                  <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
