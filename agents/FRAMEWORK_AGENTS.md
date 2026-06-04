# Agent Configuration

This file defines top-level discovery and precedence rules for AI agents working with this framework. All paths are relative to the submodule root (`.ai-assisted-architecture/`).

## Agent Skills

| Skill | Claude Code | Cursor / Copilot | Description |
|-------|-------------|-------------------|-------------|
| Create Outcome/UC | `/create-strategy` | `@create-strategy` | Strategic and operational layer creation. |
| Create Platform | `/create-platform` | `@create-platform` | Defining business platforms and strategic ownership. |
| Create Capability | `/create-capability` | `@create-capability` | End-to-end capability creation and maturity mapping. |
| Create Context | `/create-context` | `@create-context` | Defining Bounded Contexts and linguistic boundaries. |
| Create ABB | `/create-abb` | `@create-abb` | End-to-end ABB creation: logical structure and diagrams. |
| Create SBB | `/create-sbb` | `@create-sbb` | End-to-end SBB creation: product mapping and realisation. |
| Create Service | `/create-service` | `@create-service` | Runtime unit of execution definition. |
| Create Runtime Agent | `/create-runtime-agent` | `@create-runtime-agent` | (Builder skill) Author an autonomous **runtime agent** as a catalogued service with run-time guardrails, contracts, capability scope, and output provenance. See `standards/agent-native/agent-types.md`. |

## Scripts

| Script | Path | Prerequisites | Description |
|--------|------|---------------|-------------|
| Building Block Slide | `.ai-assisted-architecture/scripts/create-building-block-slide.py` | `pip install python-pptx Pillow` | Creates a PowerPoint slide from a building block folder's `components.png` and `summary.png`. |
| Seed Foundation | `.ai-assisted-architecture/scripts/seed-foundation.ps1` | PowerShell | Seeds workspace `capabilities/` and `building-blocks/` from foundation profiles (`core`, `integration`, `infrastructure`). |

## Canonical Standards

Always load these standards before creating or modifying artefacts:

- **Visual design standard** - search the workspace for a folder named `visual-design` containing `visual-design-standard.md`. If found, load it. If not found, fall back to `.ai-assisted-architecture/standards/visual-design/visual-design-standard.md`.
- `.ai-assisted-architecture/standards/strategy/standard-strategy.md`
- `.ai-assisted-architecture/standards/platforms/platform-standard.md`
- `.ai-assisted-architecture/standards/capabilities/standard-capability-document.md`
- `.ai-assisted-architecture/standards/capabilities/standard-capability-diagram.md`
- `.ai-assisted-architecture/standards/contexts/standard-bounded-context.md`
- `.ai-assisted-architecture/standards/building-blocks/architecture-building-blocks/standard-abb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/architecture-building-blocks/standard-abb-diagram.md`
- `.ai-assisted-architecture/standards/building-blocks/solution-building-blocks/standard-sbb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/solution-building-blocks/standard-sbb-diagram.md`
- `.ai-assisted-architecture/standards/runtime/standard-service.md`
- `.ai-assisted-architecture/standards/standard-traceability.md`
- `.ai-assisted-architecture/standards/standard-frontmatter.md` *(v1.1.0)*

For **agent-native** workspaces (AI-majority engineering), also load:
- `.ai-assisted-architecture/standards/agent-native/agent-types.md` *(builders vs runtime agents)*
- `.ai-assisted-architecture/standards/agent-native/principles.md`
- `.ai-assisted-architecture/standards/agent-native/operating-model.md`
- `.ai-assisted-architecture/standards/agent-native/provenance.md`

## Scope Routing

- For business outcomes and use cases, apply `standard-strategy.md` via `create-strategy.md`.
- For business platforms, apply `platform-standard.md` via `create-platform.md`.
- For capability documents, apply `standard-capability-document.md` via `create-capability.md`.
- For capability diagrams (maps and traceability matrices), apply `standard-capability-diagram.md`.
- For bounded context definitions, apply `standard-bounded-context.md` via `create-context.md`.
- For ABB narrative/content documents, apply `standard-abb-document.md` via `create-abb.md`.
- For SBB narrative/content documents, apply `standard-sbb-document.md` via `create-sbb.md`.
- For runtime services, apply `standard-service.md` via `create-service.md`.
- For links between all layers, apply `standard-traceability.md`.
- For the YAML frontmatter on every catalog artefact, apply `standard-frontmatter.md` *(v1.1.0)*. Schemas at [`standards/schemas/v1.1.0/`](../standards/schemas/v1.1.0/).

## Enforcement Rules

- Traceability requirements (**Outcome → Use Case → Platform → Capability → Context → ABB → SBB → Service**) must be applied to every new artefact.
- Colour references must use identifiers (e.g., `1.1`) from the visual design standard.
- Cross-references must use folder-relative paths and must not append `/index.md`.

## Discovery Check (Agent Self-Check)

Before finalising any artefact, confirm:

1. All canonical standards above were loaded for the relevant artefact type.
2. The specific Agent Skill file (e.g., `create-strategy.md`) was followed.
3. The **AI Agent Self-Verification Checklist** from the relevant standard was executed.
4. The "Golden Thread" of traceability back to a Strategic Outcome is intact.
