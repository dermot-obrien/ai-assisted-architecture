---
id: PL-003
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-003 Governance & Compliance Platform"
governance_zone: foundation
strategic_owner: Chief Risk & Compliance Officer
provides_capabilities:
  - CAP-007
contains_bounded_contexts:
  - BC-003
owns_outcomes:
  - OC-004
---

# PL-003 Governance & Compliance Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-003` |
| **Name** | Governance & Compliance |
| **Strategic Owner** | Chief Risk & Compliance Officer |
| **Owner Team** | Governance Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Governance & Compliance Platform** governs the organisation's adherence to regulatory requirements and internal policies. It provides self-service mechanisms for automated evidence collection and reporting.

## 2. Strategic Outcomes
- **[OC-004 Continuous Compliance Audit](../../strategy/outcomes/OC-004/)**

## 3. Capabilities
- **[CAP-007 Compliance Evidence & Reporting](../../capabilities/CAP-007/)**

## 4. Bounded Contexts
- **[BC-003 Governance & Policy](../../contexts/BC-003/)**

## 5. Self-Service Interfaces
- **Policy-as-code repository and SDK.** Authoring, testing, and versioning of policies as code with libraries for embedding decisions in services.
- **Policy decision endpoints.** Real-time evaluation APIs for admission, authorisation, and configuration checks at runtime.
- **Compliance evidence portal.** Self-service access to control mappings, evidence artefacts, and attestation status.
- **Audit and reporting APIs.** Programmatic export of decision logs and compliance reports for auditors and regulators.
- **Documentation and golden paths.** Reference patterns for compliant-by-default service configuration and control onboarding.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Embed policy decisions and satisfy controls in their delivery pipelines.
- **All other platform teams.** Enforce governance policies and produce compliance evidence for their own services.
- **Risk, compliance, and audit functions.** Consume evidence, reports, and decision logs for assurance and regulatory reporting.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Policy decision endpoint availability | 99.95% monthly |
| Policy evaluation latency (p99) | < 50 ms |
| Compliance evidence freshness | < 24 hours |
| Audit log query response (p95) | < 5 seconds |

