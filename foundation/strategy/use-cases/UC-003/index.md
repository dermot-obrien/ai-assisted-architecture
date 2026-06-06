---
id: UC-003
kind: use-case
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "UC-003 Real-time Policy Decision Evaluation"
---

# UC-003 Real-time Policy Decision Evaluation

| Property | Value |
| :--- | :--- |
| **Use Case ID** | `UC-003` |
| **Primary Actor**| System Component |
| **Parent Outcome**| [OC-004](../../outcomes/OC-004/), [OC-001](../../outcomes/OC-001/) |
| **Status** | `draft`|

## 1. Scenario
A building block receives a request to export data. Before proceeding, it calls the Policy Decision Service. The service evaluates the identity, the data classification, and current risk posture.

## 2. Success Criteria
- Evaluation result returned in < 10ms.
- Decision log captured in Observability context.

## 3. Realisation
- **[ABB-003 Governance & Policy Enforcement](../../../building-blocks/architecture-building-blocks/ABB-003/)**
