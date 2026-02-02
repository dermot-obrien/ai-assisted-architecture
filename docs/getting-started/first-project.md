# Your First Project

Create your first AI-assisted architecture project step by step.

## Overview

In this guide, you'll:

1. Set up a project structure
2. Define enterprise context
3. Model capabilities
4. Create building blocks
5. Design a solution

## Step 1: Create Project Structure

```bash
mkdir my-first-project
cd my-first-project

# Create directory structure
mkdir -p {capabilities,building-blocks/{abbs,sbbs},solutions,decisions,work}

# Initialize git
git init
```

Create a README:

```markdown
# My First Project

AI-assisted architecture project using the AIAA methodology.

## Structure

- `capabilities/` - Business capability model
- `building-blocks/` - ABBs and SBBs
- `solutions/` - Solution designs
- `decisions/` - Architecture Decision Records
- `work/` - Active work items
```

## Step 2: Define Enterprise Context

Create `capabilities/enterprise-context.md`:

```markdown
---
provenance:
  origin: collaborative
  review_state: ai-raw
---

# Enterprise Context

## Vision
[Describe the target state]

## Business Drivers
1. [Driver 1]
2. [Driver 2]

## Constraints
- Regulatory: [constraints]
- Technical: [constraints]
- Organizational: [constraints]

## Stakeholders
| Stakeholder | Interest | Influence |
|-------------|----------|-----------|
| [Name] | [Interest] | High/Medium/Low |
```

**AI Prompt:**
```
Help me define the enterprise context for a [domain] project.
Consider business drivers, constraints, and key stakeholders.
```

## Step 3: Model Capabilities

Create `capabilities/capability-model.md`:

```markdown
---
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# Capability Model

## L0: [Domain]

### L1: [Capability Area 1]
- L2: [Specific Capability 1.1]
- L2: [Specific Capability 1.2]

### L1: [Capability Area 2]
- L2: [Specific Capability 2.1]
```

**AI Prompt:**
```
Based on the enterprise context, create a capability hierarchy for [domain].
Use L0 → L1 → L2 structure with clear descriptions.
```

## Step 4: Create an ABB

Create `building-blocks/abbs/abb-example.md`:

```markdown
---
id: ABB-001
name: "[Building Block Name]"
version: "1.0.0"
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# ABB-001: [Building Block Name]

## Purpose
[Why this building block exists]

## Capabilities Realized
- [Capability 1]
- [Capability 2]

## Interfaces

### Provided
| Interface | Type | Description |
|-----------|------|-------------|
| [Name] | REST/Event/etc | [Description] |

### Consumed
| Interface | Type | Description |
|-----------|------|-------------|
| [Name] | REST/Event/etc | [Description] |

## Quality Attributes
| Attribute | Requirement |
|-----------|-------------|
| Availability | 99.9% |
| Latency | <100ms p99 |

## SBB Realizations
- [SBB-AWS-001](../sbbs/sbb-aws-001.md) - AWS implementation
- [SBB-AZURE-001](../sbbs/sbb-azure-001.md) - Azure implementation
```

## Step 5: Design a Solution

Create `solutions/solution-001.md`:

```markdown
---
id: SOL-001
name: "[Solution Name]"
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# Solution Design: [Name]

## Overview
[Brief description of the solution]

## Use Case
[What problem this solves]

## Building Blocks Used
| ABB | SBB | Purpose |
|-----|-----|---------|
| ABB-001 | SBB-AWS-001 | [Purpose] |

## Component Architecture

[Describe components and their relationships]

## Integration Architecture

[Describe how components integrate]

## Deployment Architecture

[Describe deployment topology]

## Decisions
- [ADR-001](../decisions/adr-001.md) - [Decision topic]
```

## Step 6: Review and Refine

1. **Review AI outputs** for accuracy
2. **Update provenance** to `ai-curated`
3. **Get SME validation** where needed
4. **Update provenance** to `draft`

## What's Next

- [Methodology Deep Dive](../methodology/index.md) - Learn each phase in detail
- [Agents](../agents/index.md) - Automate with agents
- [Methodology](../methodology/index.md) - Full methodology details
