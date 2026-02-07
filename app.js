const news = [
  {
    category: "OpenAI",
    date: "2026-02-05",
    title: "OpenAI launched GPT-5.3-Codex",
    summary:
      "OpenAI announced GPT-5.3-Codex as a faster, more capable coding and agentic model, plus deeper security controls for cyber workflows.",
    source: "https://openai.com/index/introducing-gpt-5-3-codex/",
    sourceLabel: "OpenAI"
  },
  {
    category: "OpenAI",
    date: "2026-02-05",
    title: "OpenAI introduced Frontier enterprise platform",
    summary:
      "Frontier was announced as an enterprise system for building and governing AI agents with shared context, permissions, and production controls.",
    source: "https://openai.com/index/introducing-openai-frontier/",
    sourceLabel: "OpenAI"
  },
  {
    category: "Anthropic",
    date: "2026-02-05",
    title: "Anthropic released Claude Opus 4.6",
    summary:
      "Anthropic launched Opus 4.6 with longer-context capabilities, stronger coding/agent performance, and new controls like effort and compaction.",
    source: "https://www.anthropic.com/news/claude-opus-4-6",
    sourceLabel: "Anthropic"
  },
  {
    category: "Anthropic",
    date: "2026-02-04",
    title: "Anthropic said Claude will stay ad-free",
    summary:
      "Anthropic published a policy position that Claude conversations will not include ads or sponsored responses.",
    source: "https://www.anthropic.com/news/claude-is-a-space-to-think",
    sourceLabel: "Anthropic"
  },
  {
    category: "Markets",
    date: "2026-02-06",
    title: "Big Tech AI capex outlook nears $600B+",
    summary:
      "Reuters and CNBC reported investor volatility as major companies forecast very large 2026 AI infrastructure spending.",
    source: "https://www.reuters.com/business/global-software-data-firms-slide-ai-disruption-fears-compound-jitters-over-600-2026-02-06/",
    sourceLabel: "Reuters"
  },
  {
    category: "Platforms",
    date: "2026-02-05",
    title: "Google framed as AI growth leader by some investors",
    summary:
      "Reuters reported strong cloud growth and Gemini adoption signals, alongside concerns around very high capital expenditures.",
    source: "https://www.reuters.com/business/google-goes-laggard-leader-it-pulls-ahead-openai-with-stellar-ai-growth-2026-02-05/",
    sourceLabel: "Reuters"
  },
  {
    category: "Adoption",
    date: "2026-02-06",
    title: "AI companies increased creator marketing spend",
    summary:
      "CNBC reported large creator partnership budgets from major AI firms as user growth competition expands beyond classic ad channels.",
    source: "https://www.cnbc.com/2026/02/06/google-microsoft-pay-creators-500000-and-more-to-promote-ai.html",
    sourceLabel: "CNBC"
  },
  {
    category: "Infrastructure",
    date: "2026-02-07",
    title: "Race to reduce dependency on Nvidia highlighted",
    summary:
      "Coverage showed continued movement toward custom chips and alternative accelerators while Nvidia remains dominant.",
    source: "https://english.elpais.com/technology/2026-02-07/google-amazon-openai-and-the-race-to-find-alternatives-to-nvidia.html",
    sourceLabel: "EL PAIS"
  }
];

const stats = [
  { label: "Stories", value: String(news.length) },
  { label: "Window", value: "Feb 4-7, 2026" },
  { label: "Primary Sources", value: "8" },
  { label: "Themes", value: "Models, Spend, Chips" }
];

const statsEl = document.getElementById("stats");
const gridEl = document.getElementById("newsGrid");
const sourceListEl = document.getElementById("sourceList");

stats.forEach((item) => {
  const div = document.createElement("div");
  div.className = "stat";
  div.innerHTML = `<div class="label">${item.label}</div><div class="value">${item.value}</div>`;
  statsEl.appendChild(div);
});

news.forEach((item, i) => {
  const card = document.createElement("article");
  card.className = "card";
  card.style.animationDelay = `${i * 80}ms`;
  card.innerHTML = `
    <span class="badge">${item.category}</span>
    <h3>${item.title}</h3>
    <p>${item.summary}</p>
    <div class="card-meta">
      <span>${item.date}</span>
      <a href="${item.source}" target="_blank" rel="noopener noreferrer">Read source</a>
    </div>
  `;
  gridEl.appendChild(card);
});

const uniqueSources = [];
news.forEach((item) => {
  if (!uniqueSources.some((s) => s.url === item.source)) {
    uniqueSources.push({ name: item.sourceLabel, url: item.source });
  }
});

uniqueSources.forEach((s) => {
  const li = document.createElement("li");
  li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}: ${s.url}</a>`;
  sourceListEl.appendChild(li);
});
