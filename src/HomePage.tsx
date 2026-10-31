import { useEffect } from "react";
import HeroSection from "./HeroSection";
import ContactSection from "./ContactSection";
import ProductsSection from "./ProductsSection";
import MobileNavigation from "./MobileNavigation";
import { softwareLoginRoute } from "./softwareProducts";

export default function HomePage() {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (targetId !== "products" && targetId !== "contact") return;

    // The browser processes URL fragments before React has mounted the page.
    // Scroll again after the target sections exist in the DOM.
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, []);

  return (
    <main className="bg-[var(--site-background)]">
      <MobileNavigation links={[
        { href: "#technologies", label: "Technologies" },
        { href: "#products", label: "Products" },
        { href: "#contact", label: "Contact Us" },
      ]} />
      <nav aria-label="Quick links" className="fixed left-6 right-6 top-4 z-[60] hidden flex-wrap items-center justify-end gap-x-2 gap-y-2 pr-5 text-[9px] tracking-[0.1em] sm:left-1/2 sm:right-auto sm:top-7 sm:w-full sm:max-w-[1200px] sm:-translate-x-1/2 sm:gap-6 sm:px-6 sm:pr-11 sm:text-[10px] sm:tracking-[0.18em] md:flex md:px-10 md:pr-10 xl:px-6 xl:pr-6">
        <a href="#technologies" className="whitespace-nowrap font-bold uppercase text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-red)]">Technologies</a>
        <a href="#products" className="whitespace-nowrap font-bold uppercase text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-red)]">Products</a>
        <a href="#contact" className="whitespace-nowrap font-bold uppercase text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-red)]">Contact Us</a>
        {softwareLoginRoute ? <a href={softwareLoginRoute} className="whitespace-nowrap font-bold uppercase text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Login</a> : <span aria-disabled="true" title="Login destination to be configured" className="whitespace-nowrap cursor-default font-bold uppercase text-white/55">Login</span>}
      </nav>
      <div id="technologies"><HeroSection /></div>
      <ProductsSection />
      <ContactSection />
    </main>
  );
}
