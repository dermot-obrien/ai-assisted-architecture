# Install

## Quick install (recommended)

AAA installs through the shared AAW install engine (see `framework.manifest.yaml`).
Clone AAW + AAA into your workspace, then run one command:

```bash
git clone https://github.com/dermot-obrien/ai-assisted-work .ai-assisted-work
git clone https://github.com/dermot-obrien/ai-assisted-architecture .ai-assisted-architecture

node .ai-assisted-architecture/bin/aaa.js install          # wire command shims for detected tools
node .ai-assisted-architecture/bin/aaa.js install --seed    # ...and scaffold the foundation seed
```

The installer prompts for the target workspace and defaults to the current workspace. You can
reuse one local AAA clone across multiple workspaces; AAA uses the chosen workspace's
`.aaw-config.yaml` to resolve the matching AAW install source when it delegates to the shared engine.

This installs the eight Agent Skills, wires the legacy `create-*` command shims for every
detected tool (Claude/Cursor/Copilot/Gemini) and, with `--seed`, copies the selected profile's
capabilities and building-blocks into your workspace. Re-run any time; existing files are left
untouched.

The `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` discovery files still need a one-time
manual **merge** into your existing root files (see the table below) — the installer
copies skills and shims, it does not merge your instruction files.

## What the installer places

### Agent Skills (the primary integration)

```
.agents/skills/aaa-create-strategy/      ← read natively by Codex, Cursor,
.agents/skills/aaa-create-platform/        Copilot, VS Code and Gemini CLI
.agents/skills/aaa-create-capability/
.agents/skills/aaa-create-context/
.agents/skills/aaa-create-abb/
.agents/skills/aaa-create-sbb/
.agents/skills/aaa-create-service/
.agents/skills/aaa-create-runtime-agent/

.claude/skills/aaa-*                     ← linked at the above, for Claude Code
```

Invoke as `/aaa-create-abb` and so on. Each carries a `description`, so an assistant can reach
for one when a request matches rather than only when you type the command.

Claude Code is the one tool that does not read `.agents/skills/`, which is why the installer
links `.claude/skills/` at the same directory: a symlink, or a directory junction on Windows
which needs no elevation. Where the filesystem refuses both it falls back to a copy and says so.

Skills resolve the canonical standards by searching the workspace before falling back to the
framework copy, so they keep working when an organisation governs its standards in its own
tree. See any skill's `references/standards-discovery.md`.

Do not commit the installed skills into a consuming repository. They are generated from this
clone; gitignore `.agents/skills/aaa-*` and re-run the installer instead.

## Manual copy (merge-only files)

The installer places the skills. These discovery files are the only things you merge by hand,
once, into your existing root files.

| Source (this folder) | Destination (your workspace) | Action |
|---|---|---|
| `AGENTS.md.txt` | `AGENTS.md` | **Required.** Primary discovery file. |
| `CLAUDE.md.txt` | `.claude/CLAUDE.md` or root `CLAUDE.md` | Merge into your existing file |
| `GEMINI.md.txt` | `GEMINI.md` | Merge into your existing file |
| `gemini/styleguide.md` | `.gemini/styleguide.md` | Merge into your existing file |
| `github/copilot-instructions.txt` | `.github/copilot-instructions.md` | Merge into your existing file |
| `cursor/rules/standards.mdc` | `.cursor/rules/standards.mdc` | Copy. Always-applied standards discovery |
| `.cursorrules.txt` | `.cursorrules` | Merge into your existing file |
| `.clinerules.txt` | `.clinerules` | Merge into your existing file |
| `.windsurfrules.txt` | `.windsurfrules` | Merge into your existing file |

**Copy** means the file can be used as-is. **Merge** means append or integrate the content into
your existing file for that tool.

> The per-tool `create-*` command shims that used to live in `claude/commands/`,
> `cursor/rules/` and `github/prompts/` were removed alongside AAW 3.0.0. They are superseded
> by the Agent Skills above, and `aaa install` sweeps away any it previously wrote, since they
> point at instruction files that no longer exist.

> **Note:** This folder is only for IDE configuration. If you also want to validate or
> consolidate ontology data, that uses Node.js scripts shipped under
> `.ai-assisted-architecture/scripts/ontology/` — see the
> [Modernisation Ontology](../README.md#modernisation-ontology) section of the top-level README.

## Hierarchy & Creation Order

To maintain the "Golden Thread" of traceability, agents should ideally follow this creation order:

1.  **`/aaa-create-strategy`**: Define why you are building this (Outcomes/Use Cases).
2.  **`/aaa-create-platform`**: Define the high-level Platform and executive owner.
3.  **`/aaa-create-capability`**: Define what business ability is required.
4.  **`/aaa-create-context`**: Define the linguistic and technical boundary.
5.  **`/aaa-create-abb`**: Define the logical architectural model.
6.  **`/aaa-create-sbb`**: Define the physical product realisation.
7.  **`/aaa-create-service`**: Define the runtime unit of execution.

Outside the linear Golden Thread, a builder skill is available:

- **`/aaa-create-runtime-agent`**: Author an autonomous runtime agent as a catalogued service with run-time guardrails, contracts, capability scope, and output provenance.

Each skill proposes a missing parent rather than inventing one silently, so starting in the
middle of the thread is safe: `/aaa-create-sbb` will offer to create the ABB and Bounded
Context it needs.

## Foundation Seeding (Recommended)

After installing this framework, seed your workspace from `.ai-assisted-architecture/foundation/`
so agents work against workspace-owned capability and building-block content:

```bash
node .ai-assisted-architecture/bin/aaa.js install --seed
```

This runs the cross-platform Node seeder (`src/seed-foundation.mjs`), which replaced the
retired `scripts/seed-foundation.ps1`. Existing files are left untouched.
