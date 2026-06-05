<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
$schema: ../../../../schemas/v1.1.0/abb.schema.json
id: AB-012
kind: abb
title: "AB-012 Tool Integration"
short_name: "Tools"
description: "The logical building block through which an agent acts on the world — discovering, invoking, and normalising the result of external tools."

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
  - { id: "I1", direction: "in",  type: "request", description: "Tool invocation request (name + arguments)" }
  - { id: "I2", direction: "out", type: "request", description: "Call to the backing external system" }
  - { id: "I3", direction: "out", type: "callback", description: "Normalised tool result" }

mandatory_subabbs: [iam, observability, governance]
cross_cutting: false

tags: [ai, agent, example, requires]
sidebar_label: "AB-012 Tool Integration"
sidebar_position: 12

provenance:
  origin: ai-generated
  authored_by: claude-opus-4-8
  review_state: ai-raw
---

# AB-012 Tool Integration

> **Minimal example** — one of the four ABBs required by [AB-010 AI Agent Platform](../AB-010/).
> Shows a `cardinality: "1..n"` `requires` target (an agent has one or more tools). Kept brief.

## 1  Purpose

Tool Integration is the logical component that lets an agent *act*: it exposes a catalogue of callable tools, validates and dispatches invocations to the backing external systems, and normalises results back into a form the agent can reason over. Separating it from the agent platform means tools can be added, scoped, and governed independently of the agent loop.

## 2  Building block

### 2.2  Fundamental functionality

- **Tool Registry.** Describes available tools and their contracts.
- **Invocation Broker.** Validates arguments, brokers credentials, and dispatches the call.
- **Result Normaliser.** Returns a consistent result shape regardless of backing system.

### 2.5  Identity & Access Management

- Brokers per-call credentials; the agent never holds the backing system's secrets.

### 2.6  Observability

- Logs every invocation, its arguments class, and outcome.

### 2.7  Governance & Policy Enforcement

- Tool availability and scopes are policy-controlled per agent identity.

## 3  Interfaces

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Agent Platform → Tool Integration | Request | Tool invocation request (name + arguments). |
| **I2** | Tool Integration → External system | Request | Call to the backing external system. |
| **I3** | Tool Integration → Agent Platform | Callback | Normalised tool result. |

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1.0 | 2026-06-06 | Initial Draft | Minimal example created as a `requires` target of AB-010. |
