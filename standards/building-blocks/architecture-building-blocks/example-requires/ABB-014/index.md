<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
$schema: ../../../../schemas/v1.1.0/abb.schema.json
id: ABB-014
kind: abb
title: "ABB-014 Safety & Guardrails"
short_name: "Guardrails"
description: "The logical building block that bounds what an agent may do — checking every proposed action against safety policy before it is dispatched."

version: 0.1.0
status: draft
created: 2026-06-06
last_modified: 2026-06-06
last_modified_by: claude-opus-4-8

lifecycle_state: baseline
owner: "Agent Platform Team"
classification: internal
governance_zone: application

category: "AI & Autonomous Systems"

part_of: BC-010
realises_capabilities: [CAP-040]
realised_by: []

domains: [application, technology]
interfaces:
  - { id: "I1", direction: "in",  type: "request",  description: "Action-check request (proposed action + context)" }
  - { id: "I2", direction: "out", type: "callback", description: "Verdict: allow / deny / escalate" }

mandatory_subabbs: [iam, observability, governance]
cross_cutting: false

tags: [ai, agent, example, requires]
sidebar_label: "ABB-014 Safety & Guardrails"
sidebar_position: 14

provenance:
  origin: ai-generated
  authored_by: claude-opus-4-8
  review_state: ai-raw
---

# ABB-014 Safety & Guardrails

> **Minimal example** — one of the four ABBs required by [ABB-010 AI Agent Platform](../ABB-010/).
> Shows a hard dependency (`cardinality: "1"`): a production agent must have a guardrail engine.
> Kept brief.
>
> Note: this is a *domain* dependency the agent platform `requires`, distinct from the
> cross-cutting `governance` sub-ABB that every ABB embeds via `mandatory_subabbs`. Guardrails
> here decide *agent actions*; the governance sub-ABB governs the *building block itself*.

## 1  Purpose

Safety & Guardrails is the logical component that bounds agent behaviour. Before the agent platform dispatches any action, it submits the proposed action to this ABB, which evaluates it against safety policy (allow-lists, exposure limits, prohibited operations, human-approval thresholds) and returns a verdict. It is what makes an autonomous agent safe to run in production, which is why ABB-010 requires it with `cardinality: "1"`.

## 2  Building block

### 2.2  Fundamental functionality

- **Policy Evaluator.** Decides allow / deny / escalate for each proposed action.
- **Escalation Router.** Routes actions above a threshold for human approval.
- **Constraint Catalogue.** Holds the allow-lists, limits, and prohibited operations.

### 2.5  Identity & Access Management

- Evaluates under the requesting agent's identity; verdicts are attributable.

### 2.6  Observability

- Records every check, verdict, and escalation for audit.

### 2.7  Governance & Policy Enforcement

- The guardrail policy set is itself a governed artefact; changes are Decision Records.

## 3  Interfaces

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Agent Platform → Safety & Guardrails | Request | Action-check request (proposed action + context). |
| **I2** | Safety & Guardrails → Agent Platform | Callback | Verdict: allow / deny / escalate. |

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1.0 | 2026-06-06 | Initial Draft | Minimal example created as a hard `requires` target of ABB-010. |
