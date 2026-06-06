---
id: CAP-020
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-020 Cost Visibility & Allocation"
sidebar_label: "CAP-020 Cost Visibility & Allocation"
sidebar_position: 20
governance_zone: foundation
level: L3
parent: CAP-019
provided_by_platform: PL-005
required_by_outcomes:
  - OC-006
components:
  organisation: FinOps Team, Platform Engineering Team, Finance Team
  people:
    - FinOps Engineers
    - Platform Engineers
    - Financial Analysts
  processes:
    - Tag Governance
    - Cost Aggregation
    - Allocation Rules
    - Cost Reporting
  technology: Cost Data Pipeline, Tag Enforcement Engine, Cost Dashboard, Allocation Rules Engine
maturity:
  current: 1
  target: 3
  assessment_date: "2026-03-08"
  assessor: Architecture Team
---

# CAP-020 Cost Visibility & Allocation

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-020` | Unique identifier. |
| **Capability Name** | Cost Visibility & Allocation | Human-readable name. |
| **Realizes Outcome**| [OC-006 Cloud Cost Efficiency](../../../strategy/outcomes/OC-006/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-019` | Cost Management. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-005 Cost Management](../../platforms/PL-005/) | Parent platform. |

The organisation must provide real-time visibility into infrastructure costs, accurately attributed to owning teams, services, and business units through consistent tagging and allocation rules.


## 1  Purpose

You cannot optimise what you cannot see. Cost visibility is the foundation of financial accountability. Without accurate attribution, teams cannot make informed trade-offs and leadership cannot assess return on infrastructure investment.


## 2  Capability Definition

### 2.1  Organisation

- **FinOps Team.** Owns cost data pipelines and reporting.
- **Platform Engineering Team.** Enforces tagging at provisioning.
- **Finance Team.** Defines allocation hierarchies.

### 2.2  People

- **FinOps Engineers.** Build cost dashboards and data pipelines.
- **Platform Engineers.** Implement tag enforcement in provisioning workflows.
- **Financial Analysts.** Consume cost reports for planning.

### 2.3  Processes

- **Tag Governance.** Define, enforce, and audit cost allocation tags.
- **Cost Aggregation.** Collect and normalise cost data across providers and services.
- **Allocation Rules.** Define shared-cost distribution logic.
- **Cost Reporting.** Generate team, service, and business unit cost views.

### 2.4  Technology

- **Cost Data Pipeline.** Ingests and normalises cost data from cloud providers and internal services.
- **Tag Enforcement Engine.** Validates and enforces mandatory cost allocation tags at provisioning time.
- **Cost Dashboard.** Interactive visualisation of cost data with drill-down by team, service, and resource.
- **Allocation Rules Engine.** Applies shared-cost distribution rules to attribute common infrastructure costs.


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

Cost data is available from cloud provider consoles but not aggregated or normalised. Tagging is inconsistent and not enforced. No shared-cost allocation rules exist.


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
| 1.0 | 2026-03-08 | Initial Draft | CAP-020 Cost Visibility & Allocation capability created. |

