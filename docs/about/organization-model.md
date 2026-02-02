# Organization Adoption Model

How organizations adopt, customize, and contribute to AI-Assisted Architecture.

**Author**: Dermot Canniffe  
**Date**: February 2026

---

## Overview

AI-Assisted Architecture is designed for multi-organization adoption with:

- **Core stability** - Versioned, tested methodology
- **Customization** - Override without breaking updates
- **Currency** - Easy sync with upstream
- **Contribution** - Path to improve the core

---

## Distribution Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    AI-Assisted Architecture Distribution Model                   │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────────┐
                              │   CORE REPOSITORY       │
                              │   (ai-assisted-arch)    │
                              │                         │
                              │   Versioned: Semver     │
                              │   License: CC-BY-4.0    │
                              └───────────┬─────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
          │   ORG-A FORK    │   │   ORG-B FORK    │   │   ORG-C FORK    │
          │                 │   │                 │   │                 │
          │ + Templates     │   │ + Templates     │   │ + Templates     │
          │ + Branding      │   │ + Branding      │   │ + Branding      │
          │ + Internal ABBs │   │ + Internal ABBs │   │ + Internal ABBs │
          └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
                   │                     │                     │
                   └─────────────────────┴─────────────────────┘
                                          │
                                  Contributions (PRs)
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │      CORE EVOLVES      │
                              └─────────────────────────┘
```

---

## Core Repository Structure

```
ai-assisted-architecture/
├── core/                          # VERSIONED CORE
│   ├── VERSION                    # Semantic version
│   ├── methodology/               # Methodology content
│   ├── agents/                    # Agent definitions
│   ├── governance/                # Governance frameworks
│   ├── templates/_base/           # Base templates
│   └── building-blocks/           # Reference BBs
│
├── extensions/                    # EXTENSION POINTS
│   ├── templates/                 # Template customization
│   ├── themes/                    # Branding customization
│   └── building-blocks/           # BB extension guide
│
└── docs/                          # DOCUMENTATION
```

---

## Organization Fork Structure

```
org-ai-assisted-architecture/
├── core/                          # GIT SUBTREE from upstream
│   └── (versioned core content)
│
├── overrides/                     # ORG CUSTOMIZATIONS
│   ├── templates/                 # Custom templates
│   ├── branding/                  # Logo, colors, headers
│   ├── governance/                # Org policies
│   └── agents/                    # Org agent customizations
│
├── org-content/                   # ORG-SPECIFIC CONTENT
│   ├── building-blocks/           # Internal ABBs/SBBs
│   ├── patterns/                  # Org patterns
│   └── standards/                 # Org standards
│
├── work/                          # ACTIVE WORK (not shared)
│
└── ORG-CONFIG.yaml               # Org configuration
```

---

## Configuration

### Organization Configuration

```yaml
# ORG-CONFIG.yaml
organization:
  name: "Your Organization"
  short_name: "yourorg"

upstream:
  repository: "https://github.com/dermot-obrien/ai-assisted-architecture"
  version_pinned: "1.0.0"
  auto_sync: false

overrides:
  templates:
    - path: "templates/abb-template.md"
      reason: "Added org metadata fields"
  governance:
    - path: "governance/data-classification.md"
      reason: "Org-specific classification"

contributions:
  pending:
    - pr: "#45"
      description: "Improved template"
  accepted:
    - pr: "#32"
      description: "Bug fix"
```

---

## Versioning Strategy

### Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR  → Breaking changes (templates, schemas)
         Organizations: Manual review required
         
MINOR  → New features, templates, agents
         Organizations: Review recommended
         
PATCH  → Bug fixes, clarifications
         Organizations: Safe to auto-sync
```

### Version Compatibility

| Core | Org Pinned | Action |
|------|------------|--------|
| 2.1.3 | 2.1.0 | Auto-sync (patch) |
| 2.2.0 | 2.1.0 | Review (minor) |
| 3.0.0 | 2.1.0 | Migration (major) |

---

## Customization Approach

### Template Overrides

Organizations can extend base templates:

```yaml
# overrides.yaml
overrides:
  templates:
    abb-template:
      base: "core/templates/_base/abb-template.md"
      override: "overrides/templates/abb-template.md"
      merge_strategy: "extend"  # Add to base
```

**Extend** adds org fields to base template:

```markdown
---
# Standard fields (from core)
id: ABB-XXX
name: ""

# Org-specific fields (added)
org_metadata:
  cost_center: ""
  compliance_tags: []
---
```

### Branding Overrides

Organizations customize look and feel:

```
overrides/branding/
├── theme.yaml        # Colors, fonts
├── logo.svg          # Org logo
├── logo-dark.svg     # Dark mode logo
└── header-footer.md  # Standard content
```

### Agent Customizations

Organizations extend agent instructions:

```yaml
overrides:
  agents:
    work-management:
      base: "core/agents/work-management/AGENTS.md"
      override: "overrides/agents/work-management/AGENTS.md"
      merge_strategy: "append"  # Add org instructions
```

---

## Sync Process

### Pull Updates

```bash
# Fetch upstream changes
git fetch upstream

# Review changes
git log HEAD..upstream/main --oneline

# Merge (or rebase)
git merge upstream/main

# Resolve conflicts (org overrides take precedence)
```

### Sync Configuration

```yaml
# upstream.yaml
sync:
  strategy: "git-subtree"
  
merge:
  auto_merge_paths:
    - "core/methodology/**"
    - "core/tooling/**"
    
  manual_review_paths:
    - "core/templates/**"
    - "core/agents/**"
    
  never_merge_paths:
    - "core/templates/_base/abb-template.md"  # Fully overridden
```

---

## Contribution Flow

### Process

```
1. Develop improvement in org fork
         │
         ▼
2. Generalize (remove org-specific)
         │
         ▼
3. Submit PR to upstream
         │
         ▼
4. Review by maintainer
         │
         ▼
5. Merge → Available to all orgs
```

### Contribution Types

| Type | Description |
|------|-------------|
| **Template** | Improved base templates |
| **Building Block** | New reference ABBs/SBBs |
| **Agent** | Enhanced agent instructions |
| **Documentation** | Methodology improvements |
| **Bug Fix** | Corrections and clarifications |

### PR Requirements

- Organization-agnostic content
- Follows style guide
- Includes documentation
- Tested in org context

---

## Best Practices

### Do

- ✅ Keep `core/` unmodified
- ✅ Use `overrides/` for customizations
- ✅ Document override rationale
- ✅ Pin versions for stability
- ✅ Review before syncing
- ✅ Contribute generic improvements

### Don't

- ❌ Modify core files directly
- ❌ Include org info in contributions
- ❌ Auto-sync without review
- ❌ Forget provenance updates
- ❌ Create divergent forks

---

## Summary

| Phase | Action | Outcome |
|-------|--------|---------|
| **Fork** | Create org repository | Own instance |
| **Configure** | Set ORG-CONFIG.yaml | Define org settings |
| **Customize** | Populate overrides/ | Org branding, templates |
| **Extend** | Add org-content/ | Org-specific content |
| **Sync** | Pull upstream updates | Stay current |
| **Contribute** | Submit PRs | Improve core |

This model enables organizations to:
- Adopt quickly
- Customize freely
- Update safely
- Contribute back
