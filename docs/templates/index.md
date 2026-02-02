# Templates

Standard templates for AI-assisted architecture artifacts.

## Overview

Templates ensure consistency across architecture work:

- Standard structure for all artifact types
- Provenance tracking built-in
- Agent-optimized metadata
- Organization-extensible

## Template Categories

### [Methodology Templates](methodology/index.md)

Templates for methodology artifacts:

- Capability Model
- Capability Assessment
- Capability Roadmap

### [Building Block Templates](building-blocks/index.md)

Templates for building blocks:

- ABB Template
- SBB Template

### [Solution Templates](solution/index.md)

Templates for solution artifacts:

- Solution Design Canvas
- Architecture Decision Record (ADR)
- Component Specification

### [Work Management Templates](work-management/index.md)

Templates for work tracking:

- Plan Template
- Progress Template
- Scope Template

## Using Templates

### 1. Copy the Template

```bash
cp templates/building-blocks/abb-template.md my-abb.md
```

### 2. Fill in Placeholders

Replace `{PLACEHOLDER}` values with your content.

### 3. Set Provenance

Update the provenance block:

```yaml
provenance:
  origin: ai-generated    # or collaborative
  review_state: ai-raw    # initial state
```

### 4. Update as You Progress

When reviewed, update provenance:

```yaml
provenance:
  origin: ai-generated
  review_state: ai-curated
  curated_by: "Your Name"
  curated_date: "2026-02-01"
```

## Customizing Templates

Organizations can customize templates:

1. Copy base template to `overrides/templates/`
2. Add organization-specific fields
3. Maintain base structure for compatibility

See [Organization Adoption](../getting-started/organization-adoption.md) for details.

## Template Index

| Template | Purpose | Location |
|----------|---------|----------|
| ABB | Architecture Building Block | `core/templates/_base/abb-template.md` |
| SBB | Solution Building Block | `core/templates/_base/sbb-template.md` |
| ADR | Architecture Decision Record | `core/templates/_base/adr-template.md` |
| Plan | Work item plan | `core/agents/work-management/_templates/plan.md` |
| Progress | Work tracking | `core/agents/work-management/_templates/progress.yaml` |
| Scope | Work scope | `core/agents/work-management/_templates/scope.md` |
