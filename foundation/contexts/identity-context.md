---
title: "Identity & Access Bounded Context"
---

# Identity & Access Bounded Context

| Property | Value |
| :--- | :--- |
| **Context Name** | Identity & Access |
| **Domain** | Security |
| **Owner Team** | Platform Security Team |
| **Subdomain Type**| Generic |

## 1. Purpose
The **Identity & Access Bounded Context** is responsible for establishing trust across the enterprise. It defines the model for identifying every actor (human and machine) and determining their permissions. 

## 2. Ubiquitous Language
- **Principal**: Any entity (user, service, agent) that can be authenticated.
- **Claim**: A statement about a principal (e.g., name, role) issued by an authority.
- **Grant**: An explicit permission giving a principal access to a resource.

## 3. Contained ABBs
- **[AB-001 Identity & Access Management](../building-blocks/architecture-building-blocks/AB-001/)**

## 4. Realized Capabilities
- **[CAP-004 Identity Lifecycle Management](../capabilities/CAP-004/)**
