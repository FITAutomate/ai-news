# Implementation Issue Map -- AI News FIT Astro + Cloudflare migration

- **doc_id:** `plan-ai-news-implementation-issue-map-2026-06-06`
- **status:** research-backed recommendation for John / Quinn review -- NOT a final decision
- **owner of approval:** John (final), Quinn (naming / brand / scope), Sage (lane routing)
- **author:** Nico
- **date:** 2026-06-06
- **source PRP:** `.agent/prp/prds/2026-06-06-ai-news-hyperagent-bootstrap.prd.md`
- **operational issue:** `FITAutomate/ai-news#3`

## Summary

The bootstrap PRP asks for a small, ordered, executable proposal -- 3 to 5 implementation issues,
not a large phase tree. This plan proposes five issues. Each is independently mergeable, leaves
the previous deployment surface working until the cutover issue lands, and includes its own
acceptance criteria, validation commands, rollback boundary, and human approval gate.

The mapped issues, in order, are:

1. Astro skeleton conversion preserving the current weekly-data workflow.
2. FIT brand redesign on the Astro surface (Quinn-gated).
3. Cloudflare Pages preview deployment (no DNS, no production traffic).
4. DNS cutover to `ai-news.fitautomate.com` (Cloudflare custom domain); the old GitHub Pages URL
   becomes a canonical-link + client-side redirect shim (a github.io project page cannot emit a
   server-side 301).
5. GitHub Pages retirement and documentation cleanup, including handling of `update-plan.md`.

Issues 1-2 are repo-internal; 3 stands up a parallel environment; 4 is the only one that moves
production traffic; 5 is cleanup. No proposed issue performs more than one boundary crossing.

## Open inputs (must be answered before issue creation)

These questions are also enumerated in the access report. They are surfaced once here because
several of them appear as acceptance criteria below.

- Q1: Astro 5 + `pnpm`, or `npm`?
- Q2: Starwind UI (OSS) or Starwind Pro (licensed)?
- Q3: Is `fitautomate.com` already on Cloudflare nameservers? New Pages project or shared?
- Q4: Is `ai-news.fitautomate.com` already provisioned, or does that happen during cutover?
- Q5: Brand delivery mechanism. The canonical brand spec is confirmed committed at
  `fit-solutions/brand/` (`colors.md`, `typography.md`, `design-principles.md`, etc.) and is in
  MCP scope. Decision needed: consume it as (a) a pinned token snapshot copied into ai-news
  `src/styles/`, or (b) a shared package / git submodule. Either way the brand work reads from
  `fit-solutions/brand/` as the source of record, not from memory.
- Q6: `piv.config.yaml` taxonomy alignment with the FIT registry.
- Q7: Disposition of `update-plan.md` (archive or delete).
- Q8: Migration label set. The standard + Archon labels exist on the repo (created by John). The
  6 migration-specific labels in `.github/labels.yml` (`migration`, `standards`, `astro`,
  `brand`, `cloudflare`, `proposal`) are proposed but NOT yet created -- the GitHub MCP has no
  label-write verb. The "Suggested labels" on each issue below assume those labels exist; they
  must be created (manually or via a label-sync Action) before these issues are filed, OR the
  issues are filed first and labeled once the labels exist.

---

## Issue 1 -- Astro skeleton conversion (preserve weekly-data workflow)

**Title:** `Convert ai-news to an Astro skeleton preserving the weekly-data workflow`

**Suggested labels:** `migration`, `astro`, `archon-p1`, `proposal`

**Goal**

Convert the static `index.html` / `styles.css` / `app.js` surface to an Astro project structure
**without** changing visual design or page behavior. Keep `news-data.json`, `archive/`,
`scripts/sync-archive-manifest.mjs`, `scripts/week-key-from-date.mjs`, and
`skills/ai-news-weekly/` operating identically. No brand changes, no Starwind, no deploy work.

**Context files**

- `.agent/prp/prds/2026-06-06-ai-news-hyperagent-bootstrap.prd.md`
- `.agent/AGENT.md`
- `.agent/CONTEXT.md`
- Existing static surface: `index.html`, `styles.css`, `app.js`, `news-data.json`, `archive/`,
  `scripts/`, `skills/ai-news-weekly/`
- Open input: Q1, Q5

**In scope**

- `package.json`, `astro.config.mjs`, `tsconfig.json` (TypeScript optional but recommended).
- `src/pages/index.astro` rendering the same DOM the current `index.html` does.
- `src/scripts/` (or `src/components/`) hosting the existing `app.js` logic, intact.
- `src/styles/` carrying `styles.css` verbatim into the Astro pipeline.
- `public/` for `icon.png`, `news-bg.png`, `news-data.json`, `archive/`.
- A `pnpm build` (or `npm run build`) that produces a static `dist/` byte-for-byte equivalent to
  the current published site at `https://fitautomate.github.io/ai-news/` (modulo unavoidable
  bundler differences).

**Out of scope**

- Brand redesign.
- Component-library adoption (Starwind / Starwind Pro).
- Any Cloudflare or DNS work.
- Any change to `https://fitautomate.github.io/ai-news/` -- GitHub Pages stays on `main` and
  remains the live production surface during this issue.
- Changes to the weekly-data file format.

**Acceptance criteria**

- `pnpm install && pnpm build` (or npm equivalent) succeeds.
- `dist/index.html` renders the same content as the current production page.
- Existing weekly scripts continue to operate against `archive/` and `news-data.json`.
- No production deployment change; GitHub Pages still points at `main`.
- Astro project layout follows `.agent/CONTEXT.md`'s declared `astro` skill capability.

**Validation commands**

- `pnpm install`
- `pnpm build`
- `pnpm preview` (or `npm run preview`) and a manual visual diff against the live site.
- `node scripts/week-key-from-date.mjs 2026-06-06` -- confirms legacy scripts still work.
- `node scripts/sync-archive-manifest.mjs` -- confirms manifest sync still works.

**Rollback boundary**

This work lives entirely on a feature branch. The deployed GitHub Pages site continues to serve
from `main` until this PR is merged. If the merge produces a regression, revert via
`git revert <merge-sha>` -- one commit on `main`.

**Human approval gate**

John approves the PR before merge. Quinn does not need to gate this issue; no brand or naming
choices are made here.

---

## Issue 2 -- FIT brand redesign on the Astro surface

**Title:** `Apply FIT brand system to the AI News Astro site`

**Suggested labels:** `migration`, `brand`, `astro`, `archon-p1`, `proposal`

**Goal**

Apply the FIT Automate brand system to the now-Astro AI News surface: dark slate canvas
(`slate-950`), `slate-100` body text, `fit-blue` (`#007CE8`) as the sole accent, `fit-green`
(`#1CD000`) for status pills only, Poppins headings / Open Sans body / JetBrains Mono for data.
Decide on Starwind tier and apply chosen components consistently with the brand.

**Context files**

- `.agent/AGENT.md`
- **Canonical brand source (authoritative -- read this, not memory):**
  `FITAutomate/fit-solutions/brand/` -- `colors.md`, `typography.md`, `design-principles.md`,
  `voice-and-tone.md`, `anti-ai-writing-style.md`. Confirmed committed and reachable via the
  GitHub MCP as of 2026-06-06. Nico's persistent brand memory is a fast cross-check only, NOT the
  source of record.
- Open inputs: Q2 (Starwind tier), Q5 (brand delivery mechanism)
- External: Starwind docs (URL TBD by Q2)

**Precondition (must complete before any CSS is written)**

- Pull the brand tokens from `fit-solutions/brand/colors.md` and `fit-solutions/brand/typography.md`
  at a specific commit SHA, and pin that snapshot into `.agent/prp/evidence/` for this issue. The
  implementation reads from that versioned snapshot, so the brand work has a canonical, auditable
  reference rather than relying on memory or a moving target. If the brand files are ambiguous or
  incomplete, stop and route to Quinn before writing CSS.

**In scope**

- `src/styles/brand.css` (or equivalent) carrying the FIT palette and typography tokens, sourced
  from the pinned `fit-solutions/brand/` snapshot.
- Font loading via Google Fonts `<link>` in the Astro layout.
- Refactor of `index.astro` to use the FIT typography hierarchy and component layout.
- Adoption of the chosen Starwind tier (UI or Pro) and replacement of any bespoke components with
  Starwind primitives where it fits.
- A light-on-paper print stylesheet (for the eventual "Print this brief" path).
- Visual review checklist in `.agent/prp/reviews/`.

**Out of scope**

- Any change to weekly data or scripts.
- Any change to the deployed URL or DNS.
- Any change to the GitHub Pages production surface.
- New external-facing copy (route any new wording to Maya).

**Acceptance criteria**

- The Astro `dist/` renders with the FIT brand applied: palette, fonts, accent, and status colors
  match the canonical tokens in `fit-solutions/brand/colors.md` and
  `fit-solutions/brand/typography.md` (cite the commit SHA of the snapshot used).
- Lighthouse a11y score >= 95 against the new layout (manual or scripted).
- Print stylesheet renders the page light-on-paper without color-loss issues.
- Quinn has reviewed and signed off on brand application before merge.
- No copy change ships without Maya review.

**Validation commands**

- `pnpm build`
- `pnpm preview` -- manual brand-check pass against the FIT palette and font set.
- `pnpm exec lighthouse --only-categories=accessibility http://localhost:4321/`
  (or equivalent if the local script differs once tooling is chosen in issue 1).

**Rollback boundary**

Feature-branch only. Production site (still on GitHub Pages, still pre-brand) is unaffected until
merge. Revert via single-commit `git revert` on `main`.

**Human approval gate**

Quinn signs off on brand application; Maya signs off on any new copy; John approves the merge.

---

## Issue 3 -- Cloudflare Pages preview deployment

**Title:** `Deploy AI News Astro build to a Cloudflare Pages preview (no DNS, no production)`

**Suggested labels:** `migration`, `cloudflare`, `archon-p1`, `proposal`

**Goal**

Connect the `ai-news` GitHub repo to a Cloudflare Pages project using Cloudflare's **Git
integration** (the FIT canonical procedure), so Pages builds the Astro site automatically on every
push to `main` and serves it on a Cloudflare-assigned `*.pages.dev` URL. Deployments are
Git-generated, not local uploads. No DNS records for the production hostname yet. GitHub Pages
stays the canonical production URL during this issue.

**Context files**

- `.agent/AGENT.md`
- FIT canonical procedure: "Cloudflare -- Deploy Astro Site via Pages" (lives in the `docs` repo /
  `fit-solutions`; John supplies the committed copy or its repo path -- the `D:\...` local copy is
  not reachable from this environment). This procedure is Git-connected Pages, NOT local wrangler.
- Open inputs: Q3 (Cloudflare account / Pages project shape), Q4 (DNS readiness)

**In scope**

- A Cloudflare Pages project created via the dashboard's **"Connect to Git"** flow, bound to
  `FITAutomate/ai-news`, with the production branch set to `main`.
- Build configuration in the Pages project: framework preset Astro, build command (`pnpm build`
  or per Q1), build output directory `dist/`, root directory `/`, and any required env vars
  referenced by name only.
- A committed settings record (e.g. `.agent/prp/evidence/<date>-cloudflare-pages-git-config.md`)
  capturing the exact Git-integration configuration: project name, production branch, build
  command, output dir, root dir, env var names. (Cloudflare Pages Git projects are configured in
  the dashboard, not via a repo `wrangler.toml`; the evidence file is the repo-side record.)
- A documented smoke-test against the Git-generated `*.pages.dev` deployment.
- Inclusion of the preview URL in the implementation issue's PR description, but **not** in
  public docs.

**Out of scope**

- Any DNS change (no `ai-news.fitautomate.com` CNAME or A record).
- GitHub Pages retirement.
- Production traffic routing.
- Local `wrangler pages deploy` as the production deployment path -- deployments must be
  Git-generated from a push to `main`. (Local `wrangler` is acceptable only for an ad-hoc developer
  smoke test, never as the project's deploy mechanism.)

**Acceptance criteria**

- The Cloudflare Pages project is Git-connected to `FITAutomate/ai-news` with production branch
  `main`.
- The latest Pages deployment was **triggered by a GitHub push to `main`** and its source commit
  SHA matches `main`'s HEAD (verifiable in the Pages dashboard deployment list as a Git
  deployment, not a direct upload).
- Preview URL serves a page byte-equivalent to the GitHub Pages site (with brand applied if issue
  2 has merged first).
- A documented smoke-test pass: load preview URL, confirm weekly data renders, confirm assets
  load, confirm console is clean.

**Validation commands**

- In the Cloudflare Pages dashboard, confirm the latest deployment's trigger is a GitHub commit on
  `main` and the commit SHA matches `git rev-parse origin/main`.
- `curl -I https://<project>.pages.dev/` -- 200 OK.
- Manual browser smoke-test.

**Rollback boundary**

Disconnecting the Git integration or deleting the Cloudflare Pages project is a no-op for
production. GitHub Pages remains the canonical URL throughout this issue. No DNS records exist for
`ai-news.fitautomate.com` yet.

**Human approval gate**

John approves the merge. Quinn is in the loop because the preview surfaces the brand application.

---

## Issue 4 -- DNS cutover to `ai-news.fitautomate.com`

**Title:** `Cut over AI News production to ai-news.fitautomate.com via Cloudflare with redirect from GitHub Pages`

**Suggested labels:** `migration`, `cloudflare`, `archon-p1`, `proposal`

**Goal**

Move production traffic to `https://ai-news.fitautomate.com` (Cloudflare custom domain on the
Pages project). Replace the old GitHub Pages content at `https://fitautomate.github.io/ai-news/`
with a client-side redirect plus a `<link rel="canonical">` to the new URL (a redirect shim /
deprecation notice). Update `README.md` to the new canonical URL. Do not retire GitHub Pages yet
(issue 5 does that).

**Technical note (why not a 301 from GitHub Pages)**

GitHub Pages serves static repo content for a project page like `/ai-news/`. It does **not**
support server-side redirect rules: there is no Netlify/Cloudflare-style `_redirects` file support,
and you cannot make `fitautomate.github.io` emit a real `301` status header for that path from repo
content. The authoritative `301` lives on the Cloudflare side for the new domain. From the old
GitHub Pages URL, the strongest signals available are a `<link rel="canonical">` pointing at the
new URL plus a client-side redirect (`<meta http-equiv="refresh">` and `location.replace()`), with
a visible fallback link. Plan accordingly -- do not assert a server 301 from the github.io path.

**Context files**

- `.agent/AGENT.md`
- FIT canonical Cloudflare procedure (John supplies the repo path; `D:\...` local copy not
  reachable)
- Open inputs: Q3, Q4
- Pre-requisite issue: issue 3 must be merged and validated.

**In scope**

- DNS record creation for `ai-news.fitautomate.com` (Cloudflare CNAME to the Pages project) and the
  Cloudflare Pages custom-domain binding.
- Replace the GitHub Pages `index.html` (or add a redirect shim page) with: a
  `<link rel="canonical" href="https://ai-news.fitautomate.com/">`, a
  `<meta http-equiv="refresh" content="0; url=https://ai-news.fitautomate.com/">`, a
  `location.replace("https://ai-news.fitautomate.com/")` script, and a visible fallback link /
  deprecation notice. (This is the realistic substitute for a 301 on a github.io project page.)
- `README.md` update to reference the new canonical URL.
- Update/point the sitemap at the new URL.
- Google Search Console: note that "Change of Address" applies to whole-domain moves, so it may not
  be available for a project-path move off `fitautomate.github.io`; if unavailable, rely on the
  canonical tag, the client-side redirect, sitemap resubmission, and Cloudflare-side 301s. File
  Change of Address only if the tool offers it for this move.

**Out of scope**

- Disabling GitHub Pages entirely (issue 5).
- Any content change beyond the redirect shim.

**Acceptance criteria**

- `dig ai-news.fitautomate.com +short` returns Cloudflare IPs.
- `curl -I https://ai-news.fitautomate.com/` -- 200 OK.
- The GitHub Pages page at `/ai-news/` returns 200 and its HTML contains both the `canonical` link
  and the meta-refresh/JS redirect to the new URL (verified by inspecting the returned HTML, NOT by
  expecting a 301 status code).
- README points at the new canonical URL.

**Validation commands**

- `dig ai-news.fitautomate.com +short`
- `curl -I https://ai-news.fitautomate.com/`  (expect 200)
- `curl -sL https://fitautomate.github.io/ai-news/ | grep -iE 'rel=.?canonical|http-equiv=.?refresh|location\.replace'`
  -- confirms the redirect-shim markup is present (do not expect a 301 status from github.io).

**Rollback boundary**

Two reversible actions: (1) delete the Cloudflare DNS record / custom-domain binding; (2)
`git revert` the commit that replaced the github.io `index.html` with the redirect shim, restoring
the original site at `fitautomate.github.io/ai-news/`. Because the github.io page is converted to a
shim in this issue (not left as a full mirror), the README revert alone is not enough -- the
index.html restore is the key rollback step. Rollback window before SEO impact is small but
non-zero -- this is the highest-impact issue in the map and warrants the most explicit
"go / no-go" approval gate.

**Human approval gate**

John approves the DNS change explicitly (the cutover step is not bundled into a routine PR
merge; it is a scheduled go / no-go). Quinn is informed because domain strategy is in her lane.

---

## Issue 5 -- GitHub Pages retirement and documentation cleanup

**Title:** `Retire GitHub Pages for ai-news and clean up legacy planning docs`

**Suggested labels:** `migration`, `standards`, `docs`, `archon-p2`, `proposal`

**Goal**

After issue 4 has been live for a configurable soak period (default 14 days) without regression,
disable GitHub Pages for `ai-news` and clean up legacy planning artifacts. Address `update-plan.md`
disposition (Q7).

**Context files**

- `.agent/AGENT.md`
- Issue 4 (must be merged and live for the soak period)
- Open input: Q7 (`update-plan.md` archive vs delete)

**In scope**

- Disable GitHub Pages in the repo settings.
- Remove `_redirects` (or redirect-only page) once Pages is off.
- Archive or delete `update-plan.md` per Q7.
- Update `.agent/CONTEXT.md` to drop the "current deployment: GitHub Pages" reference.
- Add a brief retro under `.agent/prp/reports/` capturing the migration outcome.

**Out of scope**

- Any further site changes.

**Acceptance criteria**

- GitHub Pages setting is off for the repo.
- `https://fitautomate.github.io/ai-news/` returns a clean GitHub Pages "not found" or no longer
  resolves (depending on the chosen Pages-off behavior).
- `update-plan.md` has been resolved per Q7.
- `.agent/CONTEXT.md` reflects post-migration state.
- A short retro doc exists at `.agent/prp/reports/<date>-ai-news-migration-retro.md`.

**Validation commands**

- `curl -I https://fitautomate.github.io/ai-news/`
- `curl -I https://ai-news.fitautomate.com/`

**Rollback boundary**

Re-enable GitHub Pages in repo settings (instant), restore `update-plan.md` from git history if
needed. Recovery is single-action and reversible.

**Human approval gate**

John approves after the soak window. Sage informed (lane closure).

---

## Sequencing and dependency graph

```
Issue 1 (Astro skeleton)
    -> Issue 2 (FIT brand)
        -> Issue 3 (Cloudflare preview)
            -> Issue 4 (DNS cutover)        [+14d soak]
                -> Issue 5 (Pages retirement + cleanup)
```

Issues 1 and 2 can technically merge in either order if a team prefers brand-first; the sequence
above is recommended because the Astro skeleton is a smaller, lower-risk change to land first.

Issues 3-5 are strictly sequential.

## Grading rubric self-check (against issue #3 acceptance criteria)

- Repo access -- ai-news ✓, issue #1 ✓, agent-onboarding ✓. Recorded in the access report.
- Pattern transfer -- labels and templates adapted, not blindly copied. Recorded in the access
  report.
- FIT judgment -- brand references point at the canonical committed source `fit-solutions/brand/`
  (not memory). Naming / scope routed out to Quinn; copy routed out to Maya.
- Planning quality -- five issues, ordered, each with full structure.
- Boundary control -- zero implementation work performed on Astro / brand / Cloudflare / DNS /
  Pages.
- Evidence -- this plan + the access report + the bootstrap PR are the evidence trail.
