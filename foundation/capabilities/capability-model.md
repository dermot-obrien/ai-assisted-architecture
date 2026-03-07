---
title: "Capability Model"
sidebar_label: "Capability Model"
sidebar_position: 0
---

# Capability Model

This is the master capability taxonomy for the architecture. It defines the complete L1/L2/L3 hierarchy with maturity tracking. Every capability folder must have a corresponding entry here.

Diagram views for this model live under:

- `diagrams/l1/platform-foundations-capability-map.drawio`
- `diagrams/traceability/capability-abb-traceability.drawio`


## Traceability Chain

```
Capability  (L1 -> L2 -> L3)
  |  realized by
  v
Architecture Building Block (ABB)
  |  implemented by
  v
Solution Building Block (SBB)
```


## Canonical Capability Registry

This table is the authoritative source for hierarchy and maturity. Parent-child relationships are defined explicitly by `Parent ID` (not by capability numbering pattern).

| Capability ID | Name | Level | Parent ID | Domain | Current Maturity | Target Maturity |
|---------------|------|-------|-----------|--------|------------------|-----------------|
| [CAP-001](./CAP-001/) | Platform Foundations | L1 | `-` | Platform Foundations | 1 | 3 |
| [CAP-002](./CAP-002/) | Identity & Access | L2 | `CAP-001` | Platform Foundations | 1 | 3 |
| [CAP-003](./CAP-003/) | Operational Intelligence | L2 | `CAP-001` | Platform Foundations | 1 | 3 |
| [CAP-008](./CAP-008/) | Integration Services | L2 | `CAP-001` | Platform Foundations | 1 | 3 |
| [CAP-009](./CAP-009/) | Infrastructure Services | L2 | `CAP-001` | Platform Foundations | 1 | 3 |
| [CAP-004](./CAP-004/) | Identity Lifecycle Management | L3 | `CAP-002` | Platform Foundations | 1 | 3 |
| [CAP-005](./CAP-005/) | Policy-Based Access Control | L3 | `CAP-002` | Platform Foundations | 1 | 3 |
| [CAP-006](./CAP-006/) | Operational Monitoring & Alerting | L3 | `CAP-003` | Platform Foundations | 1 | 3 |
| [CAP-007](./CAP-007/) | Compliance Evidence & Reporting | L3 | `CAP-003` | Platform Foundations | 1 | 3 |
| [CAP-010](./CAP-010/) | API Mediation & Contract Enforcement | L3 | `CAP-008` | Platform Foundations | 1 | 3 |
| [CAP-011](./CAP-011/) | Event Streaming & Asynchronous Integration | L3 | `CAP-008` | Platform Foundations | 1 | 3 |
| [CAP-012](./CAP-012/) | Compute Runtime & Scheduling | L3 | `CAP-009` | Platform Foundations | 1 | 3 |
| [CAP-013](./CAP-013/) | Data Storage & Lifecycle Management | L3 | `CAP-009` | Platform Foundations | 1 | 3 |

### Hierarchy rules

1. Capability depth is capped at three levels: L1 -> L2 -> L3.
2. `CAP-NNN` identifiers are stable and non-semantic. They do not encode hierarchy.
3. Re-parenting a capability updates `Parent ID` and links only; it does not require renumbering.
4. Only L3 capabilities map directly to ABBs.


## Capability-to-ABB Traceability Matrix

This matrix shows the many-to-many relationship between L3 capabilities and Architecture Building Blocks. Only L3 capabilities map directly to ABBs.

| Capability | AB-001 IAM | AB-002 Observability | AB-003 Governance | AB-004 API Gateway | AB-005 Event Messaging | AB-006 Compute Platform | AB-007 Storage Platform |
|------------|------------|----------------------|-------------------|--------------------|------------------------|-------------------------|-------------------------|
| **CAP-004** Identity Lifecycle Management | **Primary** | Cross-cutting | Cross-cutting | - | - | - | - |
| **CAP-005** Policy-Based Access Control | **Primary** | Cross-cutting | Supporting | - | - | - | - |
| **CAP-006** Operational Monitoring & Alerting | Cross-cutting | **Primary** | Cross-cutting | - | - | - | - |
| **CAP-007** Compliance Evidence & Reporting | Cross-cutting | Supporting | **Primary** | - | - | - | - |
| **CAP-010** API Mediation & Contract Enforcement | Cross-cutting | Supporting | Cross-cutting | **Primary** | Supporting | - | - |
| **CAP-011** Event Streaming & Asynchronous Integration | Cross-cutting | Supporting | Cross-cutting | Supporting | **Primary** | - | - |
| **CAP-012** Compute Runtime & Scheduling | Cross-cutting | Cross-cutting | Supporting | - | - | **Primary** | Supporting |
| **CAP-013** Data Storage & Lifecycle Management | Cross-cutting | Cross-cutting | Cross-cutting | - | - | Supporting | **Primary** |

### Reading the matrix

- **Primary.** The ABB directly realises a core aspect of the capability. Removing it would eliminate the capability.
- **Supporting.** The ABB provides functionality that enhances or enables the capability but is not its primary purpose.
- **Cross-cutting.** The ABB is a shared concern (IAM, Observability, Governance) that applies to this capability as it does to most others.

