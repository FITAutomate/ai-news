const CATEGORY_EMOJI = {
  OpenAI: "🧠",
  Anthropic: "🟣",
  Google: "🔵",
  Microsoft: "🪟",
  Meta: "🟦",
  Apple: "🍎",
  Amazon: "🟧",
  Agents: "🤖",
  RAG: "📚",
  Automation: "⚙️",
  Security: "🛡️",
  Chips: "🖥️",
  Policy: "🏛️",
  Business: "📈",
  Markets: "📈",
  Infrastructure: "🖥️",
  Platforms: "🔵",
  Adoption: "⚙️"
};

const WEEK_FILE_MAP = {
  current: "./news-data.json",
  "2026-01": "./archive/news-2026-01.json",
  "2026-06": "./archive/news-2026-06.json"
};

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
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
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

    const emoji = CATEGORY_EMOJI[item.category] || "📰";
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

function renderSources(news) {
  const sourceListEl = document.getElementById("sourceList");
  sourceListEl.innerHTML = "";

  const uniqueSources = [];
  news.forEach((item) => {
    if (!uniqueSources.some((s) => s.url === item.source)) {
      uniqueSources.push({ name: item.sourceLabel, url: item.source });
    }
  });

  uniqueSources.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${s.url}">${s.name}: ${s.url}</a>`;
    sourceListEl.appendChild(li);
  });
}

function renderMeta(meta) {
  const kicker = document.querySelector(".kicker");
  if (kicker && meta.updatedLabel) {
    kicker.textContent = `Updated: ${meta.updatedLabel}`;
  }

  const footerText = document.querySelector("footer p");
  if (footerText && meta.dataDate) {
    footerText.textContent = `Built for GitHub Pages • Data date: ${meta.dataDate}`;
  }
}

async function renderWeek(weekKey) {
  const data = await loadData(weekKey);
  const news = Array.isArray(data.news) ? data.news : [];
  const meta = data.meta || {};

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
