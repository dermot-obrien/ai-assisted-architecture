---
title: "SBB-003 Policy Decision Service (OPA)"
sidebar_label: "SBB-003 Policy Decision Service (OPA)"
sidebar_position: 3
---

# SBB-003 Policy Decision Service (OPA)

## Document Control

| Property | Value | Notes |
|----------|-------|-------|
| **SBB ID** | `SBB-003` | Unique identifier. |
| **SBB Name** | Policy Decision Service (OPA) | Human-readable name. |
| **Short Name** | OPA Service | Used in diagrams. |
| **Realizes ABB**| [ABB-003 Governance & Policy Enforcement](../../architecture-building-blocks/ABB-003/) | Parent logical model. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Category** | `Governance` | Logical grouping. |

---

## 1  Purpose

This SBB realises the logical [ABB-003 Governance & Policy Enforcement](../../architecture-building-blocks/ABB-003/) using **Open Policy Agent (OPA)**. It provides a high-performance, decoupled policy evaluation service that allows building blocks to offload authorization and operational decisions to a centralized, version-controlled engine using the **Rego** policy language.

---

## 2  Building block

### 2.1  Component Diagram

The diagram below shows the physical realisation of the Governance ABB. OPA is deployed as a central Policy Decision Service or as a local sidecar to consuming building blocks. Policies are authored in Rego and distributed via signed bundles. Decision logs are streamed to the Observability context for audit and compliance.

![SBB-003 Policy Decision Service (OPA) Component Diagram](./components.png)

### 2.2  Product mapping (ABB → SBB)

| ABB Component | SBB Product / Service | Notes |
|---------------|----------------------|-------|
| Policy Authoring | VS Code with OPA Plugin | Rego policy development and unit testing. |
| Policy Repository | GitHub / GitLab | Version-controlled source of truth for Rego files. |
| Policy Distribution | OPA Bundle Service | Distributes signed policy bundles via HTTP. |
| Policy Decision Point | OPA Engine (pdp-service) | Core Rego evaluation unit (Docker/Sidecar). |
| Policy Enforcement Adapter | OPA SDK / Envoy Plugin | Intercepts requests and calls the OPA API. |
| Compliance Evidence Collector | OPA Decision Logs | Structured JSON logs of every evaluation. |
| Change Governance Engine | GitHub Actions | Enforces review/approval before merging Rego changes. |
| **Identity (cross-cutting)** | Entra Workload ID | Secures the OPA-to-Bundle-Service communication. |
| **Observability (cross-cutting)** | OTel Collector | Exports OPA decision logs to Log Analytics. |

### 2.3  Key design decisions

- **Decoupled Logic**. Policies MUST be written in Rego and stored outside of application code.
- **Bundle-Based Distribution**. Evaluation points pull signed, compiled policy bundles rather than querying a central database for rules.
- **Fail-Closed**. If the Policy Decision Point is unreachable, the enforcement adapter MUST return a `Deny` decision by default.

### 2.4  Message Flow

1. **Query**. A service sends a JSON request (Input) to the OPA `v1/data` endpoint.
2. **Evaluation**. OPA evaluates the input against the local cached policy bundle and data.
3. **Decision**. OPA returns a JSON response (Result) with the permit/deny decision.
4. **Logging**. OPA generates a decision log entry containing the input, result, and policy version.
5. **Ingestion**. The OTel collector picks up the decision log and exports it for audit.

---

## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description (SBB-specific realisation) |
|----|-----------|------|-----------------------------------------|
| **I1** | Service → OPA | REST/JSON | Policy decision request to the OPA API. |
| **I4** | OPA → Server | HTTP/S | Signed policy bundle download from distribution service. |
| **I8** | OPA → OTel | JSON/Log | Decision log export for evidence collection. |

---

## 4  Mapping

### 4.1  Entity mapping

- **Policy Engine** → Open Policy Agent (OPA) container.
- **Policy Store** → Version-controlled Git repository.

### 4.2  Policy mapping

- **Separation of Duties** → Achieved by separating policy authoring from application logic.

---

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | Retrospective standardisation of SBB-003. |
