# Repo Skills

This folder stores repository-specific skills for [FITAutomate/ai-news](https://github.com/FITAutomate/ai-news).

## Available Skills

- `ai-news-weekly`
  - Path: `skills/ai-news-weekly/SKILL.md`
  - Purpose: Create, validate, and publish weekly AI News Pulse updates.

## Weekly Run

1. Open a local clone of this repository (any path).
2. Trigger the skill by request, for example:
   - "Use ai-news-weekly to create Week 15 and publish"
3. After adding an archive JSON, run `node scripts/sync-archive-manifest.mjs` from the repo root.
4. Confirm the final commit/push output.

## Notes

- Skill artifacts are versioned with this repo.
- JSON validation: `skills/ai-news-weekly/scripts/validate-news-json.mjs`
- Archive index: `scripts/sync-archive-manifest.mjs`
