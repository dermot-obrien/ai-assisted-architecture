---
title: "CAP-002 Identity & Access"
sidebar_label: "CAP-002 Identity & Access"
sidebar_position: 2
---

# CAP-002 Identity & Access

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-002` | Unique identifier. |
| **Capability Name** | Identity & Access | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-001 Security](../../platforms/PL-001/) | Parent platform. |

The organisation must be able to establish, verify, and govern the identities of all actors (human and non-human) and enforce access decisions consistently across every platform service. This capability group covers identity lifecycle management, authentication, authorisation, federation, and policy-based access control.


## 1  Purpose

Every interaction in the platform requires a trustworthy answer to *who is making this request?* and *are they allowed to do it?* This capability group ensures that identity and access concerns are centralised rather than reimplemented by each individual capability or building block. It spans the full identity lifecycle from provisioning through decommissioning, and the full access-decision chain from authentication through policy evaluation.


## 2  Capability Definition

### 2.1  Organisation

- **Identity Governance Team.** Manages identity provisioning, attestation reviews, and decommissioning processes.
- **Security Architecture Team.** Designs authentication flows, authorisation models, and federation trust relationships.
- **Privileged Access Management Team.** Governs just-in-time elevation, approval workflows, and time-bounded administrative sessions.

### 2.2  People

- **Identity Engineers.** Implement and operate identity provisioning, directory services, and credential management.
- **Security Engineers.** Configure authentication protocols, conditional access policies, and federation trusts.
- **Access Reviewers.** Conduct periodic access certification and separation-of-duties reviews.

### 2.3  Processes

- **Identity Provisioning.** Create and configure identities for new human users, non-human workloads, and service principals.
- **Access Certification.** Periodic review of role assignments and permissions to ensure least privilege.
- **Credential Rotation.** Scheduled rotation of signing keys, certificates, and tokens with automated rollover.
- **Federation Trust.** Establish, review, and revoke trust relationships with external identity providers and partner organisations.

### 2.4  Technology

- **Identity Store.** A centralised directory for users, groups, roles, and service principals with attribute-based lookups.
- **Token Issuance Service.** Issuing and validating short-lived security tokens with claims-based identity assertions.
- **Policy Evaluation Engine.** Evaluating access requests against contextual policies combining roles, attributes, risk signals, and conditions.
- **Federation Service.** Establishing trust across organisational and cloud boundaries without credential sharing.


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

Basic identity and access management is in place but not yet standardised across all building blocks. Some workloads still use stored credentials rather than federated identity. Access certification is manual and infrequent.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-002 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-004](../CAP-004/) (Identity Lifecycle Management) and [CAP-005](../CAP-005/) (Policy-Based Access Control) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-004](../CAP-004/) | Identity Lifecycle Management | L3 | 1 |
| [CAP-005](../CAP-005/) | Policy-Based Access Control | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-002 Identity & Access capability created. |
