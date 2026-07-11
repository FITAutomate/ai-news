# ai-news-weekly

Repository-local skill for producing FIT Automate **Weekly AI News Insights** releases.

## Files

- `SKILL.md` — Main workflow instructions (v1.3.0+)
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
- Updated `src/pages/index.astro` (title/description, kicker fallback, `app.js` cache-bust token)
- Optional publish to `origin/main` (push triggers the Cloudflare Pages deploy)

## Do not touch on a weekly run

- `app.js` (unless this is an explicit UI change)
- `src/styles/brand.css` / masthead markup
- Root `index.html` (removed; do not recreate)
