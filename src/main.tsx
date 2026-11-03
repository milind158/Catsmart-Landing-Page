import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { notFoundDescription, notFoundTitle, pageRoutes } from "./routes";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "./index.css";

const HomePage = lazy(() => import("./HomePage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));
const SoftwarePage = lazy(() => import("./SoftwarePage"));
const TechnologyPage = lazy(() => import("./TechnologyPage"));

function setPageMeta(title: string, description: string) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
}

function renderPage(path: string) {
  if (path === "/") return <HomePage />;

  const route = pageRoutes.find((item) => item.path === path);
  if (!route) {
    setPageMeta(notFoundTitle, notFoundDescription);
    return <NotFoundPage />;
  }

  setPageMeta(route.title, route.description);
  return route.kind === "software" ? <SoftwarePage product={route.product} /> : <TechnologyPage technology={route.technology} />;
}

// Static hosts commonly redirect /software/sangrah to /software/sangrah/.
const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={null}>{renderPage(currentPath)}</Suspense>
  </StrictMode>,
);
