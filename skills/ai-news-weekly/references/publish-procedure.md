# Publish Procedure

Use this sequence only when user asks to publish. Publishing is a push to `main`, which
triggers a Cloudflare Pages build and deploy to https://ai-news.fitautomate.com.

## Safe Git Flow

1. Check status from the repository root:

   `git status --short --branch`

2. Stage only relevant weekly files:

   - `src/pages/index.astro` (page metadata + kicker fallback + `app.js` cache-bust token)
   - `news-data.json`
   - `archive/news-YYYY-WW.json`
   - `archive/manifest.json` (whenever a new archive week was added or dates/labels changed)

3. Do **not** stage on a normal weekly publish:

   - `app.js` / `src/styles/brand.css` (UI-only PRs)
   - Unrelated lockfile or tooling churn
   - A recreated root `index.html`

4. Commit:

   `git commit -m "Add Week XX AI news and update current week"`

5. Push:

   `git push origin main`

6. Verify deploy: the push triggers the Cloudflare Pages build. Confirm the new week is live
   at https://ai-news.fitautomate.com (selector lists it, kicker shows Week NN, console clean).
   Optionally confirm the Cloudflare dashboard deployment's commit matches `main` HEAD.

## Guardrails

- Do not stage unrelated modified files.
- If unrelated modifications exist, leave them untouched unless user explicitly asks otherwise.
- Report commit hash, push result, and the verified Cloudflare deploy URL in final response.
