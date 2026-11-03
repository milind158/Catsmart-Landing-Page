import { useEffect, useRef, useState, type MouseEvent } from "react";
import { softwareLoginRoute } from "./softwareProducts";

type NavigationLink = {
  href: string;
  label: string;
};

type MobileNavigationProps = {
  links: NavigationLink[];
  onLogoClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function MobileNavigation({ links, onLogoClick }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navigationRef}
      aria-label="Mobile navigation"
      className="mobile-navigation fixed inset-x-0 top-0 z-[70] flex h-16 items-center justify-between border-b border-line-navy bg-navy px-4 md:hidden"
    >
      {/* PLACEHOLDER: text wordmark until a logo is supplied. */}
      <a
        href="/"
        onClick={onLogoClick}
        aria-label={onLogoClick ? "Back to the previous page or CATS homepage" : "CATS homepage"}
        className="font-serif text-xl tracking-[0.08em] text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
      >
        CATS
      </a>

      <div className="flex items-center gap-2">
        {softwareLoginRoute ? (
          <a
            href={softwareLoginRoute}
            className="motion-hover inline-flex min-h-11 items-center justify-center border border-line-navy px-3 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ivory/80 hover:border-ivory hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            Login
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Login destination to be configured"
            className="inline-flex min-h-11 cursor-default items-center justify-center border border-line-navy px-3 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ivory/60"
          >
            Login
          </button>
        )}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
          onClick={() => setIsOpen((open) => !open)}
          className="mobile-menu-button motion-hover inline-flex h-11 w-11 items-center justify-center text-ivory hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current">
            <path
              d="M4 6h16"
              strokeWidth="1.25"
              strokeLinecap="butt"
              className={`origin-center transition-transform duration-200 ease-out ${isOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <path
              d="M4 12h16"
              strokeWidth="1.25"
              strokeLinecap="butt"
              className={`transition-opacity duration-150 ease-out ${isOpen ? "opacity-0" : "opacity-100"}`}
            />
            <path
              d="M4 18h16"
              strokeWidth="1.25"
              strokeLinecap="butt"
              className={`origin-center transition-transform duration-200 ease-out ${isOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </svg>
        </button>
      </div>

      <div
        id="mobile-navigation-menu"
        data-open={isOpen}
        className="mobile-menu absolute inset-x-0 top-full border-b border-line-navy bg-navy px-2 py-2"
      >
        <div className="grid">
          {links.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              onClick={() => setIsOpen(false)}
              className="motion-hover flex min-h-12 items-center px-2 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-ivory/85 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
