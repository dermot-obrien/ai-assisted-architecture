---
id: PL-005
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-005 Cost Management Platform"
governance_zone: foundation
strategic_owner: Head of FinOps / CFO Delegate
provides_capabilities:
  - CAP-020
  - CAP-021
  - CAP-022
contains_bounded_contexts:
  - BC-005
owns_outcomes:
  - OC-006
---

# PL-005 Cost Management Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-005` |
| **Name** | Cost Management |
| **Strategic Owner** | Head of FinOps / CFO Delegate |
| **Owner Team** | FinOps Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Cost Management Platform** governs the financial accountability of platform infrastructure. It provides visibility into cloud spend, enables allocation and chargeback, and enforces budget governance to ensure infrastructure investment delivers measurable value.

## 2. Strategic Outcomes
- **[OC-006 Cloud Cost Efficiency](../../strategy/outcomes/OC-006/)**

## 3. Capabilities
- **[CAP-020 Cost Visibility & Allocation](../../capabilities/CAP-020/)**
- **[CAP-021 Cost Optimisation & Rightsizing](../../capabilities/CAP-021/)**
- **[CAP-022 Budget Governance & Anomaly Detection](../../capabilities/CAP-022/)**

## 4. Bounded Contexts
- **[BC-005 Cost Management](../../contexts/BC-005/)**

## 5. Self-Service Interfaces
- **Cost visibility dashboards.** Self-service views of cloud spend by team, service, and environment with allocation and chargeback breakdowns.
- **Cost allocation and tagging APIs.** Programmatic enforcement of tagging standards and retrieval of allocated cost data.
- **Optimisation and rightsizing recommendations.** Actionable recommendations for resource rightsizing, commitment purchasing, and waste reduction.
- **Budget and anomaly configuration.** Declarative budget thresholds, forecasts, and anomaly-detection rules with alert routing.
- **Documentation and golden paths.** Reference patterns for cost-aware service design and FinOps onboarding.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Monitor their spend, act on recommendations, and stay within allocated budgets.
- **All other platform teams.** Attribute and optimise the cost of the services they operate.
- **Finance and FinOps leadership.** Consume allocation, forecast, and anomaly data for budgeting and accountability.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Cost data freshness | < 24 hours |
| Cost dashboard availability | 99.9% monthly |
| Budget anomaly detection latency | < 6 hours |
| Tagging and allocation coverage of spend | > 95% |

