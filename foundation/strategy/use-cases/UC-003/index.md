---
id: UC-003
kind: use-case
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "UC-003 Real-time Policy Decision Evaluation"
governance_zone: foundation
primary_actor: System Component
supports_outcome: OC-004
preconditions:
  - The relevant Rego policies are published and distributed to the decision point.
  - The calling building block is integrated with the policy enforcement adapter.
  - Identity and data-classification context are available to include in the decision input.
success_criteria:
  - Evaluation result returned in < 10ms.
  - Decision log captured in Observability context.
realised_by_abbs:
  - ABB-003
---

# UC-003 Real-time Policy Decision Evaluation

| Property | Value |
| :--- | :--- |
| **Use Case ID** | `UC-003` |
| **Primary Actor**| System Component |
| **Parent Outcome**| [OC-004](../../outcomes/OC-004/) |
| **Status** | `draft`|

## 1. Scenario
A building block receives a request to export data. Before proceeding, it calls the Policy Decision Service. The service evaluates the identity, the data classification, and current risk posture.

## 2. Pre-conditions
- The relevant Rego policies are published and distributed to the decision point.
- The calling building block is integrated with the policy enforcement adapter.
- Identity and data-classification context are available to include in the decision input.

## 3. Success Criteria
- Evaluation result returned in < 10ms.
- Decision log captured in Observability context.

## 4. Realisation
- **[ABB-003 Governance & Policy Enforcement](../../../building-blocks/architecture-building-blocks/ABB-003/)**

