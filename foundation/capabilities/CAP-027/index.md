---
id: CAP-027
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-027 Supply Chain Security"
sidebar_label: "CAP-027 Supply Chain Security"
sidebar_position: 27
governance_zone: foundation
level: L2
parent: CAP-001
provided_by_platform: PL-007
components:
  organisation: Application Security Team, Platform Engineering Team, Development Teams
  people:
    - Security Engineers
    - Build Engineers
    - Developers
  processes:
    - Build-time Signing
    - Dependency Scanning
    - SBOM Generation
    - Vulnerability Response
  technology: Artifact Signing Service, Dependency Scanner, SBOM Generator, Vulnerability Management Platform
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-027 Supply Chain Security

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-027` | Unique identifier. |
| **Capability Name** | Supply Chain Security | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-007 Supply Chain Security](../../platforms/PL-007/) | Parent platform. |

The organisation must verify the integrity, provenance, and safety of all software artifacts and their dependencies throughout the build and deployment lifecycle.


## 1  Purpose

Modern software is composed primarily of third-party components. A single compromised dependency can propagate through the entire platform. Without supply chain security, the organisation accepts unknown risk with every deployment. This capability group ensures artifacts are signed, dependencies are scanned, and bills of materials are maintained.


## 2  Capability Definition

### 2.1  Organisation

- **Application Security Team.** Owns supply chain security policy and tooling.
- **Platform Engineering Team.** Integrates checks into build and deployment pipelines.
- **Development Teams.** Consume scanning results and remediate vulnerabilities.

### 2.2  People

- **Security Engineers.** Configure scanning tools and signing policies.
- **Build Engineers.** Integrate supply chain checks into CI/CD pipelines.
- **Developers.** Remediate dependency vulnerabilities.

### 2.3  Processes

- **Build-time Signing.** All artifacts signed at build with verifiable provenance metadata.
- **Dependency Scanning.** Automated scanning of direct and transitive dependencies.
- **SBOM Generation.** Machine-readable inventory generated for every release artifact.
- **Vulnerability Response.** Triage, prioritise, and remediate identified vulnerabilities within SLA.

### 2.4  Technology

- **Artifact Signing Service.** Cryptographic signing of build artifacts with verifiable provenance.
- **Dependency Scanner.** Automated analysis of direct and transitive dependencies for known vulnerabilities.
- **SBOM Generator.** Automated generation of machine-readable software bills of materials.
- **Vulnerability Management Platform.** Centralised tracking of vulnerabilities, SLAs, and remediation status.


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

Container images are stored in a registry but not signed. Dependency scanning runs in some pipelines but is not enforced. No SBOM generation or provenance verification.

### 3.3  Maturity Roadmap

- **1 → 2.** Enforce artifact signing in all build pipelines. Deploy dependency scanning with blocking on critical/high vulnerabilities. Generate SBOM for all release artifacts.
- **2 → 3.** Automated provenance verification at deployment admission. Continuous dependency monitoring (not just build-time). SBOM integration with incident response for rapid impact assessment.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-027 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-028](../CAP-028/) (Artifact Provenance & Signing), [CAP-029](../CAP-029/) (Dependency & Vulnerability Scanning), and [CAP-030](../CAP-030/) (SBOM Management & Compliance) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-028](../CAP-028/) | Artifact Provenance & Signing | L3 | 1 |
| [CAP-029](../CAP-029/) | Dependency & Vulnerability Scanning | L3 | 1 |
| [CAP-030](../CAP-030/) | SBOM Management & Compliance | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-027 Supply Chain Security capability created. |

