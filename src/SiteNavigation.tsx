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

const linkClass = "whitespace-nowrap font-bold uppercase text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-red)]";

export default function SiteNavigation({ showBack = false }: { showBack?: boolean }) {
  return (
    <>
      <MobileNavigation links={links} onLogoClick={showBack ? handleBack : undefined} />
      <nav aria-label="Quick links" className={`fixed left-6 right-6 top-4 z-[60] hidden flex-wrap items-center gap-x-2 gap-y-2 pr-5 text-[9px] tracking-[0.1em] sm:left-1/2 sm:right-auto sm:top-7 sm:w-full sm:max-w-[1200px] sm:-translate-x-1/2 sm:px-6 sm:pr-11 sm:text-[10px] sm:tracking-[0.18em] md:flex md:px-10 md:pr-10 xl:px-6 xl:pr-6 ${showBack ? "justify-between" : "justify-end"}`}>
        {showBack && <a href="/" onClick={handleBack} className={linkClass} aria-label="Back to the previous page or homepage">← Back</a>}
        <div className="flex max-w-[82%] flex-wrap items-center justify-end gap-x-2 gap-y-2 sm:gap-6">
          {links.map(({ href, label }) => <a key={label} href={href} className={linkClass}>{label}</a>)}
          {softwareLoginRoute ? <a href={softwareLoginRoute} className="whitespace-nowrap font-bold uppercase text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Login</a> : <span aria-disabled="true" title="Login destination to be configured" className="whitespace-nowrap cursor-default font-bold uppercase text-white/55">Login</span>}
        </div>
      </nav>
    </>
  );
}
