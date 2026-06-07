---
id: PL-011
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-011 Infrastructure Platform"
governance_zone: foundation
strategic_owner: Head of Platform Infrastructure
provides_capabilities:
  - CAP-009
  - CAP-012
  - CAP-013
  - CAP-014
  - CAP-044
contains_bounded_contexts:
  - BC-011
owns_outcomes:
  - OC-012
---

# PL-011 Infrastructure Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-011` |
| **Name** | Infrastructure |
| **Strategic Owner** | Head of Platform Infrastructure |
| **Owner Team** | Infrastructure Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Infrastructure Platform** provides the fundamental compute, storage, and networking building blocks that underpin all platform services. It focuses on scalability, resilience, and operational efficiency through standardised platform-as-a-service offerings.

## 2. Strategic Outcomes
- **[OC-012 Infrastructure Resilience & Elasticity](../../strategy/outcomes/OC-012/)**

## 3. Capabilities
- **[CAP-009 Infrastructure Services](../../capabilities/CAP-009/)**
- **[CAP-012 Compute Runtime & Scheduling](../../capabilities/CAP-012/)**
- **[CAP-013 Data Storage & Lifecycle Management](../../capabilities/CAP-013/)**
- **[CAP-014 Network Connectivity & Security](../../capabilities/CAP-014/)**
- **[CAP-044 Service Mesh & Connectivity](../../capabilities/CAP-044/)**

## 4. Bounded Contexts
- **[BC-011 Infrastructure](../../contexts/BC-011/)**

## 5. Self-Service Interfaces
- **Infrastructure-as-code modules.** Versioned, opinionated modules for provisioning compute, storage, and networking through declarative configuration.
- **Compute workload portal.** Self-service requests for container runtimes, scheduling policies, and autoscaling profiles with sensible defaults.
- **Storage provisioning APIs.** On-demand allocation of block, object, and managed data stores with lifecycle and retention policies.
- **Network and connectivity catalogue.** Self-service segmentation, ingress, egress, and service-mesh routing with policy-gated approval.
- **Platform documentation and golden paths.** Reference architectures and onboarding guides for secure, resilient infrastructure consumption.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Provision and run their workloads on managed compute, storage, and networking.
- **Other platform teams.** Build their higher-order services on the shared infrastructure substrate and service mesh.
- **Site reliability and operations.** Consume capacity, health, and topology data to manage resilience and cost.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Compute control-plane availability | 99.95% monthly |
| Workload scheduling latency (p99) | < 30 seconds |
| Persistent storage durability | 99.999999999% annually |
| Infrastructure provisioning fulfilment | < 10 minutes |

