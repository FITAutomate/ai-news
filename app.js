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

async function loadData() {
  const response = await fetch("./news-data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load news-data.json: ${response.status}`);
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

async function init() {
  try {
    const data = await loadData();
    const news = Array.isArray(data.news) ? data.news : [];
    const meta = data.meta || {};

    renderMeta(meta);
    renderStats(news, meta);
    renderNews(news);
    renderSources(news);
  } catch (error) {
    console.error(error);
    const gridEl = document.getElementById("newsGrid");
    gridEl.innerHTML = `<article class="card"><h3>Unable to load news data</h3><p>Please run a local server (not file://) and make sure <code>news-data.json</code> exists.</p></article>`;
  }
}

init();
