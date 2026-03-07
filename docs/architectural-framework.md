# Architectural Framework

This document defines the conceptual model and structural hierarchy for the AI-Assisted Architecture repository. It bridges **Strategic Domain-Driven Design (DDD)**, **Enterprise Architecture (TOGAF)**, and **Cloud-Native Engineering**.

---

## 1. The Conceptual Hierarchy

The framework operates across several layers of abstraction, from business strategy down to deployable code.

| Level | Type | Space | Question | Element |
| :--- | :--- | :--- | :--- | :--- |
| **Strategy** | Strategy | — | *Why?* | **Business Outcome** |
| **Operational**| Operational | — | *How is it used?* | **Use Case** |
| **Domain** | Business | **Problem** | *What do we do?* | **Business Capability** |
| **Context** | Organizational| **Solution** | *Who owns it?* | **Bounded Context** |
| **Logical** | Component | Solution | *How is it structured?*| **Architecture Building Block (ABB)** |
| **Physical** | Realization | Solution | *What did we buy/build?*| **Solution Building Block (SBB)** |
| **Runtime** | Execution | Solution | *How does it run?* | **Service** |

---

## 2. Layer Definitions & Relationships

### 2.1 Outcomes & Use Cases (Strategy)
Architectural decisions must be justified by **Outcomes** (e.g., "Reduce operational risk by 20%"). Outcomes are realized through **Use Cases**, which provide the operational context for why specific technology is needed.

### 2.2 Capabilities (The "What" - Problem Space)
A **Capability** is an enduring business ability (e.g., "Predictive Analytics"). Capabilities live in the **Problem Space**; they define *what* the organization needs to be able to do to achieve its outcomes.
*   **Stability:** While the technology to achieve them changes, the business capability rarely does.
*   **Source:** TOGAF 10 Business Architecture.

### 2.3 Domains and Bounded Contexts (The "Boundary")

A critical part of this framework is the relationship between the business **Domain** and the technical **Bounded Context**.

#### 2.3.1 Problem Space vs. Solution Space
*   **Domain (Problem Space):** This is the high-level area of the business (e.g., "Finance", "Security"). 
*   **Capability:** Capabilities belong to Domains. They are the business-centric definitions of functionality.
*   **Bounded Context (Solution Space):** This is where we design the technical solution. It is a linguistic and structural boundary where a specific model is valid.

#### 2.3.2 The Mapping Rule
*   **Realization:** A **Bounded Context** (Solution Space) **realizes** one or more **Capabilities** (Problem Space).
*   **Ownership:** 
    *   **Domain Owners** own the business outcomes and Capabilities.
    *   **Team Owners** own the Bounded Context. Ideally, one team owns one Bounded Context (Conway's Law).
*   **Relationship to ABBs:** Architecture Building Blocks (ABBs) live **inside** Bounded Contexts. They are the logical blueprints used to deliver the Capability within that specific boundary.

| Level | Space | Element | Owner |
| :--- | :--- | :--- | :--- |
| **Enterprise** | Strategy | Outcome | Executive Leadership |
| **Domain** | **Problem** | **Capability** | **Domain Owner (e.g. CISO)** |
| **Context** | **Solution** | **Bounded Context** | **Engineering / Product Team** |
| **Logical** | Solution | ABB | Team Lead / Architect |
| **Physical** | Solution | SBB / Service | Developers |

---

### 2.4 ABBs & SBBs (The "How")
*   **Architecture Building Block (ABB):** A technology-agnostic logical component (e.g., "Policy Decision Point"). **ABBs live within Bounded Contexts.** This ensures that the logical model of a component is governed by the domain's language.
*   **Solution Building Block (SBB):** A concrete realization of an ABB using a specific product (e.g., "Open Policy Agent"). 
*   **Source:** TOGAF 10 Content Framework.

### 2.5 Services (The "Execution")
A **Service** (or Microservice) is the deployable unit of execution. 
*   **Relationship:** A Service is the runtime manifestation of an SBB. It implements the interfaces defined by the parent ABB. A single Bounded Context may contain multiple services that share the same domain model.

---

## 3. The Intersection of TOGAF and DDD

The critical innovation in this framework is placing **ABBs inside Bounded Contexts**.

Traditional Enterprise Architecture often creates "Enterprise-wide ABBs" (e.g., a single "Customer" ABB). This leads to complexity and tight coupling. By following DDD principles:
1.  Each **Bounded Context** defines its own logical components (ABBs).
2.  If two contexts need to share a concept (like "Identity"), they do so via **Standardized Interfaces** rather than shared internal models.
3.  **Cross-Cutting ABBs** (like IAM or Observability) provide shared infrastructure consumed by domain-specific contexts through an "Enforcement Adapter" pattern.

---

## 4. Trade-offs and Considerations

| Factor | High Granularity (Many small BCs/ABBs) | Low Granularity (Few large BCs/ABBs) |
| :--- | :--- | :--- |
| **Agility** | High: Teams move independently. | Low: Changes require broad coordination. |
| **Complexity** | High: More interfaces and "moving parts."| Low: Simpler to visualize at first. |
| **Consistency** | Risk of duplication across domains. | Easier to enforce single patterns. |
| **Scaling** | Scales horizontally with ease. | Eventually becomes a bottleneck. |

---

## 5. References

*   **TOGAF Standard, 10th Edition:** The industry-standard framework for Enterprise Architecture, providing the definitions for ABBs, SBBs, and Capabilities.
*   **Domain-Driven Design (Eric Evans):** The foundational text for Strategic DDD and Bounded Contexts.
*   **Implementing Domain-Driven Design (Vaughn Vernon):** Provides practical patterns for mapping contexts to microservices.
*   **Building Microservices (Sam Newman):** Explains how Bounded Contexts form the ideal boundaries for microservices.
*   **Conway’s Law:** "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."

---
*Created by AI-Assisted Architecture Framework*
