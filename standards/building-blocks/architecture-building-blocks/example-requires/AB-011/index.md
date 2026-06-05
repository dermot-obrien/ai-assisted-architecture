<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
$schema: ../../../../schemas/v1.1.0/abb.schema.json
id: AB-011
kind: abb
title: "AB-011 Reasoning Engine"
short_name: "Reasoning"
description: "The logical building block that turns context into a plan or decision — the model and inference loop an agent reasons with."

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
  - { id: "I1", direction: "in",  type: "request",  description: "Reasoning request (context + available actions)" }
  - { id: "I2", direction: "out", type: "callback", description: "Chosen action / plan with rationale" }

mandatory_subabbs: [iam, observability, governance]
cross_cutting: false

tags: [ai, agent, example, requires]
sidebar_label: "AB-011 Reasoning Engine"
sidebar_position: 11

provenance:
  origin: ai-generated
  authored_by: claude-opus-4-8
  review_state: ai-raw
---

# AB-011 Reasoning Engine

> **Minimal example** — one of the four ABBs required by [AB-010 AI Agent Platform](../AB-010/).
> Shows the *target* of a `requires` entry (`cardinality: "1"`). Kept deliberately brief.

## 1  Purpose

The Reasoning Engine is the logical component that, given a goal and the current context, decides what to do next — it plans, selects an action, and explains its choice. It is the "brain" an AI Agent Platform reasons with, kept as a separate ABB so the agent's orchestration is independent of any particular model or inference strategy.

## 2  Building block

### 2.2  Fundamental functionality

- **Inference Loop.** Produces the next action or plan from the supplied context.
- **Rationale Generator.** Emits the reasoning behind each decision for audit.

### 2.5  Identity & Access Management

- Runs under a workload identity; callers are scoped to the reasoning contract.

### 2.6  Observability

- Emits token usage, latency, and decision traces.

### 2.7  Governance & Policy Enforcement

- Model selection and prompt changes are governed Decision Records.

## 3  Interfaces

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Agent Platform → Reasoning Engine | Request | Reasoning request (context + available actions). |
| **I2** | Reasoning Engine → Agent Platform | Callback | Chosen action / plan with rationale. |

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1.0 | 2026-06-06 | Initial Draft | Minimal example created as a `requires` target of AB-010. |
