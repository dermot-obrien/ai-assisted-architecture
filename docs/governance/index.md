# Governance

Governance frameworks for AI-assisted architecture work.

## Overview

AI-assisted architecture requires governance to ensure:

- **Quality** - AI outputs meet standards
- **Transparency** - AI involvement is visible
- **Accountability** - Humans own decisions
- **Compliance** - Regulatory requirements met

## Governance Components

### [Security Dialogue Framework](security-dialogue-framework.md)

Framework for engaging with security teams on AI usage:

- Pre-conditions for AI-assisted architecture
- Information flow controls
- Output governance
- Candidate decisions for approval

### [Provenance Standard](provenance-standard.md)

Three-state model for tracking AI content:

| State | Meaning |
|-------|---------|
| `ai-raw` | AI-generated, not reviewed |
| `ai-curated` | Reviewed by generalist |
| `draft` | Validated by SME |

### [Data Classification](data-classification.md)

Rules for what data can flow to AI tools:

| Classification | External AI | Enterprise AI |
|---------------|-------------|---------------|
| Public | ✅ | ✅ |
| Internal | ⚠️ Sanitized | ✅ |
| Confidential | ❌ | ⚠️ Limited |
| Restricted | ❌ | ❌ |

### [Human Review Gates](human-review-gates.md)

Quality gates requiring human review:

| Gate | Minimum State |
|------|---------------|
| Internal reference | `ai-curated` |
| Stakeholder review | `draft` |
| Governance forum | `draft` |
| External publication | `draft` |

## Governance Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Governance Flow for AI Content                           │
└─────────────────────────────────────────────────────────────────────────────────┘

   AI Generates          Generalist Reviews       SME Validates
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐             ┌─────────┐             ┌─────────┐
   │ ai-raw  │ ──────────► │ai-curated│ ──────────► │  draft  │
   └─────────┘             └─────────┘             └─────────┘
        │                       │                       │
   No human review         Structure OK           Content accurate
   May have errors         Links valid            Ready for review
   Working only            Internal use           Can publish
```

## Regulatory Alignment

This framework aligns with:

| Regulation | Alignment |
|------------|-----------|
| EU AI Act Article 50 | Provenance labeling |
| NIST AI 100-4 | Content transparency |
| C2PA 2.0 | Provenance tracking |

## Implementation

### For Architects

1. Always declare provenance on AI-assisted documents
2. Follow review gates before sharing
3. Maintain traceability to capabilities
4. Document decisions with ADRs

### For Organizations

1. Adopt the Security Dialogue Framework
2. Implement provenance tracking
3. Define data classification rules
4. Establish review workflows

## Next Steps

- [Security Dialogue Framework](security-dialogue-framework.md)
- [Provenance Standard](provenance-standard.md)
- [Data Classification](data-classification.md)
- [Human Review Gates](human-review-gates.md)
