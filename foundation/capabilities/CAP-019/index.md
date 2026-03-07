---
title: "CAP-019 Cost Management"
sidebar_label: "CAP-019 Cost Management"
sidebar_position: 19
---

# CAP-019 Cost Management

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-019` | Unique identifier. |
| **Capability Name** | Cost Management | Human-readable name. |
| **Level** | `L2` | Capability group. |
| **Parent** | `CAP-001` | Platform Foundations. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-005 Cost Management](../../platforms/PL-005/) | Parent platform. |

The organisation must be able to track, attribute, optimise, and govern cloud infrastructure spend across all platform services to ensure financial accountability and efficient resource utilisation.


## 1  Purpose

Without cost management capabilities, cloud spend becomes opaque and grows unchecked. Teams over-provision because they lack visibility, and finance teams cannot attribute costs to business outcomes. Cost Management ensures every resource has an owner, every spend has a purpose, and every anomaly has an alert.


## 2  Capability Definition

### 2.1  Organisation

- **FinOps Team.** Owns cost management processes and tooling.
- **Platform Engineering Team.** Implements tagging standards and resource policies.
- **Finance Team.** Consumes cost reports and manages budget allocations.

### 2.2  People

- **FinOps Engineers.** Build cost dashboards and optimisation workflows.
- **Cloud Architects.** Design cost-efficient resource patterns.
- **Budget Owners.** Review and approve spend against allocated budgets.

### 2.3  Processes

- **Cost Tagging Enforcement.** All resources must carry allocation tags at provisioning time.
- **Monthly Cost Review.** Team-level spend review against budgets.
- **Optimisation Cycle.** Periodic rightsizing and reservation recommendations.
- **Anomaly Response.** Automated alerts when spend deviates from forecast.

### 2.4  Technology

- **Cost Aggregation & Attribution Engine.** Collects, normalises, and attributes cost data across providers and services.
- **Optimisation Recommendation Service.** Analyses usage patterns and generates rightsizing, reservation, and idle resource recommendations.
- **Budget Enforcement & Alerting.** Monitors spend against budgets and triggers alerts or automated controls at defined thresholds.
- **Chargeback/Showback Reporting.** Generates team, service, and business unit cost views for internal billing or visibility.


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

Basic cloud cost reporting exists but tagging is inconsistent. No automated anomaly detection or budget enforcement. Optimisation is manual and reactive.

### 3.3  Maturity Roadmap

- **1 → 2.** Enforce mandatory cost tags at provisioning. Implement monthly showback reporting. Deploy spend anomaly detection.
- **2 → 3.** Automated rightsizing recommendations. Real-time budget enforcement with automated throttling. Full chargeback integrated with financial systems.


## 4  ABB Realisation

### 4.1  Relationship Model

As an L2 capability, CAP-019 does not map directly to ABBs. Its ABB mappings are the aggregate of its L3 children.

### 4.2  ABB Mapping

See [CAP-020](../CAP-020/) (Cost Visibility & Allocation), [CAP-021](../CAP-021/) (Cost Optimisation & Rightsizing), and [CAP-022](../CAP-022/) (Budget Governance & Anomaly Detection) for L3 mappings.

### 4.3  Gaps

Gaps are documented at the L3 level in individual capability documents.


## 5  Sub-Capabilities

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-020](../CAP-020/) | Cost Visibility & Allocation | L3 | 1 |
| [CAP-021](../CAP-021/) | Cost Optimisation & Rightsizing | L3 | 1 |
| [CAP-022](../CAP-022/) | Budget Governance & Anomaly Detection | L3 | 1 |


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-019 Cost Management capability created. |
