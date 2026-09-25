---
name: aaa-create-sbb
description: Create a TOGAF-aligned Solution Building Block realising a parent ABB, deciding simple versus composite, mapping every ABB component to a real product, and authoring the composite structure diagram with its ports, parts and connectors. Use when asked to create, add or scaffold an SBB or solution building block, to map a product or vendor technology onto an ABB, or to model a composite assembly of sub-SBBs.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). PNG export needs draw.io desktop on PATH. Artefact locations come from [suite.<skill-name>] of the repository's .agents/skill-bindings.toml, resolved with the model skill's doctor; this skill ships no directory layout of its own.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Solution Building Block (SBB)

You are an enterprise architecture agent creating TOGAF-aligned Solution Building Blocks. An
SBB is the physical realisation of a logical ABB: this is where products and vendors are
allowed to appear.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
python <skills>/model/bin/model.py doctor --skill aaa-create-sbb --json
```

`<skills>` is the directory this skill is installed in. It exits non-zero on `error`. Do not
proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `sbbDir` | Where a new SBB folder is created, composites included |
| `abbDir` (optional) | The logical ABB a physical SBB realises |

The contract is declared in `inputs.toml` beside this file. The repository answers it in
`[suite.aaa-create-sbb]` of its `.agents/skill-bindings.toml`. An optional binding that is not
declared means the step that needs it is reported as not done, never quietly skipped.

## Phase 1: Discovery and proactive traceability

1. **Parent ABB**: which ABB (`ABB-NNN`) does this SBB realise? If missing, suggest a plausible
   logical ABB name based on the product, for example "If you are implementing PostgreSQL, I
   suggest we first create a 'Structured Data Store' ABB".
2. **Bounded context**: if the parent ABB is also missing, suggest the context that should own
   this SBB, for example "I suggest this lives in the 'Data Persistence' Bounded Context".
3. **The proposal**: "To maintain the hierarchy, I suggest we create the parent ABB and Bounded
   Context before finalising this SBB. Would you like me to generate this vertical slice?"
4. **Product details**: once agreed, ask for specific products, platforms and cloud providers.

### Simple or composite?

Decide whether this SBB is simple, meaning one product or family with a flat product mapping,
or composite, meaning an assembly of sub-SBBs whose internal structure is worth modelling.
Apply the test in the SBB document standard under "When to use composite vs simple SBBs". When
in doubt, start simple: a composite that turns out to be simple is easy to collapse, and the
reverse is not.

A composite additionally requires `composite: true`, `ports`, `parts` and `connectors` in the
frontmatter, and a Mermaid composite-structure diagram. The full composite contract is in
[references/composite.md](references/composite.md).

## Phase 2: Load standards

Load the SBB document and diagram standards, the frontmatter standard including sections 6.7
and 6.7.1 for composite fields, the traceability standard and the visual design standard. For
a composite, also load the C4 context diagram standard.

## Phase 3: Create artefacts

### Step 1: index.md

Create the SBB document at `<sbbDir>/SBB-NNN/index.md`.

Every component from the parent ABB must be mapped to a product or service in section 2.2. An
unmapped ABB component is a gap: name it as one rather than leaving it silently absent.
Include `sidebar_position` in the frontmatter, conventionally matching the SBB number.

### Step 2: components.drawio, or Mermaid for a composite

For a simple SBB, create the draw.io diagram at 960x1080, with ABB Ref Badges on every
component and the mandatory cross-cutting containers (IAM, Observability, Governance).

For a composite, the Mermaid composite-structure diagram is the normative section 2.1 view and
the draw.io pair is optional. See [references/composite.md](references/composite.md).

### Step 3: summary.md

Create the plain-text summary source per the Summary Panel section of the standard. Use bullet
characters for bullets and a full stop plus space for lead-ins, as the standard specifies.

### Step 4: summary.drawio

A single text cell at 16pt, `page="0"`, width 768px, left margin 96px. HTML-formatted content,
kept in sync with `summary.md`.

### Step 5: PNG export

```bash
draw.io --export --format png --scale 3.125 --output components.png components.drawio
draw.io --export --format png --scale 3.125 --output summary.png summary.drawio
```

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-abb` creates the logical ABB this SBB realises.
- `/aaa-create-context` creates the context that owns it.
- `/aaa-create-service` creates the runtime service that deploys it.
