---
id: CAP-017
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-017 Golden Path & Template Management"
sidebar_label: "CAP-017 Golden Path & Template Management"
sidebar_position: 17
governance_zone: foundation
level: L3
parent: CAP-015
provided_by_platform: PL-004
required_by_outcomes:
  - OC-005
components:
  organisation: Platform Engineering Team, Architecture Review Board, Domain Teams
  people:
    - Template Engineers
    - Security Architects
    - Developer Advocates
  processes:
    - Template Design & Review
    - Template Versioning
    - Template Testing
    - Template Adoption Tracking
  technology: Template Registry, Template Rendering Engine, Template Testing Framework, Adoption Analytics
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-017 Golden Path & Template Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-017` | Unique identifier. |
| **Capability Name** | Golden Path & Template Management | Human-readable name. |
| **Realizes Outcome**| [OC-005 Developer Self-Service Efficiency](../../../strategy/outcomes/OC-005/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-015` | Developer Experience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-004 Developer Experience](../../platforms/PL-004/) | Parent platform. |

The organisation must maintain a curated set of opinionated, pre-approved templates (golden paths) that encode best practices for common workload patterns, ensuring consistency and reducing cognitive load for developers.


## 1  Purpose

Without golden paths, each team makes independent decisions about application structure, CI/CD configuration, observability instrumentation, and security posture. This leads to inconsistency, security gaps, and high onboarding cost. Golden paths encode organisational best practices into reusable, versioned templates.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns the template lifecycle.
- **Architecture Review Board.** Approves new golden path patterns.
- **Domain Teams.** Contribute domain-specific templates.

### 2.2  People

- **Template Engineers.** Design and maintain golden path templates.
- **Security Architects.** Review templates for compliance with security standards.
- **Developer Advocates.** Promote golden path adoption and gather feedback.

### 2.3  Processes

- **Template Design & Review.** New templates go through architectural and security review.
- **Template Versioning.** Templates follow semantic versioning with backward compatibility rules.
- **Template Testing.** Automated validation of template outputs against organisational standards.
- **Template Adoption Tracking.** Measure golden path usage vs. custom implementations.

### 2.4  Technology

- **Template Registry.** Central repository for versioned golden path templates with metadata and discovery.
- **Template Rendering Engine.** Parameterised generation of project scaffolding from templates.
- **Template Testing Framework.** Automated validation of rendered template outputs against standards.
- **Adoption Analytics.** Tracking and reporting on template usage, adoption rates, and deviation patterns.


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

Golden paths exist informally within individual teams but there is no central registry, versioning, or review process. Template reuse is opportunistic rather than systematic.

### 3.3  Maturity Roadmap

- **1 → 2.** Establish a central template registry. Codify top-5 golden paths with architectural review. Implement basic template versioning.
- **2 → 3.** Automated template testing pipeline. Adoption tracking with organisational targets. Full coverage of standard workload patterns.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Developer Experience ABB is created.

### 4.2  ABB Mapping

ABB mappings will be defined when the Developer Experience ABB is created.

### 4.3  Gaps

ABB mappings will be defined when the Developer Experience ABB is created.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-017 Golden Path & Template Management capability created. |

