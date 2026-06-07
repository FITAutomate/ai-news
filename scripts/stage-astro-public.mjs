// Stage the canonical static assets into ./public for the Astro build.
//
// Issue #6 (Astro skeleton) keeps the existing weekly-data workflow as the single
// source of truth: news-data.json, archive/, the binary images, styles.css, and
// app.js all live at the repo root exactly as before. Astro only publishes files
// from ./public, so this script copies (does not move) those canonical assets into
// a gitignored ./public directory right before `astro build`/`astro dev` runs.
//
// Why copy instead of relocate:
// - The weekly curation workflow + scripts/ + skills/ai-news-weekly/ keep writing to
//   the root news-data.json and archive/ — untouched, no drift, nothing to relearn.
// - Avoids duplicating ~24 data files and a 2 MB background image into the repo, and
//   avoids committing binaries through tooling that is not binary-safe.
// - Guarantees the current GitHub Pages site (served from the repo root on main) is
//   not disturbed by this phase.
//
// This script is additive: it does not modify the existing weekly scripts
// (sync-archive-manifest.mjs, week-key-from-date.mjs).

import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

// Canonical runtime assets the browser fetches/links at the site root.
const ASSETS = [
  'styles.css',
  'app.js',
  'icon.png',
  'news-bg.png',
  'news-data.json',
  'archive', // directory: manifest.json + weekly news-YYYY-WW.json files
];

async function main() {
  await rm(publicDir, { recursive: true, force: true });
  await mkdir(publicDir, { recursive: true });

  let copied = 0;
  for (const asset of ASSETS) {
    const src = path.join(root, asset);
    if (!existsSync(src)) {
      console.warn(`[stage] WARNING: missing canonical asset, skipped: ${asset}`);
      continue;
    }
    await cp(src, path.join(publicDir, asset), { recursive: true });
    console.log(`[stage] copied ${asset}`);
    copied += 1;
  }

  console.log(`[stage] public/ staged from ${copied} canonical root asset(s).`);
}

main().catch((err) => {
  console.error('[stage] failed:', err);
  process.exit(1);
});
