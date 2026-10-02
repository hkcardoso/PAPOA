# PAPOA

Static portfolio site, rebranded from the CLASTO site and published through Cloudflare Workers.

## Deployment

- Production branch: `main`.
- Wrangler serves the repository root as static assets.
- No build step or dependency installation is required.

## Site files

- `index.html`: portfolio landing page.
- `portfolio.js` and `app.js`: gallery data and rendering.
- `projects/`: project imagery.
- `projetos/`: project detail pages.
- `fonts/`: site fonts.
- `_headers`: static asset response headers.

The contact form sends to `hello@papoa.pt`. Twenty large original images are temporarily served from `clasto.pt` until those source files can be transferred here.
