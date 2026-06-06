---
id: BC-010
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-010 Integration Bounded Context"
governance_zone: foundation
part_of: PL-010
subdomain_kind: generic
contains:
  - ABB-004
  - ABB-005
realises_capabilities:
  - CAP-008
  - CAP-010
  - CAP-011
ubiquitous_language:
  - term: Contract
    definition: Versioned schema and behavioural agreement between providers and consumers.
  - term: Mediation
    definition: Policy-governed routing and transformation between integration endpoints.
  - term: Event Stream
    definition: Ordered flow of domain or operational events consumed asynchronously.
---

# BC-010 Integration Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-010` |
| **Context Name** | Integration |
| **Platform** | [PL-010 Integration](../../platforms/PL-010/) |
| **Owner Team** | Platform Integration Team |
| **Subdomain Type**| Generic |

## 1. Purpose
The **Integration Bounded Context** defines the language and rules for service interoperability across synchronous and asynchronous boundaries. It standardises API mediation, contract governance, event transport, and delivery assurance patterns.

## 2. Ubiquitous Language
- **Contract**: Versioned schema and behavioural agreement between providers and consumers.
- **Mediation**: Policy-governed routing and transformation between integration endpoints.
- **Event Stream**: Ordered flow of domain or operational events consumed asynchronously.

## 3. Contained ABBs
- **[ABB-004 API Mediation & Gateway](../../building-blocks/architecture-building-blocks/ABB-004/)**
- **[ABB-005 Event Streaming & Messaging](../../building-blocks/architecture-building-blocks/ABB-005/)**

## 4. Realised Capabilities
- **[CAP-008 Integration Services](../../capabilities/CAP-008/)**
- **[CAP-010 API Mediation & Contract Enforcement](../../capabilities/CAP-010/)**
- **[CAP-011 Event Streaming & Asynchronous Integration](../../capabilities/CAP-011/)**

