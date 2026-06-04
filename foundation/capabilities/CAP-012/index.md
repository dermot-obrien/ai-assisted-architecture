---
title: "CAP-012 Compute Runtime & Scheduling"
sidebar_label: "CAP-012 Compute Runtime & Scheduling"
sidebar_position: 12
---

# CAP-012 Compute Runtime & Scheduling

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-012` | Unique identifier. |
| **Capability Name** | Compute Runtime & Scheduling | Human-readable name. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-009` | Infrastructure Services. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-011 Infrastructure](../../platforms/PL-011/) | Parent platform. |

The organisation must be able to run workloads on a consistent shared runtime with placement, scaling, lifecycle, and resilience controls that meet platform reliability and security requirements.


## 1  Purpose

Without a standard compute platform, teams maintain fragmented runtime environments that are costly, inconsistent, and difficult to govern. This capability establishes shared runtime and scheduling primitives so workloads can be deployed predictably, scaled efficiently, and recovered quickly across failure conditions.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Infrastructure Team.** Owns runtime platform architecture, cluster lifecycle, and baseline scheduling policies.
- **Site Reliability Engineering.** Defines compute availability objectives and response patterns for runtime incidents.
- **Platform Security Team.** Defines workload isolation and runtime hardening controls.

### 2.2  People

- **Runtime Platform Engineers.** Operate orchestration control plane and worker capacity.
- **Reliability Engineers.** Define runtime SLOs and failure-domain strategy.
- **Service Engineers.** Deploy workloads to the shared runtime using approved deployment patterns.

### 2.3  Processes

- **Workload Onboarding.** Onboard services onto standard runtime templates with policy and telemetry defaults.
- **Scheduling Policy Management.** Define placement, affinity, quota, and isolation rules.
- **Autoscaling Management.** Configure and tune horizontal and vertical scaling policies.
- **Patch and Upgrade Management.** Upgrade runtime components with controlled rollout and rollback procedures.

### 2.4  Technology

- **Compute Orchestration Control Plane.** Schedules workloads, manages desired state, and coordinates runtime lifecycle.
- **Execution Runtime.** Runs containerised and service workloads with isolation boundaries and resource controls.
- **Autoscaling Services.** Scales runtime resources and workloads based on demand and policy thresholds.
- **Deployment and Rollback Services.** Provides rollout strategies, health checks, and automated rollback for failed deployments.

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

Shared compute runtime patterns exist, but scheduling policy, scaling controls, and rollout governance are not consistently standardised across all workloads.

### 3.3  Maturity Roadmap

- **1 -> 2.** Standardise workload onboarding templates, baseline scheduling rules, and autoscaling defaults.
- **2 -> 3.** Establish runtime SLO dashboards, controlled upgrade automation, and policy-gated deployment promotion for all workloads.


## 4  ABB Realisation

### 4.1  Relationship Model

This capability is realised primarily by ABB-006 Compute Orchestration Platform, with ABB-007 Storage & Persistence Platform providing supporting stateful runtime patterns. Cross-cutting ABBs provide shared security, observability, and governance controls for runtime operations.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [ABB-006](../../building-blocks/architecture-building-blocks/ABB-006/) | Compute Orchestration Platform | `primary` | `full` | Provides runtime scheduling, orchestration, scaling, and deployment lifecycle controls. |
| [ABB-007](../../building-blocks/architecture-building-blocks/ABB-007/) | Storage & Persistence Platform | `supporting` | `partial` | Supports stateful runtime patterns requiring persistent data attachments. |
| [ABB-001](../../building-blocks/architecture-building-blocks/ABB-001/) | Identity & Access Management | `cross-cutting` | `full` | Provides workload identity, runtime access control, and administrator authentication. |
| [ABB-002](../../building-blocks/architecture-building-blocks/ABB-002/) | Observability | `cross-cutting` | `full` | Provides runtime telemetry, health visibility, and incident investigation signals. |
| [ABB-003](../../building-blocks/architecture-building-blocks/ABB-003/) | Governance & Policy Enforcement | `supporting` | `full` | Provides runtime policy constraints for deployment, configuration, and change control. |

### 4.3  Gaps

All technology needs are realised by the mapped ABBs.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-012 Compute Runtime & Scheduling capability created. |
