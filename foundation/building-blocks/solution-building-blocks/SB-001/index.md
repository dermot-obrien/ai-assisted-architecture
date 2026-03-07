---
title: "SB-001 Identity Lifecycle Service (Entra)"
sidebar_label: "SB-001 Identity Lifecycle Service (Entra)"
sidebar_position: 1
---

# SB-001 Identity Lifecycle Service (Entra)

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **SBB ID** | `SB-001` | Unique identifier. |
| **SBB Name** | Identity Lifecycle Service (Entra) | Human-readable name. |
| **Short Name** | Entra IAM | Used in diagrams. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `APPROVED` | Current lifecycle status. |
| **Category** | `Security` | Logical grouping. |

---

## 1  Purpose

This SBB realises the logical [AB-001 Identity & Access Management](../../architecture-building-blocks/AB-001/) using **Microsoft Entra ID** (formerly Azure AD). It provides the core mechanism for assigning and managing identities for AI agents, services, and human users within the cloud-native ecosystem. This SBB specifically leverages **Entra Workload ID** to achieve credential-less authentication for compute resources.

---

## 2  Building block

### 2.1  Component Diagram

The diagram below shows the physical realisation of the IAM ABB using Entra ID services. The Entra ID Tenant serves as the central directory store. Workload identities are managed via Entra Workload ID using Federated Credential Exchange (FIC). Administrative access is governed by Entra PIM.

![SB-001 Identity Lifecycle Service (Entra) Component Diagram](./components.png)

### 2.2  Product mapping (ABB → SBB)

| ABB Component | SBB Product / Service | Notes |
|---------------|----------------------|-------|
| Identity Provisioning | Entra ID Provisioning | SCIM-based provisioning and Graph API. |
| Credential Management | Entra Workload ID | Managed identities and federated credentials. |
| Identity Decommissioning | Entra ID Governance | Automated lifecycle workflows and access reviews. |
| Token Issuance | Entra STS (v2.0) | OIDC and OAuth 2.0 endpoints. |
| Token Validation | Entra Token Validation | Middleware-based validation of JWTs. |
| Multi-Factor Authentication | Entra MFA | Authenticator app, FIDO2, and SMS. |
| Policy Evaluation Engine | Entra Conditional Access | Signal-based access policy engine. |
| Role & Permission Management | Entra RBAC / App Roles | Scoped application and directory roles. |
| Conditional Access | Entra CA Policies | Real-time evaluation of risk and context. |
| Identity Federation | Entra B2B / Federation | SAML/OIDC federation with external IdPs. |
| Workload Identity Federation | Entra Workload ID FIC | Federation with K8s and other compute platforms. |
| Directory Services | Entra ID Tenant | Cloud directory for all principals. |
| **Observability (cross-cutting)** | Entra Sign-in Logs | Exported to Azure Monitor/Log Analytics. |
| **Governance (cross-cutting)** | Entra ID Governance | Privileged Identity Management (PIM). |

### 2.3  Key design decisions

- **Federated Credentials Only**. No static secrets (client secrets or passwords) are permitted for workload-to-workload communication.
- **Just-In-Time (JIT) Admin**. Administrative roles are not permanently assigned; they require Entra PIM elevation with approval.
- **Modern Auth Only**. Legacy protocols (NTLM, Basic Auth) are disabled at the tenant level.

### 2.4  Message Flow

1. **Assertion**. A workload (e.g., K8s pod) generates a platform-native identity assertion.
2. **Exchange**. The workload sends the assertion to the Entra STS endpoint.
3. **Verification**. Entra STS verifies the assertion against the configured trust relationship.
4. **Issuance**. Entra STS issues a short-lived OIDC/OAuth JWT token.
5. **Consumption**. The workload presents the token to a target building block.

### 2.5  Identity & Access Management

- **Entra ID**. The primary identity provider for this SBB.
- **Workload ID**. Provides credential-less identity for services and agents.
- **Managed Identities**. Native Azure resource identities managed by the platform.

### 2.6  Observability

- **Entra Sign-in Logs**. Capture every authentication attempt and outcome.
- **Entra Audit Logs**. Record every change to the directory and policies.
- **Diagnostic Settings**. Stream logs to the Observability Bounded Context.

### 2.7  Governance & Policy Enforcement

- **Conditional Access**. Enforces MFA and location-based rules.
- **Entra PIM**. Governs administrative elevation.
- **Access Reviews**. Automates the attestation of role assignments.

### 2.8  Cloud-Specific Constraints

- **Tenant Quotas**. Service principal and object limits per Entra tenant.
- **FIC Latency**. Propagation time for new federated credential trust relationships.

---

## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description (SBB-specific) |
|----|-----------|------|---------------------------|
| **I1** | Service → Entra STS | HTTPS | OIDC/OAuth token request. |
| **I6** | K8s/Cloud → Entra | FIC | Federated Credential Exchange. |
| **I8** | Entra → Log Analytics | Diagnostic | Event streaming to observability. |

---

## 4  Mapping

### 4.1  Entity mapping

- **Workload** → Azure Container Apps / AKS Service Account.
- **Identity Provider** → Microsoft Entra ID Tenant.

### 4.2  Policy mapping

- **Zero Trust Policy** → Enforced via Entra CA and FIC.

---

## 5. ABB Traceability

This SBB realizes [AB-001 Identity & Access Management](../../architecture-building-blocks/AB-001/) using Microsoft Entra ID. Every logical component defined in the ABB is mapped to an Entra ID product or service.

| ABB Capability | SBB Realisation |
|----------------|-----------------|
| Identity Provisioning | Entra ID Provisioning and Graph API. |
| Workload Identity | Entra Workload ID with FIC. |
| Authorisation | Entra RBAC and Conditional Access. |

---

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | Retrospective standardisation of SB-001. |
