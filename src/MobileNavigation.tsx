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
      className="fixed left-4 right-4 top-4 z-[70] flex h-12 items-center justify-between md:hidden"
    >
      <a
        href="/"
        onClick={onLogoClick}
        aria-label={onLogoClick ? "Back to the previous page or CATS homepage" : "CATS homepage"}
        className="rounded-sm text-lg font-black tracking-[0.12em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-red)]"
      >
        CATS
      </a>

      <div className="flex items-center gap-2">
        {softwareLoginRoute ? (
          <a
            href={softwareLoginRoute}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/25 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white/80 transition-colors hover:border-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Login
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Login destination to be configured"
            className="inline-flex min-h-11 cursor-default items-center justify-center rounded-sm border border-white/25 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white/65"
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current">
            <path
              d="M4 6h16"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={`origin-center transition-transform duration-200 ease-out ${isOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <path
              d="M4 12h16"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={`transition-opacity duration-150 ease-out ${isOpen ? "opacity-0" : "opacity-100"}`}
            />
            <path
              d="M4 18h16"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={`origin-center transition-transform duration-200 ease-out ${isOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </svg>
        </button>
      </div>

      <div
        id="mobile-navigation-menu"
        aria-hidden={!isOpen}
        className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-md border border-white/10 bg-[#1b1b1b] p-2 shadow-2xl shadow-black/50 transition-[opacity,transform,visibility] duration-200 ease-out ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="grid">
          {links.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
              className="flex min-h-12 items-center rounded-sm px-4 text-sm font-bold uppercase tracking-[0.12em] text-white/80 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
