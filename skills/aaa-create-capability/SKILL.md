---
name: aaa-create-capability
description: Create a Capability document with its strategic justification, level and maturity, updating the master capability taxonomy and drawing the L1 domain map where one is needed. Use when asked to create, define or add a capability, to place a capability in the capability model, to set or map capability maturity, or to create a CAP-NNN artefact or capability map.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). PNG export needs draw.io desktop on PATH.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Capability

You are an enterprise architecture agent creating Capability documents. A capability is
technology-agnostic: it says what the organisation must be able to do, never how.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Phase 1: Discovery and proactive upward traceability

Verify the strategic justification before creating anything. Where a parent is missing,
propose it rather than inventing it.

1. **Platform**: which Platform (`PL-NNN`) does this capability belong to? Search `platforms/`.
   If none exists, offer `/aaa-create-platform` first.
2. **Outcome**: which Business Outcome (`OC-NNN`) does it support? If missing, infer a business
   result from the capability name and suggest it, for example "I suggest linking this to a new
   Outcome: 'Increase Operational Visibility'".
3. **Use case**: which Use Case (`UC-NNN`) requires it? If missing, suggest a concrete
   operational scenario, for example "I suggest a use case: 'Real-time Signal Analysis'".
4. **The proposal**: "To justify this capability, I suggest we also define the parent Platform,
   Outcome, and Use Case. Should I create this strategic slice for you?"
5. **Details**: once agreed, gather level (L1, L2 or L3) and maturity.

If the proposed name contains a product or vendor, it is not a capability. Rename it to the
ability and record the product against the SBB that realises it.

## Phase 2: Load standards

Load the capability document standard, the traceability standard and the frontmatter standard.
Add the capability diagram and visual design standards if you will draw a map.

## Phase 3: Create artefacts

### Step 1: index.md

Create the capability document at `capabilities/CAP-NNN/index.md`. Link back to the parent
Outcome and Use Case in the Purpose section. This is mandatory.

### Step 2: Update capability-model.md

Update the master taxonomy with the new capability and its maturity rating. A capability that
exists as a document but not in the taxonomy is invisible to everything downstream.

### Step 3: Capability map, L1 domains only

If this is an L1 domain, create the map diagram per the capability diagram standard and export
at 300 DPI:

```bash
draw.io --export --format png --scale 3.125 --output capability-map.png capability-map.drawio
```

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-platform` creates the platform this capability belongs to.
- `/aaa-create-context` creates the bounded context that realises it.
- `/aaa-create-abb` creates the building blocks beneath it.
