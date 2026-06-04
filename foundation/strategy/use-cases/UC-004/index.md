---
title: "UC-004 Standardised API Governance"
---

# UC-004 Standardised API Governance

| Property | Value |
| :--- | :--- |
| **Use Case ID** | `UC-004` |
| **Primary Actor**| Service Developer |
| **Parent Outcome**| [OC-011](../../outcomes/OC-011/) |
| **Status** | `draft`|

## 1. Scenario
A developer registers a new service. The API Gateway automatically enforces the organization's standard security, rate-limiting, and versioning policies based on the service's declared contract.

## 2. Success Criteria
- Policy enforcement is automated without manual gateway configuration.
- Breaking changes are detected via contract validation at the gateway.

## 3. Realisation
- **[ABB-004 API Mediation & Gateway](../../../building-blocks/architecture-building-blocks/ABB-004/)**
