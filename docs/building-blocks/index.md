# Building Blocks

Reusable architecture and solution building blocks.

## Overview

Building blocks are the fundamental components of solutions:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Building Block Hierarchy                               │
└─────────────────────────────────────────────────────────────────────────────────┘

   Capabilities              ABBs                    SBBs
       │                       │                       │
       │                       │                       │
   ┌───┴───┐              ┌────┴────┐            ┌────┴────┐
   │ What  │              │  How    │            │  With   │
   │ the   │  ──────────► │  (Logic)│ ─────────► │  What   │
   │business│              │         │            │(Vendor) │
   │ needs │              │         │            │         │
   └───────┘              └─────────┘            └─────────┘
   
   "Customer    →   "API Gateway"   →   "AWS API Gateway"
    Channel"                             "Azure API Mgmt"
                                         "Kong on K8s"
```

## ABB vs SBB

| Aspect | ABB | SBB |
|--------|-----|-----|
| **Nature** | Logical, conceptual | Physical, concrete |
| **Vendor** | Agnostic | Specific |
| **Stability** | Stable over time | Evolves with technology |
| **Purpose** | Define what's needed | Define how to build |

## Building Block Libraries

### ABB Library (Planned)

Reference Architecture Building Blocks will include:

- API Gateway
- Event Broker
- Identity Provider
- Vector Database
- And more...

### SBB Library (Planned)

Solution Building Blocks by platform:

- AWS implementations
- Azure implementations
- GCP implementations

> **Note**: Reference building blocks are planned for future releases. Organizations can create their own using the templates in `core/templates/_base/`.

## Agent Integration

Building blocks include metadata for AI agents:

```yaml
agent_hints:
  selection_criteria: |
    Use this ABB when...
  composition_notes: |
    Typically paired with...
  common_mistakes: |
    Do not use for...
```

See the ABB and SBB templates in `core/templates/_base/` for the full schema.

## Using Building Blocks

### 1. Identify Capabilities

Start with the capabilities you need to enable.

### 2. Select ABBs

Choose ABBs that realize those capabilities.

### 3. Map to SBBs

Select SBBs for your target platform.

### 4. Compose Solution

Combine SBBs into a solution design.

## Contributing Building Blocks

See [CONTRIBUTING.md](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/CONTRIBUTING.md) for how to add new building blocks.
