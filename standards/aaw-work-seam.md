# AAW Work Seam — Decisions & Interventions ↔ Architecture

This document defines how AI-Assisted Architecture (**AAA**) connects to the
[AI-Assisted Work](https://github.com/dermot-obrien/ai-assisted-work) **work-classification
standard** (`work-classification.md`). It lets architecture artefacts and work items share
one vocabulary without drift.

## The seam in one line

> **Architecturally significant work surfaces in AAA as artefacts.** A *decision* becomes a
> Decision Record; a cross-cutting *intervention* becomes (or revises) a Capability / ABB / SBB.

AAW classifies every unit of work (chore · change · intervention · inquiry). Most never
touch architecture. The two that do:

- a **decision** deliverable (produced by any class of work, or by an AAR inquiry), and
- an **intervention** whose blast radius is *cross-cutting* and touches the architecture.

## Decisions → Decision Records (ADRs)

Any AAW work that makes an architecturally significant choice produces a **decision**
deliverable. That decision seams to AAA as a **Decision Record (`DR-NNN`)** — the
first-class metamodel element for architectural decisions (MADR body + Y-statement
frontmatter, with `change_type` and `affects_artefacts` relations).

```
AAW work (any class) → decision deliverable → AAA Decision Record (DR-NNN)
```

The work item records *what was done*; the Decision Record records *what was decided and
why*, and links to the artefacts it affects.

## Cross-cutting interventions → Capability / ABB / SBB

An AAW **intervention** (known · cross-cutting) that changes shared architecture maps onto
AAA's building blocks — created or revised via the `create-*` agents:

| The intervention changes… | AAA artefact | Agent |
|---------------------------|--------------|-------|
| a business/operational capability | **Capability** (`CAP-NNN`) | `create-capability` |
| a reusable architecture pattern | **Architecture Building Block** (`ABB-NNN`) | `create-abb` |
| a concrete technology realisation | **Solution Building Block** (`SBB-NNN`) | `create-sbb` |
| a bounded context / platform / service | Context · Platform · Service | `create-context` / `create-platform` / `create-service` |
| a baseline → target migration | **Snapshot** (`SN-NNN`) + **Transition** (`TR-NNN`) | (sequenced by Decision Records) |

A `chore` or `change` rarely reaches here — by definition they're not cross-cutting. When
they unexpectedly are, AAW's *promotion* rule applies: the work is re-triaged up to an
intervention, and the architecture artefacts above come into play.

## Direction of flow

- **AAW → AAA**: a delivery item that's architecturally significant emits a Decision Record
  and/or revises building blocks.
- **AAA → AAW**: an architecture initiative (e.g. "introduce capability X") is itself an AAW
  **intervention** — it's planned and executed through AAW's work lifecycle, with AAA's
  `architecture-work` type and deliverables.
- **AAR → AAA**: a *validated* research decision (see AAR's inquiry seam) lands as a
  Decision Record here before AAW delivers it.

## Planning, deliverables and rungs

Planning is the third seam. AAW plans architecture work a period at a time; AAA says what
that work has made true. The unit that joins them is a rung on the
[definition ladder](capabilities/standard-definition-ladder.md): a piece of architecture work
is framed as moving one capability area's flows from one rung to another, and a planning
period opens with the grid of where each area starts and where it is committed to finish.

### Deliverable types map to artefact kinds, and so to rungs

Each deliverable type in a workspace's deliverable register names the AAA artefact kind it
produces. The artefact kind decides the rung the deliverable evidences, so a named product
says which rung it moves toward. A typical mapping:

| Deliverable type | AAA artefact kind | Rung it evidences |
|------------------|-------------------|-------------------|
| Capability definition | Capability (`CAP-NNN`) | R1 Named |
| Building block specification | ABB (`ABB-NNN`) | R2 Bounded |
| Open question | Consideration (`CN-NNN`) | R2 Bounded |
| Decision | Decision Record (`DR-NNN`) | R3 Decided |
| Logical pattern | Pattern, every box an ABB | R3 Decided |
| Product mapping | SBB (`SBB-NNN`) | R4 Buildable |
| Cost model | A `cost-model` reference on the physical pattern | R4 Buildable |
| Physical pattern | Pattern, every box an SBB | R4 Buildable |
| Evaluation received | An `evidence` reference on the physical pattern | R5 Proven |
| Runbook received | A `runbook` reference, and the capability `active` | R6 In service |

The register records the rung in its own `rung` column, using the rung identifiers of the
workspace's ladder. The names of the deliverable types belong to the workspace; the artefact
kinds and rungs are AAA's. R5 and R6 are received from implementation, so their deliverables
are links, not documents architecture writes.

### The ladder AAW reads

AAW's quarter planning reads a ladder as a CSV with the columns `rung,name,description`. AAA
ships one at `standards/capabilities/definition-ladder.csv`. A workspace that adopts the AAA
ladder binds that file, or its own governed copy of it, as the planning skill's ladder, so
both frameworks name the same rungs.

### Derived rungs feed the framing

`aaa-rung` derives each capability's rung, per flow, from the artefacts that exist, and names
the artefact that blocks the next rung. Its `--json` output is what planning consumes:

- **Starting rung.** An epic's "from" rung is the derived rung at the start of the period, not
  a claim. A framing whose "from" is above the derived rung is claiming evidence that does not
  exist yet.
- **Products.** The blocker `aaa-rung` names is the first product the epic needs. Each target
  rung should have at least one named product whose deliverable type evidences it.
- **Close.** At the end of the period the rung reached is read again from `aaa-rung`, not
  asserted, and any unfinished movement carries into the next period's grid as its start.

Criteria follow the same rule. An outcome measure has an identifier of the form `OC-NNN-M<n>`
(see the [Strategy Standard](strategy/standard-strategy.md)), and planning cites those
identifiers as `advances_criterion_ids` to say which measures a piece of work moves.

## Vocabulary alignment (no drift)

| Concept | AAW | AAA |
|---------|-----|-----|
| an architectural choice | a `decision` deliverable | Decision Record (`DR-NNN`) |
| cross-cutting change | class `intervention` | Capability / ABB / SBB revision |
| architecture project | `architecture-work` work item | the work that produces AAA artefacts |
| baseline vs target | release / version | Snapshot + Transition |
| progress of architecture work | an epic's rung movement per flow | a rung on the definition ladder, derived by `aaa-rung` |
| what a product evidences | deliverable type and its `rung` | artefact kind |
| a criterion work advances | `advances_criterion_ids` | an outcome measure id (`OC-NNN-M<n>`) |

AAA owns the *architecture metamodel and artefacts*; AAW owns the *class definitions and the
delivery lifecycle*. The seam is `decision → DR`, `cross-cutting intervention → building
blocks`, and `deliverable type → artefact kind → rung`.

See AAW's `docs/concepts/work-classification.md` for the full taxonomy,
and AAA's `standard-metamodel.md` for the artefact definitions.
