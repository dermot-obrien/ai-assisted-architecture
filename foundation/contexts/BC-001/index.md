---
id: BC-001
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-001 Identity & Access Bounded Context"
governance_zone: foundation
part_of: PL-001
subdomain_kind: generic
contains:
  - ABB-001
realises_capabilities:
  - CAP-004
ubiquitous_language:
  - term: Principal
    definition: Any entity (user, service, agent) that can be authenticated.
  - term: Claim
    definition: A statement about a principal issued by an authority.
  - term: Grant
    definition: An explicit permission giving a principal access to a resource.
---

# BC-001 Identity & Access Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-001` |
| **Context Name** | Identity & Access |
| **Platform** | [PL-001 Security](../../platforms/PL-001/) |
| **Owner Team** | Platform Security Team |
| **Subdomain Type**| Generic |

## 1. Purpose
The **Identity & Access Bounded Context** is responsible for establishing trust across the enterprise. It defines the model for identifying every actor (human and machine) and determining their permissions. 

## 2. Ubiquitous Language
- **Principal**: Any entity (user, service, agent) that can be authenticated.
- **Claim**: A statement about a principal issued by an authority.
- **Grant**: An explicit permission giving a principal access to a resource.

## 3. Contained ABBs
- **[ABB-001 Identity & Access Management](../../building-blocks/architecture-building-blocks/ABB-001/)**

## 4. Realised Capabilities
- **[CAP-004 Identity Lifecycle Management](../../capabilities/CAP-004/)**

