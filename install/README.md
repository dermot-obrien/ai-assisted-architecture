# Install

This folder contains IDE configuration snippets for AI-Assisted Architecture. Copy or merge these into your workspace so your AI tools can discover the framework.

All paths assume the submodule is installed at `.ai-assisted-architecture/`. If you used a different path, update the references accordingly.

## What to Copy

| Source (this folder) | Destination (your workspace) | Action |
|---|---|---|
| `AGENTS.md.txt` | `AGENTS.md` | **Required.** Primary discovery file. |
| `CLAUDE.md.txt` | `.claude/CLAUDE.md` or root `CLAUDE.md` | Merge into your existing file |
| `claude/commands/create-abb.md` | `.claude/commands/create-abb.md` | Copy |
| `claude/commands/create-sbb.md` | `.claude/commands/create-sbb.md` | Copy |
| `cursor/rules/standards.mdc` | `.cursor/rules/standards.mdc` | Copy |
| `cursor/rules/create-abb.mdc` | `.cursor/rules/create-abb.mdc` | Copy |
| `cursor/rules/create-sbb.mdc` | `.cursor/rules/create-sbb.mdc` | Copy |
| `.cursorrules.txt` | `.cursorrules` | Merge into your existing file |
| `github/copilot-instructions.txt` | `.github/copilot-instructions.md` | Merge into your existing file |
| `github/prompts/create-abb.prompt.md` | `.github/prompts/create-abb.prompt.md` | Copy |
| `github/prompts/create-sbb.prompt.md` | `.github/prompts/create-sbb.prompt.md` | Copy |
| `GEMINI.md.txt` | `GEMINI.md` | Merge into your existing file |
| `gemini/styleguide.md` | `.gemini/styleguide.md` | Merge into your existing file |
| `.clinerules.txt` | `.clinerules` | Merge into your existing file |
| `.windsurfrules.txt` | `.windsurfrules` | Merge into your existing file |

**Copy** means the file can be used as-is. **Merge** means append or integrate the content into your existing file for that tool.
