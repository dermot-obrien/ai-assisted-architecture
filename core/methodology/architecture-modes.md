# Two Modes of Architecture Work

Architecture work operates in two modes, aligned with SAFe's Architectural Runway concept.

## Anticipate Mode (Building the Runway)

**Purpose**: Define canonical artifacts ahead of implementation to enable future solutions.

**When to Use**:
- Defining new platform capabilities
- Creating or improving canonical use cases
- Defining new Architecture Building Blocks (ABBs)
- Establishing bounded contexts and context maps
- Building shared infrastructure patterns

**Activities**:
- Define canonical use cases (what we might need)
- Define capabilities (business outcomes)
- Define bounded contexts (domain boundaries)
- Define ABBs (logical building blocks)
- Create context maps (integration patterns)

**Deliverables**:
- Use case specifications (UC-XXX)
- Capability model updates
- ABB specifications (AB-XXX)
- Bounded context definitions (BC-XXX)
- Architecture patterns (PT-XXX)

**Traceability Flow**:
```
Vision / Strategic Drivers
    │
    ▼
Stakeholders & Goals
    │
    ▼
Canonical Use Cases (UC-XXX)
    │
    ├──────────────────┐
    ▼                  ▼
Capabilities        Bounded Contexts
(CAP-L0/L1/L2)      (BC-XXX)
    │                  │
    └────────┬─────────┘
             ▼
Architecture Building Blocks (AB-XXX)
    │
    ▼
Patterns (PT-XXX)
```

---

## Refine Mode (Using the Runway)

**Purpose**: Implement specific solutions using the architectural runway.

**When to Use**:
- Implementing a specific initiative or project
- Deploying a vendor solution
- Creating solution architecture for delivery
- Refining ABBs into Solution Building Blocks (SBBs)

**Activities**:
- Reference canonical use cases
- Reference existing ABBs
- Refine ABBs → SBBs (with specific technologies)
- Document solution architecture viewpoints
- Create initiative-specific decisions

**Deliverables**:
- Initiative scope and DOAP (Design on a Page)
- Solution Building Block (SB-{INIT})
- Architecture Decision Records (ADR-{INIT}-XX)
- Deployment/security architecture
- Use case realizations

**Traceability Flow**:
```
Programme ({PROG})
    │
    ▼
Initiative ({PROG}-{NNN})
    │
    ├─── references ───> Canonical Use Cases (UC-XXX)
    │
    ▼
Solution Architecture
    │
    ├─── 01-context/
    │    └── use-cases/ ───> Initiative-specific elaborations
    │
    ├─── 02-logical-architecture/
    │    └── SB-{INIT}/ ───> Solution Building Block
    │         │
    │         └─── realizes ───> ABBs (AB-XXX)
    │
    ├─── 03-deployment-architecture/
    │
    ├─── 04-security-architecture/
    │
    └─── 05-decisions/
         └── ADR-{INIT}-{NN} ───> Initiative decisions
```

---

## Mode Selection Guide

| If the work is about... | Use Mode |
|-------------------------|----------|
| New platform capabilities | Anticipate |
| Improving canonical use cases | Anticipate |
| Defining new ABBs | Anticipate |
| Establishing bounded contexts | Anticipate |
| Implementing a specific initiative | Refine |
| Deploying a vendor solution | Refine |
| Solution architecture for delivery | Refine |
| Refining ABBs into SBBs | Refine |

---

## Relationship Between Modes

The two modes are complementary:

1. **Anticipate** builds the runway - creating reusable artifacts
2. **Refine** uses the runway - implementing specific solutions
3. **Refine** may feed back to **Anticipate** - identifying gaps in the runway

**Example Workflow**:
```
Anticipate: Define UC-001 (Customer Engagement) canonical use case
Anticipate: Define AB-050 (LLM Service) as capability enabler
                            │
                            ▼
Refine:     AIP-001 initiative references UC-001
Refine:     SB-AIP001 realizes AB-050 using AWS Bedrock
Refine:     Gap identified: AB-050 needs streaming support
                            │
                            ▼
Anticipate: Update AB-050 specification with streaming requirements
```
