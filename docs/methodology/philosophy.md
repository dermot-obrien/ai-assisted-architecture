# Philosophy

The guiding principles behind AI-Assisted Architecture.

## Core Beliefs

### 1. Capabilities First

**Always start with business capabilities, not technology.**

Technology choices are implementation details. Capabilities represent what the business needs to do, independent of how it's done.

```
❌ Wrong: "We need Kubernetes"
✅ Right: "We need Container Orchestration capability"
```

### 2. Separation of Concerns

**ABBs (logical) are distinct from SBBs (physical).**

| Aspect | ABB | SBB |
|--------|-----|-----|
| **Nature** | Logical, conceptual | Physical, concrete |
| **Vendor** | Agnostic | Specific |
| **Stability** | Stable | Evolves with technology |
| **Example** | "API Gateway" | "AWS API Gateway v2" |

### 3. Platform Agnostic Core

**ABBs work across any cloud or on-premise.**

Your architecture patterns should be portable. Vendor lock-in should be a conscious decision, not an accident.

### 4. Traceability

**Every artifact traces to capabilities.**

```
Capability → ABB → SBB → Solution Component
     ↑                          ↓
     └────── ADR ←──────────────┘
```

If you can't trace an artifact to a capability, question why it exists.

### 5. Agent-Optimized

**Metadata designed for AI comprehension.**

Building blocks include `agent_hints` that help AI agents:
- Select appropriate blocks
- Understand composition rules
- Avoid common mistakes

### 6. Human Accountability

**AI assists, humans decide.**

AI agents accelerate work but never:
- Make final architecture decisions
- Approve governance records
- Bypass human review

## AI Philosophy

### What AI Does Well

| Task | AI Contribution |
|------|-----------------|
| **Research** | Synthesize information, compare options |
| **Drafting** | Generate initial content quickly |
| **Analysis** | Identify patterns, gaps, inconsistencies |
| **Consistency** | Apply templates and standards uniformly |

### What Humans Must Do

| Task | Human Responsibility |
|------|---------------------|
| **Decisions** | Evaluate trade-offs, commit to direction |
| **Validation** | Verify accuracy, appropriateness |
| **Judgment** | Apply context AI lacks |
| **Accountability** | Own the outcomes |

### The Collaboration Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Human-AI Collaboration Model                              │
└─────────────────────────────────────────────────────────────────────────────────┘

    HUMAN                           AI                          OUTPUT
      │                              │                              │
      │  "Research cloud            │                              │
      │   database options"         │                              │
      │─────────────────────────────►│                              │
      │                              │  Research, synthesize        │
      │                              │  Compare options             │
      │                              │  Generate draft              │
      │◄─────────────────────────────│                              │
      │                              │                              │
      │  Review, validate           │                              │
      │  Add context                │                              │
      │  Make decision              │                              │
      │──────────────────────────────────────────────────────────────►│
      │                              │                              │
      │                              │                       ADR-001.md
      │                              │                       (human-owned)
```

## Governance Philosophy

### Provenance is Non-Negotiable

Every AI-assisted artifact must declare its origin and review state.

```yaml
provenance:
  origin: ai-generated
  review_state: ai-raw | ai-curated | draft
```

### Quality Gates

| Gate | Requirement |
|------|-------------|
| Internal Reference | `ai-curated` minimum |
| Stakeholder Review | `draft` preferred |
| Formal Governance | `draft` required |
| External Publication | `draft` required |

## Practical Implications

### For Architects

1. **Use AI for first drafts** - Let AI generate, you refine
2. **Always validate** - AI can hallucinate or be outdated
3. **Maintain traceability** - Link everything to capabilities
4. **Document provenance** - Track AI involvement

### For Organizations

1. **Establish governance** - Define AI usage boundaries
2. **Train architects** - Ensure consistent practices
3. **Monitor quality** - Review AI-assisted outputs
4. **Evolve practices** - Learn and improve continuously

## Summary

AI-Assisted Architecture is about **augmentation, not automation**. AI agents make architects more productive while humans retain accountability for decisions and outcomes.
