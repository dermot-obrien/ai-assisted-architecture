<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Agent Operating Model"
classification: internal
version: 0.1.0
status: draft
created: 2026-06-05
last_modified: 2026-06-05
owner: "Architecture Team"
provenance:
  origin: ai-generated
  authored_by: claude-opus-4.8
  review_state: ai-raw
triggers:
  - "An agent is about to change a catalogued artefact or the code that realises it"
  - "Defining CI gates and human-escalation rules for AI-authored change"
  - "Assigning capability scopes to agent roles"
---

# Agent Operating Model

Defines the loop every change runs through when authored by an agent, the guardrail tiers
that bound blast radius, and the rule for when a human is pulled in. Implements **P2**
(verify, don't review), **P3** (blast radius), and **P7** (human budget).

> **Scope:** this is the **builder** loop (build-time governance). Runtime agents — deployed
> services doing functional work — are governed on the *run-time* plane with the same
> principles applied at action time. See [`agent-types.md`](agent-types.md). The guardrail
> tiers and capability scoping below apply to both planes.

## The loop: author → verify → reconcile

The stages are **distinct** agents (or distinct invocations) with distinct prompts —
separation is what makes verification adversarial rather than self-confirming.

```
┌── AUTHOR ───────────────┐  ┌── VERIFY ───────────────────┐  ┌── RECONCILE ─────────┐
│ 1 query the catalog/     │  │ 4 adversarial verifier:     │  │ 7 merge              │
│   ontology graph         │  │   try to REFUTE the change  │  │ 8 standing loops     │
│ 2 edit the ARTEFACT/     │─▶│   - invariants pass?        │─▶│   confirm catalog ==  │
│   contract first         │  │   - contract honoured?      │  │   reality            │
│ 3 generate code to       │  │   - guardrails intact?      │  │   (reconciliation.md)│
│   satisfy it             │  │   - provenance valid?       │  └──────────────────────┘
└──────────────────────────┘  │ 5 blast-radius? escalate ───┼─▶ human (P7)
                             │ 6 verdict + provenance      │
                             └─────────────────────────────┘
```

### Author stage
The authoring agent **never starts from code**. It (1) queries the catalogued model for
intent, dependents, and the invariants it must preserve; (2) edits the **artefact/contract
first** (P1); (3) generates the implementation as a projection; (4) stamps the
[provenance](provenance.md) envelope with `review_state: ai-raw`.

### Verify stage (adversarial — the heart of P2)
A **separate** agent is prompted to *refute*: "default to rejecting unless you can prove
this is correct." It runs the executable checks (invariants, contract, consumer-driven
tests, guardrails) and forms a verdict. For higher-stakes changes, run **N independent
verifiers** with **diverse lenses** (correctness / safety / does-it-reproduce) and require a
majority. A change that survives refutation is promoted to `review_state: ai-verified`;
otherwise it returns to the author with the refutation.

### Reconcile stage
On merge, the [reconciliation](reconciliation.md) loops confirm the live system still
matches the model and open drift work if not.

## Guardrail tiers (blast radius — P3)

A guardrail an agent can edit is not a guardrail. Tier every guardrail by *who can change
it and how reversibly*. Guardrails are catalogued as ontology `Standard` artefacts with
`standard_type: platform_guardrail`; the agent-native overlay adds the **tier** and
**change-path**:

| Tier | Meaning | Enforced where | Change path |
|---|---|---|---|
| **T0** | Immutable invariant | policy layer **outside** any deployable | `human-only` (recorded Decision Record) |
| **T1** | Capital / irreversible-effect limit | externally-managed config + an external check the runtime must call | `human-approved` before merge |
| **T2** | Behavioural guardrail | agent-editable code, but covered by an **invariant** | `agent`, if the invariant still passes |
| **T3** | Tunable | agent-editable config | `agent` |

The rule: **T0/T1 limits live where an agent cannot rewrite them.** A change touching a
T0/T1 artefact is blocked by CI unless its provenance reaches the required `review_state`.

**Where the tier is recorded.** Reference guardrails by their ontology id
(`standard_P<platform>_<name>`). The tier travels on the guardrail reference in the agent
profile (`guardrails[].tier` in `agent-profile.schema.json`) and is stated in the `Standard`'s
`description`. The modernisation-ontology `Standard` entity has no `tier` field today; a
first-class `agent_native_tier` field is a candidate ontology extension (until then, the
profile reference is the machine-readable source of the tier).

## Capability-scoped agents

An agent is granted only the capabilities its task needs (least privilege). Critically:
**no role holds two capabilities that together could change a T0/T1 limit and ship it
without crossing a human approval** — separation of duties that bounds the worst case.

| Role | Scope | Reads | Writes |
|---|---|---|---|
| **Author** | one context's artefacts + code | catalog, contracts | artefact, code, provenance |
| **Verifier** | read-only + test execution | the change, contracts, invariants | verdict + provenance |
| **Reconciler** | read-only + work-item creation | catalog, contracts, runtime | drift work items |
| **Deployer** | deploy only | release config | deployment, version stamp |

## When a human is pulled in (P7)

Escalation triggers are **mechanical**, keyed to reversibility — not "per change by
default":

| Trigger | Human role |
|---|---|
| Change touches a T0 invariant or T1 limit | **approve** before merge |
| Verifiers disagree (no majority) | **adjudicate** |
| Action is irreversible (data deletion, production reset, capital event) | **initiate** — agents cannot |
| Reconciliation raises drift the reconciler can't safely auto-fix | **decide** the fix |
| Everything else (reversible, invariants hold, verifiers agree) | **none** — merge proceeds |

The default is *no human*. Reserving review for the irreversible keeps it sharp exactly
where it matters.

## Relationship to the AAW work seam

This model governs *how a change is executed*; the [AAW work seam](../aaw-work-seam.md)
governs *how it is classified and recorded*. A T0/T1 change produces a **Decision Record**;
a cross-cutting change revises a Capability/ABB/SBB. The operating model's human-approval
step and the work seam's Decision Record are the same governance event seen from two sides.
