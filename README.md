# PAPOA

Static bilingual website for PAPOA — Yachts, Automotive and Interiors.

- English pages live at the root; Portuguese pages live in `pt/`.
- Shared typography and behaviour: `assets/refinement.css` and `assets/site.js`.
- To regenerate Portuguese after English edits: update `scripts/pt-translations.json`, then run `python scripts/build-portuguese.py` (requires `beautifulsoup4`).
- Validate internal navigation, assets, language links and forms with `python scripts/check-site.py`.
- Pushes to `main` publish through the existing GitHub Pages workflow.

## Contact delivery

The form posts to FormSubmit for `hello@papoa.pt`, with reCAPTCHA enabled by default. It includes a reference-folder URL rather than uploading client files. The first submission triggers a recipient activation email. **The mailbox owner must confirm that email before delivery can be considered active.** No activation or delivery test was sent during implementation. FormSubmit provides its verification and response page; the site does not fabricate a success message. Direct email remains available.

## Project credits

Portfolio entries distinguish visualization work and speculative concepts from completed fabrication. Existing architectural credits are preserved. Do not add before/after claims without corresponding source photographs.
