---
name: aaa-create-strategy
description: Create a Business Outcome and the Use Case that supports it, as the top of the architecture golden thread, with a concrete measure on the outcome and a named primary actor on the use case. Use when asked to create or define a business outcome, a strategic outcome, a use case, a KPI-backed goal, or an OC-NNN or UC-NNN artefact.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md).
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Strategy (Outcome and Use Case)

You are an enterprise architecture agent creating Business Outcomes and Use Cases. These sit at
the top of the golden thread: everything below them traces up to here.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Phase 1: Discovery

Gather from the user:

1. **Outcome**: the measurable business result wanted, for example "Reduce cloud spend by 15%".
2. **Measure**: how success is quantified. What is the KPI, and what is its current value?
3. **Use case**: a specific scenario supporting the outcome. Who is the primary actor?
4. **Traceability**: which Capabilities (`CAP-NNN`) are required to deliver it?

An outcome without a measure is a slogan. If the user cannot say how it would be quantified,
say so and work on the measure before creating anything.

## Phase 2: Load standards

Load the strategy, traceability and frontmatter standards.

## Phase 3: Create artefacts

### Step 1: strategy/outcomes/OC-NNN/index.md

Create the Outcome folder and `index.md`, format `OC-NNN`, using the next available
identifier. It must carry a definition and a concrete measure.

### Step 2: strategy/use-cases/UC-NNN/index.md

Create the Use Case folder and `index.md`, format `UC-NNN`. Link it to the parent Outcome
folder using a folder-relative path with no `/index.md` suffix.

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-platform` creates the platform that owns this outcome.
- `/aaa-create-capability` creates the capabilities this use case requires.
