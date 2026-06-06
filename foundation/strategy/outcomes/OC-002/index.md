---
id: OC-002
kind: outcome
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "OC-002 Credential-less Infrastructure"
governance_zone: foundation
kpi: Reduction in secrets stored in vault/configuration by 90%.
business_rationale: Removes the risk of secret leakage and simplifies credential rotation.
owned_by_platform: PL-001
requires_capabilities:
  - CAP-004
---

# OC-002 Credential-less Infrastructure

| Property | Value |
| :--- | :--- |
| **Outcome ID** | `OC-002` |
| **Name** | Credential-less Infrastructure |
| **Measure** | Reduction in secrets stored in vault/configuration by 90%. |
| **Status** | `draft`|

## 1. Definition
Elimination of long-lived static secrets (API keys, passwords) from the environment.

## 2. Business Rationale
Removes the risk of secret leakage and simplifies credential rotation.

## 3. Traceability
- **[CAP-004 Identity Lifecycle Management](../../../capabilities/CAP-004/)**

