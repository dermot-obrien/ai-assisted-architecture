# Agent Configuration

> **Superseded for the skills.** Each workflow is now a standalone Agent Skill under
> `skills/<name>/`, self-contained and carrying its own standards-resolution rules in
> `references/standards-discovery.md`. This file remains the discovery and precedence
> reference for the **legacy command shims** under `install/`, which are retained for installs
> that have not yet moved.

This file defines top-level discovery and precedence rules for AI agents working with this framework. All paths are relative to the framework root (`.ai-assisted-architecture/`).

## Agent Skills

Installed by `aaa install` into `.agents/skills/`, with `.claude/skills/` linked at them.

| Skill | Invoke | Legacy shim | Description |
|-------|--------|-------------|-------------|
| Create Outcome/UC | `/aaa-create-strategy` | `/create-strategy` | Strategic and operational layer creation. |
| Create Platform | `/aaa-create-platform` | `/create-platform` | Defining business platforms and strategic ownership. |
| Create Capability | `/aaa-create-capability` | `/create-capability` | End-to-end capability creation and maturity mapping. |
| Create Context | `/aaa-create-context` | `/create-context` | Defining Bounded Contexts and linguistic boundaries. |
| Create ABB | `/aaa-create-abb` | `/create-abb` | End-to-end ABB creation: logical structure and diagrams. |
| Create SBB | `/aaa-create-sbb` | `/create-sbb` | End-to-end SBB creation: product mapping, realisation, composite structure. |
| Create Service | `/aaa-create-service` | `/create-service` | Runtime unit of execution definition. |
| Derive Rung | `/aaa-rung` | (none) | Read-only. Derives each capability's rung on the definition ladder, per flow, and names the artefact blocking the next rung. See `standards/capabilities/standard-definition-ladder.md`. |
| Create Runtime Agent | `/aaa-create-runtime-agent` | `/create-runtime-agent` | (Builder skill) Author an autonomous **runtime agent** as a catalogued service with run-time guardrails, contracts, capability scope, and output provenance. See `standards/agent-native/agent-types.md`. |

## Scripts

| Script | Path | Prerequisites | Description |
|--------|------|---------------|-------------|
| Seed Foundation | `.ai-assisted-architecture/src/seed-foundation.mjs` | Node.js 18+ | Seeds workspace `capabilities/` and `building-blocks/` from foundation profiles (`core`, `integration`, `infrastructure`). Run via `aaa install --seed`. Cross-platform; replaces the retired `scripts/seed-foundation.ps1`. |

## Canonical Standards

Always load these standards before creating or modifying artefacts.

> The skills resolve these by **searching the workspace first** and falling back to the
> framework copy, so they keep working when an organisation governs its standards in its own
> tree (for example under `governance/standards/`). See any skill's
> `references/standards-discovery.md`. The fixed paths below apply to the legacy shims only.

- **Visual design standard** - search the workspace for a folder named `visual-design` containing `visual-design-standard.md`. If found, load it. If not found, fall back to `.ai-assisted-architecture/standards/visual-design/visual-design-standard.md`.
- `.ai-assisted-architecture/standards/strategy/standard-strategy.md`
- `.ai-assisted-architecture/standards/platforms/platform-standard.md`
- `.ai-assisted-architecture/standards/capabilities/standard-capability-document.md`
- `.ai-assisted-architecture/standards/capabilities/standard-capability-diagram.md`
- `.ai-assisted-architecture/standards/capabilities/standard-definition-ladder.md`
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

- For business outcomes and use cases, apply `standard-strategy.md` via `/aaa-create-strategy`.
- For business platforms, apply `platform-standard.md` via `/aaa-create-platform`.
- For capability documents, apply `standard-capability-document.md` via `/aaa-create-capability`.
- For capability diagrams (maps and traceability matrices), apply `standard-capability-diagram.md`.
- For how far a capability has been defined, apply `standard-definition-ladder.md`, and derive the rung with `/aaa-rung`.
- For bounded context definitions, apply `standard-bounded-context.md` via `/aaa-create-context`.
- For ABB narrative/content documents, apply `standard-abb-document.md` via `/aaa-create-abb`.
- For SBB narrative/content documents, apply `standard-sbb-document.md` via `/aaa-create-sbb`.
- For runtime services, apply `standard-service.md` via `/aaa-create-service`.
- For runtime agents, apply `agent-specification.md` via `/aaa-create-runtime-agent`.
- For links between all layers, apply `standard-traceability.md`.
- For the YAML frontmatter on every catalog artefact, apply `standard-frontmatter.md` *(v1.1.0)*. Schemas at [`standards/schemas/v1.1.0/`](../standards/schemas/v1.1.0/).

## Enforcement Rules

- Traceability requirements (**Outcome → Use Case → Platform → Capability → Context → ABB → SBB → Service**) must be applied to every new artefact.
- Colour references must use identifiers (e.g., `1.1`) from the visual design standard.
- Cross-references must use folder-relative paths and must not append `/index.md`.

## Discovery Check (Agent Self-Check)

Before finalising any artefact, confirm:

1. All canonical standards above were loaded for the relevant artefact type.
2. The specific Agent Skill (e.g. `skills/aaa-create-strategy/SKILL.md`) was followed in order, with no phase skipped.
3. The **AI Agent Self-Verification Checklist** from the relevant standard was executed.
4. The "Golden Thread" of traceability back to a Strategic Outcome is intact.
