# Source Selection Rules

## Objective

Maintain a high-signal, practical weekly brief with reliable attribution.

## Source Priority

1. Primary sources and official vendor posts (OpenAI, Anthropic, GitHub, VS Code release notes).
2. Reuters for business, policy, legal, and market context.
3. Avoid unverified social/video reposts unless user explicitly requests them.

## Date Window

- Include only stories within the requested weekly window.
- Use explicit ISO dates in each item.

## Story Mix

Aim for balanced coverage across:
- Business/markets
- Policy/regulation
- Infrastructure/chips
- Builder tooling/agents/dev workflow

## Quality Rules

- Verify each final URL before writing JSON (open in a browser or use any fetch tool you have).
- Keep summaries concise and factual (1 sentence).
- Use 2-5 tags per story.
- Rating scale remains 1-5.

## Consistency

- Ensure `meta.window`, `meta.updatedLabel`, and `meta.dataDate` all match the same release window.
- Keep category values consistent with existing site categories.