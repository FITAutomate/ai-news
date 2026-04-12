# Publish Procedure

Use this sequence only when user asks to publish.

## Safe Git Flow

1. Check status from the repository root:

   `git status --short --branch`

2. Stage only relevant weekly files:

   - `index.html`
   - `news-data.json`
   - `archive/news-YYYY-WW.json`
   - `archive/manifest.json` (whenever a new archive week was added or dates/labels changed)

3. Commit:

   `git commit -m "Add Week XX AI news and update current week"`

4. Push:

   `git push origin main`

## Guardrails

- Do not stage unrelated modified files.
- If unrelated modifications exist, leave them untouched unless user explicitly asks otherwise.
- Report commit hash and push result in final response.
