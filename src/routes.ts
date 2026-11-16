import { type SoftwareProduct, softwareDetails, softwareProducts } from "./softwareProducts";
import { type Technology, technologies, technologyRoute } from "./technologies";
import { technologyDetails } from "./technologyDetails";

type PageMeta = { path: string; title: string; description: string };

export type PageRoute =
  | (PageMeta & { kind: "software"; product: SoftwareProduct })
  | (PageMeta & { kind: "technology"; technology: Technology });

// Used by the app at runtime and by vite.config.ts to pre-render one HTML file per page.
export const pageRoutes: PageRoute[] = [
  ...softwareProducts
    .filter((product) => product.enabled)
    .map((product): PageRoute => ({
      kind: "software",
      path: product.route,
      title: `${product.name} | CATS Software`,
      description: softwareDetails[product.id].introduction,
      product,
    })),
  ...technologies.map((technology): PageRoute => ({
    kind: "technology",
    path: technologyRoute(technology.id),
    title: `${technology.heading} | CATS Technologies`,
    description: technologyDetails[technology.id].introduction,
    technology,
  })),
];

export const notFoundPage = "/404";

// Static hosts commonly redirect /software/sangrah to /software/sangrah/ or serve it as .../index.html.
export function pageForPath(pathname: string) {
  const path = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
  return path === "/" || pageRoutes.some((route) => route.path === path) ? path : notFoundPage;
}

export const notFoundTitle = "Page not found | CATS";
export const notFoundDescription = "The page you were looking for could not be found.";
