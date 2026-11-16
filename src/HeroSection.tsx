import { useEffect, useRef } from "react";
import { delayStyle } from "./motion";
import { watchScroll } from "./scrollProgress";
import { softwareProducts } from "./softwareProducts";

const primaryButton = "motion-hover inline-flex min-h-12 items-center gap-3 bg-ink px-6 text-sm font-medium text-paper hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink";
const secondaryButton = "motion-hover inline-flex min-h-12 items-center gap-3 border border-ink/30 px-6 text-sm font-medium text-ink hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink";

// Three product screens drift at different speeds as the hero scrolls away.
const collage = ["sarathi", "vidur-raksha", "trinetra"].map((id) => softwareProducts.find((product) => product.id === id)!);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    return watchScroll(section, "leaving", (progress) => section.style.setProperty("--hero-p", String(progress)));
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-heading">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p data-enter="fade" className="eyebrow text-gold-ink">Castle Advanced Technologies &amp; Systems</p>
          <h1 id="hero-heading" data-enter="rise" style={delayStyle(80)} className="hero-heading mt-5">Beyond Sensing, Into Intelligence.</h1>
          <p data-enter="rise" style={delayStyle(200)} className="mt-6 max-w-md text-lg leading-8 text-ink-soft md:text-xl">From data to decisions. From insights to action.</p>
          <div data-enter="rise" style={delayStyle(300)} className="mt-9 flex flex-wrap gap-3">
            <a href="#products" className={primaryButton}>See products <span aria-hidden="true">→</span></a>
            <a href="#contact" className={secondaryButton}>Contact us</a>
          </div>
        </div>
        <div className="hero-collage" aria-hidden="true">
          {collage.map((product, index) => (
            <div key={product.id} data-enter="rise" style={delayStyle(260 + index * 120)} className={`hero-screen hero-screen-${index + 1}`}>
              <div className="screen-frame">
                <div className="screen-frame-bar"><span /><span /><span /></div>
                <img src={product.image.src} alt="" width={product.image.width} height={product.image.height} decoding="async" fetchPriority={index === 0 ? "high" : "auto"} className="screen-frame-image" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <a href="#statement" className="hero-cue" aria-label="Scroll to the next section"><span aria-hidden="true" /></a>
    </section>
  );
}
