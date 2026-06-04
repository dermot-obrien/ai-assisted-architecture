<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Continuous Reconciliation Standard"
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
  - "Standing up drift detection between the catalog and the running system"
  - "Deciding what runs at merge (gate) vs continuously (loop)"
---

# Continuous Reconciliation Standard

Implements **P9** (drift is the enemy). Adds **standing loops** that prove the catalogued
model equals reality and open work when it doesn't — extending the *static* `validate` /
`consolidate` ontology gate into *runtime* drift control.

## Why

Agents generate far faster than humans, so model-vs-reality drift accelerates beyond what
periodic manual cleanup can absorb. The answer is not more careful writing; it is loops that
compare two sources of truth on a schedule and raise a finding when they diverge.

## The four reconciliations

Each is a scheduled job (a reconciler agent or check) comparing two sources:

| # | Reconciliation | Source A | Source B | Drift means |
|---|---|---|---|---|
| R1 | **Catalog ↔ deployed** | the `service` / `deployment-node` catalog | the actually-running inventory | a service runs with no catalog entry, or a catalogued service isn't deployed |
| R2 | **Contract ↔ implementation** | the `api` + event schemas + invariants | live endpoints / consumed-event shapes | the running service violates its own published contract |
| R3 | **Graph ↔ code** | the catalogued relations (golden thread) | the actual module/dependency structure | a relation is claimed that the code doesn't have, or vice versa |
| R4 | **Docs ↔ behaviour** | runbooks, READMEs, recorded facts | observed runtime behaviour | a documented fact is now false (a port, schedule, limit) |
| R5 | **Ontology ↔ frontmatter catalog** | modernisation-ontology entities | v1.1.0 frontmatter artefacts / agent profiles | a `Component`/`Standard` and its frontmatter twin (or an agent profile and its ontology `Component`) disagree on owner / capability / guardrail. The ontology is authoritative for governance queries; the frontmatter catalog for agent authorship. |

## Gate vs loop — the division of labour

- **Gates** (schema validation, contract tests, provenance) run at *merge* and prevent bad
  changes entering.
- **Reconciliation loops** run *continuously* and catch drift gates can't see — runtime
  divergence, deployments that bypassed CI, facts that went stale because the world changed
  rather than the code.

Both are necessary: gates stop you shipping drift; reconciliation stops drift accumulating
from everything gates don't see.

## Drift becomes work, automatically

A drift finding is not a log line — it is a **provenance-stamped work item** opened against
the owning artefact (seaming to AAW). The reconciler: (1) detects the divergence,
(2) classifies it (which reconciliation, which artefact, which guardrail tier), (3) opens a
work item with the diff and a proposed fix, and (4) for low-tier drift, may dispatch an
authoring agent to fix it directly — which then runs the normal author → verify loop.

This makes the system **self-healing toward truth**: the rate of healing scales with the
same agent capacity that causes the drift.

## The catalog is the reconciliation substrate

R1 reads the `service` / `deployment-node` artefacts (owner, lifecycle, contracts, SLO,
dependencies). Those artefacts are simultaneously: the A-side of R1, the index a portal
renders for humans, and the inventory an agent queries to find a service's owner, contracts,
and blast-radius before touching it. Keeping them accurate is therefore load-bearing for
both discovery and reconciliation.
