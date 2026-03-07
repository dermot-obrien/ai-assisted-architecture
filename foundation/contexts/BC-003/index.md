---
title: "BC-003 Governance & Policy Bounded Context"
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
- **[AB-003 Governance & Policy Enforcement](../../building-blocks/architecture-building-blocks/AB-003/)**

## 4. Realised Capabilities
- **[CAP-005 Policy-Based Access Control](../../capabilities/CAP-005/)**
- **[CAP-007 Compliance Evidence & Reporting](../../capabilities/CAP-007/)**
