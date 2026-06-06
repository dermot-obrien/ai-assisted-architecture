---
id: CAP-039
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-039 Continuous Delivery"
sidebar_label: "CAP-039 Continuous Delivery"
sidebar_position: 39
---

# CAP-039 Continuous Delivery

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-039` | Unique identifier. |
| **Capability Name** | Continuous Delivery | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-012 Continuous Delivery](../../platforms/PL-012/) | Parent platform. |

The organisation must automate the path from code commit to production deployment, providing self-service build pipelines, deployment strategies, and artifact management that enable stream-aligned teams to ship changes reliably and frequently.


## 1  Purpose

Without a centralised delivery platform, each team builds bespoke CI/CD pipelines with inconsistent quality gates, deployment strategies, and artifact handling. This leads to configuration drift, unreliable releases, and high mean time to recovery. Continuous Delivery standardises the pipeline from commit to production.


## 2  Capability Definition

### 2.1  Organisation

- **Delivery Platform Team.** Owns pipeline infrastructure, deployment tooling, and artifact registries.
- **Application Development Teams.** Consume pipelines through templates and self-service configuration.

### 2.2  People

- **Platform Engineers.** Build and maintain pipeline infrastructure and deployment tooling.
- **Release Engineers.** Define deployment strategies and promotion policies.
- **Developer Advocates.** Create pipeline templates and onboarding guides.

### 2.3  Processes

- **Pipeline Template Lifecycle.** Design, review, publish, version, and retire pipeline templates.
- **Artifact Promotion.** Automated progression of artifacts through environments with quality gates.
- **Release Management.** Coordinated release planning, approval, and rollback procedures.
- **Deployment Audit.** Immutable audit trail of all deployments with identity, artifact, and outcome.

### 2.4  Technology

- **Build Orchestration Engine.** Executes build and test stages with parallelism and caching.
- **Deployment Controller.** Manages progressive rollout strategies (canary, blue-green, rolling).
- **Artifact Registry.** Stores and distributes versioned artifacts (container images, packages, charts).
- **Pipeline-as-Code Runtime.** Interprets declarative pipeline definitions from source repositories.


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

Teams have individual CI/CD pipelines with varying quality. No centralised deployment orchestration or artifact management.

### 3.3  Maturity Roadmap

- **1 → 2.** Establish standard pipeline templates for the top-5 workload types. Centralise artifact storage.
- **2 → 3.** Full self-service pipeline provisioning. Automated deployment strategies with quality gates. DORA metrics tracked and visible.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-039 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-040](../CAP-040/) (Build & Test Automation), [CAP-041](../CAP-041/) (Deployment Orchestration), and [CAP-042](../CAP-042/) (Artifact Management) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-040](../CAP-040/) | Build & Test Automation | L3 | 1 |
| [CAP-041](../CAP-041/) | Deployment Orchestration | L3 | 1 |
| [CAP-042](../CAP-042/) | Artifact Management | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-039 Continuous Delivery capability created. |
