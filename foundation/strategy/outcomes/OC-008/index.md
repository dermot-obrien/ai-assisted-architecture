---
id: OC-008
kind: outcome
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "OC-008 Software Supply Chain Integrity"
governance_zone: foundation
kpi: 100% of production artifacts have verified provenance signatures and current SBOM with no critical/high vulnerabilities unresolved beyond SLA.
business_rationale: Software supply chain attacks (SolarWinds, Log4Shell, xz-utils) demonstrate that unmanaged dependencies are a critical attack vector. Regulatory frameworks (EU CRA, US EO 14028) increasingly mandate SBOM and provenance verification.
owned_by_platform: PL-007
requires_capabilities:
  - CAP-028
  - CAP-029
  - CAP-030
---

# OC-008 Software Supply Chain Integrity

| Property | Value |
| :--- | :--- |
| **Outcome ID** | `OC-008` |
| **Name** | Software Supply Chain Integrity |
| **Measure** | 100% of production artifacts have verified provenance signatures and current SBOM with no critical/high vulnerabilities unresolved beyond SLA. |
| **Status** | `draft`|

## 1. Definition
Achieve a state where every artifact in production can be traced to its source, its dependencies are known and scanned, and its provenance is cryptographically verified.

## 2. Business Rationale
Software supply chain attacks (SolarWinds, Log4Shell, xz-utils) demonstrate that unmanaged dependencies are a critical attack vector. Regulatory frameworks (EU CRA, US EO 14028) increasingly mandate SBOM and provenance verification.

## 3. Traceability
- **[CAP-028 Artifact Provenance & Signing](../../../capabilities/CAP-028/)**
- **[CAP-029 Dependency & Vulnerability Scanning](../../../capabilities/CAP-029/)**
- **[CAP-030 SBOM Management & Compliance](../../../capabilities/CAP-030/)**

