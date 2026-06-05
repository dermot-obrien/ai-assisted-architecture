<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
$schema: ../../../../schemas/v1.1.0/abb.schema.json
id: AB-013
kind: abb
title: "AB-013 Agent Memory"
short_name: "Memory"
description: "The logical building block that gives an agent state across turns — storing, retrieving, and summarising prior context."

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

domains: [data, application]
interfaces:
  - { id: "I1", direction: "in",  type: "query",   description: "Memory read (retrieve relevant prior context)" }
  - { id: "I2", direction: "in",  type: "request", description: "Memory write (persist a turn / fact)" }

mandatory_subabbs: [iam, observability, governance]
cross_cutting: false

tags: [ai, agent, example, requires]
sidebar_label: "AB-013 Agent Memory"
sidebar_position: 13

provenance:
  origin: ai-generated
  authored_by: claude-opus-4-8
  review_state: ai-raw
---

# AB-013 Agent Memory

> **Minimal example** — one of the four ABBs required by [AB-010 AI Agent Platform](../AB-010/).
> Shows an **optional** dependency (`cardinality: "0..1"`): stateful agents need it, reactive
> ones do not. Kept brief.

## 1  Purpose

Agent Memory is the logical component that lets an agent remember. It persists turns, facts, and summaries, and retrieves the relevant slice of that history into the agent's working context on demand. It is optional: a purely reactive agent that treats every request independently does not require it, which is why AB-010 declares it with `cardinality: "0..1"`.

## 2  Building block

### 2.2  Fundamental functionality

- **Store.** Persists turns, facts, and summaries.
- **Retriever.** Surfaces the relevant prior context for the current step.
- **Summariser.** Compacts long histories to fit the reasoning context window.

### 2.5  Identity & Access Management

- Memory is partitioned per agent identity and per principal; no cross-tenant reads.

### 2.6  Observability

- Logs reads and writes with classification labels.

### 2.7  Governance & Policy Enforcement

- Retention and right-to-erasure policies enforced on the store.

## 3  Interfaces

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Agent Platform → Agent Memory | Query | Retrieve relevant prior context. |
| **I2** | Agent Platform → Agent Memory | Request | Persist a turn / fact. |

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1.0 | 2026-06-06 | Initial Draft | Minimal example created as an optional `requires` target of AB-010. |
