---
document_type: standards
title: "Bounded Context Standard"
classification: internal
version: 1.0
status: approved
created: 2026-03-07
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Defining a new technical boundary"
  - "Assigning ownership to a product team"
  - "Organizing ABBs into solution domains"
---

# Bounded Context Standard

This standard defines the rules for establishing **Bounded Contexts** (Solution Space). A Bounded Context is a linguistic and structural boundary where a specific domain model is valid.

---

## 1. Context Metadata
| Property | Value | Notes |
| :--- | :--- | :--- |
| **Context Name** | Name | e.g., "Identity & Access", "Inventory". |
| **Domain** | Domain Name | The parent business domain (e.g., "Security"). |
| **Owner Team** | Team Name | The specific team responsible for the model. |
| **Subdomain Type**| Core / Supporting / Generic | Strategic importance of the context. |

---

## 2. Linguistic Boundary (Ubiquitous Language)
Every Bounded Context must define its **Ubiquitous Language**:
- **Terms**: List key entities and their specific meaning within *this* context.
- **Ambiguity Prevention**: Explicitly state how terms in this context differ from other contexts (e.g., "Principal" in Identity vs. "Principal" in Finance).

---

## 3. Structural Rules
- **Containment**: All **ABBs** must belong to exactly one Bounded Context.
- **Independence**: A Bounded Context should be deployable and testable independently of others.
- **Interfaces**: Interactions between contexts MUST occur via standardized interfaces (APIs, Events) defined in the ABBs.

---

## 4. Relationship to Capabilities
A Bounded Context **realizes** one or more business Capabilities. While a Capability defines *what* is done, the Bounded Context defines *where* the technical implementation lives.

---

## AI Agent Self-Verification Checklist

1. [ ] **Ownership**: Is there a single, clear team assigned to this context?
2. [ ] **Linguistic Check**: Are the 5-10 most important domain terms defined?
3. [ ] **ABB Mapping**: Are all contained ABBs listed and linked?
4. [ ] **Domain Alignment**: Does the context link back to a valid business Domain?
