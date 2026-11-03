import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { notFoundDescription, notFoundTitle, pageRoutes } from "./src/routes";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const withPageMeta = (html: string, title: string, description: string) =>
  html
    .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, () => `<meta name="description" content="${escapeHtml(description)}" />`);

// Writes a real HTML file for every page so deep links work on any static host,
// with no rewrite rules, and each page ships its own title and description.
function staticPages(): Plugin {
  return {
    name: "static-pages",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const entry = bundle["index.html"];
      if (entry?.type !== "asset") this.error("index.html was not found in the bundle");
      // The headline font is preloaded so hero text does not swap fonts mid-entrance.
      const headlineFont = Object.keys(bundle).find((name) => /source-serif-4-latin-opsz-normal.*\.woff2$/.test(name));
      if (!headlineFont) this.error("The headline font was not found in the bundle");
      const html = String(entry.source).replace(
        "</title>",
        `</title>\n    <link rel="preload" href="/${headlineFont}" as="font" type="font/woff2" crossorigin />`,
      );
      entry.source = html;

      for (const { path, title, description } of pageRoutes) {
        this.emitFile({ type: "asset", fileName: `${path.slice(1)}/index.html`, source: withPageMeta(html, title, description) });
      }
      this.emitFile({
        type: "asset",
        fileName: "404.html",
        source: withPageMeta(html, notFoundTitle, notFoundDescription).replace("</title>", '</title>\n    <meta name="robots" content="noindex" />'),
      });
    },
  };
}

export default defineConfig({ plugins: [react(), staticPages()] });
