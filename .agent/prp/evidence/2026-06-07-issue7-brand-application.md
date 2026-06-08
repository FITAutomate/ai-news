# Evidence — Issue #7 brand application

- **doc_id:** `evidence-issue7-brand-application-2026-06-07`
- **issue:** `FITAutomate/ai-news#7`
- **author:** Nico
- **date:** 2026-06-07
- **branch:** `migration/fit-brand` (draft PR #12)
- **status:** DRAFT — built and validated; **awaiting Quinn brand sign-off before merge**.

## What changed (visual brand)

FIT brand applied from the pinned snapshot (`fit-solutions/brand@d2fef9e`):

- **Tokens (in `src/styles/starwind.css`):** added `--color-fit-blue: #007CE8`, `--color-fit-green:
  #1CD000`, and FIT fonts (`--font-sans` Open Sans, `--font-heading` Poppins, `--font-mono`
  JetBrains Mono). Mapped Starwind's semantic tokens to FIT: `--primary`/`--primary-accent` =
  fit-blue, `--success` = fit-green, and the dark palette to the Tailwind **slate** scale (dark
  surfaces, never navy/black). Page runs in dark mode (`<html class="dark">`).
- **Page styling (`src/styles/brand.css`):** styles the AI News bespoke classes (nav, hero, stats,
  cards, badges, tags, footer) on slate surfaces with fit-blue accents, Poppins headings, Open Sans
  body, JetBrains Mono for data/metadata. The background is an overflow-safe ambient glow painted on
  `body` (no `position: fixed` orbs — removed per Quinn's PR #12 follow-up to eliminate any
  horizontal overflow).
- **Starwind Pro components:** `button`, `badge`, `card`, `select` are **generated into the repo
  and available** (`src/components/starwind/`) as the project's design-system basis. Of these,
  **`Button` is the one actually instantiated** in the page (the two static footer CTAs:
  `variant="primary"` = fit-blue fill, and `variant="outline"`). The dynamic news cards / stats /
  week-select are rendered by `app.js` at runtime, so they keep their class hooks and are **styled
  to match** the Starwind + FIT system rather than being replaced; `badge`/`card`/`select` are
  available for future static use but are not directly instantiated in this pass.
- **Colour intent (FIT rule):** `fit-green` is reserved for status/approval and is **not** used
  decoratively. The old design's decorative green (badges, CTA) is now fit-blue/slate. Rating stars
  keep a distinct gold indicator (not a brand status colour).
- Replaced the prior Sora / Space Grotesk fonts and the navy background.

## Behavior preserved (no app.js change)

- `app.js` is unchanged and still loaded via `is:inline`. It still fetches `./news-data.json` and
  `./archive/manifest.json` and renders `#stats`, `#newsGrid`, and the native `#weekSelect` at
  runtime. Those DOM hooks are kept exactly; the brand styling targets the same class names, so the
  dynamic surface is branded without touching the script.
- `news-data.json`, `archive/`, `scripts/sync-archive-manifest.mjs`, `scripts/week-key-from-date.mjs`,
  and `skills/ai-news-weekly/` are untouched.
- `styles.css` and `news-bg.png` are no longer referenced by the page (styling moved into the
  bundled CSS; surface is clean slate). Both remain in the repo root for the legacy GitHub Pages
  site; they are dropped from the Astro staging list only.

## Validation

- `npm ci` / `npm install` — clean; lockfile in sync (`npm ci --dry-run` passed earlier).
- `npm run build` — **PASS** (Astro 6.4.4, Tailwind v4). 1 page built; `dist/` contains
  `index.html`, `app.js`, `icon.png`, `news-data.json`, `archive/` (24), and bundled CSS in
  `_astro/`. `styles.css` / `news-bg.png` correctly absent.
- `dist/index.html` markers confirmed: `class="dark"`, Poppins/Open Sans/JetBrains Mono font links,
  `#stats` / `#newsGrid` / `#weekSelect` hooks, both `data-slot="button"` CTAs, `./app.js?v=...`
  preserved, no `./styles.css` link. Bundled CSS contains `#007ce8`, `fit-blue`, the FIT fonts, and
  the slate (oklch) palette.
- `npm run preview` — to be run by the reviewer for the live visual pass (sandbox has no browser);
  build output verified structurally.

### Accessibility — WCAG contrast (computed) — post-Quinn polish

All key pairs now pass WCAG AA normal-text (≥4.5:1):

| Pair | Ratio | Verdict |
|---|---|---|
| body text: slate-100 on slate-950 | 18.41:1 | AA |
| card body: slate-300 on slate-900 | 12.02:1 | AA |
| card meta: slate-400 on slate-900 | 6.96:1 | AA |
| kicker: fit-blue on slate-950 | 4.85:1 | AA |
| rating: gold on slate-900 | 10.96:1 | AA |
| badge text: slate-100 on slate-900 | 16.30:1 | AA |
| card "Read source" link: **fit-blue-300 (#3b9bf0)** on slate-900 | **6.06:1** | AA (was 4.29 with #007CE8) |
| primary CTA label: **slate-950 (#020617)** on fit-blue | **4.85:1** | AA (was 4.16 with white) |
| outline CTA label: slate-100 on slate-950 | 18.41:1 | AA |

**Polish applied per Quinn's PR #12 direction:**
1. Added an approved on-dark fit-blue tint `--color-fit-blue-300: #3b9bf0` for small text/links on
   slate surfaces (`.card a`, link hovers). Canonical `#007CE8` is kept for primary fills, large
   text (kicker passes at 4.85), and non-text accents (card hover border, focus outline).
2. Primary CTA uses a documented accessible treatment: dark slate label (`--primary-foreground:
   #020617`) on the canonical `#007CE8` fill = 4.85:1 — keeps the brand fill, no known failure.

### Accessibility — static audit (computed/structural; "equivalent" pass)

All checks PASS on the built `dist/index.html`: `<html lang>`, exactly one `<h1>`, `<main>`
landmark, `<nav aria-label>` landmarks, hero `<img>` has `alt`, week `<select>` has `aria-label`,
all social links have `aria-label`, decorative SVGs are `aria-hidden`, and both CTA buttons have
discernible text.

**Residual (reviewer-side):** the sandbox has no browser, so a full **Lighthouse/axe** run (focus
order, computed styles, etc.) should be run in the reviewer's browser via `npm run preview`. The
computed-contrast audit + static structural audit above are the in-sandbox equivalent.

## Boundary

Issue #7 only. No Cloudflare, DNS, GitHub Pages, production, or #8-#10 work. No new external-facing
copy (the one footer string `app.js` controls was left verbatim — copy changes route to Maya). PR
stays draft until Quinn signs off on the brand (incl. the two contrast findings above).
