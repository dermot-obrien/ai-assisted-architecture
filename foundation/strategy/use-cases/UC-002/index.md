---
title: "UC-002 Cross-Context Request Tracing"
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

## 2. Success Criteria
- Trace ID persists across all Bounded Context boundaries.
- Visualisation shows latency per span.

## 3. Realisation
- **[AB-002 Observability](../../../building-blocks/architecture-building-blocks/AB-002/)**
