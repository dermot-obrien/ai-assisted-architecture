---
title: "CAP-024 SLO Management & Error Budgets"
sidebar_label: "CAP-024 SLO Management & Error Budgets"
sidebar_position: 24
---

# CAP-024 SLO Management & Error Budgets

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-024` | Unique identifier. |
| **Capability Name** | SLO Management & Error Budgets | Human-readable name. |
| **Realizes Outcome**| [OC-007 Service Reliability Target](../../../strategy/outcomes/OC-007/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-023` | Reliability & Resilience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-006 Reliability & Resilience](../../platforms/PL-006/) | Parent platform. |

The organisation must define, monitor, and enforce service level objectives for all platform services, with error budget tracking that connects reliability investment to business impact.


## 1  Purpose

SLOs translate business expectations into measurable engineering targets. Error budgets provide a quantitative framework for balancing feature velocity against reliability — when budget is healthy, ship faster; when it is depleted, focus on stability. Without this, reliability decisions are political rather than data-driven.


## 2  Capability Definition

### 2.1  Organisation

- **SRE Team.** Owns the SLO framework and tooling.
- **Service Owners.** Define SLOs appropriate to their service tier.
- **Leadership.** Reviews SLO compliance as part of operational reviews.

### 2.2  People

- **SREs.** Implement SLO monitoring and error budget tracking.
- **Service Owners.** Set and maintain SLOs.
- **Product Managers.** Consume error budget data to inform release planning.

### 2.3  Processes

- **SLO Definition.** Select indicators, set targets, define measurement windows.
- **Error Budget Tracking.** Continuous calculation of remaining budget.
- **Budget Exhaustion Response.** Automated or manual actions when budget is consumed.
- **Quarterly SLO Review.** Assess appropriateness of targets and adjust.

### 2.4  Technology

- **SLI Collection Pipeline.** Automated collection and aggregation of service level indicators.
- **SLO Calculation Engine.** Real-time computation of SLO compliance from SLI data.
- **Error Budget Dashboard.** Visualisation of budget consumption, burn rate, and projections.
- **Budget Alert Service.** Threshold-based alerting when error budget consumption exceeds targets.


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

Some services have informal availability targets but no formal SLO framework, no error budget tracking, and no structured review process.

### 3.3  Maturity Roadmap

- **1 → 2.** Define SLOs for all Tier-1 services. Implement SLI collection and SLO calculation. Establish error budget policies.
- **2 → 3.** SLO-driven release gating. Automated error budget alerting. Standardised SLO review cadence across all service tiers.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Reliability & Resilience ABB is created.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| — | — | — | — | ABB mappings will be defined when the Reliability & Resilience ABB is created. |

### 4.3  Gaps

ABB mappings pending creation of the Reliability & Resilience ABB.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-024 SLO Management & Error Budgets capability created. |
