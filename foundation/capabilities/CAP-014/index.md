---
title: "CAP-014 Network Connectivity & Security"
sidebar_label: "CAP-014 Network Connectivity & Security"
sidebar_position: 14
---

# CAP-014 Network Connectivity & Security

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-014` | Unique identifier. |
| **Capability Name** | Network Connectivity & Security | Human-readable name. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-009` | Infrastructure Services. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-011 Infrastructure](../../platforms/PL-011/) | Parent platform. |

The organisation must be able to connect workloads securely across trust boundaries with consistent network topology, traffic management, and connectivity controls that meet platform security and reliability requirements.


## 1  Purpose

Without a standard network platform, teams maintain fragmented network configurations that are insecure, inconsistent, and costly to operate. This capability establishes shared network topology, traffic management, and connectivity primitives so workloads can communicate predictably, securely, and with appropriate governance controls.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Network Team.** Owns network architecture, topology standards, and connectivity patterns.
- **Security Operations.** Defines firewall rules, segmentation policies, and threat mitigation controls.
- **Platform Security Team.** Defines encryption standards, certificate policies, and service mesh requirements.

### 2.2  People

- **Network Engineers.** Operate virtual networks, load balancers, and connectivity infrastructure.
- **Security Engineers.** Define and enforce network segmentation and firewall policies.
- **Service Engineers.** Consume network services through standard connectivity abstractions.

### 2.3  Processes

- **Network Provisioning.** Provision virtual networks, subnets, and peering with standardised templates.
- **Firewall Rule Management.** Define, review, and enforce network security rules through policy-as-code.
- **Certificate Lifecycle Management.** Automate TLS certificate issuance, renewal, and rotation.
- **Connectivity Change Management.** Govern peering, private link, and egress changes through approval workflows.

### 2.4  Technology

- **Virtual Network Platform.** Manages network topology, addressing, and peering relationships.
- **Traffic Management Services.** Load balancers, ingress controllers, and egress gateways.
- **Service Mesh.** Provides east-west connectivity with mutual TLS and traffic controls.
- **Network Security Services.** Firewalls, DDoS protection, WAF, and microsegmentation.

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

Shared network topology exists but segmentation policies, service mesh adoption, and certificate automation are not consistently standardised across all environments.

### 3.3  Maturity Roadmap

- **1 -> 2.** Standardise virtual network templates, baseline firewall rules, and DNS zone management.
- **2 -> 3.** Establish service mesh for east-west traffic, automated certificate lifecycle, and network policy-as-code for all environments.


## 4  ABB Realisation

### 4.1  Relationship Model

This capability is realised primarily by ABB-008 Network Connectivity & Security, with ABB-006 Compute Orchestration Platform providing supporting runtime networking integration. Cross-cutting ABBs provide shared security, observability, and governance controls for network operations.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [ABB-008](../../building-blocks/architecture-building-blocks/ABB-008/) | Network Connectivity & Security | `primary` | `full` | Provides network topology, traffic management, segmentation, and connectivity controls. |
| [ABB-006](../../building-blocks/architecture-building-blocks/ABB-006/) | Compute Orchestration Platform | `supporting` | `partial` | Supports runtime networking integration for orchestrated workloads. |
| [ABB-001](../../building-blocks/architecture-building-blocks/ABB-001/) | Identity & Access Management | `cross-cutting` | `full` | Provides network identity, access control, and administrator authentication. |
| [ABB-002](../../building-blocks/architecture-building-blocks/ABB-002/) | Observability | `cross-cutting` | `full` | Provides network telemetry, traffic visibility, and incident investigation signals. |
| [ABB-003](../../building-blocks/architecture-building-blocks/ABB-003/) | Governance & Policy Enforcement | `supporting` | `full` | Provides network policy constraints for connectivity, segmentation, and change control. |

### 4.3  Gaps

All technology needs are realised by the mapped ABBs.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-014 Network Connectivity & Security capability created. |
