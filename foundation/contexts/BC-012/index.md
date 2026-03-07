---
title: "BC-012 Continuous Delivery Bounded Context"
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
