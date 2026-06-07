---
id: CAP-018
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-018 Service Catalog & Developer Portal"
sidebar_label: "CAP-018 Service Catalog & Developer Portal"
sidebar_position: 18
governance_zone: foundation
level: L3
parent: CAP-015
provided_by_platform: PL-004
required_by_outcomes:
  - OC-005
components:
  organisation: Platform Engineering Team, All Service-Owning Teams, Architecture Team
  people:
    - Portal Engineers
    - Service Owners
    - Technical Writers
  processes:
    - Service Registration
    - Catalog Curation
    - Deprecation & Sunset
  technology: Service Catalog Platform, Developer Portal, API Documentation Engine, Ownership Registry
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

# CAP-018 Service Catalog & Developer Portal

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-018` | Unique identifier. |
| **Capability Name** | Service Catalog & Developer Portal | Human-readable name. |
| **Realises Outcome**| [OC-005 Developer Self-Service Efficiency](../../strategy/outcomes/OC-005/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-015` | Developer Experience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-004 Developer Experience](../../platforms/PL-004/) | Parent platform. |

The organisation must maintain a unified, searchable catalog of all platform services, APIs, components, and their ownership, with a portal that provides a single entry point for developers to discover, understand, and consume platform capabilities.


## 1  Purpose

Platform capabilities are useless if developers cannot find them. A service catalog with ownership metadata, documentation, and health status reduces duplication, improves reuse, and ensures accountability. The developer portal is the primary interface for platform consumption.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns the portal and catalog infrastructure.
- **All Service-Owning Teams.** Responsible for maintaining their catalog entries.
- **Architecture Team.** Defines catalog taxonomy and metadata standards.

### 2.2  People

- **Portal Engineers.** Build and maintain the developer portal.
- **Service Owners.** Register and maintain their catalog entries.
- **Technical Writers.** Maintain documentation standards and templates.

### 2.3  Processes

- **Service Registration.** New services must be registered with ownership, documentation, and SLO metadata.
- **Catalog Curation.** Periodic review of catalog entries for accuracy and completeness.
- **Deprecation & Sunset.** Structured process for marking services as deprecated and communicating timelines.

### 2.4  Technology

- **Service Catalog Platform.** Searchable registry of all platform services with ownership and lifecycle metadata.
- **Developer Portal.** Unified web interface for discovering, understanding, and consuming platform capabilities.
- **API Documentation Engine.** Automated generation and hosting of API reference documentation.
- **Ownership Registry.** Authoritative source for service ownership, escalation paths, and support channels.


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

Service ownership is tracked informally. No unified portal or catalog exists. API documentation is scattered across wikis and repositories with inconsistent formats.

### 3.3  Maturity Roadmap

- **1 → 2.** Deploy a central service catalog with mandatory registration for all new services. Establish a developer portal with basic discovery and documentation.
- **2 → 3.** Full catalog coverage with automated freshness checks. Portal integrated with provisioning and golden path workflows. Deprecation process enforced.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-018 Service Catalog & Developer Portal capability created. |

