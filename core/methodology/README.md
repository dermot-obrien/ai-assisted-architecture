# Methodology

End-to-end architecture methodology for AI-assisted architecture practice.

## Overview

The AI-Assisted Architecture methodology provides a structured approach from enterprise context through solution design:

```
Enterprise Context → Capability Modeling → ABBs → SBBs → Solution Design
```

## Methodology Phases

| Phase | Focus | AI Role |
|-------|-------|---------|
| **1. Enterprise Context** | Vision, drivers, constraints | Research synthesis |
| **2. Capability Modeling** | L0→L1→L2 hierarchy | Gap analysis |
| **3. Architecture Building Blocks** | Logical architecture | Pattern selection |
| **4. Solution Building Blocks** | Vendor-specific design | Implementation options |
| **5. Solution Design** | Integration, deployment | Draft generation |
| **6. Governance & Review** | Quality assurance | Consistency checks |

## Key Principles

1. **Augmentation, not automation** - AI assists, humans decide
2. **Transparency** - Clear provenance for all AI-assisted content
3. **Governance-first** - Controls built into the methodology
4. **Platform-agnostic** - Works with multiple AI tools

## Contents

### Architecture Work Guidance

- [Architecture Modes](architecture-modes.md) - Anticipate vs Refine modes for architecture work
- [Bounded Contexts](bounded-contexts.md) - Domain boundary definitions using DDD concepts
- [Programme/Initiative Architecture](programme-initiative-architecture.md) - Transformation hierarchy and solution viewpoints
- [Cross-Programme Dependencies](cross-programme-dependencies.md) - Inter-platform coordination

### Templates

See `../templates/` for reusable templates:
- `bounded-context.yaml` - Bounded context definition
- `platform-dependencies.yaml` - Cross-platform dependency documentation

## Related Documentation

- [Philosophy](../../docs/methodology/philosophy.md)
- [Getting Started](../../docs/getting-started/)
