---
id: PL-006
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-006 Reliability & Resilience Platform"
governance_zone: foundation
strategic_owner: Head of Site Reliability Engineering
provides_capabilities:
  - CAP-024
  - CAP-025
  - CAP-026
contains_bounded_contexts:
  - BC-006
owns_outcomes:
  - OC-007
---

# PL-006 Reliability & Resilience Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-006` |
| **Name** | Reliability & Resilience |
| **Strategic Owner** | Head of Site Reliability Engineering |
| **Owner Team** | SRE Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Reliability & Resilience Platform** ensures platform services meet their availability and durability commitments. It defines the practices for setting service level objectives, planning for disaster recovery, and proactively testing system resilience through controlled experiments.

## 2. Strategic Outcomes
- **[OC-007 Service Reliability Target](../../strategy/outcomes/OC-007/)**

## 3. Capabilities
- **[CAP-024 SLO Management & Error Budgets](../../capabilities/CAP-024/)**
- **[CAP-025 Disaster Recovery & Business Continuity](../../capabilities/CAP-025/)**
- **[CAP-026 Chaos Engineering & Resilience Testing](../../capabilities/CAP-026/)**

## 4. Bounded Contexts
- **[BC-006 Reliability & Resilience](../../contexts/BC-006/)**

## 5. Self-Service Interfaces
- **SLO definition and error-budget API.** Declarative configuration of service level objectives with automated error-budget tracking and burn-rate alerting.
- **Disaster recovery runbook portal.** Self-service registration of recovery plans, recovery point and recovery time objectives, and scheduled failover rehearsals.
- **Chaos experiment SDK and CLI.** Libraries for defining, scheduling, and running controlled fault-injection experiments against services.
- **Resilience scorecard dashboards.** Per-service views of availability trends, error-budget consumption, and outstanding reliability risks.
- **Documentation and golden paths.** Onboarding guides and reference patterns for reliability-by-default service design.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Define service level objectives and run resilience experiments against their own services.
- **All other platform teams.** Adopt error-budget policies and disaster-recovery practices for the services they operate.
- **Incident and operations management.** Consume reliability telemetry and error-budget status to prioritise response and remediation.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| SLO and error-budget service availability | 99.9% monthly |
| Error-budget burn-rate alert latency | < 2 minutes |
| Disaster-recovery failover rehearsal cadence | At least quarterly |
| Recovery time objective for tier-1 services | < 1 hour |

