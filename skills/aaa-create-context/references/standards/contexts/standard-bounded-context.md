---
document_type: standards
title: "Bounded Context Standard"
classification: internal
version: 1.0
status: draft
created: 2026-03-07
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Defining a new technical boundary"
  - "Assigning ownership to a product team"
  - "Organising ABBs into solution domains"
---
# Bounded Context Standard

This standard defines the rules for establishing **Bounded Contexts** (Solution Space). A Bounded Context is a linguistic and structural boundary where a specific domain model is valid.

## 1. File Structure
Each Bounded Context is a folder named by its identifier, containing an `index.md` file:
```
contexts/
  BC-001/
    index.md            # The context definition
```

## 2. Context Metadata
| Property | Value | Notes |
| :--- | :--- | :--- |
| **Context ID** | `BC-NNN` | Unique identifier (e.g., `BC-001`). |
| **Context Name** | Name | e.g., "Identity & Access", "Inventory". |
| **Platform** | `PL-NNN` | The parent Platform (e.g., `PL-001`). A Bounded Context belongs to exactly one Platform. |
| **Owner Team** | Team Name | The specific team responsible for the model. |
| **Subdomain Type**| Core / Supporting / Generic | Strategic importance of the context. |


## 3. Linguistic Boundary (Ubiquitous Language)
Every Bounded Context must define its **Ubiquitous Language**:
- **Terms**: List key entities and their specific meaning within *this* context.
- **Ambiguity Prevention**: Explicitly state how terms in this context differ from other contexts (e.g., "Principal" in Identity vs. "Principal" in Finance).


## 4. Structural Rules
- **Containment**: All **ABBs** must belong to exactly one Bounded Context.
- **Independence**: A Bounded Context should be deployable and testable independently of others.
- **Interfaces**: Interactions between contexts MUST occur via standardised interfaces (APIs, Events) defined in the ABBs.


## 5. Relationship to Platform

A Bounded Context belongs to exactly one **Platform (`PL-NNN`)**. The Platform provides the strategic ownership, capability grouping, and consumption model. The Bounded Context provides the linguistic and structural boundary where a specific domain model is valid.

Most platforms contain exactly one bounded context. Multiple bounded contexts within a single platform are used only when distinct models with different ubiquitous languages need to coexist under one strategic ownership boundary.


## 6. Relationship to Capabilities
A Bounded Context **realises** one or more business Capabilities. While a Capability defines *what* is done, the Bounded Context defines *where* the technical implementation lives.


## AI Agent Self-Verification Checklist

1. [ ] **Ownership**: Is there a single, clear team assigned to this context?
2. [ ] **Platform Alignment**: Does the context link back to a valid Platform (`PL-NNN`)?
3. [ ] **Linguistic Check**: Are the 5-10 most important domain terms defined?
4. [ ] **ABB Mapping**: Are all contained ABBs listed and linked?
