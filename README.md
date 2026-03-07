# AI-Assisted Architecture

A reusable framework for creating TOGAF-aligned Architecture Building Blocks (ABBs) and Solution Building Blocks (SBBs) with AI agent assistance. Install it as a Git submodule in any enterprise architecture workspace.

## Prerequisites

### Python

Python 3.10+ is required to run the PowerPoint generation script.

```bash
pip install python-pptx Pillow
```

### Draw.io Desktop

[Draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases) is required for exporting diagrams to PNG at 300 DPI.

### Visual Design Standard

You **must** provide a visual design standard for your organisation. The framework ships with an example at `standards/visual-design/visual-design-standard.md` that defines colour tokens, typography, and accessibility rules. Copy and modify this file to match your organisation's brand guidelines.

The ABB and SBB standards (document structure, diagram layout, cross-referencing) are part of the framework and do not need to be overridden.

## Installation

Add as a Git submodule to your workspace:

```bash
git submodule add <repo-url> .ai-assisted-architecture
```

## Workspace Setup

Your workspace must contain a `building-blocks/` folder with two subdirectories. This is where the agents and skills create ABBs and SBBs:

```
your-workspace/
  .ai-assisted-architecture/  # This framework (submodule)
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
mkdir -p building-blocks/architecture-building-blocks building-blocks/solution-building-blocks
```

## IDE Integration

The `install/` folder contains configuration snippets for each supported AI tool. Copy or merge these into your workspace root so your AI tools can discover the framework.

See [`install/README.md`](install/README.md) for the full list of files and where to place them.

Supported tools: Claude Code, Cursor, GitHub Copilot, Gemini, Cline, Windsurf.

## Agent Skills

| Skill | Claude Code | Cursor / Copilot | Description |
|-------|-------------|-------------------|-------------|
| Create ABB | `/create-abb` | `@create-abb` | End-to-end ABB creation: discovery, document, diagram, summary, PowerPoint. |
| Create SBB | `/create-sbb` | `@create-sbb` | End-to-end SBB creation: discovery, document, diagram, summary, PowerPoint. |

Each skill follows a four-phase workflow: Discovery, Load Standards, Create Artefacts, Self-Verification. See `agents/` for the full specifications.

## Repository Structure

```
.ai-assisted-architecture/
  agents/                  # Canonical agent specifications (IDE-agnostic)
  install/                 # IDE configuration snippets (copy to workspace)
  scripts/                 # Automation scripts (PowerPoint generation)
  standards/
    visual-design/         # Visual design standard (override with your own)
    building-blocks/
      architecture-building-block/
        standard-abb-document.md
        standard-abb-diagram.md
        example/
      solution-building-block/
        standard-sbb-document.md
        standard-sbb-diagram.md
        example/
      standard-cross-referencing.md
  example/                 # Example workspace layout
  AGENTS.md                # Agent discovery and precedence rules
```

## Standards

- **ABB/SBB document and diagram standards** are part of this framework. They define the structure, metadata, and layout rules for building block artefacts. These do not need to be customised.
- **Visual design standard** defines colour tokens, typography, contrast ratios, and accessibility rules. This **must** be customised to your organisation's brand.
- **Cross-referencing standard** defines how ABBs and SBBs link to each other using folder-relative paths.

## Licence

- **Documentation** (standards, agents, markdown files): [CC BY 4.0](LICENSE)
- **Code** (scripts, configuration): [MIT](LICENSE-CODE)

## Attribution

Created by **Dermot O'Brien** ([@dermot-obrien](https://github.com/dermot-obrien)).

If you use, fork, or build on this framework, please credit the original project and link to this repository.
