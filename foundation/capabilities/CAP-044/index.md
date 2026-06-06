---
id: CAP-044
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-044 Service Mesh & Connectivity"
sidebar_label: "CAP-044 Service Mesh & Connectivity"
sidebar_position: 44
governance_zone: foundation
level: L3
parent: CAP-009
provided_by_platform: PL-011
required_by_outcomes:
  - OC-012
components:
  organisation: Platform Engineering Team, Development Teams, Security Team
  people:
    - Platform Engineers
    - Network Engineers
    - Security Engineers
  processes:
    - Service Registration
    - Traffic Policy Management
    - mTLS Certificate Lifecycle
    - Network Observability
  technology: Service Mesh Control Plane, Service Discovery Registry, Ingress/Egress Gateway, Network Policy Engine
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-044 Service Mesh & Connectivity

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-044` | Unique identifier. |
| **Capability Name** | Service Mesh & Connectivity | Human-readable name. |
| **Realizes Outcome**| [OC-012 Infrastructure Resilience & Elasticity](../../../strategy/outcomes/OC-012/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-009` | Infrastructure. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-011 Infrastructure](../../platforms/PL-011/) | Parent platform. |

The organisation must provide transparent service-to-service communication with mutual TLS, traffic management, service discovery, and network observability without requiring application code changes.


## 1  Purpose

As microservice architectures scale, service-to-service communication becomes increasingly complex. Each team implements its own retry logic, circuit breakers, and TLS configuration, leading to inconsistent behaviour and security gaps. Service Mesh & Connectivity moves these cross-cutting concerns into the infrastructure layer, providing consistent mutual TLS, traffic management, and network observability without application code changes.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns service mesh infrastructure and network policies.
- **Development Teams.** Consume service discovery and connectivity features transparently.
- **Security Team.** Defines mutual TLS policies and network segmentation requirements.

### 2.2  People

- **Platform Engineers.** Deploy, configure, and maintain service mesh control plane and data plane.
- **Network Engineers.** Define ingress/egress policies and traffic management rules.
- **Security Engineers.** Configure mutual TLS policies and audit service-to-service communication.

### 2.3  Processes

- **Service Registration.** Automatic registration and deregistration of services in the discovery registry.
- **Traffic Policy Management.** Define, review, and apply traffic routing, rate limiting, and retry policies.
- **mTLS Certificate Lifecycle.** Automated issuance, rotation, and revocation of service identity certificates.
- **Network Observability.** Continuous monitoring of service-to-service traffic patterns, latency, and error rates.

### 2.4  Technology

- **Service Mesh Control Plane.** Manages proxy configuration, certificate distribution, and policy enforcement across the mesh.
- **Service Discovery Registry.** Maintains a real-time catalogue of available service instances with health status.
- **Ingress/Egress Gateway.** Controls traffic entering and leaving the mesh with TLS termination, rate limiting, and access control.
- **Network Policy Engine.** Enforces network segmentation and service-to-service communication rules at the infrastructure layer.


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
| **Assessment Date** | 2026-03-08 |
| **Assessor** | Architecture Team |

Service-to-service communication uses direct connections with no mesh. TLS is inconsistently applied, service discovery is DNS-based, and there is no centralised traffic management or network observability.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the relevant ABB is created.

### 4.2  ABB Mapping

*(To be defined)*

### 4.3  Gaps

ABB mappings will be defined when the relevant ABB is created.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-044 Service Mesh & Connectivity capability created. |

