---
title: "BC-010 Integration Bounded Context"
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
