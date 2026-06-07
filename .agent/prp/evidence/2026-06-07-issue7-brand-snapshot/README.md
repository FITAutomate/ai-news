# Pinned FIT brand snapshot — for issue #7

- **purpose:** Versioned, auditable copy of the FIT brand source of record, pinned for the AI News
  brand implementation (issue #7).
- **source repo:** `FITAutomate/fit-solutions`
- **source path:** `brand/`
- **pinned commit:** `d2fef9edc481f2b0e1d7d542fbaf093b8d9484f7`
- **retrieved:** 2026-06-07 (via GitHub MCP)
- **pinned by:** Nico

## Why this exists

Issue #7 must implement the FIT brand from a canonical, versioned source rather than from memory
(per the access report and John's instruction). `FITAutomate/fit-solutions/brand/` is the source of
record; this folder is a read-only snapshot at the commit above so the brand implementation has a
fixed reference even if the upstream brand evolves. If the upstream brand changes, re-pin from the
new commit and note the diff.

## Files (verbatim at the pinned commit)

- `colors.md` — palette: `fit-blue` #007CE8 (primary), `fit-green` #1CD000 (status/approval only),
  Tailwind `slate` scale for neutrals. Dark mode = slate surfaces, not navy/black.
- `typography.md` — Poppins (headings 500/600), Open Sans (body 400/600), JetBrains Mono (mono);
  type scale + line heights.
- `design-principles.md` — the six FIT design principles (clarity, systems-look-like-systems,
  flow-not-friction, unambiguous status, legible human oversight, colour-with-intent).
- `voice-and-tone.md` — brand voice (copy). Applies to wording; **copy changes route to Maya**, not
  implemented in #7 (visual brand only).
- `anti-ai-writing-style.md` — writing audit rules (copy). Same note: Maya's lane.

## Scope note for #7

#7 implements the **visual** brand (colors, typography, components) on the Astro site. The two
voice/copy files are pinned for completeness and source-fidelity, but any external-facing copy
change is out of #7's scope and requires Maya review.
