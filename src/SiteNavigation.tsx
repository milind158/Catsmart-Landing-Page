import { MouseEvent } from "react";
import MobileNavigation from "./MobileNavigation";
import { softwareLoginRoute } from "./softwareProducts";

function handleBack(event: MouseEvent<HTMLAnchorElement>) {
  const referrer = document.referrer;
  const hasInSiteReferrer = referrer && new URL(referrer).origin === window.location.origin;

  if (hasInSiteReferrer && window.history.length > 1) {
    event.preventDefault();
    window.history.back();
  }
}

const links = [
  { href: "/#technologies", label: "Technologies" },
  { href: "/#products", label: "Products" },
  { href: "/#contact", label: "Contact Us" },
];

const linkClass = "motion-hover link-draw whitespace-nowrap text-ivory/80 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass";

export default function SiteNavigation({ showBack = false }: { showBack?: boolean }) {
  return (
    <>
      <MobileNavigation links={links} onLogoClick={showBack ? handleBack : undefined} />
      <nav aria-label="Quick links" className="fixed inset-x-0 top-0 z-[60] hidden h-16 border-b border-line-navy bg-navy md:block">
        <div className="site-container flex h-full items-center justify-between text-[0.6875rem] font-medium uppercase tracking-[0.18em]">
          <div className="flex items-center gap-8">
            {/* PLACEHOLDER: text wordmark until a logo is supplied. */}
            <a href="/" aria-label="CATS homepage" className="font-serif text-xl font-normal normal-case tracking-[0.08em] text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">CATS</a>
            {showBack && <a href="/" onClick={handleBack} className={linkClass} aria-label="Back to the previous page or homepage">← Back</a>}
          </div>
          <div className="flex items-center gap-8">
            {links.map(({ href, label }) => <a key={label} href={href} className={linkClass}>{label}</a>)}
            {softwareLoginRoute ? <a href={softwareLoginRoute} className={linkClass}>Login</a> : <span aria-disabled="true" title="Login destination to be configured" className="cursor-default whitespace-nowrap text-ivory/60">Login</span>}
          </div>
        </div>
      </nav>
    </>
  );
}
