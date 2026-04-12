# Weekly Update Checklist

Use this checklist to produce each weekly AI News Pulse release.

## File Targets (repository root)

- `archive/news-YYYY-WW.json`
- `archive/manifest.json` (regenerate with `node scripts/sync-archive-manifest.mjs`)
- `news-data.json`
- `index.html` (metadata + `app.js` cache-bust only; week options are generated from the manifest)

## Checklist

1. Confirm target week key and date window.
2. Create archive file with validated schema.
3. Copy week content into `news-data.json`.
4. Run `node scripts/sync-archive-manifest.mjs` from the repo root.
5. Update `index.html` title, description date, hero updated date, footer data date, and script version token.
6. Validate JSON with `node skills/ai-news-weekly/scripts/validate-news-json.mjs news-data.json archive/news-YYYY-WW.json`.
7. If user requests publish: commit and push (include `archive/manifest.json` when the week list changed).

## Completion Criteria

- New week appears in the selector and loads correctly.
- `Current` week reflects the new release.
- JSON has 12 stories unless explicitly requested otherwise.
- No unrelated files are staged in commit.
