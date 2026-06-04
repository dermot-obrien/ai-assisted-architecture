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
  |  realised by
  v
Architecture Building Block (ABB)
  |  implemented by
  v
Solution Building Block (SBB)
```


## Canonical Capability Registry

This table is the authoritative source for hierarchy and maturity. Parent-child relationships are defined explicitly by `Parent ID` (not by capability numbering pattern).

| Capability ID | Name | Level | Parent ID | Platform | Current Maturity | Target Maturity |
|---------------|------|-------|-----------|--------|------------------|-----------------|
| [CAP-001](./CAP-001/) | Platform Foundations | L1 | `-` | — | 1 | 3 |
| [CAP-002](./CAP-002/) | Identity & Access | L2 | `CAP-001` | PL-001 Security | 1 | 3 |
| [CAP-003](./CAP-003/) | Operational Intelligence | L2 | `CAP-001` | PL-002 Observability | 1 | 3 |
| [CAP-008](./CAP-008/) | Integration Services | L2 | `CAP-001` | PL-010 Integration | 1 | 3 |
| [CAP-009](./CAP-009/) | Infrastructure Services | L2 | `CAP-001` | PL-011 Infrastructure | 1 | 3 |
| [CAP-015](./CAP-015/) | Developer Experience | L2 | `CAP-001` | PL-004 Developer Experience | 1 | 3 |
| [CAP-019](./CAP-019/) | Cost Management | L2 | `CAP-001` | PL-005 Cost Management | 1 | 3 |
| [CAP-023](./CAP-023/) | Reliability & Resilience | L2 | `CAP-001` | PL-006 Reliability & Resilience | 1 | 3 |
| [CAP-027](./CAP-027/) | Supply Chain Security | L2 | `CAP-001` | PL-007 Supply Chain Security | 1 | 3 |
| [CAP-031](./CAP-031/) | Data Management | L2 | `CAP-001` | PL-008 Data Management | 1 | 3 |
| [CAP-035](./CAP-035/) | Configuration & Secret Management | L2 | `CAP-001` | PL-009 Configuration & Secrets | 1 | 3 |
| [CAP-004](./CAP-004/) | Identity Lifecycle Management | L3 | `CAP-002` | PL-001 Security | 1 | 3 |
| [CAP-005](./CAP-005/) | Policy-Based Access Control | L3 | `CAP-002` | PL-001 Security | 1 | 3 |
| [CAP-006](./CAP-006/) | Operational Monitoring & Alerting | L3 | `CAP-003` | PL-002 Observability | 1 | 3 |
| [CAP-007](./CAP-007/) | Compliance Evidence & Reporting | L3 | `CAP-003` | PL-003 Governance & Compliance | 1 | 3 |
| [CAP-010](./CAP-010/) | API Mediation & Contract Enforcement | L3 | `CAP-008` | PL-010 Integration | 1 | 3 |
| [CAP-011](./CAP-011/) | Event Streaming & Asynchronous Integration | L3 | `CAP-008` | PL-010 Integration | 1 | 3 |
| [CAP-012](./CAP-012/) | Compute Runtime & Scheduling | L3 | `CAP-009` | PL-011 Infrastructure | 1 | 3 |
| [CAP-013](./CAP-013/) | Data Storage & Lifecycle Management | L3 | `CAP-009` | PL-011 Infrastructure | 1 | 3 |
| [CAP-014](./CAP-014/) | Network Connectivity & Security | L3 | `CAP-009` | PL-011 Infrastructure | 1 | 3 |
| [CAP-016](./CAP-016/) | Self-Service Provisioning | L3 | `CAP-015` | PL-004 Developer Experience | 1 | 3 |
| [CAP-017](./CAP-017/) | Golden Path & Template Management | L3 | `CAP-015` | PL-004 Developer Experience | 1 | 3 |
| [CAP-018](./CAP-018/) | Service Catalog & Developer Portal | L3 | `CAP-015` | PL-004 Developer Experience | 1 | 3 |
| [CAP-020](./CAP-020/) | Cost Visibility & Allocation | L3 | `CAP-019` | PL-005 Cost Management | 1 | 3 |
| [CAP-021](./CAP-021/) | Cost Optimisation & Rightsizing | L3 | `CAP-019` | PL-005 Cost Management | 1 | 3 |
| [CAP-022](./CAP-022/) | Budget Governance & Anomaly Detection | L3 | `CAP-019` | PL-005 Cost Management | 1 | 3 |
| [CAP-024](./CAP-024/) | SLO Management & Error Budgets | L3 | `CAP-023` | PL-006 Reliability & Resilience | 1 | 3 |
| [CAP-025](./CAP-025/) | Disaster Recovery & Business Continuity | L3 | `CAP-023` | PL-006 Reliability & Resilience | 1 | 3 |
| [CAP-026](./CAP-026/) | Chaos Engineering & Resilience Testing | L3 | `CAP-023` | PL-006 Reliability & Resilience | 1 | 3 |
| [CAP-028](./CAP-028/) | Artifact Provenance & Signing | L3 | `CAP-027` | PL-007 Supply Chain Security | 1 | 3 |
| [CAP-029](./CAP-029/) | Dependency & Vulnerability Scanning | L3 | `CAP-027` | PL-007 Supply Chain Security | 1 | 3 |
| [CAP-030](./CAP-030/) | SBOM Management & Compliance | L3 | `CAP-027` | PL-007 Supply Chain Security | 1 | 3 |
| [CAP-032](./CAP-032/) | Data Classification & Privacy | L3 | `CAP-031` | PL-008 Data Management | 1 | 3 |
| [CAP-033](./CAP-033/) | Data Lifecycle & Retention | L3 | `CAP-031` | PL-008 Data Management | 1 | 3 |
| [CAP-034](./CAP-034/) | Data Sovereignty & Residency | L3 | `CAP-031` | PL-008 Data Management | 1 | 3 |
| [CAP-036](./CAP-036/) | Centralised Configuration Management | L3 | `CAP-035` | PL-009 Configuration & Secrets | 1 | 3 |
| [CAP-037](./CAP-037/) | Secret Lifecycle & Rotation | L3 | `CAP-035` | PL-009 Configuration & Secrets | 1 | 3 |
| [CAP-038](./CAP-038/) | Feature Management & Progressive Delivery | L3 | `CAP-035` | PL-009 Configuration & Secrets | 1 | 3 |
| [CAP-039](./CAP-039/) | Continuous Delivery | L2 | `CAP-001` | PL-012 Continuous Delivery | 1 | 3 |
| [CAP-040](./CAP-040/) | Build & Test Automation | L3 | `CAP-039` | PL-012 Continuous Delivery | 1 | 3 |
| [CAP-041](./CAP-041/) | Deployment Orchestration | L3 | `CAP-039` | PL-012 Continuous Delivery | 1 | 3 |
| [CAP-042](./CAP-042/) | Artifact Management | L3 | `CAP-039` | PL-012 Continuous Delivery | 1 | 3 |
| [CAP-043](./CAP-043/) | Environment Lifecycle Management | L3 | `CAP-015` | PL-004 Developer Experience | 1 | 3 |
| [CAP-044](./CAP-044/) | Service Mesh & Connectivity | L3 | `CAP-009` | PL-011 Infrastructure | 1 | 3 |

### Hierarchy rules

1. Capability depth is capped at three levels: L1 -> L2 -> L3.
2. `CAP-NNN` identifiers are stable and non-semantic. They do not encode hierarchy.
3. Re-parenting a capability updates `Parent ID` and links only; it does not require renumbering.
4. Only L3 capabilities map directly to ABBs.


## Capability-to-ABB Traceability Matrix

This matrix shows the many-to-many relationship between L3 capabilities and Architecture Building Blocks. Only L3 capabilities map directly to ABBs.

| Capability | ABB-001 IAM | ABB-002 Observability | ABB-003 Governance | ABB-004 API Gateway | ABB-005 Event Messaging | ABB-006 Compute Platform | ABB-007 Storage Platform | ABB-008 Network Platform |
|------------|------------|----------------------|-------------------|--------------------|------------------------|-------------------------|-------------------------|--------------------------|
| **CAP-004** Identity Lifecycle Management | **Primary** | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-005** Policy-Based Access Control | **Primary** | Cross-cutting | Supporting | - | - | - | - | - |
| **CAP-006** Operational Monitoring & Alerting | Cross-cutting | **Primary** | Cross-cutting | - | - | - | - | - |
| **CAP-007** Compliance Evidence & Reporting | Cross-cutting | Supporting | **Primary** | - | - | - | - | - |
| **CAP-010** API Mediation & Contract Enforcement | Cross-cutting | Supporting | Cross-cutting | **Primary** | Supporting | - | - | - |
| **CAP-011** Event Streaming & Asynchronous Integration | Cross-cutting | Supporting | Cross-cutting | Supporting | **Primary** | - | - | - |
| **CAP-012** Compute Runtime & Scheduling | Cross-cutting | Cross-cutting | Supporting | - | - | **Primary** | Supporting | Supporting |
| **CAP-013** Data Storage & Lifecycle Management | Cross-cutting | Cross-cutting | Cross-cutting | - | - | Supporting | **Primary** | - |
| **CAP-014** Network Connectivity & Security | Cross-cutting | Cross-cutting | Supporting | - | - | Supporting | - | **Primary** |
| **CAP-016** Self-Service Provisioning | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-017** Golden Path & Template Management | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-018** Service Catalog & Developer Portal | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-020** Cost Visibility & Allocation | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-021** Cost Optimisation & Rightsizing | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-022** Budget Governance & Anomaly Detection | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-024** SLO Management & Error Budgets | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-025** Disaster Recovery & Business Continuity | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-026** Chaos Engineering & Resilience Testing | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-028** Artifact Provenance & Signing | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-029** Dependency & Vulnerability Scanning | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-030** SBOM Management & Compliance | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-032** Data Classification & Privacy | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-033** Data Lifecycle & Retention | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-034** Data Sovereignty & Residency | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-036** Centralised Configuration Management | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-037** Secret Lifecycle & Rotation | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-038** Feature Management & Progressive Delivery | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-040** Build & Test Automation | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | - | - |
| **CAP-041** Deployment Orchestration | Cross-cutting | Cross-cutting | Cross-cutting | - | - | Supporting | - | - |
| **CAP-042** Artifact Management | Cross-cutting | Cross-cutting | Cross-cutting | - | - | - | Supporting | - |
| **CAP-043** Environment Lifecycle Management | Cross-cutting | Cross-cutting | Cross-cutting | - | - | Supporting | - | - |
| **CAP-044** Service Mesh & Connectivity | Cross-cutting | Cross-cutting | Cross-cutting | - | - | Supporting | - | **Primary** |

### Reading the matrix

- **Primary.** The ABB directly realises a core aspect of the capability. Removing it would eliminate the capability.
- **Supporting.** The ABB provides functionality that enhances or enables the capability but is not its primary purpose.
- **Cross-cutting.** The ABB is a shared concern (IAM, Observability, Governance) that applies to this capability as it does to most others.

