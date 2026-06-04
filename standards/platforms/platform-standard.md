---
document_type: standards
title: "Platform Standard"
classification: internal
version: 1.0
status: draft
created: 2026-03-08
last_modified: 2026-03-08
owner: "Architecture Team"
triggers:
  - "Defining a new platform"
  - "Assigning strategic and team ownership"
  - "Grouping bounded contexts, capabilities, and outcomes"
---

# Platform Standard

This standard defines the structure and metadata for **Platforms** — the primary organisational and architectural unit in the framework.


## 1. What Is a Platform?

A Platform is a team-owned, boundary-defined, self-service unit of capability. It is the single entity that combines strategic ownership, capability grouping, model boundaries, and a consumption model for other teams.

> "A digital platform is a foundation of self-service APIs, tools, services, knowledge and support which are arranged as a compelling internal product. Autonomous delivery teams can make use of the platform to deliver product features at a higher pace, with reduced coordination."
> — Evan Bottcher, Thoughtworks

> "The primary goal of all internal platforms is to reduce the cognitive load on its customers. A platform is a curated experience for engineers (the primary customers of the platform). Treat the platform as product (reliable, usable, fit for purpose) for voluntary internal customers."
> — Team Topologies (Matthew Skelton & Manuel Pais)

> "An integrated collection of capabilities defined and presented according to the needs of the platform's users. It is a cross-cutting layer that ensures a consistent experience for acquiring and integrating typical capabilities and services."
> — CNCF Platforms White Paper

A Platform replaces the need for separate "Domain" and "Bounded Context" concepts at the grouping level. It carries everything: strategic ownership, outcomes, capabilities, model boundaries, building blocks, and consumption interfaces.

### 1.1 Why Platform?

Traditional enterprise architecture separates **Domain** (problem space ownership), **Bounded Context** (solution space model boundary), and **Platform** (consumption model) into three distinct concepts. In practice, these three boundaries converge on the same thing — a coherent unit of capability owned by one team, with an explicit boundary. Maintaining them as separate entities creates unnecessary indirection.

This framework uses **Platform** as the unifying concept because:

1. **Industry alignment.** It is the term used by Gartner, CNCF, Team Topologies, and the broader platform engineering community.
2. **Audience clarity.** "Platform" is understood by executives, engineers, and architects alike. "Bounded Context" is DDD jargon; "Domain" is overloaded.
3. **Completeness.** A platform naturally carries ownership, strategy, model boundaries, building blocks, and consumption interfaces — no gaps, no redundancy.


### 1.2 Platforms as Products

A platform is not a passive grouping label. It is an **internal product**. The self-service interfaces, documentation, SLOs, and consumption model are not optional extras — they are inherent to what makes a platform function. A bounded context that nobody can consume is not complete.

Every platform has products — the consumable offerings it provides to other teams:

| Platform Concept | Meta-Model Element | Description |
| :--- | :--- | :--- |
| The product itself | **Platform** (`PL-NNN`) | The team-owned unit with its boundary, ownership, and consumption model. |
| What it offers | **Capabilities** (`CAP-NNN`) | The business abilities the platform provides — its product features. |
| How it's structured | **ABBs** (`ABB-NNN`) | The logical building blocks that deliver the capabilities. |
| What it's built with | **SBBs** (`SBB-NNN`) | The concrete technology choices that realise the building blocks. |
| How it's consumed | **Self-Service Interfaces** | APIs, CLIs, SDKs, portals, documentation — the product surface. |
| What it promises | **SLOs** | Availability, latency, and quality commitments to consumers. |


### 1.3 Platform Positioning

A platform sits between **capability providers** (internal teams, cloud vendors, open-source projects) and **platform users** (application and stream-aligned teams). It is a cross-cutting layer that curates, integrates, and presents underlying capabilities as a consistent, self-service experience.

```
┌──────────────────────────────────────────────────────────────────┐
│                       Platform Users                             │
│         (Application developers, stream-aligned teams)           │
└──────────────────────────┬───────────────────────────────────────┘
                           │  consume via self-service interfaces
                           │  (APIs, CLIs, portals, SDKs, golden paths)
                           v
┌──────────────────────────────────────────────────────────────────┐
│                         PLATFORM                                 │
│                                                                  │
│   Implements organisational practices for:                       │
│   security, performance, cost governance, compliance,            │
│   consistent experience, and reduced cognitive load              │
│                                                                  │
│   Contains: Bounded Contexts, ABBs, SBBs, Services              │
│   Provides: Capabilities, Self-Service Interfaces, SLOs          │
│   Owned by: Strategic Owner + Platform Team                      │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │  integrates and curates
                           v
┌──────────────────────────────────────────────────────────────────┐
│                    Capability Providers                           │
│     (Internal teams, cloud service providers, open-source)       │
└──────────────────────────────────────────────────────────────────┘
```

*Adapted from the CNCF Platforms White Paper (2024).*

The platform team's role is not necessarily to build every underlying service. It is to **manage the interfaces and experiences** — the portals, APIs, documentation, templates, and CLI tools — that make the underlying capabilities consumable and consistent.


### 1.4 Platform Attributes

A well-functioning platform exhibits seven key attributes (per the CNCF Platforms White Paper):

| Attribute | Description |
| :--- | :--- |
| **Platform as Product** | Designed around user needs, prioritising common use cases. Treated as an internal product with a roadmap and backlog. |
| **User Experience** | Consistent interfaces across the platform — GUIs, APIs, CLIs, IDE integrations, developer portals. |
| **Documentation & Onboarding** | Guides, examples, golden paths, and project templates that enable teams to get started quickly. |
| **Self-Service** | On-demand, autonomous capability access with minimal manual intervention or ticket-based processes. |
| **Reduced Cognitive Load** | Encapsulated complexity. Implementation details are hidden behind well-defined interfaces. |
| **Optional & Composable** | Teams use only the components they need. They can supplement with external tools where the platform doesn't cover their case. |
| **Secure by Default** | Built-in compliance, validation, and organisational standards. Security is not an afterthought. |


### 1.5 Platform Capabilities

The CNCF Platforms White Paper identifies capability domains that a platform may provide. Not every platform provides all of these — each platform focuses on its specific scope:

| Capability Domain | Purpose | Example Projects |
| :--- | :--- | :--- |
| Web portals | Observe and provision capabilities | Backstage, Skooner, Ortelius |
| APIs & CLIs | Automated provisioning and management | Kubernetes, Crossplane, Helm |
| Golden path templates | Rapid project composition | ArtifactHub |
| Build & test automation | Product validation pipelines | Tekton, Jenkins, Buildpacks |
| Delivery automation | Service deployment and promotion | Argo, Flux, Keptn, Flagger |
| Development environments | IDE and research tools | Devfile, Nocalhost, Telepresence |
| Application observability | Telemetry collection and dashboards | OpenTelemetry, Prometheus, Grafana |
| Infrastructure services | Compute, networking, and storage | Kubernetes, Knative, Istio, Rook |
| Data services | Structured persistence | TiKV, Vitess, SchemaHero |
| Messaging & events | Asynchronous communication | Strimzi, NATS, gRPC, Dapr |
| Identity & secrets | Workload credentials and certificates | Keycloak, SPIFFE/SPIRE, cert-manager |
| Security services | Runtime protection and policy | Falco, KubeArmor, OPA, Kyverno |
| Artifact storage | Build artifact management | Harbor, Distribution, Porter |


### 1.6 Platforms and Bounded Contexts

A Platform contains one or more **Bounded Contexts**. A Bounded Context belongs to exactly one Platform.

Most platforms have exactly one bounded context. This is the normal case — the platform boundary and the model boundary are the same thing. A platform has multiple bounded contexts only when distinct models with different ubiquitous languages need to coexist under one strategic ownership boundary.

**Example — single bounded context (typical):**
- Platform: Identity & Access -> contains BC: Identity & Access

**Example — multiple bounded contexts (rare):**
- Platform: Security -> contains BC: Identity & Access + BC: Threat Intelligence

The Bounded Context Standard defines the rules for model boundaries, ubiquitous language, and ABB containment within a platform.


### 1.7 Measuring Platform Success

Platform success is measured across three dimensions:

| Dimension | Metrics |
| :--- | :--- |
| **User satisfaction & productivity** | Active users, retention, Net Promoter Score, SPACE framework metrics |
| **Organisational efficiency** | Request-to-fulfilment latency, time to production, new user onboarding speed |
| **Product delivery (DORA)** | Deployment frequency, lead time for changes, time to restore, change failure rate |


## 2. File Structure

Each Platform is a folder named by its identifier:
```
platforms/
  PL-001/
    index.md            # The platform definition
  diagrams/
    platform-landscape.drawio   # Portfolio overview diagram
```


## 3. Platform Metadata

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Platform ID** | `PL-NNN` | Unique identifier (e.g., `PL-001`). |
| **Name** | Platform Name | e.g., "Security", "Observability". |
| **Strategic Owner** | Role | The executive accountable for outcomes (e.g., CISO). |
| **Owner Team** | Team Name | The team that owns and operates the platform. |
| **Status** | `DRAFT` / `APPROVED` / `DEPRECATED` | Lifecycle status. |


## 4. Platform Definition

Every Platform must be documented with:

- **Purpose**: What this platform provides and why it exists.
- **Strategic Outcomes**: Link to the **Outcomes (OC-NNN)** this platform is accountable for delivering.
- **Capabilities**: The **Capabilities (CAP-NNN)** this platform provides.
- **Bounded Contexts**: The **Bounded Context(s)** contained within this platform, with their ubiquitous language.
- **Contained ABBs**: The **Architecture Building Blocks (ABB-NNN)** within the platform's bounded context(s).
- **Self-Service Interfaces**: How consuming teams interact with this platform (APIs, CLI, portal, SDKs).
- **Consuming Teams**: Who uses this platform and in what capacity.
- **SLOs**: Availability, latency, and quality commitments.


## 5. Hierarchy & Relationships

| Relationship | Description |
| :--- | :--- |
| Platform **owns** Outcome(s) | The platform is accountable for delivering these business results. |
| Platform **provides** Capability(ies) | The abstract business capabilities this platform enables. |
| Platform **contains** Bounded Context(s) | The model boundaries within the platform. Each BC has its own ubiquitous language. |
| Bounded Context **contains** ABB(s) | The logical architecture components within the model boundary. |
| ABB **is realised by** SBB(s) | Concrete technology implementations of the logical architecture. |
| SBB **manifests as** Service(s) | The runtime deployments. |


## 6. References

- **Team Topologies** (Matthew Skelton & Manuel Pais, 2019) — Platform teams, cognitive load, Thinnest Viable Platform, team interaction modes. The primary reference for how platform teams relate to consuming teams.
- **CNCF Platforms White Paper** (TAG App Delivery, 2024) — [tag-app-delivery.cncf.io/whitepapers/platforms/](https://tag-app-delivery.cncf.io/whitepapers/platforms/) — Platform definition, attributes, capability domains, maturity model, and success metrics.
- **Gartner Platform Engineering** (2024–2026) — Platform as a product, self-service, paved roads. Positions platform engineering as a top strategic technology trend.
- **Evan Bottcher / Martin Fowler** (Thoughtworks) — The canonical definition of a digital platform as "a foundation of self-service APIs, tools, services, knowledge and support arranged as a compelling internal product."
- **TOGAF Standard, 10th Edition** — Enterprise Architecture framework providing definitions for ABBs, SBBs, and Capabilities.
- **Domain-Driven Design** (Eric Evans) — Bounded Contexts, ubiquitous language, and strategic design patterns.


## AI Agent Self-Verification Checklist

1. [ ] **Identifier**: Does the ID follow the `PL-NNN` prefix rule?
2. [ ] **Dual Ownership**: Are both Strategic Owner (executive) and Owner Team (delivery) specified?
3. [ ] **Outcome Linkage**: Are the associated Strategic Outcomes listed and linked?
4. [ ] **Capability Linkage**: Are the provided Capabilities listed?
5. [ ] **Bounded Context(s)**: Is at least one Bounded Context defined with ubiquitous language?
6. [ ] **ABB Containment**: Are all ABBs mapped to a bounded context within the platform?
7. [ ] **Self-Service**: Are the consumption interfaces described?
8. [ ] **Platform as Product**: Does the platform definition treat the platform as an internal product, not just a grouping label?
