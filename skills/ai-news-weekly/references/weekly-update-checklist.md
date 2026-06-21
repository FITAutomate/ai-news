# Weekly Update Checklist

Use this checklist to produce each weekly AI News Pulse release.

## File Targets

Repository root:

- `archive/news-YYYY-WW.json`
- `archive/manifest.json` (regenerate with `node scripts/sync-archive-manifest.mjs`)
- `news-data.json`

Production page:

- `src/pages/index.astro` (metadata + `app.js` cache-bust token; week options are generated from the manifest). Root `index.html` is now only the GitHub Pages redirect shim — do not edit it.

## Checklist

1. Confirm target week key and date window.
2. Create archive file with validated schema.
3. Copy week content into `news-data.json`.
4. Run `node scripts/sync-archive-manifest.mjs` from the repo root.
5. Update `src/pages/index.astro`: `<title>` month/year, `<meta name="description">` date, and the `app.js` cache-bust token. (Hero "Updated" date and footer data date are runtime-driven by `news-data.json` `meta` — set in Steps 2-3; update the static fallbacks to match.)
6. Validate JSON with `node skills/ai-news-weekly/scripts/validate-news-json.mjs news-data.json archive/news-YYYY-WW.json`.
7. Run `npm run build` from the repo root (stages root data into Astro `public/` + `astro build`) as a pre-push smoke check.
8. If user requests publish: commit and push (include `archive/manifest.json` when the week list changed), then verify the Cloudflare deploy at https://ai-news.fitautomate.com.

## Completion Criteria

- New week appears in the selector and loads correctly.
- `Current` week reflects the new release.
- JSON has 12 stories unless explicitly requested otherwise.
- `npm run build` is clean before push.
- No unrelated files are staged in commit.
- When published: the Cloudflare deploy at https://ai-news.fitautomate.com shows the new week.
