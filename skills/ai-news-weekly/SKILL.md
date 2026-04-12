---
name: ai-news-weekly
description: Creates and publishes the FIT Automate weekly AI News Pulse update for the ai-news repository—research, archive JSON, current-week rollover, manifest sync, page metadata, validation, and optional GitHub Pages publish.
version: 1.1.0
---

# AI News Weekly

## Overview

This skill standardizes the weekly AI News Pulse publishing workflow for this **repository** (clone or worktree path may vary). It covers source collection, story curation, JSON generation, site wiring, quality checks, and publish steps.

## Tooling (minimal contract)

The skill assumes only:

- **Local file access** to the repo (read/write JSON, HTML, JS, CSS).
- **JSON validation** via `node skills/ai-news-weekly/scripts/validate-news-json.mjs` (see Step 6).
- **Archive index** via `node scripts/sync-archive-manifest.mjs` from the repo root (see Step 5).
- **Optional** week lookup: `node scripts/week-key-from-date.mjs YYYY-MM-DD` (uses `archive/manifest.json`).
- **Optional web lookup** when curating (browser, search, or any MCP you choose—none required by this repo).
- **Git** when publishing to GitHub Pages.

## When to Use

Use this skill when the request is to create a new weekly news edition, update `Current` to that week, or publish a weekly refresh to GitHub Pages.

Typical triggers:

- "Create this week's AI news"
- "Add Week 15"
- "Update current news and publish"
- "Build this week's FIT Automate AI brief"

## Required Inputs

Collect these from user if missing:

- Target week key (example: `2026-14`)
- Date window text (example: `Mar 29-Apr 4, 2026`)
- Data date (`YYYY-MM-DD`)
- Whether to push live after update

## Workflow

### Step 1: Gather project context

1. Read [README.md](../../README.md), [app.js](../../app.js), [index.html](../../index.html), and current [news-data.json](../../news-data.json).
2. Confirm archive naming: `archive/news-YYYY-WW.json`.
3. Confirm week discovery: [archive/manifest.json](../../archive/manifest.json) (rebuilt in Step 5) and [app.js](../../app.js) (loads manifest at runtime).

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

### Step 4: Roll current week forward

1. Copy the finalized weekly dataset into [news-data.json](../../news-data.json).
2. Ensure `Current` now points to the new week's content.

### Step 5: Wire UI and docs

1. From the repo root, run `node scripts/sync-archive-manifest.mjs` to refresh [archive/manifest.json](../../archive/manifest.json) (week selector is built from this file; do not hand-edit `app.js` week maps).
2. Update page metadata in [index.html](../../index.html):
   - `<title>` month/year
   - description date
   - hero "Updated" date
   - footer data date
   - script version cache-bust token on the `app.js` script tag

### Step 6: Validate before commit

1. Run [validate-news-json.mjs](scripts/validate-news-json.mjs) against:
   - `news-data.json`
   - `archive/news-YYYY-WW.json`
2. If validation fails, fix data and re-run.
3. Confirm links and dates are consistent.

### Step 7: Commit and publish (if requested)

1. Run git status in repo.
2. Stage only weekly-news files (see [Publish Procedure](references/publish-procedure.md)).
3. Avoid staging unrelated modified files.
4. Commit with clear message, then push `main`.

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
4. Updated `index.html` metadata and cache-bust token
5. Optional commit/push confirmation when requested
