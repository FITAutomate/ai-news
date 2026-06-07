// @ts-check
import { defineConfig } from 'astro/config';

// AI News Pulse — Astro skeleton conversion (issue #6).
//
// Intentionally minimal. This phase only establishes the Astro project structure
// and reproduces the existing static site 1:1. No brand changes (that is #7), no
// Starwind, no deploy/Cloudflare/DNS config (those are #8/#9/#10).
//
// Notes:
// - Default output is "static", which matches the current static-site behavior.
// - No `base` is set. The current site relies on relative asset paths
//   (./styles.css, ./app.js, ./news-data.json, ./archive/...). Those stay relative
//   in src/pages/index.astro and inside app.js, so they resolve correctly whether
//   the build is served at a host root (the eventual ai-news.fitautomate.com target)
//   or under a sub-path. Setting a hard-coded base here would change behavior, so we
//   don't — the deploy target is decided in later phases.
// - `publicDir` defaults to ./public. We do NOT commit ./public; it is staged from
//   the canonical root assets by `npm run prebuild` (scripts/stage-astro-public.mjs)
//   and is gitignored. This keeps the existing weekly-data workflow (news-data.json,
//   archive/, scripts/, skills/ai-news-weekly/) as the single source of truth and
//   avoids duplicating ~24 data files + binary images into the repo.
export default defineConfig({});
