# Identity Lifecycle Service (Entra)

**SBB-001** | **Version** 1.0 | **Status** DRAFT | **Realises** ABB-001 Identity & Access Management

## Purpose

Realises the IAM ABB (ABB-001) using Microsoft Entra ID as the central identity provider. It provides credential-less authentication via Entra Workload ID and FIC, ensuring secure, secrets-free communication for AI agents and cloud-native services.

## Product Mapping

• **Identity Provisioning.** Entra ID Provisioning and Microsoft Graph API.
• **Credential Management.** Entra Workload ID (Federated Credentials).
• **Identity Store.** Entra ID Tenant.
• **Token Issuance.** Entra Security Token Service (STS).
• **Authorisation.** Entra Conditional Access and App Roles.
• **Federation.** Entra Workload ID FIC.

## Cross-Cutting Posture

• **Identity & Access.** Entra ID with MFA and Workload ID. No long-lived static secrets.
• **Observability.** Entra Sign-in and Audit logs exported via Diagnostic Settings.
• **Governance & Policy.** Entra PIM for JIT elevation and Conditional Access for signal-based enforcement.

## Key Design Decisions

• **Federated Credentials Only.** Elimination of client secrets for non-human workloads.
• **Just-In-Time Elevation.** Administrative roles are governed by Entra PIM.
• **Diagnostic Export.** All identity telemetry streamed to the Observability context.

## Key Interfaces

• **I1** Service → Entra STS. OIDC/OAuth token request.
• **I6** K8s/Cloud → Entra. Federated Credential Exchange (FIC).
• **I8** Entra → Log Analytics. Diagnostic event streaming.
