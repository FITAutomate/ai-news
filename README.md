# AI News Pulse

AI News Pulse is the FIT Automate weekly AI brief for high-level, actionable updates.

## Current behavior

- Homepage reads from `news-data.json` (current week only)
- Links open in the same tab
- Cards show:
  - category emoji
  - rating stars
  - tags

## Data schema (`news-data.json`)

Top-level:
- `meta.updatedLabel`
- `meta.dataDate` (YYYY-MM-DD)
- `meta.window`
- `meta.themes`
- `news[]`

Each `news[]` item:
- `category`
- `date` (YYYY-MM-DD)
- `title`
- `summary`
- `source`
- `sourceLabel`
- `rating` (1-5)
- `tags` (array of 2-5)

## Project files

- `index.html`
- `styles.css`
- `app.js`
- `news-data.json`
- `archive/news-YYYY-WW.json`
- `update-plan.md`

## Local test

```powershell
cd D:\DesktopCommander\ai-news
python -m http.server 8080
```

Then open: `http://localhost:8080`

## Deploy

- Repo: `https://github.com/FITAutomate/ai-news`
- Pages: `https://fitautomate.github.io/ai-news/`
- Branch: `main`
- Folder: `/(root)`
