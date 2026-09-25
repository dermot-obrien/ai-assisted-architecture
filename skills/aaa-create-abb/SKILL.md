---
name: aaa-create-abb
description: Create a TOGAF-aligned Architecture Building Block (ABB) with its index document, components diagram, C4 system context view, PNG exports and summary, keeping the golden thread of traceability from Strategic Outcome down to the ABB intact. Use when asked to create, add or scaffold an ABB or architecture building block, to define a logical building block under a capability or bounded context, or to fill an ABB gap surfaced by another artefact's requires list.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). PNG export needs draw.io desktop on PATH. Artefact locations come from [suite.<skill-name>] of the repository's .agents/skill-bindings.toml, resolved with the model skill's doctor; this skill ships no directory layout of its own.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Architecture Building Block (ABB)

You are an enterprise architecture agent creating TOGAF-aligned Architecture Building Blocks.
Follow this workflow exactly so the golden thread of traceability is maintained.

Before Phase 3, resolve and load the canonical standards. They live in the workspace, not in
this skill, so they stay governed by the organisation rather than by the framework version.
Read [references/standards-discovery.md](references/standards-discovery.md) for how to find
them and which ones this skill needs.

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
python <skills>/model/bin/model.py doctor --skill aaa-create-abb --json
```

`<skills>` is the directory this skill is installed in. It exits non-zero on `error`. Do not
proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `abbDir` | Where a new ABB folder is created |
| `contextDir` (optional) | The parent Bounded Context, for the mandatory link back |
| `capabilityDir` (optional) | The parent Capability, for the mandatory link back |

The contract is declared in `inputs.toml` beside this file. The repository answers it in
`[suite.aaa-create-abb]` of its `.agents/skill-bindings.toml`. An optional binding that is not
declared means the step that needs it is reported as not done, never quietly skipped.

## Phase 1: Discovery and proactive upward traceability

Verify the ABB's parentage before creating it. Where a parent is missing, propose it rather
than inventing it silently.

1. Verify the Bounded Context this ABB lives in. If missing, analyse the request and suggest
   a plausible Bounded Context name and owner, for example "If this is a Payments ABB, I
   suggest creating a 'Payment Processing' Bounded Context owned by the Finance Team".
2. Verify the Capability this ABB realises. If missing, suggest a technology-agnostic L3
   Capability name, for example "I suggest linking this to a new 'Transaction Settlement'
   Capability".
3. Put the proposal to the user: "I've identified that the required parent Bounded Context
   and Capability don't exist yet. Would you like me to create this full vertical slice
   (Context + Capability + ABB) for you?"
4. Once the hierarchy is agreed, ask about key interfaces and planned SBBs.
5. Capture capability dependencies: which other ABBs must be present for this one to deliver
   its capability. For an AI Agent Platform that might be a Reasoning Engine, Tool
   Integration and Safety and Guardrails. For each dependency record:
   - the required ABB ID (`ABB-NNN`); if it does not exist yet, note it as a gap and offer
     to create it as a minimal ABB
   - the cardinality (`1`, `0..1`, `1..n`, `0..n`; default `1`)
   - a one-line rationale

   Exclude the three mandatory cross-cutting concerns (IAM, Observability, Governance);
   those are always assumed and captured by `mandatory_subabbs`, not `requires`. Exclude
   internal components, which belong in section 2.2, and concrete product wiring, which
   belongs in the realising SBB. If there are no dependencies beyond the cross-cutting trio,
   leave `requires` out entirely.

## Phase 2: Load standards

Load and internalise the ABB document standard, the ABB diagram standard, the traceability
standard, the frontmatter standard and the visual design standard. If this ABB is top-level,
also load the C4 context diagram standard. Resolve each by the procedure in
[references/standards-discovery.md](references/standards-discovery.md).

Do not produce any artefact before these are loaded.

## Phase 3: Create artefacts, in order

### Step 1: index.md

Create the ABB document at `<abbDir>/ABB-NNN/index.md`, using the next available identifier.

Link back to the parent Bounded Context and Capability in the metadata. This is mandatory.

If discovery surfaced dependencies on other ABBs, populate the `requires` frontmatter field
with `{ abb, cardinality, rationale }` per entry as defined in the frontmatter standard
section 6.6, and render them as the section 3.4 Capability Dependencies table per the ABB
document standard. Keep `requires` distinct from the cross-cutting `mandatory_subabbs` and
from any composite-SBB part wiring.

### Step 2: components.drawio

Create the diagram at 960x1080. Include the mandatory cross-cutting sub-ABBs (IAM,
Observability, Governance) and a legend.

### Step 2b: C4 System Context diagram, top-level ABBs only

Decide whether this ABB is top-level, meaning it represents a whole system a stakeholder
would name such as a trading platform or a payments system, rather than a fine-grained
internal building block. If it is, add a C4 System Context diagram to `index.md` as section
2.1.1. The full rendering contract is in
[references/c4-context-diagram.md](references/c4-context-diagram.md).

Skip this step for fine-grained ABBs only ever seen inside a larger system. Their component
diagram is sufficient.

### Step 3: PNG and summary

Export `components.png` and `summary.png` at 300 DPI using scale factor 3.125:

```bash
draw.io --export --format png --scale 3.125 --output components.png components.drawio
```

Create `summary.md` and `summary.drawio` as defined in the ABB diagram standard.

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the ABB document standard and the
traceability standard, then confirm the framework-level checks in
[references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-context` and `/aaa-create-capability` create the parents this ABB needs.
- `/aaa-create-sbb` creates the solution building block that realises this ABB.
- `/aaa-create-service` creates the runtime service an SBB deploys.
