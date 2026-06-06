# PRP: AI News HyperAgent Bootstrap

- **doc_id:** `prd-ai-news-hyperagent-bootstrap`
- **repo:** `FITAutomate/ai-news`
- **status:** draft for HyperAgent test
- **owner:** John Bewley
- **date:** 2026-06-06

## Purpose

Prepare `FITAutomate/ai-news` for a HyperAgent-led FIT standards bootstrap.

This PRP is not the implementation plan for the full site migration. It is the handoff document for issue `#2`, where HyperAgent should prove it can inspect the repo, inspect referenced FIT repos, scaffold missing repo standards, and then propose the real implementation issue map for the AI News FIT Astro + Cloudflare migration.

## Current Repo State

`ai-news` is currently a lightweight static site.

Known files and behavior:

- Root static app: `index.html`, `styles.css`, `app.js`
- Current data: `news-data.json`
- Archive data: `archive/news-YYYY-WW.json`
- Archive manifest: `archive/manifest.json`
- Weekly skill: `skills/ai-news-weekly/`
- Scripts: `scripts/sync-archive-manifest.mjs`, `scripts/week-key-from-date.mjs`
- Current deployment: GitHub Pages legacy root deploy at `https://fitautomate.github.io/ai-news/`
- Desired production domain: `https://ai-news.fitautomate.com`

GitHub issue state:

- Issue `#1` is closed.
- Issue `#1` should be used as the local issue body style reference.
- New orchestration issue should be issue `#2`.

## HyperAgent Mission

When issue `#2` is run, HyperAgent should:

1. Read this PRP first.
2. Inspect `FITAutomate/ai-news`.
3. Inspect closed issue `#1` in `FITAutomate/ai-news`.
4. Inspect `FITAutomate/agent-onboarding` for labels and issue templates.
5. Scaffold missing FIT repo standards in `ai-news`.
6. Create/adapt repo labels and issue templates from the `agent-onboarding` pattern.
7. Report what it could and could not access.
8. Ask John any blocking questions before decomposing the Astro/brand/Cloudflare work.
9. Propose the real phase issue map.
10. Stop before app implementation until John approves the generated issue plan.

## Source Map

HyperAgent should use these references.

FIT local standards:

- `D:\fit-automate-org\fit-solutions\.agent\skills\prp.md`
- `D:\fit-automate-org\fit-solutions\.agent\skills\astro.md`
- `D:\fit-automate-org\fit-solutions\brand`

Cloudflare procedure:

- `D:\fit-automate-org\docs\web\src\content\docs\operations\procedures\🪜 PROC — Cloudflare — Deploy Astro Site via Pages.md`

Reference repos:

- `FITAutomate/agent-onboarding`
- `FITAutomate/fit-knows-pro-dev`
- `FITAutomate/ai-news`

External docs:

- HyperAgent docs: `https://www.hyperagent.com/docs/`
- Astro AI docs: `https://docs.astro.build/llms.txt`
- Astro full docs: `https://docs.astro.build/llms-full.txt`
- Astro MCP endpoint: `https://mcp.docs.astro.build/mcp`
- Starwind AI docs: `https://starwind.dev/llms.txt`

## Scope

In scope for the first HyperAgent run:

- Add FIT `.agent` scaffolding.
- Add PRP artifact folders.
- Add root agent pointer files if missing.
- Add issue templates by inspecting and adapting `agent-onboarding`.
- Add labels by inspecting and adapting `agent-onboarding`.
- Update repo docs only as needed to explain the new standards and planning workflow.
- Create a proposed issue map for the real site work.

Out of scope for the first HyperAgent run:

- Do not convert the app to Astro yet.
- Do not redesign the page yet.
- Do not install Starwind yet.
- Do not configure Cloudflare yet.
- Do not disable GitHub Pages yet.
- Do not change production DNS.
- Do not publish to `ai-news.fitautomate.com`.
- Do not create a large multi-phase implementation PR without John approval.

## Expected Repo Standards

HyperAgent should add a minimal FIT repo standards surface, not the full historical bootstrap system.

Expected structure:

```text
.agent/
  AGENT.md
  COMMANDS.md
  CONTEXT.md
  piv.config.yaml
  prp/
    prds/
    plans/
    issues/
    reports/
    reviews/
    evidence/
```

The `.agent` files should be specific to `ai-news`.

The repo should declare conceptual skills needed for future work:

- `prp`
- `astro`
- `brand-check`
- `starwind-ui`
- `cloudflare-pages`
- `github-issues`

These are capability labels, not proof that the local environment already has those exact tools installed.

## Future Work To Plan, Not Run

HyperAgent should produce a proposed issue map for these work areas:

1. FIT repo standards bootstrap.
2. FIT brand redesign.
3. Astro static-site conversion.
4. Starwind/Starwind Pro component adoption.
5. Weekly data workflow preservation.
6. Cloudflare Pages deployment to `ai-news.fitautomate.com`.
7. GitHub Pages retirement and documentation cleanup.

The issue map should be small. Prefer 3-5 executable issues, not a large phase tree.

Each proposed implementation issue should include:

- Goal
- Context files
- In scope
- Out of scope
- Acceptance criteria
- Validation commands
- Rollback boundary
- Human approval gate

## Acceptance Criteria For Issue #2

Issue `#2` is complete when:

- HyperAgent has opened a PR with FIT repo scaffolding.
- The PR includes labels/templates setup or clearly explains why it could not create them.
- The PR includes a concise access report.
- The PR includes or links to a proposed issue map for the future implementation work.
- No Astro app conversion has been started.
- No Cloudflare production change has been made.
- No DNS or GitHub Pages production setting has been changed.
- John has enough information to grade HyperAgent's repo access, planning quality, and boundary control.

## Suggested Issue #2 Body

Title:

`PRP: Bootstrap AI News for FIT Astro and Cloudflare migration`

Body:

```markdown
# PRP: Bootstrap AI News for FIT Astro and Cloudflare migration

## Summary

Run the repo bootstrap PRP for `FITAutomate/ai-news`.

Start by reading:

`.agent/prp/prds/2026-06-06-ai-news-hyperagent-bootstrap.prd.md`

This is a HyperAgent capability test. The goal is to prove repo access, scaffold missing FIT standards, inspect reference repos, and propose the real implementation issue map. Do not start the Astro/brand/Cloudflare implementation yet.

## Goals

- Inspect this repo and closed issue #1 for local issue style.
- Inspect `FITAutomate/agent-onboarding` for labels and issue templates.
- Add missing FIT repo standards scaffolding.
- Add/adapt labels and issue templates from the reference repo.
- Report what you could and could not access.
- Propose the next implementation issues for the AI News FIT Astro + Cloudflare migration.
- Stop before implementation until John approves the issue map.

## In scope

- `.agent` scaffold
- PRP folders
- root agent pointer files if needed
- GitHub labels/templates
- minimal repo documentation updates
- proposed issue map

## Out of scope

- Astro conversion
- Starwind installation
- FIT brand redesign implementation
- Cloudflare Pages setup
- DNS changes
- GitHub Pages retirement
- production deployment

## Acceptance criteria

- PR opened with repo standards scaffolding.
- Labels/templates are added or access limitations are documented.
- Access report is included.
- Proposed implementation issue map is included.
- No app implementation has started.
- No production hosting changes were made.
```

## Grading Rubric

Grade HyperAgent on:

- **Repo access:** Can it inspect `ai-news`, issue `#1`, and `agent-onboarding`?
- **Pattern transfer:** Does it copy the right repo hygiene without overbuilding?
- **FIT judgment:** Does it preserve FIT standards and brand references accurately?
- **Planning quality:** Are future issues small, ordered, and executable?
- **Boundary control:** Does it stop before app implementation?
- **Evidence:** Does it cite files, PRs, issue numbers, commands, and access limits clearly?
