import { createServer, defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { notFoundDescription, notFoundPage, notFoundTitle, pageRoutes } from "./src/routes";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const withPageMeta = (html: string, title: string, description: string) =>
  html
    .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, () => `<meta name="description" content="${escapeHtml(description)}" />`);

const rootElement = '<div id="root"></div>';

// Writes a pre-rendered HTML file for every page so content is visible without JavaScript,
// deep links work on any static host with no rewrite rules, and each page ships its own title
// and description. main.tsx hydrates the result in the browser.
function staticPages(): Plugin {
  return {
    name: "static-pages",
    apply: "build",
    enforce: "post",
    async generateBundle(_, bundle) {
      const entry = bundle["index.html"];
      if (entry?.type !== "asset") this.error("index.html was not found in the bundle");
      // The headline font is preloaded so hero text does not swap fonts mid-entrance.
      const headlineFont = Object.keys(bundle).find((name) => /source-serif-4-latin-opsz-normal.*\.woff2$/.test(name));
      if (!headlineFont) this.error("The headline font was not found in the bundle");
      const html = String(entry.source).replace(
        "</title>",
        `</title>\n    <link rel="preload" href="/${headlineFont}" as="font" type="font/woff2" crossorigin />`,
      );
      if (!html.includes(rootElement)) this.error("The root element was not found in index.html");

      const server = await createServer({
        configFile: false,
        appType: "custom",
        logLevel: "error",
        esbuild: { jsx: "automatic", jsxDev: false },
        optimizeDeps: { noDiscovery: true },
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
      });
      try {
        const { renderPage } = await server.ssrLoadModule("/src/entry-server.tsx");
        const withPage = (page: string, source = html) =>
          source.replace(rootElement, () => `<div id="root" data-page="${page}">${renderPage(page)}</div>`);

        entry.source = withPage("/");
        for (const { path, title, description } of pageRoutes) {
          this.emitFile({ type: "asset", fileName: `${path.slice(1)}/index.html`, source: withPage(path, withPageMeta(html, title, description)) });
        }
        this.emitFile({
          type: "asset",
          fileName: "404.html",
          source: withPage(notFoundPage, withPageMeta(html, notFoundTitle, notFoundDescription).replace("</title>", '</title>\n    <meta name="robots" content="noindex" />')),
        });
      } finally {
        await server.close();
      }
    },
  };
}

export default defineConfig({ plugins: [react(), staticPages()] });
