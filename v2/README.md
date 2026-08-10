# SATONA site

This directory contains the static SATONA site published from the repository root.

## Extraction-safe media policy

The site uses responsive HTML/CSS media components for product, resistance, macro and packaging slots. Supplemental media still listed in `MEDIA-REQUIRED.md` can be added later without changing the page structure.

The interactive plate uses `assets/images/seedrectobip39.ai.svg`, which keeps the `w{line}-b{bit}` identifiers consumed by `plate-preview.js`.

The offline BIP39 PDF is available at `assets/pdf/bip39binary.pdf`.

## Routes
- English: `/`, `/bip39.html`, `/howitworks.html`, `/security.html`, `/product.html`
- French: `/fr/` with the same page file names.
- German: `/de/` with the same page file names.

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
5. Keep asset URLs relative (`assets/` in English and `../assets/` in translated folders) so the site works from the repository root.
6. Add future binary media only after the GitHub extraction preview phase, using `MEDIA-REQUIRED.md` as the contract.

See `MEDIA-REQUIRED.md` and `CONTENT-TODO.md` before adding product claims or media.
