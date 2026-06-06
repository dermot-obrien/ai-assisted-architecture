---
id: CAP-007
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-007 Compliance Evidence & Reporting"
sidebar_label: "CAP-007 Compliance Evidence & Reporting"
sidebar_position: 7
---

# CAP-007 Compliance Evidence & Reporting

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-007` | Unique identifier. |
| **Capability Name** | Compliance Evidence & Reporting | Human-readable name. |
| **Realizes Outcome**| [OC-004 Continuous Compliance Audit](../../../strategy/outcomes.md#oc-004-continuous-compliance-audit) | Primary strategic goal. |
| **Enables Use Case**| [UC-003 Real-time Policy Decision Evaluation](../../../strategy/use-cases.md#uc-003-real-time-policy-decision-evaluation) | Primary operational scenario. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-003` | Operational Intelligence. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-003 Governance & Compliance](../../platforms/PL-003/) | Parent platform. |

The organisation must be able to collect, store, and report on compliance evidence — audit trails, policy decision records, configuration snapshots, and access reviews — to demonstrate adherence to regulatory and internal obligations at any point in time.


## 1  Purpose

Regulatory requirements (GDPR, EU AI Act, industry-specific regulations) demand demonstrable compliance, not just asserted compliance. This capability ensures the architecture produces tamper-evident audit trails, maps policies to regulatory requirements, collects evidence artefacts from all building blocks, and generates formatted compliance reports for internal audit, external regulators, and management review. It draws on both the Governance ABB (which tracks regulatory mappings and collects evidence) and the Observability ABB (which provides the immutable audit storage and signal infrastructure).


## 2  Capability Definition

### 2.1  Organisation

- **Compliance & Audit Team.** Owns the compliance evidence lifecycle: evidence definition, collection, storage, and reporting.
- **Data Protection Office.** Ensures data-subject rights and privacy obligations are evidenced in compliance records.
- **Internal Audit.** Consumes compliance reports and conducts independent assessments against regulatory requirements.
- **Risk Management.** Tracks policy exceptions, compensating controls, and risk-acceptance decisions.

### 2.2  People

- **Compliance Analysts.** Map regulatory requirements to organisational policies and define the evidence needed for each requirement.
- **Audit Engineers.** Implement automated evidence collection from building blocks and configure compliance report generation.
- **Legal Counsel.** Advise on regulatory interpretation and review compliance evidence for external submissions.

### 2.3  Processes

- **Evidence Collection.** Automated and manual gathering of compliance artefacts (audit logs, policy decisions, access reviews, configuration snapshots) from building blocks.
- **Regulatory Mapping.** Continuous mapping of organisational policies to regulatory requirements, with gap identification and remediation tracking.
- **Compliance Reporting.** Scheduled and on-demand production of compliance reports for internal and external audiences.
- **Exception Governance.** Recording, reviewing, and expiring policy exceptions with compensating controls and risk-owner accountability.

### 2.4  Technology

- **Compliance Evidence Store.** Immutable, tamper-evident storage for audit trails and compliance artefacts with legal-hold support.
- **Regulatory Compliance Manager.** Mapping engine that links organisational policies to regulatory requirements and tracks compliance status per requirement.
- **Compliance Report Generator.** Produces formatted reports for regulatory submissions, internal audit, and management dashboards.
- **Exception Management Service.** Tracks policy exceptions with scope, justification, approver, expiry, and compensating controls.

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
| **Assessment Date** | 2026-03-07 |
| **Assessor** | Architecture Team |

Compliance evidence is gathered manually from individual building blocks. Regulatory mappings are maintained in spreadsheets with no automated gap detection. Compliance reports are produced manually and are labour-intensive. Policy exceptions are tracked informally.

### 3.3  Maturity Roadmap

- **1 → 2.** Automate evidence collection from building blocks using standardised evidence schemas. Implement a regulatory mapping tool with gap tracking. Automate basic compliance report generation.
- **2 → 3.** Achieve continuous compliance monitoring with automated evidence freshness checks. Implement exception management with automated expiry alerts. Produce regulatory-ready reports on demand.


## 4  ABB Realisation

### 4.1  Relationship Model

This capability illustrates the **many-to-many relationship** in a different pattern from CAP-005. Here, the Governance ABB is primary (it owns the compliance logic) and the Observability ABB is supporting (it provides the storage and signal infrastructure that compliance depends on). Both ABBs are essential, but the Governance ABB drives the compliance domain logic while Observability provides the data platform.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [ABB-003](../../building-blocks/architecture-building-blocks/ABB-003/) | Governance & Policy Enforcement | `primary` | `full` | Provides regulatory compliance manager, compliance evidence collector, compliance report generator, exception manager, and policy-to-regulation mapping. |
| [ABB-002](../../building-blocks/architecture-building-blocks/ABB-002/) | Observability | `supporting` | `partial` | Provides immutable cold storage for audit trails, audit ingestion pipeline, and compliance reporting infrastructure. Does not provide regulatory mapping or exception management. |
| [ABB-001](../../building-blocks/architecture-building-blocks/ABB-001/) | Identity & Access Management | `cross-cutting` | `full` | Authenticates and authorises access to compliance evidence and reports. Provides identity audit trails as compliance evidence. |

### 4.3  Gaps

All technology needs are realised by the combination of ABB-003 and ABB-002. No gaps exist when both ABBs are implemented.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-007 Compliance Evidence & Reporting capability created. |
