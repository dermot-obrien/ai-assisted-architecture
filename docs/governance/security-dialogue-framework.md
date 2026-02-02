# Security Dialogue Framework

A framework for engaging with Security teams on AI-assisted architecture.

**Author**: Dermot Canniffe  
**Date**: February 2026  
**Status**: Reference Framework

---

## Purpose

This framework provides a structured approach for architects to engage with Security teams to establish:

- Pre-conditions for AI-assisted architecture
- Information flow controls
- Output governance
- Candidate decisions requiring approval

---

## Vision for AI-Assisted Architecture

### Target Operating Model

AI agents serve as **productivity multipliers** for architects:

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
   │  Research (AI-led) → Analysis (AI+Human) → Design (AI draft) → Review   │
   └──────────────────────────────────────────────────────────────────────────┘
```

### What AI Does

| Capability | Description |
|------------|-------------|
| **Research Synthesis** | Gather and summarize technical information |
| **Draft Generation** | Create initial document structure and content |
| **Pattern Application** | Apply established patterns to new contexts |
| **Analysis Acceleration** | Preliminary analysis for human review |

### What AI Does NOT Do

| Exclusion | Rationale |
|-----------|-----------|
| Make final architecture decisions | Human accountability |
| Access production systems | Operational risk |
| Process customer PII | Data classification |
| Approve governance records | Human authority |

---

## Pre-Conditions

### Foundational Controls

| # | Condition | Description |
|---|-----------|-------------|
| F1 | **Approved AI Tool List** | Security-approved tools for architecture use |
| F2 | **Data Classification Guidance** | What classifications can flow to AI |
| F3 | **Architect Training** | Mandatory training before access |
| F4 | **Audit Logging** | Capability to log AI interactions |
| F5 | **Data Loss Prevention** | DLP controls for AI interactions |

### Process Controls

| # | Condition | Description |
|---|-----------|-------------|
| P1 | **Human Review Gate** | No AI content published without review |
| P2 | **Provenance Labeling** | All AI content clearly labeled |
| P3 | **Version Control** | AI artifacts tracked in Git |
| P4 | **Approval Workflow** | Defined approval for AI artifacts |
| P5 | **Exception Process** | Escalation for edge cases |

### Technical Controls

| # | Condition | Description |
|---|-----------|-------------|
| T1 | **Network Controls** | AI tool access via policy |
| T2 | **Data Residency** | Processing meets residency requirements |
| T3 | **Model Selection** | Approved models for sensitivity levels |
| T4 | **Prompt Templates** | Approved templates for sensitive contexts |
| T5 | **Output Filtering** | Safeguards against sensitive data leakage |

---

## Information Flow Controls

### Workspace Information Categories

| Category | Examples | Sensitivity |
|----------|----------|-------------|
| **A. Public Knowledge** | Standards, vendor docs | Low |
| **B. Architecture Patterns** | Building blocks, patterns | Internal |
| **C. Solution Design** | DOAPs, ADRs | Internal-Confidential |
| **D. Strategic Context** | Roadmaps, capability gaps | Confidential |
| **E. Security Details** | Threat models, controls | Confidential-Restricted |
| **F. Cost/Commercial** | Pricing, budgets | Confidential |
| **G. Customer Reference** | Journey context | Confidential |

### Proposed Flow Rules

| Category | Cloud AI | Enterprise AI | Controls |
|----------|----------|---------------|----------|
| A. Public | ✅ Allowed | ✅ Allowed | None |
| B. Patterns | ⚠️ Decision | ✅ Allowed | Review for IP |
| C. Designs | ⚠️ Decision | ✅ Allowed | No PII |
| D. Strategy | ⚠️ Decision | ✅ Allowed | Redact sensitive |
| E. Security | ❌ Prohibited | ⚠️ Limited | Strong controls |
| F. Commercial | ❌ Prohibited | ⚠️ Limited | Redact figures |
| G. Customer | ❌ Prohibited | ⚠️ Limited | No PII |

---

## Output Governance

### Output Types

| Type | Description |
|------|-------------|
| **Research Summaries** | Synthesized information |
| **Draft Documents** | Initial document content |
| **Code/Config** | Technical artifacts |
| **Analysis Results** | Structured analysis |
| **Diagrams** | Visual artifacts |

### Usage Rules

| Output | Direct Use | After Review | After SME |
|--------|------------|--------------|-----------|
| Research | ❌ | ✅ Internal | ✅ Publish |
| Drafts | ❌ | ⚠️ Working | ✅ Publish |
| Code | ❌ | ⚠️ Non-prod | ✅ Prod |
| Analysis | ❌ | ✅ Working | ✅ Decision |
| Diagrams | ❌ | ✅ Internal | ✅ Publish |

---

## Provenance as Control

Three-state model tracks AI involvement:

```
┌──────────┐     Generalist      ┌──────────────┐      SME        ┌─────────┐
│  AI-RAW  │ ──── Review ──────► │  AI-CURATED  │ ── Validation ─►│  DRAFT  │
└──────────┘                     └──────────────┘                 └─────────┘
```

### Control Functions

| Function | How Provenance Addresses It |
|----------|---------------------------|
| **Transparency** | Visibility into AI involvement |
| **Accountability** | Documented reviewer at each stage |
| **Quality Gate** | Prevents unreviewed content reaching stakeholders |
| **Audit Trail** | Full traceability via Git + metadata |
| **Risk Stratification** | Different rules per provenance state |

---

## Candidate Decisions

### Decision Summary

| ID | Topic | Priority | Risk |
|----|-------|----------|------|
| CD-01 | Information Flow Policy | High | Medium |
| CD-02 | Output Usage Policy | High | Low |
| CD-03 | Provenance Enforcement | High | Low |
| CD-04 | Approved AI Tools | Critical | Medium |
| CD-05 | Data Classification Mapping | Critical | High |
| CD-06 | Training Requirements | Medium | Low |
| CD-07 | Audit Log Requirements | Medium | Low |
| CD-08 | Exception Process | Medium | Low |
| CD-09 | Web Search Enablement | Critical | Medium |
| CD-10 | Future Tooling (Cursor, Claude) | Low | N/A |

### Key Questions for Security

#### Tooling

1. Can existing GitHub Copilot approval extend to architecture work?
2. Can web search be enabled for research?
3. Can Python conversion tools run locally?

#### Data Classification

4. What classifications can flow to AI?
5. Can workspace files be indexed by AI?
6. What sanitization is required?

#### Governance

7. What logging requirements apply?
8. What human review is required?
9. Is provenance labeling acceptable as a control?
10. What training should architects complete?

---

## Regulatory Alignment

| Regulation | Relevance |
|------------|-----------|
| **EU AI Act Article 50** | Content labeling |
| **NIST AI 100-4** | Transparency guidance |
| **C2PA 2.0** | Provenance standards |

---

## Next Steps

| Step | Description |
|------|-------------|
| 1 | Initial dialogue with Security |
| 2 | Tool assessment (if needed) |
| 3 | Policy draft review |
| 4 | Decision sign-off |
| 5 | Training development |
| 6 | Pilot rollout |

---

## References

- EU AI Act (Content Transparency)
- C2PA Content Credentials 2.0
- NIST AI 100-4 Digital Content Transparency
- ISO/IEC 42005:2025 AI Impact Assessment
