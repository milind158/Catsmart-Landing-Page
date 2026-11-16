import { MouseEvent } from "react";
import MobileNavigation from "./MobileNavigation";
import { softwareLoginRoute } from "./softwareProducts";
import Wordmark from "./Wordmark";

function handleBack(event: MouseEvent<HTMLAnchorElement>) {
  const referrer = document.referrer;
  const hasInSiteReferrer = referrer && new URL(referrer).origin === window.location.origin;

  if (hasInSiteReferrer && window.history.length > 1) {
    event.preventDefault();
    window.history.back();
  }
}

const links = [
  { href: "/#products", label: "Software" },
  { href: "/#sensing", label: "Hardware" },
  { href: "/#technologies", label: "Technologies" },
  { href: "/#contact", label: "Contact Us" },
];

const linkClass = "motion-hover link-draw whitespace-nowrap text-ink-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink";

export default function SiteNavigation({ showBack = false }: { showBack?: boolean }) {
  return (
    <>
      <MobileNavigation links={links} onLogoClick={showBack ? handleBack : undefined} />
      <nav aria-label="Quick links" className="site-nav fixed inset-x-0 top-0 z-[60] hidden h-16 md:block">
        <div className="site-container flex h-full items-center justify-between text-[0.8125rem] font-medium">
          <div className="flex items-center gap-8">
            <a href="/" aria-label="CATSMART homepage" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"><Wordmark /></a>
            {showBack && <a href="/" onClick={handleBack} className={linkClass} aria-label="Back to the previous page or homepage">← Back</a>}
          </div>
          <div className="flex items-center gap-8">
            {links.map(({ href, label }) => <a key={label} href={href} className={linkClass}>{label}</a>)}
            {softwareLoginRoute ? <a href={softwareLoginRoute} className="motion-hover inline-flex min-h-10 items-center border border-ink/25 px-4 text-ink hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink">Login</a> : <span aria-disabled="true" title="Login destination to be configured" className="cursor-default whitespace-nowrap text-ink-faint">Login</span>}
          </div>
        </div>
      </nav>
    </>
  );
}
