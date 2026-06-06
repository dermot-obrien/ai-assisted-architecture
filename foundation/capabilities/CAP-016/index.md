---
id: CAP-016
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-016 Self-Service Provisioning"
sidebar_label: "CAP-016 Self-Service Provisioning"
sidebar_position: 16
---

# CAP-016 Self-Service Provisioning

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-016` | Unique identifier. |
| **Capability Name** | Self-Service Provisioning | Human-readable name. |
| **Realizes Outcome**| [OC-005 Developer Self-Service Efficiency](../../../strategy/outcomes/OC-005/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-015` | Developer Experience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-004 Developer Experience](../../platforms/PL-004/) | Parent platform. |

The organisation must enable developers to provision infrastructure, environments, and application components through automated self-service workflows that enforce organisational standards without requiring manual approval for standard requests.


## 1  Purpose

Manual provisioning is the single largest source of developer wait time and platform team toil. Self-service provisioning decouples developer velocity from platform team capacity while maintaining guardrails through policy-as-code.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns provisioning automation.
- **Security and Compliance Teams.** Define guardrails enforced at provisioning time.

### 2.2  People

- **Platform Engineers.** Build provisioning workflows.
- **DevOps Engineers.** Consume and extend provisioning capabilities.
- **Policy Authors.** Define constraints applied during provisioning.

### 2.3  Processes

- **Standard Provisioning Request.** Developer selects resource type, parameters applied, guardrails checked, resource provisioned automatically.
- **Exception Provisioning.** Non-standard requests routed for manual review.
- **Provisioning Audit.** All provisioning events logged with identity, parameters, and policy decisions.

### 2.4  Technology

- **Infrastructure-as-Code Engine.** Declarative resource provisioning with drift detection and reconciliation.
- **Provisioning Orchestrator.** Workflow engine coordinating multi-step provisioning sequences.
- **Policy Evaluation Service (from ABB-003).** Real-time policy checks applied at provisioning time.
- **Provisioning Event Log.** Immutable audit trail of all provisioning actions and outcomes.


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

Self-service provisioning exists for a limited set of resources but coverage is incomplete and workflows are not standardised across teams.

### 3.3  Maturity Roadmap

- **1 → 2.** Automate provisioning for the top-10 most requested resource types. Integrate policy evaluation into all provisioning workflows.
- **2 → 3.** Full self-service coverage for all standard workloads. Provisioning SLAs tracked and enforced. Exception provisioning path well-defined and measured.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-016 Self-Service Provisioning capability created. |
