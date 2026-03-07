---
title: "CAP-004 Identity Lifecycle Management"
sidebar_label: "CAP-004 Identity Lifecycle Management"
sidebar_position: 4
---

# CAP-004 Identity Lifecycle Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-004` | Unique identifier. |
| **Capability Name** | Identity Lifecycle Management | Human-readable name. |
| **Realizes Outcome**| [OC-002 Credential-less Infrastructure](../../../strategy/outcomes.md#oc-002-credential-less-infrastructure) | Primary strategic goal. |
| **Enables Use Case**| [UC-001 Automated Workload Identity Provisioning](../../../strategy/use-cases.md#uc-001-automated-workload-identity-provisioning) | Primary operational scenario. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-002` | Identity & Access. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-001 Security](../../platforms/PL-001/) | Parent platform. |

The organisation must be able to provision, authenticate, federate, and decommission the identities of all actors — human users, non-human workloads, service principals, and AI agents — through a unified lifecycle that ensures every identity is known, verifiable, and revocable.


## 1  Purpose

Identity sprawl and orphaned credentials are among the most common root causes of security incidents. This capability ensures every identity in the architecture has a defined lifecycle — from creation through periodic attestation to eventual decommissioning — with credential management that eliminates stored secrets for non-human workloads. It covers provisioning, authentication (token issuance and validation), multi-factor step-up, federation across organisational boundaries, workload identity, and automated decommissioning.


## 2  Capability Definition

### 2.1  Organisation

- **Identity Governance Team.** Owns the identity lifecycle from provisioning through decommissioning. Conducts periodic attestation reviews.
- **HR and Onboarding.** Triggers human identity provisioning and decommissioning events through joiner/mover/leaver processes.
- **Platform Engineering.** Triggers non-human identity provisioning for new services, agents, and automation pipelines.

### 2.2  People

- **Identity Engineers.** Implement provisioning automation, directory synchronisation, and credential management workflows.
- **Security Architects.** Design federation trust models, workload identity patterns, and credential-less authentication flows.
- **Access Reviewers.** Conduct attestation reviews to verify continued need for each identity and its assigned permissions.

### 2.3  Processes

- **Joiner/Mover/Leaver.** Automated identity provisioning and decommissioning triggered by HR events.
- **Non-Human Identity Request.** Structured request and approval workflow for creating service principals and workload identities.
- **Attestation Review.** Periodic review of all identities to verify they are still required, correctly classified, and appropriately scoped.
- **Credential Rotation.** Automated rotation of signing keys, certificates, and tokens on defined schedules.
- **Federation Trust.** Establishment, periodic review, and revocation of trust relationships with external identity providers.

### 2.4  Technology

- **Identity Store.** Centralised directory for all identity objects (users, groups, service principals) with attribute-based lookups and group membership.
- **Provisioning Engine.** Automated provisioning and deprovisioning of identities triggered by upstream events (HR, service registration, agent deployment).
- **Token Service.** Issuing and validating short-lived security tokens carrying identity claims, roles, and scopes.
- **Multi-Factor Authentication Service.** Step-up authentication when risk signals or policy require higher assurance.
- **Federation Service.** Cross-boundary authentication using standard identity federation protocols, eliminating credential sharing between organisations.
- **Workload Identity Service.** Credential-less identity for non-human workloads using platform-native assertions (compute metadata, signed runtime claims).

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
| **Assessment Date** | 2026-03-07 |
| **Assessor** | Architecture Team |

Human identity provisioning is partially automated through HR-triggered workflows, but non-human identity provisioning is largely manual. Some workloads still use stored credentials. Federation is established with selected partners but not standardised. Attestation reviews are infrequent and manual.

### 3.3  Maturity Roadmap

- **1 → 2.** Automate non-human identity provisioning. Migrate all workloads to federated credentials. Establish quarterly attestation review cadence.
- **2 → 3.** Standardise identity lifecycle across all building blocks. Implement continuous attestation with automated anomaly detection. Achieve zero stored secrets for all non-human identities.


## 4  ABB Realisation

### 4.1  Relationship Model

This capability is realised primarily by AB-001 Identity & Access Management, which provides the full identity lifecycle infrastructure. The cross-cutting ABBs (Observability, Governance) support this capability by providing audit trails and policy enforcement for identity operations.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [AB-001](../../building-blocks/architecture-building-blocks/AB-001/) | Identity & Access Management | `primary` | `full` | Provides identity provisioning, credential management, token services, federation, workload identity, and decommissioning. |
| [AB-002](../../building-blocks/architecture-building-blocks/AB-002/) | Observability | `cross-cutting` | `full` | Receives identity lifecycle events, authentication telemetry, and credential rotation signals. |
| [AB-003](../../building-blocks/architecture-building-blocks/AB-003/) | Governance & Policy Enforcement | `cross-cutting` | `full` | Enforces identity provisioning policies, attestation requirements, and credential management standards. |

### 4.3  Gaps

All technology needs are realised by the mapped ABBs.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-004 Identity Lifecycle Management capability created. |
