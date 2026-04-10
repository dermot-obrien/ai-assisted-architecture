# CLAUDE.md — AI-Assisted Architecture (Framework Repository)

This file is for AI agents (and humans) working **on** this framework repository. It is auto-loaded by Claude Code when this directory is opened.

> **This is not the consumer CLAUDE.md.** Workspaces that consume this framework as a Git submodule install their own `CLAUDE.md` from `install/CLAUDE.md.txt`. That file documents the slash commands a *consumer* gets. **This** file documents how to work *on* the framework itself.

---

## Read these first (every session)

Before making any change to standards, agents, foundation content, or articles, load the conceptual anchors:

1. **`docs/architectural-framework.md`** — the conceptual model. Defines Platform, Bounded Context, Capability, ABB, SBB, Service, the layer hierarchy, and the rules that govern how they relate. **Every change to this repository must respect these definitions.**
2. **`docs/articles/ai-assisted-architecture-framework/ai-assisted-architecture-framework.md`** — the rationale article. Explains why the framework exists, which design decisions are deliberate (mandatory cross-cutting concerns, Platform replacing Domain, deterministic diagram specs, the Golden Thread), and which trade-offs were chosen. **Read this when you're tempted to "improve" something — it probably explains why it is the way it is.**
3. **`README.md`** — installation, profiles, repository structure. The user-facing entry point.
4. **`agents/FRAMEWORK_AGENTS.md`** — discovery and precedence rules for the agent skills, plus the canonical standards list every agent must load.

---

## Conceptual model (quick reference)

These are the framework's first-class concepts. **Use them precisely. Do not invent new terms or substitute informal language for them.**

| Concept | Code | Definition | Lives in |
|---|---|---|---|
| **Outcome** | (no code) | A measurable strategic result. *Why?* | `foundation/strategy/outcomes/` |
| **Use Case** | (no code) | Operational context for a technology need. *How is it used?* | `foundation/strategy/use-cases/` |
| **Platform** | `PL-NNN` | A team-owned, boundary-defined, self-service unit of capability. The unifying organisational concept (replaces "Domain"). | `foundation/platforms/` |
| **Bounded Context** | `BC-NNN` | A linguistic and structural boundary where a domain model is valid. Belongs to exactly one Platform. | `foundation/contexts/` |
| **Capability** | `CAP-NNN` | An enduring business ability. Provided by a Platform. | `foundation/capabilities/` |
| **Architecture Building Block** | `AB-NNN` | A logical, technology-agnostic component. **Lives inside a Bounded Context.** | `foundation/building-blocks/architecture-building-blocks/` |
| **Solution Building Block** | `SB-NNN` | A concrete product realising an ABB. | `foundation/building-blocks/solution-building-blocks/` |
| **Service** | (named) | The runtime/deployable unit that realises an SBB. | (workspace-only — not seeded) |

**Cross-cutting platforms** (Identity, Observability, Governance) are consumed by other platforms via standardised interfaces (Enforcement Adapter pattern). Every ABB must address IAM, Observability, and Governance explicitly — these are not optional sections.

**The Golden Thread** is the traceability rule: every artefact links to the layers above and below it.

```
Outcome → Use Case → Platform → Bounded Context
        → Capability → ABB → SBB → Service
```

Agents check for this chain; gaps are errors, not warnings.

---

## Repository layout

| Directory | What it contains | Audience |
|---|---|---|
| `docs/` | Framework documentation (`architectural-framework.md`) and articles (`articles/`). The conceptual and rhetorical anchors. | Everyone |
| `standards/` | **The canonical templates and standards for every artefact type.** Source of truth for document structure, diagram layout, traceability rules, and visual design. | Agents and humans creating artefacts |
| `agents/` | Agent skill specifications (the "pre-bagged prompts"). One file per artefact type plus the discovery/precedence rules in `FRAMEWORK_AGENTS.md`. | AI agents |
| `foundation/` | Seed content that workspaces install via `seed-foundation.ps1`. Organised by profile (`core`, `integration`, `infrastructure`). Contains pre-built Platforms, BCs, Capabilities, ABBs, SBBs, and Outcomes/Use Cases. | Workspaces (via seed) |
| `install/` | IDE configuration snippets for the consumer side. Templates for `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursorrules`, etc., plus per-tool command/prompt files. **For consumers of the framework, not for the framework itself.** | Workspaces (manually copied) |
| `scripts/` | Automation scripts: `seed-foundation.ps1` (workspace seeding), `create-building-block-slide.py` (PowerPoint), `generate_sbb_diagrams.py` (diagram automation). | Workspaces and contributors |
| `Plans/` | Local planning notes. Not committed. | Local working only |

---

## Standards (`standards/`) — the source of truth

One canonical standard per artefact type. Agents load the relevant standard before creating or modifying any artefact.

| Layer | Standard files |
|---|---|
| Strategy (Outcomes / Use Cases) | `standards/strategy/standard-strategy.md` |
| Platform | `standards/platforms/platform-standard.md`, `platform-diagram-standard.md` |
| Capability | `standards/capabilities/standard-capability-document.md`, `standard-capability-diagram.md` |
| Bounded Context | `standards/contexts/standard-bounded-context.md` |
| ABB | `standards/building-blocks/architecture-building-blocks/standard-abb-document.md`, `standard-abb-diagram.md` (+ `example/`) |
| SBB | `standards/building-blocks/solution-building-blocks/standard-sbb-document.md`, `standard-sbb-diagram.md` (+ `example/`) |
| Service | `standards/runtime/standard-service.md` |
| Traceability (cross-layer) | `standards/standard-traceability.md` |
| Visual design (overridable) | `standards/visual-design/visual-design-standard.md` |

The visual design standard is the **only** one consumers are expected to override (with their own colour tokens, typography, accessibility rules). All other standards are authoritative and not customised per workspace.

---

## Agent skills (`agents/`) — the pre-bagged prompts

Seven agent skills, one per artefact type. Each is invoked via slash command in Claude Code (`/create-…`) or `@command` in Cursor. Every skill follows a four-phase workflow: **Discovery → Load Standards → Create Artefacts → Self-Verification**.

| Skill file | Command | Creates |
|---|---|---|
| `agents/create-strategy.md` | `/create-strategy` | Business Outcomes and Use Cases |
| `agents/create-platform.md` | `/create-platform` | A Platform with strategic owner, BCs, capabilities, SBB stack, self-service interfaces, SLOs |
| `agents/create-capability.md` | `/create-capability` | A Capability document with maturity assessment and ABB mapping |
| `agents/create-context.md` | `/create-context` | A Bounded Context with ubiquitous language and ABB containment |
| `agents/create-abb.md` | `/create-abb` | An ABB: document, draw.io diagram, summary, PowerPoint slide |
| `agents/create-sbb.md` | `/create-sbb` | An SBB realising an ABB: document, diagram, summary, slide |
| `agents/create-service.md` | `/create-service` | A runtime Service realising an SBB |

Discovery and precedence rules (which standards every agent must load, the enforcement rules, the agent self-check) live in **`agents/FRAMEWORK_AGENTS.md`** — read it before changing any agent file.

The canonical creation order (the Golden Thread, top-down):

1. `/create-strategy` (Outcomes / Use Cases)
2. `/create-platform` (Platform + executive owner)
3. `/create-capability` (business ability)
4. `/create-context` (linguistic boundary)
5. `/create-abb` (logical model)
6. `/create-sbb` (physical realisation)
7. `/create-service` (runtime unit)

---

## Foundation seed content (`foundation/`)

The framework ships a complete platform-as-product baseline:

- **12 Platforms** (`PL-001` Security through `PL-012` Continuous Delivery)
- **44 Capabilities** across L1/L2/L3
- **12 Bounded Contexts**
- **8 ABBs** and **3 SBBs** with full draw.io diagram sets
- **13 strategic Outcomes**

Profiles control what gets seeded into a consumer workspace:

| Profile | Includes |
|---|---|
| `core` | Cross-cutting baseline: IAM, Observability, Governance |
| `integration` | API mediation (`AB-004`) and event-driven integration (`AB-005`) |
| `infrastructure` | Compute runtime (`AB-006`) and storage lifecycle (`AB-007`) |
| `foundation` / `all` | All profiles combined |

Profile manifests live in `foundation/profiles/<name>/profile.yaml`. The seed script reads the manifest and copies the listed artefacts into the workspace.

---

## Install (`install/`) — for consumers, not for the framework

`install/` contains templates and snippets that **workspaces consuming the framework** copy into their own root. Supported tools: Claude Code, Cursor, GitHub Copilot, Gemini, Cline, Windsurf.

| Template | Consumer destination |
|---|---|
| `install/AGENTS.md.txt` | `<workspace>/AGENTS.md` |
| `install/CLAUDE.md.txt` | `<workspace>/CLAUDE.md` (or `.claude/CLAUDE.md`) |
| `install/GEMINI.md.txt` | `<workspace>/GEMINI.md` |
| `install/claude/commands/*.md` | `<workspace>/.claude/commands/` |
| `install/cursor/rules/*.mdc` | `<workspace>/.cursor/rules/` |
| `install/github/prompts/*.prompt.md` | `<workspace>/.github/prompts/` |
| `install/.cursorrules.txt` | `<workspace>/.cursorrules` |
| `install/.clinerules.txt` | `<workspace>/.clinerules` |
| `install/.windsurfrules.txt` | `<workspace>/.windsurfrules` |

See `install/README.md` for the full mapping.

**Critical:** `install/CLAUDE.md.txt` is the *consumer* template. **This** `CLAUDE.md` (at the framework repo root) is the *contributor* file. Do not conflate them. They serve different audiences.

---

## Scripts (`scripts/`)

| Script | Purpose | Prerequisites |
|---|---|---|
| `seed-foundation.ps1` | Seeds workspace `capabilities/` and `building-blocks/` from foundation profiles. | PowerShell |
| `create-building-block-slide.py` | Generates a PowerPoint slide from a building block folder's `components.png` and `summary.png`. | `pip install python-pptx Pillow` |
| `generate_sbb_diagrams.py` | Bulk SBB diagram generation. | Python 3.10+ |

`seed-foundation.ps1` is the canonical seed script. If a port exists in a fork (e.g. `seed-foundation.ts` for Bun/TypeScript), keep behaviour parity — same flags (`--profile`, `--force`, `--dry-run`), same output, same exit semantics, same skip-existing default.

---

## Articles (`docs/articles/`)

The article at `docs/articles/ai-assisted-architecture-framework/ai-assisted-architecture-framework.md` is the rationale piece. It explains:

- Why the framework exists (high-quality inconsistency at scale)
- Why cross-cutting concerns (IAM, Observability, Governance) are mandatory in every ABB
- Why **Platform** replaces **Domain** as the primary organisational unit
- Why diagram specifications are deterministic (Draw.io with exact dimensions, label formats, colour tokens)
- Why TOGAF + DDD + Team Topologies + Platform Engineering are combined
- The Golden Thread of traceability

**Read this before changing the framework's opinions.** Most "improvements" that occur to a contributor are things the article explicitly explains away.

---

## Rules for editing this repository

### Concepts

1. **Use the framework's concepts precisely.** Platform, Bounded Context, Capability, ABB, SBB, Service. Do not substitute informal language. "Integration platform" → "Integration Platform" (capital P, a real `PL-NNN` with strategic owner, BC, ABBs, SBBs). "Team" → "Platform team". "System" → identify whether it's a Platform, an SBB, or a Service.
2. **ABBs live inside Bounded Contexts.** Never enterprise-wide. Each Platform's BC instantiates the logical pattern with its own SBBs. If a change implies a single enterprise-wide ABB, it is wrong — fix it at the BC level instead.
3. **Cross-cutting concerns are mandatory.** Every new or modified ABB must explicitly address IAM, Observability, and Governance in both the document and the diagram. The standards enforce this; do not introduce exceptions.
4. **The Golden Thread is structural, not aspirational.** Every new artefact must trace upward to a Strategic Outcome and downward to its realisation. If the chain breaks, fix the chain — do not create orphan artefacts.
5. **Self-service interfaces are inherent to a Platform, not optional.** A Platform with no consumption surface is not a Platform. New Platform definitions must include self-service interfaces and SLOs.

### Standards (`standards/`)

6. **Standards are the source of truth.** Before editing any artefact format, read the relevant standard. If the standard is wrong, change the standard first, then propagate to examples and foundation content.
7. **Do not create new artefact types.** The framework defines exactly seven (Outcome/Use Case, Platform, BC, Capability, ABB, SBB, Service). New types require a deliberate framework change with rationale, not a workspace-driven extension.
8. **Visual design tokens are referenced by ID.** Colour references in standards and examples use identifiers (e.g. `1.1`, `4.3`) from the visual design standard. Never hardcode hex values in examples.

### Agents (`agents/`)

9. **Agents follow the four-phase workflow.** Discovery → Load Standards → Create Artefacts → Self-Verification. When editing an agent file, all four phases must remain intact.
10. **Agents must load all canonical standards** listed in `agents/FRAMEWORK_AGENTS.md` before creating an artefact, even if the change is small.

### Foundation (`foundation/`)

11. **Foundation is a *seed*, not a *runtime*.** It is copied into consumer workspaces. Changes to foundation flow downstream when consumers re-seed; they do not propagate automatically.
12. **Profile manifests govern what gets seeded.** When adding new foundation content, update the relevant `foundation/profiles/<name>/profile.yaml` so the new content actually ships.

### Install (`install/`)

13. **`install/` is for consumers, not for the framework.** Files in `install/` are templates that consumers copy into their workspace. Do not treat them as live framework configuration.

### Scripts (`scripts/`)

14. **Cross-platform parity.** If a Bun/TypeScript port of `seed-foundation.ps1` exists in a fork, keep behaviour parity — same flags, same output, same exit semantics.
15. **Scripts must be idempotent and skip-existing by default.** A second run with no `--force` must not damage workspace content.

---

## When in doubt

| Question | Where to look |
|---|---|
| About a concept | `docs/architectural-framework.md` |
| About a design decision (why is it like this?) | `docs/articles/ai-assisted-architecture-framework/ai-assisted-architecture-framework.md` |
| About an artefact format | The relevant `standards/.../standard-*.md` |
| About a slash command | `agents/<command>.md` and `agents/FRAMEWORK_AGENTS.md` |
| About what gets seeded | `foundation/profiles/<name>/profile.yaml` |
| About IDE installation | `install/README.md` |

---

## Repository identity

- **Upstream**: `dermot-obrien/ai-assisted-architecture` (canonical)
- **Licence**: Dual — code under AGPL-3.0 / Commercial; documentation under CC BY 4.0
- **Author**: Dermot O'Brien
- **Contribution model**: Fork → branch → PR. See `CONTRIBUTING.md`.
