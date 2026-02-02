# Human Review Gates

Quality gates requiring human review before AI-assisted content can progress.

## Overview

Human review gates ensure AI-assisted architecture outputs meet quality standards before wider distribution.

## Review Gate Levels

| Gate | Required State | Reviewer | Purpose |
|------|---------------|----------|---------|
| **Working Draft** | `ai-raw` | Self | Personal use only |
| **Internal Reference** | `ai-curated` | Peer | Team sharing |
| **Stakeholder Review** | `draft` | Senior architect | External presentation |
| **Governance Forum** | `draft` | Architecture board | Formal approval |
| **External Publication** | `draft` + sign-off | Lead architect | Public release |

## Gate Requirements

### ai-raw → ai-curated

Generalist review checks:

- [ ] Structure is logical
- [ ] No obvious errors
- [ ] Links work
- [ ] Formatting correct
- [ ] Provenance declared

### ai-curated → draft

SME review validates:

- [ ] Technical accuracy
- [ ] Completeness
- [ ] Alignment with standards
- [ ] Appropriate recommendations
- [ ] Ready for stakeholders

## Review Workflow

```
AI Output  →  Self Review  →  Peer Review  →  SME Review  →  Approval
(ai-raw)      (ai-raw)        (ai-curated)    (draft)        (approved)
```

## Documentation

All reviews should be documented:

- Reviewer name
- Review date
- State transition
- Comments or changes made

## Related

- [Provenance Standard](provenance-standard.md)
- [Data Classification](data-classification.md)
