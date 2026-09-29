# Examples

Worked examples that ship with the framework, and what each one shows. Paths are relative to
the repository root; in a workspace they sit under `.ai-assisted-architecture/`.

## Artefacts written to the standards

Each standard carries a worked example the skills compare their output against.

| Example | Shows | Used by |
|---|---|---|
| `standards/building-blocks/architecture-building-blocks/example/` | A complete ABB: `index.md`, `summary.md`, the components and summary draw.io diagrams and their PNG exports | [aaa-create-abb](skills/aaa-create-abb.md) |
| `standards/building-blocks/architecture-building-blocks/example-requires/` | Five ABBs (`ABB-010` to `ABB-014`) whose `requires` lists form a dependency graph, for gap analysis | [aaa-create-abb](skills/aaa-create-abb.md), [aaa-rung](skills/aaa-rung.md) |
| `standards/building-blocks/solution-building-blocks/example/` | A simple SBB mapping each ABB component to a product, with its diagrams | [aaa-create-sbb](skills/aaa-create-sbb.md) |
| `standards/building-blocks/solution-building-blocks/example-composite/` | A composite SBB with parts, ports and connectors (`index.md`), and the C4 System Context view of the same system from outside (`c4-context.md`) | [aaa-create-sbb](skills/aaa-create-sbb.md) |
| `standards/ontology/example-identity-platform.json` | One platform described in the modernisation ontology: capabilities, components, changes and milestones | [Ontology](ontology.md) |

## The foundation seed

`foundation/` is a complete, generic platform-as-product model you can seed into a workspace
([Concepts](concepts.md#the-foundation-seed)) or read as a larger example of every artefact
kind:

| Folder | Holds |
|---|---|
| `foundation/strategy/outcomes/`, `use-cases/` | 13 outcomes (`OC-NNN`) and 5 use cases (`UC-NNN`) |
| `foundation/platforms/` | 12 platforms (`PL-NNN`) |
| `foundation/capabilities/` | 44 capabilities across L1, L2 and L3, with `capability-model.md` and its two CSVs |
| `foundation/contexts/` | 12 bounded contexts (`BC-NNN`) |
| `foundation/building-blocks/` | 8 ABBs and 3 SBBs with full diagram sets |
| `foundation/profiles/` | The `core`, `integration` and `infrastructure` profiles the seeder copies |

To see what the profiles would copy into your workspace without writing anything, run this
from the workspace root:

```bash
node .ai-assisted-architecture/src/seed-foundation.mjs --profile all --dry-run
```

## A workspace at every rung

`skills/aaa-rung/tests/fixtures/workspace/` is a small order-handling workspace built for the
`aaa-rung` tests. It has one capability at each rung from R1 to R6, one held back by an open
consideration, one whose decision was superseded, one with two flows at different rungs, and
one named only by a pattern. It carries its own `skill-bindings.toml`, so you can run the
skill against it directly from a clone of this repository:

```bash
python skills/aaa-rung/bin/rung.py --bindings skills/aaa-rung/tests/fixtures/workspace/skill-bindings.toml
```

```text
Capability  Flow           Rung             Recorded    Blocking the next rung
----------  -------------  ---------------  ----------  ----------------------
CAP-001     -              R1 Named                     CAP-001 names no ABB in realised_by_abbs (+1 more)
CAP-002     -              R2 Bounded                   no pattern realises CAP-002: add realises: [CAP-002] to a logical pattern
CAP-003     -              R3 Decided                   no SBB realises ABB-002 (+1 more)
...
CAP-006     -              R6 In service                top of the ladder
...
```

Read its documents side by side with the report to see which front matter earns each rung.
[Configuration](configuration.md#front-matter-read-by-aaa-rung) lists the fields.

## The quick start

The [quick start](quick-start.md) builds a small example of its own: a capability
`CAP-100 Order Notifications` with one flow, taken from R1 to R2 by adding an ABB.
