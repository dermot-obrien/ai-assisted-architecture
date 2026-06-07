---
id: PL-002
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-002 Observability Platform"
governance_zone: foundation
strategic_owner: Head of Platform Operations
provides_capabilities:
  - CAP-006
contains_bounded_contexts:
  - BC-002
owns_outcomes:
  - OC-003
---

# PL-002 Observability Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-002` |
| **Name** | Observability |
| **Strategic Owner** | Head of Platform Operations |
| **Owner Team** | Observability Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Observability Platform** ensures the reliability, performance, and visibility of all platform services. It focuses on operational intelligence and rapid incident response, providing self-service telemetry and alerting capabilities.

## 2. Strategic Outcomes
- **[OC-003 MTTD Reduction](../../strategy/outcomes/OC-003/)**

## 3. Capabilities
- **[CAP-006 Operational Monitoring & Alerting](../../capabilities/CAP-006/)**

## 4. Bounded Contexts
- **[BC-002 Observability](../../contexts/BC-002/)**

## 5. Self-Service Interfaces
- **Telemetry ingestion endpoints (OTLP).** Standard collectors for metrics, traces, and logs from services and infrastructure.
- **Instrumentation SDKs and agents.** Auto-instrumentation libraries and sidecars for consistent, low-effort signal emission.
- **Dashboard and exploration portal.** Self-service creation of dashboards, queries, and saved views over operational data.
- **Alerting and notification configuration.** Declarative alert rules, routing policies, and escalation integration with on-call tooling.
- **Documentation and golden paths.** Reference patterns for service-level instrumentation and observability-by-default onboarding.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Instrument their services and consume dashboards and alerts to operate them.
- **All other platform teams.** Emit telemetry from their own services and monitor platform health.
- **Site reliability and incident response.** Consume metrics, traces, and alerts for detection, triage, and resolution.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Telemetry ingestion availability | 99.9% monthly |
| Ingestion-to-query latency (p95) | < 30 seconds |
| Alert evaluation and dispatch latency (p99) | < 60 seconds |
| Dashboard query response (p95) | < 3 seconds |

