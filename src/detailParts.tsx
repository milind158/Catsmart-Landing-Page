import type { ReactNode } from "react";
import { delayStyle } from "./motion";

// Shared pieces for the software and technology pages, in the same light style as the homepage.

export const bodyText = "text-base leading-7 text-ink-soft md:text-[1.0625rem] md:leading-8";

export function DetailHero({ kind, title, tagline, introduction, image }: {
  kind: string;
  title: string;
  tagline: string;
  introduction: string;
  image: { src: string; alt: string; width?: number; height?: number; fit?: "contain" };
}) {
  return (
    <section className="detail-hero" aria-labelledby="detail-heading">
      <div className="site-container grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="min-w-0">
          <p data-enter="fade" className="eyebrow text-gold-ink">{kind}</p>
          <h1 id="detail-heading" data-enter="rise" style={delayStyle(80)} className="detail-heading mt-5 break-words">{title}</h1>
          <p data-enter="rise" style={delayStyle(200)} className="mt-6 max-w-xl text-xl leading-snug text-ink md:text-2xl">{tagline}</p>
          <p data-enter="rise" style={delayStyle(300)} className={`mt-5 max-w-xl ${bodyText}`}>{introduction}</p>
        </div>
        <div data-enter="rise" style={delayStyle(260)} className="min-w-0">
          <div className="screen-frame">
            <div aria-hidden="true" className="screen-frame-bar"><span /><span /><span /></div>
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" fetchPriority="high" data-fit={image.fit} className="screen-frame-image" />
          </div>
        </div>
      </div>
    </section>
  );
}

// A page section. Every other one sits on a lighter band so long pages keep their rhythm.
export function DetailSection({ label, heading, banded, children }: { label: string; heading?: string; banded: boolean; children: ReactNode }) {
  return (
    <section className={`section-band${banded ? " detail-band" : ""}`}>
      <div className="site-container">
        <p data-reveal="fade" className="eyebrow text-gold-ink">{label}</p>
        {heading && <h2 data-reveal="fade" className="section-heading max-w-3xl">{heading}</h2>}
        {children}
      </div>
    </section>
  );
}

export function NumberedGrid({ items, columns = 3 }: { items: { title: string; description: string }[]; columns?: 2 | 3 }) {
  return (
    <div className={`detail-grid mt-10 sm:grid-cols-2${columns === 3 ? " lg:grid-cols-3" : ""}`}>
      {items.map((item, index) => (
        <article key={item.title} className="detail-grid-cell">
          <span className="text-xs font-semibold tracking-[0.18em] text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-6 text-ink-soft">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function MarkedList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`detail-list ${className}`}>
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  );
}

// The small row of links under the "next" card.
export function ExploreLinks({ label, links }: { label: string; links: { href: string; text: string }[] }) {
  return (
    <nav aria-label={label} className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3 text-sm">
      <span className="text-ink-faint">{label}:</span>
      {links.map((link) => (
        <a key={link.href} href={link.href} className="motion-hover link-draw font-medium text-ink-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink">{link.text}</a>
      ))}
    </nav>
  );
}
