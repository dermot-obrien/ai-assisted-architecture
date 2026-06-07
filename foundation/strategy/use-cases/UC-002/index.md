---
id: UC-002
kind: use-case
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "UC-002 Cross-Context Request Tracing"
governance_zone: foundation
primary_actor: SRE / Support
supports_outcome: OC-003
preconditions:
  - All participating building blocks emit OpenTelemetry traces with context propagation enabled.
  - A correlation/trace ID is generated at the entry point and propagated across context boundaries.
  - Telemetry is being ingested and retained by the observability platform.
success_criteria:
  - Trace ID persists across all Bounded Context boundaries.
  - Visualisation shows latency per span.
realised_by_abbs:
  - ABB-002
---

# UC-002 Cross-Context Request Tracing

| Property | Value |
| :--- | :--- |
| **Use Case ID** | `UC-002` |
| **Primary Actor**| SRE / Support |
| **Parent Outcome**| [OC-003](../../outcomes/OC-003/) |
| **Status** | `draft`|

## 1. Scenario
A user reports a slow response. The operator uses a single Trace ID to see the request flow through the Identity Context, the AI Reasoning Context, and the Data Storage Context.

## 2. Pre-conditions
- All participating building blocks emit OpenTelemetry traces with context propagation enabled.
- A correlation/trace ID is generated at the entry point and propagated across context boundaries.
- Telemetry is being ingested and retained by the observability platform.

## 3. Success Criteria
- Trace ID persists across all Bounded Context boundaries.
- Visualisation shows latency per span.

## 4. Realisation
- **[ABB-002 Observability](../../../building-blocks/architecture-building-blocks/ABB-002/)**

