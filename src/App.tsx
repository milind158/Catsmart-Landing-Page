import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import SoftwarePage from "./SoftwarePage";
import TechnologyPage from "./TechnologyPage";
import { pageRoutes } from "./routes";

// Rendered at build time by vite.config.ts and hydrated in the browser by main.tsx.
export default function App({ page }: { page: string }) {
  if (page === "/") return <HomePage />;

  const route = pageRoutes.find((item) => item.path === page);
  if (!route) return <NotFoundPage />;

  return route.kind === "software" ? <SoftwarePage product={route.product} /> : <TechnologyPage technology={route.technology} />;
}
