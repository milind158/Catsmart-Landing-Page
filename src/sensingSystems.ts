// CATS photonic sensing products already published on the public CATS Global catalogue
// (https://www.cats-global.com/products, checked 2026-11-16). Each line is shortened from that page's
// own tagline and description, with no new claims.
// Add nothing that is not public on that page.

export type SensingSystem = { domain: string; name: string; tagline: string; href: string };

export const catalogueUrl = "https://www.cats-global.com/products";

// One system per domain: the four CATS Global features on its own homepage. The full range lives on the catalogue.
export const featuredSystems: SensingSystem[] = [
  { domain: "Environment", name: "AUM", tagline: "Photonic technology for real-time environmental monitoring, up to 5 km away.", href: `${catalogueUrl}/aum?domain=environment` },
  { domain: "Condition & Vibration", name: "Vidur", tagline: "Precision photonic vibration and condition monitoring.", href: `${catalogueUrl}/vidur?domain=condition-vibration` },
  { domain: "Defence & Surveillance", name: "ALERT", tagline: "Laser-enabled remote drone and border monitoring.", href: `${catalogueUrl}/alert?domain=defense-surveillance` },
  { domain: "Health & Wellness", name: "Dr T DHANVANTARI", tagline: "Non-invasive breath analysis for early disease detection.", href: "https://www.dr-t.ai/Dhanvantari" },
];

// Recognition, as published on the CATS Global homepage.
export const awards = [
  { year: "2019", title: "Most Promising Startup of the Year", body: "IESA Spacetronics & Deftronics, Aerospace and Defence category." },
  { year: "2025", title: "Medicall Made in India Expo", body: "Awarded among 152 participants in the ‘Medtech Services, Procedures, and Products Enabled by AI’ category." },
];
