---
id: PL-004
kind: platform
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "PL-004 Developer Experience Platform"
governance_zone: foundation
strategic_owner: Head of Platform Engineering
provides_capabilities:
  - CAP-016
  - CAP-017
  - CAP-018
  - CAP-043
contains_bounded_contexts:
  - BC-004
owns_outcomes:
  - OC-005
---

# PL-004 Developer Experience Platform

| Property | Value |
| :--- | :--- |
| **Platform ID** | `PL-004` |
| **Name** | Developer Experience |
| **Strategic Owner** | Head of Platform Engineering |
| **Owner Team** | Developer Experience Platform Team |
| **Status** | `draft` |

## 1. Purpose
The **Developer Experience Platform** ensures that platform capabilities are consumable through self-service interfaces, golden paths, and a unified service catalog. It is the primary interface between platform teams and application developers.

## 2. Strategic Outcomes
- **[OC-005 Developer Self-Service Efficiency](../../strategy/outcomes/OC-005/)**

## 3. Capabilities
- **[CAP-016 Self-Service Provisioning](../../capabilities/CAP-016/)**
- **[CAP-017 Golden Path & Template Management](../../capabilities/CAP-017/)**
- **[CAP-018 Service Catalog & Developer Portal](../../capabilities/CAP-018/)**
- **[CAP-043 Environment Lifecycle Management](../../capabilities/CAP-043/)**

## 4. Bounded Contexts
- **[BC-004 Developer Platform](../../contexts/BC-004/)**

## 5. Self-Service Interfaces
- **Service catalog and developer portal.** Unified portal for discovering, requesting, and managing platform services and software components.
- **Self-service provisioning APIs and CLI.** Declarative provisioning of services, infrastructure, and access through templated workflows.
- **Golden path templates and scaffolding.** Opinionated project templates that encode standards for new services and pipelines.
- **Environment lifecycle management.** Self-service creation, refresh, and teardown of ephemeral and long-lived environments.
- **Documentation and golden paths.** Onboarding guides and reference patterns for productive, paved-road service delivery.

## 6. Consuming Teams
- **Application and stream-aligned teams.** Provision services, scaffold projects, and manage environments through self-service.
- **All other platform teams.** Publish their capabilities into the catalog and expose them via golden paths.
- **Engineering leadership and enablement.** Consume adoption and developer-experience metrics to guide investment.

## 7. SLOs
| Objective | Target |
| :--- | :--- |
| Developer portal availability | 99.9% monthly |
| Self-service provisioning fulfilment | < 10 minutes |
| Environment creation from template | < 30 minutes |
| Catalog search response (p95) | < 2 seconds |

