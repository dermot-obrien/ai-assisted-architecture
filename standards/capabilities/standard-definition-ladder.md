---
document_type: standards
title: "Definition Ladder Standard"
classification: internal
version: 0.1.0
status: draft
created: 2026-09-26
last_modified: 2026-09-26
owner: "Architecture Team"
triggers:
  - "Stating how far a capability, or one of its flows, has been defined"
  - "Planning architecture work as movements up the ladder"
  - "Deriving a capability's rung from the artefacts that exist"
  - "Deciding which artefact is missing before a capability can move up"
---

# Definition Ladder Standard

The definition ladder states how far a capability has been taken, as a rung that can be checked. Each rung is a claim about the capability rather than about the work done on it, and each rung names the artefacts that prove it. Nobody has to take a rung on trust: either the artefacts exist and say what the rung requires, or the capability sits on the rung below.

The ladder is the unit of progress for architecture work. A planning period can be expressed as rung movements, a piece of work can be framed as one movement, and the state of a capability model can be read as a grid of where each capability stands.

The machine-readable form of the rungs is [`definition-ladder.csv`](./definition-ladder.csv), with the columns `rung,name,description`. Tools read that file rather than this one.

> **Cross-references:**
> - [Capability Document Standard](./standard-capability-document.md): where a capability records its flows and their rungs.
> - [Frontmatter Standard](../standard-frontmatter.md): the `flows[]`, `open_questions` and `demand_assumption` fields, the `consideration` kind, and the `evidence`, `cost-model` and `runbook` reference types.
> - [Metamodel Standard](../standard-metamodel.md): where the ladder and the consideration kind sit in the metamodel.
> - [AAW Work Seam](../aaw-work-seam.md): how planning consumes rungs.

## 1. The rungs

| Rung | Name | True when | Evidenced by | Reach |
|---|---|---|---|---|
| R0 | Unrecognised | The capability is not in the capability model, whatever else exists | Nothing | Architecture |
| R1 | Named | The capability has an identifier, a level, a parent where its level needs one, a purpose, and the demand it answers. Demand is an outcome, or a claim explicitly recorded as an assumption | A capability document (`CAP-NNN`) | Architecture |
| R2 | Bounded | The building blocks it needs are named, with what each of them requires. Its non-goals are written down. Every open question with more than one credible answer is listed as a consideration, or the capability states that it has none | ABB documents (`ABB-NNN`), considerations (`CN-NNN`) | Architecture |
| R3 | Decided | Each of those open questions is settled by an accepted decision record. A pattern that realises the capability is logical: every box in it is an ABB | Decision records (`DR-NNN`), a logical pattern | Architecture |
| R4 | Buildable | Each ABB is realised by an accepted SBB. The running cost has been modelled. A realising pattern is physical, and a team could build from it without asking the architect | SBB documents (`SBB-NNN`), a physical pattern, a cost model | Architecture |
| R5 | Proven | An implementation exercises the pattern end to end, and the evidence that it meets the capability's criteria is linked from the pattern | An experiment or build and its evaluation, linked as `evidence` | Implementation, received by architecture |
| R6 | In service | It runs for real, with an owner, a runbook and a measure reported against the outcome it serves | A runbook and a service record, linked as `runbook`, and the capability's status `active` | Implementation, received by architecture |

### 1.1 Where architecture's reach ends

Architecture's reach ends at R4. Defining, designing and deciding are architecture work, and R1 to R4 are made true by artefacts that architecture authors. R5 and R6 are made true by implementation, wherever it happens.

Architecture's condition for R5 and R6 is receipt. The evidence exists, it is linked from the realising pattern or the capability, and the link says what kind of evidence it is. Architecture does not author that evidence and does not certify it. It records that it has been received.

## 2. What each rung requires

A rung is checked from the artefacts' front matter. The checks below are the ones a derivation tool can make without judgement, and they are the contract `aaa-rung` implements. Each rung also carries a part that needs a reviewer, listed separately, because a tool that pretends to check prose gives false confidence.

| Rung | Checked from the artefacts | Checked by a reviewer |
|---|---|---|
| R1 | A capability document exists with `level`; `parent` for L2 and L3; a purpose, as `description` or a Purpose section; and `required_by_outcomes` non-empty or `demand_assumption` set | That the purpose is stated in business terms, and that an assumed demand is plausible |
| R2 | `realised_by_abbs` is non-empty; each named ABB document exists and declares `requires`, which may be an empty list; and at least one consideration `affects` the capability or one of its ABBs, or the capability declares `open_questions: none` | That the non-goals are written down, and that no credible open question has been left out |
| R3 | Every consideration affecting the capability or its ABBs is `resolved`, and its `resolved_by` decision record has status `accepted` or `active`. A pattern whose `realises` names the capability is logical, with every box an ABB, or is already physical | That each decision record cites the evidence that settled it |
| R4 | Every ABB is realised by an SBB whose status is `accepted` or `active`. A realising pattern is physical, with every box an SBB, and has a reference of type `cost-model` | That interfaces carry contracts, and that a team could build from the pattern without asking |
| R5 | A physical realising pattern has a reference of type `evidence` | That the evidence exercises the pattern end to end against the capability's criteria |
| R6 | The capability's `status` is `active`, and the capability or its realising pattern has a reference of type `runbook` | That an owner is named and a measure is reported against the outcome |

A consideration with status `withdrawn` affects nothing and is ignored. A decision record that is `superseded`, `deprecated` or `retired` no longer resolves anything, which is how a rung is lost when a decision is overturned without a replacement.

### 2.1 A pattern's abstraction

A pattern's abstraction is derived from the identifiers in its Building Blocks or Required Building Blocks table, never declared. The rule is the one the `model` skill applies:

| Boxes | Abstraction |
|---|---|
| All local roles (a plain number such as `07 Gateway`) | conceptual |
| ABBs, with or without local roles | logical |
| All SBBs | physical |
| Anything else, including any box whose kind is unknown | mixed |

External context rows, marked `external` or `context` in a Kind column, are outside the pattern's scope and do not count. R3 asks for more than a logical abstraction: every box must be an ABB, because a local role is a building block that has not been named yet, and an unnamed block cannot have its questions settled. A physical pattern also satisfies R3's pattern check, since a pattern that has been refined to products has passed through its logical form; the refinement does not cost the capability its R3.

A pattern is tied to the capabilities it realises by `realises: [CAP-NNN]` in its front matter. A pattern that realises nothing does not count toward any capability's rung.

## 3. Rules

### 3.1 The highest rung with every rung below it evidenced

A capability sits on the highest rung for which it, and every rung below it, has evidence. A capability with a physical pattern and a cost model but no accepted decision for an open question is R2, not R4.

### 3.2 Building ahead does not skip rungs

Rungs are not skipped by building ahead. Running code for a capability that has no capability document is R0, and the code is latent evidence: it will count toward R5 once R1 to R4 exist beneath it.

This is deliberate. A working experiment with no stated capability, no named building blocks and no recorded decisions cannot be reused, extended or handed over, and supplying those is exactly what the lower rungs are for. A derivation tool reports latent evidence (a rung whose own check passes above the rung held) so that it is visible, but never counts it.

### 3.3 A rung per flow, and the capability at its lowest flow

A flow is a named path through a capability that someone would recognise as a job being done, such as taking an order or answering a question. Where a capability's flows move at different speeds, a rung is claimed per flow, and the capability as a whole sits on the rung of its lowest flow.

R1 and R2 belong to the capability, so every flow shares them. From R3 upward, a flow is evidenced by the patterns that realise the capability and either name the flow in their `flows` list or name no flows at all, in which case they cover every flow.

### 3.4 Rungs are lost when evidence stops being true

A rung is held only while its evidence is true. A decision that is superseded without a replacement, an SBB that is deprecated, or a pattern whose boxes no longer match what was built, drops the capability to the rung that still holds. A rung is never recorded as permanently achieved.

### 3.5 Derived wins over recorded

A capability may record a rung on each flow in `flows[].rung`, for readers who do not run tools. Where a derived rung is available, it is the one that counts. A recorded rung above the derived one is a claim without evidence and is reported as such. A recorded rung below the derived one is stale and should be raised.

## 4. What the ladder is not

It is not capability maturity. Maturity (0 to 5, None to Optimising) measures how well a capability performs once it operates. The ladder measures how completely it has been defined and made ready. The two meet at R6: maturity only means something for a capability that is in service, and before that the ladder is the measure that moves.

It is not `lifecycle_state`. That field (baseline, in-flight, target, retired) says which version of an artefact is meant. A target-state pattern can be at R3 while the baseline it replaces is at R6.

It is not `status`. An artefact's status is its own review lifecycle. The ladder is a claim about a capability that is read from the status of several artefacts together.

It is not a gate. Nothing stops work on a capability at a low rung. The ladder only says what the work has and has not yet made true.

The ontology's crawl, walk, run and fly maturity horizons are bands of this ladder, not a separate scale. The mapping is in the [ontology specification](../ontology/SPECIFICATION.md#42-capability).

## 5. Recording and deriving

| Where | What |
|---|---|
| Capability front matter | `flows[]`, each with `id`, `name`, `description` and an optional recorded `rung`. `open_questions: none` when there are no considerations to list. `demand_assumption` when no outcome is linked yet |
| Consideration (`CN-NNN`) | One open question, its options, the criteria that decide it, and the decision record that resolves it |
| Pattern front matter | `realises: [CAP-NNN]`, optionally `flows: [<flow id>]`, and `references` of type `cost-model` and `evidence` |
| `aaa-rung` | Derives each capability's rung, and each flow's, from the above, and names the artefact that blocks the next rung |

## 6. How it is used

| Where | How |
|---|---|
| A piece of architecture work | Advances one capability area, and states its movement per flow, from one rung to another |
| A planning period | Opens with the grid of each capability area in scope, the rung it starts on, and the rung it is committed to reach |
| Deliverable types | Each type names the artefact kind it produces and so the rung it evidences. See [AAW Work Seam](../aaw-work-seam.md#planning-deliverables-and-rungs) |
| Capability document | Records its flows and their rungs alongside its maturity |

## AI Agent Self-Verification Checklist

1. [ ] **Rung from evidence.** Is every rung stated backed by the artefacts in §2, with every lower rung also evidenced?
2. [ ] **No skipped rungs.** Has running code or a physical pattern been counted only where R1 to R3 hold beneath it?
3. [ ] **Per flow.** Where flows are declared, is the capability's rung the lowest of its flows?
4. [ ] **Not maturity.** Is the rung kept separate from the maturity score and from `lifecycle_state`?
5. [ ] **Receipt, not authorship.** Are R5 and R6 evidenced by links to implementation evidence, not by architecture documents describing it?
6. [ ] **Derived first.** Where `aaa-rung` is available, does a recorded rung agree with the derived one?
