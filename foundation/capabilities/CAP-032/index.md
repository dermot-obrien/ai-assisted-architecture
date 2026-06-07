---
id: CAP-032
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-032 Data Classification & Privacy"
sidebar_label: "CAP-032 Data Classification & Privacy"
sidebar_position: 32
governance_zone: foundation
level: L3
parent: CAP-031
provided_by_platform: PL-008
required_by_outcomes:
  - OC-009
components:
  organisation: Data Governance Team, Legal & Privacy Team, Data Owners
  people:
    - Data Stewards
    - Privacy Engineers
    - Data Owners
  processes:
    - Classification Assignment
    - Classification Review
    - Privacy Control Mapping
    - Data Discovery
  technology: Classification Engine, Data Discovery Scanner, Privacy Control Framework, Classification Audit Log
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

# CAP-032 Data Classification & Privacy

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-032` | Unique identifier. |
| **Capability Name** | Data Classification & Privacy | Human-readable name. |
| **Realises Outcome**| [OC-009 Data Governance & Privacy](../../strategy/outcomes/OC-009/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-031` | Data Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-008 Data Management](../../platforms/PL-008/) | Parent platform. |

The organisation must classify all data by sensitivity level and apply appropriate privacy controls, ensuring that personal and sensitive data is handled in accordance with regulatory requirements and organisational policy.


## 1  Purpose

Unclassified data is ungoverned data. Without classification, there is no basis for applying differential security controls, access policies, or retention rules. Classification is the foundation upon which all other data governance capabilities depend.


## 2  Capability Definition

### 2.1  Organisation

- **Data Governance Team.** Owns the classification taxonomy and policies.
- **Legal & Privacy Team.** Defines regulatory-driven classification requirements.
- **Data Owners.** Are accountable for the classification of their data assets.

### 2.2  People

- **Data Stewards.** Apply and maintain classification labels.
- **Privacy Engineers.** Implement controls based on classification levels.
- **Data Owners.** Approve classification decisions for their assets.

### 2.3  Processes

- **Classification Assignment.** Label data stores and fields at creation or discovery.
- **Classification Review.** Periodic review of classification accuracy.
- **Privacy Control Mapping.** Map classification levels to required privacy controls.
- **Data Discovery.** Identify and classify unclassified or shadow data stores.

### 2.4  Technology

- **Classification Engine.** Automated discovery and labelling of data stores by sensitivity level.
- **Data Discovery Scanner.** Identifies unclassified data stores and shadow data across the platform.
- **Privacy Control Framework.** Maps classification levels to enforceable privacy controls and access policies.
- **Classification Audit Log.** Immutable record of all classification decisions and changes.


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

Data classification is informal and inconsistent. Some teams apply labels manually but there is no platform-wide taxonomy or automated discovery. Privacy controls are not systematically mapped to classification levels.

### 3.3  Maturity Roadmap

- **1 → 2.** Define and publish a platform-wide classification taxonomy. Deploy automated classification for new data stores. Map classification levels to baseline privacy controls.
- **2 → 3.** Automated discovery and classification of all existing data stores. Continuous classification accuracy monitoring. Full privacy control enforcement based on classification level.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Data Management ABB is created.

### 4.2  ABB Mapping

No ABB mappings defined yet.

### 4.3  Gaps

ABB realisation pending creation of the Data Management architecture building block.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-032 Data Classification & Privacy capability created. |

