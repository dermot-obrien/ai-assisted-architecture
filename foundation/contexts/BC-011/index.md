---
id: BC-011
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-011 Infrastructure Bounded Context"
---

# BC-011 Infrastructure Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-011` |
| **Context Name** | Infrastructure |
| **Platform** | [PL-011 Infrastructure](../../platforms/PL-011/) |
| **Owner Team** | Platform Infrastructure Team |
| **Subdomain Type**| Generic |

## 1. Purpose
The **Infrastructure Bounded Context** defines the language and controls for shared runtime and persistence services. It standardises compute orchestration, storage lifecycle management, resilience controls, and operational guardrails used by platform workloads.

## 2. Ubiquitous Language
- **Runtime Scheduling**: Policy-controlled placement and scaling of workload execution units.
- **Persistence Tiering**: Policy-driven movement of data across performance and retention tiers.
- **Recovery Objective**: Defined target for restoring service and data after disruption.

## 3. Contained ABBs
- **[ABB-006 Compute Orchestration Platform](../../building-blocks/architecture-building-blocks/ABB-006/)**
- **[ABB-007 Storage & Persistence Platform](../../building-blocks/architecture-building-blocks/ABB-007/)**

## 4. Realised Capabilities
- **[CAP-009 Infrastructure Services](../../capabilities/CAP-009/)**
- **[CAP-012 Compute Runtime & Scheduling](../../capabilities/CAP-012/)**
- **[CAP-013 Data Storage & Lifecycle Management](../../capabilities/CAP-013/)**
- **[CAP-014 Network Connectivity & Security](../../capabilities/CAP-014/)**
- **[CAP-044 Service Mesh & Connectivity](../../capabilities/CAP-044/)**
