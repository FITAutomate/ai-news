#!/usr/bin/env node
import fs from "node:fs";

const REQUIRED_META = ["updatedLabel", "dataDate", "window", "themes"];
const REQUIRED_NEWS_FIELDS = [
  "category",
  "date",
  "title",
  "summary",
  "source",
  "sourceLabel",
  "rating",
  "tags"
];

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  const errors = [];

  if (!data || typeof data !== "object") {
    errors.push("Top-level JSON must be an object.");
    return errors;
  }

  if (!data.meta || typeof data.meta !== "object") {
    errors.push("Missing meta object.");
  } else {
    for (const key of REQUIRED_META) {
      if (!(key in data.meta)) errors.push(`Missing meta.${key}`);
    }
    if ("dataDate" in data.meta && !isIsoDate(data.meta.dataDate)) {
      errors.push("meta.dataDate must be YYYY-MM-DD.");
    }
  }

  if (!Array.isArray(data.news)) {
    errors.push("news must be an array.");
    return errors;
  }

  if (data.news.length < 1) {
    errors.push("news must contain at least one item.");
  }

  data.news.forEach((item, index) => {
    for (const field of REQUIRED_NEWS_FIELDS) {
      if (!(field in item)) errors.push(`news[${index}] missing ${field}`);
    }

    if ("date" in item && !isIsoDate(item.date)) {
      errors.push(`news[${index}].date must be YYYY-MM-DD`);
    }

    if ("rating" in item) {
      const rating = Number(item.rating);
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        errors.push(`news[${index}].rating must be 1-5`);
      }
    }

    if ("tags" in item) {
      if (!Array.isArray(item.tags)) {
        errors.push(`news[${index}].tags must be an array`);
      } else if (item.tags.length < 2 || item.tags.length > 5) {
        errors.push(`news[${index}].tags should contain 2-5 items`);
      }
    }
  });

  return errors;
}

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: node scripts/validate-news-json.mjs <file1> [file2 ...]");
    process.exit(1);
  }

  let hasErrors = false;

  for (const file of files) {
    try {
      const errors = validateFile(file);
      if (errors.length) {
        hasErrors = true;
        console.error(`\n✗ ${file}`);
        errors.forEach((error) => console.error(`  - ${error}`));
      } else {
        console.log(`✓ ${file}`);
      }
    } catch (error) {
      hasErrors = true;
      console.error(`\n✗ ${file}`);
      console.error(`  - ${error.message}`);
    }
  }

  if (hasErrors) process.exit(1);
}

main();