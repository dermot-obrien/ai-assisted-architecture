# AI-Assisted Architecture

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Licence: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-blue.svg)](LICENSES/CC-BY-4.0.txt)
[![Licence: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-blue.svg)](LICENSES/Apache-2.0.txt)
[![REUSE 3.3](https://img.shields.io/badge/REUSE-3.3-lightgrey.svg)](https://reuse.software/spec-3.3/)

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
git submodule add https://github.com/dermot-obrien/ai-assisted-architecture.git .ai-assisted-architecture
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
| Create Outcome/UC | `/create-strategy` | `@create-strategy` | Strategic and operational layer creation. |
| Create Platform | `/create-platform` | `@create-platform` | Defining platforms and executive ownership. |
| Create Capability | `/create-capability` | `@create-capability` | End-to-end capability creation and maturity mapping. |
| Create Context | `/create-context` | `@create-context` | Defining Bounded Contexts and linguistic boundaries. |
| Create ABB | `/create-abb` | `@create-abb` | End-to-end ABB creation: logical structure and diagrams. |
| Create SBB | `/create-sbb` | `@create-sbb` | End-to-end SBB creation: product mapping and realisation. |
| Create Service | `/create-service` | `@create-service` | Runtime unit of execution definition. |

Each skill follows a four-phase workflow: Discovery, Load Standards, Create Artefacts, Self-Verification. See `agents/` for the full specifications.

## Repository Structure

```
.ai-assisted-architecture/
  agents/
    FRAMEWORK_AGENTS.md    # Agent discovery and precedence rules
    create-strategy.md     # Outcome / Use Case creation
    create-platform.md     # Platform definition
    create-capability.md   # Capability creation
    create-context.md      # Bounded Context definition
    create-abb.md          # ABB creation
    create-sbb.md          # SBB creation
    create-service.md      # Service definition
  install/                 # IDE configuration snippets (copy to workspace)
  scripts/                 # Automation scripts (PowerPoint generation, foundation seeding)
  foundation/              # Seed capabilities and building blocks for workspace bootstrap
  standards/
    standard-traceability.md          # Golden Thread linking all layers
    strategy/
      standard-strategy.md            # Outcomes and Use Cases
    platforms/
      platform-standard.md            # Platforms
      platform-diagram-standard.md    # Platform landscape diagrams
    capabilities/
      standard-capability-document.md # Capability documents
      standard-capability-diagram.md  # Capability maps and traceability matrices
    contexts/
      standard-bounded-context.md     # Bounded Contexts
    building-blocks/
      architecture-building-blocks/
        standard-abb-document.md
        standard-abb-diagram.md
        example/
      solution-building-blocks/
        standard-sbb-document.md
        standard-sbb-diagram.md
        example/
    runtime/
      standard-service.md             # Runtime Services
    visual-design/                    # Visual design standard (override in workspace)
  example/                 # Example workspace layout
```

## Standards

| Standard | Customise? | Description |
|----------|-----------|-------------|
| Visual design | Yes | Colour tokens, typography, contrast ratios, accessibility. Place a `visual-design/visual-design-standard.md` folder anywhere in your workspace. |
| Traceability | No | The "Golden Thread" linking all layers from Outcomes to Services. |
| Strategy | No | Structure and metadata for Business Outcomes and Use Cases. |
| Platform | No | Structure and metadata for Platforms, platform-as-product model. |
| Platform diagrams | No | Platform landscape card-grid layout and styling rules. |
| Capability document | No | Document structure, maturity model, and ABB mapping for capabilities. |
| Capability diagrams | No | Capability map and capability-to-ABB traceability diagram structure and styling rules. |
| Bounded Context | No | Structure and metadata for Bounded Contexts and linguistic boundaries. |
| ABB document | No | Document structure, metadata, and section layout for ABBs. |
| ABB diagram | No | Draw.io diagram structure, styling, and export rules for ABBs. |
| SBB document | No | Document structure, metadata, and section layout for SBBs. |
| SBB diagram | No | Draw.io diagram structure, styling, and export rules for SBBs. |
| Service | No | Structure and metadata for runtime Services. |

## Foundation Profiles

The framework ships with a seed foundation that provides a complete platform-as-product baseline:

- **12 platforms** (PL-001 Security through PL-012 Continuous Delivery)
- **44 capabilities** across L1/L2/L3 hierarchy
- **12 bounded contexts** with ubiquitous language
- **8 ABBs** and **3 SBBs** with full diagram sets
- **13 strategic outcomes**

Profiles control what gets seeded:

- `core`: baseline cross-cutting capabilities and ABBs.
- `integration`: API mediation and event-driven integration capabilities and ABBs.
- `infrastructure`: compute runtime and storage lifecycle capabilities and ABBs.
- `foundation` / `all`: all profiles combined.

See `.ai-assisted-architecture/foundation/foundation-manifest.yaml`.

## Licence

This framework is permissively licensed to encourage the widest possible adoption — private, public, academic, and commercial. Attribution is the primary expectation.

- **Documentation, standards, agent specifications, foundation seeds, diagrams** ([`CC BY 4.0`](LICENSES/CC-BY-4.0.txt)) — use, share, modify, and redistribute, including commercially, with attribution.
- **Executable code** (`scripts/*.py`, `scripts/*.ps1`) ([`Apache-2.0`](LICENSES/Apache-2.0.txt)) — same permissions, with an explicit patent grant.

Per-file licensing is declared via SPDX identifiers and the [`REUSE.toml`](REUSE.toml) manifest, following the [REUSE Specification 3.3](https://reuse.software/spec-3.3/). See [`LICENSE`](LICENSE) for the full overview.

### Trademark

"AI-Assisted Architecture" and any associated logos are trademarks of Dermot O'Brien. The licences above grant rights to the **content and code** only; they do not grant rights to use these marks. Nominative use ("based on AI-Assisted Architecture") is welcome; please use a different name for forks or derivative offerings.

## Attribution

Created by **Dermot O'Brien** ([@dermot-obrien](https://github.com/dermot-obrien)).

If you use, fork, or build on this framework, please credit the original project and link to this repository. Both CC BY 4.0 and Apache-2.0 require attribution; keep the copyright notices and indicate any changes you have made.
