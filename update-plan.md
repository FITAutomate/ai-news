# FIT Automate Weekly Update Plan

## Goal

Publish a high-level weekly AI summary that is genuinely useful to John, with links worth clicking.

## Output target

- Preferred: 12 stories (3x4 grid)
- Minimum: 9 stories (if the week is genuinely quiet)
- Must be diverse and non-repetitive week-to-week

## John-focused priorities (weight higher)

- Agentic workflows, tool-use, coding agents
- RAG, retrieval, vector DBs, evaluation, governance
- Automation stack: n8n, Airtable, Make, Zapier, MCP, orchestration
- Practical security: AI + cyber workflows, controls, governance
- Infra affecting builder cost/perf: GPUs, NPUs, TPUs, Trainium, inference, serving

## Weekly mix target (12-card goal)

- 3 model/platform updates
- 3 business/market signals
- 2 infra/chips stories
- 1 policy/regulation story
- 3 builder workflow stories (MCP, coding agents, orchestration, automation tools)

## Credibility + diversity rules

Choose stories that are:
- Credible (official posts first, then Reuters/CNBC/Bloomberg/FT)
- Important (strategy, spend, roadmap, regulation)
- New (avoid repeating last week's same point)
- Diverse (not all from one vendor)

Selection constraints (to prevent “row 1 = all OpenAI”):
- Max 2 stories per vendor category per week (OpenAI/Anthropic/Google/Microsoft/Meta/Amazon/Apple)
- Max 1 story per vendor in the top 3 cards
- Avoid “same announcement twice” (e.g., two posts that are just different angles of the same launch)

## Weekly workflow

1. Gather 20-30 candidate links using buckets:
   - Product and model launches
   - Markets and enterprise impact
   - Infra and chips
   - Policy and regulation
   - John-focus pass with: n8n, Airtable, Make, MCP, agents, RAG, vector DB, evaluation, tool use, workflow automation
2. Score candidates with stars:
   - 5★ direct stack impact or major model/platform change
   - 4★ strong practical signal likely to matter soon
   - 3★ useful but not urgent (only if needed to hit 9)
   - 1-2★ skip
3. Select top 9-12 stories while preserving mix and diversity.
4. Update `news-data.json` (`meta` + `news`).
5. Create archive file: `archive/news-YYYY-WW.json`.
6. Local smoke test:
   - `python -m http.server 8080`
   - verify cards render, emoji + stars render, links open same tab
   - verify Week selector loads Current + target archive week
7. Commit + push to `main`.
8. Confirm GitHub Pages deploy completes.

## Backfill rule

- Start from Jan 1, 2026
- Do one week first to validate format
- Continue one week at a time (no large batches yet)

## Commit message format

`AI News Pulse: weekly update YYYY-MM-DD (Week WW)`
