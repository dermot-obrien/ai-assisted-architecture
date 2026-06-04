# Install

## Quick install (recommended)

AAA installs through the shared AAW install engine (see `framework.manifest.yaml`).
Add AAW + AAA as submodules, then run one command:

```bash
git submodule add https://github.com/dermot-obrien/ai-assisted-work .ai-assisted-work
git submodule add https://github.com/dermot-obrien/ai-assisted-architecture .ai-assisted-architecture

node .ai-assisted-architecture/bin/aaa.js install          # wire command shims for detected tools
node .ai-assisted-architecture/bin/aaa.js install --seed    # ...and scaffold the foundation seed
```

This wires the `create-*` command shims for every detected tool (Claude/Cursor/
Copilot/Gemini) and, with `--seed`, copies the selected profile's capabilities +
building-blocks into your workspace (cross-platform Node port of the old
`scripts/seed-foundation.ps1`). Re-run any time; existing files are left untouched.

The `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` discovery files still need a one-time
manual **merge** into your existing root files (see the table below) — the installer
copies command shims, it does not merge your instruction files.

## Manual copy (reference / merge files)

The table below is the full file map, used for the merge-only files above and for
tools the installer doesn't wire automatically.

> **Note:** This folder is only for IDE configuration (Claude, Cursor, Copilot, Gemini, Cline, Windsurf). If you also want to validate or consolidate ontology data, that uses Node.js scripts shipped under `.ai-assisted-architecture/scripts/ontology/` — see the [Modernisation Ontology](../README.md#modernisation-ontology) section of the top-level README.

## What to Copy

| Source (this folder) | Destination (your workspace) | Action |
|---|---|---|
| `AGENTS.md.txt` | `AGENTS.md` | **Required.** Primary discovery file. |
| `CLAUDE.md.txt` | `.claude/CLAUDE.md` or root `CLAUDE.md` | Merge into your existing file |
| `claude/commands/create-strategy.md` | `.claude/commands/create-strategy.md` | Copy |
| `claude/commands/create-platform.md` | `.claude/commands/create-platform.md` | Copy |
| `claude/commands/create-capability.md` | `.claude/commands/create-capability.md` | Copy |
| `claude/commands/create-context.md` | `.claude/commands/create-context.md` | Copy |
| `claude/commands/create-abb.md` | `.claude/commands/create-abb.md` | Copy |
| `claude/commands/create-sbb.md` | `.claude/commands/create-sbb.md` | Copy |
| `claude/commands/create-service.md` | `.claude/commands/create-service.md` | Copy |
| `cursor/rules/standards.mdc` | `.cursor/rules/standards.mdc` | Copy |
| `cursor/rules/create-strategy.mdc` | `.cursor/rules/create-strategy.mdc` | Copy |
| `cursor/rules/create-platform.mdc` | `.cursor/rules/create-platform.mdc` | Copy |
| `cursor/rules/create-capability.mdc` | `.cursor/rules/create-capability.mdc` | Copy |
| `cursor/rules/create-context.mdc` | `.cursor/rules/create-context.mdc` | Copy |
| `cursor/rules/create-abb.mdc` | `.cursor/rules/create-abb.mdc` | Copy |
| `cursor/rules/create-sbb.mdc` | `.cursor/rules/create-sbb.mdc` | Copy |
| `cursor/rules/create-service.mdc` | `.cursor/rules/create-service.mdc` | Copy |
| `.cursorrules.txt` | `.cursorrules` | Merge into your existing file |
| `github/copilot-instructions.txt` | `.github/copilot-instructions.md` | Merge into your existing file |
| `github/prompts/create-strategy.prompt.md` | `.github/prompts/create-strategy.prompt.md` | Copy |
| `github/prompts/create-platform.prompt.md` | `.github/prompts/create-platform.prompt.md` | Copy |
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
2.  **`/create-platform`**: Define the high-level Platform and executive owner.
3.  **`/create-capability`**: Define what business ability is required.
4.  **`/create-context`**: Define the linguistic and technical boundary.
5.  **`/create-abb`**: Define the logical architectural model.
6.  **`/create-sbb`**: Define the physical product realisation.
7.  **`/create-service`**: Define the runtime unit of execution.

## Foundation Seeding (Recommended)

After installing this framework, seed your workspace from `.ai-assisted-architecture/foundation/` so agents work against workspace-owned capability and building-block content:

```powershell
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile core
```
