# Data Classification

Rules for what data can flow to AI tools in AI-assisted architecture work.

## Overview

Data classification determines what information can be shared with AI assistants based on sensitivity and risk.

## Classification Levels

| Level | Description | External AI | Enterprise AI |
|-------|-------------|-------------|---------------|
| **Public** | Publicly available information | Yes | Yes |
| **Internal** | Internal business information | Sanitized only | Yes |
| **Confidential** | Sensitive business information | No | Limited |
| **Restricted** | Highly sensitive (PII, secrets) | No | No |

## Guidance by Data Type

### Safe for AI Assistance

- Public documentation
- Open source code
- Published standards and frameworks
- Generic patterns and templates
- Hypothetical scenarios

### Requires Sanitization

- Internal architecture documents (remove specific names)
- Design patterns (anonymize client references)
- Technical specifications (remove proprietary details)

### Never Share with AI

- Customer PII
- Credentials and secrets
- Security vulnerabilities
- Unreleased product details
- Legal or regulatory privileged information

## Implementation

When using AI assistance:

1. **Review content before sharing** - Check for sensitive data
2. **Sanitize where needed** - Replace specifics with generic terms
3. **Use placeholders** - `{CLIENT}`, `{SYSTEM}`, `{ENDPOINT}`
4. **Document what was shared** - For audit purposes

## Related

- [Security Dialogue Framework](security-dialogue-framework.md)
- [Provenance Standard](provenance-standard.md)
