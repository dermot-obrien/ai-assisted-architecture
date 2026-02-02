# Cross-Programme Dependencies

When a programme or platform depends on other programmes or platforms, document these dependencies explicitly. This enables coordination and risk management.

## Dependency Types

| Type | Description | Example |
|------|-------------|---------|
| **depends_on** | This programme requires another | AI Programme depends on Cloud Programme |
| **depended_by** | Another programme requires this | Operations depends on AI Programme |
| **integrates_with** | Mutual integration | AI Programme integrates with Data Programme |

## Documenting Programme Dependencies

In Programme `README.md`:

```markdown
## Programme Dependencies

### Depends On (Required Foundations)

| Programme | Dependency Type | What We Need | Status |
|-----------|-----------------|--------------|--------|
| Cloud Programme | Infrastructure | Kubernetes clusters, networking | Active |
| Data Programme | Data Platform | Feature store, data lake | Active |
| Security Programme | Security | IAM, encryption, compliance | Active |

### Depended By (Downstream Consumers)

| Programme | Dependency Type | What They Need | Status |
|-----------|-----------------|----------------|--------|
| Customer Experience | AI Services | LLM APIs, personalization | Planned |
| Operations | AI Services | Automation, analytics | Planned |

### Integrates With (Peer Collaboration)

| Programme | Integration Point | Pattern |
|-----------|-------------------|---------|
| Data Programme | Feature Store | Customer-Supplier |
| Security Programme | Identity | Published Language |
```

## Cross-Programme Integration Patterns

Use DDD context mapping patterns at programme level:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Customer-Supplier** | One programme provides, another consumes | Data (supplier) → AI (customer) |
| **Partnership** | Mutual development commitment | AI ↔ Cloud co-development |
| **Published Language** | Standard interfaces | Security publishes IAM contracts |
| **Anti-Corruption Layer** | Protect from external changes | Legacy → Modern (via ACL) |

## Cross-Architecture Dependencies

For platform-level dependencies, use the template at `core/templates/platform-dependencies.yaml`.

**Location**: `02-capabilities/platform-dependencies.yaml`

## Visualizing Dependencies

```
                    ┌─────────────────────────────────────┐
                    │          Security Platform          │
                    │    (IAM, Encryption, Compliance)    │
                    └─────────────────────────────────────┘
                                      │
                                      │ Published Language
                                      ▼
┌──────────────┐    Partnership    ┌──────────────────────┐
│    Cloud     │◄─────────────────►│                      │
│   Platform   │                   │    Your Platform     │
│              │   Customer-       │    Architecture      │
│  (K8s, VPC)  │   Supplier        │                      │
└──────────────┘         │         │  (LLM, RAG, Agents)  │
                         │         │                      │
                         ▼         └──────────────────────┘
              ┌──────────────┐              │
              │    Data      │              │ Open Host Service
              │   Platform   │              ▼
              │              │    ┌──────────────────────┐
              │ (Feature     │    │   Downstream         │
              │  Store, Lake)│    │   Platform           │
              └──────────────┘    └──────────────────────┘
```

## Future: Git Submodule Approach

For mature organizations with multiple platform architectures, dependencies could be managed via Git submodules:

```
your-platform-architecture/
├── .gitmodules
├── dependencies/
│   ├── cloud-platform/       # Git submodule
│   │   └── 02-capabilities/  # Only capabilities exposed
│   ├── data-platform/        # Git submodule
│   │   └── 02-capabilities/
│   └── security-platform/    # Git submodule
│       └── 02-capabilities/
```

**Benefits**:
- Single source of truth for dependent platform capabilities
- Version-controlled dependencies
- Automated sync of capability changes
- Clear ownership boundaries

**Recommendation**: Document dependencies as YAML (as shown above) initially. Revisit Git submodule approach when multiple platforms have standardized their architecture repositories.
