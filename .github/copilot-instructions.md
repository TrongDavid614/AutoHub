# GitHub Copilot Instructions for AutoHub

All code contributions, suggestions, and architectural patterns must strictly adhere to the project's single source of truth guidelines defined in:

👉 [AGENTS.md](../AGENTS.md)

Key rules to follow:
- Strict TypeScript: no `any`, use `import type`, explicit return types.
- Path aliases: always use `@/` for cross-folder imports. Never use relative parent paths (`../`).
- Feature-driven module boundaries: no deep cross-feature imports.
- Desktop-first UI styling with Tailwind CSS and Lucide React icons.
