---
document_type: standards
title: "Capability — Draw.io Diagram Standard"
classification: internal
version: 1.0
status: approved
created: 2026-03-07
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Creating or modifying capability map diagrams"
  - "Visualising capability hierarchy and maturity"
  - "Mapping capabilities to Architecture Building Blocks"
---

# Capability — Draw.io Diagram Standard

This standard defines the visual conventions, structure, and Draw.io XML format for capability diagrams. All colours are referenced by their identifier from the [Visual Design Standards](../visual-design/visual-design-standard.md) — never by hex code.

Capability diagrams are fundamentally different from ABB component diagrams. ABB diagrams show the internal structure of a single building block. Capability diagrams show the **hierarchy of business capabilities** across a domain or the entire enterprise, using nested boxes to represent the L1/L2/L3 decomposition.

---

## Diagram Types

This standard defines two diagram types:

| Type | Filename | Canvas | Purpose |
|------|----------|--------|---------|
| **Capability Map (L1 domain view)** | `diagrams/l1/<l1-domain>-capability-map.drawio` | 1920 x 1080 | Nested-box hierarchy showing one L1 domain and its L2/L3 capabilities |
| **Capability-ABB Traceability** | `diagrams/traceability/capability-abb-traceability.drawio` | 1920 x 1080 | Matrix showing L3 capabilities mapped to ABBs |

Both use a **full-slide canvas** (1920 x 1080). Unlike ABB diagrams, capability diagrams do not use a two-panel layout with a summary panel. The diagram IS the presentation artefact.

---

## Diagram Type 1: Capability Map

### File Format

- **Format:** Draw.io XML (`.drawio`)
- **Export:** PNG (`.png`) at **300 DPI**, white background
- **Canvas:** 1920 x 1080, background `1.3`, grid enabled (10px)
- **Font family:** Helvetica throughout (fallback: Arial, sans-serif)
- **Margins:** 40px all sides; content area 1840 x 1000

### Layout Structure

The capability map uses **nested rectangles** — the universal pattern across LeanIX, Ardoq, Bizzdesign, ArchiMate, and TOGAF:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Title: "<Domain> Capability Map"                    Version | Date    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ L1 DOMAIN A ─────────────────────┐  ┌─ L1 DOMAIN B ─────────────┐ │
│  │                                    │  │                            │ │
│  │  ┌─ L2 Group ──┐  ┌─ L2 Group ─┐  │  │  ┌─ L2 Group ──────────┐  │ │
│  │  │ L3   L3     │  │ L3   L3    │  │  │  │ L3   L3   L3        │  │ │
│  │  │ L3          │  │ L3         │  │  │  │ L3                   │  │ │
│  │  └─────────────┘  └────────────┘  │  │  └──────────────────────┘  │ │
│  │                                    │  │                            │ │
│  └────────────────────────────────────┘  └────────────────────────────┘ │
│                                                                         │
│  ┌─ L1 DOMAIN C (spanning, e.g. "Enabling") ────────────────────────┐  │
│  │  ┌─ L2 Group ──┐  ┌─ L2 Group ──┐  ┌─ L2 Group ──────────────┐  │  │
│  │  │ L3   L3     │  │ L3   L3     │  │ L3   L3   L3            │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Legend: [L1 Domain] [L2 Group] [L3 Capability]   Total: X caps        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Layout Rules

1. **L1 domains** are the outermost containers. Arrange them to fill the canvas width, stacking vertically if needed. Spanning domains (e.g. "Enabling", "Cross-Cutting") sit at the bottom, full width.
2. **L2 groups** are boxes inside their L1 parent, arranged as columns within the L1 container.
3. **L3 capabilities** are the smallest boxes, arranged inside their L2 parent. They flow left-to-right, wrapping to new rows as needed.
4. **No connectors or edges.** Capability maps show hierarchy through nesting, not arrows. Dependencies between capabilities are implicit.
5. **No external actors.** Capability maps are an internal view of the organisation's abilities.
6. **10 or fewer L1 domains.** More than 10 L1 domains makes the map unreadable on a single slide. If the model exceeds 10 L1 domains, produce one map per related cluster of L1 domains.
7. **Title bar** at the top with diagram name, version, and date.
8. **Legend** at the bottom showing the three hierarchy levels with colour swatches and total capability count.

### Colour Assignments

Capability maps use **domain-based colouring** — each L1 domain has a dedicated colour from the visual design palette. This differs from ABB diagrams where colour indicates component hierarchy level.

#### L1 Domain Colours

Assign L1 domains to colours from the secondary palette. The assignment is workspace-specific — use the table below as the default, and override in your workspace's visual design standard if needed.

| Domain Position | Fill (L1 box) | Stroke (L1 box) | L2 Fill | L3 Fill | Text |
|----------------|---------------|-----------------|---------|---------|------|
| Domain 1 | `2.1.3` | `2.1` | `2.1.2` | `1.3` | `1.1` |
| Domain 2 | `2.4.3` | `2.4` | `2.4.2` | `1.3` | `1.1` |
| Domain 3 | `2.2.3` | `2.2` | `2.2.2` | `1.3` | `1.1` |
| Domain 4 | `2.5.3` | `2.5` | `2.5.2` | `1.3` | `1.1` |
| Domain 5 | `2.3.3` | `2.3` | `2.3.2` | `1.3` | `1.1` |
| Domain 6 | `2.6.3` | `2.6` | `2.6.2` | `1.3` | `1.1` |

If there are more than 6 L1 domains, cycle through the palette. Ensure adjacent domains use distinct colours.

#### Title Bar

| Element | Fill | Stroke | Text |
|---------|------|--------|------|
| Title bar | `1.1` | none | `1.3` |
| Subtitle / version | `1.1` | none | `1.1.2` |

#### Legend

| Element | Fill | Stroke | Text |
|---------|------|--------|------|
| Legend background | `3.4` | `3.3` | `3.1` |

### Box Styling

All boxes use **rounded corners (`arcSize=5`)** to match the ABB "whimsy" rule.

#### L1 Domain Box

```
style="rounded=1;arcSize=5;fillColor=/*domain-20%-tint*/;strokeColor=/*domain-base*/;strokeWidth=2;fontFamily=Helvetica;verticalAlign=top;align=left;spacingTop=8;spacingLeft=10;"
```

**Label:** Bold domain name, `fontSize=16`. Positioned at the top-left of the box.

#### L2 Group Box

```
style="rounded=1;arcSize=5;fillColor=/*domain-50%-tint*/;strokeColor=/*domain-base*/;strokeWidth=1.5;fontFamily=Helvetica;verticalAlign=top;align=left;spacingTop=6;spacingLeft=8;"
```

**Label:** Bold group name, `fontSize=12`.

#### L3 Capability Box

```
style="rounded=1;arcSize=5;fillColor=/*1.3*/;strokeColor=/*domain-base*/;strokeWidth=1;fontFamily=Helvetica;verticalAlign=middle;align=center;spacingTop=4;spacingLeft=6;"
```

**Label:** Capability name (not bold), `fontSize=10`. Keep text to 2-3 words. If the capability name is long, abbreviate or wrap.

**Minimum size:** 120 x 40px for L3 boxes. Adjust width to fit text.

### Maturity Heat Map Overlay

The same capability map layout supports a **maturity overlay** view. In this mode, L3 capability boxes are recoloured based on the gap between current and target maturity.

| Gap | Meaning | Fill Colour | Text |
|-----|---------|-------------|------|
| 2+ levels below target | Large gap | `4.3` (Error red) | `1.3` |
| 1 level below target | Medium gap | `4.2` (Warning amber) | `1.1` |
| At target | No gap | `4.1` (Success green) | `1.1` |
| Above target | Over-invested | `4.4` (Info blue) | `1.1` |

When using the maturity overlay:
- L1 and L2 boxes retain their domain colours (do not recolour containers).
- Only L3 boxes change colour.
- The legend MUST show the maturity gap colour scale instead of the domain colour scale.
- Add "Maturity Heat Map" to the title bar subtitle.

### What Does NOT Appear on Capability Maps

- No component descriptions (that level of detail is in the capability `index.md`).
- No ABB identifiers (those appear in the traceability diagram).
- No connectors, arrows, or flow lines.
- No external actors or interfaces.

---

## Diagram Type 2: Capability-ABB Traceability

### File Format

Same as Capability Map (1920 x 1080, 300 DPI, Helvetica).

### Layout Structure

A matrix with L3 capabilities as rows and ABBs as columns:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Title: "Capability-ABB Traceability Matrix"         Version | Date    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│              │  AB-001     │  AB-002        │  AB-003       │           │
│              │  IAM        │  Observability │  Governance   │           │
│  ────────────┼─────────────┼────────────────┼───────────────┤           │
│  CAP-004     │  PRIMARY    │  Cross-cutting │  Cross-cutting│           │
│  Identity    │             │                │               │           │
│  Lifecycle   │             │                │               │           │
│  ────────────┼─────────────┼────────────────┼───────────────┤           │
│  CAP-005     │  PRIMARY    │  Cross-cutting │  Supporting   │           │
│  Policy-Based│             │                │               │           │
│  Access Ctrl │             │                │               │           │
│  ────────────┼─────────────┼────────────────┼───────────────┤           │
│  ...         │             │                │               │           │
│                                                                         │
│  Legend: [Primary] [Supporting] [Cross-cutting] [Gap]                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Colour Assignments

| Relationship | Cell Fill | Cell Text |
|-------------|-----------|-----------|
| **Primary** | `2.1` | `1.3` |
| **Supporting** | `2.1.2` | `1.1` |
| **Cross-cutting** | `3.4` | `3.1` |
| **Gap** (no ABB) | `4.3` | `1.3` |
| **No relationship** | `1.3` | — |

#### Table Structure

| Element | Fill | Stroke | Text |
|---------|------|--------|------|
| Header row (ABB names) | `1.1` | `1.1` | `1.3`, `fontSize=12`, bold |
| Row label (capability names) | `3.4` | `3.3` | `3.1`, `fontSize=11`, bold |
| Cell | Per relationship type | `3.3` | Per relationship type, `fontSize=10` |
| Title bar | `1.1` | none | `1.3` |
| Legend | `3.4` | `3.3` | `3.1` |

### Relationship Labels in Cells

Each non-empty cell contains the relationship type as text: `Primary`, `Supporting`, or `Cross-cutting`. Optionally add coverage: `Primary (full)` or `Supporting (partial)`.

---

## File Structure

Capability diagrams are views. In a workspace, keep them separate from canonical capability records:

```
capabilities/
  diagrams/
    l0/
      enterprise-capability-map.drawio                 # Optional L0 map across L1 domains
    l1/
      <l1-domain>-capability-map.drawio               # One map per L1 domain
    traceability/
      capability-abb-traceability.drawio              # Capability-to-ABB matrix
  archive/
    capability-map-copy.drawio                        # Historical/working copy (optional)
```

If the model is large enough to require multiple maps (more than ~30 capabilities), split by L1 domain:

```
capabilities/diagrams/l1/
  <l1-domain>-capability-map.drawio
  <l1-domain>-capability-map.png
```

---

## Naming Conventions

- **Cell IDs:** Use descriptive kebab-case (e.g. `l0-platform-foundations`, `l1-identity-access`, `l2-identity-lifecycle`)
- **Prefix by level:** `l0-`, `l1-`, `l2-` for hierarchy boxes
- **Legend IDs:** Prefix with `leg-`
- **Matrix IDs:** `matrix-cap-NNN-ab-NNN` for traceability cells

---

## AI Agent Self-Verification Checklist

Before finalising a capability diagram, verify:

1. [ ] **Token Resolution**: Did you resolve colour IDs using the Visual Design Standard?
2. [ ] **Whimsy Applied**: Are all boxes set to `arcSize=5`?
3. [ ] **Hierarchy Correct**: Do L1 boxes contain L2 boxes which contain L3 boxes — no orphaned capabilities?
4. [ ] **No Connectors**: Are there zero edges/arrows on the capability map? (Hierarchy is shown by nesting only.)
5. [ ] **Domain Colours**: Does each L1 domain use a distinct colour from the secondary palette?
6. [ ] **L3 Content**: Does each L3 box show the capability name (not ID) in readable text?
7. [ ] **Legend Present**: Does the legend show the hierarchy level colour scheme (or maturity scale if heat map)?
8. [ ] **Title Bar**: Does the title bar include diagram name, version, and date?
9. [ ] **Canvas Specs**: Is the canvas 1920 x 1080 with background `1.3` and grid 10px?
10. [ ] **Maturity Overlay (if used)**: Are only L3 boxes recoloured? Are L1/L2 containers unchanged?
11. [ ] **Traceability Matrix (if present)**: Does every L3 capability appear as a row? Does every ABB appear as a column? Are relationship colours correct?
12. [ ] **Consistency**: Does the diagram match the capability-model.md taxonomy exactly?

---

## Quick Reference Style Snippets

**L1 Domain Box (Domain 1 - Indigo):**
```
style="rounded=1;arcSize=5;fillColor=/*2.1.3*/;strokeColor=/*2.1*/;strokeWidth=2;fontFamily=Helvetica;fontColor=/*1.1*/;verticalAlign=top;align=left;spacingTop=8;spacingLeft=10;fontSize=16;fontStyle=1;"
```

**L2 Group Box (Domain 1 - Indigo):**
```
style="rounded=1;arcSize=5;fillColor=/*2.1.2*/;strokeColor=/*2.1*/;strokeWidth=1.5;fontFamily=Helvetica;fontColor=/*1.1*/;verticalAlign=top;align=left;spacingTop=6;spacingLeft=8;fontSize=12;fontStyle=1;"
```

**L3 Capability Box (Domain 1 - Indigo):**
```
style="rounded=1;arcSize=5;fillColor=/*1.3*/;strokeColor=/*2.1*/;strokeWidth=1;fontFamily=Helvetica;fontColor=/*1.1*/;verticalAlign=middle;align=center;fontSize=10;"
```

**Title Bar:**
```
style="rounded=0;fillColor=/*1.1*/;strokeColor=none;fontFamily=Helvetica;fontColor=/*1.3*/;fontSize=20;fontStyle=1;align=left;verticalAlign=middle;spacingLeft=20;"
```

**Traceability Cell (Primary):**
```
style="rounded=0;fillColor=/*2.1*/;strokeColor=/*3.3*/;strokeWidth=1;fontFamily=Helvetica;fontColor=/*1.3*/;fontSize=10;align=center;verticalAlign=middle;"
value="Primary"
```

**Traceability Cell (Supporting):**
```
style="rounded=0;fillColor=/*2.1.2*/;strokeColor=/*3.3*/;strokeWidth=1;fontFamily=Helvetica;fontColor=/*1.1*/;fontSize=10;align=center;verticalAlign=middle;"
value="Supporting"
```

**Traceability Cell (Cross-cutting):**
```
style="rounded=0;fillColor=/*3.4*/;strokeColor=/*3.3*/;strokeWidth=1;fontFamily=Helvetica;fontColor=/*3.1*/;fontSize=10;align=center;verticalAlign=middle;"
value="Cross-cutting"
```

