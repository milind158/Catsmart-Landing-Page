import { awards, catalogueUrl, featuredSystems } from "./sensingSystems";

// A short pointer to the CATS photonic hardware. The full range is on the CATS Global catalogue.
export default function SensingSection() {
  return (
    <section id="sensing" className="section-band" aria-labelledby="sensing-heading">
      <div className="site-container">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="eyebrow text-gold-ink">Hardware</p>
            <h2 id="sensing-heading" className="section-heading">Photonic Sensing Systems</h2>
          </div>
          <div className="md:justify-self-end">
            <p className="max-w-lg text-lg leading-8 text-ink-soft">Laser sensor systems for the environment, condition and vibration, defence and surveillance, and health.</p>
            <a href={catalogueUrl} target="_blank" rel="noopener" className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink">
              <span className="link-draw">View the full range on CATS Global</span>
              <span aria-hidden="true" className="motion-hover text-gold-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <ul className="featured-systems mt-12 md:mt-14">
          {featuredSystems.map((system) => (
            <li key={system.name} data-reveal="rise" data-stagger>
              <a href={system.href} target="_blank" rel="noopener" className="featured-system group">
                <span className="eyebrow text-ink-faint">{system.domain}</span>
                <span className="mt-6 flex items-baseline justify-between gap-3">
                  <span className="font-serif text-2xl text-ink">{system.name}</span>
                  <span aria-hidden="true" className="motion-hover text-gold-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </span>
                <span className="mt-2 block text-[0.9375rem] leading-6 text-ink-soft">{system.tagline}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-6 border-t border-line pt-10 md:mt-20 md:grid-cols-[0.6fr_1fr_1fr] md:gap-10">
          <p className="eyebrow text-gold-ink">Recognition</p>
          {awards.map((award) => (
            <div key={award.title} data-reveal="rise" data-stagger>
              <p className="font-serif text-3xl text-ink">{award.year}</p>
              <p className="mt-2 font-medium text-ink">{award.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{award.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
