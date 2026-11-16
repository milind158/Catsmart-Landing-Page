// A large link to the next product or technology, so each page hands the visitor on to another.
export default function NextCard({ kind, position, total, href, name, tagline, image }: {
  kind: string;
  position: number;
  total: number;
  href: string;
  name: string;
  tagline: string;
  image: { src: string; width?: number; height?: number; fit?: "contain" };
}) {
  return (
    <a href={href} className="next-card product-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink">
      <div className="min-w-0">
        <p className="eyebrow text-gold-ink">Next {kind} · {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
        <p className="mt-4 break-words font-serif text-[2.5rem] leading-none text-ink md:text-6xl">{name}</p>
        <p className="mt-4 max-w-md text-lg leading-7 text-ink-soft">{tagline}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
          <span className="link-draw">Continue</span>
          <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
        </span>
      </div>
      <div className="screen-frame" aria-hidden="true">
        <div className="screen-frame-bar"><span /><span /><span /></div>
        <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" data-fit={image.fit} className="screen-frame-image" />
      </div>
    </a>
  );
}
