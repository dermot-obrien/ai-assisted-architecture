# Installation

AI-Assisted Architecture works with any agent that reads [Agent Skills](https://agentskills.io):
VS Code with GitHub Copilot, Cursor, Claude Code, Codex, Gemini CLI and others. Pick one of
the routes below. The [quick start](quick-start.md) walks through the first one end to end.

Whichever route you take, you need:

| Requirement | Why |
|---|---|
| The nine `aaa-*` skill folders where your agent reads skills | The skills themselves |
| The `model` skill beside them, from [diagram-model](https://github.com/dermot-obrien/diagram-model) | Every `aaa-create-*` skill resolves its bindings with `model doctor` |
| The framework's `standards/` somewhere in the workspace | The skills load the standards before writing; see [Concepts](concepts.md#standards-how-artefacts-are-written) |
| `.agents/skill-bindings.toml` | Where each skill writes; see [Configuration](configuration.md#skill-bindings) |
| Python 3.11 or later | `model doctor` and `aaa-rung` |
| Node.js 18 or later | The installer, the post-install checks and the ontology scripts |
| draw.io desktop, optional | PNG export of diagrams |

## Where agents read skills

| Folder | Read by |
|---|---|
| `.agents/skills/` in the workspace | VS Code with GitHub Copilot, Cursor, Codex, Gemini CLI and most other hosts |
| `.claude/skills/` in the workspace | Claude Code; VS Code with GitHub Copilot and Cursor also read it |
| `.github/skills/` in the workspace | VS Code with GitHub Copilot |
| `.cursor/skills/` in the workspace | Cursor |
| `~/.agents/skills/`, `~/.claude/skills/`, `~/.copilot/skills/`, `~/.cursor/skills/` | The same tools, for every workspace |

The installer uses the workspace-level `.agents/skills/` and links `.claude/skills/` at it.
Check your agent's own documentation for the folders its current version reads.

## Route 1: local clones and the installer (recommended)

AAA installs through the engine in [AI-Assisted Work](https://github.com/dermot-obrien/ai-assisted-work)
(AAW). Clone both into the workspace and install AAW first, then AAA. Only git is needed; no
package registry.

```bash
git clone https://github.com/dermot-obrien/ai-assisted-work .ai-assisted-work
git clone https://github.com/dermot-obrien/ai-assisted-architecture .ai-assisted-architecture
node .ai-assisted-work/bin/aaw.js install --yes --work-items-path work-items
node .ai-assisted-architecture/bin/aaa.js install --workspace .
```

Add `--seed` to the last command to copy the starter capability model into the workspace. For
Claude Code, create `.claude` in the workspace first so the installer links the skills there.

`aaa install` can install into another workspace with `--workspace <path>`, so one clone can
serve several workspaces. It records where the framework is in that workspace's
`.aaw-config.yaml`, and the skills find the standards from there. Every option is in
[Commands](commands.md#aaa-install).

Do not commit the installed skills or the clones into your repository. Add them to
`.gitignore` and re-run the installer after pulling a new version:

```gitignore
.ai-assisted-work/
.ai-assisted-architecture/
.agents/skills/aaa-*
.claude/skills/aaa-*
```

## Route 2: npm git dependency

Installing AAA as a dependency pulls AAW with it. Still no registry needed: npm fetches both
from GitHub.

```bash
npm i github:dermot-obrien/ai-assisted-architecture
npx aaw install --yes --work-items-path work-items
npx aaa install --workspace .
```

The framework then lives in `node_modules/ai-assisted-architecture/`, and the skills find the
standards through `.aaw-config.yaml`.

## Route 3: copy the skill folders

For an agent-only setup with no installer, copy the folders yourself, at workspace or user
level. Clone the repository somewhere first.

```powershell
New-Item -ItemType Directory -Force .agents/skills | Out-Null
Copy-Item -Recurse path/to/ai-assisted-architecture/skills/aaa-* .agents/skills/
```

```bash
mkdir -p .agents/skills
cp -r path/to/ai-assisted-architecture/skills/aaa-* .agents/skills/
```

For every workspace, copy into a user-level folder from the table above instead, such as
`~/.agents/skills/`. A copied skill still needs the framework's standards to be findable: keep
a clone at `.ai-assisted-architecture/` in the workspace, or copy the standards you use into
the workspace under their own file names. Run the [post-install checks](commands.md#post-install-checks)
afterwards; with no installer, create `.aaa-config.yaml` from `install/templates/aaa-config.yaml`.

## The model skill

Put `skills/model/` from [diagram-model](https://github.com/dermot-obrien/diagram-model) in the
same skills folder as the AAA skills:

```bash
git clone https://github.com/dermot-obrien/diagram-model .diagram-model
cp -r .diagram-model/skills/model .agents/skills/model
```

In PowerShell, `Copy-Item -Recurse .diagram-model/skills/model .agents/skills/model`.
diagram-model's README lists other ways to install it, including user-level folders.

## Agent instruction files

The skills are enough on their own. If your team also keeps always-on instruction files, the
`install/` folder has snippets to merge once into `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
`.github/copilot-instructions.md`, `.cursor/rules/`, `.clinerules` and `.windsurfrules`. The
table in [install/README.md](../install/README.md) says which goes where. The installer does not
merge these for you.

## Your visual design standard

Diagrams take their colours from the visual design standard. Until you provide your own, the
framework's example palette is used. To make your own, copy it anywhere in the workspace inside
a folder named `visual-design`:

```bash
mkdir -p standards/visual-design
cp .ai-assisted-architecture/standards/visual-design/visual-design-standard.md standards/visual-design/
```

Edit the hex values and keep the token numbering (`1.1`, `2.6` and so on), which the diagram
standards refer to.

## Verify

```bash
node .ai-assisted-architecture/scripts/validate-bundle.mjs --run-checks . .ai-assisted-architecture
```

Nine `ok` lines mean every skill is installed and bound. Then type `/` in your agent: the nine
`/aaa-*` skills should be listed.

## Update and remove

To update, pull the clones (or `npm update`) and run `aaa install` again. It replaces the skill
folders and leaves your artefacts, bindings and config alone.

To remove, delete `.agents/skills/aaa-*`, `.claude/skills/aaa-*`, `.aaa-config.yaml`, the
`aaa` entry under `modules` in `.aaw-config.yaml`, and the clone. Your artefacts are yours and
stay.
