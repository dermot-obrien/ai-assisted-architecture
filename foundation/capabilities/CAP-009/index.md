---
id: CAP-009
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-009 Infrastructure Services"
sidebar_label: "CAP-009 Infrastructure Services"
sidebar_position: 9
governance_zone: foundation
level: L2
parent: CAP-001
provided_by_platform: PL-011
components:
  organisation: Platform Infrastructure Team, Site Reliability Engineering, Security and Governance Teams
  people:
    - Platform Engineers
    - Reliability Engineers
    - Infrastructure Security Engineers
  processes:
    - Platform Provisioning
    - Runtime Release Management
    - Capacity and Cost Management
    - Backup and Recovery Management
  technology: Compute Runtime Platform, Storage Platform, Infrastructure Policy Controls, Operational Automation
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-07"
  assessor: Architecture Team
---

# CAP-009 Infrastructure Services

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-009` | Unique identifier. |
| **Capability Name** | Infrastructure Services | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-011 Infrastructure](../../platforms/PL-011/) | Parent platform. |

The organisation must be able to run and scale workloads on resilient, policy-governed infrastructure services. This capability group covers compute runtime orchestration, storage lifecycle management, and shared infrastructure controls needed by every platform service.


## 1  Purpose

Infrastructure services provide the operational substrate that all higher-order capabilities consume. Without standard infrastructure capabilities, teams create fragmented runtime platforms, inconsistent storage controls, and uneven resilience posture. Infrastructure Services defines the reusable runtime and persistence capabilities that platform teams can consume through standard interfaces and controls.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Infrastructure Team.** Owns compute and storage platform capabilities, baseline resilience patterns, and operational guardrails.
- **Site Reliability Engineering.** Defines availability, performance, and recovery objectives for shared infrastructure services.
- **Security and Governance Teams.** Define infrastructure policy constraints for network exposure, workload identity, data protection, and retention.

### 2.2  People

- **Platform Engineers.** Build and operate compute and storage platform components.
- **Reliability Engineers.** Define SLOs, failure-domain strategy, and recovery procedures for infrastructure services.
- **Infrastructure Security Engineers.** Define hardening standards and compliance controls for infrastructure baselines.

### 2.3  Processes

- **Platform Provisioning.** Provision and baseline shared compute and storage services through controlled automation workflows.
- **Runtime Release Management.** Deploy and update runtime environments with controlled rollout and rollback.
- **Capacity and Cost Management.** Forecast and right-size compute and storage capacity to meet SLOs and cost constraints.
- **Backup and Recovery Management.** Validate backup, restore, and disaster recovery objectives for critical workloads and data.

### 2.4  Technology

- **Compute Runtime Platform.** Shared runtime for containerised and service workloads with scheduling, scaling, and isolation controls.
- **Storage Platform.** Shared structured and unstructured persistence services with lifecycle, backup, and retention controls.
- **Infrastructure Policy Controls.** Guardrails for workload identity, encryption, network access, and platform configuration compliance.
- **Operational Automation.** Automated provisioning, patching, scaling, and recovery procedures for infrastructure services.


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

Infrastructure provisioning and operations are partly automated but still vary by workload team. Runtime standards and storage lifecycle controls are not yet consistently applied across all platform services.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-009 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-012](../CAP-012/) (Compute Runtime & Scheduling), [CAP-013](../CAP-013/) (Data Storage & Lifecycle Management), [CAP-014](../CAP-014/) (Network Connectivity & Security), and [CAP-044](../CAP-044/) (Service Mesh & Connectivity) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-012](../CAP-012/) | Compute Runtime & Scheduling | L3 | 1 |
| [CAP-013](../CAP-013/) | Data Storage & Lifecycle Management | L3 | 1 |
| [CAP-014](../CAP-014/) | Network Connectivity & Security | L3 | 1 |
| [CAP-044](../CAP-044/) | Service Mesh & Connectivity | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-009 Infrastructure Services capability created. |


