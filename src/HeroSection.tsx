import { MaskedLine, Rule, delayStyle } from "./motion";

export default function HeroSection() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-end bg-navy text-ivory">
      <div className="site-container w-full pb-14 pt-32 md:pb-20">
        <p data-enter="fade" className="eyebrow text-brass">Castle Advanced Technologies &amp; Systems</p>
        <h1 className="mt-6 font-serif text-[clamp(2.25rem,10.5vw,6.75rem)] font-normal leading-[1.04] tracking-[-0.02em] md:mt-8">
          <MaskedLine trigger="load" delay={100}>Beyond Sensing,</MaskedLine>{" "}
          <MaskedLine trigger="load" delay={220}>Into Intelligence.</MaskedLine>
        </h1>
        <Rule trigger="load" delay={350} className="mt-10 text-brass md:mt-14" />
        <div data-enter="rise" style={delayStyle(450)} className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <p className="text-lg leading-7 text-on-navy md:text-xl">From data to decisions. From insights to action.</p>
          <a href="#technologies" className="motion-hover group inline-flex min-h-12 shrink-0 items-center gap-3 border border-line-navy px-6 text-sm font-medium text-ivory hover:border-ivory hover:bg-ivory hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
            Explore technologies <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
