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
  cards, badges, tags, footer, ambient orbs) on slate surfaces with fit-blue accents, Poppins
  headings, Open Sans body, JetBrains Mono for data/metadata.
- **Starwind Pro components:** installed `button`, `badge`, `card`, `select` via the CLI. The
  static footer CTAs now use the Starwind `<Button>` (`variant="primary"` = fit-blue, and
  `variant="outline"`). The dynamic news cards / stats / week-select are rendered by `app.js` at
  runtime, so they keep their class hooks and are styled to match the Starwind + FIT system rather
  than being replaced (see "Behavior preserved").
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

### Accessibility — WCAG contrast (computed)

| Pair | Ratio | Verdict |
|---|---|---|
| body text: slate-100 on slate-950 | 18.41:1 | AA |
| card body: slate-300 on slate-900 | 12.02:1 | AA |
| card meta: slate-400 on slate-900 | 6.96:1 | AA |
| kicker: fit-blue on slate-950 | 4.85:1 | AA |
| rating: gold on slate-900 | 10.96:1 | AA |
| badge text: slate-100 on slate-900 | 16.30:1 | AA |
| **link: fit-blue on slate-900 (card "Read source")** | **4.29:1** | below AA-normal (≥3 UI/large) |
| **button label: white on fit-blue** | **4.16:1** | below AA-normal (≥3 UI/large) |

**Two findings for Quinn (brand owner).** Both involve `fit-blue` (#007CE8) with small text and
fall just below the AA normal-text threshold (4.5:1) while clearing the 3:1 UI/large-text bar. The
brand blue is fixed by the brand spec, so the fix is a brand-system decision, not mine to make
unilaterally. Recommendation for Quinn:
- Introduce a lighter **fit-blue tint for small text/links on dark surfaces** (e.g. ~`#4DA6F0`,
  which reaches AA on slate-900) while keeping `#007CE8` for fills, large text, and non-text accents.
- For the primary button, either use the same darker-on-light / lighter-on-dark treatment or accept
  the 4.16:1 for the bold CTA label. Quinn's call.

A full Lighthouse/axe run should be done in the reviewer's browser to confirm beyond contrast
(focus order, landmarks, etc.). The markup retains the existing `aria-label`s and semantic landmarks.

## Boundary

Issue #7 only. No Cloudflare, DNS, GitHub Pages, production, or #8-#10 work. No new external-facing
copy (the one footer string `app.js` controls was left verbatim — copy changes route to Maya). PR
stays draft until Quinn signs off on the brand (incl. the two contrast findings above).
