---
apiVersion: aiaa/v1
kind: SolutionBuildingBlock
metadata:
  id: SBB-{PLATFORM}-XXX
  name: "{Implementation Name}"
  version: "1.0.0"
  platform: aws | azure | gcp | on-premise
  status: draft
  
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# SBB-{PLATFORM}-XXX: {Implementation Name}

## Summary

{One paragraph description of this SBB}

## Realizes

| ABB ID | ABB Name |
|--------|----------|
| ABB-XXX | {ABB this implements} |

## Platform

- **Cloud Provider**: {AWS/Azure/GCP/On-Premise}
- **Services Used**: {Primary services}
- **Region Availability**: {Regions}

## Components

| Component | Service | Purpose |
|-----------|---------|---------|
| {Name} | {e.g., AWS Lambda} | {Purpose} |
| {Name} | {e.g., AWS API Gateway} | {Purpose} |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     {SBB Architecture Diagram}                   │
│                                                                  │
│   {Describe or illustrate the component architecture}            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Infrastructure as Code

```terraform
# Example Terraform snippet
resource "{resource_type}" "{name}" {
  # Configuration
}
```

### Key Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| {Setting} | {Value} | {Description} |

## Dependencies

### Service Dependencies

| Service | Purpose | Required |
|---------|---------|----------|
| {Service} | {Purpose} | Yes/No |

### Network Requirements

| Requirement | Description |
|-------------|-------------|
| {Requirement} | {Description} |

## Security

### Authentication

{How authentication is handled}

### Authorization

{How authorization is handled}

### Encryption

| Data State | Encryption |
|------------|------------|
| At Rest | {e.g., AES-256} |
| In Transit | {e.g., TLS 1.3} |

## Operations

### Monitoring

| Metric | Service | Alert Threshold |
|--------|---------|-----------------|
| {Metric} | {e.g., CloudWatch} | {Threshold} |

### Logging

| Log Type | Destination | Retention |
|----------|-------------|-----------|
| {Type} | {Destination} | {Days} |

### Backup & Recovery

| Aspect | Configuration |
|--------|---------------|
| Backup Frequency | {Frequency} |
| Retention | {Period} |
| RTO | {Time} |
| RPO | {Time} |

## Cost Estimation

| Component | Estimated Monthly Cost | Notes |
|-----------|----------------------|-------|
| {Component} | ${Amount} | {Notes} |
| **Total** | **${Total}** | |

## Agent Hints

```yaml
agent_hints:
  when_to_use: |
    Choose this SBB for {platform} deployments when {criteria}.
    
  alternatives: |
    Consider SBB-{OTHER}-XXX for {other platform}.
    
  gotchas: |
    Be aware of {limitation}.
    Watch out for {common issue}.
```

## References

- {Vendor documentation link}
- {Best practices guide}

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | {DATE} | {Author} | Initial version |
