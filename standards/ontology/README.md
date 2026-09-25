# Modernisation Ontology — README

Version 1.0.0

> Part of the [ai-assisted-architecture](https://github.com/dermot-obrien/ai-assisted-architecture) framework.

## What this is

A platform-centric enterprise architecture ontology, expressed as JSON Schema, designed to serve three audiences:

- **Board and executive reporting** — progress against committed milestones, implications of deviations, commitment integrity over time.
- **Regulator reporting** — risk-aware architectural evolution, control implementation, standards conformance.
- **Ongoing architecture practice** — enterprise and solution architects modelling current state and proposed change in the same vocabulary.

The ontology has 23 entities organised in four layers (reporting backbone, architecture practice, risk and control, views and stakeholders) plus an ExternalReference helper used wherever the ontology references rather than owns. It is standards-aligned to ArchiMate and TOGAF (views) and ISO/IEC/IEEE 42010 (architecture description). Capabilities optionally anchor to whichever industry reference taxonomy applies (eTOM for telecom, ACORD for insurance, NRF ARTS for retail, HL7/FHIR for healthcare, etc.) — modelled uniformly via the `IndustryReferenceDomain` entity.

This README explains how to use the ontology. For the design rationale and the formal specification, see SPECIFICATION.md.

## How to read this document

If you are a **human architect or analyst**, read top to bottom. The "Concepts" and "How to use this for X" sections will orient you.

If you are an **AI agent or automation**, the key sections are: "Conventions for AI agents", "Ambiguities and how to resolve them", and "Validation rules to apply". Read the schema as the source of truth; this README is interpretive.

## The core idea in one paragraph

Platforms are durable, governed architectural units. They provide capabilities to consumers; capabilities are realised by components, connected by interfaces. Changes are typed alterations to capabilities, components, or interfaces — each with structured narrative explaining what, why, and what completion looks like. Milestones are committed future states of a platform, defined by criteria that demand specific changes. Transitions are bounded moves between milestones. Initiatives are funded work that implements transitions and delivers changes. Slips are declared deviations on initiatives; Decisions are recorded choices (including board re-baselines that update Commitments). Drivers motivate change; Risks and Controls reason about uncertainty; Standards and Patterns prescribe how to build; Stakeholders consume Views constructed from Viewpoints. Every governance question — *what did we commit to? what did we deliver? what changed since last time? what could go wrong? what are we doing about it?* — is answerable by a query against this model.

## Concepts at a glance

### Reporting backbone (13 entities)

| Entity | Purpose | Owns / References |
|---|---|---|
| Platform | Durable architectural unit with named owner | References LeanIX |
| Capability | What a platform provides | References LeanIX, optionally an industry reference taxonomy |
| Component | Implementation realising capabilities | References LeanIX + ServiceNow |
| Change | Typed alteration with structured narrative | Owned |
| Driver | Motivation for change | References strategy / compliance / risk systems |
| Theme | Enterprise modernisation theme grouping Drivers across platforms | Owned |
| Milestone | Committed architectural state (baseline / interim / target) | Owned |
| Criterion | What must be true for milestone arrival | Owned |
| Commitment | Board-endorsed milestone baseline (versioned) | Owned |
| Transition | Bounded move between milestones | Owned |
| Initiative | Funded work implementing a transition | References LeanIX Project |
| Slip | Declared deviation on an initiative | Owned |
| Decision | Recorded choice (architecture / rebaseline / waiver / etc.) | Owned |

### Architecture practice (4 entities)

| Entity | Purpose |
|---|---|
| Interface | Connection between components, with contract and properties |
| Pattern | Reusable architectural prescription (advisory) |
| Standard | Binding architectural prescription (includes platform guardrails) |
| QualityAttribute | Non-functional property of a component or interface |

### Risk and control (2 entities)

| Entity | Purpose |
|---|---|
| Risk | Possibility of an adverse outcome |
| Control | Mechanism that reduces a Risk's likelihood or impact |

### Views and stakeholders (3 entities)

| Entity | Purpose |
|---|---|
| Stakeholder | Role consuming architectural information |
| Viewpoint | Reusable template for constructing a kind of view |
| View | Instance of a Viewpoint addressing specific Stakeholders |

### Referenced taxonomy (1 entity)

| Entity | Purpose |
|---|---|
| IndustryReferenceDomain | Optional anchor to an industry reference taxonomy (BIAN, eTOM, ACORD, NRF ARTS, HL7/FHIR, etc.) referenced by capabilities |

## TOGAF Building Blocks — ABB and SBB

The ontology aligns with TOGAF's distinction between Architecture Building Blocks (ABBs) and Solution Building Blocks (SBBs). Per the TOGAF Standard, a building block is *"a package of functionality defined to meet the business needs across an organization"*, and the ABB/SBB distinction is **technology-agnostic vs technology-specific** — not abstract-versus-concrete or capability-versus-component.

- **Architecture Building Blocks (ABBs)** are *technology-agnostic logical components*. They describe *what* functionality is required without committing to specific products, vendors, or protocols. They relate to the Architecture Continuum and are produced in TOGAF ADM Phases B, C, and D. Examples: "authentication service", "customer database", "event broker".

- **Solution Building Blocks (SBBs)** are *technology-specific implementations*. They are aware of products and vendors and may be procured or custom-developed. They relate to the Solutions Continuum and are produced in TOGAF ADM Phase E. Examples: "Okta SSO Gateway on AWS", "PostgreSQL 16 customer DB on AWS RDS", "Confluent Kafka cluster".

The same logical thing exists at both levels: an ABB Component "Authentication Service (logical)" is refined into one or more SBB Components like "Okta-based SSO Gateway" — the SBB realises the ABB. This refinement is the canonical TOGAF Phase B→E flow.

### What is and is not a building block

In TOGAF's terms, building blocks (ABB or SBB) are *logical components* — things with type matching the content metamodel (actor, business service, application, data entity, etc.). In our ontology:

| Ontology entity | Is it a TOGAF building block? | Notes |
|---|---|---|
| **Component** | Yes — can be ABB or SBB via `building_block_type` | The primary building-block entity. ABB Component = logical; SBB Component = technology-specific |
| **Interface** | Yes — can be ABB or SBB via `building_block_type` | TOGAF explicitly lists interfaces as part of ABB content |
| **Capability** | No | Capabilities are Phase B concepts describing what the enterprise needs to do; ABBs *realise* capabilities |
| **Pattern** | No | Patterns are reference architectures from the Architecture Continuum; they *inform* ABB design |
| **Standard** | No | Standards are prescriptive specifications that ABBs *conform to*; TOGAF lists conformance to standards as an ABB characteristic |
| **Platform** | No | A platform is an enterprise governance unit composed *of* building blocks |
| All governance entities (Milestone, Criterion, Slip, Decision, etc.) | No | These operate on building blocks but are not themselves building blocks |

### The ABB→SBB refinement workflow

The standard TOGAF workflow that the ontology supports:

1. In Phase B/C, solution architects identify the **Capabilities** the architecture must provide.
2. They define **ABB Components** (and ABB Interfaces) that realise those capabilities — technology-agnostic logical descriptions of *what* is needed.
3. The ABBs conform to applicable **Standards** and are informed by relevant **Patterns**.
4. In Phase E, the ABBs are refined into **SBB Components** (and SBB Interfaces) — technology-specific implementations identifying products and vendors. The `realises_abb_ids` field on the SBB Component records the ABB it refines.
5. The SBBs are delivered by **Initiatives** via **Changes**, attached to the **Criteria** of **Milestones**.

This workflow is captured in the relationship `Component (SBB).realises_abb_ids → Component (ABB)`, which is the canonical ABB-to-SBB refinement edge.

### When the building_block_type is unknown

Both `Component.building_block_type` and `Interface.building_block_type` are optional. When omitted, the entity is treated as untyped at the building-block level — acceptable for legacy data or when the distinction has not yet been made. For new authoring, the convention is:

- If you're describing logical functionality without committing to a vendor, set `building_block_type = abb`.
- If you're describing a specific product, vendor, or running endpoint, set `building_block_type = sbb`.
- If unsure, leave it unset and revisit when the technology choice is made.

## How to use this for Board and executive reporting

Board reporting draws primarily from the reporting backbone. A typical Board pack assembles:

1. **Portfolio milestone timeline** — query all Milestones across all Platforms with their planned, forecast, and actual dates. Render as a heatmap with status colours.
2. **Criteria satisfaction summary** — for milestones that have arrived in the period, list Criteria with their satisfaction status.
3. **Transition health** — query all active Transitions with their health attribute.
4. **Material slips** — query Slips where is_material = true, with their cause and affected Milestones.
5. **Re-baseline decisions** — query Decisions where decision_type = rebaseline, with rationale and the Commitments they update.
6. **Commitment register diff** — compare Commitment versions, showing what changed since the prior Board cycle.

Each of these can be a View built on the "Portfolio Status" Viewpoint, scoped to the relevant Platforms.

## How to use this for regulator reporting

Regulator reporting extends the Board pack with risk-aware reporting:

1. **Risk-extended slips** — for each Slip, traverse to affected Components and their Risks. Report which risks are extended by the slip.
2. **Control implementation status** — query Controls and their implementing Components.
3. **Standards conformance** — query Components and Interfaces against their applicable Standards (especially those with standard_type = platform_guardrail).
4. **Driver coverage** — for each regulatory Driver, identify affected platforms and whether each has a committed Change responding to it.
5. **Commitment integrity over time** — analyse Commitment versions to identify re-baselining patterns.

Build these as Views on the "Regulatory Status" Viewpoint.

## How to use this for ongoing architecture practice

Solution architects working on an initiative populate Changes (with structured narrative), introduce or modify Components and Interfaces, and record Decisions (decision_type = architecture). These design choices are captured in the same model that governance reports against — there is no separate design tool.

The typical solution-architect workflow within an initiative follows the TOGAF ADM Phase B→E flow:

1. Identify the **Capabilities** in scope for the initiative.
2. Author or refine the **ABB Components** (and **ABB Interfaces**) that realise those capabilities — technology-agnostic logical descriptions of what is needed. Set `building_block_type = abb`. Reference the applicable **Standards** the ABBs must conform to and the **Patterns** that inform their design.
3. Refine the ABBs into **SBB Components** (and **SBB Interfaces**) — technology-specific implementations identifying products and vendors. Set `building_block_type = sbb` and populate `realises_abb_ids` to link the SBB to its ABB.
4. Capture the **Changes** that move the architecture from current state to the new state, with structured narrative explaining what, why, outcome, and target effect. A typical initiative produces a mix of ABB-level Changes (introducing or modifying logical components) and SBB-level Changes (introducing specific products).
5. Record any **architecture Decisions** made during the work — design choices, trade-offs, deviations from patterns or standards (with waiver Decisions where applicable).
6. The Changes attach to **Criteria** on the relevant Milestones, completing the link from work back to commitment.

Enterprise architects govern the durable layer: the Capability taxonomy (optionally anchored to an industry reference taxonomy where one applies — BIAN, eTOM, ACORD, etc.), the Pattern library, the Standard library, and the catalogue of ABB Components that define logical reference architecture independent of any specific product. They produce Views for various Stakeholders. The View / Viewpoint / Stakeholder triad gives a structured place for architectural representations that would otherwise live in PowerPoint folders.

The ABB / SBB separation drives review cadence: ABB design changes (a new logical component, a deprecated pattern, a re-anchored standard) are infrequent and reviewed at architecture-board level. SBB changes (product selection, vendor changes, endpoint introductions) flow with every initiative and are reviewed at delivery gates. Both cadences draw from the same model.

## Conventions for AI agents

These conventions are designed to keep automated processing deterministic. Where the schema permits ambiguity, the conventions below resolve it.

### Always read the schema first

The JSON Schema (`modernisation-ontology-schema.json`) is the authoritative source. This README is interpretive. If the README and the schema disagree, the schema wins.

### Polymorphic targets — discriminator pattern

Several entities reference polymorphic targets:

- `Change.target_type` + `Change.target_id` references a Capability, Component, or Interface.
- `QualityAttribute.applies_to_entity_type` + `applies_to_entity_id` references a Component or Interface.
- `Decision.affects_entity_refs[]` carries `entity_type` + `entity_id` per reference.

When traversing, always use the type discriminator to select the right entity collection. Never assume the reference is to a specific type without checking.

### External references — normalisation pattern

`ExternalReference` objects carry `system` and `external_id`. When normalising references for query:

1. Use `system` to select the right resolver (LeanIX API, ServiceNow API, etc.).
2. Use `external_id` as the lookup key.
3. Treat `fetched_at` as informational only; do not use it for cache invalidation without checking source-system policy.

The same conceptual entity can have multiple external references (e.g., a Component referencing both LeanIX and ServiceNow). Treat external references as a *set*, not a single value.

### Cardinality enforcement

The schema marks several relationships with mandatory minimums:

- `Component.realises_capability_ids`: minItems 1 (no orphan components)
- `Criterion.demanded_change_ids`: minItems 1 (no abstract criteria)
- `Initiative.delivers_change_ids`: minItems 1 (no work without delivery)
- `Control.mitigates_risk_ids`: minItems 1 (no controls without purpose)
- `View.addresses_stakeholder_ids`: minItems 1 (no views without audience)

When inserting or updating these entities, enforce the minimums before persisting. Validation at write time is more reliable than validation at read time.

### Conditional requirements

Three entities have conditional required fields:

- `Component.data_mastery` is required when `component_type = data`.
- `Decision.slip_id` and `Decision.updates_commitment_id` are required when `decision_type = rebaseline`.
- `Commitment.rationale_for_version` is required when `version > 1` (enforced at application level, not in schema).

When generating these entities programmatically, populate conditional fields before validation.

### Pattern enforcement on IDs

The schema partitions entity types into two buckets for ID naming.

**Per-platform entities** must carry the owning platform code in their ID. The schema enforces a pattern of the form `^<typePrefix>_P\d{3}_[a-z0-9_]+$` on:

- `Capability.id` matches `^cap_P\d{3}_[a-z0-9_]+$` (e.g., `cap_P201_authentication`)
- `Component.id` matches `^(comp|arch)_P\d{3}_[a-z0-9_]+$` (e.g., `comp_P201_sso_gateway`)
- `Interface.id` matches `^iface_P\d{3}_[a-z0-9_]+$`
- `Change.id` matches `^change_P\d{3}_[a-z0-9_]+$`
- `Milestone.id` matches `^m_P\d{3}_[a-z0-9_]+$`
- `Criterion.id` matches `^crit_P\d{3}_[a-z0-9_]+$`
- `Commitment.id` matches `^comm_P\d{3}_[a-z0-9_]+$`
- `Transition.id` matches `^trans_P\d{3}_[a-z0-9_]+$`
- `Initiative.id` matches `^init_P\d{3}_[a-z0-9_]+$`
- `Slip.id` matches `^slip_P\d{3}_[a-z0-9_]+$`
- `QualityAttribute.id` matches `^qa_P\d{3}_[a-z0-9_]+$`

The Pxxx fragment should equal the entity's `platform_id` (or, for entities without a direct `platform_id`, the platform of whatever entity they relate to). Cross-file consistency is what makes IDs globally unique once documents are aggregated.

**Cross-platform entities** are typically enterprise-wide, but may also be platform-specific when the conceptual entity (e.g., an enterprise-strategy driver, a Board stakeholder view) is authored differently per platform. The id patterns accept an optional `_P###_` fragment in that case:

- `Platform.id` matches `^P\d{3}$` (the platform is the namespace)
- `Driver.id` matches `^driver_(P\d{3}_)?[a-z0-9_]+$`
- `Risk.id` matches `^risk_(P\d{3}_)?[a-z0-9_]+$`
- `Control.id` matches `^control_(P\d{3}_)?[a-z0-9_]+$`
- `Standard.id` matches `^standard_(P\d{3}_)?[a-z0-9_]+$`
- `Pattern`, `Stakeholder`, `Viewpoint`, `View`, `Decision`, `IndustryReferenceDomain` have no enforced ID pattern. Convention: enterprise-wide entities use `<type>_<descriptive_name>`; platform-specific entities use `<type>_P###_<descriptive_name>` (e.g., `stake_P022_board`, `vp_P044_portfolio_status`).

When the same conceptual entity is authored independently by multiple platforms (as is common for Stakeholders, Viewpoints, and some Drivers), the `namespace-divergent.cjs` script (see SCRIPTS.md) rewrites their ids to the platform-namespaced form so each platform owns a distinct entity and the consolidator does not report them as collisions.

When generating IDs programmatically, follow these patterns. The `validate.cjs` script (see SCRIPTS.md) enforces them at validation time.

### Computed vs stored fields

Some attributes are computed rather than stored:

- `Slip.affects_milestone_ids` is computed by traversing Initiative → Transition → to_milestone.
- A Transition's "gap" is computed as the criteria-still-to-satisfy from the from-milestone to the to-milestone.
- A View renders by resolving its scope against current model state (or as_of date).
- The current architectural state of a Platform is computed from active Capabilities and Components, not stored.

When populating Slip, do not pre-populate `affects_milestone_ids` from human input — compute it. When asked "what's the gap for transition X?", traverse rather than expect a stored answer.

## Ambiguities and how to resolve them

The ontology contains deliberate ambiguities — places where the schema is permissive and convention must apply. Each is named here with its resolution rule.

### Ambiguity 1: What counts as a Platform?

The schema does not define what makes something a Platform. In practice, a Platform should satisfy all of:

- Has a named, accountable owner.
- Is funded as a durable product (not a project).
- Provides capabilities to multiple consumers.
- Has its own roadmap, independent of any single consumer.
- Could plausibly outlast any single programme or initiative.

If something fails one or more of these tests, it is probably a Component, not a Platform. The platform-of-platforms model relies on Platforms being the durable unit of governance; fragmenting into too many micro-platforms or aggregating into too few mega-platforms both undermine the model.

### Ambiguity 2: Component subtype boundary

The Component subtype enum has five values (application, service, technology, data, ux). Some real-world components could plausibly fit more than one. Resolution rules:

- If it is a business-facing software application that the LeanIX portfolio team would track as an Application, use `application`.
- If it is a backend service (REST API host, microservice, business logic service), use `service`.
- If it is infrastructure (database, message broker, runtime, cache), use `technology`.
- If it is a data asset, data product, or data store with mastery semantics, use `data` AND populate `data_mastery`.
- If it is a user-facing surface (web app, mobile app, channel UI), use `ux`.

When in doubt, prefer the type the source system uses. ServiceNow's classification of a CI is usually authoritative.

### Ambiguity 3: Industry reference taxonomy anchor

Capabilities may anchor to an industry reference taxonomy domain via `industry_reference_ids`, which is optional and allows an empty array. Resolution depends on whether your organisation's industry has an adopted reference taxonomy (eTOM for telecom, ACORD for insurance, NRF ARTS for retail, etc.):

- If your industry has an adopted reference taxonomy and the organisation has chosen to use it, anchor each capability where it fits. Capabilities that genuinely cannot map should document the reason in their description field and be flagged for architecture review.
- If your industry has no widely-adopted reference taxonomy, or the organisation has chosen not to adopt one, leave `industry_reference_ids` empty across all capabilities. The IndustryReferenceDomain entity collection can be omitted entirely.

Multi-anchor capabilities (mapping to several reference domains) are valid; document the multi-anchor in the description.

### Ambiguity 4: Standard vs Pattern boundary

A Standard is binding; a Pattern is advisory. The boundary is binding force, not content. The same content (e.g., "use OAuth 2.1 for API authentication") could be a Pattern in one organisation and a Standard in another. Resolution:

- If violations require a Decision (waiver), it is a Standard.
- If violations are merely non-conventional, it is a Pattern.

When unsure, default to Pattern. Promotion to Standard is a governance event.

### Ambiguity 4a: Component and Interface as ABB vs SBB

Both Component and Interface carry an optional `building_block_type` attribute (abb or sbb), aligned with the TOGAF distinction:

- **`abb`** — technology-agnostic logical description. *What* is required, without committing to vendors or products. Example ABB Components: "authentication service", "customer database". Example ABB Interfaces: "Customer Search API standard" (the contract, vendor-neutral).
- **`sbb`** — technology-specific implementation. *How* the requirement is realised, with named products and vendors. Example SBB Components: "Okta SSO Gateway on AWS", "PostgreSQL 16 on AWS RDS". Example SBB Interfaces: "GET /v3/customers on api.example.internal/v3".

For new authoring:
- If you're describing logical functionality without committing to a vendor, set `building_block_type = abb`.
- If you're describing a specific product, vendor, or running endpoint, set `building_block_type = sbb`.
- An SBB should ideally have `realises_abb_ids` (on Component) populated to record the ABB it refines. This is the canonical TOGAF Phase B→E refinement edge.
- If unsure, leave `building_block_type` unset and revisit when the technology choice is made.

Note that Capability, Pattern, Standard, and Platform are **not** building blocks in TOGAF's sense and do not carry `building_block_type`. Capabilities are realised by ABBs; Patterns inform ABB design; Standards constrain ABB design; Platforms are governance units composed of building blocks.

### Ambiguity 5: Risk vs Driver (risk type)

Both `Risk` and `Driver.driver_type = risk` exist. Resolution:

- A `Risk` is a specific uncertainty with likelihood and impact, exposing specific components or platforms. It exists in the risk register.
- A `Driver` with `driver_type = risk` is a high-level motivation that risk concerns drive change (e.g., "address audit finding 2025-14"). It motivates Changes.

The same underlying concern can appear as both — a Risk (the architectural uncertainty) and a Driver (the motivation it provides to make changes). Model them as separate entities and link via `Change.addresses_risk_ids` and `Change.responds_to_driver_ids`.

### Ambiguity 6: Standard with standard_type = platform_guardrail

This subtype absorbed the original ontology's PlatformGuardrail entity. The relevant distinction: a `platform_guardrail` Standard is scoped to specific platforms (via `applies_to_platform_ids`), whereas other standard types are typically enterprise-wide. Use `platform_guardrail` when the standard:

- Applies to a specific platform or set of platforms (not enterprise-wide).
- Carries mandatory compliance reporting at platform onboarding.
- Maps to one of the original PlatformGuardrail categories (Security & Access, Safety, Architecture & Integration, Evaluation & Release, Operations & Observability, Compliance & Legal).

### Ambiguity 7: View resolution timing

A View is a *specification* of what to show, not a *snapshot* of stored content. By default, rendering a View resolves against current model state. To render historical state, set `View.scope.as_of` to a date in the past.

This means Views are *cheap* — creating one does not require copying data. But it also means Views can change retroactively as the underlying model changes. If you need a frozen historical record (e.g., "the Board pack delivered on 2026-05-15"), generate the View's content at that time and store the rendering separately.

### Ambiguity 8: Programme membership

This v1.0 ontology does not model Programme. Initiatives are funded units of work but do not have an explicit programme parent. Workarounds:

- If your enterprise has fewer than ~5 programmes, use a Stakeholder per programme with concerns naming the programme.
- For more, capture programme membership as an external reference on Initiative.
- v2.0 may promote Programme to a first-class entity. See SPECIFICATION.md "Open Considerations".

### Ambiguity 9: Quality Attribute target value format

`QualityAttribute.target_value` is a string to accommodate units. Convention:

- Percentages: include the % sign (e.g., "99.95%").
- Durations: include the unit (e.g., "200ms", "5 minutes", "4 hours RTO").
- Throughput: include the unit (e.g., "10000 tps").
- Sizes: use IEC units (e.g., "100 GiB", "5 TiB").

Parsing target_value is application-specific. Where automated comparison matters, also populate `current_value` in the same format.

### Ambiguity 10: Initiative dependency cycles

`Initiative.depends_on_initiative_ids` is not constrained against cycles. A cyclic dependency graph is almost always an error. Validators should detect cycles and surface them rather than rely on schema enforcement.

## Validation rules to apply

In addition to JSON Schema validation, apply these application-level rules:

1. **No initiative dependency cycles.** Detect and reject.
2. **Every Change.target_id resolves to an entity of Change.target_type.** Check on insert/update.
3. **Every Criterion.demanded_change_ids resolves to existing Changes.** Check on insert/update.
4. **Every Initiative.implements_transition_id resolves to a Transition where the to_milestone's platform_id matches.** Initiatives implementing transitions on the wrong platform are usually misclassified.
5. **Every Component.realises_capability_ids resolves to Capabilities on the same Platform as the Component.** Cross-platform realisation is an exception requiring justification.
6. **Commitment.version > 1 requires superseding_decision_id and rationale_for_version.** Application-level check.
7. **Decision.decision_type = rebaseline requires slip_id and updates_commitment_id.** Schema-enforced via `if/then`.
8. **Every Slip.affects_milestone_ids is recomputed on Initiative or Transition changes.** Treat as a derived field.
9. **A Platform should have exactly one Milestone with role = baseline and exactly one with role = target.** Application-level check; warn rather than reject if violated to allow programme-startup states.
10. **Standards with standard_type = platform_guardrail should have applies_to_platform_ids populated.** Application-level warning.

## Migration from earlier ontologies

If migrating from an organisation-specific enterprise architecture ontology, see SPECIFICATION.md "Migration Mapping" for the field-by-field map. In summary:

- Old `ArchitectureComponent` types map to new `Component` subtypes (5 kept), `Interface`, `Standard`, `Driver`, `Risk`, `QualityAttribute`, or are dropped depending on the type.
- Old `TransitionalArchitecture` and `BaselineArchitecture` collapse into `Milestone` with role attribute.
- Old `SubCapability` folds into recursive `Capability`.
- Old `Roadmap` and `Horizon` are no longer entities — they are views and tags respectively.
- Old `PlatformGuardrail` becomes `Standard` with `standard_type = platform_guardrail`.

## Schema extension mechanism

The base ontology (`ontology-schema.json`) is intentionally industry-neutral and reusable across workspaces. Organisations often need additional entity types or fields for domain-specific use cases (board reporting formats, delivery tracking, value realisation, etc.) without forking the base schema.

The extension mechanism uses **JSON Schema composition** (`allOf`) to layer organisation-specific definitions on top of the base.

### How it works

1. **Base schema** — `ontology-schema.json` remains untouched in the framework. It defines the 22 core entities, enforces `additionalProperties: false` at the top level, and validates all base-entity fields.

2. **Extension schema** — a separate JSON Schema file in the workspace that:
   - References the base schema via `allOf: [{ "$ref": "<path-to-base>" }]`
   - Adds new top-level properties (new entity arrays)
   - Defines new entity types in its own `$defs`
   - Can extend existing entities by providing supplementary field definitions (e.g., `InitiativeExtension`)
   - Overrides the `version` constraint to the extension version

3. **Workspace configuration** — the `.aaa-config.yaml` in the workspace root declares which schema to use:

```yaml
ontology:
  schema: change/enterprise-modernisation/board-updates/may-2026-update/working/pipeline-ontology-extension.json
```

When `ontology.schema` is not set, scripts default to the framework's base schema at `.ai-assisted-architecture/standards/ontology/ontology-schema.json`.

### Extension schema template

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "my-extension.json",
  "title": "My Ontology Extension",
  "allOf": [
    { "$ref": "../../.ai-assisted-architecture/standards/ontology/ontology-schema.json" }
  ],
  "type": "object",
  "properties": {
    "version": { "type": "string", "const": "1.4.0" },
    "my_new_entity": {
      "type": "array",
      "items": { "$ref": "#/$defs/MyNewEntity" }
    }
  },
  "unevaluatedProperties": false,
  "$defs": {
    "MyNewEntity": {
      "type": "object",
      "properties": { "id": { "type": "string" }, "name": { "type": "string" } },
      "required": ["id", "name"],
      "additionalProperties": false
    }
  }
}
```

### Rules for extensions

1. **Never modify the base schema** in the framework clone for organisation-specific needs.
2. **Extension entities** should use a distinct naming convention (e.g., `delivery_gate`, `use_case`) that won't collide with future base entities.
3. **Extended fields on base entities** are documented in a companion `$defs` entry (e.g., `InitiativeExtension`) and merged at validation time.
4. **Version the extension** — bump the `version` const when the extension shape changes.
5. **One extension per workspace** — the config points to a single schema that composes everything needed.

### Script resolution order

All ontology scripts (`validate.cjs`, `consolidate.cjs`, `namespace-divergent.cjs`) resolve the schema in this order:

1. Explicit `--schema <path>` argument (highest priority)
2. `ontology.schema` from `.aaa-config.yaml` in the workspace root (if present)
3. `ontology.schema` from `.aaw-config.yaml` (legacy compatibility; also supports `modules.aaa.ontology_schema`)
4. Framework default: `.ai-assisted-architecture/standards/ontology/ontology-schema.json`

## Versioning

This is version 1.0.0. Breaking changes bump the major version. Additive changes bump the minor version. Documentation-only changes bump the patch version. Always declare the version when consuming the schema; reject inputs with a mismatched ontology_id.

## Files in this package

- `ontology-schema.json` — the JSON Schema (authoritative).
- `README.md` — this document.
- `SPECIFICATION.md` — formal specification with motivations, design choices, and open considerations.
- `SCRIPTS.md` — CLI script reference.
- `example-identity-platform.json` — worked example illustrating entity relationships.
