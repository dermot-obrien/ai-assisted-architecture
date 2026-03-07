---
title: "CAP-023 Reliability & Resilience"
sidebar_label: "CAP-023 Reliability & Resilience"
sidebar_position: 23
---

# CAP-023 Reliability & Resilience

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-023` | Unique identifier. |
| **Capability Name** | Reliability & Resilience | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-006 Reliability & Resilience](../../platforms/PL-006/) | Parent platform. |

The organisation must be able to define, measure, and maintain service reliability through objective-based management, disaster recovery planning, and proactive resilience testing.


## 1  Purpose

Monitoring detects problems; reliability engineering prevents them. Without SLO-driven management, teams either over-invest in availability (gold-plating) or under-invest (frequent outages). Without disaster recovery planning and chaos testing, recovery is improvised during crises. This capability group ensures reliability is measured, budgeted, planned, and tested.


## 2  Capability Definition

### 2.1  Organisation

- **Site Reliability Engineering Team.** Owns SLO frameworks, DR planning, and resilience testing.
- **Service Owning Teams.** Define and maintain SLOs for their services.
- **Business Continuity Team.** Coordinates DR exercises and compliance.

### 2.2  People

- **SREs.** Design SLO frameworks and run chaos experiments.
- **Service Owners.** Define SLOs and manage error budgets.
- **DR Coordinators.** Plan and execute recovery exercises.

### 2.3  Processes

- **SLO Lifecycle.** Define, implement, monitor, and review SLOs quarterly.
- **Error Budget Policy.** Define actions when error budget is exhausted — e.g., feature freeze.
- **DR Planning.** Document, test, and maintain recovery procedures.
- **Resilience Testing.** Schedule and execute chaos experiments with blast-radius controls.

### 2.4  Technology

- **SLO Monitoring & Dashboard.** Real-time SLO compliance tracking and reporting.
- **Error Budget Tracker.** Continuous calculation and visualisation of remaining error budget.
- **DR Orchestration Platform.** Automated failover, recovery, and exercise management.
- **Chaos Engineering Framework.** Controlled fault injection and experiment orchestration.


## 3  Maturity

### 3.1  Maturity Model

| Level | Name | Description |
|-------|------|-------------|
| **0** | None | Capability does not exist. |
| **1** | Initial | Ad-hoc, manual, inconsistent. |
| **2** | Developing | Some automation, documented processes, repeatable. |
| **3** | Defined | Standardised, consistent, proactive. |
| **4** | Managed | Quantitatively managed, SLAs tracked, measured. |
| **5** | Optimising | Continuous improvement, data-driven optimisation, innovation. |

### 3.2  Current Assessment

| Property | Value |
|----------|-------|
| **Current Maturity** | 1 |
| **Target Maturity** | 3 |
| **Assessment Date** | 2026-03-08 |
| **Assessor** | Architecture Team |

Some services have informal availability targets but no formal SLOs or error budgets. Disaster recovery plans exist for critical services but are rarely tested. No chaos engineering practice.

### 3.3  Maturity Roadmap

- **1 → 2.** Define SLOs for all Tier-1 services. Establish error budget policies. Conduct first DR exercise.
- **2 → 3.** SLO-driven release gating. Automated DR failover testing. Regular chaos experiments across all tiers.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-023 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-024](../CAP-024/) (SLO Management & Error Budgets), [CAP-025](../CAP-025/) (Disaster Recovery & Business Continuity), and [CAP-026](../CAP-026/) (Chaos Engineering & Resilience Testing) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-024](../CAP-024/) | SLO Management & Error Budgets | L3 | 1 |
| [CAP-025](../CAP-025/) | Disaster Recovery & Business Continuity | L3 | 1 |
| [CAP-026](../CAP-026/) | Chaos Engineering & Resilience Testing | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-023 Reliability & Resilience capability created. |
