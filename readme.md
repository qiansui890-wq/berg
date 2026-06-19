# Berg PC — Design System

**Berg PC** is a Houston trial & business law firm: *"Senior Attorneys and Digital Forensics Experts Working Together."* The firm focuses on **business litigation** and **cryptocurrency litigation** — tracing stolen digital assets across the blockchain, identifying scammers, freezing criminal wallets through the courts, and recovering funds for victims, businesses, and institutions. Work is taken on contingency: *no recovery, no fee.*

This design system encodes the firm's brand — the classical-column mark, an ink-black + warm-stone + deep-navy palette, a high-contrast Didone wordmark — into reusable tokens, components, and full-screen UI kits.

> **Source of truth:** the firm's public site, **https://www.bergppc.com** (WordPress/Elementor). The primary logo was supplied by the client (`uploads/Brag PC.png`, processed into `assets/`). Key facts (address, results, capabilities, practice areas) were drawn from the live site on 2026-06-17.

---

## Brand at a glance

- **Name / mark:** Berg PC, *Attorneys at Law*. The mark fuses a geometric **"B" building** with a **classical column** (justice / permanence). Monochrome ink-black + a single warm taupe.
- **Tagline:** Senior Attorneys and Digital Forensics Experts Working Together.
- **Contact:** 24 Greenway Plaza, Suite 1800, Houston, Texas 77046 · info@bergpclawfirms.com · 281 857-6666.
- **Proof points:** $500K stolen crypto returned to a Texas family (2025); injunction freezing 30 wallets — first of its kind in Texas (2024); featured in NPR, CBS, Wired, CNN, CNBC, Fox, The Washington Post.
- **Practice areas:** Business Litigation (Breach of Contract, Partnership Disputes, Business Divorce, Non-Competes) · Crypto Litigation (Fraud & Recovery, Crypto Transactions, Coinbase Data Breach, Meta Crypto Scam Ads).

---

## CONTENT FUNDAMENTALS — how Berg PC writes

**Voice:** authoritative, plain-spoken, and reassuring. The firm speaks as **"we / our firm"** and addresses the reader as **"you."** It pairs legal gravitas with genuine empathy — it openly acknowledges that victims may be experiencing "the worst time of your life."

**Tone rules**
- **Clarity over jargon.** Explain process in concrete steps: *trace → identify → freeze → recover.* When technical terms appear (VASP, mixer, injunction), they're used precisely, not for show.
- **Empathetic, never sensational.** Reassure without over-promising. Recovery is described as rigorous and evidence-led, never guaranteed.
- **Trust signals are earned, not loud.** Lead with real outcomes and named press, stated matter-of-factly.
- **Protective.** The firm actively warns against "recovery scams" and instructs victims on safe next steps (e.g. *"Please do not call or email — complete the form."*).

**Mechanics**
- **Casing:** Title Case for headings and practice-area names; sentence case for body. UPPERCASE only for small letter-spaced eyebrows/kickers.
- **Person:** first-person plural for the firm; second person for the client. Avoid "I."
- **No emoji.** Ever. Icons are line icons, used sparingly.
- **Numbers:** concrete and specific — "$500,000", "30 wallets", "first of its kind in Texas." Currency with the symbol; round figures with "+" ("$100M+") for cumulative claims.
- **Sample copy:** *"We trace stolen cryptocurrency across the blockchain, identify who took it, and pursue recovery through the courts."* · *"Berg PC will never ask you to pay an upfront fee to recover stolen funds."*

---

## VISUAL FOUNDATIONS

**Color** — Three brand hues over warm neutrals; restrained and monochrome-leaning.
- **Ink** (`--ink-900 #1A1714`): warm near-black. Primary text, primary buttons, the mark.
- **Stone** (`--stone-500 #8A7B66`): the column's warm taupe. The accent — eyebrows, rules, tags, icon chips. Understated, never gold-bright.
- **Navy** (`--navy-900 #16202E`): the firm's "bg-Blue." Hero fields, results bands, footer — the dark anchor.
- **Cream** (`--cream #F7F4EE`): warm page background. White (`#FFFFFF`) for cards.
- **Semantic:** muted success/danger/warning/info — never neon.
- **Forensic trace palette:** wallet roles in flow graphs — tainted (red), hop (stone), exchange (blue), mixer (purple), frozen (green).

**Type** — Editorial authority.
- **Display / headlines:** *Playfair Display* (high-contrast Didone) — matches the wordmark. Reserved for hero/section titles and big numbers; tight tracking (`-0.02em`).
- **Body / UI:** *Libre Franklin* — clean American grotesque; all running text, labels, controls.
- **Data:** *IBM Plex Mono* — wallet addresses, tx hashes, case numbers. Ligatures off, forensic precision.
- *(All three are Google Fonts substitutes — see Caveats.)*

**Spacing & layout** — 4px base grid; generous editorial whitespace. Content max-width ~1200px; prose ~680px. Sections breathe (64–96px vertical).

**Shape** — Restrained corners (cards `--radius-lg 10px`, controls `--radius-sm 4px`); legal, not playful. Pills only for avatars/switches.

**Elevation** — Cool, navy-tinted shadows, low and precise (`--shadow-sm/md/lg`). Cards are white with a hairline `--border-subtle` border + soft shadow; interactive cards lift 2px on hover.

**Backgrounds & imagery** — No gradients. Solid fields only: cream (default), navy (dark anchor), occasional stone-100 panels. Photography is warm, professional, real (attorney portraits, Houston, blockchain/coin imagery). Where real photos aren't available, kits use a navy `PhotoSlot` placeholder watermarked with the reverse mark.

**Motion** — Subtle and quick. Fades + small rises (`--ease-out`, 120–360ms). Hover = background/border shift or 2px lift; press = 1px translate-down. No bounces, no decorative loops.

**The recurring motif** — a short **stone rule** (54×3px) under eyebrows/headings, echoing the divider lines beneath "ATTORNEYS AT LAW" in the logo.

---

## ICONOGRAPHY

The brand ships **no proprietary icon set**. This system standardizes on **[Lucide](https://lucide.dev)** (clean 2px-stroke line icons) — loaded from CDN in cards and kits via `lucide@0.453.0` and rendered with `<i data-lucide="name">` + `lucide.createIcons()`. *(Substitution — flagged. Swap for a licensed set if Berg adopts one.)*

- **Style:** outline, 2px stroke, square caps — matches the firm's restrained, architectural feel.
- **Usage:** sparingly and functionally — nav affordances, capability bullets, input adornments, status. Icons sit in stone/navy chips, never as decoration.
- **No emoji. No Unicode-glyph icons.** A handful of inline SVGs are hand-set inside components (checkbox tick, select chevron, copy, close) so primitives have zero runtime icon dependency.
- **Logo assets** (`assets/`): `berg-pc-logo.png` (primary), `berg-pc-logo-reverse.png` (cream knockout for navy), `berg-pc-mark.png` / `-reverse` (icon only). All trimmed, transparent background.

---

## INDEX — what's in this system

**Root**
- `styles.css` — the single entry point consumers link (`@import`s only).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `elevation.css` (+ motion), `fonts.css`, `base.css`.
- `assets/` — logo lockups + mark (primary & reverse) and the logo specimen card; `assets/team/roster.js` holds the real attorney roster (names, roles, bios, headshot URLs).
- `guidelines/` — foundation specimen cards (Colors ×5, Type ×4, Spacing ×2).

**Components** (`components/`, namespace `window.BergPCDesignSystem_eb13e3`)
- **forms/** — Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Field
- **feedback/** — Badge, Tag, Alert, Toast, Tooltip
- **layout/** — Card (+ CardHeader), Stat, EmptyState
- **data/** — AddressChip *(signature wallet-string element)*, Avatar, AttorneyCard *(attorney/team profile card)*, Table
- **navigation/** — Tabs, Stepper *(case-stage progress)*, Breadcrumb, Pagination
- **overlay/** — Dialog
- Each directory carries a `@dsCard` demo HTML; each component has `.jsx` + `.d.ts` + `.prompt.md`.

**UI kits** (`ui_kits/`)
- **website/** — ✅ marketing site: home (hero, press band, practice areas, results), Crypto Fraud & Recovery page, and the case-intake form. `index.html` + `parts.jsx` + `screens.jsx`.
- **dashboard/** — ⏳ planned: internal case-tracking dashboard.
- **tracing-tool/** — ⏳ planned: blockchain asset-trace investigation view.
- **portal/** — ⏳ planned: client document-upload + case-status portal.

**Starting points** — Button, Card, AddressChip, Table, and the website screen are tagged for the consumer "Starting Points" picker.

---

## Using the system
Consumers link one file: `styles.css`. Components are read off the global namespace `window.BergPCDesignSystem_eb13e3` after loading the generated `_ds_bundle.js`. See each component's `.prompt.md` for usage and any `@dsCard` HTML for live examples.

*(Do not edit `_ds_bundle.js`, `_ds_manifest.json`, or `_adherence.oxlintrc.json` — the compiler regenerates them.)*
