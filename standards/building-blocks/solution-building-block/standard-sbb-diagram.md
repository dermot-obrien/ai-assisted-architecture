---
document_type: standards
title: "Solution Building Block (SBB) — Draw.io Diagram Standard"
classification: internal
version: 2.0
status: approved
created: 2024-10-01
last_modified: 2026-03-08
owner: "Architecture Team"
triggers:
  - "Designing or modifying SBB implementation diagrams"
  - "Mapping products / services to ABB capabilities"
  - "Reviewing vendor / platform solution boundaries"
---

# Solution Building Block (SBB) — Draw.io Diagram Standard

This standard defines the visual conventions for SBB diagrams and **extends** the [ABB Diagram Standard](../architecture-building-block/standard-abb-diagram.md). All ABB styles apply unless overridden here.

---

## Canvas

SBB diagrams use the same canvas dimensions as ABB diagrams: **960 x 1080**, background `1.4`, grid 10px, margins 40-50px. This half-slide format allows the diagram to sit alongside a summary panel in a standard 1920 x 1080 presentation.

---

## SBB-Specific Hierarchy

### Traceability (The ABB Ref Badge)

Every product/service component in an SBB diagram MUST feature an **ABB Reference Badge** in the top-right corner.
- **Badge Fill**: `1.1.3`
- **Badge Stroke**: `1.1`
- **Badge Text**: `1.1`, Size 8pt

### Vendor/Platform Containers

Group product components by their platform (e.g., AWS, Azure, On-Prem).
- **Primary Platform**: Stroke `1.1`, Label Fill `1.1`, Text `1.4`
- **Secondary Platform**: Stroke `2.3`, Label Fill `2.3`, Text `1.2`

### Mandatory Cross-Cutting Containers

Every SBB diagram MUST include containers for the three mandatory cross-cutting concerns, realising the parent ABB's mandatory sub-ABBs with specific products. These containers use the same stroke colours as their ABB counterparts to maintain visual traceability.

| Mandatory Container | Label Example | Stroke | Label Fill | Label Text |
|--------------------|---------------|--------|------------|------------|
| Identity & Access Management | `Microsoft Entra ID` or `AWS IAM` | `2.1` | `2.1` | `1.4` |
| Observability & Audit | `CloudWatch + Purview` or `Datadog` | `2.4` | `2.4` | `1.2` |
| Governance & Policy Enforcement | `Conditional Access + OPA` | `2.5` | `2.5` | `1.4` |

The container label names the **specific vendor/product**, not the abstract concern. The stroke colour identifies the cross-cutting category.

Components inside these containers follow standard Level 1 / Level 2 colour roles and MUST have ABB ref badges tracing to the parent ABB's cross-cutting components.

---

## SBB Colour Assignments (Tokens)

| Element Type | Fill | Stroke | Text |
|-------------|------|--------|------|
| SBB Boundary | none | `1.1` | `1.4` on `1.1` badge |
| Product Component (L1) | `1.1` | `3.1` | `1.4` |
| Product Component (L2) | `1.3.2` | `3.2` | `3.1` |
| Adapter / Boundary | `3.3` | `3.1` | `3.1` |
| External System | `1.2` | `1.1` | `1.4` |
| ABB Ref Badge | `1.1.3` | `1.1` | `1.1` |
| Observability — Primary | `2.4` | `3.1` | `1.2` |
| Observability — Secondary | `2.4.2` | `3.2` | `3.1` |
| IAM Container Background | `3.4` | `2.1` | — |
| Observability Container Background | `3.4` | `2.4` | — |
| Governance Container Background | `3.4` | `2.5` | — |
| Identity-linked stroke override | — | `2.1` | — |
| Policy-linked stroke override | — | `2.5` | — |

---

## AI Agent Self-Verification Checklist

Before finalising an SBB diagram, verify:

1. [ ] **ABB Traceability**: Does every product component have an `ABB: <Name>` reference badge?
2. [ ] **Platform Grouping**: Are components correctly grouped by Vendor/Platform containers?
3. [ ] **Mandatory Cross-Cutting**: Does the diagram include IAM (`2.1` stroke), Observability (`2.4` stroke), and Governance & Policy (`2.5` stroke) containers with specific products?
4. [ ] **Whimsy Check**: Are L1 product components and boundaries set to `arcSize=5`?
5. [ ] **External Systems**: Are non-SBB systems styled with `1.2` (Void) fill and `1.4` text?
6. [ ] **Token Accuracy**: Did you use the `.3` suffix for 20% tints (e.g. `1.1.3`)?
7. [ ] **Legend**: Does the legend include ABB Ref Badge, Platform container swatches, and all three cross-cutting container stroke colours?

---

## Quick Reference Style Snippet (Agent)

**ABB Ref Badge:**
`style="rounded=1;arcSize=2;fillColor=/*1.1.3*/;strokeColor=/*1.1*/;fontColor=/*1.1*/;fontSize=8;"`

**External System:**
`style="rounded=1;arcSize=8;fillColor=/*1.2*/;strokeColor=/*1.1*/;fontColor=/*1.4*/;align=center;"`

**IAM Container:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.1*/;strokeWidth=2;"`

**Observability Container:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.4*/;strokeWidth=2;"`

**Governance & Policy Container:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.5*/;strokeWidth=2;"`
