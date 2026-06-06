---
id: OC-001
kind: outcome
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "OC-001 Zero Trust Workload Posture"
governance_zone: foundation
kpi: 100% of internal service calls are authenticated via workload identity tokens.
business_rationale: Reduces the blast radius of a potential compromise by ensuring every interaction is explicitly verified.
owned_by_platform: PL-001
requires_capabilities:
  - CAP-004
  - CAP-005
---

# OC-001 Zero Trust Workload Posture

| Property | Value |
| :--- | :--- |
| **Outcome ID** | `OC-001` |
| **Name** | Zero Trust Workload Posture |
| **Measure** | 100% of internal service calls are authenticated via workload identity tokens. |
| **Status** | `draft`|

## 1. Definition
Achieve a state where no service or agent is trusted by default, regardless of its network location.

## 2. Business Rationale
Reduces the blast radius of a potential compromise by ensuring every interaction is explicitly verified.

## 3. Traceability
- **[CAP-004 Identity Lifecycle Management](../../../capabilities/CAP-004/)**
- **[CAP-005 Policy-Based Access Control](../../../capabilities/CAP-005/)**

