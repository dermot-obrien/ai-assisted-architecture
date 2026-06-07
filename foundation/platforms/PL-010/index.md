---
id: PL-010
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-010 Integration Platform"
governance_zone: foundation
strategic_owner: Head of Platform Integration
provides_capabilities:
  - CAP-008
  - CAP-010
  - CAP-011
contains_bounded_contexts:
  - BC-010
owns_outcomes:
  - OC-011
---

# PL-010 Integration Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-010` |
| **Name** | Integration |
| **Strategic Owner** | Head of Platform Integration |
| **Owner Team** | Integration Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Integration Platform** ensures seamless interoperability between disparate platform services and external systems. It defines the patterns for synchronous API communication and asynchronous event-driven architectures.

## 2. Strategic Outcomes
- **[OC-011 Integration Efficiency & Interoperability](../../strategy/outcomes/OC-011/)**

## 3. Capabilities
- **[CAP-008 Integration Services](../../capabilities/CAP-008/)**
- **[CAP-010 API Mediation & Contract Enforcement](../../capabilities/CAP-010/)**
- **[CAP-011 Event Streaming & Asynchronous Integration](../../capabilities/CAP-011/)**

## 4. Bounded Contexts
- **[BC-010 Integration](../../contexts/BC-010/)**

## 5. Self-Service Interfaces
- **API gateway onboarding portal.** Self-service registration of APIs, route configuration, and rate-limit policies with environment-scoped credentials.
- **Contract registry and validation CLI.** Publication of OpenAPI and AsyncAPI contracts with automated compatibility checking against consumer expectations.
- **Event topic provisioning.** Declarative requests for streaming topics, schemas, and consumer groups with retention and partitioning defaults.
- **Schema registry SDK.** Libraries for producing and consuming versioned event payloads with backward-compatibility enforcement.
- **Integration golden paths.** Reference templates and documentation for synchronous mediation and asynchronous event-driven patterns.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Expose and consume APIs and publish or subscribe to domain events through managed channels.
- **Partner and external integration teams.** Connect third-party systems via governed gateway endpoints and contract enforcement.
- **Other platform teams.** Route inter-platform traffic and emit operational events through shared mediation and streaming infrastructure.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| API gateway availability | 99.95% monthly |
| Gateway request latency overhead (p99) | < 20 ms |
| Event delivery latency (p99) | < 500 ms |
| Schema or contract registration turnaround | < 2 minutes |

