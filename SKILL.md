---
name: berg-pc-design
description: Use this skill to generate well-branded interfaces and assets for Berg PC, a Houston trial & business law firm focused on cryptocurrency fraud tracing and recovery — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, logo assets, reusable components, and UI kits for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Brand:** Berg PC — "Senior Attorneys and Digital Forensics Experts Working Together." Authoritative, plain-spoken, empathetic. Speaks as "we"; addresses the reader as "you." No emoji.
- **Color:** ink-black `#1A1714` (text/primary), warm stone `#8A7B66` (accent), deep navy `#16202E` (dark fields), cream `#F7F4EE` (page). Muted semantics; no gradients.
- **Type:** Playfair Display (Didone display) · Libre Franklin (body/UI) · IBM Plex Mono (wallet/tx data). All Google Fonts substitutes.
- **Shape/elevation:** restrained corners; cool navy-tinted shadows; white cards w/ hairline border. Recurring 54×3px stone rule under headings.
- **Icons:** Lucide, 2px stroke, used sparingly. No emoji.

## Files
- `styles.css` — single entry point (link this); `@import`s `tokens/*`.
- `tokens/` — colors, typography, spacing, elevation/motion, fonts, base.
- `assets/` — logo lockups + mark (primary & reverse, transparent PNG).
- `guidelines/` — foundation specimen cards.
- `components/` — React primitives (`window.BergPCDesignSystem_<id>` after loading `_ds_bundle.js`). See each `.prompt.md`.
- `ui_kits/` — full-screen recreations (website is built; dashboard / tracing-tool / portal are scaffolds).

## Working in HTML (mocks / prototypes)
Load React 18 + Babel + Lucide, link `styles.css`, load `_ds_bundle.js`, then read components off the global namespace. Copy logo PNGs from `assets/` — don't hot-link across projects. Mirror the website kit's structure (`parts.jsx` + `screens.jsx` + `index.html`) for new screens.
