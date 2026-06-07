---
id: CAP-029
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-029 Dependency & Vulnerability Scanning"
sidebar_label: "CAP-029 Dependency & Vulnerability Scanning"
sidebar_position: 29
governance_zone: foundation
level: L3
parent: CAP-027
provided_by_platform: PL-007
required_by_outcomes:
  - OC-008
components:
  organisation: Application Security Team, Development Teams, Platform Engineering Team
  people:
    - Security Engineers
    - Developers
    - Build Engineers
  processes:
    - Build-time Scanning
    - Runtime Scanning
    - Vulnerability Triage
    - Remediation Tracking
  technology: Dependency Scanner, Vulnerability Database, License Compliance Checker, Remediation Tracker
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
realised_by_abbs:
  - ABB-001
  - ABB-002
  - ABB-003
---

# CAP-029 Dependency & Vulnerability Scanning

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-029` | Unique identifier. |
| **Capability Name** | Dependency & Vulnerability Scanning | Human-readable name. |
| **Realises Outcome**| [OC-008 Software Supply Chain Integrity](../../strategy/outcomes/OC-008/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-027` | Supply Chain Security. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-007 Supply Chain Security](../../platforms/PL-007/) | Parent platform. |

The organisation must continuously scan all software dependencies (direct and transitive) for known vulnerabilities, license compliance issues, and malicious packages, with automated enforcement in build and deployment pipelines.


## 1  Purpose

Open-source dependencies are the largest attack surface in modern software. A single vulnerable transitive dependency can compromise an entire service. Automated scanning at build time and runtime ensures vulnerabilities are detected early, and enforcement prevents deployment of known-vulnerable artifacts.


## 2  Capability Definition

### 2.1  Organisation

- **Application Security Team.** Owns scanning policy and vulnerability SLAs.
- **Development Teams.** Remediate vulnerabilities in their dependencies.
- **Platform Engineering Team.** Integrates scanning into CI/CD.

### 2.2  People

- **Security Engineers.** Configure scanning rules and severity thresholds.
- **Developers.** Triage and fix dependency vulnerabilities.
- **Build Engineers.** Maintain scanner integration in pipelines.

### 2.3  Processes

- **Build-time Scanning.** Scan dependencies during CI build with configurable pass/fail thresholds.
- **Runtime Scanning.** Continuous monitoring of deployed artifacts for newly disclosed vulnerabilities.
- **Vulnerability Triage.** Assess severity, exploitability, and exposure for each finding.
- **Remediation Tracking.** Track remediation actions against SLA targets.

### 2.4  Technology

- **Dependency Scanner.** Automated analysis of direct and transitive dependencies against vulnerability databases.
- **Vulnerability Database.** Continuously updated catalogue of known vulnerabilities (CVE, OSV, GitHub Advisory).
- **License Compliance Checker.** Automated verification of dependency licences against organisational policy.
- **Remediation Tracker.** Centralised tracking of vulnerability findings, ownership, and remediation status against SLA.


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

Dependency scanning runs in some pipelines but is not enforced as a gate. No runtime scanning. Vulnerability remediation is ad-hoc with no SLA tracking.

### 3.3  Maturity Roadmap

- **1 → 2.** Deploy dependency scanning in all CI pipelines with blocking on critical/high findings. Establish vulnerability SLAs and remediation tracking. Implement licence compliance checks.
- **2 → 3.** Add continuous runtime scanning for newly disclosed vulnerabilities. Automate remediation workflows with pull request generation. Integrate vulnerability data with incident response processes.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-029 Dependency & Vulnerability Scanning capability created. |

