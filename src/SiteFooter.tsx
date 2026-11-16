import { softwareLoginRoute, softwareProducts } from "./softwareProducts";
import { technologies, technologyRoute } from "./technologies";

const linkClass = "motion-hover text-[0.9375rem] text-on-night/70 hover:text-on-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold";
const headClass = "eyebrow text-on-night/60";

export default function SiteFooter() {
  const products = softwareProducts.filter((product) => product.enabled).sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <footer className="bg-night text-on-night">
      <div className="site-container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_0.8fr] md:py-20">
        <div>
          <a href="/" aria-label="CATSMART homepage" className="inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
            <img src="/favicon.svg" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-serif text-2xl tracking-[0.08em]">CATSMART</span>
          </a>
          <p className="mt-5 max-w-xs text-[0.9375rem] leading-6 text-on-night/70">Castle Advanced Technologies &amp; Systems. Beyond Sensing, Into Intelligence.</p>
        </div>
        <nav aria-label="Software">
          <p className={headClass}>Software</p>
          <ul className="mt-4 grid gap-2.5">{products.map((product) => <li key={product.id}><a href={product.route} className={linkClass}>{product.name}</a></li>)}</ul>
        </nav>
        <nav aria-label="Technologies">
          <p className={headClass}>Technologies</p>
          <ul className="mt-4 grid gap-2.5">{technologies.map((technology) => <li key={technology.id}><a href={technologyRoute(technology.id)} className={linkClass}>{technology.heading}</a></li>)}</ul>
        </nav>
        <nav aria-label="Company">
          <p className={headClass}>Company</p>
          <ul className="mt-4 grid gap-2.5">
            <li><a href="/#contact" className={linkClass}>Contact Us</a></li>
            {softwareLoginRoute && <li><a href={softwareLoginRoute} className={linkClass}>Login</a></li>}
          </ul>
        </nav>
      </div>
      <div className="border-t border-on-night/10">
        <p className="site-container py-6 text-xs text-on-night/60">© {new Date().getFullYear()} Castle Advanced Technologies &amp; Systems</p>
      </div>
    </footer>
  );
}
