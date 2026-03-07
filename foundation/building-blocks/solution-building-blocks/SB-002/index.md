---
title: "SB-002 Observability Ingestion Service (OTel)"
sidebar_label: "SB-002 Observability Ingestion Service (OTel)"
sidebar_position: 2
---

# SB-002 Observability Ingestion Service (OTel)

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **SBB ID** | `SB-002` | Unique identifier. |
| **SBB Name** | Observability Ingestion Service (OTel) | Human-readable name. |
| **Short Name** | OTel Collector | Used in diagrams. |
| **Realizes ABB**| [AB-002 Observability](../../architecture-building-blocks/AB-002/) | Parent logical model. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Category** | `Operational Excellence` | Logical grouping. |

---

## 1  Purpose

This SBB realises the logical [AB-002 Observability](../../architecture-building-blocks/AB-002/) using the **OpenTelemetry (OTel) Collector** and **Azure Monitor**. It provides a unified, vendor-agnostic ingestion point for all operational and compliance signals (traces, metrics, logs, and audit events) emitted by building blocks in the architecture.

---

## 2  Building block

### 2.1  Component Diagram

The diagram below shows the physical realisation of the Observability ABB. The OTel Collector serves as the ingestion and processing hub. Signals are processed through transformation pipelines and exported to Azure Monitor (Application Insights and Log Analytics) for storage and visualization.

![SB-002 Observability Ingestion Service (OTel) Component Diagram](./components.png)

### 2.2  Product mapping (ABB → SBB)

| ABB Component | SBB Product / Service | Notes |
|---------------|----------------------|-------|
| Trace Collector | OTel OTLP Receiver | Ingests spans from OTel-instrumented services. |
| Metrics Collector | OTel Prometheus Receiver | Pulls or pushes metrics into the collector. |
| Log Aggregator | OTel Filelog Receiver | Collects container and system logs. |
| Audit Ingestion | Azure Monitor Ingestion API | Secure ingestion of tamper-evident audit logs. |
| Signal Correlation Engine | Azure Monitor (App Insights) | Automatic correlation via TraceID and SpanID. |
| Signal Enrichment | OTel Attributes Processor | Adds domain, environment, and version tags. |
| Alert Evaluation | Azure Monitor Alerts | KQL-based alert rules and evaluation. |
| Hot Storage | Azure Data Explorer (ADX) | Low-latency telemetry storage. |
| Warm Storage | Log Analytics Workspace | Standard operational signal storage. |
| Cold Storage | Azure Storage (Immutable) | WORM-compliant storage for audit logs. |
| Dashboard Engine | Azure Managed Grafana | Visualisation of metrics and traces. |
| Query Interface | Kusto Query Language (KQL) | Unified query language for all signals. |
| Compliance Reporting | Azure Monitor Workbooks | Pre-built compliance and audit report templates. |
| Notification Router | Azure Action Groups | Routes alerts to email, SMS, and Logic Apps. |
| **Identity (cross-cutting)** | Entra Managed Identity | Used for secure OTel-to-Azure communication. |
| **Governance (cross-cutting)** | Azure Policy (Guest Config) | Enforces agent presence and compliance. |

### 2.3  Key design decisions

- **Standard-First Ingestion**. Every building block MUST emit signals using the OpenTelemetry Protocol (OTLP). No vendor-specific SDKs are permitted in application code.
- **Unified Processing**. All signals pass through a centralized OTel Collector cluster to ensure consistent enrichment and classification before storage.
- **KQL Mastery**. Kusto is the mandatory query language for all operational and compliance investigations.

### 2.4  Message Flow

1. **Emission**. A service emits an OTLP trace span to the local OTel Collector agent.
2. **Enrichment**. The collector adds resource attributes (e.g., `service.name`, `deployment.environment`).
3. **Routing**. The collector routes operational signals to Log Analytics and audit signals to Immutable Storage.
4. **Correlation**. Azure Monitor links the trace span to related logs and metrics.
5. **Surfacing**. An operator queries the span via Grafana or an automated alert is triggered.

---

## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description (SBB-specific realisation) |
|----|-----------|------|-----------------------------------------|
| **I1** | Service → OTel | OTLP/gRPC | Unified signal emission from instrumented building blocks. |
| **I5** | Grafana → Monitor | KQL | Data visualisation queries using the Kusto Query Language. |
| **I7** | Monitor → Action | Webhook | Alert notification delivery to operational endpoints. |

---

## 4  Mapping

### 4.1  Entity mapping

- **Signal Producer** → Containerized Microservice.
- **Signal Hub** → OpenTelemetry Collector cluster.

### 4.2  Policy mapping

- **Data Retention Policy** → Implemented via Azure Log Analytics retention settings.

---

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | Retrospective standardisation of SB-002. |
