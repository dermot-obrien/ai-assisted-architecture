---
id: PL-001
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-001 Security Platform"
governance_zone: foundation
strategic_owner: Chief Information Security Officer (CISO)
provides_capabilities:
  - CAP-004
  - CAP-005
contains_bounded_contexts:
  - BC-001
owns_outcomes:
  - OC-001
  - OC-002
---

# PL-001 Security Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-001` |
| **Name** | Security |
| **Strategic Owner** | Chief Information Security Officer (CISO) |
| **Owner Team** | Security Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Security Platform** is responsible for protecting the organisation's assets, data, and identities. It defines the strategic posture for trust and risk management and provides self-service security capabilities to consuming teams.

## 2. Strategic Outcomes
- **[OC-001 Zero Trust Workload Posture](../../strategy/outcomes/OC-001/)**
- **[OC-002 Credential-less Infrastructure](../../strategy/outcomes/OC-002/)**

## 3. Capabilities
- **[CAP-004 Identity Lifecycle Management](../../capabilities/CAP-004/)**
- **[CAP-005 Policy-Based Access Control](../../capabilities/CAP-005/)**

## 4. Bounded Contexts
- **[BC-001 Identity & Access](../../contexts/BC-001/)**

## 5. Self-Service Interfaces
- **Identity APIs (OIDC / OAuth 2.0).** Token issuance, validation, and introspection endpoints for human and workload identities.
- **Access request portal.** Self-service role and entitlement requests with policy-gated approval and periodic access reviews.
- **Workload identity federation.** Declarative configuration for secret-less workload authentication.
- **Policy-as-code SDK and CLI.** Libraries for integrating access decisions into services.
- **Documentation and golden paths.** Onboarding guides and reference patterns for secure-by-default integration.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Authenticate users and workloads and enforce authorisation.
- **All other platform teams.** Rely on this platform for workload identity and access control of their own services.
- **Security operations.** Consume sign-in and decision telemetry for monitoring and response.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Token issuance / validation availability | 99.95% monthly |
| Token validation latency (p99) | < 100 ms |
| Automated access-request fulfilment | < 5 minutes |
| Critical credential revocation propagation | < 15 minutes |

