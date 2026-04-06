# Publish Procedure

Use this sequence only when user asks to publish.

## Safe Git Flow

1. Check status:
   - `git -C D:\DesktopCommander\ai-news status --short --branch`
2. Stage only relevant weekly files:
   - `README.md`
   - `app.js`
   - `index.html`
   - `news-data.json`
   - `archive/news-YYYY-WW.json`
3. Commit:
   - `git -C D:\DesktopCommander\ai-news commit -m "Add Week XX AI news and update current week"`
4. Push:
   - `git -C D:\DesktopCommander\ai-news push origin main`

## Guardrails

- Do not stage unrelated modified files.
- If unrelated modifications exist, leave them untouched unless user explicitly asks otherwise.
- Report commit hash and push result in final response.