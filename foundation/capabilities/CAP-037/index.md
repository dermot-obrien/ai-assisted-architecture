---
title: "CAP-037 Secret Lifecycle & Rotation"
sidebar_label: "CAP-037 Secret Lifecycle & Rotation"
sidebar_position: 37
---

# CAP-037 Secret Lifecycle & Rotation

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-037` | Unique identifier. |
| **Capability Name** | Secret Lifecycle & Rotation | Human-readable name. |
| **Realizes Outcome**| [OC-010 Configuration Consistency & Secret Hygiene](../../../strategy/outcomes/OC-010/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-035` | Configuration & Secret Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-009 Configuration & Secrets](../../platforms/PL-009/) | Parent platform. |

The organisation must manage the full lifecycle of secrets — creation, distribution, rotation, and revocation — through a centralised vault with automated rotation and zero-knowledge distribution to consuming services.


## 1  Purpose

Long-lived secrets are a liability. Every secret is a potential breach vector that grows more dangerous over time. Automated rotation limits the window of exposure for any compromised credential, and centralised vault management ensures secrets are never stored in code, configuration files, or developer machines.


## 2  Capability Definition

### 2.1  Organisation

- **Security Team.** Defines secret management policies and rotation schedules.
- **Platform Engineering Team.** Operates the secret vault infrastructure.
- **Development Teams.** Consume secrets through standard injection mechanisms.

### 2.2  People

- **Security Engineers.** Define rotation policies and audit secret access.
- **Platform Engineers.** Operate and maintain vault infrastructure.
- **Developers.** Reference secrets by name, never by value, in their applications.

### 2.3  Processes

- **Secret Creation.** Generate secrets with appropriate entropy and store in vault.
- **Secret Distribution.** Inject secrets into workloads at runtime via sidecar, init container, or environment.
- **Secret Rotation.** Automated rotation on schedule with zero-downtime credential swap.
- **Secret Revocation.** Immediate revocation of compromised secrets with consumer notification.

### 2.4  Technology

- **Secret Vault.** Encrypted storage for secrets with access control, audit logging, and rotation automation.
- **Rotation Automation Engine.** Scheduled and on-demand rotation of secrets with zero-downtime credential swap.
- **Secret Injection Agent.** Runtime injection of secrets into workloads via sidecar, init container, or environment variable.
- **Access Audit Log.** Immutable record of all secret access, rotation, and revocation events.


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

Some secrets are stored in a vault but rotation is manual. Many workloads still use long-lived credentials or secrets stored in configuration files.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-037 Secret Lifecycle & Rotation capability created. |
