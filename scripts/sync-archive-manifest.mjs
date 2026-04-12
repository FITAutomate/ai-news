#!/usr/bin/env node
/**
 * Rebuild archive/manifest.json from archive/news-YYYY-WW.json files.
 * Run from repo root after adding or editing an archive week.
 */
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const archiveDir = path.join(repoRoot, "archive");
const manifestPath = path.join(archiveDir, "manifest.json");

const files = fs
  .readdirSync(archiveDir)
  .filter((f) => /^news-\d{4}-\d{2}\.json$/.test(f))
  .sort();

const weeks = [];

for (const filename of files) {
  const m = filename.match(/^news-(\d{4})-(\d{2})\.json$/);
  if (!m) continue;
  const key = `${m[1]}-${m[2]}`;
  const full = path.join(archiveDir, filename);
  let raw = fs.readFileSync(full, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const data = JSON.parse(raw);
  const news = Array.isArray(data.news) ? data.news : [];
  const storyDates = news.map((n) => n.date).filter(Boolean).sort();
  const metaDate = data.meta?.dataDate || null;
  const allEnds = [...storyDates, metaDate].filter(Boolean).sort();
  const allStarts = [...storyDates, metaDate].filter(Boolean).sort();
  const dateFrom = allStarts[0] ?? null;
  const dateTo = allEnds[allEnds.length - 1] ?? null;
  const window = data.meta?.window || "";
  const year = m[1];
  const wn = m[2];
  const label = window ? `${year}-W${wn} (${window})` : `${year}-W${wn}`;
  weeks.push({
    key,
    label,
    file: `archive/${filename}`,
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo })
  });
}

fs.writeFileSync(manifestPath, JSON.stringify({ weeks }, null, 2) + "\n", "utf8");
console.log(`Wrote ${manifestPath} (${weeks.length} weeks).`);
