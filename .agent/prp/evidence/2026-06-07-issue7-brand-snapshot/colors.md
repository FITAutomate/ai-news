# FIT Brand - Colours

## Core brand colors

| Name | Hex | Usage |
| --- | --- | --- |
| `fit-blue` | `#007CE8` | Primary brand color. CTAs, links, active states, and key accents. |
| `fit-green` | `#1CD000` | Status/approval only: success, complete, published, approved. |

## Neutral system (required)

FIT neutrals use the Tailwind `slate` scale as the structural palette.
This is the default neutral ramp for backgrounds, surfaces, borders, and text hierarchy.

- `slate-50` to `slate-200`: light surfaces and separators
- `slate-500` to `slate-700`: secondary text and muted UI
- `slate-800` to `slate-950`: dark mode backgrounds and panels

## Usage rules

- Blue leads. If unsure, use `fit-blue`.
- Green confirms. Use `fit-green` only for status/approval semantics.
- Everything else follows the slate scale. Do not invent alternate neutral palettes per project.
- `fit-green` should not be used for body text on light backgrounds (contrast risk at smaller sizes).

## Implementation guidance

- Prefer tokenized usage in apps (`--fit-blue`, `--fit-green`, and slate tokens).
- Keep status colors semantic in code (`success`, `approved`, `published`) and map to `fit-green`.
- For dark mode, default to slate surfaces instead of navy/black backgrounds.

## What not to do

- Do not introduce new brand colors without an ADR.
- Do not use `fit-green` decoratively.
- Do not use pure black (`#000000`) as a page background.
