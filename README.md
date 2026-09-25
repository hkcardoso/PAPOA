# PAPOA

Static bilingual website for PAPOA — Yachts, Homes and Cars.

## Current deployment

- Production is deployed through Cloudflare Workers static assets.
- Production branch: `main`.
- English pages live at the repository root; Portuguese pages live in `pt/`.
- Shared runtime: `assets/papoa-v2.css` and `assets/papoa-v2.js`.
- `wrangler.jsonc` deploys the repository root as static assets.
- `.assetsignore` keeps repository/development files out of the uploaded asset bundle.
- GitHub Pages deployment has been removed; there should be no GitHub Actions deployment workflow.

Every commit pushed to `main` can trigger a new Cloudflare deployment. Batch related edits where possible instead of making several production commits seconds apart.

## Development utilities

The `scripts/` directory is development-only and is excluded from Cloudflare assets.

## Contact delivery

The contact form posts to FormSubmit for `hello@papoa.pt`. Direct email remains available as a fallback.

## Project credits

Portfolio entries distinguish reference imagery, visualisation work and concepts from completed fabrication. Existing credits should be preserved where third-party photography is used.
