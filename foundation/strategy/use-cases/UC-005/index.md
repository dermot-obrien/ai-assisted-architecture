---
id: UC-005
kind: use-case
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "UC-005 Automated Workload Scheduling"
governance_zone: foundation
primary_actor: Deployment Pipeline
supports_outcome: OC-012
preconditions:
  - The workload declares its resource requirements and affinity/anti-affinity constraints.
  - Compliant compute nodes with available quota exist in the target environment.
  - The deployment pipeline is authorised to schedule workloads.
success_criteria:
  - Workload is placed on optimal hardware within < 30 seconds.
  - High availability is maintained through automated multi-zone distribution.
realised_by_abbs:
  - ABB-006
---

# UC-005 Automated Workload Scheduling

| Property | Value |
| :--- | :--- |
| **Use Case ID** | `UC-005` |
| **Primary Actor**| Deployment Pipeline |
| **Parent Outcome**| [OC-012](../../outcomes/OC-012/) |
| **Status** | `draft`|

## 1. Scenario
An AI workload requires specific GPU resources. The scheduler automatically identifies compliant compute nodes, verifies quota, and places the workload while ensuring required anti-affinity rules are met.

## 2. Pre-conditions
- The workload declares its resource requirements and affinity/anti-affinity constraints.
- Compliant compute nodes with available quota exist in the target environment.
- The deployment pipeline is authorised to schedule workloads.

## 3. Success Criteria
- Workload is placed on optimal hardware within < 30 seconds.
- High availability is maintained through automated multi-zone distribution.

## 4. Realisation
- **[ABB-006 Compute Orchestration Platform](../../../building-blocks/architecture-building-blocks/ABB-006/)**

