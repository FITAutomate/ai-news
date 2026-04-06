# Weekly Update Checklist

Use this checklist to produce each weekly AI News Pulse release.

## File Targets

- `D:\DesktopCommander\ai-news\archive\news-YYYY-WW.json`
- `D:\DesktopCommander\ai-news\news-data.json`
- `D:\DesktopCommander\ai-news\app.js`
- `D:\DesktopCommander\ai-news\index.html`
- `D:\DesktopCommander\ai-news\README.md`

## Checklist

1. Confirm target week key and date window.
2. Create archive file with validated schema.
3. Copy week content into `news-data.json`.
4. Add week key and file path in `WEEK_FILE_MAP` in `app.js`.
5. Add new selector option in `index.html` week dropdown.
6. Update `index.html` title, description date, hero updated date, footer data date, and script version token.
7. Update README week mapping list.
8. Validate JSON files with `scripts/validate-news-json.mjs`.
9. If user requests publish: commit and push.

## Completion Criteria

- New week appears in selector and loads correctly.
- `Current` week reflects the new release.
- JSON has 12 stories unless explicitly requested otherwise.
- No unrelated files are staged in commit.