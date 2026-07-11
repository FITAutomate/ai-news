---
name: ai-news-weekly
description: Creates and publishes the FIT Automate Weekly AI News Insights update for the ai-news repository—research, archive JSON, current-week rollover, manifest sync, page metadata, validation, and optional publish via push to main (Cloudflare Pages auto-deploy).
version: 1.3.0
---

# AI News Weekly

## Overview

This skill standardizes the **Weekly AI News Insights** publishing workflow for this **repository** (clone or worktree path may vary). It covers source collection, story curation, JSON generation, site wiring, quality checks, and publish steps.

Product name on the page: **Weekly AI News Insights** (nav lockup: `FIT Automate / Insights`).

## Tooling (minimal contract)

The skill assumes only:

- **Local file access** to the repo (read/write JSON, Astro page, CSS as needed for metadata only).
- **JSON validation** via `node skills/ai-news-weekly/scripts/validate-news-json.mjs` (see Step 6).
- **Archive index** via `node scripts/sync-archive-manifest.mjs` from the repo root (see Step 5).
- **Optional** week lookup: `node scripts/week-key-from-date.mjs YYYY-MM-DD` (uses `archive/manifest.json`).
- **Optional web lookup** when curating (browser, search, or any MCP you choose—none required by this repo).
- **Node build** via `npm run build` — stages root `news-data.json`, `archive/`, `app.js`, and `icon.png` into Astro `public/`, then runs `astro build` (pre-push smoke check).
- **Git** when publishing — a push to `main` triggers the Cloudflare Pages build and deploy.

## Hard guards (do not break the masthead)

Weekly runs must **not** regress the locked header:

1. **Do not overwrite `app.js`** during a normal weekly publish. Runtime rendering (`renderMeta`, week selector, cards) stays as shipped. Only change `app.js` in an explicit UI/fix PR.
2. **Do not recreate or edit a root `index.html`.** Production page is `src/pages/index.astro` only (GitHub Pages shim retired).
3. **Do not reintroduce** header stats cells (Stories, Primary Sources, Window, Themes). The masthead is brand + week picker; the hero kicker is `Week NN · Updated {label}` only.
4. Keep writing `meta.window` and `meta.themes` in JSON (schema still requires them for archive continuity). They are **not** rendered in the header until a future interactive Themes feature lands.
5. Card truncation (~140 chars) and tag limit (3) are UI-side in `app.js` — write full summaries/tags in JSON; do not pre-truncate.

## When to Use

Use this skill when the request is to create a new weekly news edition, update `Current` to that week, or publish a weekly refresh (push to `main` -> Cloudflare Pages auto-deploy).

Typical triggers:

- "Create this week's AI news"
- "Add Week 15"
- "Update current news and publish"
- "Build this week's FIT Automate AI brief"
- "Run Weekly AI News Insights"

## Required Inputs

Collect these from user if missing:

- Target week key (example: `2026-14`)
- Date window text (example: `Mar 29-Apr 4, 2026`) — stored in `meta.window` for archive; not shown in header
- Data date (`YYYY-MM-DD`) — Saturday publish date / `meta.dataDate`
- Whether to push live after update

## Workflow

### Step 1: Gather project context

1. Read [README.md](../../README.md), [app.js](../../app.js) (read-only for weekly runs), [src/pages/index.astro](../../src/pages/index.astro) (the production page), and current [news-data.json](../../news-data.json).
2. Confirm archive naming: `archive/news-YYYY-WW.json`.
3. Confirm week discovery: [archive/manifest.json](../../archive/manifest.json) (rebuilt in Step 5) and [app.js](../../app.js) (loads manifest at runtime; week picker + `Week NN` kicker).

Use [Weekly Update Checklist](references/weekly-update-checklist.md) for exact file touchpoints.

### Step 2: Collect and verify candidate stories

1. Build a candidate link list (official posts and major outlets first; optional web search or MCP if you use them).
2. Confirm each final `source` URL loads and matches the headline and date you intend (open in browser or use any fetch/scrape tool you have).
3. Favor a balanced mix across policy, business, infrastructure/chips, and builder tooling.
4. Keep stories in the target week window only.

Use [Source Selection Rules](references/source-selection-rules.md) to keep quality consistent.

### Step 3: Build weekly archive JSON

1. Create `archive/news-YYYY-WW.json` at the **repository root** (same level as `news-data.json`).
2. Use [week-news-template.json](assets/week-news-template.json) as structure baseline.
3. Keep schema fields exactly:
   - `meta.updatedLabel`, `meta.dataDate`, `meta.window`, `meta.themes`
   - `news[]` with `category,date,title,summary,source,sourceLabel,rating,tags`
4. Use 12 stories unless user explicitly requests a different count.
5. `meta.updatedLabel` should match the Saturday publish date shown in the hero (e.g. `July 11, 2026`). `app.js` renders `Week {WW} · Updated {updatedLabel}` from the week key / manifest + this field.

### Step 4: Roll current week forward

1. Copy the finalized weekly dataset into [news-data.json](../../news-data.json).
2. Ensure `Current` now points to the new week's content.

### Step 5: Wire UI and docs

1. From the repo root, run `node scripts/sync-archive-manifest.mjs` to refresh [archive/manifest.json](../../archive/manifest.json) (week selector is built from this file; do not hand-edit `app.js` week maps).
2. Update production page metadata in [src/pages/index.astro](../../src/pages/index.astro) only:
   - `<title>` — keep product name **Weekly AI News Insights** + month/year (e.g. `Weekly AI News Insights - July 2026`)
   - `<meta name="description">` date / window phrasing (static SEO)
   - Hero kicker **static fallback** to match first paint: `Week {WW} · Updated {Month DD, YYYY}` (runtime overwrites from JSON + week key)
   - Footer `Data date:` static fallback to `meta.dataDate`
   - cache-bust token on the `app.js` script tag, e.g. `src="./app.js?v=YYYYMMDDx"` (bump every release)
3. Do **not** change masthead markup (`.masthead`, brand lockup, `#weekSelect`) or restyle the header as part of a weekly run.

### Step 6: Validate and build before commit

1. Run [validate-news-json.mjs](scripts/validate-news-json.mjs) against:
   - `news-data.json`
   - `archive/news-YYYY-WW.json`
2. If validation fails, fix data and re-run.
3. Confirm links and dates are consistent.
4. Run `npm run build` from the repo root. This stages the root `news-data.json`, `archive/`, `app.js`, and `icon.png` into Astro `public/` and runs `astro build`. A clean build is the pre-push smoke check that the new week's data compiles into the deployed site.

### Step 7: Commit, publish, and verify deploy (if requested)

1. Run git status in repo.
2. Stage only weekly-news files (see [Publish Procedure](references/publish-procedure.md)).
3. Avoid staging unrelated modified files (and do not stage accidental `app.js` / `brand.css` edits unless this is an explicit UI PR).
4. Commit with clear message, then push `main`. The push triggers a Cloudflare Pages build and deploy.
5. Verify the deploy at https://ai-news.fitautomate.com: new week in the selector, kicker shows `Week NN · Updated …`, stories render, console clean.

Use [Publish Procedure](references/publish-procedure.md) for safe staging and push sequence.

## Scripts

- [validate-news-json.mjs](scripts/validate-news-json.mjs) — Validates required JSON fields, story count, field presence, and date format.
- Repository root: `scripts/sync-archive-manifest.mjs` — Rebuilds `archive/manifest.json` from all `archive/news-*.json` files.
- Repository root: `scripts/week-key-from-date.mjs` — Prints week key and path for a calendar date using the manifest.

## References

- [Weekly Update Checklist](references/weekly-update-checklist.md) — File-by-file execution checklist.
- [Source Selection Rules](references/source-selection-rules.md) — Editorial and sourcing constraints.
- [Publish Procedure](references/publish-procedure.md) — Git staging, commit, and push flow.

## Assets

- [week-news-template.json](assets/week-news-template.json) — Starter structure for weekly archive files.

## Output Expectations

A completed run should produce:

1. New archive file: `archive/news-YYYY-WW.json`
2. Updated current file: `news-data.json`
3. Updated `archive/manifest.json` (via sync script)
4. Updated `src/pages/index.astro` metadata, kicker fallback, and cache-bust token
5. A clean `npm run build`
6. Optional commit/push + verified Cloudflare deploy at https://ai-news.fitautomate.com when requested
