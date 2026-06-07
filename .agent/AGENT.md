# AGENT.md -- ai-news

Canonical agent and operating rules for the `FITAutomate/ai-news` repository. Root `CLAUDE.md` and
`AGENTS.md` are thin pointers to this file.

## Scope

- FIT Automate AI News brief: weekly AI news pulse for business audiences.
- Use `.agent/prp/*` for planning, issue, review, and evidence artifacts.

## What this repo is

The publication home for the FIT Automate weekly AI brief. Currently a lightweight static site
(`index.html` / `styles.css` / `app.js` driving JSON in `news-data.json` and `archive/`). Deployed
today at `https://fitautomate.github.io/ai-news/`. Target production domain is
`https://ai-news.fitautomate.com`.

Pending bootstrap PRP (issue `#3`), this repo will move to an Astro static site with the FIT brand
system, optionally adopting Starwind components, and will deploy via Cloudflare Pages with GitHub
Pages retired once the cutover is validated. None of that work has been started in this PR; this
PR adds repo standards only.

## What this repo is NOT

- Not the FIT Automate marketing site -- that is the primary `fitautomate.com` lane.
- Not a research artifact home -- Clio research lives in its own surfaces.
- Not the chat or assistant surface -- those live in the FIT Knows family.
- Not the standards source-of-truth -- canonical FIT rules and registry live in `fit-solutions`
  (Layer 1). This repo defers to that registry; it does not duplicate it.

## Hard boundaries (do not cross without John's approval)

- Never commit secrets or env values. Reference env vars by name only.
- No production hosting changes without an approved implementation issue and PR.
- No DNS changes without an approved implementation issue and PR.
- No retirement of `https://fitautomate.github.io/ai-news/` until the Cloudflare destination is
  validated end-to-end.
- Public-facing copy and naming route to Maya (copy) and Quinn (naming/scope). Brand visuals route
  to Quinn for approval before merge.

## How we work here

- Rules-first. John is the final approval gate.
- PRP/PIV cycle: plan -> approval -> bounded, reversible PIVs. Each implementation phase is its own
  issue and PR.
- Issue style follows closed issue `#1` and the PRP-issue `#3` pattern in this repo: H1 title,
  Summary, Goals, In scope, Out of scope, Acceptance criteria. ASCII, no decorative formatting.

## Source-of-truth map

- **Layer 1 governance:** `FITAutomate/fit-solutions` (not accessed by this run -- referenced
  elsewhere in the FIT Automate ecosystem).
- **Reference repos consulted for this bootstrap:** `FITAutomate/agent-onboarding` (labels and
  issue templates), `FITAutomate/fit-knows-pro-dev` (`.agent/` layout reference).
- **Master PRP for this site work:**
  `.agent/prp/prds/2026-06-06-ai-news-hyperagent-bootstrap.prd.md`.
- **Operational entry-point issue:** `FITAutomate/ai-news#3`.

## Documentation rules

- Keep docs ASCII-safe; avoid mojibake.
- Keep `.agent/` as the single canonical automation/rules location; root pointers stay thin.
- Every PRP-tracked artifact (PRD, plan, issue, report, review, evidence) lives under
  `.agent/prp/<bucket>/<YYYY-MM-DD>-<slug>.md`.
