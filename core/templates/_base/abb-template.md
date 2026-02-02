---
apiVersion: aiaa/v1
kind: ArchitectureBuildingBlock
metadata:
  id: ABB-XXX
  name: "{Building Block Name}"
  version: "1.0.0"
  status: draft
  
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# ABB-XXX: {Building Block Name}

## Summary

{One paragraph description of this building block}

## Purpose

{Why this building block exists and what problem it solves}

## Capabilities Realized

| Capability ID | Capability Name | Contribution |
|---------------|-----------------|--------------|
| CAP-XXX | {Capability} | Primary/Supporting |

## Interfaces

### Provided Interfaces

| Interface | Type | Description |
|-----------|------|-------------|
| {Name} | REST/Event/gRPC | {What it exposes} |

### Consumed Interfaces

| Interface | Type | Description |
|-----------|------|-------------|
| {Name} | REST/Event/gRPC | {What it needs} |

## Quality Attributes

| Attribute | Requirement | Notes |
|-----------|-------------|-------|
| Availability | {e.g., 99.9%} | |
| Latency | {e.g., <100ms p99} | |
| Throughput | {e.g., 1000 TPS} | |
| Scalability | {e.g., Horizontal} | |

## Constraints

- {Constraint 1}
- {Constraint 2}

## Patterns

| Pattern ID | Pattern Name | Relationship |
|------------|--------------|--------------|
| PAT-XXX | {Pattern} | Implements/Uses |

## SBB Realizations

| SBB ID | Platform | Status |
|--------|----------|--------|
| SBB-AWS-XXX | AWS | Available |
| SBB-AZURE-XXX | Azure | Available |
| SBB-GCP-XXX | GCP | Planned |

## Agent Hints

```yaml
agent_hints:
  selection_criteria: |
    Use this ABB when the solution requires {criteria}.
    Consider this for {use cases}.
    
  composition_notes: |
    Typically paired with:
    - ABB-YYY for {scenario}
    - ABB-ZZZ for {scenario}
    
  common_mistakes: |
    Do not use for {anti-pattern}.
    Avoid {common error}.
```

## Related Building Blocks

| ABB ID | Name | Relationship |
|--------|------|--------------|
| ABB-YYY | {Name} | {Relationship} |

## References

- {Reference 1}
- {Reference 2}

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | {DATE} | {Author} | Initial version |
