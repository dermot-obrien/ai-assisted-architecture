---
id: BC-004
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-004 Developer Platform Bounded Context"
---

# BC-004 Developer Platform Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-004` |
| **Context Name** | Developer Platform |
| **Platform** | [PL-004 Developer Experience](../../platforms/PL-004/) |
| **Owner Team** | Platform Engineering Team |
| **Subdomain Type**| Supporting |

## 1. Purpose
The **Developer Platform Bounded Context** provides the self-service layer through which developers consume platform capabilities. It defines the model for service templates, provisioning workflows, and the developer portal.

## 2. Ubiquitous Language
- **Golden Path**: A pre-approved, opinionated workflow for a common task (e.g., deploy a containerised service).
- **Template**: A parameterised blueprint that generates infrastructure and application scaffolding.
- **Catalog Entry**: A registered, discoverable service or component with ownership and lifecycle metadata.

## 3. Contained ABBs
(To be defined)

## 4. Realised Capabilities
- **[CAP-016 Self-Service Provisioning](../../capabilities/CAP-016/)**
- **[CAP-017 Golden Path & Template Management](../../capabilities/CAP-017/)**
- **[CAP-018 Service Catalog & Developer Portal](../../capabilities/CAP-018/)**
- **[CAP-043 Environment Lifecycle Management](../../capabilities/CAP-043/)**
