import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

// AI News Pulse — Astro config.
//
// History:
// - #6 established the Astro project (skeleton) reproducing the prior static site 1:1.
// - #7 upgrades to Astro 6, intentionally initializes Starwind Pro (Tailwind v4), and
//   applies the FIT brand. The Tailwind v4 Vite plugin below was added by Starwind init
//   and is required for `src/styles/starwind.css` (Tailwind + Starwind tokens) to compile.
//
// Notes:
// - Default output is "static", matching the site's behavior.
// - No `base` is set. The page and app.js use relative asset paths
//   (./styles..., ./news-data.json, ./archive/...), which resolve whether the build is
//   served at a host root (the eventual ai-news.fitautomate.com target) or under a
//   sub-path. The deploy target is decided in later phases (#8/#9), not here.
// - `publicDir` defaults to ./public. We do NOT commit ./public; it is staged from the
//   canonical root assets by `npm run prebuild` (scripts/stage-astro-public.mjs) and is
//   gitignored. This keeps the weekly-data workflow (news-data.json, archive/, scripts/,
//   skills/ai-news-weekly/) as the single source of truth and avoids duplicating ~24 data
//   files + binary images into the repo.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
