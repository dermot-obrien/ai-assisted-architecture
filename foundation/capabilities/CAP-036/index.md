---
id: CAP-036
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-036 Centralised Configuration Management"
sidebar_label: "CAP-036 Centralised Configuration Management"
sidebar_position: 36
governance_zone: foundation
level: L3
parent: CAP-035
provided_by_platform: PL-009
required_by_outcomes:
  - OC-010
components:
  organisation: Platform Engineering Team, Development Teams, Operations Team
  people:
    - Platform Engineers
    - Developers
    - Operations Engineers
  processes:
    - Configuration Entry Management
    - Environment Promotion
    - Runtime Refresh
    - Drift Detection
  technology: Configuration Service, Configuration Client SDK, Drift Detection Engine, Change Audit Log
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
realised_by_abbs:
  - ABB-001
  - ABB-002
  - ABB-003
---

# CAP-036 Centralised Configuration Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-036` | Unique identifier. |
| **Capability Name** | Centralised Configuration Management | Human-readable name. |
| **Realises Outcome**| [OC-010 Configuration Consistency & Secret Hygiene](../../strategy/outcomes/OC-010/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-035` | Configuration & Secret Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-009 Configuration & Secrets](../../platforms/PL-009/) | Parent platform. |

The organisation must provide a centralised, versioned configuration service that ensures consistency across environments and enables configuration changes without redeployment.


## 1  Purpose

When configuration is scattered across environment variables, config files, and deployment manifests, drift is inevitable. A centralised configuration service provides a single source of truth, version history, environment promotion, and runtime refresh without service restarts.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns configuration service infrastructure.
- **Development Teams.** Consume configuration through standard client libraries.
- **Operations Team.** Monitors configuration changes and their impact.

### 2.2  People

- **Platform Engineers.** Build and maintain the configuration service.
- **Developers.** Define and manage their service configuration entries.
- **Operations Engineers.** Monitor configuration change propagation.

### 2.3  Processes

- **Configuration Entry Management.** Create, update, and version configuration entries with approval workflows.
- **Environment Promotion.** Promote configuration from dev to staging to production with validation gates.
- **Runtime Refresh.** Propagate configuration changes to running services without restart.
- **Drift Detection.** Detect and alert on configuration inconsistencies between environments.

### 2.4  Technology

- **Configuration Service.** Centralised, versioned store for application configuration with runtime refresh and environment promotion.
- **Configuration Client SDK.** Standard client libraries for consuming configuration with caching, refresh, and fallback.
- **Drift Detection Engine.** Continuous comparison of configuration state across environments with alerting and remediation.
- **Change Audit Log.** Immutable record of all configuration changes with who, what, when, and why.


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

Configuration is scattered across environment variables, config files, and deployment manifests with no central service, version history, or drift detection.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-036 Centralised Configuration Management capability created. |

