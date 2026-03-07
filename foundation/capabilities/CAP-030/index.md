---
title: "CAP-030 SBOM Management & Compliance"
sidebar_label: "CAP-030 SBOM Management & Compliance"
sidebar_position: 30
---

# CAP-030 SBOM Management & Compliance

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-030` | Unique identifier. |
| **Capability Name** | SBOM Management & Compliance | Human-readable name. |
| **Realizes Outcome**| [OC-008 Software Supply Chain Integrity](../../../strategy/outcomes/OC-008/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-027` | Supply Chain Security. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-007 Supply Chain Security](../../platforms/PL-007/) | Parent platform. |

The organisation must generate, store, and distribute machine-readable software bills of materials for all production artifacts, enabling rapid impact assessment when new vulnerabilities are disclosed.


## 1  Purpose

When a new vulnerability is disclosed (e.g., Log4Shell), the first question is "where are we affected?" Without SBOMs, answering this question requires manual investigation across every service. SBOMs enable instant impact assessment by querying a central inventory of all deployed components and their versions.


## 2  Capability Definition

### 2.1  Organisation

- **Application Security Team.** Owns SBOM standards and tooling.
- **Development Teams.** Generate SBOMs as part of their build process.
- **Incident Response Team.** Consumes SBOMs for rapid impact assessment.

### 2.2  People

- **Security Engineers.** Define SBOM format and content requirements.
- **Build Engineers.** Integrate SBOM generation into CI/CD.
- **Incident Responders.** Query SBOM data during vulnerability triage.

### 2.3  Processes

- **SBOM Generation.** Automated generation during build in SPDX or CycloneDX format.
- **SBOM Storage.** Centralised, versioned storage of SBOMs linked to artifact identifiers.
- **Impact Query.** Query SBOM database for affected services when a CVE is disclosed.
- **Regulatory Reporting.** Export SBOMs in required formats for regulatory compliance.

### 2.4  Technology

- **SBOM Generator.** Automated generation of machine-readable software bills of materials in standard formats.
- **SBOM Repository.** Centralised, versioned storage linked to artifact identifiers and deployment records.
- **Impact Analysis Engine.** Query service to identify affected artifacts and services given a component or CVE identifier.
- **Compliance Export Service.** Format conversion and export of SBOMs for regulatory submissions.


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

No SBOM generation or storage exists. Impact assessment for new vulnerabilities is entirely manual and slow.

### 3.3  Maturity Roadmap

- **1 → 2.** Implement automated SBOM generation in all build pipelines. Establish centralised SBOM storage linked to artifact registries. Create basic impact query capability.
- **2 → 3.** Integrate SBOM data with incident response workflows for automated impact assessment. Implement regulatory export capabilities. Achieve continuous SBOM accuracy through runtime validation.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-030 SBOM Management & Compliance capability created. |
