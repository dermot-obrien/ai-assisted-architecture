---
document_type: standards
title: "Architecture Building Block (ABB) — Draw.io Diagram Standard"
classification: internal
version: 1.0
status: draft
created: 2024-10-01
last_modified: 2026-03-07
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
- **Canvas:** 960 x 1080, background `1.3`, grid enabled (10px), margins 40-50px
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
+---------------------------------------------------+
|  ABB Boundary                                     |
|  Label: "ABB: <ABB Name>"                         |
|                                                   |    +-----------+
|  +------------+  +------------+  +------------+   |    | External  |
|  | Domain     |  | Domain     |  | Domain     |   |<-->| Actor 1   |
|  | Group 1    |  | Group 2    |  | Group 3    |   |    +-----------+
|  | [Comp]     |  | [Comp]     |  | [Comp]     |   |
|  | [Comp]     |  | [Comp]     |  | [Comp]     |   |    +-----------+
|  +------------+  +------------+  +------------+   |--->| External  |
|                                                   |    | Actor 2   |
|  +--------------------------------------------+   |    +-----------+
|  | Spanning Group (optional)                   |   |
|  | [Comp]  [Comp]  [Comp]                     |   |    +-----------+
|  +--------------------------------------------+   |--->| External  |
|                                                   |    | Actor 3   |
|  +-----------------+  +-----------------------+   |    +-----------+
|  | IAM (mandatory) |  | Observability         |   |
|  | [Comp]  [Comp]  |  | (mandatory)           |   |
|  +-----------------+  | [Comp]  [Comp]        |   |
|                        +-----------------------+   |
+---------------------------------------------------+
+---------------------------------------------------+
| Legend                                             |
+---------------------------------------------------+
```

**Key layout rules:**
- **External actors** are placed OUTSIDE the ABB boundary on the **right side**, vertically stacked. They are 100x90px ellipses with `fontSize=14` bold labels. Never place actors at the top or inside the boundary.
- **Domain groups** are arranged as columns (2-4 columns depending on the ABB's component count). An optional spanning group may sit below the columns.
- **Cross-cutting sub-ABBs** sit at the bottom of the boundary, above the legend.
- **Legend** sits below the ABB boundary.
- **Interface edges** connect external actors to components using `edgeStyle=orthogonalEdgeStyle;rounded=1;` with explicit routing points to avoid crossings.

### Mandatory Cross-Cutting Sub-ABBs

Every ABB diagram MUST include the following three sub-ABB groups. They appear as cross-cutting containers at the bottom of the diagram (or in a position that visually separates them from the domain-specific sub-ABBs). Each mandatory sub-ABB group contains one or more components describing how the ABB addresses that concern.

| Mandatory Sub-ABB | Group Label | Stroke Colour | Label Fill | Label Text |
|-------------------|------------|---------------|------------|------------|
| Identity & Access Management | `ABB: IAM` | `2.1` | `2.1` | `1.3` |
| Observability | `ABB: Observability` | `2.4` | `2.4` | `1.1` |
| Governance & Policy Enforcement | `ABB: Governance & Policy` | `2.5` | `2.5` | `1.1` |

Components inside these sub-ABBs follow the standard Level 1 / Level 2 colour roles. Identity-linked components use stroke `2.1`; policy-linked components use stroke `2.5`.

**Rationale:** TOGAF mandates security and manageability for every building block. NIST CSF 2.0 elevated Governance to a cross-cutting function. Zero Trust (NIST SP 800-207) requires verifiable identity for every resource. All cloud Well-Architected Frameworks treat these as non-negotiable pillars.

---

## Component Content

Every component box MUST contain structured content — not just a name. A component box that shows only a title without a description is non-compliant. This ensures diagrams are self-documenting and consistent across all ABBs.

### Component Box Structure

Each component box contains three elements in order:

1. **Title.** Bold component name (e.g. `<b>Policy Authoring</b>`).
2. **Horizontal rule.** Visual separator (colour per HR table in Colour Assignments below).
3. **Description.** One-to-two sentence summary of the component's responsibility.

This structure applies to ALL component levels: Level 1 Primary, Level 2 Secondary, and cross-cutting sub-ABB components. No exceptions.

### Component Box Sizing

| Component Type | Font Size | Min Height | Text Alignment |
|---------------|-----------|------------|----------------|
| Level 1 Primary | `fontSize=11` | 80px | `verticalAlign=top;spacingTop=10;spacingLeft=10;align=left;` |
| Level 2 Secondary | `fontSize=11` | 80px | `verticalAlign=top;spacingTop=8;spacingLeft=10;align=left;` |
| Cross-cutting sub-ABB | `fontSize=10` | 65px | `verticalAlign=top;spacingTop=8;spacingLeft=10;align=left;` |

### Interface Labels

Interface labels on edges MUST be descriptive, not bare identifiers. Format: `<b>I1</b>  Description` (e.g. `<b>I1</b>  Policy query`, `<b>I7</b>  Compliance reports`). Colour-code label text to match edge type (outbound uses `1.1`, inbound uses `2.3`, identity uses `2.1`, policy uses `2.5`).

---

## Colour Strategy

### Reserved Colours (Core Cross-Cutting ABBs Only)

The three mandatory cross-cutting ABBs have **reserved** colour assignments. These colours are used when they appear as sub-ABB groups inside other ABB diagrams, and also as the primary palette in their own component diagrams:

| ABB | Role | Primary | 50% Tint | Usage |
|-----|------|---------|----------|-------|
| AB-001 Identity & Access Management | `2.1` Indigo | `#4B5BAA` | `#A5ADD4` | Sub-ABB stroke, badge, identity edges |
| AB-002 Observability | `2.4` Wisteria | `#9B72CF` | `#CDB9E7` | Sub-ABB stroke, badge, observability edges |
| AB-003 Governance & Policy Enforcement | `2.5` Mauve | `#B86B9A` | `#DCB5CD` | Sub-ABB stroke, badge, policy edges |

These three colours are **permanently reserved** and MUST NOT be used as the primary palette for any other ABB.

### Default Palette (All Other ABBs)

All ABBs other than the three core cross-cutting ABBs use the **standard default palette** defined in the table below. Do NOT assign unique colours per ABB — the palette does not scale to hundreds of building blocks. Every non-core ABB looks the same, differentiated by its content and structure rather than colour.

## Colour Assignments (Tokens)

| Element Type | Fill | Stroke | Text |
|-------------|------|--------|------|
| ABB Boundary | none | `1.1` | `1.3` on `1.1` badge |
| Level 1 — Primary | `1.1` | `3.1` | `1.3` |
| Level 2 — Secondary | `2.1.2` | `3.2` | `3.1` |
| Level 2 — Adapter | `3.3` | `3.1` | `3.1` |
| Observability — Primary | `2.4` | `3.1` | `1.1` |
| Observability — Secondary | `2.4.2` | `3.2` | `3.1` |
| Sub-ABB Background | `3.4` | `1.1` | — |
| IAM Sub-ABB Background | `3.4` | `2.1` | — |
| Observability Sub-ABB Background | `3.4` | `2.4` | — |
| Governance Sub-ABB Background | `3.4` | `2.5` | — |
| External Actor (ellipse) | `1.1` | none | `1.3` |
| Legend Background | `3.4` | `3.3` | — |

This palette applies universally. The reserved cross-cutting colours (`2.1`, `2.4`, `2.5`) appear only in sub-ABB groups and their associated edges/badges — never as the primary component fill for a non-core ABB.

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

Badge style: fill `2.4`, text `1.1`, size 22x22.

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

1. [ ] **Token Resolution**: Did you resolve IDs like `1.2.2` using the Visual Design Standard?
2. [ ] **Whimsy Applied**: Are boundaries and Level 1 components set to `arcSize=5`?
3. [ ] **Mandatory Sub-ABBs**: Does the diagram include IAM (`2.1` stroke), Observability (`2.4` stroke), and Governance & Policy (`2.5` stroke) sub-ABB groups?
4. [ ] **Component Content**: Does every component box contain title + HR + description (not just a name)?
5. [ ] **External Actors**: Are external actors placed on the right side of the diagram as 100x90 ellipses?
6. [ ] **Interface Labels**: Are interface labels descriptive (e.g. `I1 Policy query`) and colour-coded to match edge type?
7. [ ] **Colour Independence**: Do semantic indicators (Success/Error) have text labels (e.g. [OK])?
8. [ ] **Canvas Specs**: Is the background set to `1.3` and the grid to 10px?
9. [ ] **Traceability**: Does every component in the diagram match the ABB's capability list?
10. [ ] **Accessibility**: Is text on dark fills (`1.1`, `2.1`) set to White (`1.3`) and text on bright accent fills (`2.3`, `2.4`, `2.5`) set to Charcoal (`1.1`)?
11. [ ] **Legend**: Does the legend include swatches for all element types, edge types, sub-ABB strokes, and badge pairs?
12. [ ] **Consistency**: Does this diagram match the structural density and layout pattern of existing ABB diagrams (AB-001, AB-002)?
13. [ ] **Colour Strategy**: Are Level 1/Level 2 components using the default palette (`1.1`/`2.1.2`)? Only AB-001, AB-002, and AB-003 use reserved colours for their own primary components.

---

## Quick Reference Style Snippet (Agent)

**Primary Component (with content):**
```
style="rounded=1;arcSize=5;fillColor=/*1.1*/;strokeColor=/*3.1*/;strokeWidth=2;fontFamily=Helvetica;fontColor=/*1.3*/;verticalAlign=top;spacingTop=10;spacingLeft=10;align=left;fontSize=11;"
value="<b>Component Name</b><hr style='border-color: /*1.1.2*/;'>One-to-two sentence description of the component's responsibility."
```

**Secondary Component (with content):**
```
style="rounded=1;arcSize=10;fillColor=/*1.2.2*/;strokeColor=/*3.2*/;strokeWidth=2;fontFamily=Helvetica;fontColor=/*3.1*/;verticalAlign=top;spacingTop=8;spacingLeft=10;align=left;fontSize=11;"
value="<b>Component Name</b><hr style='border-color:/*3.3*/;'>One-to-two sentence description."
```

**Cross-Cutting Sub-ABB Component (with content):**
```
style="rounded=1;arcSize=10;fillColor=/*sub-ABB-secondary*/;strokeColor=/*sub-ABB-primary*/;strokeWidth=2;fontFamily=Helvetica;fontColor=/*3.1*/;verticalAlign=top;spacingTop=8;spacingLeft=10;align=left;fontSize=10;"
value="<b>Component Name</b><hr style='border-color:/*3.3*/;'>One-to-two sentence description."
```

**ABB Boundary:**
`style="rounded=1;arcSize=5;fillColor=none;strokeColor=/*1.1*/;strokeWidth=2;"`

**IAM Sub-ABB Group:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.1*/;strokeWidth=2;"`

**Observability Sub-ABB Group:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.4*/;strokeWidth=2;"`

**Governance & Policy Sub-ABB Group:**
`style="rounded=1;arcSize=5;fillColor=/*3.4*/;strokeColor=/*2.5*/;strokeWidth=2;"`

**External Actor:**
`style="ellipse;fillColor=/*1.1*/;strokeColor=none;fontFamily=Helvetica;fontColor=/*1.3*/;fontSize=14;fontStyle=1;" width=100 height=90`

---

## Reference Examples

When creating a new ABB diagram, ALWAYS open and study the existing ABB diagrams first. These are the canonical reference implementations of this standard:

| ABB | Path | Key Patterns to Follow |
|-----|------|----------------------|
| AB-001 Identity & Access Management | `AB-001/components.drawio` | 4 domain groups as columns, external actors (Consumer ABB, External IdP) on right, descriptive labels, observability badge pairs, full legend |
| AB-002 Observability | `AB-002/components.drawio` | 4 domain groups (3 columns + spanning Storage), external actors (Producer ABB, Consumer, Notification Systems) on right, descriptive labels, full legend |
| AB-003 Governance & Policy Enforcement | `AB-003/components.drawio` | 4 domain groups (3 columns + spanning Data Governance), external actors (Building Block, Policy Author, Compliance Stakeholder) on right, descriptive labels, observability badge pairs, full legend |

**When in doubt about how to implement any rule in this standard, open an existing ABB `.drawio` file and match its structure.** New ABB diagrams MUST be visually consistent with existing ones in terms of information density, layout pattern, and component content. A diagram that looks noticeably sparser or structurally different from the reference examples is non-compliant.

