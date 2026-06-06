---
id: CAP-028
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-028 Artifact Provenance & Signing"
sidebar_label: "CAP-028 Artifact Provenance & Signing"
sidebar_position: 28
governance_zone: foundation
level: L3
parent: CAP-027
provided_by_platform: PL-007
required_by_outcomes:
  - OC-008
components:
  organisation: Application Security Team, Platform Engineering Team, Operations Team
  people:
    - Security Engineers
    - Build Engineers
    - Operations Engineers
  processes:
    - Key Management
    - Build Signing
    - Provenance Generation
    - Admission Verification
  technology: Artifact Signing Service, Key Management Service, Provenance Attestation Generator, Admission Controller
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-028 Artifact Provenance & Signing

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-028` | Unique identifier. |
| **Capability Name** | Artifact Provenance & Signing | Human-readable name. |
| **Realizes Outcome**| [OC-008 Software Supply Chain Integrity](../../../strategy/outcomes/OC-008/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-027` | Supply Chain Security. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-007 Supply Chain Security](../../platforms/PL-007/) | Parent platform. |

The organisation must cryptographically sign all build artifacts and generate verifiable provenance metadata that attests to the source, build process, and builder identity of every artifact.


## 1  Purpose

Without provenance, there is no way to distinguish a legitimate artifact from a tampered one. Signing and provenance attestation create a verifiable chain of custody from source code to production, enabling admission policies that reject unverified artifacts.


## 2  Capability Definition

### 2.1  Organisation

- **Application Security Team.** Owns signing policy and key management.
- **Platform Engineering Team.** Integrates signing into build pipelines.
- **Operations Team.** Enforces signature verification at deployment admission.

### 2.2  People

- **Security Engineers.** Manage signing keys and attestation policies.
- **Build Engineers.** Configure signing steps in CI/CD.
- **Operations Engineers.** Configure admission controllers to verify signatures.

### 2.3  Processes

- **Key Management.** Create, rotate, and revoke signing keys with HSM-backed storage.
- **Build Signing.** Automated signing of artifacts as a build pipeline step.
- **Provenance Generation.** Generate SLSA-compliant provenance attestations.
- **Admission Verification.** Verify artifact signatures before deployment.

### 2.4  Technology

- **Artifact Signing Service.** Cryptographic signing of build artifacts with audit trail.
- **Key Management Service.** HSM-backed storage and lifecycle management for signing keys.
- **Provenance Attestation Generator.** SLSA-compliant provenance metadata generation linked to build pipeline events.
- **Admission Controller.** Policy-driven verification of artifact signatures at deployment time.


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
| **Assessment Date** | 2026-03-08 |
| **Assessor** | Architecture Team |

Artifacts are built and stored in registries but not signed. No provenance metadata is generated. Admission controllers do not verify artifact integrity.

### 3.3  Maturity Roadmap

- **1 → 2.** Implement artifact signing in all build pipelines. Generate provenance attestations for container images. Establish key management procedures.
- **2 → 3.** Enforce signature verification at deployment admission. Achieve SLSA Level 3 provenance for all production artifacts. Automate key rotation with HSM-backed storage.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Supply Chain Security ABB is created.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| — | — | — | — | ABB mappings will be defined when the Supply Chain Security ABB is created. |

### 4.3  Gaps

ABB mappings pending creation of the Supply Chain Security ABB.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-028 Artifact Provenance & Signing capability created. |

