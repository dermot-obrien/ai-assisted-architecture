---
id: PL-007
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-007 Supply Chain Security Platform"
governance_zone: foundation
strategic_owner: Head of Application Security
provides_capabilities:
  - CAP-028
  - CAP-029
  - CAP-030
contains_bounded_contexts:
  - BC-007
owns_outcomes:
  - OC-008
---

# PL-007 Supply Chain Security Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-007` |
| **Name** | Supply Chain Security |
| **Strategic Owner** | Head of Application Security |
| **Owner Team** | Supply Chain Security Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Supply Chain Security Platform** protects the organisation from risks introduced through third-party dependencies, build pipelines, and artifact distribution. It ensures that every artifact deployed to production has verified provenance, scanned dependencies, and a current software bill of materials.

## 2. Strategic Outcomes
- **[OC-008 Software Supply Chain Integrity](../../strategy/outcomes/OC-008/)**

## 3. Capabilities
- **[CAP-028 Artifact Provenance & Signing](../../capabilities/CAP-028/)**
- **[CAP-029 Dependency & Vulnerability Scanning](../../capabilities/CAP-029/)**
- **[CAP-030 SBOM Management & Compliance](../../capabilities/CAP-030/)**

## 4. Bounded Contexts
- **[BC-007 Supply Chain Security](../../contexts/BC-007/)**

## 5. Self-Service Interfaces
- **Artifact signing and verification API.** Endpoints for signing build artifacts and verifying provenance attestations before deployment.
- **Dependency and vulnerability scanning service.** On-demand and pipeline-integrated scanning of dependencies with severity-graded findings and remediation guidance.
- **SBOM generation and registry.** Automated production, storage, and querying of software bills of materials for every released artifact.
- **Policy-as-code SDK and CLI.** Libraries for enforcing supply-chain admission policies within build and deployment pipelines.
- **Documentation and golden paths.** Onboarding guides and reference patterns for secure-by-default build and release workflows.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Sign artifacts, scan dependencies, and generate SBOMs as part of their delivery pipelines.
- **All other platform teams.** Subject their own build artifacts to provenance and vulnerability controls before release.
- **Security and compliance operations.** Consume scan findings and SBOM data for audit, reporting, and incident response.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Signing and verification service availability | 99.9% monthly |
| Dependency scan completion (per build) | < 10 minutes |
| Critical vulnerability detection-to-alert | < 30 minutes |
| SBOM coverage of released artifacts | 100% |

