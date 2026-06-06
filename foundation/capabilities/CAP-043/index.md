---
id: CAP-043
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-043 Environment Lifecycle Management"
sidebar_label: "CAP-043 Environment Lifecycle Management"
sidebar_position: 43
---

# CAP-043 Environment Lifecycle Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-043` | Unique identifier. |
| **Capability Name** | Environment Lifecycle Management | Human-readable name. |
| **Realizes Outcome**| [OC-005 Developer Self-Service Efficiency](../../../strategy/outcomes/OC-005/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-015` | Developer Experience. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-004 Developer Experience](../../platforms/PL-004/) | Parent platform. |

The organisation must enable on-demand provisioning, composition, and teardown of complete application environments (dev, staging, preview, ephemeral) through self-service workflows.


## 1  Purpose

Shared, long-lived environments create contention, configuration drift, and slow feedback loops. Environment Lifecycle Management enables teams to spin up isolated, production-like environments on demand, run their validations, and tear them down automatically. This eliminates environment queuing, reduces costs, and accelerates the inner development loop.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Engineering Team.** Owns environment orchestration infrastructure and templates.
- **Development Teams.** Consume self-service environment provisioning for development and testing.
- **FinOps Team.** Monitors environment costs and enforces budget policies.

### 2.2  People

- **Platform Engineers.** Build and maintain environment orchestration tooling and templates.
- **Developers.** Provision and manage ephemeral environments through self-service interfaces.
- **FinOps Engineers.** Track environment costs and define auto-teardown policies.

### 2.3  Processes

- **Environment Provisioning.** Self-service creation of environments from templates with dependency resolution.
- **Environment Composition.** Assemble multi-service environments with correct versions, configuration, and data seeding.
- **Lifecycle Enforcement.** Automatic expiry and teardown of ephemeral environments based on TTL and inactivity policies.
- **Environment Compliance.** Ensure provisioned environments meet security, networking, and access control standards.

### 2.4  Technology

- **Environment Orchestrator.** Coordinates provisioning of all components (compute, networking, data, services) for a complete environment.
- **Environment Template Engine.** Defines reusable, versioned environment blueprints with parameterisation.
- **Namespace/Cluster Manager.** Provisions and manages isolated Kubernetes namespaces or clusters for environment isolation.
- **Preview Environment Controller.** Automatically creates and destroys preview environments linked to pull requests.


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

Environments are provisioned manually or through ad-hoc scripts. Shared environments cause contention and drift. No self-service provisioning or automatic teardown.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-043 Environment Lifecycle Management capability created. |
