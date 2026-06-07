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
4. DNS cutover to `ai-news.fitautomate.com` with full redirect from the GitHub Pages URL.
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
- Q5: Brand source -- shared package, or local copy into `src/styles/`?
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
- Nico's persistent FIT brand memory (palette, fonts, status rules)
- Open inputs: Q2 (Starwind tier), Q5 (brand source)
- External: Starwind docs (URL TBD by Q2)

**In scope**

- `src/styles/brand.css` (or equivalent) carrying the FIT palette and typography tokens.
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
  match `.agent/AGENT.md`'s referenced brand memory.
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

Stand up a Cloudflare Pages project for `ai-news` that builds from `main` and serves the Astro
`dist/` output on a Cloudflare-assigned preview URL (e.g. `ai-news.pages.dev`). No DNS records
created for the production hostname yet. GitHub Pages continues to be the canonical production
URL.

**Context files**

- `.agent/AGENT.md`
- John's local procedure: `docs/web/.../PROC -- Cloudflare -- Deploy Astro Site via Pages.md`
  (not reachable from this environment -- John supplies the runtime steps or a copy)
- Open inputs: Q3 (Cloudflare account / Pages project shape), Q4 (DNS readiness)

**In scope**

- A `wrangler.toml` or Cloudflare dashboard configuration that builds the Astro site.
- A `.cloudflare/` (or `wrangler.toml`) project file capturing the build command and output dir.
- A documented manual smoke-test against the `pages.dev` preview URL.
- Inclusion of the preview URL in the implementation issue's PR description, but **not** in
  public docs.

**Out of scope**

- Any DNS change (no `ai-news.fitautomate.com` CNAME or A record).
- GitHub Pages retirement.
- Production traffic routing.

**Acceptance criteria**

- Cloudflare Pages successfully builds the latest `main` commit.
- Preview URL serves a page byte-equivalent to the GitHub Pages site (with brand applied if issue
  2 has merged first).
- A documented smoke-test pass: load preview URL, confirm weekly data renders, confirm assets
  load, confirm console is clean.

**Validation commands**

- `wrangler pages deploy ./dist --project-name=ai-news` (or dashboard-driven equivalent, per Q3).
- `curl -I https://ai-news.pages.dev/` -- 200 OK.
- Manual browser smoke-test.

**Rollback boundary**

Deleting the Cloudflare Pages project is a no-op for production. GitHub Pages remains the
canonical URL throughout this issue. No DNS records exist for `ai-news.fitautomate.com` yet.

**Human approval gate**

John approves the merge. Quinn is in the loop because the preview surfaces the brand application.

---

## Issue 4 -- DNS cutover to `ai-news.fitautomate.com`

**Title:** `Cut over AI News production to ai-news.fitautomate.com via Cloudflare with redirect from GitHub Pages`

**Suggested labels:** `migration`, `cloudflare`, `archon-p1`, `proposal`

**Goal**

Move production traffic from `https://fitautomate.github.io/ai-news/` to
`https://ai-news.fitautomate.com`. Set up a 301 redirect from the GitHub Pages URL to the new
Cloudflare-hosted URL. Update repo `README.md` to reference the new canonical URL. Do not retire
GitHub Pages yet (issue 5 does that).

**Context files**

- `.agent/AGENT.md`
- John's local Cloudflare procedure (not reachable; John supplies)
- Open inputs: Q3, Q4
- Pre-requisite issue: issue 3 must be merged and validated.

**In scope**

- DNS record creation for `ai-news.fitautomate.com` (Cloudflare CNAME to the Pages project).
- Cloudflare Pages custom domain binding.
- GitHub Pages redirect (via a small `_redirects` file in the Pages branch, or by reconfiguring
  Pages to serve a redirect-only page; both options carry trade-offs to confirm with John).
- `README.md` update to reference the new canonical URL.
- Search Console "Change of Address" if applicable.

**Out of scope**

- Disabling GitHub Pages entirely (issue 5).
- Any content change.

**Acceptance criteria**

- `dig ai-news.fitautomate.com +short` returns Cloudflare IPs.
- `curl -I https://ai-news.fitautomate.com/` -- 200 OK.
- `curl -I https://fitautomate.github.io/ai-news/` -- 301 to
  `https://ai-news.fitautomate.com/` (or equivalent path mapping).
- Search Console change-of-address filed (manual step).
- README points at the new canonical URL.

**Validation commands**

- `dig ai-news.fitautomate.com +short`
- `curl -I https://ai-news.fitautomate.com/`
- `curl -I https://fitautomate.github.io/ai-news/`

**Rollback boundary**

Revert DNS record (CNAME deletion). GitHub Pages still has the live mirror at
`fitautomate.github.io/ai-news/` (until issue 5 lands), so a DNS rollback returns canonical
traffic to that URL with a one-commit revert of the README. Rollback window before SEO impact is
small but non-zero -- this is the highest-impact issue in the map and warrants the most explicit
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
- FIT judgment -- brand references match Nico's persistent memory. Naming / scope routed out to
  Quinn; copy routed out to Maya.
- Planning quality -- five issues, ordered, each with full structure.
- Boundary control -- zero implementation work performed on Astro / brand / Cloudflare / DNS /
  Pages.
- Evidence -- this plan + the access report + the bootstrap PR are the evidence trail.
