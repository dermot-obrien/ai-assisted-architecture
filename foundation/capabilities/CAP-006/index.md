---
id: CAP-006
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-006 Operational Monitoring & Alerting"
sidebar_label: "CAP-006 Operational Monitoring & Alerting"
sidebar_position: 6
governance_zone: foundation
level: L3
parent: CAP-003
provided_by_platform: PL-002
required_by_outcomes:
  - OC-003
components:
  organisation: Platform Operations Team, Site Reliability Engineering, Security Operations Centre
  people:
    - Observability Engineers
    - Site Reliability Engineers
    - On-Call Responders
  processes:
    - Signal Onboarding
    - Alert Lifecycle
    - Incident Investigation
    - Capacity Planning
  technology: Trace Collection Service, Metrics Collection Service, Log Aggregation Service, Signal Correlation Engine, Alert Evaluation Engine, Dashboard Engine, Hot and Warm Storage
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-07"
  assessor: Architecture Team
realised_by_abbs:
  - ABB-002
  - ABB-001
  - ABB-003
---

# CAP-006 Operational Monitoring & Alerting

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-006` | Unique identifier. |
| **Capability Name** | Operational Monitoring & Alerting | Human-readable name. |
| **Realizes Outcome**| [OC-003 MTTD Reduction](../../../strategy/outcomes.md#oc-003-mean-time-to-detect-mttd-reduction) | Primary strategic goal. |
| **Enables Use Case**| [UC-002 Cross-Context Request Tracing](../../../strategy/use-cases.md#uc-002-cross-context-request-tracing) | Primary operational scenario. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-003` | Operational Intelligence. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-002 Observability](../../platforms/PL-002/) | Parent platform. |

The organisation must be able to collect, correlate, and act on operational signals (traces, metrics, logs) from every building block in real time, surfacing health status, performance trends, and anomalies through dashboards and automated alerts.


## 1  Purpose

Without real-time operational visibility, incidents are detected by users rather than by the platform. This capability ensures that every building block emits standardised telemetry, that signals are correlated across building-block boundaries using shared context identifiers, and that alert rules detect issues before they become customer-impacting. It covers the operational (non-compliance) aspects of observability: signal collection, correlation, tiered storage, dashboarding, alerting, and notification routing.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Operations Team.** Owns the observability infrastructure and operates the signal pipeline.
- **Site Reliability Engineering.** Defines SLIs, SLOs, and error budgets. Leads incident investigation using observability data.
- **Security Operations Centre.** Consumes security-relevant signals for threat detection and incident response.

### 2.2  People

- **Observability Engineers.** Design, deploy, and tune signal collection pipelines, dashboards, and alert rules.
- **Site Reliability Engineers.** Define and monitor SLOs. Lead cross-building-block incident investigations using correlated traces.
- **On-Call Responders.** Receive and triage alerts. Use dashboards and query interfaces for rapid incident diagnosis.

### 2.3  Processes

- **Signal Onboarding.** Define signal emission for each new building block: which traces, metrics, and logs to emit, in which format, with which classification tags.
- **Alert Lifecycle.** Create, test, tune, and retire alert rules based on operational experience. Review alert effectiveness in incident retrospectives.
- **Incident Investigation.** Use correlated traces, metrics, and logs to diagnose root cause, identify blast radius, and verify resolution.
- **Capacity Planning.** Use historical metric trends to forecast infrastructure demand and prevent capacity-driven incidents.

### 2.4  Technology

- **Trace Collection Service.** Receives distributed trace spans and assembles end-to-end traces across building-block boundaries.
- **Metrics Collection Service.** Receives time-series metrics (counters, gauges, histograms) via push or pull collection.
- **Log Aggregation Service.** Receives structured log entries and normalises them to a common schema for cross-building-block search.
- **Signal Correlation Engine.** Correlates traces, metrics, and logs using shared context identifiers (trace IDs, request IDs).
- **Alert Evaluation Engine.** Evaluates signals against alert rules (threshold, anomaly, absence) and routes alerts to notification channels.
- **Dashboard Engine.** Renders operational dashboards from hot and warm storage with drill-down from overview to individual signals.
- **Hot and Warm Storage.** Low-latency queryable storage for recent signals (hours to months).

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

Basic logging and metrics collection exists, but signal formats vary across building blocks. Distributed tracing is not yet implemented. Dashboards exist for individual services but cross-building-block views are missing. Alert rules are basic threshold checks with high noise-to-signal ratio.

### 3.3  Maturity Roadmap

- **1 → 2.** Standardise signal formats across all building blocks. Implement distributed tracing with cross-building-block correlation. Create unified operational dashboards.
- **2 → 3.** Define SLOs for all critical building blocks. Implement anomaly-based alerting alongside threshold alerts. Achieve full signal coverage (no building block without trace, metric, and log emission).


## 4  ABB Realisation

### 4.1  Relationship Model

This capability is realised primarily by ABB-002 Observability, which provides the full signal collection, correlation, storage, alerting, and dashboarding infrastructure. The cross-cutting ABBs ensure that the observability platform itself is secured and governed.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [ABB-002](../../building-blocks/architecture-building-blocks/ABB-002/) | Observability | `primary` | `full` | Provides trace collection, metrics collection, log aggregation, signal correlation, alert evaluation, dashboard engine, and tiered storage. |
| [ABB-001](../../building-blocks/architecture-building-blocks/ABB-001/) | Identity & Access Management | `cross-cutting` | `full` | Authenticates signal producers and authorises access to observability data and dashboards. |
| [ABB-003](../../building-blocks/architecture-building-blocks/ABB-003/) | Governance & Policy Enforcement | `cross-cutting` | `full` | Enforces data retention policies, data classification for observability signals, and change governance for alert rules. |

### 4.3  Gaps

All technology needs are realised by the mapped ABBs.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-006 Operational Monitoring & Alerting capability created. |

