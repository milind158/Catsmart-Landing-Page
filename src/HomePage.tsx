import { useEffect } from "react";
import HeroSection from "./HeroSection";
import ContactSection from "./ContactSection";
import ProductsSection from "./ProductsSection";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";

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
      <SiteNavigation />
      <div id="technologies"><HeroSection /></div>
      <ProductsSection />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
