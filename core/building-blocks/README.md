# Building Blocks

Reference Architecture Building Blocks (ABBs) and Solution Building Blocks (SBBs).

## Overview

Building blocks provide reusable architecture components:

| Type | Description | Example |
|------|-------------|---------|
| **ABB** | Logical, vendor-agnostic | "API Gateway" |
| **SBB** | Physical, vendor-specific | "AWS API Gateway v2" |

## Hierarchy

```
ABB (Logical)
 └── SBB-AWS (AWS implementation)
 └── SBB-AZURE (Azure implementation)
 └── SBB-GCP (GCP implementation)
```

## Building Block Schema

All building blocks follow a standard schema with:
- Metadata (ID, name, version, status)
- Provenance tracking
- Agent hints for AI comprehension
- Traceability links

See [ABB Template](../templates/_base/abb-template.md) and [SBB Template](../templates/_base/sbb-template.md).

## Reference Building Blocks

### Integration

| ABB | Description | SBBs Available |
|-----|-------------|----------------|
| ABB-INT-001 | API Gateway | AWS, Azure, GCP |
| ABB-INT-002 | Message Queue | AWS, Azure, GCP |
| ABB-INT-003 | Event Bus | AWS, Azure, GCP |

### Data

| ABB | Description | SBBs Available |
|-----|-------------|----------------|
| ABB-DATA-001 | Relational Database | AWS, Azure, GCP |
| ABB-DATA-002 | Document Store | AWS, Azure, GCP |
| ABB-DATA-003 | Cache | AWS, Azure, GCP |

### Compute

| ABB | Description | SBBs Available |
|-----|-------------|----------------|
| ABB-COMP-001 | Container Platform | AWS, Azure, GCP |
| ABB-COMP-002 | Serverless Functions | AWS, Azure, GCP |
| ABB-COMP-003 | Kubernetes | AWS, Azure, GCP |

> **Note**: Reference building blocks are planned for future releases. Organizations can create their own using the templates.

## Contents

- `abbs/` - Architecture Building Blocks (coming soon)
- `sbbs/` - Solution Building Blocks (coming soon)
- `patterns/` - Common architecture patterns (coming soon)

## Creating Building Blocks

1. Use the appropriate template from `../templates/_base/`
2. Follow the ID convention: `ABB-{CATEGORY}-{NNN}` or `SBB-{PLATFORM}-{CATEGORY}-{NNN}`
3. Include agent hints for AI comprehension
4. Set appropriate provenance state
