---
id: CAP-031
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-031 Data Management"
sidebar_label: "CAP-031 Data Management"
sidebar_position: 31
governance_zone: foundation
level: L2
parent: CAP-001
provided_by_platform: PL-008
components:
  organisation: Data Governance Team, Legal & Privacy Team, Platform Engineering Team
  people:
    - Data Stewards
    - Privacy Engineers
    - Platform Engineers
  processes:
    - Data Classification
    - Retention Enforcement
    - Sovereignty Validation
    - Privacy Impact Assessment
  technology: Classification Engine, Retention Policy Engine, Sovereignty Enforcement Service, Data Catalog & Lineage
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-031 Data Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-031` | Unique identifier. |
| **Capability Name** | Data Management | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-008 Data Management](../../platforms/PL-008/) | Parent platform. |

The organisation must be able to classify, govern, and manage data throughout its lifecycle, ensuring compliance with privacy regulations, retention requirements, and sovereignty constraints.


## 1  Purpose

Data is the organisation's most valuable and most regulated asset. Without data management capabilities, sensitive data is stored without classification, retained indefinitely, and moved across jurisdictions without controls. This capability group ensures every data store is classified, every retention rule is enforced, and every sovereignty constraint is respected.


## 2  Capability Definition

### 2.1  Organisation

- **Data Governance Team.** Owns classification standards and lifecycle policies.
- **Legal & Privacy Team.** Defines regulatory requirements and sovereignty constraints.
- **Platform Engineering Team.** Implements data management controls in infrastructure.

### 2.2  People

- **Data Stewards.** Classify data and maintain governance metadata.
- **Privacy Engineers.** Implement privacy controls and data handling rules.
- **Platform Engineers.** Build lifecycle automation and sovereignty enforcement.

### 2.3  Processes

- **Data Classification.** Apply sensitivity labels to data stores and fields at creation.
- **Retention Enforcement.** Automated archival and deletion per retention policies.
- **Sovereignty Validation.** Verify data residency compliance at provisioning and during transfers.
- **Privacy Impact Assessment.** Evaluate data processing activities for privacy risk.

### 2.4  Technology

- **Classification Engine.** Automated discovery and labelling of data stores by sensitivity level.
- **Retention Policy Engine.** Policy-driven lifecycle transitions from active through archival to deletion.
- **Sovereignty Enforcement Service.** Region-locking and transfer controls for data residency compliance.
- **Data Catalog & Lineage.** Central registry of data assets with provenance and flow tracking.


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

Some data stores have informal classification. Retention policies exist on paper but are not automated. No systematic sovereignty enforcement or data lineage tracking.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-031 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-032](../CAP-032/) (Data Classification & Privacy), [CAP-033](../CAP-033/) (Data Lifecycle & Retention), and [CAP-034](../CAP-034/) (Data Sovereignty & Residency) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-032](../CAP-032/) | Data Classification & Privacy | L3 | 1 |
| [CAP-033](../CAP-033/) | Data Lifecycle & Retention | L3 | 1 |
| [CAP-034](../CAP-034/) | Data Sovereignty & Residency | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-031 Data Management capability created. |

