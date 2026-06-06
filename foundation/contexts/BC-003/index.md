---
id: BC-003
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-003 Governance & Policy Bounded Context"
governance_zone: foundation
part_of: PL-003
subdomain_kind: generic
contains:
  - ABB-003
realises_capabilities:
  - CAP-005
  - CAP-007
ubiquitous_language:
  - term: Policy
    definition: A machine-readable rule set defining intended state or behaviour.
  - term: Decision
    definition: The result of a policy evaluation (Permit, Deny, etc.).
  - term: Enforcement
    definition: The application of a decision at a technical control point.
---

# BC-003 Governance & Policy Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-003` |
| **Context Name** | Governance & Policy |
| **Platform** | [PL-003 Governance & Compliance](../../platforms/PL-003/) |
| **Owner Team** | Governance & Compliance Office |
| **Subdomain Type**| Generic |

## 1. Purpose
The **Governance & Policy Bounded Context** codifies organisational rules into machine-executable logic. It separates the *decision* of what is allowed from the *enforcement* of that decision.

## 2. Ubiquitous Language
- **Policy**: A machine-readable rule set defining intended state or behaviour.
- **Decision**: The result of a policy evaluation (Permit, Deny, etc.).
- **Enforcement**: The application of a decision at a technical control point.

## 3. Contained ABBs
- **[ABB-003 Governance & Policy Enforcement](../../building-blocks/architecture-building-blocks/ABB-003/)**

## 4. Realised Capabilities
- **[CAP-005 Policy-Based Access Control](../../capabilities/CAP-005/)**
- **[CAP-007 Compliance Evidence & Reporting](../../capabilities/CAP-007/)**

