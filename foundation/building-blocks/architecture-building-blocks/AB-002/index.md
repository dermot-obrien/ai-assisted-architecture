---
title: "AB-002 Observability"
sidebar_label: "AB-002 Observability"
sidebar_position: 2
---
# Observability

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **ABB ID** | `AB-002` | Unique identifier. Sequential numbering, zero-padded to 3 digits. |
| **ABB Name** | Observability | Human-readable name of the building block. |
| **Short Name** | OBS | Used in diagrams and cross-references. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `DRAFT` | Current lifecycle status. |
| **Category** | `Operational Excellence` | Logical grouping. |

Defines the technology-agnostic capabilities, interfaces, and functional requirements for collecting, correlating, storing, and surfacing the signals that make every building block in the architecture observable, auditable, and compliant.


## 1  Purpose

An architecture is only as trustworthy as its ability to answer *what happened, when, and why*. This building block exists to provide a unified observability capability that every other building block emits signals into and every operations, security, and compliance function consumes signals from. It covers distributed tracing, metrics collection, log aggregation, audit-trail immutability, alerting, dashboarding, and compliance reporting. By centralising these concerns, the architecture achieves consistent operational visibility, tamper-evident audit records, and regulatory-ready compliance data across all dependent building blocks.


## 2  Building block


### 2.1  Component Diagram

The diagram below shows the full scope boundary of the Observability ABB. The Ingestion group receives signals from producer building blocks. The Processing group correlates, enriches, and routes signals. The Storage group persists data across retention tiers. The Consumption group surfaces signals to human operators and downstream systems. Two cross-cutting sub-ABBs (Identity & Access Management and Governance & Policy) span the bottom of the diagram.

![AB-002 Observability Component Diagram](./components.png)


### 2.2  Fundamental functionality

- **Trace Collector.** Receives distributed trace spans from producer building blocks. Assembles spans into end-to-end traces that cross building block boundaries, enabling root-cause analysis across the architecture.
- **Metrics Collector.** Receives time-series metrics (counters, gauges, histograms) from producer building blocks. Supports push and pull collection models.
- **Log Aggregator.** Receives structured and semi-structured log entries from producer building blocks. Normalises log formats to a common schema for cross-building-block correlation.
- **Audit Ingestion.** Receives append-only audit events (decisions, state transitions, identity actions, policy evaluations) from producer building blocks. Ensures events are tamper-evident from the point of ingestion.
- **Signal Correlation Engine.** Correlates traces, metrics, logs, and audit events using shared context identifiers (trace IDs, request IDs, session IDs). Produces unified views that link operational signals to audit records.
- **Signal Enrichment.** Augments raw signals with contextual metadata (building block identity, environment, deployment version, data classification) to support filtering, routing, and compliance tagging.
- **Alert Evaluation.** Evaluates incoming signals against defined alert rules (threshold breaches, anomaly detection, absence-of-signal). Produces alert events routed to notification channels.
- **Hot Storage.** Stores recent signals (hours to days) in a low-latency, queryable store optimised for interactive investigation and real-time dashboards.
- **Warm Storage.** Stores medium-term signals (days to months) in a cost-optimised, queryable store for trend analysis and incident retrospectives.
- **Cold Storage.** Stores long-term signals (months to years) in an immutable, compliance-grade archive for regulatory retention, forensic review, and legal hold.
- **Dashboard Engine.** Renders operational dashboards from hot and warm storage. Supports drill-down from high-level health indicators to individual traces, metrics, and log entries.
- **Query Interface.** Provides a structured query capability over all storage tiers for ad-hoc investigation, incident response, and compliance evidence gathering.
- **Compliance Reporting.** Generates regulatory and governance reports from audit and observability data. Produces evidence artefacts for GDPR, AI Act, and internal audit programmes.
- **Notification Router.** Delivers alert events and escalations to human operators and automated response systems via configured notification channels (messaging, email, ticketing).

### 2.3  Attributes

- **Scalability.** Ingestion pipelines scale horizontally to absorb signal volume from all producer building blocks without back-pressure that would degrade producers.
- **Resilience.** Signal loss is minimised through buffering, retry, and at-least-once delivery guarantees. Storage tiers are independently resilient.
- **Immutability.** Audit data in cold storage is append-only and tamper-evident. Write-once semantics prevent retroactive modification of compliance records.
- **Extensibility.** New signal types, enrichment rules, alert conditions, and compliance report templates can be added without modifying the core ingestion pipeline.
- **Timeliness.** Hot-path signals are available for dashboards and alerts within seconds of emission. Cold-path signals are available for compliance queries within the defined ingestion window.

### 2.4  Semantic

"Observability" is the architectural capability that transforms raw signals emitted by building blocks into actionable operational intelligence, auditable compliance evidence, and forensic investigation data. The building block boundary encompasses all components required to ingest, correlate, store, alert on, and surface these signals. It excludes the instrumentation code within producer building blocks (those building blocks own their own signal emission) but defines the interfaces and schemas that instrumentation must conform to. It also excludes the incident-management workflow (ticketing, war-room coordination) which is an operational process, not an observability component.

### 2.5  Identity & Access Management

- **Authentication model.** All signal producers authenticate to the observability ingestion endpoints using building-block-level workload identity. No shared API keys or static credentials.
- **Authorisation approach.** Read access to observability data is governed by role-based access control scoped to building block, environment, and data classification. Audit data requires elevated privileges with just-in-time access.
- **Non-human identity.** The observability platform's own components (collectors, processors, storage services) authenticate to each other and to dependent infrastructure using workload identity federation.
- **Credential management.** Ingestion endpoint credentials are short-lived tokens issued via federated credential exchange. Encryption keys for audit storage are managed in hardware security modules or platform key vaults.

### 2.6  Observability

As the Observability ABB itself, this section describes the platform's own observability posture:

- **Signals emitted.** The observability platform emits meta-telemetry: ingestion throughput, processing latency, storage utilisation, alert evaluation rates, and query response times. These signals are routed to a separate meta-monitoring pipeline to avoid circular dependencies.
- **Audit trail.** Configuration changes to alert rules, dashboard definitions, retention policies, and access-control grants are recorded in the platform's own append-only audit log.
- **Health and liveness.** Each component (collector, processor, storage tier, dashboard engine) exposes health and liveness probes. A meta-monitoring dashboard tracks the observability platform's own operational health.
- **Compliance data feeds.** The platform produces compliance artefacts attesting to its own data-retention adherence, access-control enforcement, and tamper-evidence guarantees.

### 2.7  Governance & Policy Enforcement

- **Policy enforcement.** Data-retention policies govern how long signals are stored in each tier and when they are purged or archived. Access policies enforce who can query which data at which classification level.
- **Regulatory alignment.** The Observability ABB supports GDPR (right to erasure balanced against lawful retention for audit), EU AI Act (Article 12 logging requirements, Article 14 human oversight evidence), and organisational record-keeping obligations.
- **Data classification.** Observability signals may contain PII (user identifiers in traces, IP addresses in logs) and sensitive business data (decision outcomes in audit trails). Classification tags applied at ingestion govern routing, retention, and access.
- **Change governance.** Alert rules, dashboard configurations, retention policies, and enrichment rules are managed through version-controlled change-request workflows with mandatory review and approval.


## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Producer → Observability | Trace spans | Distributed trace spans emitted by a producer building block for end-to-end request tracing. |
| **I2** | Producer → Observability | Metrics | Time-series metrics (counters, gauges, histograms) emitted by a producer building block. |
| **I3** | Producer → Observability | Log entries | Structured log entries emitted by a producer building block, conforming to the common log schema. |
| **I4** | Producer → Observability | Audit events | Append-only audit events (decisions, state transitions, identity actions) from a producer building block. |
| **I5** | Observability → Consumer | Query results | Results from ad-hoc or scheduled queries against any storage tier. |
| **I6** | Observability → Consumer | Dashboard feed | Real-time and near-real-time data feeds powering operational and compliance dashboards. |
| **I7** | Observability → Notification | Alert event | Alert events delivered to notification channels (messaging, email, ticketing) for human or automated response. |
| **I8** | Observability → Governance | Compliance report | Regulatory and governance reports generated from audit and observability data. |
| **I9** | Observability → IAM | Access request | Authentication and authorisation requests for signal producers and data consumers. |
| **I10** | Admin → Observability | Configuration | Alert rules, retention policies, enrichment rules, and dashboard definitions managed via administrative interface. |

### 3.2  Interoperability

The ingestion interfaces (I1/I2/I3) use standards-based telemetry protocols and schemas, enabling any building block that conforms to the common signal format to emit data without bespoke integration. The audit interface (I4) defines an append-only event schema with mandatory fields (event type, timestamp, actor, resource, outcome) that all producer building blocks must populate. The query interface (I5) provides a normalised query model over all storage tiers, abstracting the underlying storage technology.

### 3.3  Dependent building blocks

| ABB | Required functionality | Named interface |
|-----|----------------------|-----------------|
| Any Producer ABB → Observability | Trace, metric, log, and audit signal emission | I1, I2, I3, I4 |
| Observability → Any Consumer | Query and dashboard access to observability data | I5, I6 |
| Observability → Notification Systems | Alert event delivery to operators and automation | I7 |
| Observability → Governance & Policy | Compliance reports and governance data feeds | I8 |
| Observability → IAM | Authentication and authorisation for producers and consumers | I9 |


## 4  Mapping

### 4.1  Mapping to business/organisational entities

- **Trace Collector / Metrics Collector / Log Aggregator** → Enterprise monitoring and operations function.
- **Audit Ingestion / Cold Storage** → Enterprise compliance, internal audit, and legal hold functions.
- **Alert Evaluation / Notification Router** → Site reliability engineering, security operations centre (SOC), and on-call teams.
- **Dashboard Engine / Query Interface** → Engineering teams, platform teams, and business operations.
- **Compliance Reporting** → Data protection office, regulatory compliance team, and external auditors.
- **Administrative Operations** → Platform engineering and observability team.

### 4.2  Mapping to business/organisational policies

- **Operational Risk Policy.** All building blocks emit operational signals; the observability platform provides the single source of truth for incident detection, investigation, and resolution.
- **Data Retention Policy.** Signals are stored across tiered retention schedules (hot, warm, cold) aligned with regulatory and organisational retention requirements. Purge and archive operations are automated and auditable.
- **Information Security Policy.** Access to observability data is authenticated, authorised, and logged. Sensitive signals (PII, business-critical decisions) are classified at ingestion and protected accordingly.
- **Regulatory Compliance Policy.** Audit trails and compliance reports support GDPR, EU AI Act, and internal audit obligations. Tamper-evident storage provides forensic-grade evidence.
- **AI Transparency Policy.** AI agent decision traces, reasoning logs, and human-oversight records are captured and retained as evidence of responsible AI operation.
- **Incident Management Policy.** Alert events flow to the incident-management process; the observability platform provides the investigation and evidence-gathering capability that the process depends on.


### 4.3  Mapping to capabilities

| Capability ID | Capability Name | Relationship |
|---------------|-----------------|-------------|
| [CAP-006](../../../capabilities/CAP-006/) | Operational Monitoring & Alerting | `primary` |
| [CAP-007](../../../capabilities/CAP-007/) | Compliance Evidence & Reporting | `supporting` |
| [CAP-004](../../../capabilities/CAP-004/) | Identity Lifecycle Management | `cross-cutting` |
| [CAP-005](../../../capabilities/CAP-005/) | Policy-Based Access Control | `cross-cutting` |


## 5. Solution Building Block (SBB) Guidance

### 5.1  Structural Pattern for Observability SBBs

Each Observability SBB maps the technology-agnostic components defined here to specific products and services from a cloud provider or observability platform. The SBB should include:

**Ingestion Services**
Maps AB-002's trace, metric, log, and audit collectors to the target platform's ingestion endpoints, agents, and SDKs.

**Processing and Correlation**
Maps AB-002's signal correlation engine and enrichment components to the platform's processing pipelines, transformation rules, and tagging capabilities.

**Storage Services**
Maps AB-002's hot, warm, and cold storage tiers to the platform's data stores, retention configurations, and immutability features.

**Consumption Services**
Maps AB-002's dashboard engine, query interface, compliance reporting, and notification router to the platform's visualisation, query, reporting, and alerting capabilities.

### 5.2  Shared Patterns

The following patterns and capabilities are inherited directly from AB-002; do not replicate them in the SBB:

- **Tiered Retention Model.** Hot, warm, and cold storage with defined retention schedules. The SBB specifies *which products* implement each tier, not *whether* to tier.
- **Tamper-Evident Audit.** Audit data is append-only and immutable. The SBB specifies *how* immutability is achieved, not *whether* to enforce it.
- **Common Signal Schema.** All producers conform to a common trace, metric, log, and audit schema. The SBB specifies *which protocol* carries the schema, not *whether* to normalise.

### 5.3  Platform-Specific Constraints

Each Observability SBB should document:

- **Ingestion Protocols** — Which telemetry protocols and SDKs the platform supports for traces, metrics, and logs.
- **Retention Limits** — Maximum retention per tier, storage cost model, and purge automation.
- **Query Capabilities** — Query language, cross-tier query support, and query rate limits.
- **Alert Capabilities** — Supported alert condition types (threshold, anomaly, absence), evaluation frequency, and notification channel integrations.
- **Compliance Features** — Immutable storage options, legal hold support, and audit-export formats.
- **Scalability Limits** — Ingestion throughput ceilings, concurrent query limits, and dashboard rendering capacity.


## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | AB-002 Observability ABB created. |
