---
id: ABB-003
kind: abb
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "ABB-003 Governance & Policy Enforcement"
sidebar_label: "ABB-003 Governance & Policy Enforcement"
sidebar_position: 3
governance_zone: foundation
category: Compliance
short_name: Gov
realises_capabilities:
  - CAP-005
part_of: BC-003
interfaces:
  - id: I1
    direction: in
    type: callback
    description: Request to evaluate a specific context against a policy set.
  - id: I4
    direction: bidirectional
    type: request
    description: Request to pull latest policies from the distribution service.
  - id: I8
    direction: out
    type: event
    description: Streaming of evaluation results for audit.
domains:
  - application
mandatory_subabbs:
  - iam
  - observability
  - governance
---

# ABB-003 Governance & Policy Enforcement

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **ABB ID** | `ABB-003` | Unique identifier. |
| **ABB Name** | Governance & Policy Enforcement | Human-readable name. |
| **Short Name** | Gov | Used in diagrams. |
| **Bounded Context**| [Governance & Policy](../../../contexts/governance-context.md) | Owning technical boundary. |
| **Realizes Capability**| [CAP-005 Policy-Based Access Control](../../../capabilities/CAP-005/) | Primary business ability. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Category** | `Compliance` | Logical grouping. |


## 1  Purpose

The **Governance & Policy Enforcement ABB** provides the logical framework for decoupling policy logic from application code. It defines how organisational rules are authored, distributed, and evaluated in real-time to ensure consistent compliance across the architecture.


## 2  Building block

### 2.1  Component Diagram

The diagram below shows the logical components for policy authoring, distribution, and the Policy Decision Point (PDP).

![ABB-003 Governance & Policy Enforcement Component Diagram](./components.png)

### 2.2  Fundamental functionality

- **Policy Decision Point (PDP).** Evaluates requests against a set of policies and returns a decision.
- **Policy Distribution.** Serves compiled policy sets to distributed decision points.
- **Evidence Collection.** Captures structured logs of every policy decision for audit and compliance.


## 3  Interfaces

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Consumer → Gov | Decision Req | Request to evaluate a specific context against a policy set. |
| **I4** | PDP → Store | Sync | Request to pull latest policies from the distribution service. |
| **I8** | Gov → Obs | Decision Log | Streaming of evaluation results for audit. |


## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | ABB-003 Governance & Policy Enforcement ABB created. |

