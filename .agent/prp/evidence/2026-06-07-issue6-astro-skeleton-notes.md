# Evidence — Issue #6 Astro skeleton conversion

- **doc_id:** `evidence-issue6-astro-skeleton-2026-06-07`
- **issue:** `FITAutomate/ai-news#6` (Phase 1 of the migration issue map)
- **author:** Nico
- **date:** 2026-06-07
- **branch:** `migration/astro-skeleton`
- **status:** DRAFT PR — awaiting John review before merge

## What this phase does

Establishes an Astro 5 project (npm) that reproduces the existing static AI News Pulse site 1:1,
with **no visual or behavioral change** and **no FIT brand tokens** (brand is issue #7).

## Inputs (from John, 2026-06-07)

- Q1: Astro 5 + **npm** (not pnpm).
- Q5: **Not applicable to #6.** Preserve current CSS/visual behavior; do not introduce FIT brand
  tokens. Brand source/delivery is deferred to #7.

## Key structural decision — staged `public/`, no file relocation

The current site is a client-side static app: `index.html` links `./styles.css` and loads
`./app.js`, and `app.js` fetches `./news-data.json` and `./archive/manifest.json` (plus weekly
`./archive/news-YYYY-WW.json`) at runtime. `styles.css` references the background via
`url("./news-bg.png")`.

Astro only publishes files from `./public`. Rather than physically relocating the runtime assets
into `public/` (which would mean moving ~24 data files + a 2 MB binary image and committing them
through tooling that is not binary-safe, and would risk the weekly-data workflow), this skeleton
**keeps the canonical assets at the repo root unchanged** and stages a gitignored `./public` from
them at build time via `scripts/stage-astro-public.mjs` (run by the `prebuild`/`predev` npm
hooks). Consequences:

- `news-data.json`, `archive/`, `scripts/sync-archive-manifest.mjs`,
  `scripts/week-key-from-date.mjs`, and `skills/ai-news-weekly/` are **untouched** — the weekly
  curation workflow keeps working exactly as before, writing to the same root paths.
- No binaries or data files are duplicated in git; `public/` is build output.
- The current GitHub Pages site (served from the repo root on `main`) is **not disturbed** by this
  phase, even if this branch were merged (root `index.html`/`styles.css`/`app.js` remain in place;
  Astro builds to `dist/`, which Pages does not serve).

## Behavior preservation

- `src/pages/index.astro` reproduces the previous `index.html` markup verbatim (same head, fonts,
  description, favicon, body, footer).
- `styles.css` and `app.js` are served verbatim from the staged `public/`, so `url("./news-bg.png")`
  in the CSS and the relative `fetch("./archive/manifest.json")` / `fetch("./news-data.json")` in
  app.js resolve exactly as they do today (relative to the page at the site root).
- The app.js `<script>` uses Astro's `is:inline` directive, so Astro does **not** bundle or
  transform it — it remains the same classic script, preserving runtime behavior and the
  `?v=20260606a` cache-buster.
- No `base` is configured, so relative paths keep working regardless of the eventual deploy host
  (the root-domain target `ai-news.fitautomate.com` is handled in #8/#9).

## Validation status

- [x] `node scripts/stage-astro-public.mjs` → `public/` correctly assembled (6 assets incl. 24
      archive files). Verified locally.
- [x] `package.json` and `tsconfig.json` are valid JSON; `astro.config.mjs` and the stage script
      pass `node --check`.
- [x] `npm install` → 277 packages; authoritative `package-lock.json` generated and committed to
      the branch (deterministic Cloudflare/CI installs).
- [x] `npm run build` → **PASS** (Astro 5.7.x, output: static). Build ran the `prebuild` staging
      hook then `astro build`; 1 page built (`src/pages/index.astro` → `/index.html`).
- [x] `dist/` verified equivalent to the current site: root contains `index.html`, `app.js`,
      `styles.css`, `news-data.json`, `icon.png`, `news-bg.png`, and `archive/` (24 files:
      `manifest.json` + 23 weekly files). `dist/index.html` carries the same `<title>`, Sora /
      Space Grotesk font links, `./styles.css` link, `#weekSelect` / `#newsGrid` hooks, and the
      `./app.js?v=20260606a` script left verbatim (confirming `is:inline` prevented bundling).
      Independently reproduces John's build result.

Build validation complete — PR moved out of draft to ready-for-review.

## Note for later phases — `public/` staging caveat

`scripts/stage-astro-public.mjs` deletes and recreates `public/` on every build. That is fine
while `public/` is **generated-only** (issue #6). However, if a later phase wants to commit **real
source assets** under `public/` (e.g. brand assets in #7, or any hand-authored static file), that
phase MUST adjust this script first — as written it would wipe any committed `public/` contents on
the next build. Options for later: copy into a subfolder the script doesn't clear, switch from
"wipe + recopy" to a targeted sync, or stop staging once assets are physically relocated.

## Explicitly out of scope (not done here)

- FIT brand tokens / typography (issue #7).
- Starwind (issue #7).
- Cloudflare Pages / DNS / GitHub Pages settings / production hosting (issues #8/#9/#10).
- Any change to the weekly-data format, scripts, or the weekly skill.

## Open flag for review (sequencing)

When this eventually merges and deployment moves to the Astro build, the legacy root
`index.html`/`styles.css`/`app.js` become redundant with `src/pages/index.astro` + the staged
`public/`. Removing the legacy root copies (and reconciling what GitHub Pages serves) belongs to
the deploy phases (#8 Cloudflare Git-connected Pages builds from this Astro source; #5/#10 retire
Pages). Until then both coexist by design so production is never at risk. Flagging for John/Sage.
