# CATS Landing Page

Marketing site for Castle Advanced Technologies & Systems: a homepage film driven by scroll, plus a page for each software product and technology.

Built with React, TypeScript, Vite, Tailwind CSS, and GSAP. The output is plain static files with no server.

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

The film's frames are in `public/film/`, which git ignores because of its size (about 272 MB). A fresh clone has no frames, so copy them in before building, or the film falls back to missing posters. Serve `/film/` with long-lived cache headers.

## Edit content

| To change | Edit |
| --- | --- |
| Software products | `src/softwareProducts.ts` |
| Technology summaries, order, and pages | `src/technologies.ts`, `src/technologyDetails.ts` |
| Images | `public/images/` (WebP, referenced from the files above) |
| Login link | `softwareLoginRoute` in `src/softwareProducts.ts` |

New products and technologies get their page and HTML file automatically through `src/routes.ts`.

## The film

Rendered in Blender by `tools/film/film.py` and played on a canvas by `src/film/engine.ts`. The device in it is a stand-in, not CATS hardware: `build_device()` is the function real CAD replaces.

```sh
BLENDER=/path/to/blender FILM_WORKERS=4 tools/film/render_all.sh /path/outside/the/repo
```

This needs Blender 5.2, a GPU, `zsh` and `cwebp`, and picks up where it stopped if run again. When it prints `FINISHED`, replace `public/film` with the `film` folder it made.

Frame numbers are shared by `tools/film/film.py`, `tools/film/encode.sh`, `tools/film/render_all.sh` and `src/film/scenes.ts`: change them together.

While it moves, the film plays every second 1080p frame, or a portrait version on phones. Screens with more than 2000 device pixels across and at least 8 GB of memory, where reported, also fetch one 4K frame whenever the picture stops. Reduced motion, Save-Data, 2G and low-memory devices get posters and text.

## Not configured yet

- The contact form validates input but does not send it anywhere.
- The Login link has no destination.
- The logo, favicon and brand colours are placeholders.
