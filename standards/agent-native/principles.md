<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Agent-Native Principles"
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
  - "Adopting the agent-native operating model in a workspace"
  - "Deciding whether a change needs a human or can be agent-verified"
  - "Designing CI gates for an AI-authored architecture"
---

# Agent-Native Principles

The nine commitments an agent-native workspace upholds. Each is a rule, with the failure
mode it prevents and the framework mechanism that enforces it (enforcement is the point —
an unenforced principle is decoration).

---

## P1 — The catalogued artefact is the source of truth; code is derived

The durable artefact is the **catalogued model element and its contract** (an `api`,
`service`, `Interface`, plus invariants). The implementation is a regenerable projection,
verified against it on every change.

- **Prevents:** drift where docs describe one behaviour and code does another and nobody
  can say which is correct.
- **Enforced by:** [executable contracts](executable-contracts.md) — a merge fails if the
  implementation violates its contract or an invariant.

## P2 — Verify, don't review (zero-trust + adversarial)

Agents fail differently from humans: confident hallucination, plausible-but-wrong, silent
drift. Trust nothing; verify everything, ideally with a **second agent prompted to refute
the first**. A change is accepted because it survived refutation, not because it looked
reasonable.

- **Prevents:** plausible-but-wrong changes surviving on appearance.
- **Enforced by:** the verify stage of the [operating model](operating-model.md).

## P3 — Blast-radius containment is the primary design axis

Agents make sweeping changes fast and can be wrong confidently. Constrain damage
structurally: small, independently-reversible units; capability-scoped agents; and **hard
limits enforced outside any agent-editable artefact**.

- **Prevents:** a single bad change cascading into an irreversible event.
- **Enforced by:** guardrail tiers in the [operating model](operating-model.md); the limit
  lives where the agent cannot rewrite it.

## P4 — Provenance on every artefact and change

"Who decided this and why" must be machine-captured lineage, not tribal memory. Origin,
authoring agent, model, task reference, review state, and verifier are recorded.

- **Prevents:** an unauditable change history.
- **Enforced by:** the [provenance](provenance.md) envelope; CI rejects artefacts/commits
  without a valid envelope.

## P5 — Machine-checkable beats human-readable

Every boundary, relation, and rule must be something a machine can validate. Prose is
allowed *in addition*, never *instead*. "Convention enforced by hoping" becomes "convention
enforced by a gate."

- **Prevents:** rules that exist only as documentation an agent can silently ignore.
- **Enforced by:** the JSON Schemas (`standards/schemas/`), the ontology validator, and the
  reconciliation loops.

## P6 — Standardize hard; uniformity over autonomy

Humans benefit from some tooling autonomy (taste, motivation). Agents have neither —
heterogeneity is pure cost. One language, one framework, one deploy shape per workspace.
Deviation requires a recorded, catalog-linked reason.

- **Prevents:** an N-way explosion of variants an agent must learn before acting safely.
- **Enforced by:** paved-road conventions + a tech-radar `hold` list (a `Pattern`/`Standard`
  in the catalog).

## P7 — The human-in-the-loop budget is spent only on the irreversible

Human attention is the scarcest resource. Reserve it entirely for **irreversible or
high-stakes** actions; spend none on reversible changes (which trains humans to approve
without reading).

- **Prevents:** humans becoming a rubber-stamp bottleneck.
- **Enforced by:** escalation triggers keyed to reversibility tiers in the
  [operating model](operating-model.md).

## P8 — Boundaries are sized for context-window retrieval and independent verification

A bounded context must be small enough to **load the relevant slice into an agent's context
and verify it in isolation**. This is the agent-native restatement of the Thinnest Viable
Platform: not "small enough for a team," but "small enough to prove correct alone."

- **Prevents:** contexts too large for any agent to hold or verify, forcing
  partial-context guesses.
- **Enforced by:** the boundary rule (a context depends only on another context's published
  contract, never its internals) + verification scoping in CI.

## P9 — Drift is the enemy; reconciliation is continuous

Agents generate far faster than humans, so model-vs-reality drift accelerates. The answer
is **standing automated loops** that prove the catalog matches reality and open work when
it doesn't — not more careful writing.

- **Prevents:** the model decaying into fiction faster than humans can re-sync it.
- **Enforced by:** [continuous reconciliation](reconciliation.md).

---

## Principle → mechanism map

| Principle | Primary mechanism |
|---|---|
| P1 Artefact is truth | executable-contracts |
| P2 Verify don't review | operating-model (verify stage) |
| P3 Blast radius | operating-model (guardrail tiers) |
| P4 Provenance | provenance envelope |
| P5 Machine-checkable | schemas + validators |
| P6 Standardize hard | paved roads + tech radar |
| P7 HITL budget | operating-model (escalation) |
| P8 Context sizing | boundary rule + CI scoping |
| P9 Reconciliation | reconciliation loops |
