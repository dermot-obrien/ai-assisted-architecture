# Programme and Initiative Architecture

When working in **Refine** mode, architecture work is organized within a programme/initiative structure. This document defines how solutions integrate with the platform architecture.

## Transformation Hierarchy

```
PROGRAMME ({CODE})                    # Multi-year strategic initiative
│
├── README.md                         # Programme overview, objectives, governance
│
└── initiatives/
    │
    └── {PROG}-{NNN}/                 # Initiative within programme
        │
        ├── scope.md                  # Initiative scope and objectives
        ├── doap.md                   # Design on a Page (executive summary)
        │
        └── solution/                 # Solution architecture
            │
            ├── 01-context/           # WHAT problem, WHY
            │   ├── index.md
            │   ├── background.md
            │   ├── doap.md
            │   └── use-cases/        # Initiative-specific use cases
            │
            ├── 02-logical-architecture/  # WHAT components, HOW they integrate
            │   ├── index.md
            │   └── SB-{INIT}/        # Solution Building Block
            │
            ├── 03-deployment-architecture/  # WHERE deployed
            │   ├── index.md
            │   ├── infrastructure.md
            │   └── network-design.md
            │
            ├── 04-security-architecture/    # Security controls
            │   ├── index.md
            │   ├── security-model.md
            │   ├── data-classification.md
            │   └── compliance-mapping.md
            │
            └── 05-decisions/         # Architecture decisions
                ├── index.md
                └── ADR-{INIT}-{NN}-*.md
```

## Naming Conventions

| Level | Format | Example |
|-------|--------|---------|
| Programme | `{CODE}` | AIP (AI Programme) |
| Initiative | `{PROG}-{NNN}` | AIP-001 |
| Solution SBB | `SB-{INIT}` | SB-AIP001 |
| Initiative ADR | `ADR-{INIT}-{NN}` | ADR-AIP-001-01 |
| Initiative Use Case | `UC-{INIT}-{NN}` | UC-AIP001-01 |

## Initiative-to-Platform Linkage

Initiatives MUST establish these links to platform artifacts:

### 1. Reference Canonical Use Cases

In `{INIT}/scope.md`:

```markdown
## Use Cases Addressed

This initiative implements the following canonical use cases:

| Use Case | Name | Coverage |
|----------|------|----------|
| [UC-001](../../../01-motivation/03-use-cases/UC-001/) | Customer Engagement | Full |
| [UC-017](../../../01-motivation/03-use-cases/UC-017/) | Operations Support | Partial |
```

### 2. Reference Platform ABBs

In `solution/02-logical-architecture/index.md`:

```markdown
## ABB References

This solution uses the following platform ABBs:

| ABB | Name | Usage |
|-----|------|-------|
| [AB-050](../../../../../03-building-blocks/.../AB-050/) | LLM Service | Text generation |
| [AB-200](../../../../../03-building-blocks/.../AB-200/) | RAG System | Document retrieval |
```

### 3. Document ABB Realization in SBB

In `solution/02-logical-architecture/SB-{INIT}/index.md`:

```markdown
## ABB Realization

| ABB ID | ABB Name | Realization % | Method | Gaps |
|--------|----------|---------------|--------|------|
| AB-050 | LLM Service | 100% | AWS Bedrock | None |
| AB-200 | RAG System | 80% | Custom | Missing caching |
| AB-112 | Security Gateway | 100% | Kong + WAF | None |
```

### 4. Create Initiative ADRs

Link to platform ADRs where applicable:

```markdown
## Related

- [Platform ADR-042](../../../../../05-governance/decisions/ADR-042.md) - Referenced
- [AB-050](../../../../../03-building-blocks/.../AB-050/) - LLM Service ABB
- [SB-AIP001](../02-logical-architecture/SB-AIP001/) - This solution's SBB
```

## Solution Viewpoints (Required)

Each solution architecture MUST include these viewpoints:

| # | Viewpoint | Primary Artifact | Purpose |
|---|-----------|------------------|---------|
| 1 | Context | DOAP, background.md | WHAT problem, WHY this solution |
| 2 | Logical | SB-{INIT}/index.md | HOW components integrate |
| 3 | Deployment | infrastructure.md | WHERE/HOW deployed |
| 4 | Security | security-model.md | Access, data protection, compliance |
| 5 | Decisions | ADR-{INIT}-*.md | WHY these choices |

## Solution-to-Platform Traceability

In the SBB document, include a Platform Alignment section:

```markdown
## Platform Alignment

### ABB Realization
[Table showing ABB coverage - see above]

### Capability Support
| Capability | How Supported |
|------------|---------------|
| [CAP-L2-GEN-01-01](../../../../../02-capabilities/...) | LLM invocation via Bedrock |

### Bounded Context
This solution operates within the **Customer** bounded context (BC-001).
```

## Initiative Lifecycle Checklists

**When Starting an Initiative**:
- [ ] Create initiative folder under programme
- [ ] Reference canonical use cases in scope
- [ ] Identify required platform ABBs
- [ ] Document programme dependencies (if any)
- [ ] Identify bounded context the solution operates within

**When Defining Solution Architecture**:
- [ ] Create solution folder structure (01-context through 05-decisions)
- [ ] Create DOAP for executive summary
- [ ] Document initiative-specific use cases with realization
- [ ] Create SBB with ABB realization mapping
- [ ] Document deployment architecture
- [ ] Document security architecture
- [ ] Create ADRs for significant decisions

**When Completing an Initiative**:
- [ ] Verify all ABB realizations documented
- [ ] Verify all decisions have ADRs
- [ ] Update platform ABBs if gaps identified
- [ ] Update capability model if new capabilities introduced
- [ ] Document lessons learned for methodology improvement
