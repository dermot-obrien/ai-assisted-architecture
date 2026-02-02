# Bounded Contexts

For architecture work involving domain decomposition, consider defining bounded contexts. This is particularly relevant in **Anticipate** mode when establishing domain boundaries.

## What Are Bounded Contexts?

Bounded contexts are **orthogonal** to capabilities and ABBs:

| Concept | Purpose | Stability |
|---------|---------|-----------|
| **Capabilities** | WHAT the organization does | Strategic, stable |
| **ABBs** | HOW capabilities are realized | Technical, reusable |
| **Bounded Contexts** | WHERE domain models are valid | Operational, team boundaries |

Bounded contexts represent domain/team boundaries where a particular model and ubiquitous language are valid. They are NOT:
- A layer in the capability hierarchy
- A way to organize ABBs
- Equivalent to capabilities

## Why Bounded Contexts Are Orthogonal

Consider an ABB like "LLM Service":
- It supports multiple domains (Customer, Risk, Operations)
- Each domain uses it differently, with different terminology
- The ABB is shared; the bounded contexts are separate

```
                    ┌─────────────────────────────────────────────────────┐
                    │                 BOUNDED CONTEXTS                    │
                    │    (WHERE models are valid - team/domain boundaries)│
                    │                                                     │
                    │   ┌──────────┐  ┌──────────┐  ┌──────────┐        │
                    │   │ Customer │  │   Risk   │  │   Ops    │  ...   │
                    │   └──────────┘  └──────────┘  └──────────┘        │
                    └─────────────────────────────────────────────────────┘
                              │              │              │
                              │ uses         │ uses         │ uses
                              ▼              ▼              ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    CAPABILITIES (WHAT we do)                          │
│   CAP-L0-GOV ──────── spans all contexts                              │
│   CAP-L0-GEN ──────── spans all contexts                              │
└───────────────────────────────────────────────────────────────────────┘
                              │
                              │ realized by
                              ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    ABBs (HOW we do it)                                │
│   AB-050 (LLM) ────── Shared component, used by all contexts          │
│   AB-200 (RAG) ────── Shared component, used by multiple contexts     │
└───────────────────────────────────────────────────────────────────────┘
```

## When to Define Bounded Contexts

Define bounded contexts when:
- Multiple teams work on related functionality with different domain models
- Domain terminology varies across the organization ("Customer" means different things)
- Integration patterns between domains need explicit documentation
- You're doing strategic DDD (Domain-Driven Design) work

Do NOT create bounded contexts for:
- Simple capability additions
- Technical/infrastructure ABBs
- Single-team deliverables

## Bounded Context Artifact

Create bounded context definitions using the template at `core/templates/bounded-context.yaml`.

**File naming**: `BC-{NNN}-{name}.yaml`

**Location**: `02-capabilities/bounded-contexts/`

## Context Mapping Patterns

When ABBs or data cross bounded context boundaries, document the integration pattern:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Open Host Service** | Providing standardized API for external consumers | LLM Service provides inference API |
| **Published Language** | Standard data contracts between contexts | Security contracts, API schemas |
| **Anti-Corruption Layer** | Translating between incompatible models | Legacy system integration |
| **Shared Kernel** | Explicitly shared model portions | Common customer model |
| **Customer-Supplier** | One context serves another | Data platform → AI platform |
| **Partnership** | Mutual development commitment | Co-developed integrations |

**Document cross-boundary ABB usage**:

| ABB | Contexts Using | Integration Pattern |
|-----|----------------|---------------------|
| AB-050 (LLM Service) | Customer, Risk, Ops | Open Host Service |
| AB-112 (Security Gateway) | ALL | Published Language |
| AB-200 (RAG System) | Customer, Risk | Shared Kernel |

## Bounded Context Traceability

| From | To | Relationship |
|------|-----|--------------|
| Bounded Context | Use Case | "contains" |
| Bounded Context | ABB | "uses (with integration pattern)" |
| Bounded Context | Bounded Context | "integrates with (pattern)" |
| Solution/Initiative | Bounded Context | "operates within" |
