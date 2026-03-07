---
title: "BC-002 Observability Bounded Context"
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
- **[AB-002 Observability](../../building-blocks/architecture-building-blocks/AB-002/)**

## 4. Realised Capabilities
- **[CAP-006 Operational Monitoring & Alerting](../../capabilities/CAP-006/)**
