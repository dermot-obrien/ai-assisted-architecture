---
title: "CAP-003 Operational Intelligence"
sidebar_label: "CAP-003 Operational Intelligence"
sidebar_position: 3
---

# CAP-003 Operational Intelligence

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-003` | Unique identifier. |
| **Capability Name** | Operational Intelligence | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `DRAFT` | Current lifecycle status. |
| **Domain** | Platform Foundations | L1 domain. |

The organisation must be able to monitor, audit, and demonstrate compliance of all platform services through unified signal collection, correlation, and reporting. This capability group covers operational monitoring, alerting, audit-trail management, and regulatory compliance evidence production.


## 1  Purpose

A platform that cannot observe itself cannot be trusted. This capability group ensures that every building block emits standardised signals into a shared observability infrastructure, and that those signals are correlated, stored, and surfaced for operational, security, and compliance purposes. It bridges operational monitoring (real-time health and alerting) with compliance intelligence (audit trails and regulatory evidence), recognising that both draw from the same signal corpus.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Operations Team.** Operates observability infrastructure, manages alert rules, and leads incident investigation.
- **Compliance & Audit Team.** Collects compliance evidence, produces regulatory reports, and coordinates with internal and external auditors.
- **Security Operations Centre.** Monitors security signals, investigates anomalies, and escalates incidents.

### 2.2  People

- **Observability Engineers.** Design and operate signal collection, processing, and storage infrastructure.
- **Compliance Analysts.** Map organisational policies to regulatory requirements and assess compliance posture.
- **Incident Responders.** Use observability data to detect, triage, and resolve operational and security incidents.

### 2.3  Processes

- **Signal Onboarding.** Define and implement signal emission for new building blocks, ensuring schema conformance and classification tagging.
- **Alert Management.** Define, test, tune, and retire alert rules based on operational experience and incident retrospectives.
- **Compliance Reporting.** Scheduled and on-demand production of compliance evidence for regulatory and audit requirements.
- **Retention Management.** Automated tiering, archival, and purge of observability data according to retention policies.

### 2.4  Technology

- **Signal Collection Infrastructure.** Scalable ingestion pipelines for traces, metrics, logs, and audit events from all building blocks.
- **Tiered Storage.** Hot, warm, and cold storage with retention policies aligned to operational, compliance, and regulatory requirements.
- **Correlation and Alerting Engine.** Real-time signal correlation with alert evaluation and notification routing.
- **Compliance Evidence Store.** Immutable, tamper-evident storage for audit trails and regulatory evidence artefacts.


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

Basic logging and monitoring exists but signal formats are not standardised across building blocks. Compliance evidence is gathered manually. There is no unified correlation between operational signals and audit trails.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-003 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-006](../CAP-006/) (Operational Monitoring & Alerting) and [CAP-007](../CAP-007/) (Compliance Evidence & Reporting) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-006](../CAP-006/) | Operational Monitoring & Alerting | L3 | 1 |
| [CAP-007](../CAP-007/) | Compliance Evidence & Reporting | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-003 Operational Intelligence capability created. |
