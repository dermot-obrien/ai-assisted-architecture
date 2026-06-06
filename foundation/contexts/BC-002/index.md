---
id: BC-002
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-002 Observability Bounded Context"
governance_zone: foundation
part_of: PL-002
subdomain_kind: supporting
contains:
  - ABB-002
realises_capabilities:
  - CAP-006
ubiquitous_language:
  - term: Signal
    definition: A discrete piece of telemetry (Log, Metric, or Trace).
  - term: Span
    definition: A logical unit of work within a distributed trace.
  - term: Normalisation
    definition: The process of mapping signals to a common schema.
---

# BC-002 Observability Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-002` |
| **Context Name** | Observability |
| **Platform** | [PL-002 Observability](../../platforms/PL-002/) |
| **Owner Team** | Platform Operations Team |
| **Subdomain Type**| Supporting |

## 1. Purpose
The **Observability Bounded Context** provides the "Single Source of Truth" for system state and behaviour. It normalizes disparate signals into a cohesive operational picture.

## 2. Ubiquitous Language
- **Signal**: A discrete piece of telemetry (Log, Metric, or Trace).
- **Span**: A logical unit of work within a distributed trace.
- **Normalisation**: The process of mapping signals to a common schema.

## 3. Contained ABBs
- **[ABB-002 Observability](../../building-blocks/architecture-building-blocks/ABB-002/)**

## 4. Realised Capabilities
- **[CAP-006 Operational Monitoring & Alerting](../../capabilities/CAP-006/)**

