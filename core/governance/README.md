# Governance

Governance frameworks for AI-assisted architecture.

## Overview

Governance ensures AI-assisted architecture outputs meet quality, security, and accountability standards.

## Frameworks

### Provenance Standard

Three-state model for tracking AI involvement:

| State | Description | Human Review |
|-------|-------------|--------------|
| `ai-raw` | Direct AI output, unreviewed | Required |
| `ai-curated` | AI output, human-edited | Recommended |
| `draft` | Human-authored or fully reviewed | Standard |

See [Provenance Standard](../../docs/governance/provenance-standard.md) for full details.

### Security Dialogue Framework

Structured approach for engaging Security teams on AI-assisted architecture:

1. Pre-conditions for AI use
2. Information flow controls
3. Output governance
4. Approval requirements

See [Security Dialogue Framework](../../docs/governance/security-dialogue-framework.md) for full details.

## Human Review Gates

| Artifact Type | Minimum Review |
|---------------|----------------|
| Strategic decisions | Senior architect |
| Solution designs | Peer review |
| Building block selection | Team review |
| Configuration | Standard review |

## Data Classification

| Classification | AI Allowed | Notes |
|----------------|------------|-------|
| Public | Yes | No restrictions |
| Internal | Yes | With controls |
| Confidential | Limited | Specific approval |
| Restricted | No | Never to AI |

## Contents

- `policies/` - Governance policies (coming soon)
- `checklists/` - Review checklists (coming soon)
