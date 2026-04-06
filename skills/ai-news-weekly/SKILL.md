---
name: ai-news-weekly
description: Creates and publishes the FIT Automate weekly AI News Pulse update for D:\\DesktopCommander\\ai-news, including research, archive JSON creation, current-week rollover, UI selector updates, and GitHub Pages publish steps.
version: 1.0.0
---

# AI News Weekly

## Overview

This skill standardizes the weekly AI News Pulse publishing workflow for the `D:\DesktopCommander\ai-news` project. It covers source collection, story curation, JSON generation, site wiring, quality checks, and publish steps.

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

1. Read [README](D:/DesktopCommander/ai-news/README.md), [app.js](D:/DesktopCommander/ai-news/app.js), [index.html](D:/DesktopCommander/ai-news/index.html), and current [news-data.json](D:/DesktopCommander/ai-news/news-data.json).
2. Confirm existing archive naming pattern: `archive/news-YYYY-WW.json`.
3. Confirm selector map location in [app.js](D:/DesktopCommander/ai-news/app.js).

Use [Weekly Update Checklist](references/weekly-update-checklist.md) for exact file touchpoints.

### Step 2: Collect and verify candidate stories

1. Build candidate list using `mcp__acp-ai-sdk-tools__google_search`.
2. Verify each final source URL using `mcp__acp-ai-sdk-tools__scrape`.
3. Favor a balanced mix across policy, business, infrastructure/chips, and builder tooling.
4. Keep stories in target week window only.

Use [Source Selection Rules](references/source-selection-rules.md) to keep quality consistent.

### Step 3: Build weekly archive JSON

1. Create `D:\DesktopCommander\ai-news\archive\news-YYYY-WW.json`.
2. Use [week-news-template.json](assets/week-news-template.json) as structure baseline.
3. Keep schema fields exactly:
   - `meta.updatedLabel`, `meta.dataDate`, `meta.window`, `meta.themes`
   - `news[]` with `category,date,title,summary,source,sourceLabel,rating,tags`
4. Use 12 stories unless user explicitly requests a different count.

### Step 4: Roll current week forward

1. Copy the finalized weekly dataset into [news-data.json](D:/DesktopCommander/ai-news/news-data.json).
2. Ensure `Current` now points to the new week's content.

### Step 5: Wire UI and docs

1. Update `WEEK_FILE_MAP` in [app.js](D:/DesktopCommander/ai-news/app.js) with new week key.
2. Add week option in [index.html](D:/DesktopCommander/ai-news/index.html) selector.
3. Update page metadata in [index.html](D:/DesktopCommander/ai-news/index.html):
   - `<title>` month/year
   - description date
   - hero "Updated" date
   - footer data date
   - script version cache-bust token
4. Update week mapping list in [README.md](D:/DesktopCommander/ai-news/README.md).

### Step 6: Validate before commit

1. Run [validate-news-json.mjs](scripts/validate-news-json.mjs) against:
   - `D:\DesktopCommander\ai-news\news-data.json`
   - `D:\DesktopCommander\ai-news\archive\news-YYYY-WW.json`
2. If validation fails, fix data and re-run.
3. Confirm links and dates are consistent.

### Step 7: Commit and publish (if requested)

1. Run git status in repo.
2. Stage only weekly-news files.
3. Avoid staging unrelated modified files.
4. Commit with clear message, then push `main`.

Use [Publish Procedure](references/publish-procedure.md) for safe staging and push sequence.

## Scripts

- [validate-news-json.mjs](scripts/validate-news-json.mjs) - Validates required JSON fields, story count, field presence, and date format.

## References

- [Weekly Update Checklist](references/weekly-update-checklist.md) - File-by-file execution checklist.
- [Source Selection Rules](references/source-selection-rules.md) - Editorial and sourcing constraints.
- [Publish Procedure](references/publish-procedure.md) - Git staging, commit, and push flow.

## Assets

- [week-news-template.json](assets/week-news-template.json) - Starter structure for weekly archive files.

## Output Expectations

A completed run should produce:
1. New archive file: `archive/news-YYYY-WW.json`
2. Updated current file: `news-data.json`
3. Updated selector/map/docs files (`app.js`, `index.html`, `README.md`)
4. Optional commit/push confirmation when requested