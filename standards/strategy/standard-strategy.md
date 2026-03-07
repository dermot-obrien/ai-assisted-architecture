---
document_type: standards
title: "Strategy Standard (Outcomes & Use Cases)"
classification: internal
version: 1.0
status: draft
created: 2026-03-07
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Defining new business outcomes"
  - "Creating operational use cases"
  - "Justifying architectural investment"

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
| **Target Date** | YYYY-MM-DD | When the outcome is expected to be achieved. |

### 2.2 Outcome Format
Every Outcome must be documented with:
- **Definition**: A clear statement of the desired state.
- **Business Rationale**: Why this result matters to the organisation.
- **Platform Ownership**: Link to the **Platform (`PL-NNN`)** accountable for delivering it.
- **Traceability**: Link to the **Capabilities** required to deliver it.


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
2. [ ] **Traceability**: Does the Use Case link back to a valid Outcome ID?
3. [ ] **Ownership**: Is the Outcome assigned to a Platform (`PL-NNN`)?
4. [ ] **Naming**: Does the ID follow the `OC-` or `UC-` prefix rule?
