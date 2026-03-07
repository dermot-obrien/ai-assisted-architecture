---
title: "CAP-025 Disaster Recovery & Business Continuity"
sidebar_label: "CAP-025 Disaster Recovery & Business Continuity"
sidebar_position: 25
---

# CAP-025 Disaster Recovery & Business Continuity

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-025` | Unique identifier. |
| **Capability Name** | Disaster Recovery & Business Continuity | Human-readable name. |
| **Realizes Outcome**| [OC-007 Service Reliability Target](../../../strategy/outcomes/OC-007/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-023` | Reliability & Resilience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-006 Reliability & Resilience](../../platforms/PL-006/) | Parent platform. |

The organisation must maintain documented, tested recovery procedures for all critical platform services, with defined RTO/RPO targets and regular validation through exercises.


## 1  Purpose

A disaster recovery plan that has never been tested is a hypothesis, not a capability. This capability ensures recovery procedures exist, are maintained as systems evolve, and are validated through regular exercises that build organisational muscle memory.


## 2  Capability Definition

### 2.1  Organisation

- **Business Continuity Team.** Coordinates DR strategy and exercises.
- **Platform Engineering Team.** Implements DR infrastructure (replication, failover, backup).
- **Service Owners.** Define RTO/RPO requirements for their services.

### 2.2  People

- **DR Coordinators.** Plan and run recovery exercises.
- **Platform Engineers.** Implement replication and failover automation.
- **Service Owners.** Participate in exercises and validate recovery completeness.

### 2.3  Processes

- **DR Plan Maintenance.** Update recovery procedures when systems change.
- **Recovery Exercise.** Scheduled failover and recovery drills.
- **RTO/RPO Validation.** Measure actual recovery times against targets.
- **Post-Exercise Review.** Capture lessons learned and update procedures.

### 2.4  Technology

- **Backup & Replication Service.** Automated data replication and backup across regions and zones.
- **Failover Orchestrator.** Automated failover sequencing and traffic redirection.
- **DR Exercise Platform.** Controlled environment for running recovery exercises.
- **Recovery Validation Dashboard.** Tracking of RTO/RPO targets against actual recovery performance.


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

Disaster recovery plans exist for critical services but are rarely tested. RTO/RPO targets are informally defined. No structured exercise programme.

### 3.3  Maturity Roadmap

- **1 → 2.** Document DR procedures for all Tier-1 services. Define formal RTO/RPO targets. Conduct first recovery exercise.
- **2 → 3.** Automated DR failover testing. Regular exercise cadence. Recovery validation against RTO/RPO targets for all service tiers.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Reliability & Resilience ABB is created.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| — | — | — | — | ABB mappings will be defined when the Reliability & Resilience ABB is created. |

### 4.3  Gaps

ABB mappings pending creation of the Reliability & Resilience ABB.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-025 Disaster Recovery & Business Continuity capability created. |
