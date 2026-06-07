# ai-news -- Agent context

## Layer 1 reference

See `.agent/AGENT.md` for this repo's canonical operating rules. FIT-wide identity, brand, and
registry rules live in `FITAutomate/fit-solutions` (Layer 1) -- this repo defers to that registry
and does not duplicate it.

## Repo purpose

Publication home for the FIT Automate weekly AI news brief. Currently a lightweight static site
deployed via GitHub Pages. Slated to migrate to Astro + FIT brand + Cloudflare Pages under issue
`#3`'s bootstrap PRP and the implementation issue map proposed alongside this scaffolding.

## Lineage

- Bootstrap PRP: `.agent/prp/prds/2026-06-06-ai-news-hyperagent-bootstrap.prd.md`
- Operational issue: `FITAutomate/ai-news#3`
- Local style reference: closed issue `FITAutomate/ai-news#1`
- Repo-standards pattern reference: `FITAutomate/agent-onboarding`,
  `FITAutomate/fit-knows-pro-dev`

## Boundaries (summary -- full rules in `.agent/AGENT.md`)

- No Astro conversion, brand redesign, Starwind install, Cloudflare setup, DNS change, or Pages
  retirement until the implementation issue map is approved.
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

- `index.html`, `styles.css`, `app.js` -- static app shell.
- `news-data.json` -- current week's data payload.
- `archive/manifest.json` and `archive/news-YYYY-WW.json` -- weekly archive store.
- `scripts/sync-archive-manifest.mjs`, `scripts/week-key-from-date.mjs` -- existing automation.
- `skills/ai-news-weekly/` -- weekly update skill.
- `update-plan.md` -- legacy planning note; predates the PRP layout introduced in this PR. To be
  reviewed and either archived under `.agent/prp/archive/` or removed by a follow-up issue.
