# Vision for AI-Assisted Architecture

**Author**: Dermot Canniffe  
**Date**: February 2026  
**Status**: Living Document

---

## Executive Summary

AI-Assisted Architecture is an open-source methodology that enables enterprise and solution architects to leverage AI agents as productivity multipliers while maintaining governance, quality, and human accountability.

This document captures the vision, design decisions, and strategic considerations that shaped this project.

---

## The Problem We're Solving

### Current State Challenges

Architects face increasing pressure to deliver more, faster:

| Challenge | Impact |
|-----------|--------|
| **Volume of work** | More initiatives, same-sized teams |
| **Technology complexity** | Rapidly evolving landscape |
| **Documentation burden** | Quality expectations increasing |
| **Research demands** | Staying current requires constant effort |
| **Consistency** | Maintaining standards across artifacts |

### The AI Opportunity

AI tools (GitHub Copilot, Cursor, Claude Code) offer significant acceleration potential:

- **Research synthesis** - AI can gather and summarize information rapidly
- **Draft generation** - Initial content created in minutes, not hours
- **Pattern application** - Consistent application of standards
- **Analysis acceleration** - Preliminary analysis as starting point

### The Governance Gap

However, using AI in architecture work raises concerns:

- **Quality uncertainty** - AI outputs may contain errors
- **Provenance opacity** - Unclear what's AI-generated vs human-created
- **Accountability questions** - Who owns AI-assisted decisions?
- **Security considerations** - What information can flow to AI?

---

## Our Vision

### Target Operating Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    AI-Assisted Architecture Operating Model                      │
└─────────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────────────┐     ┌──────────────────────┐     ┌────────────────┐
   │   HUMAN ARCHITECTS   │     │     AI AGENTS        │     │   GOVERNANCE   │
   │  (EA, SA, Platform)  │     │  (Research, Draft)   │     │   (Controls)   │
   └──────────┬───────────┘     └──────────┬───────────┘     └───────┬────────┘
              │                            │                         │
              ▼                            ▼                         ▼
   ┌──────────────────────────────────────────────────────────────────────────┐
   │                        ARCHITECTURE WORKFLOWS                             │
   │                                                                           │
   │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌────────────┐ │
   │  │  Research   │ → │  Analysis   │ → │   Design    │ → │  Review    │ │
   │  │  (AI-led)   │    │  (AI+Human) │    │ (AI draft)  │    │ (Human)    │ │
   │  └─────────────┘    └─────────────┘    └─────────────┘    └────────────┘ │
   └──────────────────────────────────────────────────────────────────────────┘
```

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Augmentation, not automation** | AI assists, humans decide |
| **Transparency** | Clear provenance for all AI-assisted content |
| **Governance-first** | Controls built into the methodology |
| **Platform-agnostic** | Works with multiple AI tools and cloud platforms |
| **Community-driven** | Open-source, contributions welcome |

---

## What We're Building

### 1. Opinionated Methodology

An end-to-end process from enterprise context to solution design:

```
Enterprise Context → Capabilities → ABBs → SBBs → Solution Design
```

**Why opinionated?** Without a clear methodology, AI assistance becomes ad-hoc and inconsistent. An opinionated approach enables:
- Consistent artifacts
- Reusable prompts
- Quality predictability
- Training and onboarding

### 2. Building Block Framework

Separating logical (ABB) from physical (SBB) architecture:

| Aspect | ABB | SBB |
|--------|-----|-----|
| **Nature** | Logical | Physical |
| **Vendor** | Agnostic | Specific |
| **Stability** | Stable | Evolves |
| **Example** | "API Gateway" | "AWS API Gateway v2" |

**Why this matters**: ABBs provide stable anchors for architecture while SBBs capture the evolving technology landscape.

### 3. AI Agent System

Purpose-built agents for architecture work:

| Agent Category | Agents | Purpose |
|----------------|--------|---------|
| **Work Management** | Start, Progress, Status, Pivot | Manage architecture work items |
| **ASCII Image** | Detect, Convert, Replace | Convert ASCII diagrams to images |
| **Architecture** | Research, Gap Analysis, Pattern Selection | Assist with architecture tasks |

### 4. Governance Framework

Controls for AI-assisted architecture:

- **Provenance Standard**: Three-state model (ai-raw → ai-curated → draft)
- **Security Dialogue Framework**: Structured engagement with security teams
- **Human Review Gates**: Quality gates before publication
- **Data Classification**: Rules for information flow to AI

### 5. Multi-Organization Adoption Model

Enable organizations to adopt, customize, and contribute:

```
CORE REPOSITORY (versioned, stable)
        │
        ├── Organization A (fork + customize)
        ├── Organization B (fork + customize)
        └── Organization C (fork + customize)
                │
                └── Contributions back to core
```

---

## Design Decisions

### Why MkDocs over Docusaurus?

| Factor | MkDocs Material | Docusaurus |
|--------|-----------------|------------|
| **Setup** | Simple (Python) | More complex (Node.js) |
| **Focus** | Documentation | Docs + blog + custom |
| **Community** | Technical docs standard | Broader web focus |

**Decision**: MkDocs Material for simplicity and documentation focus. Can migrate later if needed.

### Why Multiple AI Tool Support?

Different tools have different strengths:

| Tool | Strength |
|------|----------|
| **GitHub Copilot** | Enterprise adoption, wide IDE support |
| **Cursor** | Deep codebase understanding, agent mode |
| **Claude Code** | Advanced reasoning, large context |

**Decision**: Support all three with tool-specific guides. Don't lock users into one tool.

### Why Semantic Versioning?

Organizations need stability while the core evolves:

- **PATCH**: Safe to auto-sync
- **MINOR**: Review recommended
- **MAJOR**: Breaking changes, manual migration

**Decision**: Strict semver with clear upgrade paths.

### Why Agent-Optimized Building Blocks?

Building blocks include `agent_hints`:

```yaml
agent_hints:
  selection_criteria: |
    Use this ABB when...
  composition_notes: |
    Typically paired with...
  common_mistakes: |
    Do not use for...
```

**Decision**: Metadata designed for AI comprehension accelerates agent-assisted architecture.

---

## Strategic Considerations

### Open Source Strategy

| Aspect | Approach |
|--------|----------|
| **License** | CC BY 4.0 (docs), MIT (code) |
| **Governance** | Benevolent dictator (initial), community later |
| **Contributions** | Welcome, with quality bar |
| **Commercialization** | None planned; focus on adoption |

### Community Building

Planned activities:
- GitHub Discussions for community
- Blog posts on methodology
- LinkedIn and Medium articles
- Conference presentations (future)

### Success Metrics

| Metric | Target |
|--------|--------|
| **GitHub Stars** | Awareness indicator |
| **Forks** | Adoption indicator |
| **Contributors** | Community health |
| **Org Adoptions** | Real-world validation |

---

## Future Considerations

### Tooling Evolution

| Tool | Status | Future |
|------|--------|--------|
| **GitHub Copilot** | Supported now | Continue support |
| **Cursor** | Supported now | Deepen integration |
| **Claude Code** | Supported now | Expand guides |
| **Future tools** | Monitor | Evaluate as they emerge |

### Methodology Evolution

| Area | Current | Future |
|------|---------|--------|
| **Phases** | 6 defined | Refine based on feedback |
| **Templates** | Base set | Expand library |
| **Agents** | 3 categories | Add specialized agents |
| **Building Blocks** | Reference set | Community contributions |

### Governance Evolution

| Area | Current | Future |
|------|---------|--------|
| **Provenance** | 3-state model | May add states |
| **Security Framework** | Dialogue framework | Industry-specific variants |
| **Regulatory** | Generic guidance | Region-specific mapping |

---

## Call to Action

### For Individual Architects

1. Try the methodology on a project
2. Provide feedback via GitHub Issues
3. Share your experience

### For Organizations

1. Evaluate for adoption
2. Fork and customize
3. Contribute improvements back

### For the Community

1. Star the repository
2. Contribute content
3. Spread the word

---

## References

- EU AI Act Article 50 (Content Transparency)
- C2PA Content Credentials 2.0
- NIST AI 100-4 Digital Content Transparency
- TOGAF Architecture Building Blocks

---

*This document is a living document and will evolve with the project.*
