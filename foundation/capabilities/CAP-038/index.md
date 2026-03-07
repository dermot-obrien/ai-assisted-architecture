---
title: "CAP-038 Feature Management & Progressive Delivery"
sidebar_label: "CAP-038 Feature Management & Progressive Delivery"
sidebar_position: 38
---

# CAP-038 Feature Management & Progressive Delivery

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-038` | Unique identifier. |
| **Capability Name** | Feature Management & Progressive Delivery | Human-readable name. |
| **Realizes Outcome**| [OC-010 Configuration Consistency & Secret Hygiene](../../../strategy/outcomes/OC-010/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-035` | Configuration & Secret Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-009 Configuration & Secrets](../../platforms/PL-009/) | Parent platform. |

The organisation must support progressive feature delivery through feature flags and controlled rollouts, enabling teams to deploy code independently of feature activation and roll back instantly without redeployment.


## 1  Purpose

Deploying code and releasing features should be independent activities. Feature flags decouple deployment from release, enabling canary rollouts, A/B testing, and instant kill-switches. This reduces deployment risk and accelerates experimentation.


## 2  Capability Definition

### 2.1  Organisation

- **Development Teams.** Own feature flag definitions for their services.
- **Platform Engineering Team.** Provides the feature flag infrastructure.
- **Product Teams.** Control feature activation schedules and targeting rules.

### 2.2  People

- **Developers.** Instrument code with feature flags.
- **Product Managers.** Define rollout strategies and targeting rules.
- **SREs.** Monitor feature rollout impact on SLOs and trigger automated rollback.

### 2.3  Processes

- **Flag Definition.** Create flags with targeting rules, default values, and rollout strategy.
- **Progressive Rollout.** Incremental percentage-based or segment-based feature activation.
- **Impact Monitoring.** Correlate feature activation with SLO metrics.
- **Automated Rollback.** Disable feature flag automatically when negative impact detected.

### 2.4  Technology

- **Feature Flag Service.** Runtime feature toggle management with targeting, segmentation, and rollback.
- **Targeting & Segmentation Engine.** Rule-based targeting of feature flags to specific users, segments, or percentages.
- **Rollout Controller.** Progressive rollout orchestration with automated pause and rollback.
- **Impact Correlation Engine.** Real-time correlation of feature flag changes with SLO metrics and error rates.


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

No feature flag infrastructure exists. Feature rollouts are coupled to deployments with no ability to progressively roll out or instantly roll back features.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Configuration & Secret Management ABB is created.

### 4.2  ABB Mapping

*(To be defined)*

### 4.3  Gaps

ABB mappings will be defined when the Configuration & Secret Management ABB is created.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-038 Feature Management & Progressive Delivery capability created. |
