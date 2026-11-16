import { useEffect } from "react";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import SoftwarePage from "./SoftwarePage";
import TechnologyPage from "./TechnologyPage";
import { startReveals } from "./reveal";
import { pageRoutes } from "./routes";

// Rendered at build time by vite.config.ts and hydrated in the browser by main.tsx.
export default function App({ page }: { page: string }) {
  useEffect(() => startReveals(), [page]);

  const route = pageRoutes.find((item) => item.path === page);
  const content = page === "/" ? <HomePage /> : !route ? <NotFoundPage /> : route.kind === "software" ? <SoftwarePage product={route.product} /> : <TechnologyPage technology={route.technology} />;

  return (
    <>
      {content}
      <div aria-hidden="true" className="page-beam" />
    </>
  );
}
