---
id: BC-005
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-005 Cost Management Bounded Context"
governance_zone: foundation
part_of: PL-005
subdomain_kind: supporting
realises_capabilities:
  - CAP-020
  - CAP-021
  - CAP-022
ubiquitous_language:
  - term: Cost Allocation Tag
    definition: A metadata label that attributes spend to a team, service, or business unit.
  - term: Showback
    definition: Reporting infrastructure costs to consuming teams without billing them.
  - term: Chargeback
    definition: Billing infrastructure costs to consuming teams through internal accounting.
  - term: Rightsizing
    definition: Adjusting resource allocation to match actual usage, eliminating over-provisioning.
---

# BC-005 Cost Management Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-005` |
| **Context Name** | Cost Management |
| **Platform** | [PL-005 Cost Management](../../platforms/PL-005/) |
| **Owner Team** | FinOps Team |
| **Subdomain Type**| Supporting |

## 1. Purpose
The **Cost Management Bounded Context** provides the financial lens over platform infrastructure. It defines the model for cost attribution, budget enforcement, and optimisation recommendations.

## 2. Ubiquitous Language
- **Cost Allocation Tag**: A metadata label that attributes spend to a team, service, or business unit.
- **Showback**: Reporting infrastructure costs to consuming teams without billing them.
- **Chargeback**: Billing infrastructure costs to consuming teams through internal accounting.
- **Rightsizing**: Adjusting resource allocation to match actual usage, eliminating over-provisioning.

## 3. Contained ABBs
- (To be defined)

## 4. Realised Capabilities
- **[CAP-020 Cost Visibility & Allocation](../../capabilities/CAP-020/)**
- **[CAP-021 Cost Optimisation & Rightsizing](../../capabilities/CAP-021/)**
- **[CAP-022 Budget Governance & Anomaly Detection](../../capabilities/CAP-022/)**

