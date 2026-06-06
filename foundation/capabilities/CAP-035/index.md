---
id: CAP-035
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-035 Configuration & Secret Management"
sidebar_label: "CAP-035 Configuration & Secret Management"
sidebar_position: 35
governance_zone: foundation
level: L2
parent: CAP-001
provided_by_platform: PL-009
components:
  organisation: Platform Engineering Team, Security Team, Development Teams
  people:
    - Platform Engineers
    - Security Engineers
    - Developers
  processes:
    - Configuration Lifecycle
    - Secret Rotation
    - Environment Promotion
    - Feature Rollout
  technology: Configuration Service, Secret Vault, Feature Flag Service, Configuration Drift Detector
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-035 Configuration & Secret Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-035` | Unique identifier. |
| **Capability Name** | Configuration & Secret Management | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-009 Configuration & Secrets](../../platforms/PL-009/) | Parent platform. |

The organisation must centrally manage application configuration and secrets, ensuring consistency across environments, automatic secret rotation, and safe progressive delivery of feature changes.


## 1  Purpose

Every production incident post-mortem surfaces the same patterns: configuration drift between environments, expired credentials, leaked secrets in repositories, and feature rollouts that cannot be reversed. Configuration & Secret Management eliminates these failure modes through centralised, versioned, and automated management of all runtime configuration and sensitive credentials.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns configuration and secret management infrastructure.
- **Security Team.** Defines secret management policies and rotation requirements.
- **Development Teams.** Consume configuration and secrets through standard interfaces.

### 2.2  People

- **Platform Engineers.** Build and maintain configuration and secret infrastructure.
- **Security Engineers.** Define secret rotation policies and audit compliance.
- **Developers.** Consume configuration through SDKs and standard environment interfaces.

### 2.3  Processes

- **Configuration Lifecycle.** Create, version, promote, and retire configuration entries.
- **Secret Rotation.** Automated rotation of secrets on defined schedules or on-demand.
- **Environment Promotion.** Promote configuration changes through environments with validation.
- **Feature Rollout.** Progressive feature enablement with monitoring and automatic rollback.

### 2.4  Technology

- **Configuration Service.** Centralised, versioned store for application configuration with runtime refresh.
- **Secret Vault.** Encrypted storage for secrets with access control, audit logging, and rotation automation.
- **Feature Flag Service.** Runtime feature toggle management with targeting, segmentation, and rollback.
- **Configuration Drift Detector.** Continuous comparison of configuration state across environments with alerting.


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

Configuration is managed through a mix of environment variables, config files, and ad-hoc tooling. Some secrets are in a vault but rotation is manual. No feature flag infrastructure.

### 3.3  Maturity Roadmap

- **1 → 2.** Centralise configuration in a dedicated service. Migrate all secrets to vault with automated rotation for database credentials. Deploy feature flag service for Tier-1 services.
- **2 → 3.** Full configuration drift detection and remediation. All secrets auto-rotated. Feature flags with automated rollback based on SLO impact.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-035 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-036](../CAP-036/) (Centralised Configuration Management), [CAP-037](../CAP-037/) (Secret Lifecycle & Rotation), and [CAP-038](../CAP-038/) (Feature Management & Progressive Delivery) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-036](../CAP-036/) | Centralised Configuration Management | L3 | 1 |
| [CAP-037](../CAP-037/) | Secret Lifecycle & Rotation | L3 | 1 |
| [CAP-038](../CAP-038/) | Feature Management & Progressive Delivery | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-035 Configuration & Secret Management capability created. |

