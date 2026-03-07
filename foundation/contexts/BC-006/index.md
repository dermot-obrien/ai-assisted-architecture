---
title: "BC-006 Reliability & Resilience Bounded Context"
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
