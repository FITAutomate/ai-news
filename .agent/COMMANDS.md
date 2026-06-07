# Command Reference

Only commands defined here are sanctioned PIV gates for this repo. Do not invent commands.
Script-based commands are added by the phase that creates the script.

## Status

Scaffold (PRP `#3` bootstrap). No application build and no full validation suite exist yet. Gates
for Astro build, brand check, and Cloudflare deploy are added by their owning implementation
issues (see `.agent/prp/plans/2026-06-06-ai-news-implementation-issue-map.md`).

## Current commands

The pre-existing scripts continue to operate:

- `node scripts/week-key-from-date.mjs <YYYY-MM-DD>` -- derive a week key from a date.
- `node scripts/sync-archive-manifest.mjs` -- refresh `archive/manifest.json` after a new weekly
  file is added.

These are kept intentionally so the weekly publishing cadence is not disrupted by the bootstrap.

## Notes

- Reference env vars by name only -- never read, echo, or commit secret/env values.
- `.agent/prp/*` holds planning, issue, review, and evidence artifacts.
- Validation commands for the Astro / brand / Cloudflare phases will be added under those issues'
  acceptance criteria; do not pre-populate them here without an approved implementation phase.
