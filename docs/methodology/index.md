# Methodology

AI-Assisted Architecture follows an opinionated, end-to-end methodology from enterprise context through solution design.

## Philosophy

Our methodology is built on these principles:

| Principle | Description |
|-----------|-------------|
| **Capabilities First** | Always start with business capabilities, not technology |
| **Separation of Concerns** | ABBs (logical) distinct from SBBs (physical) |
| **Platform Agnostic Core** | ABBs work across any cloud or on-premise |
| **Traceability** | Every artifact traces to capabilities |
| **Agent-Optimized** | Metadata designed for AI comprehension |
| **Human Accountability** | AI assists, humans decide |

## Methodology Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    AI-Assisted Architecture Methodology                          │
└─────────────────────────────────────────────────────────────────────────────────┘

  Phase 1              Phase 2              Phase 3              Phase 4
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ENTERPRISE │     │ CAPABILITY  │     │ ARCHITECTURE│     │  SOLUTION   │
│   CONTEXT   │ ──► │  MODELING   │ ──► │  BUILDING   │ ──► │  BUILDING   │
│             │     │             │     │   BLOCKS    │     │   BLOCKS    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
   Vision             L0 → L1 → L2        Logical,            Vendor-
   Drivers            Capability          Platform-           Specific
   Constraints        Hierarchy           Agnostic            Realization
                      Maturity
                                               │                   │
                                               ▼                   ▼
                                         ┌─────────────────────────────┐
                                         │      SOLUTION DESIGN        │
                                         │  • Component Architecture   │
                                         │  • Integration Architecture │
                                         │  • Deployment Architecture  │
                                         └─────────────────────────────┘
                                                       │
                                                       ▼
                                         ┌─────────────────────────────┐
                                         │     DECISIONS (ADRs)        │
                                         └─────────────────────────────┘
```

## Phases

### 1. Enterprise Context

Establish the strategic context for architecture work:

- Vision and target state
- Business drivers and goals
- Constraints (regulatory, technical, organizational)
- Stakeholder analysis

*Detailed phase documentation coming soon.*

### 2. Capability Modeling

Define what the business needs to do:

- Capability hierarchy (L0 → L1 → L2)
- Capability assessment and maturity
- Gap analysis
- Capability roadmap

*Detailed phase documentation coming soon.*

### 3. Architecture Building Blocks

Define logical, platform-agnostic components:

- ABB identification from capabilities
- ABB specification
- Interface definition
- Quality attributes

See [Building Blocks](../building-blocks/index.md) for templates and examples.

### 4. Solution Building Blocks

Map ABBs to vendor-specific implementations:

- SBB selection
- Platform patterns (AWS, Azure, GCP)
- Technology decisions

See [Building Blocks](../building-blocks/index.md) for templates and examples.

### 5. Solution Design

Compose building blocks into solutions:

- Solution design canvas
- Component architecture
- Integration architecture
- Deployment architecture

*Detailed phase documentation coming soon.*

### 6. Decisions

Document architecture decisions:

- Decision framework
- Option analysis
- Architecture Decision Records (ADRs)

See [Templates](../templates/index.md) for ADR template.

## AI Integration Points

Each phase has specific AI integration:

| Phase | AI Assists With |
|-------|-----------------|
| Enterprise Context | Stakeholder analysis, constraint research |
| Capabilities | Gap analysis, maturity assessment |
| ABBs | Pattern identification, interface design |
| SBBs | Technology research, option comparison |
| Solution Design | Draft generation, integration patterns |
| Decisions | Option analysis, consequence mapping |

## Next Steps

- [Philosophy](philosophy.md) - Deep dive into our principles
- [Building Blocks](../building-blocks/index.md) - ABB and SBB reference
