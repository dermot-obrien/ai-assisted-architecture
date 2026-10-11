---
document_type: standards
title: "Strategy Standard (Outcomes & Use Cases)"
classification: internal
version: 1.0
status: draft
created: 2026-03-07
last_modified: 2026-09-26
owner: "Architecture Team"
triggers:
  - "Defining new business outcomes"
  - "Creating operational use cases"
  - "Justifying architectural investment"
---

# Strategy Standard (Outcomes & Use Cases)

This standard defines the structure and metadata for **Business Outcomes** and **Use Cases**.

## 1. File Structure
Each element is a folder named by its identifier:
```
strategy/
  outcomes/
    OC-001/
      index.md
  use-cases/
    UC-001/
      index.md
```

## 2. Business Outcomes (The "Why")

An Outcome is a measurable business result. It represents the "North Star" for a specific initiative.

### 2.1 Outcome Metadata
| Property | Value | Notes |
| :--- | :--- | :--- |
| **Outcome ID** | `OC-NNN` | Unique ID (e.g., `OC-001`). |
| **Name** | Outcome Name | Clear, result-oriented name. |
| **Measure** | KPI / Metric | How success will be quantified. |
| **Target Date** | YYYY-MM-DD | Optional (recommended). When the outcome is expected to be achieved. Catalogued or seed outcomes are frequently undated until a platform commits to a horizon — leave unset rather than fabricate a date (matches `outcome.schema.json`, where `target_date` is optional). |

### 2.2 Outcome Format
Every Outcome must be documented with:
- **Definition**: A clear statement of the desired state.
- **Business Rationale**: Why this result matters to the organisation.
- **Platform Ownership**: Link to the **Platform (`PL-NNN`)** accountable for delivering it.
- **Traceability**: Link to the **Capabilities** required to deliver it.

### 2.3 Outcome Measures as Criteria
An outcome's measures are what planning and design are judged against, so each one is given an identifier that other artefacts can cite. List them in the optional `measures[]` front matter, one entry per measure:

```yaml
kpi: "Share of orders taken without manual rework"
measures:
  - { id: OC-001-M1, measure: "Orders taken without manual rework", target: 95, unit: "%" }
  - { id: OC-001-M2, measure: "Median time from request to confirmed order", target: 2, unit: "minutes" }
```

| Field | Rule |
|---|---|
| `id` | `<outcome id>-M<n>`, numbered from 1 within the outcome. Stable once cited: a retired measure keeps its number and the next one takes a new number. |
| `measure` | What is measured, stated so a reader knows where the number comes from. |
| `target` | The value that counts as achieved. |
| `unit` | The unit of `target`. |

The `kpi` and `kpi_target` fields remain the outcome's headline measure. The headline measure is normally also `M1`.

Planning cites these identifiers as `advances_criterion_ids` on a piece of work, to say which measures it moves. A consideration may list them in its `criteria` where an outcome measure is what decides between the options. A citation of an identifier that no outcome declares is a broken link, not a free-text criterion.


## 3. Use Cases (The "How it's Used")

A Use Case describes a specific operational scenario where actors interact with the system to achieve a goal.

### 3.1 Use Case Metadata
| Property | Value | Notes |
| :--- | :--- | :--- |
| **Use Case ID** | `UC-NNN` | Unique ID (e.g., `UC-001`). |
| **Primary Actor**| Actor Name | The person or system initiating the case. |
| **Parent Outcome**| `OC-NNN` | The strategic goal this use case supports. |

### 3.2 Use Case Format
Every Use Case must include:
- **Scenario**: A narrative description of the interaction.
- **Pre-conditions**: What must be true before the case starts.
- **Success Criteria**: What "done" looks like for this scenario.
- **Realisation**: Link to the **ABBs** that provide the logical components for the case.


## AI Agent Self-Verification Checklist

1. [ ] **Measurability**: Does the Outcome include a concrete, quantifiable measure?
2. [ ] **Addressable Measures**: Does each measure have an `OC-NNN-M<n>` identifier in `measures[]`, with no identifier reused?
3. [ ] **Traceability**: Does the Use Case link back to a valid Outcome ID?
4. [ ] **Ownership**: Is the Outcome assigned to a Platform (`PL-NNN`)?
5. [ ] **Naming**: Does the ID follow the `OC-` or `UC-` prefix rule?
