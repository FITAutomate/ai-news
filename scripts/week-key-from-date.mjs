#!/usr/bin/env node
/**
 * Resolve archive week key (YYYY-WW) for a calendar date using archive/manifest.json
 * dateFrom/dateTo (derived from each week's story dates). Matches editorial week files,
 * not strict ISO-8601 alone.
 *
 * Usage: node scripts/week-key-from-date.mjs 2026-04-11
 */
import fs from "node:fs";
import path from "node:path";

const arg = process.argv[2];
if (!arg || !/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
  console.error("Usage: node scripts/week-key-from-date.mjs YYYY-MM-DD");
  process.exit(1);
}

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "archive", "manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("Missing archive/manifest.json — run: node scripts/sync-archive-manifest.mjs");
  process.exit(1);
}

const { weeks } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const hits = [];

for (const w of weeks) {
  if (w.dateFrom && w.dateTo && arg >= w.dateFrom && arg <= w.dateTo) {
    hits.push(w);
  }
}

if (hits.length === 1) {
  const w = hits[0];
  console.log(w.key);
  console.log(path.join(repoRoot, w.file.replace(/\//g, path.sep)));
  process.exit(0);
}

if (hits.length > 1) {
  console.error("Ambiguous date; multiple weeks match:", hits.map((h) => h.key).join(", "));
  process.exit(1);
}

console.error(`No week in manifest contains ${arg} (check dateFrom/dateTo; run sync-archive-manifest if archives changed).`);
process.exit(1);
