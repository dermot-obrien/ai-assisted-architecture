---
title: "AB-001 Identity & Access Management"
sidebar_label: "AB-001 Identity & Access Management"
sidebar_position: 1
---
# Identity & Access Management

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **ABB ID** | `AB-001` | Unique identifier. Sequential numbering, zero-padded to 3 digits. |
| **ABB Name** | Identity & Access Management | Human-readable name of the building block. |
| **Short Name** | IAM | Used in diagrams and cross-references. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `DRAFT` | Current lifecycle status. |
| **Category** | `Security` | Logical grouping. |

Defines the technology-agnostic capabilities, interfaces, and functional requirements for establishing, verifying, and governing the identities of all actors (human and non-human) and enforcing access decisions across enterprise building blocks.


## 1  Purpose

Every building block in the architecture requires a trustworthy answer to two questions: *who is making this request?* and *are they allowed to do it?* This ABB exists to provide those answers as a shared, reusable capability rather than leaving each building block to solve identity and access independently. It covers the full lifecycle of identity (provisioning, authentication, authorisation, federation, credential management, and decommissioning) for both human users and non-human workloads such as AI agents, services, and automation pipelines. By centralising these concerns, the architecture achieves consistent least-privilege enforcement, auditable access decisions, and credential-less workload identity across all dependent building blocks.


## 2  Building block


### 2.1  Component Diagram

The diagram below shows the full scope boundary of the Identity & Access Management ABB. The central Identity Lifecycle group contains provisioning, credential management, and decommissioning. The Authentication group handles token issuance and validation. The Authorisation group evaluates access policies. The Federation group enables trust across organisational and cloud boundaries. Two cross-cutting sub-ABBs (Observability and Governance & Policy) span the bottom and right of the diagram.

![AB-001 Identity & Access Management Component Diagram](./components.png)


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

- **Scalability.** Token issuance and validation scale horizontally to support all dependent building blocks without becoming a throughput bottleneck.
- **Resilience.** Authentication and authorisation paths are redundant; failure of a single component does not lock out legitimate callers.
- **Extensibility.** New identity types, authentication factors, and policy conditions can be added without modifying existing authorisation flows.
- **Zero Trust Alignment.** Every request is authenticated and authorised regardless of network location; no implicit trust is granted.

### 2.4  Semantic

"Identity & Access Management" is the architectural capability that answers *who* and *may they* for every interaction in the enterprise. The building block boundary encompasses all components required to provision identities, issue and validate credentials, evaluate access policies, and federate trust across organisational boundaries. It excludes the application-level enforcement points (those belong to the consuming building blocks) but defines the interfaces those enforcement points call. It also excludes data-plane encryption and network segmentation, which are infrastructure concerns outside the IAM scope.

### 2.5  Identity & Access Management

As the IAM ABB itself, this section describes the ABB's own identity posture:

- **Authentication model.** The IAM platform authenticates its own administrative and programmatic access using the same token-based, credential-less patterns it provides to consumers. Administrative consoles require multi-factor authentication.
- **Authorisation approach.** Administrative operations on the IAM platform (creating identities, modifying policies, assigning roles) are governed by privileged-access management controls with just-in-time elevation, approval workflows, and time-bounded sessions.
- **Non-human identity.** The IAM platform's own service components authenticate to each other and to dependent infrastructure using workload identity federation. No stored secrets.
- **Credential management.** Key material for token signing is stored in hardware security modules or platform-managed key vaults. Signing keys are rotated on a defined schedule with automated rollover.

### 2.6  Observability

- **Signals emitted.** Authentication success and failure events, token issuance counts, policy evaluation latency, and role-assignment changes. Distributed traces link identity operations to the calling building block's request context.
- **Audit trail.** Every identity lifecycle event (creation, modification, decommissioning), every authentication attempt, every policy evaluation decision, and every role or permission change is recorded in an append-only, tamper-evident log.
- **Health and liveness.** Token issuance endpoint availability, authentication latency percentiles, policy evaluation throughput, and directory replication lag are continuously measured and reported.
- **Compliance data feeds.** Sign-in logs, conditional access evaluation logs, and privilege-escalation events feed compliance-reporting pipelines for GDPR, AI Act, and internal audit programmes.

### 2.7  Governance & Policy Enforcement

- **Policy enforcement.** Conditional access policies are the primary enforcement mechanism. Every access request passes through the policy evaluation engine, which returns permit, deny, or step-up decisions based on the current policy set.
- **Regulatory alignment.** The IAM ABB supports GDPR (data-subject access rights, lawful basis for processing identity data), the EU AI Act (identity of AI agents, human oversight of automated decisions), and NIST SP 800-207 (Zero Trust Architecture).
- **Data classification.** Identity data (user profiles, group memberships, role assignments, sign-in logs) is classified as sensitive. Protection posture requires encryption in transit and at rest, with access restricted to authorised administrative roles.
- **Change governance.** Policy changes, role definitions, and federation trust configurations are managed through version-controlled change-request workflows with mandatory review and approval.


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

The token interfaces (I1/I2/I3) use standards-based token formats and protocols, enabling any building block that supports standard token validation to consume IAM services without bespoke integration. The federation interface (I7) uses standard identity federation protocols, allowing trust to be established with external providers through configuration rather than code. The policy evaluation interface (I4/I5) defines a normalised request-response model that decouples policy authoring from enforcement.

### 3.3  Dependent building blocks

| ABB | Required functionality | Named interface |
|-----|----------------------|-----------------|
| Any Consumer ABB → IAM | Authentication and token issuance for human and non-human identities | I1, I2 |
| Any Consumer ABB → IAM | Token validation on every inbound request | I3 |
| Any Consumer ABB → IAM | Policy evaluation for access decisions | I4, I5 |
| Compute Platform → IAM | Workload identity federation for credential-less authentication | I6 |
| External Identity Provider → IAM | Federated authentication across organisational boundaries | I7 |
| IAM → Observability | Authentication and identity event streaming | I8 |
| IAM → Governance & Policy | Compliance data feed for regulatory reporting | I9 |


## 4  Mapping

### 4.1  Mapping to business/organisational entities

- **Identity Provisioning** → Enterprise HR onboarding and offboarding processes; non-human identity request workflows.
- **Authentication** → Enterprise single sign-on and multi-factor authentication services.
- **Authorisation** → Enterprise role and permission governance; data stewardship and access certification.
- **Federation** → Partner and supplier identity trust relationships; multi-cloud identity bridging.
- **Directory Services** → Enterprise identity store (users, groups, service principals).
- **Administrative Operations** → IT security team, identity governance team, privileged access management.

### 4.2  Mapping to business/organisational policies

- **Information Security Policy.** All access to enterprise systems is authenticated, authorised, and auditable. Non-human identities operate under least privilege with defined lifecycle management.
- **Zero Trust Policy.** Every request is verified regardless of network location. No implicit trust is granted based on network perimeter or previous authentication.
- **Privileged Access Management Policy.** Administrative access to the IAM platform requires just-in-time elevation, multi-factor authentication, and time-bounded sessions with approval workflows.
- **Identity Lifecycle Policy.** All identities (human and non-human) have a defined lifecycle with provisioning, attestation review, and automated decommissioning at expiry.
- **Data Protection Policy.** Identity data is classified as sensitive, encrypted in transit and at rest, and subject to access controls and audit logging.
- **Regulatory Compliance Policy.** IAM operations produce audit trails and compliance data feeds that support GDPR, EU AI Act, and internal audit requirements.


### 4.3  Mapping to capabilities

| Capability ID | Capability Name | Relationship |
|---------------|-----------------|-------------|
| [CAP-004](../../../capabilities/CAP-004/) | Identity Lifecycle Management | `primary` |
| [CAP-005](../../../capabilities/CAP-005/) | Policy-Based Access Control | `primary` |
| [CAP-006](../../../capabilities/CAP-006/) | Operational Monitoring & Alerting | `cross-cutting` |
| [CAP-007](../../../capabilities/CAP-007/) | Compliance Evidence & Reporting | `cross-cutting` |


## 5. Solution Building Block (SBB) Guidance

### 5.1  Structural Pattern for IAM SBBs

Each IAM SBB maps the technology-agnostic components defined here to specific products and services from a cloud provider or identity platform. The SBB should include:

**Identity Platform**
Maps AB-001's identity provisioning, directory services, and credential management components to the target platform's identity services (e.g. directory, identity governance, credential vault).

**Authentication Services**
Maps AB-001's token issuance, validation, and multi-factor authentication to the platform's authentication endpoints and protocols.

**Authorisation Services**
Maps AB-001's policy evaluation engine, role management, and conditional access to the platform's access management capabilities.

**Federation Configuration**
Maps AB-001's identity federation and workload identity federation to the platform's federation trust and workload identity mechanisms.

### 5.2  Shared Patterns

The following patterns and capabilities are inherited directly from AB-001; do not replicate them in the SBB:

- **Zero Trust Model.** Every request is authenticated and authorised; no implicit trust. This is an architectural principle, not a product configuration.
- **Credential-less Workload Identity.** Non-human identities use federated credentials, not stored secrets. The SBB specifies *which* federation mechanism, not *whether* to use one.
- **Append-Only Audit.** All identity events are logged immutably. The SBB specifies *where* logs are stored, not *whether* to log.

### 5.3  Platform-Specific Constraints

Each IAM SBB should document:

- **Token Formats and Protocols** — Which token formats and authentication protocols the platform supports.
- **Directory Limits** — Object count limits, replication topology, query rate limits.
- **Conditional Access Capabilities** — Which risk signals and contextual factors the platform can evaluate.
- **Federation Trust Limits** — Maximum number of trust relationships, supported protocol versions.
- **Credential Storage** — How signing keys and certificates are protected (HSM, managed key vault, software).
- **Administrative Interfaces** — CLI, API, portal, and infrastructure-as-code support for identity management.


## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | AB-001 Identity & Access Management ABB created. |
