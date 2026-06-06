---
id: BC-012
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-012 Continuous Delivery Bounded Context"
governance_zone: foundation
part_of: PL-012
subdomain_kind: generic
realises_capabilities:
  - CAP-040
  - CAP-041
  - CAP-042
ubiquitous_language:
  - term: Pipeline
    definition: An ordered sequence of stages (build, test, deploy) that transforms source code into a running service.
  - term: Artifact
    definition: A versioned, immutable output of a build process (container image, package, Helm chart).
  - term: Deployment Strategy
    definition: A policy governing how new versions are rolled out (canary, blue-green, rolling, progressive).
  - term: Promotion
    definition: The act of moving an artifact from one environment to the next after quality gates pass.
  - term: Release
    definition: A named, auditable event marking an artifact version as available in production.
---

# BC-012 Continuous Delivery Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-012` |
| **Context Name** | Continuous Delivery |
| **Platform** | [PL-012 Continuous Delivery](../../platforms/PL-012/) |
| **Owner Team** | Delivery Platform Team |
| **Subdomain Type** | Generic |

## 1. Purpose
The **Continuous Delivery Bounded Context** defines the language and rules for automating the software delivery lifecycle — from source commit through build, test, and deployment to production. It standardises pipeline definitions, deployment strategies, and artifact lifecycle management.

## 2. Ubiquitous Language
- **Pipeline**: An ordered sequence of stages (build, test, deploy) that transforms source code into a running service.
- **Artifact**: A versioned, immutable output of a build process (container image, package, Helm chart).
- **Deployment Strategy**: A policy governing how new versions are rolled out (canary, blue-green, rolling, progressive).
- **Promotion**: The act of moving an artifact from one environment to the next after quality gates pass.
- **Release**: A named, auditable event marking an artifact version as available in production.

## 3. Contained ABBs
(To be defined)

## 4. Realised Capabilities
- **[CAP-040 Build & Test Automation](../../capabilities/CAP-040/)**
- **[CAP-041 Deployment Orchestration](../../capabilities/CAP-041/)**
- **[CAP-042 Artifact Management](../../capabilities/CAP-042/)**

