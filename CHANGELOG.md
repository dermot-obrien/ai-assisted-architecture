# Changelog

All notable changes to AI-Assisted Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Definition ladder.** `standards/capabilities/standard-definition-ladder.md` defines how far a capability has been defined as a rung that can be checked: R0 Unrecognised, R1 Named, R2 Bounded, R3 Decided, R4 Buildable, R5 Proven, R6 In service. It gives what each rung requires and the artefact kinds that evidence it, and the rules: a capability sits on the highest rung with every lower rung evidenced; a rung is claimed per flow and the capability sits at its lowest flow; building ahead does not skip rungs but is latent evidence; a rung is lost when its evidence stops being true. It says how the ladder differs from capability maturity (0 to 5), `lifecycle_state` and `status`. Architecture's reach ends at R4, and R5 and R6 are received from implementation. `definition-ladder.csv` (`rung,name,description`) beside it is the form tools read. Linked from the capability document standard, which gains a Definition Rung section and a section on rung versus maturity, and from the metamodel.
- **`aaa-rung` skill.** Read-only. Derives each capability's rung, per flow, from the capabilities, ABBs, considerations, decision records, SBBs and patterns that exist, and names the specific artefact that blocks the next rung. A table by default, `--json` for planning, `--check` to fail CI when a recorded rung claims more than the evidence. Bound through `[suite.aaa-rung]` with six required directories and no defaults. Python standard library only, with tests over a neutral fixture workspace: `python -m unittest discover skills/aaa-rung/tests`, also run in CI.
- **`consideration` artefact kind (`CN-NNN`).** An open question with more than one credible answer: `question`, `options[]` (`name`, `summary`), `criteria[]`, `consideration_status` (`open`, `resolved`, `withdrawn`), `resolved_by` (`DR-NNN`, required once resolved) and `affects[]` (capabilities, ABBs, SBBs or patterns). New `consideration.schema.json`; the envelope gains the kind, the `CN` prefix in `anyId` and a `considerationId` def. The lifecycle field is `consideration_status` rather than `status`, so it cannot collide with the envelope's `status` enum as the transition schema once did. Documented in the frontmatter standard (§6.16), the metamodel and the traceability standard, and known to `scripts/validate-frontmatter.mjs`.
- **Capability ladder fields.** Optional `flows[]` (`id`, `name`, `description`, `rung` matching `R[0-6]`), the `open_questions: none` marker, and `demand_assumption` for demand recorded as an assumption before an outcome is linked, in `capability.schema.json` and the frontmatter standard (§6.4).
- **`evidence` and `cost-model` reference types** in the envelope's `references[].type`, read by the ladder at R5 and R4 (with the existing `runbook` at R6).
- **Outcome measures as criteria.** Optional `measures[]` on an outcome (`id` as `OC-NNN-M<n>`, `measure`, `target`, `unit`). Planning cites the ids as `advances_criterion_ids`, and a consideration may list them in its `criteria`. The strategy standard (§2.3) sets the numbering rule, and `aaa-create-strategy` creates an id for every measure.
- **Pattern `realises`.** The `pattern` skill (0.6.0) template and method gain optional `realises: [CAP-NNN]`, `flows` and `cost-model` and `evidence` references, so a pattern counts toward the rungs of the capabilities it realises.
- **Named interface endpoints.** The `pattern` skill (0.7.0) writes Provider and Consumer as identifier and name, with `scripts/name-endpoints.py` to bring existing documents up to it and a note from `publish.py` for any that still need it.
- **The planning seam.** `standards/aaw-work-seam.md` maps deliverable types to artefact kinds and so to rungs, names `definition-ladder.csv` as the ladder AAW's quarter planning reads, and describes derived rungs feeding an epic's framing: its starting rung, its first product from the blocker, and the rung reached at close.

### Changed

- **Capability taxonomy settled on the flat registry form.** The capability document standard described `capability-model.md` as nested L1/L2 headings while the foundation seed used one flat registry table. The foundation's form is now the standard: a Canonical Capability Registry with an explicit `Parent ID` column, the hierarchy rules, a Capability-to-ABB Traceability Matrix, and the two derived CSVs with their columns. `aaa-create-capability` adds a registry row rather than a heading and keeps the CSVs in line. A workspace whose `capability-model.md` uses nested headings should flatten it into the registry table.
- **Ontology maturity horizons defined.** Crawl, walk, run and fly were never defined. They are now stated as bands of the definition ladder, as a mapping and not a new scale: crawl is R1–R2, walk is R3–R4, run is R5, fly is R6 (`SPECIFICATION.md` §4.2 and §4.7, and the `maturity` and `maturity_horizon` descriptions in `ontology-schema.json`). The enums are unchanged, so the ontology schema version is not bumped.
- **Schema versioning.** Every schema addition above is optional and made in place in `standards/schemas/v1.1.0/`, which is still unreleased; this follows how `requires`, `provenance` and the composite SBB fields were added. All 97 foundation artefacts still validate.

- **The eight `aaa-create-*` skills take their artefact locations from the repository**
  (breaking). Each declares an `inputs.toml` contract and reads `[suite.<skill-name>]` of the
  repository's `.agents/skill-bindings.toml`, resolved through the model skill's `doctor`, the
  same way `reference-architecture` already worked. They previously wrote to hardcoded paths
  such as `building-blocks/architecture-building-blocks/ABB-NNN/index.md`, which made the
  framework's own layout a condition of using it. There is no default: an unbound skill stops
  and names the key it is waiting for. The README carries a paste-ready block for a repository
  that does use the expected layout, which is where an opinion about layout belongs.
- `aaa-create-runtime-agent` no longer names a fixed validator or profile schema. Both are
  bindings, and both are optional: where one is undeclared the skill reports the record as
  authored but not validated, rather than skipping the step quietly.

### Added

- **`reference-architecture` skill.** Authors a reference architecture as one Markdown document
  that is also the model and also the deck: it generates the draw.io diagram and numbered
  scenario overlays from the document's own tables, validates that diagram and document agree,
  and publishes HTML slides and a PDF. Different in kind from the `create-*` skills, which each
  author one catalogue artefact. It needs `model` and `markdown-deck`, which ship with
  AI-Assisted Work; AAA already depends on AAW for the install engine, so installing both into
  a workspace provides them. Repository specifics — output directory, template, id series,
  ontology schema — come from `.agents/skill-bindings.toml`, so the skill carries none.
- **Agent Skills as the distribution format.** All eight `create-*` agents now ship as standalone [Agent Skills](https://agentskills.io) under `skills/`: a directory holding a `SKILL.md` with `name` and `description` frontmatter plus `references/`. One definition works in every skills-compatible tool. `aaa install` wires them through the shared AAW engine's new `skills` manifest key: each lands in `.agents/skills/<name>/`, read natively by Codex, Cursor, GitHub Copilot, VS Code and Gemini CLI, with `.claude/skills/<name>` linked at it for Claude Code, which reads only its own path. Requires AAW 2.1.0 or later.
- **Workspace-first standards resolution.** Skills resolve the canonical standards by searching the workspace before falling back to the framework copy, instead of the fixed `.ai-assisted-architecture/standards/…` paths the shims hard-code. An organisation that governs its standards in its own tree (for example under `governance/standards/`) now works without patching the skill. Each skill carries the resolution order and its own required-standards table in `references/standards-discovery.md`, and stops rather than proceeding on an assumed contract when a standard cannot be found.
- `/aaa-create-service` now hands off to `/aaa-create-runtime-agent` when the service is an autonomous agent, since that path needs guardrails, capability scope and provenance the service skill does not author.
- `scripts/validate-skills.mjs` — zero-dependency validator for the agentskills.io spec — and a CI workflow that runs it, installs into a scratch workspace and checks the Claude Code links resolve. AAA had no CI before this.

### Changed

- Skills are invoked as `/aaa-create-abb` and so on. The Agent Skills format has no namespacing of its own, so the `aaa-` prefix is what prevents collisions. The legacy shims keep their unprefixed `/create-abb` names.
- `agents/FRAMEWORK_AGENTS.md` and `install/README.md` updated: skills documented as the primary integration, shims marked superseded, and the retired `scripts/seed-foundation.ps1` replaced by `src/seed-foundation.mjs` via `aaa install --seed`.

### Deprecated

- The per-tool shims under `install/claude/`, `install/cursor/` and `install/github/`, and the instruction files under `agents/`, each now carrying a superseded header. They remain installed for setups that have not moved. A shim carries no `description`, so an assistant can only run it when the user types the command, and it points at one large instruction file read whole on every invocation.

### Removed

- **BREAKING: the per-tool `create-*` command shims** under `install/claude/`, `install/cursor/rules/create-*.mdc` and `install/github/prompts/`, and the instruction files under `agents/`. A workspace that still invokes `/create-abb` will find nothing behind it; use `/aaa-create-abb`. `aaa install` sweeps away shims it previously wrote, since they point at files that no longer exist. Requires AAW 3.0.0 or later.
- **BREAKING: the `shims` and `source_token` manifest keys are no longer set.** Both existed only for the shims. A skill is self-contained and holds no path back into the framework, so nothing needs rewriting at install time.
- `agents/create-deck.md`. It was an orphan: wired into no shim and absent from the manifest, the README and the standards index. It was also specific to one workspace's Docusaurus site rather than framework-general, and a separate deck skill now covers the need.

### Moved

- `agents/FRAMEWORK_AGENTS.md` → `standards/standards-index.md`. It is a standards discovery and precedence document, not an agent, and it outlived the `agents/` directory it sat in. Every discovery file under `install/` was repointed.

### BREAKING CHANGES

- **Transition `status` renamed to `transition_status`** (`standards/schemas/v1.1.0/transition.schema.json`). The transition schema composes the universal envelope — which defines `status` with the lifecycle enum `draft | proposed | accepted | active | deprecated | superseded | retired` — and then redefined `status` with a transition-specific enum (`planned | in-progress | completed | abandoned`). Under `allOf` both constraints applied to the same `status` property, so no value satisfied both and every Transition artefact failed validation. The transition-specific lifecycle now lives in a separate `transition_status` field; the envelope `status` still applies. The §6.15 example in `standard-frontmatter.md` was updated to match. **Migration:** rename `status: <planned|in-progress|completed|abandoned>` to `transition_status:` on every Transition artefact (the envelope `status` remains for `draft`/`active`/…).
- **SBB document frontmatter example realigned to `sbb.schema.json`** (`standards/building-blocks/solution-building-blocks/standard-sbb-document.md`). The example predated the v1.1.0 schemas and would not validate against them. Field changes: `primary_abb` + `realises_abbs` → `realises` (single array); `lifecycle_stage` (Plan/Encourage/Sustain/Retire) → `status` (envelope enum); `author` → `last_modified_by`; `version: "0.1"` → `"0.1.0"` (semver requires major.minor.patch); added the remaining required fields `kind`, `created`, `owner`, `products`, `product_mapping`; removed the maturity fields (`current_maturity`/`target_maturity`) and the inline `provenance` block. The corrected example is verified against `sbb.schema.json` with ajv. **Migration:** any SBB authored from the old example must rename these fields before it will validate.
- **Foundation artefacts migrated to full v1.1.0 frontmatter** (`foundation/**/index.md`). The migration script (`scripts/migrate-frontmatter.mjs`) now populates not just the universal envelope (`id`, `kind`, `version`, `status`, `created`, `last_modified`, `owner`, `governance_zone`) but the **per-kind required fields, extracted from each document's body** — ABB `category`/`short_name`/`interfaces`/`part_of`/`realises_capabilities`, SBB `realises`/`products`/`product_mapping`, capability `level`/`parent`/`components`/`maturity`/`provided_by_platform`/`realised_by_abbs`, BC `part_of`/`contains`/`realises_capabilities`/`ubiquitous_language`, platform `strategic_owner`/`provides_capabilities`/`contains_bounded_contexts`, outcome `kpi`/`business_rationale`/`owned_by_platform`, and use-case `primary_actor`/`supports_outcome`/`success_criteria`/`realised_by_abbs`. Relations not present in an artefact's own body are recovered by reverse index (an ABB's parent BC; an Outcome's owning Platform; ABB-004…008's realised capabilities, read from the capabilities that name them as `primary`). All **97 files now validate against their strict per-kind schemas** (verified by the new `scripts/validate-frontmatter.mjs`). Tooling that parsed these files expecting only the old Docusaurus keys (`title`, `sidebar_*`) now sees the full per-kind frontmatter. **Migration:** run `node scripts/migrate-frontmatter.mjs` (idempotent — existing keys are never overwritten) then `node scripts/validate-frontmatter.mjs`.
- **Three strict-schema constraints relaxed so realisation/containment completeness is a gap, not a validation error** (`standards/schemas/v1.1.0/`). These are corrections within the unreleased v1.1.0 schema set — they only *relax* constraints, so every artefact valid before remains valid:
  - `capability.schema.json` — `provided_by_platform` is now required only for **L3** capabilities (L1/L2 are cross-platform groupings); `realised_by_abbs` is no longer required even for L3 (an unrealised L3 capability is a legitimate gap surfaced by gap analysis, not a structural error — the foundation seed ships such placeholders deliberately).
  - `bounded-context.schema.json` — `contains` dropped from required (a placeholder context catalogued before its ABBs exist is a gap, not an error); `ubiquitous_language` minimum lowered from 5 to 3 entries.
  - `outcome.schema.json` — `target_date` dropped from required (catalogued/seed Outcomes are frequently undated; omit rather than fabricate a date).
  - The §6.1/§6.4/§6.5 examples and notes in `standard-frontmatter.md` were updated to match.
- **`lenient-v1.0.0-compat` / `strict-v1.1.0` two-profile mechanism removed from the spec** (`standards/standard-frontmatter.md` §7). The `governance.yaml` `schema_profile` selector described in earlier drafts was never built. The framework now **migrates rather than tolerates**: there is a single strict schema set, and `scripts/migrate-frontmatter.mjs` brings a workspace to it. (A lenient profile can return later if a frontmatter-validator CLI needs a gradual-adoption mode — designed against a real validator rather than ahead of one.)

### Added
- **C4 System Context diagram convention.** Adds the **outside-in** view to the framework, complementing the composite SBB **inside** view so a system can be read at adjacent C4 zoom levels. Comprises:
  - `standards/building-blocks/standard-c4-context-diagram.md` — the convention: rendered as a Mermaid **`flowchart`** (explicitly **not** the experimental, unstyleable `C4Context` type), with a fixed `classDef` palette (person `#08427b`, internal software system `#1168bd`, external system `#999999`, dashed boundary `#444444`), `[Person]` / `[Software System]` / `[External System]` node tags, persons-left / externals-right layout, and verb-phrase edge labels (no protocols at this altitude). Includes when-to-use (top-level ABB / system-level Capability only), the C4↔AAA mapping (boundary = Capability or top-level ABB; internal nodes = ABBs/SBBs/Services; external nodes often = ABB `requires` dependencies; **persons have no AAA artefact**), the explicit *Relationship to composite SBBs (zoom-in)* pairing (C4 Context = Level 1 outside; composite SBB = Level 2/3 inside), and a self-verification checklist.
  - `standards/building-blocks/solution-building-blocks/example-composite/c4-context.md` — a worked example: the **Patternode trading platform** context view (`kind: view`, `view_of: ABB-009`), with **Trader** + **AI Agents** as actors; **Strategy Engine**, **Order & Portfolio Service**, **Trading Dashboard**, **Reconciliation**, and **Watchdog** as internal systems inside the platform boundary; and **Alpaca**, **EODHD**, **GCP**, **Firebase**, **Slack**, **GitHub** as external systems. Authored as the **zoom-out companion** to the existing `SBB-301 Strategy Engine` composite (`index.md`), with the external systems reconciled against the composite's `required` boundary ports.
  - `standards/building-blocks/architecture-building-blocks/standard-abb-document.md` — a new **§2.1.1 C4 System Context (top-level ABBs)** section (external surface vs the §2.1 internal structure), cross-linked to the composite SBB as the zoom-out/zoom-in pair.
  - `standards/building-blocks/solution-building-blocks/standard-sbb-diagram.md` — a *Zoom relationship to C4 System Context* note framing the composite diagram as the Level 2/3 inside view and reconciling context external systems with `required` boundary ports.
  - `agents/create-abb.md` — a new **Step 2b** (top-level ABBs only): author a C4 System Context diagram in `index.md` (§2.1.1), document the AAA mapping, and cross-link to the realising composite SBB as the zoom-in companion.
  - `agents/create-sbb.md` — composite-SBB authoring now offers to create/refresh the parent system's C4 Context diagram (a `c4-context.md` beside `index.md`) and reconcile its `[External System]` nodes with the composite's `required` ports.
- **ABB capability dependencies (`requires`).** Architecture Building Blocks can now declare capability-level dependencies on other ABBs — *which* logical building blocks must be present for this one to function — distinct from internal composition and from the concrete part/connector wiring of a composite SBB. Comprises:
  - `standards/schemas/v1.1.0/abb.schema.json` — a new optional `requires` array; each entry has `abb` (required, `ABB-NNN`), `cardinality` (`1` | `0..1` | `1..n` | `0..n`, default `1`), and `rationale`.
  - `standards/standard-frontmatter.md` §6.6 — the `requires` field reference (field table, when-to-use, and how it differs from `mandatory_subabbs` and composite-SBB parts), plus an example in the ABB frontmatter block.
  - `standards/building-blocks/architecture-building-blocks/standard-abb-document.md` — a new **§3.4 Capability dependencies (`requires`)** section: when to declare a dependency, `requires` (abstract logical dependency) vs composite-SBB parts (concrete wiring), how `requires` feeds gap analysis (a required ABB absent from the catalogue is a gap; a missing `cardinality: "1"` dependency is a *hard* gap), plus a new self-verification item.
  - `agents/create-abb.md` — a discovery step that asks which other ABBs the ABB depends on (with cardinality and rationale, excluding the cross-cutting trio), and authoring instructions to populate `requires` and render §3.4.
  - `standards/building-blocks/architecture-building-blocks/example-requires/` — a worked example: `ABB-010 AI Agent Platform` requiring four sub-ABBs (`ABB-011` Reasoning Engine `1`, `ABB-012` Tool Integration `1..n`, `ABB-013` Agent Memory `0..1`, `ABB-014` Safety & Guardrails `1`), each created as a minimal ABB. All five validate against the updated schema.
- **Composite Solution Building Blocks (UML composite structure).** SBBs can now be modelled as assemblies of sub-SBBs using the UML 2 composite-structure grammar — **parts** (typed roles played by sub-SBBs), **ports** (provided/required interaction points on the boundary), and **connectors** (`delegation` boundary↔part, `assembly` part↔part). Comprises:
  - `standards/schemas/v1.1.0/sbb.schema.json` — new optional `composite`, `ports`, `parts`, `connectors` fields with a conditional that requires `parts` (≥1) and `connectors` (≥1) when `composite: true`. Endpoint-reference resolution is delegated to the validator script (documented in the schema and frontmatter standard).
  - `standards/standard-frontmatter.md` §6.7.1 — full field reference, required/optional rules, and six validation rules for composite SBBs.
  - `standards/building-blocks/solution-building-blocks/standard-sbb-document.md` — a *Composite SBBs* section with the UML→SBB mapping, a *When to use composite vs simple SBBs* decision guide, the §2.10 Composite Structure document section, and two new self-verification items.
  - `standards/building-blocks/solution-building-blocks/standard-sbb-diagram.md` — a *Composite Structure Diagrams (Mermaid)* section: the UML→Mermaid mapping, Mermaid's limitations with mandated workarounds (no native ball-and-socket / ports-on-border / stereotypes), node/edge naming conventions kept in lock-step with frontmatter, port and connector styling (`classDef`), and three worked examples (minimal, realistic, nested composite-of-composites).
  - `agents/create-sbb.md` — a simple-or-composite decision step and composite authoring instructions (frontmatter fields, §2.10, Mermaid diagram, bidirectional `contains`/`part_of` traceability).
  - `standards/building-blocks/solution-building-blocks/example-composite/index.md` — a complete worked example (`SBB-301 Strategy Engine`) assembling bar-building, signal-generation, and order-routing sub-SBBs behind a two-port boundary, with a rendered Mermaid composite diagram. Validates against the updated schema.
- **Agent-Native Architecture standards** (`standards/agent-native/`): a domain-agnostic operating model for when the majority of engineers and architects are AI agents. Builds on the existing layers (strategy, platforms, capabilities, contexts, building-blocks, runtime, ontology) rather than replacing them. Comprises:
  - `agent-types.md` — the two agent segmentations: **builder agents** (architecture + engineering, governed at build-time) and **runtime agents** (deployed services doing functional work, governed at run-time). Builders build runtime agents; the same nine principles apply on two enforcement planes. Defines the symmetry (work / guardrails / verification / provenance / capability-scope / escalation / reconciliation × build-time vs run-time), the separation that bounds blast radius (a runtime agent cannot change its own guardrails; a builder holds no runtime action credentials), the lifecycle, and how a runtime agent is represented in the ontology (a `Component` + `platform_guardrail` Standards, no new entity).
  - `create-runtime-agent.md` agent skill (`agents/`) — a builder skill that authors a runtime agent as a catalogued service with its contracts, run-time guardrails (tiered), capability scope, and output provenance.
  - `agent-specification.md` — the vendor-neutral **agent component set** (model, instructions, tools, skills, memory, knowledge, capabilities, guardrails, identity/auth, evaluation, provenance, discovery), each mapped to a verified contemporary standard: **MCP** (Tool sub-schema, spec rev 2025-11-25), **A2A** (AgentSkill + Agent Card discovery), **OASF/AGNTCY** (composable Modules), **Anthropic Agent Skills** (`SKILL.md`), **OpenAI Agents SDK** (corroborating field set), and the **OWASP Top-10 for Agentic Applications 2026** (ASI01–ASI10) threat mapping. Establishes the builder-spec ↔ runtime-card = ABB ↔ SBB refinement, so a catalogued agent is also interoperable. An agent remains a `Component` + `platform_guardrail` Standards (no new entity).
  - `schemas/v1.1.0/agent-profile.schema.json` — the machine-validatable agent profile (`agent_kind: builder|runtime`), composing the MCP Tool, A2A AgentSkill, Anthropic packaged-skill, OASF Module, and guardrail-reference sub-schemas. Validated as Draft 2020-12.
  - `principles.md` — the nine commitments (spec-is-truth, verify-don't-review, blast-radius-first, provenance-on-everything, machine-checkable, standardize-hard, human-budget-for-the-irreversible, context-window sizing, continuous reconciliation), each with its failure mode and enforcing mechanism.
  - `operating-model.md` — the author → adversarial-verify → reconcile loop, guardrail reversibility tiers (T0–T3) layered on the ontology's `platform_guardrail` Standard, capability-scoped agent roles, and mechanical human-escalation keyed to reversibility. Seams to the AAW work seam (a T0/T1 change is a Decision Record).
  - `provenance.md` — the AI-authorship envelope (origin / authored-by / review-state / verified-by), generalising AAR's provenance instinct to every artefact and change.
  - `executable-contracts.md` — refining `api` / `Interface` artefacts into runnable OpenAPI + event schemas + property-based invariants, verified by consumer-driven contract tests bound to the running code.
  - `reconciliation.md` — four standing drift loops (catalog↔deployed, contract↔implementation, graph↔code, docs↔behaviour) extending the static `validate`/`consolidate` gate into runtime drift control; drift becomes a provenance-stamped work item.
- **Provenance envelope** (`standards/schemas/v1.1.0/envelope.schema.json`): an optional, backward-compatible `provenance` block (`$defs/provenance` + property) added to the universal artefact envelope, recording AI-authorship and adversarial-verification lineage. Required fields when present: `origin`, `review_state`.
- **AAW work seam** (`standards/aaw-work-seam.md`): defines the contract between AAA and the AI-Assisted Work work-classification standard. A `decision` deliverable (from any work, or a validated AAR inquiry) → an AAA Decision Record (`DR-NNN`); a cross-cutting AAW `intervention` → a Capability / ABB / SBB revision via the `create-*` agents. Aligns the vocabularies so one classification flows across the frameworks without drift.

- **Unified installer integration.** A `framework.manifest.yaml` and a zero-dependency `bin/aaa.js` launcher install AAA through the shared AI-Assisted Work (AAW) engine — `aaa install` (add `--seed` to scaffold the foundation), wiring `create-*` command shims for Claude/Cursor/Copilot/Gemini. The Windows-only `scripts/seed-foundation.ps1` was ported to a cross-platform Node seeder (`src/seed-foundation.mjs`). AAA is now consumable as an npm git-dependency (no registry) that auto-pulls AAW.
- **Frontmatter Standard** (`standards/standard-frontmatter.md`) — universal envelope, per-kind extensions for all 15 artefact kinds, relationship vocabulary with inverse-consistency rules, status lifecycle, and lifecycle-state semantics for baseline/in-flight/target/retired coexistent versions.
- **JSON Schemas** (`standards/schemas/v1.1.0/`) — JSON Schema 2020-12 validators per kind: `envelope.schema.json` plus per-kind schemas for outcome, use-case, platform, capability, bounded-context, abb, sbb, service, decision-record, snapshot, transition. Placeholder schemas under `_placeholders/` reserve `view`, `event`, `deployment-node`, `api`.
- **Frontmatter migration + validation tooling** (`scripts/`) — `migrate-frontmatter.mjs` walks a workspace's `index.md` files and brings their frontmatter to v1.1.0, extracting per-kind fields from the Document Control table and prose sections (idempotent; reports every field added and any heuristic/defaulted value). `validate-frontmatter.mjs` validates each artefact's frontmatter against its per-kind schema with ajv (envelope composed via `$ref`), printing per-file errors and a pass/fail summary.
- **Decision Record artefact type** (`DR-NNN`) — first-class metamodel element for architectural decisions. MADR body + Y-statement frontmatter + `change_type` and `affects_artefacts` relations. Schema in v1.1.0 set; full body-section standard forthcoming.
- **Snapshot artefact type** (`SN-NNN`) — named architecture state at a point in time. Manifest of `id@version` pairs. Used for baseline / target / transition architectures.
- **Transition artefact type** (`TR-NNN`) — multi-step migration between two Snapshots, sequenced by Decision Records.
- Universal `lifecycle_state` field on every artefact (`baseline | in-flight | target | retired`).

### Changed

- **Unified ABB/SBB ID convention on `ABB-NNN` / `SBB-NNN`.** The v1.1.0 schemas previously used the short `AB-NNN` / `SB-NNN` forms while the foundation seed and the v1.0 document standards already used `ABB-NNN` / `SBB-NNN`. The longer forms are now canonical everywhere, so the schemas accept the foundation IDs. Updated `envelope.schema.json` (`abbId`/`sbbId` patterns + the `anyId` alternation), `abb.schema.json` and `sbb.schema.json` (`id` patterns), the Frontmatter / ABB / SBB document and diagram standards, the `create-abb` agent, and the `example-requires` and `example-composite` worked examples (`ABB-010…ABB-014`, `SBB-301`/`SBB-310…312`). No released artefact used the short form (v1.1.0 is unreleased).
- **Relicensed for wide adoption.** Replaced the AGPL-3.0 + Commercial dual licence with a permissive split: **CC BY 4.0** for content (documentation, standards, agent specifications, foundation seeds, diagrams) and **Apache-2.0** for executable code (`scripts/*`, `src/*`, `bin/*`). Commercial use is now explicitly permitted under both licences; attribution is required.
- Adopted [REUSE Specification 3.3](https://reuse.software/spec-3.3/) with `REUSE.toml` and `SPDX-License-Identifier` headers for per-file licensing metadata.
- Added a trademark notice for the "AI-Assisted Architecture" name; CC BY 4.0 and Apache-2.0 do not grant trademark rights.
- `agents/FRAMEWORK_AGENTS.md` references the new Frontmatter Standard in canonical-standards list and scope-routing section.

### Removed
- **PowerPoint generation removed entirely.** Deleted the `scripts/create-building-block-slide.py` slide generator, every `components-and-summary.pptx` artefact (foundation ABBs/SBBs and the ABB/SBB worked examples), and the `python-pptx` / `Pillow` dependency. ABBs and SBBs now ship their `components.drawio`/`.png` and `summary.drawio`/`.png` only; assembling those into a slide is left to the consumer's own tooling. The `create-abb`/`create-sbb` agents (and their install shims) no longer have a PPTX step, and the building-block file-set standards no longer list a `.pptx`. **Migration:** delete any `components-and-summary.pptx` files in your workspace; they are no longer part of the building-block deliverable set.
- `LICENSE-AGPL-3.0.txt` and `LICENSE-COMMERCIAL.txt` (superseded by `LICENSES/CC-BY-4.0.txt` and `LICENSES/Apache-2.0.txt`).

### Notes

- v1.1.0 is design-spec stage and unreleased; the **BREAKING CHANGES** above are corrections within the in-development v1.1.0 schema set, not breaks against any shipped release. There is a single strict schema set — v1.0.0 artefacts are brought up to it with `scripts/migrate-frontmatter.mjs` (a one-way migration), not tolerated by a relaxed validator profile.
- Decision Record / Snapshot / Transition agent skills (`agents/create-decision.md`, `create-snapshot.md`, `create-transition.md`) are forthcoming.
- Frontmatter validation now ships as `scripts/validate-frontmatter.mjs`; a CI hook recipe wiring it into `npm run validate` is forthcoming.

## [1.0.0] - 2026-03-08

### Added
- TOGAF-aligned ABB and SBB document and diagram standards.
- Visual design standard with colour tokens, typography, and accessibility rules.
- Traceability standard ("Golden Thread") linking Outcomes to Services.
- Strategy standard for Business Outcomes and Use Cases.
- Platform standard with platform-as-product model (Team Topologies, CNCF, Gartner).
- Platform diagram standard for landscape visualisation.
- Capability document and diagram standards with maturity model.
- Bounded Context standard with ubiquitous language and platform containment.
- Runtime Service standard.
- Repository structured as an installable Git submodule (`.ai-assisted-architecture/`).
- Agent specifications for 7 creation skills: strategy, platform, capability, context, ABB, SBB, service.
- `agents/FRAMEWORK_AGENTS.md` for agent discovery and precedence rules.
- IDE integration wrappers for Claude Code, Cursor, GitHub Copilot, Gemini, Cline, and Windsurf.
- Foundation seed with 12 platforms (PL-001 through PL-012).
- Foundation seed with 44 capabilities across L1/L2/L3 hierarchy.
- Foundation seed with 12 bounded contexts (BC-001 through BC-012).
- Foundation seed with 8 ABBs (ABB-001 through ABB-008) and 3 SBBs (SBB-001 through SBB-003).
- Foundation seed with 13 strategic outcomes (OC-001 through OC-013).
- Platform landscape diagram (Draw.io + PNG).
- Capability map and capability-to-ABB traceability diagrams.
- PowerPoint generation script for building block summary slides.
- Foundation seeding script (`seed-foundation.ps1`) with profile support.
- 300 DPI PNG export standard for all diagrams.

---

[Unreleased]: https://github.com/dermot-obrien/ai-assisted-architecture/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dermot-obrien/ai-assisted-architecture/releases/tag/v1.0.0
