# Evidence — Issue #8 Cloudflare Pages Git-integration config (ai-news)

**Issue:** #8 — Deploy AI News Astro build to a Cloudflare Pages preview (no DNS, no production)
**Author:** Nico · **Date:** 2026-06-10 · **Status:** repo-side config record; dashboard "Connect to Git" step is John's (account holder).

This is the committed settings record required by #8 ("a committed settings record capturing the exact Git-integration configuration"). Cloudflare Pages Git projects are configured in the dashboard, not via a repo `wrangler.toml`; this file is the repo-side source of truth for those dashboard values. Procedure: `.agent/prp/procedures/cloudflare-deploy-astro-via-pages.md`.

## Inputs from John (2026-06-10)
- **Q3 — account/project:** use the EXISTING FIT Cloudflare account that already holds the control plane and the other Pages projects (`fit-web-salon`, `r-b`). No new account, no new org.
- **Q4 — hostname:** intended production host is `ai-news.fitautomate.com` (named in issue #9; matches the `agents.` / `n8n-insights.` subdomain pattern). **Shape the project for it, but NO DNS in #8.**

## Exact dashboard configuration to enter

| Setting | Value | Notes |
|---|---|---|
| Create flow | Workers & Pages → Create application → Pages → **Connect to Git** | Git-integration, not Direct Upload |
| Cloudflare account | Existing FIT account (holds `fit-web-salon`, `r-b`) | Q3 |
| Git provider / repo | GitHub → **`FITAutomate/ai-news`** | Authorize the FITAutomate org if prompted |
| Project name | **`ai-news`** | → `ai-news.pages.dev` |
| Production branch | **`main`** | PR #11/#12 already merged to `main` |
| Framework preset | **Astro** | |
| Build command | **`npm run build`** | ⚠️ MUST be `npm run build`, NOT `astro build` — see "Build gotcha" below |
| Build output directory | **`dist/`** | Astro default; verified in PR #11/#12 |
| Root directory | **`/`** | Not a monorepo |
| Node version | **22+** | Pinned via `.nvmrc` + `engines` (`>=22`). If the builder defaults to <22, set `NODE_VERSION=22` build env var |
| Build env vars / secrets | **NONE required** | See "Secrets" below |

## Build gotcha (critical) — staged `public/`
The repo stages its canonical assets into a **gitignored `public/`** at build time via `scripts/stage-astro-public.mjs`, wired as the npm **`prebuild`** hook (`package.json`). On a clean Cloudflare builder, `public/` does not exist in the checkout, so:
- **`npm run build`** runs `prebuild` (stage `public/`) → then `astro build`. ✅ Produces complete `dist/` (incl. `news-data.json`, `archive/` 24 files, `icon.png`, `news-bg.png`).
- Setting the build command to **`astro build`** directly skips staging → `public/` missing → broken `dist/` (no weekly data/assets). ❌

So the build command field **must** be `npm run build`.

## Secrets — none needed at build time (verified 2026-06-10)
The #7 brand work uses Starwind **Pro**, but the license is **NOT** needed for a Cloudflare build:
- `package.json` `dependencies` contains **no `@starwind-pro/*` package** — only `astro@^6.4.4`, `tailwindcss@^4`, `@tailwindcss/vite`, `@tailwindcss/forms`, `tailwind-merge`, `tailwind-variants`, `tw-animate-css`, `@tabler/icons`. (SHA `5c14a4c`.)
- `components.json` scopes `STARWIND_LICENSE_KEY` to the **`@starwind-pro` generation registry** (`https://pro.starwind.dev/r/{name}`) — used by the Starwind CLI to *generate* components at dev time, which are already committed to `src/`. It is not a build-time dependency. (SHA `54c0b2e`.)
- **No `.npmrc`** in the repo → `npm ci` resolves only the public npm registry.

**Conclusion:** `npm ci && npm run build` on a clean builder needs no license and no private-registry auth. **Do not** add `STARWIND_LICENSE_KEY` to the Cloudflare project. (The license is only needed locally when a developer regenerates/adds Starwind components.)

## Scope boundary held (#8)
- **No DNS:** no `ai-news.fitautomate.com` CNAME/record in this issue. Site stays on `ai-news.pages.dev`.
- No GitHub Pages retirement; `fitautomate.github.io/ai-news/` remains canonical production throughout #8.
- No production traffic routing; no `wrangler` production deploy.
- Brand-on-preview review is Quinn's once the `*.pages.dev` URL is live.

## Acceptance verification plan (run after John connects — see smoke-test checklist)
1. Dashboard: latest deployment trigger = GitHub commit on `main`; source SHA == `git rev-parse origin/main`.
2. `curl -I https://ai-news.pages.dev/` → `200 OK`.
3. Browser smoke test: 12 cards, stats, 24 week options, assets load, console clean, brand intact.
Checklist: `.agent/prp/reviews/2026-06-10-issue8-pages-smoke-test.md`.

## Field outcome (2026-06-10) — first deploy + root-directory fix
- **First attempt failed.** The dashboard setup initially set **Root directory = `web`** (carried over from the existing internal FIT procedure / the `web/` layout used by the fit-docs repos). Result: build failed in ~9s with `Error: Cannot find cwd: /opt/buildhome/repo/web` — *before* npm ran. (The log's `No Wrangler configuration file found. Continuing.` line is normal and was **not** the cause.)
- **Fix:** set Root directory to the **repo root** (blank / `/`); build command `npm run build` and output `dist/` were already correct and left unchanged. Retry → **green build**.
- **Verified live 2026-06-10:** `https://ai-news.fitautomate.com/` → `200`; `news-data.json`, `archive/manifest.json`, `icon.png` → `200`; in-browser render shows **12 cards, stats populated, 24 week options**. Custom domain **Active + SSL**; DNS `ai-news.fitautomate.com` CNAME → `ai-news-7oh.pages.dev` (Cloudflare-proxied). Actual project name came up as **`ai-news-7oh`** (Cloudflare auto-suffixed); the custom domain makes the `*.pages.dev` name moot.
- **Confirmed:** Root directory **MUST** be the repo root for `ai-news`, **not** `web`. The procedure (`.agent/prp/procedures/cloudflare-deploy-astro-via-pages.md`) now carries this gotcha + a correction flag for the older internal procedure (route to forge#1).

## Open items for John / owner
- **Dashboard step is yours:** I have no Cloudflare integration in this runtime; the Connect-to-Git click and first deploy are a dashboard action for the FIT account holder.
- Confirm the project name `ai-news` is free in the FIT account (no collision with existing projects).
- After the first deploy, paste the assigned `*.pages.dev` URL into PR #<this PR> so the smoke test can be completed and recorded.
