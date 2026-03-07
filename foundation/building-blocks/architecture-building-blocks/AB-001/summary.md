# Identity & Access Management

AB-001 | Version 1.0.0 | Status DRAFT | Category Security

## Purpose

This building block provides the shared, reusable capability for establishing, verifying, and governing identities across all enterprise building blocks. It covers the full lifecycle of identity (provisioning, authentication, authorisation, federation, credential management, and decommissioning) for both human users and non-human workloads. By centralising these concerns, the architecture achieves consistent least-privilege enforcement, auditable access decisions, and credential-less workload identity.

## Key Components

- Identity Provisioning. Creates and manages identity objects for human and non-human actors with lifecycle metadata.
- Credential Management. Issues, rotates, and revokes credentials; enforces no-stored-secrets for workloads.
- Token Issuance & Validation. Issues short-lived tokens after authentication; verifies integrity and claims on every request.
- Policy Evaluation Engine. Evaluates access requests against roles, attributes, risk signals, and contextual factors.
- Conditional Access. Real-time policy decisions based on session risk, device compliance, and identity risk score.
- Identity Federation. Establishes trust with external identity providers and cloud platforms for cross-boundary authentication.
- Workload Identity Federation. Enables credential-less authentication for non-human workloads via platform-native assertions.

## Cross-Cutting Posture

- Identity & Access. The IAM platform authenticates its own access using credential-less patterns. Administrative operations require privileged-access management with just-in-time elevation.
- Observability. Every authentication attempt, policy evaluation, identity lifecycle event, and privilege escalation is logged in an append-only, tamper-evident audit trail.
- Governance & Policy. Conditional access policies enforce permit/deny/step-up on every request. Policy changes managed through version-controlled workflows with mandatory review.

## Key Interfaces

- I1 Consumer → IAM. Authentication request to obtain a security token.
- I2 IAM → Consumer. Issued token carrying identity claims, roles, and scopes.
- I4 Consumer → IAM. Policy evaluation request for access decisions.
- I6 Workload → IAM. Platform-native assertion exchanged for a token without stored secrets.
- I7 External IdP → IAM. Inbound federated authentication from external providers.
- I8 IAM → Observability. Authentication events, policy decisions, and lifecycle events.

## Policy Alignment

- Information Security. All access authenticated, authorised, and auditable; non-human identities under least privilege.
- Zero Trust. Every request verified regardless of network location; no implicit trust.
- Privileged Access Management. Administrative access requires just-in-time elevation with approval workflows.
- Identity Lifecycle. All identities have defined provisioning, attestation, and automated decommissioning.
