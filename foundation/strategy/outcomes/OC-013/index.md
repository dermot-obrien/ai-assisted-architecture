---
title: "OC-013 Continuous Delivery Velocity"
---

# OC-013 Continuous Delivery Velocity

| Property | Value |
| :--- | :--- |
| **Outcome ID** | `OC-013` |
| **Name** | Continuous Delivery Velocity |
| **Measure** | Deployment frequency ≥ daily per service; lead time from commit to production ≤ 1 hour for standard changes. |
| **Status** | `draft` |

## 1. Definition
Achieve a state where any code change that passes automated quality gates can be deployed to production within one hour, with deployment frequency of at least once per day per active service.

## 2. Business Rationale
Slow and manual release processes are the primary bottleneck for delivering value to customers. Automating the path from commit to production reduces lead time, lowers change failure rate, and enables rapid feedback loops — the four DORA metrics that correlate with organisational performance.

## 3. Traceability
- **[CAP-040 Build & Test Automation](../../../capabilities/CAP-040/)**
- **[CAP-041 Deployment Orchestration](../../../capabilities/CAP-041/)**
- **[CAP-042 Artifact Management](../../../capabilities/CAP-042/)**
