# Evidence — Issue #7 foundation: Astro 6 + Starwind Pro

- **doc_id:** `evidence-issue7-foundation-2026-06-07`
- **issue:** `FITAutomate/ai-news#7` (Phase 2 — FIT brand redesign)
- **author:** Nico
- **date:** 2026-06-07
- **branch:** `migration/fit-brand`
- **status:** DRAFT PR — foundation increment. Brand token application + Pro components are the
  next increment (Quinn-gated).

## Inputs (from John, 2026-06-07)

- Starwind **Pro** (not OSS). License provided as a secret.
- Upgrade Astro 5 → 6 first; Node 22+; confirm the site still builds before Starwind/brand.
- Initialize Starwind Pro via `npx starwind@latest init --pro`; prefer CLI/MCP-generated additions.
- Brand source of record: `FITAutomate/fit-solutions/brand` pinned at commit
  `d2fef9edc481f2b0e1d7d542fbaf093b8d9484f7`.

## Secret handling (Starwind Pro license)

- The license is held in the **"Starwind Pro" skill** credential (`STARWIND_LICENSE_KEY`), entered
  by John in the secure credential UI — never in chat.
- It is injected as an env var only at command time via `RunWithCredentials`. Verified present
  (length checked, value never printed).
- `npx starwind init --pro` wrote the key into `.env.local`. `.env.local` is gitignored
  (`.gitignore` lines 13-16) and is NOT committed. `components.json` references the key as
  `${STARWIND_LICENSE_KEY}` (env reference), not a literal value. A scan of committed files found
  no literal key — only the env-var name in `components.json`.
- Rule held: key never committed, echoed, or logged.

## What was done (this increment)

1. **Astro 5 → 6 upgrade.** `astro@^6.4.4` in `package.json` + regenerated `package-lock.json`
   (Node v24). `npm run build` → PASS, `dist/` equivalent to the #6 site (index.html, app.js,
   styles.css, news-data.json, archive/* [24], icon.png, news-bg.png). Skeleton survived the major
   bump with no source changes.
2. **Starwind Pro initialized** via `npx starwind@latest init --pro --defaults`
   (`--defaults` for non-interactive sandbox). It:
   - Installed Tailwind CSS v4 + Starwind deps (`@tailwindcss/vite`, `@tailwindcss/forms`,
     `tailwindcss`, `tailwind-merge`, `tailwind-variants`, `tw-animate-css`, `@tabler/icons`).
   - Wired `astro.config.mjs` (added the `@tailwindcss/vite` plugin) and `tsconfig.json`
     (`@/* → src/*` path alias).
   - Created `src/styles/starwind.css`, `components.json` (with the `@starwind-pro` registry), and
     `starwind.config.json`.
   - Added `.vscode/starwind.code-snippets`.
   - Created `.env.local` (gitignored) for the license.
3. **Brand snapshot pinned** at `d2fef9e` into
   `.agent/prp/evidence/2026-06-07-issue7-brand-snapshot/` (colors, typography, design-principles,
   voice-and-tone, anti-ai-writing-style + provenance README).
4. **Build green post-init.** `starwind.css` is NOT yet imported into the page, so the site still
   renders exactly as the #6 baseline — a safe checkpoint before the visual brand work.

## Not done yet (next increment — Quinn-gated)

- Import `src/styles/starwind.css` and define **FIT brand tokens** there from the pinned snapshot:
  `--color-fit-blue: #007CE8` (primary), `--color-fit-green: #1CD000` (status/approval only),
  Tailwind `slate` neutrals (dark mode = slate surfaces, not navy/black), Poppins (headings) /
  Open Sans (body) / JetBrains Mono (mono). This is where the visual design changes from the
  current look — it needs deliberate reconciliation, not a raw preflight dump.
- Add the Starwind **Pro** components/blocks that fit the AI News site via the CLI
  (`starwind add @starwind-pro/...` through `RunWithCredentials`), committing the generated source
  (and `src/lib/utils.ts` when first created), never the key.
- Rework `src/pages/index.astro` to the FIT brand while preserving the news content + the runtime
  weekly-data behavior (`app.js`, `news-data.json`, `archive/`).
- Validation: `npm run build`, `npm run preview`, visual review against FIT brand, accessibility
  check.
- **Quinn brand sign-off required before merge.** Maya review for any new external copy (none
  planned — content is data-driven).

## Boundary

Issue #7 only. No Cloudflare, DNS, GitHub Pages, production, or #8-#10 work. No new external-facing
copy without Maya. Stops with a draft PR for review.
