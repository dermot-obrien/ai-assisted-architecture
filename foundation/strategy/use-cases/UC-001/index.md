---
id: UC-001
kind: use-case
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "UC-001 Automated Workload Identity Provisioning"
governance_zone: foundation
primary_actor: Developer / Pipeline
supports_outcome: OC-001
preconditions:
  - The compute platform is registered as a trusted token issuer with the identity provider.
  - Workload identity federation is configured for the target runtime.
  - The deploying pipeline is authenticated and authorised to request identities.
success_criteria:
  - Pod receives a valid OIDC token upon startup.
  - No static client secrets exist in the pod configuration.
realised_by_abbs:
  - ABB-001
---

# UC-001 Automated Workload Identity Provisioning

| Property | Value |
| :--- | :--- |
| **Use Case ID** | `UC-001` |
| **Primary Actor**| Developer / Pipeline |
| **Parent Outcome**| [OC-001](../../outcomes/OC-001/) |
| **Status** | `draft`|

## 1. Scenario
A new AI agent is deployed. The system automatically provisions a unique identity principal, binds it to the compute runtime, and issues a short-lived token without developer intervention.

## 2. Pre-conditions
- The compute platform is registered as a trusted token issuer with the identity provider.
- Workload identity federation is configured for the target runtime.
- The deploying pipeline is authenticated and authorised to request identities.

## 3. Success Criteria
- Pod receives a valid OIDC token upon startup.
- No static client secrets exist in the pod configuration.

## 4. Realisation
- **[ABB-001 Identity & Access Management](../../../building-blocks/architecture-building-blocks/ABB-001/)**

