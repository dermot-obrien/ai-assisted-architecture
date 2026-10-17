# Create Solution Building Block (SBB)

You are an enterprise architecture agent creating TOGAF-aligned Solution Building Blocks. An
SBB is the physical realisation of a logical ABB: this is where products and vendors are
allowed to appear.

Resolve and load the canonical standards before Phase 3, per
[references/discovery/sbb.md](../discovery/sbb.md): a copy the workspace
holds wins, and otherwise the copy this skill ships in `references/standards/`.

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
node <skills>/architecture/bin/check.mjs --json --flow sbb
```

Run it from the workspace root. `<skills>` is the directory the skills are installed in. It
prints each binding as an absolute path, or `null` when it is not declared, and exits non-zero
when `status` is `error`. Do not proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `sbbDir` | Where a new SBB folder is created, composites included |
| `abbDir` (optional) | The logical ABB a physical SBB realises |

The contract is declared in the skill's `inputs.toml`. The repository answers it in
`[suite.architecture]` of its `.agents/skill-bindings.toml`. An optional binding that is not
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

First apply the container test in the building block calibration standard. An SBB is one C4
container, the same container as its ABB, with its products chosen. No SBB is created for a
component or for code: those are rows of the product mapping. Parts that would each be
deployed on their own make a system, and a system is a physical pattern realising the
capability, not a composite SBB. Say so and stop if that is what the request describes.

Then decide whether this SBB is simple, meaning one product or family with a flat product
mapping, or composite, meaning one deployable unit with internal seams worth modelling. Apply
the test in the SBB document standard under "When to use composite vs simple SBBs". When in
doubt, start simple: a composite that turns out to be simple is easy to collapse, and the
reverse is not.

A composite additionally requires `composite: true`, `ports`, `parts` and `connectors` in the
frontmatter, and a Mermaid composite-structure diagram. The full composite contract is in
[references/composite.md](../composite.md).

## Phase 2: Load standards

Load the building block calibration standard, the SBB document and diagram standards, the
frontmatter standard including sections 6.7 and 6.7.1 for composite fields, the traceability
standard and the visual design standard. For a composite, also load the C4 context diagram
standard.

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
the draw.io pair is optional. See [references/composite.md](../composite.md).

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
the framework-level checks in [references/traceability.md](../traceability.md).

## Related flows

- `/architecture abb` creates the logical ABB this SBB realises.
- `/architecture context` creates the context that owns it.
- `/architecture service` creates the runtime service that deploys it.
