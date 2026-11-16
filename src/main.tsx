import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import App from "./App";
import { notFoundDescription, notFoundPage, notFoundTitle, pageForPath, pageRoutes } from "./routes";
import "./index.css";

function setPageMeta(title: string, description: string) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
}

const page = pageForPath(window.location.pathname);
const route = pageRoutes.find((item) => item.path === page);
if (route) setPageMeta(route.title, route.description);
if (page === notFoundPage) setPageMeta(notFoundTitle, notFoundDescription);

const root = document.getElementById("root")!;
const app = <StrictMode><App page={page} /></StrictMode>;

// A host can answer with another page's file, for example index.html for every URL.
// Hydrate only HTML that was built for this page; otherwise render it from scratch.
if (root.dataset.page === page) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
