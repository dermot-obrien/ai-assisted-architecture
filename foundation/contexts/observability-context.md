---
title: "Observability Bounded Context"
---

# Observability Bounded Context

| Property | Value |
| :--- | :--- |
| **Context Name** | Observability |
| **Domain** | Operations |
| **Owner Team** | Platform Operations Team |
| **Subdomain Type**| Supporting |

## 1. Purpose
The **Observability Bounded Context** provides the "Single Source of Truth" for system state and behavior. It normalizes disparate signals into a cohesive operational picture.

## 2. Ubiquitous Language
- **Signal**: A discrete piece of telemetry (Log, Metric, or Trace).
- **Span**: A logical unit of work within a distributed trace.
- **Normalisation**: The process of mapping signals to a common schema.

## 3. Contained ABBs
- **[AB-002 Observability](../building-blocks/architecture-building-blocks/AB-002/)**

## 4. Realized Capabilities
- **[CAP-006 Operational Monitoring & Alerting](../capabilities/CAP-006/)**
