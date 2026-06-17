# Cloudflare — Deploy an Astro Site via Pages (Git integration)

> **STATUS: DRAFT-FOR-PROMOTION.** Authored by Nico (integration engineer) as a deliverable inside ai-news issue #8. This is a working draft stored in the `ai-news` repo. The canonical home for FIT procedures (fit-sops vs forge vs docs) is the ownership reconciliation pending in **forge#1** — the promotion decision routes there and must NOT block #8. Until promoted, treat this as the working reference for FIT Astro→Pages deploys; do not cite it as canonical.
>
> **Lane note:** This is an integration runbook (Nico's lane). It contains no external-facing copy and makes no naming/scope/pricing decisions. Promotion + canonical naming is Quinn/Sage's call via forge#1.

**Last updated:** 2026-06-10 · **Author:** Nico · **Applies to:** Astro static-output sites deployed to Cloudflare Pages via the dashboard **Connect to Git** flow (NOT local `wrangler` upload).

> **⚠️ Correction flag — existing internal procedure (raised 2026-06-10):** The internal FIT deploy procedure that predates this doc instructs setting the Pages **root / deployment directory to `web`**. That value is correct only for `web/`-layout repos (fit-docs / fit-solutions) and **breaks root-layout Astro repos like `ai-news`** — it caused the first `ai-news` deploy to fail (see §4.3). The older procedure needs correcting; the fix + the canonical-home decision are tracked via **forge#1** (Quinn / Sage). Exact path of the offending doc is pending confirmation from John.

---

## 1. Purpose & scope

Connect a GitHub repo to a Cloudflare Pages project using Cloudflare's **Git integration** so Pages builds and deploys automatically on every push to the production branch, and serves on a Cloudflare-assigned `*.pages.dev` URL. Custom domains / DNS are a **separate** step handled outside this procedure.

This is the FIT-canonical deploy mechanism for static Astro sites. Deployments are **Git-generated** (push → build → deploy), not local uploads.

## 2. Prerequisites

- A Cloudflare account with Workers & Pages access.
- A GitHub repository whose default/production branch builds a static Astro site to a known output directory (`dist/` for Astro).
- At least one branch pushed to the repo (required to select a production branch in the dashboard).
- Node version known and pinned in-repo (`.nvmrc` and/or `engines` in `package.json`).
- Confirmation of whether the build needs any **build-time** environment variables/secrets (see §4.3). Many static builds need none.

## 3. One-way-door caveat (read before connecting)

Per Cloudflare: **"If you deploy using the Git integration, you cannot switch to Direct Upload later."** Choose Git integration deliberately. (You can later *disable* automatic deployments per-branch and fall back to `wrangler` for manual deploys, but the project stays a Git-integration project.)
Source: Cloudflare Pages — Git integration (retrieved 2026-06-10).

## 4. Procedure (dashboard Connect-to-Git)

### 4.1 Create the project & connect the repo
1. Cloudflare dashboard → **Workers & Pages**.
2. **Create application → Pages → Connect to Git**.
3. Sign in / authorize the Cloudflare Git app for the GitHub account or org that owns the repo. (Authorize the specific org if the repo lives under an organization.)
4. Select the repository. Public and private repos are both supported.
5. **Install & Authorize → Begin setup.**

### 4.2 Project name & production branch
- **Project name** → becomes the `*.pages.dev` hostname prefix; defaults to the Git repo name. Set it intentionally.
- **Production branch** → the branch Pages deploys as production (normally `main`). Every *other* branch becomes a preview deployment with its own preview URL, and PRs get preview URLs + status checks.

### 4.3 Build settings
- **Framework preset:** Astro. The preset fills in default build command + output dir, but verify them against the repo (below).
- **Build command:** use the repo's package.json `build` script via **`npm run build`** — do **not** hardcode `astro build` if the repo relies on `prebuild`/`postbuild` hooks (Cloudflare runs the npm lifecycle, so `npm run build` triggers them; calling `astro build` directly skips them).
- **Build output directory:** `dist/` (Astro default).
- **Root directory:** the **repo root** (leave blank, or `/`) unless it's a genuine monorepo. ⚠️ **Field-tested gotcha (`ai-news`, 2026-06-10):** do **not** set this to `web`. `web/` is the presentation-layer layout used by the fit-docs / fit-solutions repos; `ai-news` keeps its Astro project at the repo root. Setting root to `web` fails the build in ~9 seconds with `Error: Cannot find cwd: /opt/buildhome/repo/web`, *before* npm runs.
- **Node version:** Cloudflare reads `.nvmrc` / `.node-version`, or a `NODE_VERSION` build env var. If the repo requires Node ≥ a specific major and the default builder image is older, set `NODE_VERSION` explicitly.

### 4.4 Environment variables
- Set any required **build-time** key-value pairs here, **by name** (values entered in the dashboard, never committed).
- If the build does **not** import any private/licensed packages and uses no build-time secrets, leave this empty. Confirm by checking `package.json` `dependencies` (not just devDependencies), any `.npmrc`, and tool config files for private-registry references.

### 4.5 Deploy & capture the URL
- **Save and Deploy.** Watch the build logs (install → build → deploy).
- On success, record the assigned `https://<project>.pages.dev` URL.

## 5. Verification (acceptance)
- In **Workers & Pages → <project> → Deployments**, confirm the latest deployment's trigger is a **GitHub commit on the production branch** (a Git deployment, not a direct upload), and its source commit SHA matches `git rev-parse origin/<production-branch>`.
- `curl -I https://<project>.pages.dev/` → `200 OK`.
- Browser smoke test: page renders, all assets load, runtime data loads, console is clean.

## 6. Boundaries & anti-patterns
- **Do not** use `wrangler pages deploy` as the production deploy path. Local `wrangler` is acceptable only for an ad-hoc developer smoke test.
- Custom domain / DNS (CNAME) is a separate procedure — connecting Git does **not** create DNS records; the site stays on `*.pages.dev` until a custom domain is explicitly added.
- Deleting a Pages project that has a custom domain requires removing the CNAME first; a `*.pages.dev`-only project can be deleted directly.

## 7. Branch deployment controls (optional)
Pages → **Settings → Builds & deployments**: change production branch, toggle **Enable automatic production branch deployments**, and set preview-branch policy (All non-production / None / Custom with wildcard include/exclude rules).
Source: Cloudflare Pages — Branch deployment controls (retrieved 2026-06-10).

## 8. References (primary; retrieved 2026-06-10)
- Cloudflare Pages — Get started: Git integration — https://developers.cloudflare.com/pages/get-started/git-integration/
- Cloudflare Pages — Configuration: Git integration — https://developers.cloudflare.com/pages/configuration/git-integration/
- Cloudflare Pages — Branch deployment controls — https://developers.cloudflare.com/pages/configuration/branch-build-controls/

*All sources are Cloudflare first-party documentation (primary). No vendor-marketing or third-party sources used. Dashboard UI labels can change; re-verify wording at promotion time (forge#1).*
