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

const WEEK_FILE_MAP = {
  current: "./news-data.json",
  "2026-01": "./archive/news-2026-01.json",
  "2026-02": "./archive/news-2026-02.json",
  "2026-03": "./archive/news-2026-03.json",
  "2026-04": "./archive/news-2026-04.json",
  "2026-05": "./archive/news-2026-05.json",
  "2026-06": "./archive/news-2026-06.json",
  "2026-07": "./archive/news-2026-07.json",
  "2026-08": "./archive/news-2026-08.json",
  "2026-09": "./archive/news-2026-09.json",
  "2026-10": "./archive/news-2026-10.json",
  "2026-11": "./archive/news-2026-11.json",
  "2026-12": "./archive/news-2026-12.json",
  "2026-13": "./archive/news-2026-13.json",
  "2026-14": "./archive/news-2026-14.json",
  "2026-15": "./archive/news-2026-15.json"
};

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
  const file = WEEK_FILE_MAP[weekKey] || WEEK_FILE_MAP.current;
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

function renderStats(news, meta) {
  const stats = [
    { label: "Stories", value: String(news.length) },
    { label: "Window", value: meta.window || "N/A" },
    { label: "Primary Sources", value: String(new Set(news.map((n) => n.source)).size) },
    { label: "Themes", value: meta.themes || "N/A" }
  ];

  const statsEl = document.getElementById("stats");
  statsEl.innerHTML = "";

  stats.forEach((item) => {
    const div = document.createElement("div");
    div.className = "stat";
    div.innerHTML = `<div class="label">${item.label}</div><div class="value">${item.value}</div>`;
    statsEl.appendChild(div);
  });
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
    const tags = Array.isArray(item.tags) ? item.tags : [];

    card.innerHTML = `
      <div class="card-head">
        <span class="badge">${emoji} ${item.category}</span>
        <span class="rating" title="${item.rating || 1} out of 5">${stars}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="tags">${tags.map((tag) => `<span class="tag">#${tag}</span>`).join(" ")}</div>
      <div class="card-meta">
        <span>${item.date}</span>
        <a href="${item.source}">Read source</a>
      </div>
    `;

    gridEl.appendChild(card);
  });
}

function inferSourceLabel(item) {
  if (item && item.sourceLabel) return item.sourceLabel;
  try {
    const host = new URL(String(item && item.source ? item.source : "")).hostname;
    return host ? host.replace(/^www\./, "") : "Source";
  } catch {
    return "Source";
  }
}

function renderSources(news) {
  const bodyEl = document.getElementById("sourceTableBody");
  if (!bodyEl) return;

  bodyEl.innerHTML = "";

  news.forEach((item) => {
    const tr = document.createElement("tr");

    const tdSource = document.createElement("td");
    tdSource.textContent = inferSourceLabel(item);

    const tdTitle = document.createElement("td");
    const a = document.createElement("a");
    a.href = item.source;
    a.textContent = item.title || item.source;
    tdTitle.appendChild(a);

    tr.appendChild(tdSource);
    tr.appendChild(tdTitle);

    bodyEl.appendChild(tr);
  });
}

function renderMeta(meta) {
  const kicker = document.querySelector(".kicker");
  if (kicker && meta.updatedLabel) {
    kicker.textContent = `Updated: ${meta.updatedLabel}`;
  }

  const footerText = document.querySelector(".footer-meta");
  if (footerText && meta.dataDate) {
    footerText.textContent = `Built for GitHub Pages \u2022 Data date: ${meta.dataDate}`;
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

  renderMeta(meta);
  renderStats(news, meta);
  renderNews(news);
  renderSources(news);
}

async function init() {
  const select = document.getElementById("weekSelect");
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("week");
  const initialWeek = WEEK_FILE_MAP[fromUrl] ? fromUrl : "current";

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

  try {
    await renderWeek(initialWeek);
  } catch (error) {
    console.error(error);
    const gridEl = document.getElementById("newsGrid");
    gridEl.innerHTML = `<article class="card"><h3>Unable to load selected week</h3><p>Check that the selected archive JSON file exists.</p></article>`;
  }
}

init();


