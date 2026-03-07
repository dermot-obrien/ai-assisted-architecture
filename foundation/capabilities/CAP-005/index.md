---
title: "CAP-005 Policy-Based Access Control"
sidebar_label: "CAP-005 Policy-Based Access Control"
sidebar_position: 5
---

# CAP-005 Policy-Based Access Control

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-005` | Unique identifier. |
| **Capability Name** | Policy-Based Access Control | Human-readable name. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-002` | Identity & Access. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `DRAFT` | Current lifecycle status. |
| **Domain** | Platform Foundations | L1 domain. |

The organisation must be able to make and enforce access decisions based on policies that evaluate identity attributes, resource classification, risk signals, and contextual factors — ensuring that every action is authorised before execution, consistently across all building blocks.


## 1  Purpose

Static role assignments alone cannot address the access-control requirements of a modern platform. This capability ensures that access decisions consider context (device posture, location, time, risk score) alongside identity and role, and that policy changes take effect across all enforcement points without code changes. It bridges the IAM ABB (which evaluates policies and manages roles) and the Governance ABB (which authors and distributes the policies themselves), illustrating how a single business capability can draw on multiple architectural components.


## 2  Capability Definition

### 2.1  Organisation

- **Security Architecture Team.** Defines the access control model (RBAC, ABAC, or hybrid) and the contextual signals included in policy evaluation.
- **Policy Authors.** Write and maintain access policies in collaboration with business owners, translating business rules into machine-evaluable policy definitions.
- **Business Application Owners.** Define resource sensitivity and access requirements that feed into policy definitions.

### 2.2  People

- **Policy Engineers.** Implement and test access policies in the policy evaluation engine. Conduct policy impact analysis before activation.
- **Security Analysts.** Monitor access decision patterns, investigate anomalies, and recommend policy adjustments.
- **Application Architects.** Integrate building blocks with the policy evaluation interface, implementing the enforcement adapter pattern.

### 2.3  Processes

- **Policy Authoring.** Draft, review, test, approve, and activate access policies through version-controlled workflows.
- **Access Decision Monitoring.** Continuous monitoring of permit/deny rates, step-up triggers, and policy evaluation latency to detect anomalies and misconfigurations.
- **Separation of Duties Review.** Periodic review of role combinations to ensure no single identity holds conflicting privileges.
- **Policy Impact Analysis.** Pre-activation assessment of policy changes to predict the effect on access patterns and identify unintended denials.

### 2.4  Technology

- **Policy Evaluation Engine.** Real-time evaluation of access requests against contextual policies. Must support role-based, attribute-based, and risk-based conditions in a single decision.
- **Role & Permission Store.** Structured repository of role definitions, permission assignments, and scope boundaries.
- **Conditional Access Service.** Evaluation of session risk, device compliance, and environmental factors to produce contextual access decisions (permit, deny, step-up).
- **Policy Distribution Service.** Distribution of policy bundles to enforcement points with version synchronisation guarantees.

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

Basic role-based access control is in place, but conditional access policies are not consistently applied across all building blocks. Policy authoring is manual and not version-controlled. Some building blocks implement their own access logic rather than calling the centralised policy evaluation engine.

### 3.3  Maturity Roadmap

- **1 → 2.** Centralise policy evaluation so all building blocks call the shared policy decision point. Implement version-controlled policy authoring with review gates.
- **2 → 3.** Add contextual signals (device posture, risk score, location) to policy evaluation. Achieve 100% building block adoption of the enforcement adapter pattern. Implement continuous access decision monitoring.


## 4  ABB Realisation

### 4.1  Relationship Model

This capability illustrates the **many-to-many relationship** between capabilities and ABBs. The IAM ABB (AB-001) provides the policy evaluation engine, role management, and conditional access enforcement. The Governance ABB (AB-003) provides the policy authoring, versioning, and distribution infrastructure. Neither ABB alone fully realises this capability — both are required.

### 4.2  ABB Mapping

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [AB-001](../../building-blocks/architecture-building-blocks/AB-001/) | Identity & Access Management | `primary` | `partial` | Provides the policy evaluation engine, role & permission management, conditional access, and token-based enforcement. Does not cover policy authoring or distribution. |
| [AB-003](../../building-blocks/architecture-building-blocks/AB-003/) | Governance & Policy Enforcement | `supporting` | `partial` | Provides policy authoring, policy repository, and policy distribution. Does not provide the real-time evaluation engine or role management. |
| [AB-002](../../building-blocks/architecture-building-blocks/AB-002/) | Observability | `cross-cutting` | `full` | Receives access decision telemetry, policy evaluation metrics, and denial event alerts. |

### 4.3  Gaps

All technology needs are realised by the combination of AB-001 and AB-003. No gaps exist when both ABBs are implemented.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | CAP-005 Policy-Based Access Control capability created. |
