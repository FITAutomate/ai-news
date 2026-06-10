# Review checklist — Issue #8 Cloudflare Pages preview smoke-test (ai-news)

**Issue:** #8 · **Author:** Nico · **Date prepared:** 2026-06-10 · **Status:** PENDING — run after John completes the dashboard Connect-to-Git step and the first `*.pages.dev` deploy succeeds.

**Target URL:** `https://ai-news.pages.dev/` (fill in actual once assigned: `__________`)
**Production branch:** `main` · **Expected source SHA:** output of `git rev-parse origin/main` at deploy time: `__________`

> This checklist verifies #8's acceptance criteria. It is reviewer/owner-runnable; the steps needing a browser must be run outside the sandbox (the sandbox has no browser). Record results in the table at the bottom and link this file from the PR.

## A. Deployment provenance (Git-generated, not upload)
- [ ] Cloudflare dashboard → Workers & Pages → `ai-news` → **Deployments**: latest deployment's trigger shows a **GitHub commit on `main`** (a Git deployment, not a Direct Upload).
- [ ] The deployment's **source commit SHA matches** `git rev-parse origin/main` (record both below).
- [ ] Build log shows `prebuild` staging ran (i.e. `public/` assembled) before `astro build`.

## B. Reachability
- [ ] `curl -I https://ai-news.pages.dev/` → **`200 OK`**.
- [ ] `curl -sI https://ai-news.pages.dev/news-data.json` → `200` (weekly data asset served).
- [ ] `curl -sI https://ai-news.pages.dev/archive/manifest.json` → `200` (archive manifest served).

## C. Browser smoke-test (run in a real browser)
- [ ] Page loads; **12 news cards** render in `#newsGrid`.
- [ ] Stats block (`#stats`) populates.
- [ ] Week selector (`#weekSelect`) lists **24 week options**; switching weeks updates the grid.
- [ ] All assets load (icon, background, fonts) — no 404s in the Network tab.
- [ ] **Console is clean** (0 errors).
- [ ] No horizontal overflow at desktop (1280×900) and mobile (390×844).

## D. Brand sanity (Quinn's call for sign-off)
- [ ] FIT dark slate canvas, fit-blue accents, Poppins/Open Sans/JetBrains Mono present (matches the merged #7 brand).
- [ ] Preview matches the merged `main` build (no regressions vs the #7 result).
- [ ] **Quinn** has eyeballed the live preview and is OK with brand-on-preview.

## E. Boundary confirmation (must remain true)
- [ ] No DNS record created for `ai-news.fitautomate.com` (site is on `*.pages.dev` only).
- [ ] `fitautomate.github.io/ai-news/` (GitHub Pages) still serves as production, unchanged.
- [ ] No `wrangler` production deploy used; deployment was Git-generated.

## Results log
| Item | Result | Evidence / notes | Checked by | Date |
|---|---|---|---|---|
| A. Provenance (trigger + SHA) | | expected SHA `____` vs deployed `____` | | |
| B. curl 200s | | | | |
| C. Browser render | | | | |
| D. Brand sanity | | | | |
| E. Boundary intact | | | | |

**Overall:** ☐ PASS ☐ FAIL — notes: ____________________
