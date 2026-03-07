---
title: "CAP-034 Data Sovereignty & Residency"
sidebar_label: "CAP-034 Data Sovereignty & Residency"
sidebar_position: 34
---

# CAP-034 Data Sovereignty & Residency

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-034` | Unique identifier. |
| **Capability Name** | Data Sovereignty & Residency | Human-readable name. |
| **Realizes Outcome**| [OC-009 Data Governance & Privacy](../../strategy/outcomes/OC-009/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-031` | Data Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-008 Data Management](../../platforms/PL-008/) | Parent platform. |

The organisation must enforce data residency constraints that ensure data is stored and processed only within permitted geographic jurisdictions, in compliance with sovereignty laws and contractual obligations.


## 1  Purpose

Data sovereignty laws (GDPR, data localisation mandates) require that certain data categories remain within specific jurisdictions. Without automated enforcement, sovereignty violations occur through misconfigured infrastructure, cross-region replication, or uncontrolled data transfers. This capability ensures residency constraints are enforced at provisioning time and monitored continuously.


## 2  Capability Definition

### 2.1  Organisation

- **Legal & Privacy Team.** Defines jurisdiction-specific data residency requirements.
- **Platform Engineering Team.** Implements residency controls in infrastructure provisioning.
- **Data Governance Team.** Maps data classifications to residency constraints.

### 2.2  People

- **Privacy Engineers.** Define residency rules for each data classification.
- **Platform Engineers.** Implement region-locking and transfer controls.
- **Compliance Analysts.** Monitor and report on residency compliance.

### 2.3  Processes

- **Residency Rule Definition.** Map data classifications and regulatory requirements to permitted regions.
- **Provisioning Enforcement.** Block creation of data stores in non-permitted regions.
- **Transfer Control.** Evaluate and control cross-region data movement.
- **Compliance Monitoring.** Continuous verification that data remains in permitted jurisdictions.

### 2.4  Technology

- **Residency Rule Engine.** Policy-driven mapping of data classifications to permitted geographic regions.
- **Provisioning Policy Service.** Enforces residency constraints at infrastructure provisioning time.
- **Transfer Control Gateway.** Evaluates and controls cross-region data transfers against residency policies.
- **Residency Compliance Monitor.** Continuous verification and alerting for data residency violations.


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

Data residency requirements are understood for some regulated data categories but enforcement is manual. No automated provisioning controls or transfer monitoring exists. Sovereignty compliance relies on operational procedures rather than technical controls.

### 3.3  Maturity Roadmap

- **1 → 2.** Establish sovereignty rules for regulated data categories. Implement provisioning-time region enforcement for new data stores. Deploy basic transfer monitoring for cross-region data movement.
- **2 → 3.** Real-time sovereignty compliance monitoring across all data flows. Automated transfer control for all cross-region movement. Full residency audit trail with compliance reporting.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-034 Data Sovereignty & Residency capability created. |
