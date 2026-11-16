import { technologies, technologyRoute } from "./technologies";
import { technologyHeroImages } from "./technologyDetails";

// Each card sticks a little lower than the one before, so they stack as you scroll. Pure CSS.
export default function TechnologiesSection() {
  return (
    <section id="technologies" className="section-band bg-paper-deep" aria-labelledby="technologies-heading">
      <div className="site-container">
        <div className="section-head">
          <p className="eyebrow text-gold-ink">Technologies</p>
          <h2 id="technologies-heading" className="section-heading">Our Technologies</h2>
        </div>
        <ul className="stack mt-10 md:mt-14">
          {technologies.map((technology, index) => (
            <li key={technology.id} className="stack-card" style={{ "--i": index } as React.CSSProperties}>
              <div className="stack-text">
                <p className="eyebrow text-ink-faint"><span className="text-gold-ink">{String(index + 1).padStart(2, "0")}</span> / {String(technologies.length).padStart(2, "0")}</p>
                <h3 className="mt-5 font-serif text-[2rem] leading-tight text-ink md:text-[2.75rem]">{technology.heading}</h3>
                <p className="mt-4 text-lg leading-7 text-ink">{technology.supportingText}</p>
                <ul className="mt-5 hidden gap-2 text-[0.9375rem] leading-6 text-ink-soft md:grid">
                  {technology.capabilities.map((capability) => <li key={capability} className="stack-capability">{capability}</li>)}
                </ul>
                <a href={technologyRoute(technology.id)} className="group mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink">
                  <span className="link-draw">Learn more<span className="sr-only"> about {technology.heading}</span></span>
                  <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
                </a>
              </div>
              {/* PLACEHOLDER image until real photos are supplied. */}
              <div aria-hidden="true" className="stack-image" style={{ backgroundImage: `url("${technologyHeroImages[technology.id].src}")` }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
