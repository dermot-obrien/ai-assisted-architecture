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

## Vocabulary alignment (no drift)

| Concept | AAW | AAA |
|---------|-----|-----|
| an architectural choice | a `decision` deliverable | Decision Record (`DR-NNN`) |
| cross-cutting change | class `intervention` | Capability / ABB / SBB revision |
| architecture project | `architecture-work` work item | the work that produces AAA artefacts |
| baseline vs target | release / version | Snapshot + Transition |

AAA owns the *architecture metamodel and artefacts*; AAW owns the *class definitions and the
delivery lifecycle*. The seam is `decision → DR` and `cross-cutting intervention → building
blocks`.

See AAW's `packages/skills/work-management/work-classification.md` for the full taxonomy,
and AAA's `standard-metamodel.md` for the artefact definitions.
