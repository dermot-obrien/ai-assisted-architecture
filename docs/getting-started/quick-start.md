# Quick Start

Get started with AI-Assisted Architecture in 5 minutes.

## Step 1: Understand the Flow

```
Enterprise Context → Capabilities → ABBs → SBBs → Solution Design
```

| Phase | What You Define | AI Assists With |
|-------|----------------|-----------------|
| **Enterprise Context** | Vision, drivers, constraints | Stakeholder analysis |
| **Capabilities** | Business capability hierarchy | Gap analysis, assessment |
| **ABBs** | Logical building blocks | Pattern identification |
| **SBBs** | Vendor-specific implementations | Technology research |
| **Solution Design** | Component and integration architecture | Draft generation |

## Step 2: Set Up Your Environment

### IDE with AI Assistant

=== "VS Code + Copilot"

    1. Install VS Code
    2. Install GitHub Copilot extension
    3. Sign in with GitHub account

=== "Cursor"

    1. Download Cursor from cursor.sh
    2. Sign in with your account
    3. AI is built-in

=== "Claude Code"

    1. Install Claude Code CLI
    2. Authenticate with Anthropic
    3. Use in terminal or VS Code

### Repository Structure

Create this structure for your architecture work:

```
my-architecture/
├── capabilities/           # Business capabilities
├── building-blocks/
│   ├── abbs/              # Architecture Building Blocks
│   └── sbbs/              # Solution Building Blocks
├── solutions/             # Solution designs
├── decisions/             # Architecture Decision Records
└── work/                  # Active work items
```

## Step 3: Apply the Methodology

### Start with Enterprise Context

Ask your AI assistant:

```
Research the business drivers and constraints for [your domain].
Consider regulatory requirements, technology trends, and organizational goals.
```

### Model Capabilities

```
Based on the enterprise context, identify the L0 and L1 business capabilities
needed for [your domain]. Structure as a hierarchy with descriptions.
```

### Identify Building Blocks

```
For capability [X], what Architecture Building Blocks (ABBs) are needed?
Consider integration, security, and operational requirements.
```

### Design Solutions

```
Using ABB [X] and ABB [Y], draft a solution design for [use case].
Include component architecture, integration points, and deployment considerations.
```

## Step 4: Track Provenance

Add provenance metadata to AI-assisted documents:

```yaml
---
provenance:
  origin: ai-generated
  review_state: ai-raw    # or ai-curated, draft
---
```

Review states:

| State | Meaning |
|-------|---------|
| `ai-raw` | AI-generated, not reviewed |
| `ai-curated` | Reviewed for structure by generalist |
| `draft` | Validated by subject matter expert |

## Step 5: Review and Publish

!!! warning "Human Review Required"
    Never publish AI-generated content without human review.

1. Generate draft with AI assistance
2. Review for accuracy and completeness
3. Update provenance to `ai-curated` or `draft`
4. Proceed through governance workflow

## Next Steps

- [Full Installation Guide](installation.md) - Complete setup instructions
- [Methodology Deep Dive](../methodology/index.md) - Detailed methodology
- [Agent Setup](../agents/index.md) - Configure AI agents
- [Templates](../templates/index.md) - Use standard templates
