import { useEffect, useRef, useState } from "react";
import { watchScroll } from "./scrollProgress";
import { softwareProducts } from "./softwareProducts";

const products = softwareProducts.filter((product) => product.enabled).sort((a, b) => a.displayOrder - b.displayOrder);

// On wide screens the section pins and the products take turns as you scroll. Within each product's turn,
// its highlights light up one at a time, with a pin on the screen where that feature can be seen.
// Without scroll effects, and on phones, they are a plain list of cards.
export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ active: 0, step: 0 });

  useEffect(() => {
    const section = sectionRef.current!;
    return watchScroll(section, "pinned", (progress) => {
      section.style.setProperty("--p", String(progress));
      const scaled = progress * products.length;
      const active = Math.min(products.length - 1, Math.floor(scaled));
      const steps = products[active].highlights.length;
      const step = Math.min(steps - 1, Math.floor((scaled - active) * steps));
      setPosition((current) => (current.active === active && current.step === step ? current : { active, step }));
    });
  }, []);

  // Jump to the start of a product's turn in the pinned showcase.
  const goTo = (index: number) => {
    const section = sectionRef.current!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((index + 0.02) / products.length) * range, behavior: "smooth" });
  };

  const { active, step } = position;

  return (
    <section ref={sectionRef} id="products" className="showcase" style={{ "--count": products.length } as React.CSSProperties} aria-labelledby="products-heading">
      <div className="showcase-pin">
        <div className="site-container showcase-inner">
          <div className="showcase-head">
            <p className="eyebrow text-gold-ink">Products</p>
            <h2 id="products-heading" className="section-heading">Our Software</h2>
            <ol className="showcase-index" aria-label="Jump to a product">
              {products.map((product, index) => (
                <li key={product.id} data-active={index === active}>
                  <button type="button" onClick={() => goTo(index)} aria-current={index === active ? "step" : undefined}>
                    <span className="showcase-index-number">{String(index + 1).padStart(2, "0")}</span>{product.name}
                  </button>
                </li>
              ))}
            </ol>
            <div className="showcase-progress" aria-hidden="true"><span /></div>
          </div>

          <ul className="showcase-items">
            {products.map((product, index) => {
              const spots = product.image.spots;
              const isActive = index === active;
              const spot = isActive ? spots?.[step] : undefined;
              return (
                <li key={product.id} className="showcase-item" data-active={isActive}>
                  <a href={product.route} className="group grid gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold-ink lg:gap-8">
                    {/* PLACEHOLDER image until real product screenshots are supplied. */}
                    <div className="screen-frame">
                      <div aria-hidden="true" className="screen-frame-bar"><span /><span /><span /></div>
                      {spots ? (
                        <div className="tour-view">
                          <div
                            className="tour-stage"
                            data-zoomed={Boolean(spot)}
                            style={{ aspectRatio: `${product.image.width} / ${product.image.height}`, ...(spot && { "--sx": `${spot[0]}%`, "--sy": `${spot[1]}%` }) } as React.CSSProperties}
                          >
                            <img src={product.image.src} alt={`${product.name} screen`} width={product.image.width} height={product.image.height} loading="lazy" decoding="async" className="tour-image" />
                            {spots.map((point, pointIndex) => point && (
                              <span key={pointIndex} aria-hidden="true" className="tour-pin" data-active={isActive && pointIndex === step} style={{ left: `${point[0]}%`, top: `${point[1]}%` }}>{pointIndex + 1}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <img src={product.image.src} alt={`${product.name} screen`} width={product.image.width} height={product.image.height} loading="lazy" decoding="async" data-fit={product.image.fit} className="screen-frame-image" />
                      )}
                    </div>
                    <div className="showcase-text">
                      <div>
                        <h3 className="font-serif text-[2rem] leading-tight text-ink lg:text-[2.5rem]">{product.name}</h3>
                        <p className="mt-2 text-lg font-medium leading-7 text-ink">{product.tagline}</p>
                        <p className="mt-2 max-w-xl text-[0.9375rem] leading-6 text-ink-soft">{product.description}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink">
                          <span className="link-draw">Learn more<span className="sr-only"> about {product.name}</span></span>
                          <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                      <ol className="showcase-highlights">
                        {product.highlights.map((highlight, highlightIndex) => (
                          <li key={highlight} data-active={isActive && highlightIndex === step}>
                            <span aria-hidden="true" className="showcase-highlight-number">{highlightIndex + 1}</span>{highlight}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
