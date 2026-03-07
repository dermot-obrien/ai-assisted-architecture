# Observability Ingestion Service (OTel)

**SB-002** | **Version** 1.0 | **Status** APPROVED | **Realises** AB-002 Observability

## Purpose

Realises the Observability ABB (AB-002) using the OpenTelemetry (OTel) Collector and Azure Monitor. It provides a vendor-neutral ingestion pipeline for logs, metrics, and traces, normalising all signals to the OTLP schema before export.

## Product Mapping

• **Trace Collector.** OTel OTLP Receiver.
• **Metrics Collector.** OTel Prometheus Receiver.
• **Log Aggregator.** OTel Filelog Receiver.
• **Audit Ingestion.** Azure Monitor Ingestion API.
• **Signal Correlation.** Azure Monitor (Application Insights).
• **Enrichment.** OTel Attributes Processor.
• **Storage.** Log Analytics and Immutable Azure Storage.

## Cross-Cutting Posture

• **Identity & Access.** Secure OTel-to-Azure communication via Entra Managed Identity.
• **Observability.** Meta-telemetry emitted by the OTel Collector to a dedicated monitor.
• **Governance & Policy.** Azure Monitor retention policies and OTel PII masking.

## Key Design Decisions

• **OTLP Mandate.** All building blocks must use OpenTelemetry Protocol for signal emission.
• **Immutable Audit.** Critical compliance logs are routed to WORM-compliant storage.
• **Unified Query.** Kusto (KQL) is the single language for all telemetry analysis.

## Key Interfaces

• **I1** Service → OTel Collector. OTLP signal emission.
• **I5** Grafana → Azure Monitor. KQL data visualisation.
• **I7** Azure Monitor → Action Group. Alert notification delivery.
