---
id: CAP-011
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-011 Event Streaming & Asynchronous Integration"
sidebar_label: "CAP-011 Event Streaming & Asynchronous Integration"
sidebar_position: 11
---

# CAP-011 Event Streaming & Asynchronous Integration

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-011` | Unique identifier. |
| **Capability Name** | Event Streaming & Asynchronous Integration | Human-readable name. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-008` | Integration Services. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-010 Integration](../../platforms/PL-010/) | Parent platform. |

The organisation must be able to exchange business and operational events through reliable asynchronous integration patterns that support loose coupling, replayability, and controlled consumer evolution.


## 1  Purpose

Asynchronous integration enables systems to evolve independently and absorb variable demand, but only if event contracts, delivery guarantees, and replay controls are standardised. This capability establishes the shared event streaming and messaging patterns needed for durable event delivery, consumer scalability, and predictable recovery from integration failures.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Integration Team.** Owns event platform components and event contract governance standards.
- **Domain Service Teams.** Publish and consume domain events using standard event schemas and delivery patterns.
- **Reliability Engineering.** Defines failure-handling, replay, and dead-letter practices for asynchronous flows.

### 2.2  People

- **Event Platform Engineers.** Operate broker, topic, schema, and delivery-assurance components.
- **Integration Architects.** Define event modelling and compatibility rules.
- **Service Engineers.** Implement event producers and consumers according to platform standards.

### 2.3  Processes

- **Event Contract Lifecycle.** Define, review, version, and publish event schemas and metadata.
- **Delivery Assurance Management.** Operate retries, dead-letter handling, and replay procedures.
- **Consumer Onboarding.** Register consumers, configure subscriptions, and validate compatibility.
- **Event Reliability Review.** Monitor lag, failure rates, and consumer health against reliability objectives.

### 2.4  Technology

- **Event Broker Platform.** Durable asynchronous transport with publish-subscribe and queue-based patterns.
- **Schema and Topic Registry.** Managed event schema definitions, topic metadata, and compatibility policy.
- **Delivery Assurance Services.** Retry orchestration, dead-letter handling, idempotency controls, and replay tooling.
- **Consumer Group Management.** Consumer coordination, scaling, offset management, and lag monitoring.

## 3  Maturity

### 3.1  Maturity Model

| Level | Name | Description |
|-------|------|-------------|
| **0** | None | Capability does not exist. |
| **1** | Initial | Ad-hoc, manual, inconsistent. |
| **2** | Developing | Some automation, documented processes, repeatable. |
| **3** | Defined | Standardised, consistent, proactive. |
| **4** | Managed | Quantitatively managed, SLAs tracked, measured. |
| **5** | Optimising | Continuous improvement, data-driven optimisation, innovation. |

### 3.2  Current Assessment

| Property | Value |
|----------|-------|
| **Current Maturity** | 1 |
| **Target Maturity** | 3 |
| **Assessment Date** | 2026-03-07 |
| **Assessor** | Architecture Team |

Event-driven integration exists in selected workloads but broker usage, schema governance, and replay controls are inconsistent across teams.

### 3.3  Maturity Roadmap

- **1 -> 2.** Standardise event contract registry, dead-letter handling patterns, and consumer onboarding workflow.
- **2 -> 3.** Enforce schema compatibility in delivery pipelines, define replay and recovery SLOs, and standardise event observability across all flows.


## 4  ABB Realisation

### 4.1  Relationship Model

This capability is realised primarily by ABB-005 Event Streaming & Messaging, with ABB-004 API Mediation & Gateway providing supporting entry-point and protocol-bridging patterns where synchronous and asynchronous interfaces meet. Cross-cutting ABBs ensure secure access, operational visibility, and policy-governed event handling.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [ABB-005](../../building-blocks/architecture-building-blocks/ABB-005/) | Event Streaming & Messaging | `primary` | `full` | Provides broker platform, schema/topic governance, delivery assurance, and replay controls. |
| [ABB-004](../../building-blocks/architecture-building-blocks/ABB-004/) | API Mediation & Gateway | `supporting` | `partial` | Supports synchronous entry and partner-facing integration boundaries for event-driven flows. |
| [ABB-001](../../building-blocks/architecture-building-blocks/ABB-001/) | Identity & Access Management | `cross-cutting` | `full` | Provides producer and consumer identity authentication and authorisation controls. |
| [ABB-002](../../building-blocks/architecture-building-blocks/ABB-002/) | Observability | `supporting` | `full` | Provides event pipeline telemetry, lag monitoring, failure analysis, and trace correlation. |
| [ABB-003](../../building-blocks/architecture-building-blocks/ABB-003/) | Governance & Policy Enforcement | `cross-cutting` | `full` | Provides event classification, retention, and policy requirements for asynchronous data flows. |

### 4.3  Gaps

All technology needs are realised by the mapped ABBs.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-011 Event Streaming & Asynchronous Integration capability created. |
