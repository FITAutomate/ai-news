const CATEGORY_EMOJI = {
  OpenAI: "\uD83E\uDDE0",
  Anthropic: "\uD83D\uDFE3",
  Google: "\uD83D\uDD35",
  Microsoft: "\uD83E\uDE9F",
  Meta: "\uD83D\uDFE6",
  Apple: "\uD83C\uDF4E",
  Amazon: "\uD83D\uDFE7",
  Agents: "\uD83E\uDD16",
  "Dev Tools": "\uD83E\uDDF0",
  RAG: "\uD83D\uDCDA",
  Automation: "\u2699\uFE0F",
  Orchestration: "\uD83C\uDF9B\uFE0F",
  Security: "\uD83D\uDEE1\uFE0F",
  Chips: "\uD83D\uDDA5\uFE0F",
  Policy: "\uD83C\uDFDB\uFE0F",
  Business: "\uD83D\uDCC8",
  Markets: "\uD83D\uDCC8",
  Infrastructure: "\uD83D\uDDA5\uFE0F",
  Platforms: "\uD83D\uDD35",
  Adoption: "\u2699\uFE0F"
};

/** Populated from archive/manifest.json at runtime (see scripts/sync-archive-manifest.mjs). */
let weekFileMap = {
  current: "./news-data.json"
};
/** Manifest week rows — used to resolve "current" into a Week NN label for John. */
let manifestWeeks = [];

async function loadWeekFileMap() {
  const map = { current: "./news-data.json" };
  const response = await fetch("./archive/manifest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load archive/manifest.json: ${response.status}`);
  }
  const manifest = await response.json();
  const weeks = Array.isArray(manifest.weeks) ? manifest.weeks : [];
  for (const w of weeks) {
    if (w && w.key && w.file) {
      const path = w.file.startsWith("./") ? w.file : `./${w.file}`;
      map[w.key] = path;
    }
  }
  return { map, weeks };
}

function fillWeekSelector(weeks) {
  const select = document.getElementById("weekSelect");
  if (!select) return;

  select.innerHTML = "";
  const currentOpt = document.createElement("option");
  currentOpt.value = "current";
  currentOpt.textContent = "Current";
  select.appendChild(currentOpt);

  for (const w of weeks) {
    const opt = document.createElement("option");
    opt.value = w.key;
    opt.textContent = w.label || w.key;
    select.appendChild(opt);
  }
}

function sortByRatingThenDateDesc(items) {
  return [...items].sort((a, b) => {
    const ra = Number(a.rating) || 0;
    const rb = Number(b.rating) || 0;
    if (rb !== ra) return rb - ra;

    // ISO date strings sort lexicographically.
    const da = String(a.date || "");
    const db = String(b.date || "");
    if (db !== da) return db.localeCompare(da);

    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

function diversifyTop(items) {
  // Keep the same stories and star ratings, but avoid a top row dominated by one category.
  // Rules:
  // - First 3 cards: prefer unique categories.
  // - Next 3 cards: prefer not repeating the previous category.
  const remaining = sortByRatingThenDateDesc(items);
  const chosen = [];

  for (let i = 0; i < remaining.length; i++) {
    const usedTopRow = new Set(chosen.slice(0, 3).map((x) => x.category));
    const lastCategory = chosen.length ? chosen[chosen.length - 1].category : null;

    const predicate = (candidate) => {
      if (chosen.length < 3) return !usedTopRow.has(candidate.category);
      if (chosen.length < 6) return candidate.category !== lastCategory;
      return true;
    };

    let pickIndex = remaining.findIndex(predicate);
    if (pickIndex === -1) pickIndex = 0;

    chosen.push(remaining.splice(pickIndex, 1)[0]);

    // We are consuming from `remaining`, so maintain the loop bounds.
    i--;
    if (remaining.length === 0) break;
  }

  return chosen;
}

function computeSelectorScore(item) {
  const rating = Number(item.rating) || 0;
  const text = `${item.title || ""} ${item.summary || ""}`.toLowerCase();
  const tags = Array.isArray(item.tags) ? item.tags.map((t) => String(t).toLowerCase()) : [];

  const builderKeywordHit =
    tags.some((t) =>
      [
        "mcp",
        "vibe coding",
        "coding",
        "tool use",
        "tools",
        "orchestration",
        "automation",
        "cli",
        "workflow",
        "agents",
        "rag",
        "llmops",
        "evaluation"
      ].includes(t)
    ) ||
    /(\bmcp\b|model context protocol|claude code|cursor\b|replit\b|codex\b|n8n\b|tool search|oauth)/i.test(text);

  const builderBonus = builderKeywordHit ? 1 : 0;

  // Keep the scale intuitive: stars still matter most; builder bonus helps tie-break and quota-fill.
  return Math.min(6, rating + builderBonus);
}

function getBucket(item) {
  const category = String(item.category || "");

  if (["Business", "Markets"].includes(category)) return "business";
  if (["Infrastructure", "Chips"].includes(category)) return "infra";
  if (["Policy"].includes(category)) return "policy";

  // Builder workflow buckets (what John cares about week-to-week).
  if (["Dev Tools", "Agents", "Automation", "Orchestration", "RAG", "Security"].includes(category)) return "builder";

  // Default: vendor/platform updates.
  return "platform";
}

function isVendorCategory(category) {
  return ["OpenAI", "Anthropic", "Google", "Microsoft", "Meta", "Amazon", "Apple"].includes(category);
}

function selectTopStories(items, options = {}) {
  const targetCount = Number(options.targetCount) || 12;
  if (!Array.isArray(items) || items.length <= targetCount) return Array.isArray(items) ? items : [];

  const desired = {
    platform: 3,
    business: 3,
    infra: 2,
    policy: 1,
    builder: 3
  };

  const scored = items
    .map((item) => ({ item, score: computeSelectorScore(item), bucket: getBucket(item) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const db = String(b.item.date || "");
      const da = String(a.item.date || "");
      if (db !== da) return db.localeCompare(da);
      return String(a.item.title || "").localeCompare(String(b.item.title || ""));
    });

  const selected = [];
  const selectedIds = new Set();

  const vendorCounts = new Map();
  const bucketCounts = new Map(Object.entries({ platform: 0, business: 0, infra: 0, policy: 0, builder: 0 }));

  const canSelect = (entry) => {
    const category = String(entry.item.category || "");

    // Vendor cap: avoid being dominated by one model lab.
    if (isVendorCategory(category)) {
      const current = vendorCounts.get(category) || 0;
      if (current >= 2) return false;
    }

    // Enforce bucket caps during quota-fill.
    const b = entry.bucket;
    const currentBucket = bucketCounts.get(b) || 0;
    const maxBucket = desired[b] ?? Infinity;
    if (currentBucket >= maxBucket) return false;

    return true;
  };

  const take = (entry) => {
    selected.push(entry.item);
    selectedIds.add(entry.item.source || `${entry.item.title || ""}-${entry.item.date || ""}`);

    const category = String(entry.item.category || "");
    if (isVendorCategory(category)) vendorCounts.set(category, (vendorCounts.get(category) || 0) + 1);

    bucketCounts.set(entry.bucket, (bucketCounts.get(entry.bucket) || 0) + 1);
  };

  // 1) Fill quotas per bucket with best stories that fit constraints.
  for (const bucket of ["builder", "platform", "business", "infra", "policy"]) {
    const want = desired[bucket];
    while ((bucketCounts.get(bucket) || 0) < want && selected.length < targetCount) {
      const entry = scored.find((e) => e.bucket === bucket && canSelect(e) && !selectedIds.has(e.item.source));
      if (!entry) break;
      take(entry);
    }
  }

  // 2) Fill remaining slots with best overall, keeping vendor cap.
  for (const entry of scored) {
    if (selected.length >= targetCount) break;
    if (selectedIds.has(entry.item.source)) continue;

    const category = String(entry.item.category || "");
    if (isVendorCategory(category) && (vendorCounts.get(category) || 0) >= 2) continue;

    selected.push(entry.item);
    selectedIds.add(entry.item.source);

    if (isVendorCategory(category)) vendorCounts.set(category, (vendorCounts.get(category) || 0) + 1);
  }

  return selected;
}

async function loadData(weekKey) {
  const file = weekFileMap[weekKey] || weekFileMap.current;
  const response = await fetch(file, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${file}: ${response.status}`);
  }
  return response.json();
}

function getRatingStars(rating) {
  const clamped = Math.max(1, Math.min(5, Number(rating) || 1));
  return "\u2605".repeat(clamped) + "\u2606".repeat(5 - clamped);
}

function weekNumberFromKey(weekKey) {
  if (!weekKey || weekKey === "current") return null;
  const match = String(weekKey).match(/-(\d{1,2})$/);
  return match ? Number(match[1]) : null;
}

function resolveWeekNumber(weekKey, meta) {
  const fromKey = weekNumberFromKey(weekKey);
  if (fromKey != null) return fromKey;

  const dataDate = meta && meta.dataDate ? String(meta.dataDate) : "";
  if (dataDate && Array.isArray(manifestWeeks)) {
    const hit = manifestWeeks.find(
      (w) => w.dateFrom && w.dateTo && dataDate >= w.dateFrom && dataDate <= w.dateTo
    );
    if (hit) return weekNumberFromKey(hit.key);
  }
  return null;
}

function renderStats() {
  // Round 1 masthead: Window is redundant with Updated; Themes are curated copy,
  // not filters/links — keep them out of the header until they become interactive.
  const statsEl = document.getElementById("stats");
  if (statsEl) statsEl.innerHTML = "";
}

function renderNews(news) {
  const gridEl = document.getElementById("newsGrid");
  gridEl.innerHTML = "";

  news.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 80}ms`;

    const emoji = CATEGORY_EMOJI[item.category] || "\uD83D\uDCF0";
    const stars = getRatingStars(item.rating);
    // Issue #18 round 2: limit tags to 3 max to reduce card crowding.
    const tags = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];

    // Truncate summary to ~140 chars for a cleaner card (full text on source).
    const summary = String(item.summary || "");
    const truncated = summary.length > 140 ? summary.slice(0, 137).replace(/\s+\S*$/, "") + "\u2026" : summary;

    card.innerHTML = `
      <div class="card-head">
        <span class="badge">${emoji} ${item.category}</span>
        <span class="rating" title="${item.rating || 1} out of 5">${stars}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${truncated}</p>
      <div class="tags">${tags.map((tag) => `<span class="tag">#${tag}</span>`).join(" ")}</div>
      <div class="card-meta">
        <span>${item.date}</span>
        <a href="${item.source}">Read source</a>
      </div>
    `;

    gridEl.appendChild(card);
  });
}

function renderMeta(meta, weekKey) {
  const weekNum = resolveWeekNumber(weekKey, meta);

  const kicker = document.querySelector(".kicker");
  if (kicker && meta.updatedLabel) {
    const weekPart = weekNum != null ? `Week ${weekNum}` : null;
    kicker.textContent = weekPart
      ? `${weekPart} \u00b7 Updated ${meta.updatedLabel}`
      : `Updated ${meta.updatedLabel}`;
  }

  // Dynamic page title \u2014 includes week number and archive flag.
  if (weekNum != null) {
    const isArchive = weekKey !== "current";
    document.title = isArchive
      ? `Week ${weekNum} AI News (Archive) \u2014 FIT Automate`
      : `Week ${weekNum} AI News \u2014 FIT Automate`;
  }

  const footerText = document.querySelector(".footer-meta");
  if (footerText && meta.dataDate) {
    footerText.textContent = `Data date: ${meta.dataDate}`;
  }
}

async function renderWeek(weekKey) {
  const data = await loadData(weekKey);
  const rawNews = Array.isArray(data.news) ? data.news : [];
  const meta = data.meta || {};

  // Selector: if a week has more than 12 candidates, pick a balanced 12-card set.
  const selected = selectTopStories(rawNews, { targetCount: 12 });

  // Visual polish: keep the selected stories but present the top row with more variety.
  const news = diversifyTop(selected);

  renderMeta(meta, weekKey);
  renderStats();
  renderNews(news);
}

async function init() {
  const select = document.getElementById("weekSelect");
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("week");

  try {
    const { map, weeks } = await loadWeekFileMap();
    weekFileMap = map;
    manifestWeeks = weeks;
    fillWeekSelector(weeks);
  } catch (error) {
    console.error(error);
    manifestWeeks = [];
    if (select) {
      select.innerHTML = `<option value="current">Current</option>`;
    }
  }

  const initialWeek = fromUrl && weekFileMap[fromUrl] ? fromUrl : "current";

  if (select) {
    select.value = initialWeek;
    select.addEventListener("change", async (event) => {
      const week = event.target.value;
      const next = new URL(window.location.href);
      next.searchParams.set("week", week);
      window.history.replaceState({}, "", next);
      try {
        await renderWeek(week);
      } catch (error) {
        console.error(error);
        await renderWeek("current");
        select.value = "current";
      }
    });
  }

  // Header brand: clicking "FIT Automate" returns to the current (latest) week.
  // Keep the native href="#top" scroll; just reset week state and re-render.
  const brand = document.querySelector(".brand");
  if (brand) {
    brand.addEventListener("click", async () => {
      const next = new URL(window.location.href);
      next.searchParams.delete("week");
      window.history.replaceState({}, "", next);
      if (select) select.value = "current";
      try {
        await renderWeek("current");
      } catch (error) {
        console.error(error);
      }
    });
  }

  try {
    await renderWeek(initialWeek);
  } catch (error) {
    console.error(error);
    const gridEl = document.getElementById("newsGrid");
    gridEl.innerHTML = `<article class="card"><h3>Unable to load selected week</h3><p>Check that the selected archive JSON file exists.</p></article>`;
  }
}

init();


