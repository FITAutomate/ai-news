# AI News Pulse

AI News Pulse is the FIT Automate weekly AI brief for high-level, actionable updates.

## Current behavior

- Homepage defaults to `news-data.json` (current week)
- Week selector in top menu can load archive weeks
- Links open in the same tab
- Cards show:
  - category emoji
  - rating stars
  - tags

### Week selector files

- `Current` -> `news-data.json`
- `2026-W01` -> `archive/news-2026-01.json`
- `2026-W02` -> `archive/news-2026-02.json`
- `2026-W03` -> `archive/news-2026-03.json`
- `2026-W04` -> `archive/news-2026-04.json`
- `2026-W05` -> `archive/news-2026-05.json`
- `2026-W06` -> `archive/news-2026-06.json`
- `2026-W07` -> `archive/news-2026-07.json`
- `2026-W08` -> `archive/news-2026-08.json`
- `2026-W09` -> `archive/news-2026-09.json`
- `2026-W10` -> `archive/news-2026-10.json`

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

## Appearance adjustments

Background image visibility is controlled in `styles.css` inside the `body` `background:` stack.

Primary control (most important):

```css
linear-gradient(rgba(0, 0, 61, 0.66), rgba(0, 0, 61, 0.74)),
```

- Lower these two alpha values to reveal more of `news-bg.png`.
- Raise them to darken the page for stronger text contrast.
- Small changes (0.03 to 0.08) are usually enough.

Suggested presets:
- Slightly more visible (~10%): `0.66 / 0.74`
- More visible (~20%): `0.60 / 0.68`

Secondary controls (subtle effect):

```css
radial-gradient(circle at 10% 10%, rgba(0, 124, 232, 0.27) 0%, transparent 42%),
radial-gradient(circle at 88% 14%, rgba(28, 208, 0, 0.18) 0%, transparent 34%),
```

- Lower these if you want less color glow over the photo.
- Keep readability in mind on cards and small text.

After changes:
1. Save `styles.css`
2. Hard refresh browser (`Ctrl+F5`)

## Deploy

- Repo: `https://github.com/FITAutomate/ai-news`
- Pages: `https://fitautomate.github.io/ai-news/`
- Branch: `main`
- Folder: `/(root)`
