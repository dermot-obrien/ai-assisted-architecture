# AI-Assisted Architecture

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Licence: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-blue.svg)](LICENSES/CC-BY-4.0.txt)
[![Licence: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-blue.svg)](LICENSES/Apache-2.0.txt)
[![REUSE 3.3](https://img.shields.io/badge/REUSE-3.3-lightgrey.svg)](https://reuse.software/spec-3.3/)

A reusable framework for creating TOGAF-aligned Capabilities, Architecture Building Blocks (ABBs), and Solution Building Blocks (SBBs) with AI agent assistance.

## Install

AAA installs through the shared AAW engine (it depends on AAW). Both models below work
**without npm-registry access**. The installer wires the `create-*` command shims for
every detected tool (Claude/Cursor/Copilot/Gemini); add `--seed` to scaffold the
foundation (capabilities + building-blocks) into your workspace.

### Option A — npm git-dependency (recommended)

Installing AAA auto-pulls AAW (declared as its dependency):

```bash
npm i github:dermot-obrien/ai-assisted-architecture
npx aaa install            # add --seed to also scaffold the foundation
```

### Option B — git submodules

```bash
git submodule add https://github.com/dermot-obrien/ai-assisted-work .ai-assisted-work
git submodule add https://github.com/dermot-obrien/ai-assisted-architecture .ai-assisted-architecture
node .ai-assisted-architecture/bin/aaa.js install      # add --seed to scaffold
```

See [install/README.md](install/README.md) for the per-tool file map and the
discovery files (`AGENTS.md`/`CLAUDE.md`/`GEMINI.md`) you merge once.

> **Developers:** the `aaa` launcher and the foundation seeder
> (`src/seed-foundation.mjs`, a cross-platform Node port of the old
> `seed-foundation.ps1`) are zero-dependency Node scripts — nothing to build. The
> launcher delegates to AAW's engine (found via npm dependency, `node_modules`, or the
> `.ai-assisted-work` submodule). The **optional** Python diagram helper in
> `scripts/` (`generate_sbb_diagrams.py`) uses only the Python standard library and is
> not required for the core authoring workflow.

## Prerequisites

### Python (optional)

Python 3.10+ is only needed for the optional `scripts/generate_sbb_diagrams.py` diagram
helper, which uses the standard library — no third-party packages required.

### Draw.io Desktop

[Draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases) is required for exporting diagrams to PNG at 300 DPI.

### Node.js (optional — only for the ontology scripts)

[Node.js 18+](https://nodejs.org/) is required if you want to validate, consolidate, or namespace YAML/JSON files against the modernisation ontology. Run `npm install` once inside the framework directory (or inside the submodule if installed that way). See the [Ontology](#ontology) section below.

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
      ABB-001/
      ABB-002/
      ...
    solution-building-blocks/
      SBB-001/
      SBB-002/
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
  scripts/
    *.py / *.ps1           # SBB diagram helper, foundation seeding
    ontology/              # CLI tools for ontology data (validate, consolidate, namespace-divergent)
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
      standard-c4-context-diagram.md  # C4 System Context diagrams (Mermaid, outside-in view)
      architecture-building-blocks/
        standard-abb-document.md
        standard-abb-diagram.md
        example/
      solution-building-blocks/
        standard-sbb-document.md
        standard-sbb-diagram.md
        example/
        example-composite/            # Composite SBB (inside) + c4-context.md (outside) worked pair
    runtime/
      standard-service.md             # Runtime Services
    ontology/                         # Modernisation Ontology (JSON Schema + spec + example)
    visual-design/                    # Visual design standard (override in workspace)
  example/                 # Example workspace layout
  package.json             # Node.js dependencies for the ontology scripts
```

## Standards

| Standard | Customise? | Description |
|----------|-----------|-------------|
| Visual design | Yes | Colour tokens, typography, contrast ratios, accessibility. Place a `visual-design/visual-design-standard.md` folder anywhere in your workspace. |
| Traceability | No | The "Golden Thread" linking all layers from Outcomes to Services. |
| [AAW work seam](standards/aaw-work-seam.md) | No | How AAW work classes connect to AAA artefacts: `decision` → Decision Record; cross-cutting `intervention` → Capability/ABB/SBB. |
| Strategy | No | Structure and metadata for Business Outcomes and Use Cases. |
| Platform | No | Structure and metadata for Platforms, platform-as-product model. |
| Platform diagrams | No | Platform landscape card-grid layout and styling rules. |
| Capability document | No | Document structure, maturity model, and ABB mapping for capabilities. |
| Capability diagrams | No | Capability map and capability-to-ABB traceability diagram structure and styling rules. |
| Bounded Context | No | Structure and metadata for Bounded Contexts and linguistic boundaries. |
| C4 System Context diagram | No | The **Mermaid `flowchart`** convention for C4 Level 1 (System Context) views — the outside-in view of a top-level ABB/Capability (persons, the system boundary, external systems). The zoom-out companion to the composite SBB (inside) view. Uses a plain `flowchart`, **not** the experimental `C4Context` type. |
| ABB document | No | Document structure, metadata, and section layout for ABBs, including **capability dependencies** (the `requires` field — abstract ABB→ABB dependencies that feed gap analysis). |
| ABB diagram | No | Draw.io diagram structure, styling, and export rules for ABBs. |
| SBB document | No | Document structure, metadata, and section layout for SBBs, including **composite SBBs** (UML parts / ports / connectors) and when to use composite vs simple. |
| SBB diagram | No | Draw.io diagram structure, styling, and export rules for SBBs, plus the **Mermaid composite-structure** convention for composite SBBs. |
| Service | No | Structure and metadata for runtime Services. |
| Ontology | No | JSON Schema for capturing the Platform / Capability / Component / Change / Milestone / Driver model in a queryable form. Independent of the ABB/SBB authoring standards above; used when you want machine-readable governance/reporting data. See [Modernisation Ontology](#modernisation-ontology) below. |

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

## Modernisation Ontology

The framework ships an optional **ontology**, which is a JSON Schema that gives shape to enterprise reporting. It captures Platforms, Capabilities, Components (ABB/SBB), Interfaces, Changes, Milestones, Commitments, Transitions, Initiatives, Slips, Decisions, Drivers, Risks, Standards, Patterns, Views, Stakeholders, and an optional anchor to industry reference taxonomies where available (e.g. eTOM for telecom, ACORD for insurance, NRF ARTS for retail, HL7/FHIR for healthcare, etc.). It is industry-neutral and tool-neutral: author your data in YAML or JSON, validate it against the schema, and aggregate it across platforms.

The ontology is **parallel** to the ABB/SBB authoring standards. Use it if you want a queryable model for governance reporting; ignore it if markdown documents and diagrams alone are sufficient.

### Where it lives

```
standards/ontology/
  README.md                  # Usage guidance (read this first)
  SPECIFICATION.md           # Design rationale and entity definitions
  SCRIPTS.md                 # Reference docs for the CLI tools
  ontology-schema.json       # The authoritative JSON Schema (draft 2020-12)
  example-identity-platform.json   # Worked example for a single platform

scripts/ontology/
  validate.cjs               # Validate one file or a folder against the schema
  consolidate.cjs            # Merge per-platform documents into one aggregate
  namespace-divergent.cjs    # Resolve cross-platform ID collisions
```

### Installing the scripts

The scripts are CommonJS Node.js (>=18). Install dependencies once:

```bash
# If you cloned the framework directly
npm install

# If you added the framework as a submodule at .ai-assisted-architecture/
cd .ai-assisted-architecture && npm install && cd ..
```

This fetches `ajv`, `ajv-formats`, and `js-yaml` into `node_modules/` inside the framework directory. The three CLI scripts then work without further setup.

### Using the scripts

```bash
# Validate every ontology document under a folder of per-platform YAML files
node .ai-assisted-architecture/scripts/ontology/validate.cjs <your-ontology-data-root>

# Validate a single file
node .ai-assisted-architecture/scripts/ontology/validate.cjs path/to/platform.yaml

# Merge all per-platform documents into one aggregate, validating as you go
node .ai-assisted-architecture/scripts/ontology/consolidate.cjs <your-ontology-data-root> \
  --output aggregate.yaml --on-collision first-wins --validate

# Resolve cross-platform ID collisions (dry-run first)
node .ai-assisted-architecture/scripts/ontology/namespace-divergent.cjs <your-ontology-data-root> --dry-run
```

Each script accepts `--help` for the full option list. See [`standards/ontology/SCRIPTS.md`](standards/ontology/SCRIPTS.md) for full reference docs, exit codes, and common workflows.

### Wiring into CI

The validator exits non-zero on failure, so it slots into any pre-commit hook or build step. Example npm script (in your workspace's `package.json`):

```json
{
  "scripts": {
    "validate:ontology": "node .ai-assisted-architecture/scripts/ontology/validate.cjs ontology-data"
  }
}
```

See [`standards/ontology/SCRIPTS.md`](standards/ontology/SCRIPTS.md) for husky + lint-staged patterns.

### Authoring data

The ontology assumes you author your platform data as YAML or JSON files with a top-level `ontology_id: "modernisation-ontology"` marker. Files without that marker are silently skipped by the validator, so you can keep ontology data alongside other YAML in the same tree. Start from [`standards/ontology/example-identity-platform.json`](standards/ontology/example-identity-platform.json), copy and rename for your platform, then add Capabilities, Components, etc.

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
