# SATONA V2

This directory is a static, isolated V2. It does **not** share CSS, JavaScript or HTML with the live root site.

## Extraction-safe media policy

The V2 is self-contained: the required historical images, SVGs and offline PDF are copied into `v2/assets/`. It can be published or extracted without the root site assets.

The copied plate SVG keeps the historic `w{line}-b{bit}` identifiers consumed by `plate-preview.js`.

The V2 download controls point to the copied offline PDF in `assets/pdf/`.

## Routes
- English: `/v2/`, `/v2/bip39.html`, `/v2/howitworks.html`, `/v2/security.html`, `/v2/product.html`
- French: `/v2/fr/` with the same page file names.
- German: `/v2/de/` with the same page file names.

## Structure
- `assets/css/`: tokens, base rules, layout, reusable components and page-specific sheets.
- `assets/js/`: dependency-free feature scripts. `bip39-list.js` is a copied text source list; `plate-preview.js` fetches the text-only SVG.
- `assets/images/` and `assets/pdf/`: V2-local copies of every asset used by the V2 pages.
- `assets/media/`: reserved for documented future media; it is empty in this extraction-safe version.

## Editing safely
1. Update all three corresponding HTML pages when changing copy or page structure.
2. Keep language links pointing to the same filename in each locale.
3. Do not change the historic `seedrectobip39.ai.svg` identifiers: `plate-preview.js` depends on them.
4. Keep BIP39 conversion strictly one word at a time; do not add full-phrase submission.
5. Keep asset URLs relative (`assets/` in English and `../assets/` in translated folders) so the V2 works under `/v2/`.
6. Use `MEDIA-REQUIRED.md` as the contract when adding future media.

See `MEDIA-REQUIRED.md` and `CONTENT-TODO.md` before adding product claims or media.
