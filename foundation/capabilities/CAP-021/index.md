---
id: CAP-021
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-021 Cost Optimisation & Rightsizing"
sidebar_label: "CAP-021 Cost Optimisation & Rightsizing"
sidebar_position: 21
---

# CAP-021 Cost Optimisation & Rightsizing

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-021` | Unique identifier. |
| **Capability Name** | Cost Optimisation & Rightsizing | Human-readable name. |
| **Realizes Outcome**| [OC-006 Cloud Cost Efficiency](../../../strategy/outcomes/OC-006/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-019` | Cost Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-005 Cost Management](../../platforms/PL-005/) | Parent platform. |

The organisation must continuously identify and act on opportunities to reduce infrastructure costs through rightsizing, reservation management, spot/preemptible usage, and elimination of idle resources.


## 1  Purpose

Over-provisioned and idle resources are the largest source of cloud waste. Automated optimisation ensures resources match actual demand without compromising performance or reliability.


## 2  Capability Definition

### 2.1  Organisation

- **FinOps Team.** Owns optimisation recommendations.
- **Platform Engineering Team.** Implements automated scaling and resource policies.
- **Service Owners.** Approve and act on rightsizing recommendations.

### 2.2  People

- **FinOps Engineers.** Analyse usage patterns and generate recommendations.
- **Cloud Architects.** Design cost-efficient patterns.
- **SREs.** Validate that optimisation actions do not impact reliability.

### 2.3  Processes

- **Usage Analysis.** Continuous monitoring of resource utilisation against allocated capacity.
- **Rightsizing Recommendations.** Automated identification of over-provisioned resources.
- **Reservation Management.** Purchase, track, and optimise reserved capacity commitments.
- **Idle Resource Cleanup.** Automated detection and notification for unused resources.

### 2.4  Technology

- **Usage Analytics Engine.** Analyses resource utilisation patterns across compute, storage, and network.
- **Rightsizing Recommender.** Generates specific resource adjustment recommendations based on observed usage.
- **Reservation Manager.** Tracks reserved capacity utilisation and recommends purchases, exchanges, or cancellations.
- **Idle Resource Detector.** Identifies resources with zero or near-zero utilisation for cleanup.


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

Optimisation is manual and reactive. Some teams review cloud provider recommendations but there is no systematic process for rightsizing or reservation management.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the Cost Management ABB is created.

### 4.2  ABB Mapping

No ABB mappings defined yet.

### 4.3  Gaps

ABB mappings will be defined when the Cost Management ABB is created.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-021 Cost Optimisation & Rightsizing capability created. |
