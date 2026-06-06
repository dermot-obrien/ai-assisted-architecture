---
id: BC-006
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-006 Reliability & Resilience Bounded Context"
governance_zone: foundation
part_of: PL-006
subdomain_kind: core
realises_capabilities:
  - CAP-024
  - CAP-025
  - CAP-026
ubiquitous_language:
  - term: SLO (Service Level Objective)
    definition: A target value for a service reliability metric (e.g., 99.9% availability).
  - term: Error Budget
    definition: The permitted amount of unreliability within an SLO period, consumed by incidents and deployments.
  - term: Chaos Experiment
    definition: A controlled fault injection that validates system behaviour under failure conditions.
---

# BC-006 Reliability & Resilience Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-006` |
| **Context Name** | Reliability & Resilience |
| **Platform** | [PL-006 Reliability & Resilience](../../platforms/PL-006/) |
| **Owner Team** | Site Reliability Engineering Team |
| **Subdomain Type**| Core |

## 1. Purpose
The **Reliability & Resilience Bounded Context** defines the model for measuring, maintaining, and testing service reliability. It owns the concepts of service level objectives, error budgets, recovery procedures, and resilience experiments.

## 2. Ubiquitous Language
- **SLO (Service Level Objective)**: A target value for a service reliability metric (e.g., 99.9% availability).
- **Error Budget**: The permitted amount of unreliability within an SLO period, consumed by incidents and deployments.
- **Chaos Experiment**: A controlled fault injection that validates system behaviour under failure conditions.

## 3. Contained ABBs
- (To be defined)

## 4. Realised Capabilities
- **[CAP-024 SLO Management & Error Budgets](../../capabilities/CAP-024/)**
- **[CAP-025 Disaster Recovery & Business Continuity](../../capabilities/CAP-025/)**
- **[CAP-026 Chaos Engineering & Resilience Testing](../../capabilities/CAP-026/)**

