---
title: "CAP-026 Chaos Engineering & Resilience Testing"
sidebar_label: "CAP-026 Chaos Engineering & Resilience Testing"
sidebar_position: 26
---

# CAP-026 Chaos Engineering & Resilience Testing

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-026` | Unique identifier. |
| **Capability Name** | Chaos Engineering & Resilience Testing | Human-readable name. |
| **Realizes Outcome**| [OC-007 Service Reliability Target](../../../strategy/outcomes/OC-007/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-023` | Reliability & Resilience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-006 Reliability & Resilience](../../platforms/PL-006/) | Parent platform. |

The organisation must proactively test system resilience through controlled fault injection experiments that validate failure handling, redundancy, and graceful degradation under adverse conditions.


## 1  Purpose

Systems fail in unexpected ways. Chaos engineering discovers these failure modes before they cause incidents by deliberately injecting faults (network partitions, resource exhaustion, dependency failures) in controlled conditions. This builds confidence in system resilience and identifies weaknesses before customers do.


## 2  Capability Definition

### 2.1  Organisation

- **SRE Team.** Owns the chaos engineering practice and tooling.
- **Service Owners.** Participate in experiment design and observe results.
- **Security Team.** Reviews experiments for safety and blast-radius controls.

### 2.2  People

- **Chaos Engineers.** Design and execute fault injection experiments.
- **SREs.** Analyse experiment results and identify remediation actions.
- **Service Owners.** Define steady-state hypotheses for their services.

### 2.3  Processes

- **Experiment Design.** Define hypothesis, blast radius, abort conditions, and success criteria.
- **Experiment Execution.** Inject faults with automated safety controls.
- **Result Analysis.** Compare actual vs. expected behaviour.
- **Remediation Tracking.** Create and track work items for discovered weaknesses.

### 2.4  Technology

- **Fault Injection Framework.** Controlled injection of faults (latency, errors, resource exhaustion) into target services.
- **Experiment Orchestrator.** Scheduling, sequencing, and safety controls for chaos experiments.
- **Steady-State Monitor.** Real-time monitoring of system behaviour during experiments.
- **Experiment Results Dashboard.** Tracking of experiment outcomes, findings, and remediation status.


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

No chaos engineering practice exists. Resilience testing is limited to occasional manual failover tests for critical services.

### 3.3  Maturity Roadmap

- **1 → 2.** Establish chaos engineering practice. Run first experiments on non-production environments. Define experiment safety framework.
- **2 → 3.** Regular chaos experiments across all tiers. Automated experiment scheduling. Integrated remediation tracking with engineering backlog.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-026 Chaos Engineering & Resilience Testing capability created. |
