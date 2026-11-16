import { useEffect } from "react";
import ContactSection from "./ContactSection";
import HeroSection from "./HeroSection";
import ProductsSection from "./ProductsSection";
import SensingSection from "./SensingSection";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";
import StatementSection from "./StatementSection";
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
    <>
      <SiteNavigation />
      <main className="bg-paper text-ink">
        <HeroSection />
        <StatementSection />
        <ProductsSection />
        <SensingSection />
        <TechnologiesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
