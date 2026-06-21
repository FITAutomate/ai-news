# ai-news-weekly

Repository-local skill for producing FIT Automate weekly AI News Pulse releases.

## Files

- `SKILL.md` — Main workflow instructions
- `scripts/validate-news-json.mjs` — Schema/quality validator
- `references/weekly-update-checklist.md` — File touchpoint checklist
- `references/source-selection-rules.md` — Editorial/source guardrails
- `references/publish-procedure.md` — Git commit/push guardrails
- `assets/week-news-template.json` — Starter JSON skeleton

## Quick Commands

Validate current files (from repo root):

```powershell
node skills/ai-news-weekly/scripts/validate-news-json.mjs news-data.json archive/news-2026-14.json
```

Rebuild the archive week list for the site:

```powershell
node scripts/sync-archive-manifest.mjs
```

## Expected Output Per Week

- New archive file `archive/news-YYYY-WW.json`
- Updated `news-data.json`
- Updated `archive/manifest.json` (via `scripts/sync-archive-manifest.mjs`)
- Updated `src/pages/index.astro` (metadata and `app.js` cache-bust token; root `index.html` is the GitHub Pages redirect shim — not edited)
- Optional publish to `origin/main` (push triggers the Cloudflare Pages deploy)
