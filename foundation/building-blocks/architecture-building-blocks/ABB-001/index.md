---
id: ABB-001
kind: abb
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "ABB-001 Identity & Access Management"
sidebar_label: "ABB-001 Identity & Access Management"
sidebar_position: 1
governance_zone: foundation
category: Security
short_name: IAM
realises_capabilities:
  - CAP-004
part_of: BC-001
interfaces:
  - id: I1
    direction: in
    type: request
    description: Authentication request from a building block's identity (human or non-human) to obtain a security token.
  - id: I2
    direction: out
    type: callback
    description: Issued security token carrying identity claims, roles, and scopes.
  - id: I3
    direction: in
    type: request
    description: Request to verify a presented token's integrity, expiry, audience, and claims.
  - id: I4
    direction: in
    type: request
    description: Request to evaluate whether an identity may perform a specific action on a specific resource.
  - id: I5
    direction: out
    type: callback
    description: Permit, deny, or step-up decision returned to the requesting building block.
  - id: I6
    direction: in
    type: query
    description: Platform-native assertion (compute metadata, signed claim) exchanged for a security token without stored secrets.
  - id: I7
    direction: in
    type: request
    description: Inbound federated authentication from an external identity provider or partner organisation.
  - id: I8
    direction: out
    type: stream
    description: Authentication events, policy decisions, identity lifecycle events, and privilege-escalation alerts.
  - id: I9
    direction: out
    type: event
    description: Sign-in logs, conditional access logs, and governance data for regulatory reporting.
  - id: I10
    direction: in
    type: request
    description: Identity creation, role assignment, policy modification, and federation trust configuration.
domains:
  - application
mandatory_subabbs:
  - iam
  - observability
  - governance
---

# ABB-001 Identity & Access Management

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **ABB ID** | `ABB-001` | Unique identifier. Sequential numbering, zero-padded to 3 digits. |
| **ABB Name** | Identity & Access Management | Human-readable name of the building block. |
| **Short Name** | IAM | Used in diagrams and cross-references. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Category** | `Security` | Logical grouping. |
| **Parent Bounded Context** | [BC-001 Identity & Access](../../../contexts/BC-001/) | Domain boundary for identity and access concerns. |
| **Parent Capability** | [CAP-004 Identity Lifecycle Management](../../../capabilities/CAP-004/) | Primary capability realised by this ABB. |

Defines the technology-agnostic capabilities, interfaces, and functional requirements for establishing trustworthy identity and enforcing access decisions for every human and non-human actor in the architecture, following Zero Trust principles (NIST SP 800-207).


## 1  Purpose

Every building block in the architecture requires a trustworthy answer to two questions: *who is making this request?* and *are they allowed to do it?* This ABB exists to provide those answers as a shared, reusable capability rather than leaving each building block to solve identity and access independently. It covers the full lifecycle of identity (provisioning, authentication, authorisation, federation, credential management, and decommissioning) for both human users and non-human workloads such as AI agents, services, and automation pipelines. 


## 2  Building block

### 2.1  Component Diagram

The diagram below shows the full scope boundary of the Identity & Access Management ABB. The central Identity Lifecycle group contains provisioning, credential management, and decommissioning. The Authentication group handles token issuance and validation. The Authorisation group evaluates access policies. The Federation group enables trust across organisational and cloud boundaries. Two cross-cutting sub-ABBs (Observability and Governance & Policy) span the bottom and right of the diagram.

![ABB-001 Identity & Access Management Component Diagram](./components.png)

### 2.2  Fundamental functionality

- **Identity Provisioning.** Creates and manages identity objects for human users, non-human workloads, and service principals. Assigns identity type, owner, sponsor, and lifecycle metadata.
- **Credential Management.** Issues, rotates, and revokes credentials. Supports certificate-based, token-based, and credential-less (federated) authentication flows. Enforces no-stored-secrets policies for workload identities.
- **Identity Decommissioning.** Disables and removes identities at end of lifecycle. Ensures orphaned identities are detected and revoked through automated expiry and attestation reviews.
- **Token Issuance.** Issues short-lived security tokens after successful authentication. Tokens carry claims (identity, roles, scopes) consumed by downstream authorisation decisions.
- **Token Validation.** Verifies token integrity, issuer trust, expiry, audience, and claim content on every request. Rejects expired, tampered, or improperly scoped tokens.
- **Multi-Factor Authentication.** Provides step-up authentication when risk signals or policy require a higher assurance level. Supports multiple factor types (possession, biometric, knowledge).
- **Policy Evaluation Engine.** Evaluates access requests against a policy set combining role assignments, attribute conditions, risk signals, and contextual factors (location, device, time). Returns permit, deny, or step-up decisions.
- **Role & Permission Management.** Defines and assigns roles with scoped permissions. Supports role-based access control (RBAC) and attribute-based access control (ABAC). Enforces separation of duties and least privilege.
- **Conditional Access.** Applies real-time policy decisions that evaluate session risk, device compliance, location, and identity risk score. Can block, allow, or require step-up authentication.
- **Identity Federation.** Establishes trust relationships with external identity providers, partner organisations, and cloud platform identity services. Enables cross-boundary authentication without credential sharing.
- **Workload Identity Federation.** Enables non-human workloads to obtain tokens from a trusted identity provider using platform-native assertions (e.g. compute metadata, signed runtime claims) without stored secrets.
- **Directory Services.** Provides a centralised identity store (users, groups, roles, service principals) that all authentication and authorisation components query. Supports group-based and attribute-based lookups.

### 2.3  Attributes

- **Assurance.** Supports tiered identity and authentication assurance levels, including phishing-resistant multi-factor authentication (FIDO2/WebAuthn, passkeys) for high-risk operations.
- **Availability.** Authentication and token validation are on the critical path for every other building block, so the ABB is designed for high availability with no single point of failure.
- **Low latency.** Token validation and policy decisions are evaluated in-line on each request and must add minimal overhead.
- **Consistency.** Identity, role, and policy state is applied uniformly across all consuming building blocks regardless of platform or location.
- **Auditability.** Every authentication, authorisation, and lifecycle event is recorded immutably for security and compliance review.

### 2.4  Semantic

"Identity & Access Management" is the architectural trust anchor for the platform. It does not own business logic; it answers *who is making this request* and *are they allowed to do it* on behalf of every other building block, so that identity and access are solved once as a shared capability rather than re-implemented per service. It treats human users and non-human workloads (services, AI agents, automation) as first-class identities under a single policy model.

### 2.5  Identity & Access Management

- Administrative operations on the IAM platform itself (identity creation, role assignment, policy and federation changes) require least-privilege, just-in-time, and audited privileged access — the IAM ABB holds itself to the same controls it provides to others.
- No implicit trust is granted by network location; every request, including internal and administrative ones, is authenticated and authorised per session (Zero Trust).
- Workload identities authenticate without stored secrets via workload identity federation; standing credentials are avoided in favour of short-lived tokens.

### 2.6  Observability

- Emit authentication outcomes, token issuance/validation events, policy decisions, and identity lifecycle events as structured telemetry (interface I8).
- Surface privilege-escalation, anomalous sign-in, and impossible-travel signals for security operations and continuous access evaluation.
- Provide dashboards for sign-in success/failure rates, MFA coverage, conditional-access decisions, and orphaned-identity counts.

### 2.7  Governance & Policy Enforcement

- Enforce joiner/mover/leaver and non-human-identity lifecycle policy, including periodic access attestation and automated revocation of orphaned identities.
- Enforce separation-of-duties and least-privilege constraints at role-assignment and policy-evaluation time.
- Feed sign-in logs, conditional-access logs, and access-review evidence to the Governance ABB for regulatory reporting (interface I9).


## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Consumer → IAM | Token request | Authentication request from a building block's identity (human or non-human) to obtain a security token. |
| **I2** | IAM → Consumer | Token response | Issued security token carrying identity claims, roles, and scopes. |
| **I3** | Consumer → IAM | Token validation | Request to verify a presented token's integrity, expiry, audience, and claims. |
| **I4** | Consumer → IAM | Policy evaluation | Request to evaluate whether an identity may perform a specific action on a specific resource. |
| **I5** | IAM → Consumer | Policy decision | Permit, deny, or step-up decision returned to the requesting building block. |
| **I6** | Workload → IAM | Workload identity assertion | Platform-native assertion (compute metadata, signed claim) exchanged for a security token without stored secrets. |
| **I7** | External IdP → IAM | Federation token | Inbound federated authentication from an external identity provider or partner organisation. |
| **I8** | IAM → Observability | Event stream | Authentication events, policy decisions, identity lifecycle events, and privilege-escalation alerts. |
| **I9** | IAM → Governance | Compliance feed | Sign-in logs, conditional access logs, and governance data for regulatory reporting. |
| **I10** | Admin → IAM | Administrative operation | Identity creation, role assignment, policy modification, and federation trust configuration. |

### 3.2  Interoperability

Tokens and claims follow open standards (OAuth 2.1, OpenID Connect, SAML for legacy federation) so any consuming building block can validate identity without bespoke coupling to a specific IAM product. Federation trust is established with external identity providers and cloud platform identity services, allowing cross-boundary authentication without credential sharing. Workload identity federation lets workloads on any compliant platform exchange a native assertion for a token.

### 3.3  Dependent building blocks

| ABB | Required functionality | Named interface |
|-----|----------------------|-----------------|
| Consumer ABBs → ABB-001 IAM | Token issuance, validation, and policy decisions | I1, I2, I3, I4, I5 |
| Workload ABBs → ABB-001 IAM | Secret-less workload identity via federation | I6 |
| External IdP → ABB-001 IAM | Inbound federated authentication | I7 |
| ABB-001 IAM → ABB-002 Observability | Authentication, decision, and lifecycle telemetry | I8 |
| ABB-001 IAM → ABB-003 Governance | Compliance evidence and access-review feed | I9 |


## 4  Mapping

### 4.1  Mapping to business/organisational entities

- **Identity Provisioning** → Enterprise HR onboarding and offboarding processes.
- **Authentication** → Enterprise single sign-on and multi-factor authentication services.
- **Authorisation** → Enterprise role and permission governance.

### 4.2  Mapping to business/organisational policies

- **Zero Trust Policy.** Every request is verified regardless of network location. No implicit trust is granted based on network perimeter or previous authentication.
- **Information Security Policy.** Access to all resources is authenticated, authorised, least-privilege, and auditable.
- **Access Review Policy.** Entitlements are periodically attested; orphaned and excessive access is detected and revoked.
- **Credential Policy.** Phishing-resistant factors are required for privileged operations; workload identities use short-lived, secret-less credentials.

### 4.3  Mapping to capabilities

| Capability ID | Capability Name | Relationship |
|---------------|-----------------|-------------|
| [CAP-004](../../../capabilities/CAP-004/) | Identity Lifecycle Management | `primary` |
| [CAP-005](../../../capabilities/CAP-005/) | Policy-Based Access Control | `primary` |


## 5. Solution Building Block (SBB) Guidance

### 5.1  Structural Pattern for IAM SBBs

Each IAM SBB should map this ABB to concrete identity products and include:

- Identity store and directory model (users, groups, roles, service principals, workload identities).
- Authentication model covering token issuance/validation, MFA, and conditional access.
- Authorisation model covering RBAC/ABAC policy evaluation and decision points.
- Federation model for external identity providers and workload identity federation.

### 5.2  Shared Patterns

- Standards-based tokens (OAuth 2.1 / OpenID Connect) rather than proprietary session schemes.
- Phishing-resistant MFA (FIDO2/WebAuthn, passkeys) for privileged and high-risk access.
- Secret-less workload identity via federation in preference to stored credentials.
- Continuous access evaluation that revokes or steps up sessions on risk change.

### 5.3  Platform-Specific Constraints

Each SBB should define supported authentication protocols, token formats and lifetimes, directory scale limits, federation protocol support, conditional-access signal sources, and operational cost model.


## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | ABB-001 Identity & Access Management ABB created. |
| 1.1 | 2026-06-08 | Completion | Added mandatory sections to conform to the ABB document standard: §2.3 Attributes, §2.4 Semantic, §2.5–2.7 cross-cutting concerns, §3.2 Interoperability, §3.3 Dependent building blocks, §4.3 Capability mapping, and §5 SBB Guidance. |

