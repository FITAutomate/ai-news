# Weekly Update Checklist

Use this checklist to produce each **Weekly AI News Insights** release.

## File Targets

Repository root:

- `archive/news-YYYY-WW.json`
- `archive/manifest.json` (regenerate with `node scripts/sync-archive-manifest.mjs`)
- `news-data.json`

Production page:

- `src/pages/index.astro` (metadata + kicker fallback + `app.js` cache-bust token; week options come from the manifest)

Leave alone on a normal weekly run:

- `app.js`
- `src/styles/brand.css`
- Masthead / hero structure in `index.astro` (brand lockup, `#weekSelect`)

## Checklist

1. Confirm target week key (`YYYY-WW`) and Saturday data date.
2. Create archive file with validated schema (`meta` includes `updatedLabel`, `dataDate`, `window`, `themes` — window/themes are archive fields, not header UI).
3. Copy week content into `news-data.json`.
4. Run `node scripts/sync-archive-manifest.mjs` from the repo root.
5. Update `src/pages/index.astro`:
   - `<title>`: `Weekly AI News Insights - {Month YYYY}`
   - `<meta name="description">` date
   - Hero kicker fallback: `Week {WW} · Updated {Month DD, YYYY}`
   - Footer data-date fallback
   - `app.js` cache-bust token
6. Validate JSON with `node skills/ai-news-weekly/scripts/validate-news-json.mjs news-data.json archive/news-YYYY-WW.json`.
7. Run `npm run build` from the repo root (stages root data into Astro `public/` + `astro build`) as a pre-push smoke check.
8. If user requests publish: commit and push (include `archive/manifest.json` when the week list changed), then verify the Cloudflare deploy at https://ai-news.fitautomate.com.

## Completion Criteria

- New week appears in the selector and loads correctly.
- Hero kicker shows `Week NN · Updated …` for Current and for archive picks.
- `Current` week reflects the new release.
- JSON has 12 stories unless explicitly requested otherwise.
- Header still has no Window/Themes/Stories stat strip.
- `npm run build` is clean before push.
- No unrelated files (and no accidental `app.js`) are staged in the weekly commit.
- When published: the Cloudflare deploy at https://ai-news.fitautomate.com shows the new week.
