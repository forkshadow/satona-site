# SATONA V2

This directory is a static, isolated V2. It does **not** share CSS, JavaScript or HTML with the live root site.

## Extraction-safe media policy

To allow Codex-to-GitHub extraction, all binary media previously copied into `v2/` have been removed. The V2 now uses responsive HTML/CSS media components for product, resistance, macro and packaging slots. They are deliberately non-photorealistic and can be replaced later without changing the page structure.

The interactive plate uses `assets/images/seedrectobip39.ai.svg`, which keeps the `w{line}-b{bit}` identifiers consumed by `plate-preview.js`.

The offline BIP39 PDF is intentionally absent during this preview phase; each former download control is a localized disabled “coming soon” status.

## Routes
- English: `/v2/`, `/v2/bip39.html`, `/v2/howitworks.html`, `/v2/security.html`, `/v2/product.html`
- French: `/v2/fr/` with the same page file names.
- German: `/v2/de/` with the same page file names.

## Structure
- `assets/css/`: tokens, base rules, layout, reusable components and page-specific sheets.
- `assets/js/`: dependency-free feature scripts. `bip39-list.js` is a copied text source list; `plate-preview.js` fetches the text-only SVG.
- `assets/images/seedrectobip39.ai.svg`: the interactive SATONA pieces used for the learning demonstration.
- `assets/media/`: reserved for documented future media; it is empty in this extraction-safe version.

## Editing safely
1. Update all three corresponding HTML pages when changing copy or page structure.
2. Keep language links pointing to the same filename in each locale.
3. Do not change `seedrectobip39.ai.svg` identifiers: `plate-preview.js` depends on them.
4. Keep BIP39 conversion strictly one word at a time; do not add full-phrase submission.
5. Keep asset URLs relative (`assets/` in English and `../assets/` in translated folders) so the V2 works under `/v2/`.
6. Add future binary media only after the GitHub extraction preview phase, using `MEDIA-REQUIRED.md` as the contract.

See `MEDIA-REQUIRED.md` and `CONTENT-TODO.md` before adding product claims or media.
