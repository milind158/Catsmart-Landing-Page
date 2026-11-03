# CATS Landing Page

Marketing site for Castle Advanced Technologies & Systems: a scroll-driven homepage hero, plus a page for each software product and technology.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. The output is plain static files with no server.

## Develop

Requires Node.js 20.19 or newer.

```sh
npm install
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run typecheck` | Check types |
| `npm run build` | Check types and build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Deploy

Upload `dist/` to any static host. The build pre-renders a real HTML file for every page, each with its own title and description, so content is visible without JavaScript and deep links need no rewrite rules. Point the host's "not found" page at `404.html`.

## Edit content

| To change | Edit |
| --- | --- |
| Software products | `src/softwareProducts.ts` |
| Technology summaries, order, and pages | `src/technologies.ts`, `src/technologyDetails.ts` |
| Images | `public/images/` (WebP, referenced from the files above) |
| Login link | `softwareLoginRoute` in `src/softwareProducts.ts` |

New products and technologies get their page and HTML file automatically through `src/routes.ts`.

## Not configured yet

- The contact form validates input but does not send it anywhere.
- The Login link has no destination.
