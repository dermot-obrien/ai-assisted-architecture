---
id: SBB-003
kind: sbb
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "SBB-003 Policy Decision Service (OPA)"
sidebar_label: "SBB-003 Policy Decision Service (OPA)"
sidebar_position: 3
governance_zone: foundation
realises:
  - ABB-003
short_name: OPA Service
product_mapping:
  - abb_component: Policy Authoring
    sbb_product: VS Code with OPA Plugin
    notes: Rego policy development and unit testing.
  - abb_component: Policy Repository
    sbb_product: GitHub / GitLab
    notes: Version-controlled source of truth for Rego files.
  - abb_component: Policy Distribution
    sbb_product: OPA Bundle Service
    notes: Distributes signed policy bundles via HTTP.
  - abb_component: Policy Decision Point
    sbb_product: OPA Engine (pdp-service)
    notes: Core Rego evaluation unit (Docker/Sidecar).
  - abb_component: Policy Enforcement Adapter
    sbb_product: OPA SDK / Envoy Plugin
    notes: Intercepts requests and calls the OPA API.
  - abb_component: Compliance Evidence Collector
    sbb_product: OPA Decision Logs
    notes: Structured JSON logs of every evaluation.
  - abb_component: Change Governance Engine
    sbb_product: GitHub Actions
    notes: Enforces review/approval before merging Rego changes.
  - abb_component: Identity (cross-cutting)
    sbb_product: Entra Workload ID
    notes: Secures the OPA-to-Bundle-Service communication.
  - abb_component: Observability (cross-cutting)
    sbb_product: OTel Collector
    notes: Exports OPA decision logs to Log Analytics.
products:
  - name: VS Code with OPA Plugin
  - name: GitHub / GitLab
  - name: OPA Bundle Service
  - name: OPA Engine (pdp-service)
  - name: OPA SDK / Envoy Plugin
  - name: OPA Decision Logs
  - name: GitHub Actions
  - name: Entra Workload ID
  - name: OTel Collector
---

# SBB-003 Policy Decision Service (OPA)

## 1  Purpose

This SBB realises the logical [ABB-003 Governance & Policy Enforcement](../../architecture-building-blocks/ABB-003/) using Open Policy Agent (OPA). It provides a high-performance, decoupled policy evaluation service that allows building blocks to offload authorisation and operational decisions to a centralised, version-controlled engine using the Rego policy language.

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

- **Decoupled logic.** Policies are written in Rego and stored outside of application code.
- **Bundle-based distribution.** Evaluation points pull signed, compiled policy bundles rather than querying a central database for rules.
- **Fail-closed.** If the Policy Decision Point is unreachable, the enforcement adapter returns a `Deny` decision by default.

### 2.4  Message flow

1. **Query.** A service sends a JSON request (input) to the OPA `v1/data` endpoint.
2. **Evaluation.** OPA evaluates the input against the local cached policy bundle and data.
3. **Decision.** OPA returns a JSON response (result) with the permit/deny decision.
4. **Logging.** OPA generates a decision log entry containing the input, result, and policy version.
5. **Ingestion.** The OTel collector picks up the decision log and exports it for audit.

### 2.5  Identity & Access Management

- **Entra Workload ID.** OPA authenticates to the bundle service and downstream systems using secret-less workload identity.
- **Authenticated decision API.** Callers of the OPA decision API present a verified workload token before a decision is returned.
- **Least-privilege bundle access.** The OPA engine is authorised only to pull the specific signed policy bundles it requires.

### 2.6  Observability

- **OPA decision logs.** Every evaluation emits a structured JSON decision log (input, result, policy version) exported via the OTel Collector to Log Analytics.
- **Engine metrics.** OPA exposes evaluation latency, bundle activation status, and error counts as metrics.
- **Bundle provenance.** Bundle download and activation events are logged for audit of which policy version was in force.

### 2.7  Governance & Policy Enforcement

- **GitHub Actions change governance.** Rego changes require review and approval before merge; signed bundles are built from the approved source of truth.
- **Signed policy bundles.** Bundles are cryptographically signed and verified on activation to prevent tampering.
- **Fail-closed enforcement.** Policy unavailability results in denial, ensuring no request bypasses governance.

## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description (SBB-specific realisation) |
|----|-----------|------|-----------------------------------------|
| **I1** | Service → OPA | REST/JSON | Policy decision request to the OPA API. |
| **I4** | OPA → Server | HTTP/S | Signed policy bundle download from distribution service. |
| **I8** | OPA → OTel | JSON/Log | Decision log export for evidence collection. |

### 3.2  Dependent building blocks

| SBB Dependency | Product / Service | Interface |
|----------------|------------------|-----------|
| Consumer SBBs → SBB-003 | OPA decision API (policy queries) | I1 |
| SBB-003 → [SBB-001](../SBB-001/) Identity | Entra Workload ID for secure bundle/API access | — |
| SBB-003 → [SBB-002](../SBB-002/) Observability | OTel Collector decision-log export | I8 |

## 4  Mapping

### 4.1  Entity mapping

- **Policy Engine** → Open Policy Agent (OPA) container.
- **Policy Store** → Version-controlled Git repository.

### 4.2  Policy mapping

- **Separation of Duties.** Achieved by separating policy authoring from application logic and gating Rego changes behind independent review.

## 5. ABB Traceability

This SBB realises [ABB-003 Governance & Policy Enforcement](../../architecture-building-blocks/ABB-003/). Every component in the parent ABB's Section 2.2, including the mandatory cross-cutting concerns, is accounted for by an Open Policy Agent product or supporting service.

| ABB Capability | SBB Realisation |
|----------------|-----------------|
| Policy Authoring | VS Code with the OPA plugin (Rego development and unit testing). |
| Policy Repository | GitHub / GitLab (version-controlled Rego source of truth). |
| Policy Distribution | OPA Bundle Service (signed policy bundles over HTTP). |
| Policy Decision Point | OPA Engine / pdp-service (core Rego evaluation unit). |
| Policy Enforcement Adapter | OPA SDK / Envoy plugin (intercepts requests and calls the OPA API). |
| Compliance Evidence Collector | OPA Decision Logs (structured JSON logs of every evaluation). |
| Change Governance Engine | GitHub Actions (review/approval before merging Rego changes). |
| Identity (cross-cutting) | Entra Workload ID securing OPA-to-bundle-service communication. |
| Observability (cross-cutting) | OTel Collector exporting OPA decision logs to Log Analytics. |

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-07 | Initial Draft | Retrospective standardisation of SBB-003. |
| 1.1 | 2026-06-08 | Guidance | Conformed to the SBB document standard: removed the Document Control table and horizontal rules, added §2.5–2.7 cross-cutting sections, §3.2 dependent building blocks, and §5 ABB traceability. |

