---
id: BC-009
kind: bounded-context
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "BC-009 Configuration & Secrets Bounded Context"
governance_zone: foundation
part_of: PL-009
subdomain_kind: generic
realises_capabilities:
  - CAP-036
  - CAP-037
  - CAP-038
ubiquitous_language:
  - term: Configuration Source
    definition: A versioned store of key-value pairs or structured configuration that services consume at runtime.
  - term: Secret
    definition: A sensitive credential (API key, certificate, connection string) that must be encrypted at rest and in transit.
  - term: Feature Flag
    definition: A runtime toggle that controls the availability of a feature without redeployment.
---

# BC-009 Configuration & Secrets Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-009` |
| **Context Name** | Configuration & Secrets |
| **Platform** | [PL-009 Configuration & Secret Management](../../platforms/PL-009/) |
| **Owner Team** | Platform Engineering Team |
| **Subdomain Type**| Generic |

## 1. Purpose
The **Configuration & Secrets Bounded Context** defines the model for managing application configuration, secrets, and feature flags across environments. It owns the concepts of configuration sources, secret vaults, and progressive delivery controls.

## 2. Ubiquitous Language
- **Configuration Source**: A versioned store of key-value pairs or structured configuration that services consume at runtime.
- **Secret**: A sensitive credential (API key, certificate, connection string) that must be encrypted at rest and in transit.
- **Feature Flag**: A runtime toggle that controls the availability of a feature without redeployment.

## 3. Contained ABBs
- *(To be defined)*

## 4. Realised Capabilities
- **[CAP-036 Centralised Configuration Management](../../capabilities/CAP-036/)**
- **[CAP-037 Secret Lifecycle & Rotation](../../capabilities/CAP-037/)**
- **[CAP-038 Feature Management & Progressive Delivery](../../capabilities/CAP-038/)**

