---
title: "BC-007 Supply Chain Security Bounded Context"
---

# BC-007 Supply Chain Security Bounded Context

| Property | Value |
| :--- | :--- |
| **Context ID** | `BC-007` |
| **Context Name** | Supply Chain Security |
| **Platform** | [PL-007 Supply Chain Security](../../platforms/PL-007/) |
| **Owner Team** | Application Security Team |
| **Subdomain Type**| Core |

## 1. Purpose
The **Supply Chain Security Bounded Context** defines the model for verifying the integrity and safety of software artifacts throughout the build and deployment pipeline. It owns the concepts of provenance, attestation, and vulnerability management for dependencies.

## 2. Ubiquitous Language
- **Provenance**: Cryptographically verifiable evidence of where, when, and how an artifact was built.
- **Attestation**: A signed statement about an artifact's properties (e.g., "this image was built from commit X by pipeline Y").
- **SBOM (Software Bill of Materials)**: A machine-readable inventory of all components and dependencies in an artifact.

## 3. Contained ABBs
- *(To be defined)*

## 4. Realised Capabilities
- **[CAP-028 Artifact Provenance & Signing](../../capabilities/CAP-028/)**
- **[CAP-029 Dependency & Vulnerability Scanning](../../capabilities/CAP-029/)**
- **[CAP-030 SBOM Management & Compliance](../../capabilities/CAP-030/)**
