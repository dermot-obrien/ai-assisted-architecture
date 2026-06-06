---
id: CAP-015
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-015 Developer Experience"
sidebar_label: "CAP-015 Developer Experience"
sidebar_position: 15
governance_zone: foundation
level: L2
parent: CAP-001
provided_by_platform: PL-004
components:
  organisation: Platform Engineering Team, Application Development Teams
  people:
    - Platform Engineers
    - Developer Advocates
    - UX Engineers
  processes:
    - Template Lifecycle
    - Self-Service Request Fulfilment
    - Catalog Curation
    - Developer Feedback Loop
  technology: Self-Service Provisioning Engine, Template Registry, Service Catalog & Portal, Developer CLI & SDK
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-015 Developer Experience

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-015` | Unique identifier. |
| **Capability Name** | Developer Experience | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-004 Developer Experience](../../platforms/PL-004/) | Parent platform. |

The organisation must provide self-service tooling, golden paths, and a unified service catalog so that developers can consume platform capabilities without manual intervention or deep infrastructure knowledge.


## 1  Purpose

Without a coherent developer experience layer, platform capabilities remain inaccessible or inconsistently consumed. Each team builds bespoke provisioning scripts and deployment pipelines, leading to drift, duplication, and slow onboarding. Developer Experience ensures the platform is consumable, discoverable, and efficient.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns developer-facing tooling and self-service interfaces.
- **Application Development Teams.** Consume platform services through the portal and golden paths.

### 2.2  People

- **Platform Engineers.** Build and maintain self-service workflows and templates.
- **Developer Advocates.** Define golden paths and maintain documentation.
- **UX Engineers.** Design portal interfaces and developer journeys.

### 2.3  Processes

- **Template Lifecycle.** Design, review, publish, version, and retire templates.
- **Self-Service Request Fulfilment.** Automated provisioning triggered by developer portal actions.
- **Catalog Curation.** Register, classify, and maintain service catalog entries.
- **Developer Feedback Loop.** Collect usage metrics and satisfaction signals to improve platform experience.

### 2.4  Technology

- **Self-Service Provisioning Engine.** Automated resource provisioning triggered by developer requests.
- **Template Registry.** Central repository for golden path templates with versioning and metadata.
- **Service Catalog & Portal.** Unified developer interface for discovering and consuming platform capabilities.
- **Developer CLI & SDK.** Command-line and programmatic interfaces for platform interaction.


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

Self-service provisioning exists for a limited set of resources. No unified portal or service catalog. Golden paths are informal and team-specific.

### 3.3  Maturity Roadmap

- **1 → 2.** Establish a central portal with catalog of available services. Codify top-5 golden paths as versioned templates.
- **2 → 3.** Full self-service coverage for standard workloads. Automated template testing and promotion pipeline.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-015 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-016](../CAP-016/) (Self-Service Provisioning), [CAP-017](../CAP-017/) (Golden Path & Template Management), [CAP-018](../CAP-018/) (Service Catalog & Developer Portal), and [CAP-043](../CAP-043/) (Environment Lifecycle Management) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-016](../CAP-016/) | Self-Service Provisioning | L3 | 1 |
| [CAP-017](../CAP-017/) | Golden Path & Template Management | L3 | 1 |
| [CAP-018](../CAP-018/) | Service Catalog & Developer Portal | L3 | 1 |
| [CAP-043](../CAP-043/) | Environment Lifecycle Management | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-015 Developer Experience capability created. |

