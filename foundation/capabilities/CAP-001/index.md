---
id: CAP-001
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-001 Platform Foundations"
sidebar_label: "CAP-001 Platform Foundations"
sidebar_position: 1
---

# CAP-001 Platform Foundations

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-001` | Unique identifier. |
| **Capability Name** | Platform Foundations | Human-readable name. |
| **Level** | `L1` | Capability domain. |
| **Parent** | - | Top-level domain; no parent. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | — | L1 capability — spans all platforms. |

The organisation must be able to secure, monitor, and govern all platform services through shared, reusable capabilities that every other capability depends upon. Platform Foundations encompasses the cross-cutting concerns that underpin trust, visibility, and compliance across the entire architecture.


## 1  Purpose

Every platform capability depends on a common foundation of identity, observability, and governance. Without centralised identity management, each capability would implement its own authentication and authorisation, leading to inconsistent security posture and audit gaps. Without unified observability, operational incidents would be investigated in silos with no end-to-end visibility. Without codified governance, policy enforcement would vary by team and deployment.

Platform Foundations exists to ensure these cross-cutting concerns are defined once, realised by dedicated Architecture Building Blocks, and consumed consistently by all other capabilities in the architecture.


## 2  Capability Definition

### 2.1  Organisation

- **Platform Security Team.** Owns identity and access management capability, defines authentication and authorisation standards, and manages cross-cutting security posture.
- **Platform Operations Team.** Owns observability capability, operates monitoring infrastructure, and responds to operational alerts.
- **Governance Office.** Owns policy management and compliance capability, authors organisational policies, and coordinates regulatory responses.
- **Architecture Review Board.** Governs changes to platform foundation capabilities and approves cross-cutting architectural decisions.

### 2.2  People

- **Security Architects.** Design identity federation, access control models, and credential management patterns.
- **Site Reliability Engineers.** Operate observability infrastructure, define alert rules, and investigate cross-building-block incidents.
- **Compliance Analysts.** Map organisational policies to regulatory requirements, collect compliance evidence, and produce audit reports.
- **Policy Authors.** Define and maintain machine-readable policy rules in collaboration with subject-matter experts.

### 2.3  Processes

- **Identity Lifecycle.** End-to-end management of human and non-human identities from provisioning through attestation review to decommissioning.
- **Incident Response.** Detection, triage, investigation, and resolution of operational incidents using observability data and cross-building-block traces.
- **Policy Change.** Authoring, reviewing, approving, and distributing policy changes through version-controlled workflows.
- **Compliance Assessment.** Periodic and continuous assessment of compliance posture against regulatory and organisational requirements.

### 2.4  Technology

- **Centralised Identity Platform.** A shared identity and access management service that all building blocks consume for authentication, authorisation, and federation.
- **Unified Observability Platform.** A shared signal-collection, storage, and visualisation service that all building blocks emit telemetry into and all operators query.
- **Policy Decision Service.** A shared policy evaluation engine that all building blocks call before making access, data-handling, and operational decisions.


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
| **Assessment Date** | 2026-03-07 |
| **Assessor** | Architecture Team |

The platform has initial implementations of identity, observability, and governance but they are not yet standardised or consistently consumed by all building blocks. Each concern is addressed in isolation without a unified cross-cutting posture.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L1 capability, CAP-001 does not map directly to ABBs. Its ABB mappings are the aggregate of its L2 and L3 children.

### 4.2  ABB Mapping

L1 capabilities aggregate their children's mappings. See [CAP-002](../CAP-002/), [CAP-003](../CAP-003/), [CAP-008](../CAP-008/), and [CAP-009](../CAP-009/) for L2 groupings, and [CAP-004](../CAP-004/), [CAP-005](../CAP-005/), [CAP-006](../CAP-006/), [CAP-007](../CAP-007/), [CAP-010](../CAP-010/), [CAP-011](../CAP-011/), [CAP-012](../CAP-012/), [CAP-013](../CAP-013/) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-002](../CAP-002/) | Identity & Access | L2 | 1 |
| [CAP-003](../CAP-003/) | Operational Intelligence | L2 | 1 |
| [CAP-008](../CAP-008/) | Integration Services | L2 | 1 |
| [CAP-009](../CAP-009/) | Infrastructure Services | L2 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.1 | 2026-03-07 | Updated | Added Integration Services and Infrastructure Services L2 linkages and expanded L3 mapping references. |
| 1.0 | 2026-03-07 | Initial Draft | CAP-001 Platform Foundations capability created. |


