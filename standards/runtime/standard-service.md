---
document_type: standards
title: "Service Standard (Runtime)"
classification: internal
version: 1.0
status: draft
created: 2026-03-07
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Defining a deployable microservice"
  - "Mapping SBBs to execution units"
  - "Designing API or Event-based runtime components"

# Service Standard (Runtime)

This standard defines the rules for **Services** (the unit of execution). A Service is the runtime manifestation of one or more Solution Building Blocks (SBBs).


## 1. Service Metadata
| Property | Value | Notes |
| :--- | :--- | :--- |
| **Service Name** | kebab-case name | e.g., `identity-lifecycle-svc`. |
| **Parent Context** | Context Name | The Bounded Context this service resides in. |
| **Runtime Type** | Container / Serverless | The execution environment. |
| **SBB Realised** | `SBB-NNN` | The SBB this service implements. |


## 2. Structural Rules
- **Context Integrity**: A Service MUST NOT span across multiple Bounded Contexts. It lives entirely within one.
- **Interface Adherence**: A Service MUST implement the interfaces defined in its parent ABB/SBB.
- **Granularity**: A Service should focus on a specific, cohesive set of functionalities (Microservices pattern).


## 3. Communication
- **Internal**: Intra-context communication can be optimised.
- **External**: Cross-context communication MUST be via the interfaces declared in the architecture.


## AI Agent Self-Verification Checklist

1. [ ] **Naming**: Is the service name in kebab-case?
2. [ ] **Boundary**: Is the service contained within a single Bounded Context?
3. [ ] **SBB Link**: Does the service metadata link to a specific SBB?
4. [ ] **Observability**: Does the service implement the mandatory foundation observability patterns?
