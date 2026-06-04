---
title: "UC-005 Automated Workload Scheduling"
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

## 2. Success Criteria
- Workload is placed on optimal hardware within < 30 seconds.
- High availability is maintained through automated multi-zone distribution.

## 3. Realisation
- **[ABB-006 Compute Orchestration Platform](../../../building-blocks/architecture-building-blocks/ABB-006/)**
