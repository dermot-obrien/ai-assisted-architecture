# Integration Capability Taxonomy — Multi-Source Research

**Date:** 2026-04-10
**Status:** Complete
**Method:** Extensive research — 9 parallel agents (Perplexity, Claude, Gemini) querying Gartner, Forrester, IDC, TOGAF, Hohpe/Woolf EIP, CNCF, and Microsoft Architecture Center.

This document records the research findings on integration capability families to determine whether the framework's current three L3 integration capabilities (API Mediation, Event Streaming, MFT) are the complete set or whether gaps exist.

---

## 1. Context and question

The AI-Assisted Architecture framework defines `CAP-008 Integration Services` (L2) with three L3 children:

| Capability | Interaction style | Realised by |
|---|---|---|
| `CAP-010` API Mediation & Contract Enforcement | Synchronous request/response | `AB-004` |
| `CAP-011` Event Streaming & Asynchronous Integration | Asynchronous pub/sub | `AB-005` |
| `CAP-NPC-001` Managed File Transfer Services | Scheduled batch file exchange | `AB-NPC-009` |

`CAP-010` and `CAP-011` were seeded from the upstream framework. `CAP-NPC-001` was created as a Northpower workspace extension during the JDE-Coupa C2 capability gap analysis (see `northpower-ea/projects/jde-coupa-2026/analysis/c2-capability-gap.md`).

**Research question:** Are these three the complete set of integration interaction styles, or are we missing families?

---

## 2. Authoritative sources consulted

| Source | What it provides | Agent |
|---|---|---|
| **Gartner Magic Quadrants / Market Guides** | Defines distinct product categories with separate MQs for API Management, iPaaS, Data Integration Tools, B2B Gateway | Perplexity |
| **Gartner "Three Integration Styles"** | Data-centric, application-centric, event-centric (from "Choosing Between Data-, Application- and Event-Centric Integration Styles") | Claude |
| **TOGAF 10** | Content Framework, TRM, III-RM, SOA Reference Architecture | Claude |
| **Hohpe & Woolf EIP (2003)** | Four fundamental integration styles: File Transfer, Shared Database, Remote Procedure Invocation, Messaging | Gemini |
| **CNCF Landscape** | Six integration-related categories under Orchestration & Management and App Definition | Claude |
| **Microsoft Azure Architecture Center** | Four-pillar Azure Integration Services + additional categories | Gemini |
| **Forrester Wave evaluations** | iPaaS Wave Q3 2025, API Management Wave Q3 2024, separate Data Management/ETL evaluations | Perplexity |
| **IDC MarketScape** | Standalone B2B Middleware MarketScape (2024), separate from iPaaS | Perplexity |
| **Fusion5 "Four Pillars of Integration"** | Vendor input — API Gateway, Application Integration, Real-Time Integration, MFT | Already in workspace |

---

## 3. Findings: five transport-level families + orchestration layer

### 3.1 Cross-source synthesis

Every major source identifies more than three integration families. When cross-referenced, **five transport-level families** emerge consistently, plus an **orchestration layer** that sits above them.

**Hohpe & Woolf** defined four fundamental integration styles. **Gartner** defines three integration styles (data-centric, application-centric, event-centric) but publishes **six separate Magic Quadrants / Market Guides**. When cross-referenced:

| # | Family | Hohpe Style | Gartner Style | Gartner MQ/MG | Products (SBB candidates) |
|---|---|---|---|---|---|
| 1 | **API Mediation** | Remote Procedure Invocation | Application-centric | MQ: API Management (17 vendors, Oct 2025) | Apigee, Kong, MuleSoft, IBM API Connect, Axway, Azure APIM |
| 2 | **Event Streaming & Messaging** | Messaging | Event-centric | Market Guide: Event Stream Processing | Kafka/Confluent, Azure Service Bus/Event Hubs, RabbitMQ, NATS, Solace |
| 3 | **Managed File Transfer** | File Transfer | *(not a named style)* | MQ retired (2009), now Peer Insights only | IBM Sterling, Axway, GoAnywhere, Progress MOVEit, Azure Storage SFTP |
| 4 | **Data Integration** | *(not in EIP)* | Data-centric | MQ: Data Integration Tools (20 vendors, Dec 2025, $5.9B market) | Informatica, Azure Data Factory, Talend/Qlik, Fivetran, Airbyte, dbt |
| 5 | **B2B/EDI Gateway** | *(subtype of File Transfer)* | *(folded into iPaaS by Gartner)* | IDC MarketScape: B2B Middleware (standalone, 2024) | IBM Sterling B2B, Axway, SEEBURGER, OpenText, CData Arc |

### 3.2 Why these are genuinely distinct (not artificial splits)

| Test | API | Event | MFT | Data Integration | B2B/EDI |
|---|---|---|---|---|---|
| **Unit of work** | API call | Event/message | File | Dataset/batch | Business document |
| **Timing** | Synchronous | Asynchronous | Scheduled | Scheduled/CDC | Scheduled/triggered |
| **Direction** | Request/response | Publish/subscribe | Point-to-point | Source-to-target | Inter-organisation |
| **Buyer persona** | API architect | Platform engineer | Ops/security | Data engineer | Supply chain/EDI team |
| **Gartner evaluation** | Separate MQ | Separate MG | Separate Peer Insights | Separate MQ | IDC separate; Gartner folded into iPaaS |
| **Vendor pool overlap** | Minimal | Minimal | Minimal | Minimal | Overlaps with MFT |

### 3.3 The orchestration layer: iPaaS / BOAT

The research is very clear that **iPaaS is NOT a peer** to the five transport-level families. It is an orchestration layer that composes them:

```
Layer 3: BOAT (Business Orchestration & Automation Technologies)
                    |
                    | composes
                    v
Layer 2: iPaaS / Application Integration
         (Logic Apps, MuleSoft, Boomi, Workato)
                    |
                    | orchestrates
                    v
Layer 1: Transport-level capabilities
  ┌─────────┬─────────┬─────────┬─────────┬─────────┐
  │  API    │ Event   │  MFT    │  Data   │ B2B/EDI │
  │Mediation│Streaming│         │Integr.  │ Gateway │
  └─────────┴─────────┴─────────┴─────────┴─────────┘
```

Gartner's iPaaS MQ (March 2026) defines iPaaS as covering three integration patterns that the underlying transports do not individually address:
1. **Data Consistency** — monitoring for changes and propagating across systems
2. **Multistep Process** — implementing multi-step workflows across applications
3. **Composite Service** — creating composite services exposed as APIs or events, assembled from existing applications

iPaaS market size: exceeded USD $8.5B in 2024, forecast to exceed $17B by 2028.

Gartner is also rolling out a super-category called **BOAT (Business Orchestration and Automation Technologies)** that subsumes iPaaS, API Management, RPA, low-code, and business rules engines into a unified orchestration meta-layer.

---

## 4. Detailed findings by source

### 4.1 Gartner — six active evaluation categories

Gartner does not publish a single "integration Magic Quadrant." It segments integration into six distinct product markets:

| Category | Report type | Latest | Market size | Leaders (2025-2026) |
|---|---|---|---|---|
| **iPaaS** | Magic Quadrant | March 2026, 18 vendors | $8.5B (2024) | Boomi, Workato, SAP, Salesforce/MuleSoft, Microsoft, Informatica |
| **API Management** | Magic Quadrant | October 2025, 17 vendors | $4.4B | Apigee, Kong, MuleSoft, AWS, Azure APIM |
| **Data Integration Tools** | Magic Quadrant | December 2025, 20 vendors | $5.9B (2024) | Informatica, Databricks, Qlik/Talend, Microsoft |
| **B2B Gateway Software** | Peer Insights (MQ discontinued) | Active | — | IBM Sterling, SEEBURGER, Axway, OpenText |
| **MFT Software** | Peer Insights (MQ retired 2009) | Active | — | IBM Sterling, Axway, GoAnywhere, MOVEit |
| **Event Stream Processing** | Market Guide | Q1 2025 | — | Confluent, AWS Kinesis, Azure Event Hubs |

**Key Gartner taxonomy point:** Gartner defines three integration **styles** (data-centric, application-centric, event-centric) from their research note "Choosing Between Data-, Application- and Event-Centric Integration Styles." These are architectural decision drivers, not product categories. The product categories (MQ/MG reports) cross-cut the styles — e.g., iPaaS can execute all three styles, while Data Integration Tools focus on the data-centric style.

### 4.2 TOGAF 10 — deliberately does NOT prescribe integration ABBs

TOGAF — across all editions including the 10th — deliberately does **not** define a catalogue of named Architecture Building Blocks for integration or any other domain. The Content Framework defines **what an ABB is**, **how ABBs relate to each other**, and **what properties they should have**, but never ships a list of specific integration ABBs.

TOGAF explicitly states it is "a generic framework intended to be used in a wide variety of environments" and that "a particular organization may need to augment this set with additional services or service categories which are considered to be generic in its own vertical market segment."

The closest TOGAF gets to integration taxonomy is:
- **TRM (Technical Reference Model)**: Lists service categories including "Communications Infrastructure Interface", "Information Interchange Services", and "Data Interchange" services. These are infrastructure-level, not application integration patterns.
- **III-RM (Integrated Information Infrastructure Reference Model)**: Defines a "Brokering" and "Management Utilities" component but focuses on information access, not integration patterns.
- **SOA Reference Architecture**: Defines an "Integration Layer" but within the SOA context of service composition, mediation, and message transformation — not a taxonomy of integration styles.

**Key implication:** Any framework that defines named integration ABBs (like AB-004 API Mediation, AB-005 Event Streaming, AB-NPC-009 MFT) is doing original design work that builds on TOGAF's concepts but is not prescribed by TOGAF itself. The ai-assisted-architecture framework's capability taxonomy is an original composition grounded in industry consensus, not a TOGAF standard.

### 4.3 Hohpe & Woolf — four fundamental styles (2003)

The canonical four integration styles from *Enterprise Integration Patterns* (Chapter 2):

| Style | Mechanism | Strengths | Weaknesses |
|---|---|---|---|
| **File Transfer** | Applications produce and consume files of shared data | Loose coupling, technology-agnostic, applications process at own pace | Stale data between drops, format agreement required, no behavioural invocation |
| **Shared Database** | Applications store shared data in a common database | Consistency via transactions, real-time availability | Tight schema coupling, performance bottleneck, schema evolution nightmare |
| **Remote Procedure Invocation** | Applications call functions/methods exposed by other applications | Encapsulates behaviour, well-understood programming model | Tight temporal coupling, cascading failures |
| **Messaging** | Applications exchange messages via a messaging channel | Loose coupling in time and space, reliable delivery, scalable | Asynchronous complexity, message ordering, debugging difficulty |

Hohpe & Woolf explicitly note these are not mutually exclusive — most enterprise architectures use all four styles simultaneously.

**Modern mapping:** Style 1 maps to MFT. Style 2 is largely rejected as an anti-pattern (but still exists in the form of shared data lakes/warehouses, which is the Data Integration family). Style 3 maps to API Mediation. Style 4 maps to Event Streaming & Messaging.

Gregor Hohpe's more recent work (2023-2025) from his position as VP at AWS acknowledges that the original four styles remain valid but argues for a fifth consideration: **platform-level integration** — where the platform itself provides integration as a service (API gateways, event buses, data pipelines as managed services rather than custom-built middleware).

### 4.4 CNCF — six integration-related categories

The CNCF landscape does not use the traditional three-style taxonomy. It has developed its own categorization:

| CNCF Category | Description | Key projects |
|---|---|---|
| **Coordination & Service Discovery** | How services find each other | CoreDNS (graduated), etcd (graduated), Consul |
| **Remote Procedure Call (RPC)** | Synchronous service-to-service communication | gRPC (incubating) |
| **Service Proxy** | Traffic interception and routing | Envoy (graduated), NGINX |
| **Service Mesh** | Mesh-level traffic management, observability, security | Istio, Linkerd (graduated) |
| **Streaming & Messaging** | Asynchronous message/event delivery | NATS (graduated), CloudEvents (incubating), Strimzi |
| **API Gateway** | External-facing API management | Emissary-Ingress (incubating), Kong |

The CNCF landscape splits what enterprise architects call "API integration" into four separate categories (RPC, Service Proxy, Service Mesh, API Gateway) while keeping messaging/streaming as a single combined category. This reflects the cloud-native focus on infrastructure-level concerns.

### 4.5 Microsoft Azure — four core pillars + additional categories

Microsoft's canonical decomposition is built around **four core integration technologies**, presented as the branded **Azure Integration Services (AIS)** suite:

| Pillar | Azure service | Integration style |
|---|---|---|
| **APIs** | Azure API Management | Synchronous request/response |
| **Orchestration** | Azure Logic Apps | Multi-step workflow composition |
| **Messaging** | Azure Service Bus | Enterprise messaging with guaranteed delivery |
| **Events** | Azure Event Grid | Reactive event distribution (discrete state changes) |

**Beyond the core four**, Microsoft positions additional services outside the AIS branding:

| Service | Category | Positioning |
|---|---|---|
| **Azure Event Hubs** | Big data streaming | Distinct from both Service Bus (messaging) and Event Grid (events) — positioned as Kafka-compatible high-throughput ingestion |
| **Azure Data Factory** | Data Integration / ETL | Explicitly separate from AIS — sits in the data platform category |
| **Azure Blob Storage SFTP** | File Transfer | Basic MFT capability — not part of AIS |
| **Power Automate** | Business process automation | Citizen developer integration — overlaps with Logic Apps but different audience |

**Key Microsoft distinction:** Microsoft splits messaging from events:
- **Service Bus** = high-value enterprise messages (contracts, guaranteed delivery, transactions, sessions)
- **Event Grid** = lightweight state-change notifications (reactive, no contract, fan-out)

This is the only major vendor that makes this split explicit at the service level. The framework currently combines both under `CAP-011 Event Streaming & Asynchronous Integration`.

**Microsoft also treats orchestration as a peer pillar**, not a layer above — Logic Apps sits alongside APIM, Service Bus, and Event Grid as one of the four branded AIS. This differs from the Gartner/analyst view that positions iPaaS as an orchestration layer above the transports. Microsoft's answer: it is both a transport (you can call Logic Apps directly) and an orchestrator (it composes the other three).

### 4.6 Forrester — separate evaluations confirm distinct categories

Forrester publishes separate Wave evaluations for:

| Forrester Wave | Latest | Leaders |
|---|---|---|
| **iPaaS** | Q3 2025 | IBM, Workato, Boomi |
| **API Management Software** | Q3 2024 | IBM API Connect, WSO2, Axway, MuleSoft |
| **Data Management / ETL** | Separate Wave | Informatica, Databricks |

Forrester treats API Management as a distinct market from integration platforms (iPaaS), which aligns with Gartner's separation. Forrester notes iPaaS is evolving beyond traditional integration into AI agent orchestration and business process automation.

### 4.7 IDC — standalone B2B Middleware MarketScape

IDC publishes a standalone **B2B Middleware MarketScape** (2024) that is entirely separate from its iPaaS analysis. This confirms B2B/EDI integration is treated as a distinct capability family by at least one major analyst firm, even though Gartner tends to fold it into iPaaS.

---

## 5. Assessment against current framework

### 5.1 What we have vs what the research shows

| Family | Framework status | Gap? |
|---|---|---|
| **API Mediation** | `CAP-010` + `AB-004` | No gap |
| **Event Streaming & Messaging** | `CAP-011` + `AB-005` | Minor: could split messaging from events (per Microsoft model) |
| **Managed File Transfer** | `CAP-NPC-001` + `AB-NPC-009` (workspace extension) | No gap (for workspace). Upstream framework still lacks this. |
| **Data Integration** | **Not present** | **Gap.** Gartner's $5.9B MQ with 20 vendors. Distinct buyer persona (data engineer), distinct unit of work (dataset/batch), distinct vendor pool (Informatica, ADF, Fivetran, dbt). |
| **B2B/EDI Gateway** | **Not present** | **Potential gap** — depends on whether the organisation has B2B/EDI needs. For Northpower, current MFT capability covers the Coupa file exchange without EDI document standards. |
| **iPaaS / Orchestration** | **Not present as a named capability** | **Design question.** Not a transport-level peer — it is an orchestration layer. Could be modelled as a separate L2 capability or as a cross-cutting concern. |

### 5.2 The Data Integration gap

This is the most significant finding. Gartner maintains a completely separate $5.9B Magic Quadrant for Data Integration Tools with 20 vendors (December 2025), none of which overlap with the API Management or iPaaS vendor pools. This is Gartner's "data-centric" integration style — bulk movement and transformation of data between stores (databases, warehouses, data lakes) for analytics, reporting, and AI.

Products in this category: Informatica, Azure Data Factory, Talend/Qlik, Fivetran, Airbyte, dbt, Databricks (data engineering). These are architecturally distinct from app-to-app integration — different unit of work (datasets vs API calls), different timing (batch/CDC vs real-time), different buyer persona (data engineer vs API architect), different governance (data quality, lineage vs API contracts, SLAs).

Whether this gap matters for a given workspace depends on whether data integration workloads exist. For Northpower, Azure Data Factory is already in the estate for data platform purposes — but it has no corresponding capability or ABB in the framework.

### 5.3 The B2B/EDI question

B2B/EDI overlaps with MFT (MFT is often the transport for EDI documents) but the core concern is different: B2B/EDI is about **semantic interoperability with trading partners** (document standards, partner onboarding, compliance), while MFT is about **secure reliable file transport**. IBM sells them as separate products (Sterling B2B Integrator vs Sterling File Gateway). IDC gives B2B Middleware its own standalone MarketScape.

For Northpower specifically, B2B/EDI may not be immediately relevant — the current MFT capability (`CAP-NPC-001`) handles the Coupa file exchange without EDI document standards. If EDI workloads emerge (e.g., supplier e-invoicing via PEPPOL), B2B/EDI would become a distinct capability need.

### 5.4 The iPaaS / orchestration question

iPaaS is **not** a transport-level capability in the same class as API, Event, MFT, and Data Integration. It is an orchestration layer that composes multiple transport-level capabilities into multi-step workflows. However:

- Microsoft treats it as a peer pillar (Logic Apps alongside APIM, Service Bus, Event Grid)
- Gartner's iPaaS MQ is their largest integration evaluation ($8.5B market)
- Products like MuleSoft, Boomi, and Logic Apps are both orchestrators AND direct integration endpoints

**Design options for the framework:**
1. **Model as a separate L2 capability** — `CAP-NPC-0XX Application Integration & Orchestration` as a peer to `CAP-008 Integration Services`, covering workflow composition and connector management
2. **Model as an L3 under CAP-008** — alongside the transport-level L3s, acknowledging that iPaaS products deliver integration even if they sit at a higher abstraction level
3. **Model as a cross-cutting concern** — iPaaS orchestration as a platform-level capability that consumes integration services rather than being one
4. **Don't model it yet** — treat it as an SBB-level concern (the specific product you pick for orchestration) until a workload demands it

---

## 6. Comparison with Fusion5 "Four Pillars"

| Fusion5 Pillar | Dermot's framework (upstream) | Northpower workspace | Research finding |
|---|---|---|---|
| **API Gateway** | `CAP-010` + `AB-004` | Covered | Aligns with Gartner API Management MQ |
| **Real-Time Integration** | `CAP-011` + `AB-005` | Covered | Aligns with Gartner Event Stream Processing MG |
| **Managed File Transfer** | **Gap** | `CAP-NPC-001` + `AB-NPC-009` + `SB-NPC-009` | Gap confirmed by all sources |
| **Application Integration** | Partially implicit in `CAP-008` umbrella | Not explicitly addressed | iPaaS is an orchestration layer, not a transport-level peer |

Fusion5's model was used as **input** but not as **authority**. The independent research confirms that Fusion5's four pillars align reasonably well with the analyst consensus, except that Fusion5 omits Data Integration as a distinct pillar (likely because their focus is application-to-application integration, not data platform workloads).

---

## 7. Recommendations (for framework council consideration)

1. **Data Integration** should be considered as a new L3 capability under `CAP-008`. It is the single largest gap identified by this research — Gartner's $5.9B separate MQ with 20 vendors confirms it is a distinct family. Whether to create it as `CAP-NPC-002` (workspace extension) or propose it upstream depends on whether the framework maintainer considers data integration within scope.

2. **B2B/EDI** can remain deferred until a workspace has EDI workloads. The current MFT capability covers file-based partner exchange without EDI document standards.

3. **iPaaS / Orchestration** should be modelled as a separate concern from transport-level integration, not as a sixth L3 under `CAP-008`. The exact modelling choice (separate L2, cross-cutting, or SBB-level) is a design question for the framework council.

4. **Messaging vs Events split** (per Microsoft's model) is a minor refinement. The current `CAP-011` covers both. Splitting would only be justified if the framework needs to support separate maturity tracking for message-oriented vs event-oriented integration — unlikely to matter at this stage.

5. **The upstream framework** should consider adding MFT as a foundation capability (promoting `CAP-NPC-001` or equivalent), since MFT is recognized by every source as a fundamental integration style.

---

## 8. Source reliability notes

- **Gartner MQ/MG citations**: From 2024-2026 publications. Market sizes and vendor positions are point-in-time.
- **Hohpe/Woolf**: Canonical 2003 text. Still widely cited and unchanged in 20+ years. Hohpe's recent AWS-era writings expand but do not supersede the original four styles.
- **TOGAF 10**: Checked against The Open Group's published TOGAF 10 standards. The absence of prescribed integration ABBs is confirmed, not inferred.
- **Microsoft Azure**: Based on Azure Architecture Center documentation and Azure Integration Services whitepaper (v1.0). Reflects current product positioning as of Q1 2026.
- **Forrester/IDC**: Wave and MarketScape reports cited are the most recent available at time of research.
- **CNCF**: Based on the CNCF landscape (landscape.cncf.io) as of Q1 2026. Project graduation/incubation status confirmed.
