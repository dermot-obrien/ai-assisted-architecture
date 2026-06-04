# Architectural Framework

This document defines the conceptual model and structural hierarchy for the AI-Assisted Architecture repository. It bridges **Strategic Domain-Driven Design (DDD)**, **Enterprise Architecture (TOGAF)**, **Platform Engineering**, and **Cloud-Native Engineering**.


## 1. The Conceptual Hierarchy

The framework operates across several layers of abstraction, from business strategy down to deployable code.

| Level | Type | Space | Question | Element |
| :--- | :--- | :--- | :--- | :--- |
| **Strategy** | Strategy | — | *Why?* | **Business Outcome** |
| **Operational**| Operational | — | *How is it used?* | **Use Case** |
| **Platform** | Organisational | **Ownership** | *Who owns and provides it?* | **Platform** |
| **Business** | Business | **Problem** | *What do we do?* | **Business Capability** |
| **Context** | Solution | **Solution** | *Where is the model boundary?* | **Bounded Context** |
| **Logical** | Component | Solution | *How is it structured?*| **Architecture Building Block (ABB)** |
| **Physical** | Realisation | Solution | *What did we buy/build?*| **Solution Building Block (SBB)** |
| **Runtime** | Execution | Solution | *How does it run?* | **Service** |


## 2. Layer Definitions & Relationships

### 2.1 Outcomes & Use Cases (Strategy)
Architectural decisions must be justified by **Outcomes** (e.g., "Reduce operational risk by 20%"). Outcomes are realised through **Use Cases**, which provide the operational context for why specific technology is needed.

### 2.2 Platforms (The "Who Owns and Provides It")

A **Platform** is the primary organisational and architectural unit in this framework. It is a team-owned, boundary-defined, self-service unit of capability.

> "A digital platform is a foundation of self-service APIs, tools, services, knowledge and support which are arranged as a compelling internal product. Autonomous delivery teams can make use of the platform to deliver product features at a higher pace, with reduced coordination."
> — Evan Bottcher, Thoughtworks

> "The primary goal of all internal platforms is to reduce the cognitive load on its customers. A platform is a curated experience for engineers (the primary customers of the platform). Treat the platform as product (reliable, usable, fit for purpose) for voluntary internal customers."
> — Team Topologies (Matthew Skelton & Manuel Pais)

> "An integrated collection of capabilities defined and presented according to the needs of the platform's users."
> — CNCF Platforms White Paper

A Platform carries everything needed to deliver and consume capability: strategic ownership, business outcomes, capabilities, model boundaries (bounded contexts), building blocks, and self-service consumption interfaces.

#### 2.2.1 Why Platform Replaces Domain

Traditional enterprise architecture separates **Domain** (problem space ownership), **Bounded Context** (solution space model boundary), and **Platform** (consumption model) into three distinct concepts. In practice, these three boundaries converge on the same thing — a coherent unit of capability owned by one team, with an explicit boundary. Maintaining them as separate entities creates unnecessary indirection.

This framework uses **Platform** as the unifying concept because:

1. **Industry alignment.** It is the term used by Gartner, CNCF, Team Topologies, and the broader platform engineering community.
2. **Audience clarity.** "Platform" is understood by executives, engineers, and architects alike. "Bounded Context" is DDD jargon; "Domain" is overloaded.
3. **Completeness.** A platform naturally carries ownership, strategy, model boundaries, building blocks, and consumption interfaces — no gaps, no redundancy.

#### 2.2.2 Platforms and Bounded Contexts

A Platform contains one or more **Bounded Contexts**. A Bounded Context belongs to exactly one Platform.

Most platforms have exactly one bounded context — the platform boundary and the model boundary are the same thing. A platform has multiple bounded contexts only when distinct models with different ubiquitous languages need to coexist under one strategic ownership boundary.

#### 2.2.3 Platforms as Products

A platform is not a passive grouping label. It is an internal product. The self-service interfaces, documentation, SLOs, and consumption model are not optional extras bolted on after the fact — they are inherent to what makes a platform function. A bounded context that nobody can consume is not complete.

Every platform has **products** — the consumable offerings it provides to other teams. In meta-model terms:

| Platform Concept | Meta-Model Element | Description |
| :--- | :--- | :--- |
| The product itself | **Platform** (`PL-NNN`) | The team-owned unit with its boundary, ownership, and consumption model. |
| What it offers | **Capabilities** (`CAP-NNN`) | The business abilities the platform provides — its product features. |
| How it's structured | **ABBs** (`ABB-NNN`) | The logical building blocks that deliver the capabilities. |
| What it's built with | **SBBs** (`SBB-NNN`) | The concrete technology choices that realise the building blocks. |
| How it's consumed | **Self-Service Interfaces** | APIs, CLIs, SDKs, portals, documentation — the product surface. |
| What it promises | **SLOs** | Availability, latency, and quality commitments to consumers. |

**Example — AI Platform:**

An AI Platform (`PL-010`) might provide the following:

| Layer | Elements |
| :--- | :--- |
| **Capabilities** | Model Training & Experimentation, Model Serving & Inference, Feature Management, AI Governance |
| **Bounded Contexts** | ML Lifecycle (training, registry, serving), AI Governance (bias detection, audit, compliance) |
| **ABBs** | Model Registry, Training Pipeline Orchestrator, Inference Engine, Feature Store, Experiment Tracker, AI Compliance Gateway |
| **SBBs** | Azure ML, MLflow, Seldon Core, Feast, Weights & Biases, custom compliance service |
| **Self-Service Interfaces** | Model training API, deployment CLI, feature store SDK, experiment tracking portal, governance dashboard |
| **SLOs** | Inference latency p99 < 100ms, model deployment < 15 min, feature freshness < 1 hour |

The consuming teams (e.g., a fraud detection product team) don't need to understand the internals. They interact with the platform's self-service interfaces to train models, deploy them, and access features. The platform reduces their cognitive load — they focus on their domain problem, not on ML infrastructure.

This is what "platform as product" means: the platform team treats its consumers as customers, provides paved roads for common use cases, and owns the quality of the experience end to end.

### 2.3 Capabilities (The "What" — Problem Space)
A **Capability** is an enduring business ability (e.g., "Predictive Analytics"). Capabilities live in the **Problem Space**; they define *what* the organisation needs to be able to do to achieve its outcomes.
*   **Stability:** While the technology to achieve them changes, the business capability rarely does.
*   **Ownership:** Capabilities are provided by Platforms. A Platform groups the capabilities it is accountable for delivering.
*   **Source:** TOGAF 10 Business Architecture.

### 2.4 Bounded Contexts (The "Where" — Solution Space)

A **Bounded Context** is a linguistic and structural boundary where a specific domain model is valid. It belongs to exactly one Platform and defines the ubiquitous language for its area.

*   **Containment:** All ABBs must belong to exactly one Bounded Context.
*   **Ownership:** One team owns one Bounded Context (Conway's Law). The owning team is typically the platform team.
*   **Independence:** A Bounded Context should be deployable and testable independently.

#### 2.4.1 The Mapping Rule
*   **Realisation:** A **Bounded Context** (Solution Space) **realises** one or more **Capabilities** (Problem Space).
*   **Ownership:**
    *   **Strategic Owners** (executives) own the business outcomes and the platform's strategic direction.
    *   **Platform Teams** own the Bounded Context(s) within their platform.
*   **Relationship to ABBs:** Architecture Building Blocks (ABBs) live **inside** Bounded Contexts. They are the logical blueprints used to deliver the Capability within that specific boundary.

| Level | Space | Element | Owner |
| :--- | :--- | :--- | :--- |
| **Enterprise** | Strategy | Outcome | Executive Leadership |
| **Platform** | **Ownership** | **Platform** | **Strategic Owner + Platform Team** |
| **Context** | **Solution** | **Bounded Context** | **Platform Team** |
| **Logical** | Solution | ABB | Team Lead / Architect |
| **Physical** | Solution | SBB / Service | Developers |


### 2.5 ABBs & SBBs (The "How")
*   **Architecture Building Block (ABB):** A technology-agnostic logical component (e.g., "Policy Decision Point"). **ABBs live within Bounded Contexts.** This ensures that the logical model of a component is governed by the platform's ubiquitous language.
*   **Solution Building Block (SBB):** A concrete realisation of an ABB using a specific product (e.g., "Open Policy Agent").
*   **Source:** TOGAF 10 Content Framework.

### 2.6 Services (The "Execution")
A **Service** (or Microservice) is the deployable unit of execution.
*   **Relationship:** A Service is the runtime manifestation of an SBB. It implements the interfaces defined by the parent ABB. A single Bounded Context may contain multiple services that share the same domain model.


## 3. The Intersection of TOGAF, DDD, and Platform Engineering

The critical design decisions in this framework are:

1. **ABBs inside Bounded Contexts.** Traditional Enterprise Architecture often creates "Enterprise-wide ABBs" (e.g., a single "Customer" ABB). This leads to complexity and tight coupling. By following DDD principles, each Bounded Context defines its own logical components.

2. **Platforms as the organisational unit.** Rather than maintaining separate Domain and Bounded Context hierarchies, the Platform unifies ownership, capability grouping, and model boundaries into a single concept that teams and executives both understand.

3. **Cross-Cutting Platforms.** Some platforms (like Identity & Access, Observability, Governance) provide shared infrastructure consumed by other platforms through standardised interfaces rather than shared internal models. These are **Cross-Cutting Platforms** — they follow the same standard but their ABBs are consumed via an "Enforcement Adapter" pattern.

4. **Self-service by default.** If two platforms need to interact, they do so via the consuming platform's self-service interfaces (APIs, events, SDKs). There are no back-channel integrations or shared databases.


## 4. Trade-offs and Considerations

| Factor | High Granularity (Many small Platforms/BCs) | Low Granularity (Few large Platforms/BCs) |
| :--- | :--- | :--- |
| **Agility** | High: Teams move independently. | Low: Changes require broad coordination. |
| **Complexity** | High: More interfaces and "moving parts."| Low: Simpler to visualise at first. |
| **Consistency** | Risk of duplication across platforms. | Easier to enforce single patterns. |
| **Scaling** | Scales horizontally with ease. | Eventually becomes a bottleneck. |
| **Cognitive Load** | Low per team: each team owns a focused scope. | High per team: broad scope, many concerns. |

The **Thinnest Viable Platform** principle (Team Topologies) applies: start with the minimum platform surface needed to reduce cognitive load for consuming teams, and grow only when demand justifies it.


## 5. References

*   **Team Topologies** (Matthew Skelton & Manuel Pais, 2019): The primary reference for platform teams, cognitive load, and the Thinnest Viable Platform. Defines the team interaction modes (collaboration, X-as-a-Service, facilitating) that govern how platforms relate to consuming teams.
*   **CNCF Platforms White Paper** (2024): Defines platform capabilities, attributes, and composition for cloud-native environments. Establishes the platform maturity model.
*   **Gartner Platform Engineering** (2024–2026): Positions platform engineering as a top strategic technology trend. Advocates for platform-as-a-product, self-service, and paved roads.
*   **Evan Bottcher / Martin Fowler** (Thoughtworks): The canonical definition of a digital platform as "a foundation of self-service APIs, tools, services, knowledge and support arranged as a compelling internal product."
*   **TOGAF Standard, 10th Edition:** The industry-standard framework for Enterprise Architecture, providing the definitions for ABBs, SBBs, and Capabilities.
*   **Domain-Driven Design** (Eric Evans): The foundational text for Strategic DDD and Bounded Contexts.
*   **Implementing Domain-Driven Design** (Vaughn Vernon): Practical patterns for mapping contexts to microservices.
*   **Building Microservices** (Sam Newman): Explains how Bounded Contexts form the ideal boundaries for microservices.
*   **Conway's Law:** "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."
*   **Microsoft Platform Engineering Guide** (2024): Capability model for platform engineering covering investment, adoption, governance, provisioning, interfaces, and measurement.
*   **CNCF Platform Engineering Maturity Model** (2024): Five-dimension maturity model (investment, adoption, interfaces, operations, measurement) for assessing platform engineering practice.


*Created by AI-Assisted Architecture Framework*
