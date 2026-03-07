---
document_type: standards
title: "Architecture Building Block (ABB) — Draw.io Diagram Standard"
classification: internal
version: 2.0
status: approved
created: 2024-10-01
last_modified: 2026-03-08
owner: "Architecture Team"
triggers:
  - "Designing or modifying ABB architecture diagrams"
  - "Visualising logical capabilities and interfaces"
  - "Reviewing ABB traceability"
---

# Architecture Building Block (ABB) — Draw.io Diagram Standard

This standard defines the visual conventions, structure, and Draw.io XML format for ABB component diagrams. Every ABB diagram MUST follow these conventions. All colours are referenced by their identifier from the [Visual Design Standards](../../visual-design/visual-design-standard.md) — never by hex code. This decouples the ABB standard from any specific brand palette.

The 960 x 1080 canvas is sized to occupy the **left half** of a standard 1920 x 1080 presentation slide, with the right half reserved for the building block summary panel (see the ABB Document Standard).

---

## File Format

- **Format:** Draw.io XML (`.drawio`)
- **Export:** PNG (`.png`) at **300 DPI**, white background
- **Canvas:** 960 x 1080, background `1.4`, grid enabled (10px), margins 40-50px
- **Font family:** Helvetica throughout (fallback: Arial, sans-serif)

---

## Diagram Layout

### Hierarchy & "Whimsy" Rule

To align with the brand identity, the following elements MUST use **rounded corners (arcSize=5)**:
1. **ABB Boundary**
2. **Sub-ABB Group Boxes**
3. **Level 1 (Primary) Components**

### Overall Structure

```
+---------------------------------------------------------------+
|  ABB Boundary (arcSize=5)                                     |
|  Label: "ABB: <ABB Name>"                                     |
|                                                               |
|  +------------------+  +------------------+                   |
|  | Sub-ABB 1        |  | Sub-ABB 2        |   External Actor  |
|  | (arcSize=5)      |  | (arcSize=5)      |   (ellipse)       |
|  |  [Component]     |  |  [Component]     |                   |
|  +------------------+  +------------------+                   |
|                                                               |
|  +------------------+  +------------------+  +-------------+  |
|  | IAM              |  | Observability    |  | Governance & |  |
|  | (mandatory)      |  | (mandatory)      |  | Policy       |  |
|  |  [Component]     |  |  [Component]     |  | (mandatory)  |  |
|  +------------------+  +------------------+  +-------------+  |
+---------------------------------------------------------------+
Legend
```

### Mandatory Cross-Cutting Sub-ABBs

Every ABB diagram MUST include the following three sub-ABB groups. They appear as cross-cutting containers at the bottom of the diagram (or in a position that visually separates them from the domain-specific sub-ABBs). Each mandatory sub-ABB group contains one or more components describing how the ABB addresses that concern.

| Mandatory Sub-ABB | Group Label | Stroke Colour | Label Fill | Label Text |
|-------------------|------------|---------------|------------|------------|
| Identity & Access Management | `ABB: IAM` | `2.1` | `2.1` | `1.4` |
| Observability | `ABB: Observability` | `2.4` | `2.4` | `1.2` |
| Governance & Policy Enforcement | `ABB: Governance & Policy` | `2.5` | `2.5` | `1.4` |

Components inside these sub-ABBs follow the standard Level 1 / Level 2 colour roles. Identity-linked components use stroke `2.1`; policy-linked components use stroke `2.5`.

**Rationale:** TOGAF mandates security and manageability for every building block. NIST CSF 2.0 elevated Governance to a cross-cutting function. Zero Trust (NIST SP 800-207) requires verifiable identity for every resource. All cloud Well-Architected Frameworks treat these as non-negotiable pillars.

---

## Colour Assignments (Tokens)

| Element Type | Fill | Stroke | Text |
|-------------|------|--------|------|
| ABB Boundary | none | `1.1` | `1.4` on `1.1` badge |
| Level 1 — Primary | `1.1` | `3.1` | `1.4` |
| Level 2 — Secondary | `1.3.2` | `3.2` | `3.1` |
| Level 2 — Adapter | `3.3` | `3.1` | `3.1` |
| Observability — Primary | `2.4` | `3.1` | `1.2` |
| Observability — Secondary | `2.4.2` | `3.2` | `3.1` |
| Sub-ABB Background | `3.4` | `1.1` | — |
| IAM Sub-ABB Background | `3.4` | `2.1` | — |
| Observability Sub-ABB Background | `3.4` | `2.4` | — |
| Governance Sub-ABB Background | `3.4` | `2.5` | — |
| External Actor (ellipse) | `1.1` | none | `1.4` |
| Legend Background | `3.4` | `3.3` | — |

### Edge (Arrow/Connector) Colours

| Edge Type | Colour | Style | Usage |
|-----------|--------|-------|-------|
| Outbound flow | `1.1` | Solid, 2px, open arrow | Primary data flow outward |
| Inbound flow | `2.3` | Solid, 2px, open arrow | Response/return data flow |
| Identity/authentication | `2.1` | Dashed (`1 1`), 2px, open arrow | Token exchange, identity binding |
| Policy enforcement | `2.5` | Dashed (`1 2`), 2px, open arrow | Policy evaluation and enforcement |
| Internal dependency | `3.1` | Solid, 2px, open arrow | Component-to-component within a sub-ABB |
| Observability connector | `2.4` | Dashed (`1 1`), 2px | Event streams to observability (uses badge pairs) |

### Horizontal Rules Inside Components

| Component Fill | HR Colour |
|---------------|-----------|
| `1.1` | `1.1.2` |
| `2.4` | `1.1` |
| All others | `3.3` |

---

## Observability Connectors

When components feed data to the Observability sub-ABB, use **badge pairs** instead of long crossing arrows:

1. Place a small circle (badge) at the **source** component with a letter (A, B, C, etc.)
2. Place a matching circle (badge) at the **target** (observability) side with the same letter
3. A short dashed stub connects the source component to its badge

Badge style: fill `2.4`, text `1.2`, size 22x22.

---

## Legend

A legend box MUST appear at the bottom of the diagram. It includes:

- **Colour swatches** for each element type (Level 1, Level 2, Adapter, Observability primary/secondary)
- **Arrow samples** for each edge type (Outbound, Inbound, Identity, Policy, Internal)
- **Stroke samples** for special borders (Identity-linked, Policy-linked, Governance-linked)
- **Badge sample** for observability connectors

---

## Naming Conventions

- **Cell IDs:** Use descriptive kebab-case IDs (e.g. `agent-abb`, `msg-routing`, `e-orch-reason`)
- **Edge IDs:** Prefix with `e-` for internal edges, `i<N>-` for interface edges (e.g. `i1-out`, `e-rec-audit`)
- **Badge IDs:** `conn-<letter>-badge-src` and `conn-<letter>-badge-tgt`
- **Legend IDs:** Prefix with `leg-`

---

## AI Agent Self-Verification Checklist

Before finalising an ABB diagram, verify:

1. [ ] **Token Resolution**: Did you resolve IDs like `1.3.2` using the Visual Design Standard?
2. [ ] **Whimsy Applied**: Are boundaries and Level 1 components set to `arcSize=5`?
3. [ ] **Mandatory Sub-ABBs**: Does the diagram include IAM (`2.1` stroke), Observability (`2.4` stroke), and Governance & Policy (`2.5` stroke) sub-ABB groups?
4. [ ] **Colour Independence**: Do semantic indicators (Success/Error) have text labels (e.g. [OK])?
5. [ ] **Canvas Specs**: Is the background set to `1.4` and the grid to 10px?
6. [ ] **Traceability**: Does every component in the diagram match the ABB's capability list?
7. [ ] **Accessibility**: Is all text on Purple (`1.1`) or Void (`1.2`) set to White (`1.4`)?
8. [ ] **Legend**: Does the legend include swatches for all three mandatory sub-ABB stroke colours?

---

## Quick Reference Style Snippet (Agent)

**Primary Component:**
`style="rounded=1;arcSize=5;fillColor=/*1.1*/;strokeColor=/*3.1*/;fontColor=/*1.4*/;strokeWidth=2;"`

**ABB Boundary:**
`style="rounded=1;arcSize=5;fillColor=none;strokeColor=/*1.1*/;strokeWidth=2;"`

**IAM Sub-ABB Group:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.1*/;strokeWidth=2;"`

**Observability Sub-ABB Group:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.4*/;strokeWidth=2;"`

**Governance & Policy Sub-ABB Group:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.5*/;strokeWidth=2;"`
