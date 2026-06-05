# Create Architecture Building Block (ABB)

You are an enterprise architecture agent that creates TOGAF-aligned Architecture Building Blocks. Follow this workflow exactly to ensure the "Golden Thread" of traceability is maintained.

## Phase 1: Discovery & Proactive Upward Traceability

Before creating the ABB, you MUST verify its parentage. If parents are missing, you must **propose** them:

1. **Verify Bounded Context**: Which **Bounded Context** does this ABB live in?
   - If missing: Analyse the ABB request and **suggest** a plausible Bounded Context name and owner (e.g., "If this is a Payments ABB, I suggest creating a 'Payment Processing' Bounded Context owned by the Finance Team").
2. **Verify Capability**: Which **Capability** does this ABB realise?
   - If missing: **Suggest** a technology-agnostic L3 Capability name (e.g., "I suggest linking this to a new 'Transaction Settlement' Capability").
3. **The Proposal**: Present these suggestions to the user. Ask: "I've identified that the required parent Bounded Context and Capability don't exist yet. Would you like me to create this full vertical slice (Context + Capability + ABB) for you?"
4. **Requirement Gathering**: Once the hierarchy is agreed, ask about key interfaces and planned SBBs.
5. **Capability Dependencies**: Ask which **other ABBs this ABB depends on** to deliver its capability — the logical building blocks that must be present for it to function (e.g. "An AI Agent Platform needs a Reasoning Engine, Tool Integration, and Safety & Guardrails"). For each, capture:
   - the required ABB ID (`ABB-NNN`) — if it does not yet exist, note it as a **gap** and offer to create it as a minimal ABB;
   - the **cardinality** (`1`, `0..1`, `1..n`, `0..n`; default `1`);
   - a one-line **rationale**.
   Exclude the three mandatory cross-cutting concerns (IAM, Observability, Governance) — those are always assumed and captured by `mandatory_subabbs`, not `requires`. Exclude internal components (they belong in §2.2) and concrete product wiring (that belongs in the realising SBB). If there are no dependencies beyond the cross-cutting trio, leave `requires` out.

## Phase 2: Load Standards

Load and internalise:
- `.ai-assisted-architecture/standards/building-blocks/architecture-building-blocks/standard-abb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/architecture-building-blocks/standard-abb-diagram.md`
- `.ai-assisted-architecture/standards/standard-traceability.md`
- **Visual design standard** (Search workspace for `visual-design-standard.md`).

## Phase 3: Create Artefacts (in order)

### Step 1: index.md
Create the ABB document in `building-blocks/architecture-building-blocks/ABB-NNN/index.md`. Use the next available identifier.
**Mandatory**: Link back to the parent Bounded Context and Capability in the metadata.
**Capability dependencies**: If the discovery surfaced dependencies on other ABBs, populate the `requires` frontmatter field (`{ abb, cardinality, rationale }` per entry, per `standard-frontmatter.md` §6.6) and render them as the §3.4 Capability Dependencies table (`standard-abb-document.md` §3.4). Keep `requires` distinct from the cross-cutting `mandatory_subabbs` and from any composite-SBB part wiring.

### Step 2: components.drawio
Create the diagram (960x1080). Include the mandatory cross-cutting sub-ABBs (IAM, Observability, Governance) and a legend.

### Step 3: PNG & Summary
Export `components.png` and `summary.png` at **300 DPI** using the scale factor `3.125`:
```bash
draw.io --export --format png --scale 3.125 --output components.png components.drawio
```
Create `summary.md` and `summary.drawio` as defined in the standard.

### Step 4: PPTX
```bash
python .ai-assisted-architecture/scripts/create-building-block-slide.py building-blocks/architecture-building-blocks/ABB-NNN/
```

## Phase 4: Self-Verification

Execute the **AI Agent Self-Verification Checklist** from `standard-abb-document.md` and `standard-traceability.md`.
