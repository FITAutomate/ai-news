# ai-news -- Agent context

## Layer 1 reference

See `.agent/AGENT.md` for this repo's canonical operating rules. FIT-wide identity, brand, and
registry rules live in `FITAutomate/fit-solutions` (Layer 1) -- this repo defers to that registry
and does not duplicate it.

## Repo purpose

Publication home for the FIT Automate weekly AI news brief. Runs as an Astro static site with the
FIT brand system, deployed via Cloudflare Pages at https://ai-news.fitautomate.com. Migration from
the legacy GitHub Pages static site completed 2026-06-17 (cutover PR #19); GitHub Pages retired
under issue #10 (2026-07-01).

## Lineage

- Bootstrap PRP: `.agent/prp/prds/2026-06-06-ai-news-hyperagent-bootstrap.prd.md`
- Operational issue: `FITAutomate/ai-news#3`
- Local style reference: closed issue `FITAutomate/ai-news#1`
- Repo-standards pattern reference: `FITAutomate/agent-onboarding`,
  `FITAutomate/fit-knows-pro-dev`
- Migration retro: `.agent/prp/reports/2026-07-01-ai-news-migration-retro.md`

## Boundaries (summary -- full rules in `.agent/AGENT.md`)

- No secrets/env values in source.
- Public copy and naming choices route out to Maya and Quinn respectively.

## Enabled skills

enabled_skills:
  - prp
  - astro
  - brand-check
  - starwind-ui
  - cloudflare-pages
  - github-issues

These are capability labels declaring what this repo is expected to draw on. Local environment
parity is not implied; concrete skill installs and validation commands are added as their owning
phases land.

## Current files of interest

- `src/pages/index.astro`, `src/styles/brand.css`, `app.js` -- Astro page shell + runtime renderer.
- `news-data.json` -- current week's data payload.
- `archive/manifest.json` and `archive/news-YYYY-WW.json` -- weekly archive store.
- `scripts/sync-archive-manifest.mjs`, `scripts/week-key-from-date.mjs` -- existing automation.
- `skills/ai-news-weekly/` -- weekly update skill (product: Weekly AI News Insights).
- `astro.config.mjs`, `package.json` -- Astro site configuration.
