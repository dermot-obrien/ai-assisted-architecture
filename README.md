# AI-Assisted Architecture

A reusable framework for creating TOGAF-aligned Capabilities, Architecture Building Blocks (ABBs), and Solution Building Blocks (SBBs) with AI agent assistance. Install it as a Git submodule in any enterprise architecture workspace.

## Prerequisites

### Python

Python 3.10+ is required to run the PowerPoint generation script.

```bash
pip install python-pptx Pillow
```

### Draw.io Desktop

[Draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases) is required for exporting diagrams to PNG at 300 DPI.

### Visual Design Standard

The framework needs a visual design standard that defines your organisation's colour tokens, typography, and accessibility rules. Agents search for it by folder name:

1. **Search the workspace** for any folder named `visual-design` that contains `visual-design-standard.md`. The folder can be anywhere in your workspace hierarchy (e.g. `standards/visual-design/`, `governance/visual-design/`, `docs/visual-design/`).
2. **Fall back to the framework default** at `.ai-assisted-architecture/standards/visual-design/visual-design-standard.md` if no workspace copy is found.

To create your own, copy the framework's example and place it wherever suits your workspace:

```bash
mkdir -p standards/visual-design
cp .ai-assisted-architecture/standards/visual-design/visual-design-standard.md standards/visual-design/
```

Then edit `visual-design-standard.md` to match your organisation's brand. The colour token IDs (e.g. `1.1`, `2.6`, `4.3`) are referenced throughout the ABB/SBB diagram standards, so keep the same numbering scheme and update the hex values.

If you do not provide an override, agents will use the framework's example palette. This is fine for evaluation but should be replaced before producing artefacts for your organisation.

The ABB and SBB standards (document structure, diagram layout, cross-referencing) are part of the framework and do not need to be overridden.

## Installation

Add as a Git submodule to your workspace:

```bash
git submodule add <repo-url> .ai-assisted-architecture
```

## Workspace Setup

### 1. Create workspace folders

Your workspace must contain a `capabilities/` folder and a `building-blocks/` folder. This is where the agents and skills create capabilities, ABBs, and SBBs:

```
your-workspace/
  .ai-assisted-architecture/  # This framework (submodule)
  capabilities/
    capability-model.md        # Master capability taxonomy
    CAP-001/
    CAP-002/
    ...
  building-blocks/
    architecture-building-blocks/
      AB-001/
      AB-002/
      ...
    solution-building-blocks/
      SB-001/
      SB-002/
      ...
```

Create the folder structure:

```bash
mkdir -p capabilities building-blocks/architecture-building-blocks building-blocks/solution-building-blocks
```

### 2. Seed from foundation (recommended)

Run the seed script from your workspace root and treat the workspace copy as canonical:

```powershell
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile foundation
```

Optional:

```powershell
# Seed all profiles (core + integration + infrastructure)
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile all

# Alias for all profiles
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile foundation

# Seed only core baseline
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile core

# Overwrite existing seeded files
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile core -Force
```

If you do not seed first, agents can temporarily read baseline content from `.ai-assisted-architecture/foundation/`, but edits should still be made in workspace paths.

## IDE Integration

The `install/` folder contains configuration snippets for each supported AI tool. Copy or merge these into your workspace root so your AI tools can discover the framework.

See [`install/README.md`](install/README.md) for the full list of files and where to place them.

Supported tools: Claude Code, Cursor, GitHub Copilot, Gemini, Cline, Windsurf.

## Agent Skills

| Skill | Claude Code | Cursor / Copilot | Description |
|-------|-------------|-------------------|-------------|
| Create Capability | `/create-capability` | `@create-capability` | End-to-end capability creation: discovery, document, ABB mapping, maturity assessment. |
| Create ABB | `/create-abb` | `@create-abb` | End-to-end ABB creation: discovery, document, diagram, summary, PowerPoint. |
| Create SBB | `/create-sbb` | `@create-sbb` | End-to-end SBB creation: discovery, document, diagram, summary, PowerPoint. |

Each skill follows a four-phase workflow: Discovery, Load Standards, Create Artefacts, Self-Verification. See `agents/` for the full specifications.

## Repository Structure

```
.ai-assisted-architecture/
  agents/
    FRAMEWORK_AGENTS.md    # Agent discovery and precedence rules
  install/                 # IDE configuration snippets (copy to workspace)
  scripts/                 # Automation scripts (PowerPoint generation)
  foundation/              # Seed capabilities and building blocks for workspace bootstrap
  standards/
    visual-design/         # Visual design standard (override in workspace)
    capabilities/
      standard-capability-document.md
      standard-capability-diagram.md
    building-blocks/
      architecture-building-blocks/
        standard-abb-document.md
        standard-abb-diagram.md
        example/
      solution-building-blocks/
        standard-sbb-document.md
        standard-sbb-diagram.md
        example/
      standard-cross-referencing.md
  example/                 # Example workspace layout
```

## Standards

| Standard | Customise? | Description |
|----------|-----------|-------------|
| Visual design | Yes | Colour tokens, typography, contrast ratios, accessibility. Place a `visual-design/visual-design-standard.md` folder anywhere in your workspace. |
| Capability document | No | Document structure, maturity model, and ABB mapping for capabilities. |
| Capability diagrams | No | Capability map and capability-to-ABB traceability diagram structure and styling rules. |
| ABB document | No | Document structure, metadata, and section layout for ABBs. |
| ABB diagram | No | Draw.io diagram structure, styling, and export rules for ABBs. |
| SBB document | No | Document structure, metadata, and section layout for SBBs. |
| SBB diagram | No | Draw.io diagram structure, styling, and export rules for SBBs. |
| Cross-referencing | No | How capabilities, ABBs, and SBBs link to each other using folder-relative paths. |

## Foundation Profiles

The framework ships with a seed foundation profile model:

- `core` (active): baseline cross-cutting capabilities and ABBs.
- `integration` (active): API mediation and event-driven integration capabilities and ABBs.
- `infrastructure` (active): compute runtime and storage lifecycle capabilities and ABBs.

See `.ai-assisted-architecture/foundation/foundation-manifest.yaml`.

## Licence

- **Documentation** (standards, agents, markdown files): [CC BY 4.0](LICENSE)
- **Code** (scripts, configuration): [MIT](LICENSE-CODE)

## Attribution

Created by **Dermot O'Brien** ([@dermot-obrien](https://github.com/dermot-obrien)).

If you use, fork, or build on this framework, please credit the original project and link to this repository.
