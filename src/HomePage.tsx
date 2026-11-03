import { useEffect } from "react";
import ContactSection from "./ContactSection";
import Film, { FilmProgress } from "./film/Film";
import HeroSection from "./HeroSection";
import ProductsSection from "./ProductsSection";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";
import TechnologiesSection from "./TechnologiesSection";

export default function HomePage() {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    // The browser processes URL fragments before React has mounted the page.
    // Scroll again after the target sections exist in the DOM.
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }, []);

  return (
    <main className="bg-studio">
      <a href="#contact" className="film-skip">Skip the film</a>
      <SiteNavigation overlay />
      <FilmProgress />
      <Film>
        <HeroSection />
        <TechnologiesSection />
        <ProductsSection />
      </Film>
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
