---
id: BC-008
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-008 Data Governance Bounded Context"
governance_zone: foundation
part_of: PL-008
subdomain_kind: core
realises_capabilities:
  - CAP-032
  - CAP-033
  - CAP-034
ubiquitous_language:
  - term: Classification Label
    definition: A sensitivity designation (e.g., Public, Internal, Confidential, Restricted) applied to a data store or field.
  - term: Retention Policy
    definition: A rule that defines how long data is kept and when it must be archived or deleted.
  - term: Data Residency Constraint
    definition: A rule specifying the geographic region(s) where data may be stored and processed.
---

# BC-008 Data Governance Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-008` |
| **Context Name** | Data Governance |
| **Platform** | [PL-008 Data Management](../../platforms/PL-008/) |
| **Owner Team** | Data Governance Team |
| **Subdomain Type**| Core |

## 1. Purpose
The **Data Governance Bounded Context** defines the model for classifying, governing, and managing data throughout its lifecycle. It owns the concepts of data classification, retention rules, and sovereignty constraints that apply across all platform services.

## 2. Ubiquitous Language
- **Classification Label**: A sensitivity designation (e.g., Public, Internal, Confidential, Restricted) applied to a data store or field.
- **Retention Policy**: A rule that defines how long data is kept and when it must be archived or deleted.
- **Data Residency Constraint**: A rule specifying the geographic region(s) where data may be stored and processed.

## 3. Contained ABBs
- (To be defined)

## 4. Realised Capabilities
- **[CAP-032 Data Classification & Privacy](../../capabilities/CAP-032/)**
- **[CAP-033 Data Lifecycle & Retention](../../capabilities/CAP-033/)**
- **[CAP-034 Data Sovereignty & Residency](../../capabilities/CAP-034/)**

