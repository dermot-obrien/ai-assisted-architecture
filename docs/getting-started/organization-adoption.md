# Organization Adoption Guide

How organizations can adopt, customize, and contribute to AI-Assisted Architecture.

## Adoption Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Organization Adoption Model                              │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────────┐
                              │   CORE REPOSITORY       │
                              │   (ai-assisted-arch)    │
                              │                         │
                              │   Versioned, Stable     │
                              └───────────┬─────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
          │   YOUR ORG      │   │   ORG-B FORK    │   │   ORG-C FORK    │
          │                 │   │                 │   │                 │
          │ + Templates     │   │ + Templates     │   │ + Templates     │
          │ + Branding      │   │ + Branding      │   │ + Branding      │
          │ + Internal ABBs │   │ + Internal ABBs │   │ + Internal ABBs │
          └─────────────────┘   └─────────────────┘   └─────────────────┘
```

## Step 1: Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR-ORG/ai-assisted-architecture.git
cd ai-assisted-architecture

# Add upstream remote
git remote add upstream https://github.com/dermot-obrien/ai-assisted-architecture.git
```

## Step 2: Create Organization Structure

```bash
# Create override directories
mkdir -p overrides/{templates,branding,governance,agents}
mkdir -p org-content/{building-blocks,patterns,standards}
mkdir -p work
```

Your structure:

```
your-org-ai-assisted-architecture/
├── core/                    # From upstream (don't modify)
├── overrides/               # Your customizations
│   ├── templates/           # Custom templates
│   ├── branding/            # Logo, colors, headers
│   ├── governance/          # Org governance docs
│   └── agents/              # Org agent customizations
├── org-content/             # Org-specific content
│   ├── building-blocks/     # Internal ABBs/SBBs
│   ├── patterns/            # Org patterns
│   └── standards/           # Org standards
└── work/                    # Active work (not shared)
```

## Step 3: Configure Your Organization

Create `ORG-CONFIG.yaml`:

```yaml
organization:
  name: "Your Organization"
  short_name: "yourorg"
  domain: "yourorg.com"

branding:
  primary_color: "#003087"
  secondary_color: "#FF6B35"
  logo: "overrides/branding/logo.svg"

upstream:
  repository: "https://github.com/dermot-obrien/ai-assisted-architecture"
  branch: "main"
  version_pinned: "1.0.0"    # Pin to specific version
  auto_sync: false           # Manual sync only

overrides:
  templates: []              # List templates you override
  governance: []             # List governance docs you override

contributions:
  pending: []                # PRs to upstream
  accepted: []               # Merged contributions
```

## Step 4: Customize Templates

Copy and modify templates:

```bash
# Copy base template
cp core/templates/_base/abb-template.md overrides/templates/

# Edit with your customizations
# - Add org-specific metadata fields
# - Include org header/footer
# - Add compliance sections
```

Example customization:

```markdown
---
# Standard fields (from core)
id: ABB-XXX
name: ""
version: "1.0.0"

# Org-specific fields (your addition)
org_metadata:
  cost_center: ""
  data_classification: ""
  compliance_tags: []
---
```

## Step 5: Add Organization Content

### Internal Building Blocks

```bash
# Create org-specific ABBs
cat > org-content/building-blocks/abb-org-identity.md << 'EOF'
---
id: ABB-ORG-001
name: "Organization Identity Service"
version: "1.0.0"
org_specific: true
---

# ABB-ORG-001: Organization Identity Service

[Your org-specific building block...]
EOF
```

### Organization Standards

```bash
# Create org standards
cat > org-content/standards/data-classification.md << 'EOF'
# Data Classification Standard

Organization-specific data classification levels...
EOF
```

## Step 6: Sync from Upstream

When new versions are released:

```bash
# Fetch upstream changes
git fetch upstream

# Review what's changed
git log HEAD..upstream/main --oneline

# Merge (or rebase) carefully
git merge upstream/main

# Resolve any conflicts in overrides
# Your overrides take precedence
```

### Version Pinning

For stability, pin to specific versions:

```yaml
# In ORG-CONFIG.yaml
upstream:
  version_pinned: "1.0.0"
```

Only sync when ready:

```bash
git fetch upstream
git checkout v1.1.0  # Specific version tag
```

## Step 7: Contribute Back

When you have improvements to share:

### 1. Generalize Your Contribution

Remove org-specific content:

```bash
# Create contribution branch
git checkout -b contrib/improved-abb-template

# Copy your override to a clean version
cp overrides/templates/abb-template.md contrib-abb-template.md

# Remove org-specific fields
# Make it generic and reusable
```

### 2. Submit Pull Request

```bash
# Push to your fork
git push origin contrib/improved-abb-template

# Create PR to upstream via GitHub UI
```

### 3. PR Template

```markdown
## Summary
[What this contributes]

## Type
- [ ] Template improvement
- [ ] New building block
- [ ] Agent enhancement
- [ ] Documentation

## Organization-Agnostic
- [ ] No company-specific references
- [ ] Reusable across industries
- [ ] Follows contribution guidelines
```

## Best Practices

### Do

- :white_check_mark: Keep `core/` unmodified
- :white_check_mark: Use `overrides/` for customizations
- :white_check_mark: Document what you override and why
- :white_check_mark: Pin versions for stability
- :white_check_mark: Contribute generic improvements back

### Don't

- :x: Modify files in `core/` directly
- :x: Include org-specific info in contributions
- :x: Auto-sync without review
- :x: Forget to update provenance

## Support

- [GitHub Discussions](https://github.com/dermot-obrien/ai-assisted-architecture/discussions)
- [Issue Tracker](https://github.com/dermot-obrien/ai-assisted-architecture/issues)
