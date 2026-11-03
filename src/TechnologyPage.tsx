import ContactSection from "./ContactSection";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";
import { MaskedLine, delayStyle } from "./motion";
import { type Technology, technologies, technologyRoute } from "./technologies";
import { technologyDetails, technologyHeroImages } from "./technologyDetails";

const sectionClass = "mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28";
const eyebrowClass = "text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent-red)]";

export default function TechnologyPage({ technology }: { technology: Technology }) {
  const detail = technologyDetails[technology.id];
  const heroImage = technologyHeroImages[technology.id];

  return (
    <main className="product-page min-h-screen overflow-hidden bg-[var(--site-background)] text-white">
      <SiteNavigation showBack />
      <section className="relative isolate min-h-[68vh] overflow-hidden border-y border-white/10 bg-[#141414] md:min-h-[76vh]">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[#141414] bg-cover"
          style={{ backgroundImage: `url("${heroImage.src}")`, backgroundPosition: heroImage.position }}
        />
        <div aria-hidden="true" className="technology-hero-overlay pointer-events-none absolute inset-0 z-[1]" />
        <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-7xl items-center px-6 pb-16 pt-28 md:min-h-[76vh] md:px-10 md:py-28">
          <div className="max-w-4xl">
            <h1 className="text-gradient-primary detail-hero-title break-words text-5xl md:text-7xl lg:text-8xl"><MaskedLine trigger="load">{technology.heading}</MaskedLine></h1>
            <p data-enter="rise" style={delayStyle(200)} className="mt-6 max-w-2xl text-xl leading-snug text-[var(--subheading)] md:text-2xl">{technology.supportingText}</p>
            <p data-enter="rise" style={delayStyle(320)} className="mt-5 max-w-2xl text-base leading-7 text-[var(--body-copy)]">{detail.introduction}</p>
          </div>
        </div>
      </section>

      {detail.sections.map((section, sectionIndex) => <section key={section.label} className={`${sectionIndex % 2 === 1 ? "border-y border-white/10 bg-[#070707]" : ""}`}>
        <div className={sectionClass}>
          <p className={eyebrowClass}>{section.label}</p>
          {section.heading && <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{section.heading}</h2>}
          {section.paragraphs && <div className="mt-6 grid gap-5">{section.paragraphs.map((paragraph) => <p key={paragraph} className="max-w-4xl text-base leading-8 text-[var(--body-copy)] md:text-lg">{paragraph}</p>)}</div>}
          {section.features && <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-2">{section.features.map((feature, index) => <article key={feature.title} className={`${sectionIndex % 2 === 1 ? "bg-[#070707]" : "bg-[var(--site-background)]"} min-h-44 p-6 md:p-8`}>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--accent-red)]">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--body-copy)]">{feature.description}</p>
          </article>)}</div>}
          {section.groups && <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">{section.groups.map((group) => <article key={group.title} className="border-t border-white/15 pt-5">
            <h3 className="text-lg font-bold text-[var(--subheading)]">{group.title}</h3>
            <ul className="mt-4 grid list-disc gap-3 pl-5 text-sm leading-6 text-[var(--body-copy)] marker:text-[var(--accent-red)]">{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>)}</div>}
          {section.items && <ul className="mt-8 grid list-disc gap-3 pl-5 text-base leading-7 text-[var(--body-copy)] marker:text-[var(--accent-red)] sm:grid-cols-2">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
        </div>
      </section>)}

      <section className={sectionClass}>
        <p className={eyebrowClass}>Continue exploring</p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Explore more CATS technologies.</h2>
        <nav aria-label="Other technologies" className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
          {technologies.filter((item) => item.id !== technology.id).map((item) => <a key={item.id} href={technologyRoute(item.id)} className="text-sm font-semibold text-[#d8d8d8] underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8d8d8]">{item.heading} <span aria-hidden="true">→</span></a>)}
        </nav>
      </section>
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
