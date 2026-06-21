# Publish Procedure

Use this sequence only when user asks to publish. Publishing is a push to `main`, which
triggers a Cloudflare Pages build and deploy to https://ai-news.fitautomate.com (no GitHub
Pages step).

## Safe Git Flow

1. Check status from the repository root:

   `git status --short --branch`

2. Stage only relevant weekly files:

   - `src/pages/index.astro` (page metadata + `app.js` cache-bust token; root `index.html` is the GitHub Pages redirect shim — do not stage it)
   - `news-data.json`
   - `archive/news-YYYY-WW.json`
   - `archive/manifest.json` (whenever a new archive week was added or dates/labels changed)

3. Commit:

   `git commit -m "Add Week XX AI news and update current week"`

4. Push:

   `git push origin main`

5. Verify deploy: the push triggers the Cloudflare Pages build. Confirm the new week is live
   at https://ai-news.fitautomate.com (selector lists it, console clean). Optionally confirm the
   Cloudflare dashboard deployment's commit matches `main` HEAD.

## Guardrails

- Do not stage unrelated modified files.
- If unrelated modifications exist, leave them untouched unless user explicitly asks otherwise.
- Report commit hash, push result, and the verified Cloudflare deploy URL in final response.
