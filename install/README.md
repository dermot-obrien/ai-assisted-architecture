# Install

This folder contains IDE configuration snippets for AI-Assisted Architecture. Copy or merge these into your workspace so your AI tools can discover the framework.

All paths assume the submodule is installed at `.ai-assisted-architecture/`. If you used a different path, update the references accordingly.

## What to Copy

| Source (this folder) | Destination (your workspace) | Action |
|---|---|---|
| `AGENTS.md.txt` | `AGENTS.md` | **Required.** Primary discovery file. |
| `CLAUDE.md.txt` | `.claude/CLAUDE.md` or root `CLAUDE.md` | Merge into your existing file |
| `claude/commands/create-strategy.md` | `.claude/commands/create-strategy.md` | Copy |
| `claude/commands/create-capability.md` | `.claude/commands/create-capability.md` | Copy |
| `claude/commands/create-context.md` | `.claude/commands/create-context.md` | Copy |
| `claude/commands/create-abb.md` | `.claude/commands/create-abb.md` | Copy |
| `claude/commands/create-sbb.md` | `.claude/commands/create-sbb.md` | Copy |
| `claude/commands/create-service.md` | `.claude/commands/create-service.md` | Copy |
| `cursor/rules/standards.mdc` | `.cursor/rules/standards.mdc` | Copy |
| `cursor/rules/create-strategy.mdc` | `.cursor/rules/create-strategy.mdc` | Copy |
| `cursor/rules/create-capability.mdc` | `.cursor/rules/create-capability.mdc` | Copy |
| `cursor/rules/create-context.mdc` | `.cursor/rules/create-context.mdc` | Copy |
| `cursor/rules/create-abb.mdc` | `.cursor/rules/create-abb.mdc` | Copy |
| `cursor/rules/create-sbb.mdc` | `.cursor/rules/create-sbb.mdc` | Copy |
| `cursor/rules/create-service.mdc` | `.cursor/rules/create-service.mdc` | Copy |
| `.cursorrules.txt` | `.cursorrules` | Merge into your existing file |
| `github/copilot-instructions.txt` | `.github/copilot-instructions.md` | Merge into your existing file |
| `github/prompts/create-strategy.prompt.md` | `.github/prompts/create-strategy.prompt.md` | Copy |
| `github/prompts/create-capability.prompt.md` | `.github/prompts/create-capability.prompt.md` | Copy |
| `github/prompts/create-context.prompt.md` | `.github/prompts/create-context.prompt.md` | Copy |
| `github/prompts/create-abb.prompt.md` | `.github/prompts/create-abb.prompt.md` | Copy |
| `github/prompts/create-sbb.prompt.md` | `.github/prompts/create-sbb.prompt.md` | Copy |
| `github/prompts/create-service.prompt.md` | `.github/prompts/create-service.prompt.md` | Copy |
| `GEMINI.md.txt` | `GEMINI.md` | Merge into your existing file |
| `gemini/styleguide.md` | `.gemini/styleguide.md` | Merge into your existing file |
| `.clinerules.txt` | `.clinerules` | Merge into your existing file |
| `.windsurfrules.txt` | `.windsurfrules` | Merge into your existing file |

**Copy** means the file can be used as-is. **Merge** means append or integrate the content into your existing file for that tool.

## Hierarchy & Creation Order

To maintain the "Golden Thread" of traceability, agents should ideally follow this creation order:

1.  **`/create-strategy`**: Define why you are building this (Outcomes/Use Cases).
2.  **`/create-capability`**: Define what business ability is required.
3.  **`/create-context`**: Define the linguistic and technical boundary.
4.  **`/create-abb`**: Define the logical architectural model.
5.  **`/create-sbb`**: Define the physical product realization.
6.  **`/create-service`**: Define the runtime unit of execution.

## Foundation Seeding (Recommended)

After installing this framework, seed your workspace from `.ai-assisted-architecture/foundation/` so agents work against workspace-owned capability and building-block content:

```powershell
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile foundation
```
