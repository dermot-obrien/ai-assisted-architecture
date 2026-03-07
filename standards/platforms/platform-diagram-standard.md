---
document_type: standards
title: "Platform — Draw.io Diagram Standard"
classification: internal
version: 1.0
status: draft
created: 2026-03-08
last_modified: 2026-03-08
owner: "Architecture Team"
triggers:
  - "Creating or modifying platform landscape diagrams"
  - "Visualising the platform portfolio"
  - "Mapping platforms to outcomes, capabilities, and bounded contexts"

# Platform — Draw.io Diagram Standard

This standard defines the visual conventions, structure, and Draw.io XML format for platform landscape diagrams. All colours are referenced by their identifier from the [Visual Design Standards](../visual-design/visual-design-standard.md) — never by hex code.

Platform diagrams show the **portfolio of platforms** and their key relationships — outcomes, capabilities, bounded contexts, and ownership. They are the primary visual overview of the organisation's platform landscape.


## Diagram Types

This standard defines one diagram type:

| Type | Filename | Canvas | Purpose |
|------|----------|--------|---------|
| **Platform Landscape** | `diagrams/platform-landscape.drawio` | 1920 x 1080 | Card-grid showing all platforms with ownership, outcomes, capabilities, and bounded contexts |

The diagram uses a **full-slide canvas** (1920 x 1080). The diagram IS the presentation artefact.


## Diagram Type: Platform Landscape

### File Format

- **Format:** Draw.io XML (`.drawio`)
- **Export:** PNG (`.png`) at **300 DPI**, white background
- **Canvas:** 1920 x 1080, background `1.3`, grid enabled (10px)
- **Font family:** Helvetica throughout (fallback: Arial, sans-serif)
- **Margins:** 40px sides; content area starts below the title bar

### Layout Structure

The platform landscape uses a **card grid** — each platform is a card showing its key metadata at a glance:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Title: "Platform Landscape"                          Version | Date    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ PL-001 ─────────────┐  ┌─ PL-002 ─────────────┐  ┌─ PL-003 ────┐ │
│  │  Platform Name        │  │  Platform Name        │  │  Platform    │ │
│  │  Owner: ...           │  │  Owner: ...           │  │  Owner: ...  │ │
│  │                       │  │                       │  │              │ │
│  │  Outcomes: OC-NNN     │  │  Outcomes: OC-NNN     │  │  Outcomes:   │ │
│  │  Caps: CAP-NNN ...    │  │  Caps: CAP-NNN ...    │  │  Caps: ...   │ │
│  │                       │  │                       │  │              │ │
│  │  [BC-001 Name]        │  │  [BC-002 Name]        │  │  [BC-003]    │ │
│  └───────────────────────┘  └───────────────────────┘  └──────────────┘ │
│                                                                         │
│  ┌─ PL-004 ─────────────┐  ┌─ PL-005 ─────────────┐  ┌─ PL-006 ────┐ │
│  │  ...                  │  │  ...                  │  │  ...         │ │
│  └───────────────────────┘  └───────────────────────┘  └──────────────┘ │
│                                                                         │
│  Legend: [Platform Card] [Outcome] [Capability] [Bounded Context]       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Layout Rules

1. **Cards arranged in a grid.** For up to 9 platforms, use a 3x3 grid. For 4-6, use a 2x3 or 3x2 grid. For 10+, use a 4-column grid or split across pages.
2. **Each card is a platform.** The card boundary is the platform boundary — it contains everything that belongs to that platform.
3. **No connectors or edges.** Platform landscapes show the portfolio, not inter-platform relationships. Cross-platform dependencies are shown on bounded context maps or integration diagrams.
4. **Each platform has a unique colour** from the secondary palette (cycling if more than 6 platforms).
5. **Title bar** at the top with diagram name, version, and date.
6. **Legend** at the bottom showing card element types.

### Card Anatomy

Each platform card contains, top to bottom:

| Element | Position | Description |
|---------|----------|-------------|
| **Header bar** | Top of card | `PL-NNN \| Platform Name` — coloured bar with white text |
| **Strategic Owner** | Below header | Italic text showing the accountable executive |
| **Outcomes section** | Below owner | Label + pill badges for each `OC-NNN` |
| **Capabilities section** | Below outcomes | Label + pill badges for each `CAP-NNN` |
| **Bounded Context(s)** | Bottom of card | Outlined box(es) showing `BC-NNN Name` |

### Colour Assignments

Platform landscapes use **platform-based colouring** — each platform has a dedicated colour from the secondary palette.

#### Platform Colours (cycling through secondary palette)

| Platform Position | Base Colour | Header Fill | Card Stroke | Pill Fill | BC Stroke | Text |
|------------------|-------------|-------------|-------------|-----------|-----------|------|
| Platform 1 | `2.1` | `2.1` | `2.1` | `2.1` | `2.1` | `1.3` (on fill), `1.1` (on white) |
| Platform 2 | `2.4` | `2.4` | `2.4` | `2.4` | `2.4` | `1.3` (on fill), `1.1` (on white) |
| Platform 3 | `2.5` | `2.5` | `2.5` | `2.5` | `2.5` | `1.3` (on fill), `1.1` (on white) |
| Platform 4 | `2.2` | `2.2` | `2.2` | `2.2` | `2.2` | `1.3` (on fill), `1.1` (on white) |
| Platform 5 | `2.3` | `2.3` | `2.3` | `2.3` | `2.3` | `1.3` (on fill), `1.1` (on white) |
| Platform 6 | `2.6` | `2.6` | `2.6` | `2.6` | `2.6` | `1.3` (on fill), `1.1` (on white) |

For more than 6 platforms, cycle through the palette from the beginning. Ensure adjacent cards in the grid use distinct colours.

#### Title Bar

| Element | Fill | Stroke | Text |
|---------|------|--------|------|
| Title bar | `1.1` | none | `1.3` |
| Subtitle / version | `1.1` | none | `1.1.2` |

#### Legend

| Element | Fill | Stroke | Text |
|---------|------|--------|------|
| Legend background | `3.4` | `3.3` | `3.1` |

### Card Styling

All cards use **rounded corners (`arcSize=5`)** to match the framework's "whimsy" rule.

#### Platform Card Container

```
style="rounded=1;arcSize=5;fillColor=none;strokeColor=/*platform-base*/;strokeWidth=2;fontFamily=Helvetica;whiteSpace=wrap;html=1;"
```

Card containers have no fill — only a coloured stroke border.

#### Header Bar

```
style="rounded=1;arcSize=8;fillColor=/*platform-base*/;fontColor=#FFFFFF;strokeColor=none;fontSize=14;fontStyle=1;fontFamily=Helvetica;align=center;verticalAlign=middle;whiteSpace=wrap;html=1;"
```

**Label:** Bold, `fontSize=14`, white text on platform colour. Format: `PL-NNN | Platform Name`.

#### Strategic Owner

```
style="text;html=1;fontSize=10;fontFamily=Helvetica;fontColor=/*platform-base*/;fontStyle=2;align=center;verticalAlign=middle;whiteSpace=wrap;"
```

**Label:** Italic, `fontSize=10`, platform colour text. Format: `Owner: Role Name`.

#### Section Labels (Outcomes, Capabilities)

```
style="text;html=1;fontSize=9;fontStyle=1;fontFamily=Helvetica;fontColor=/*platform-base*/;align=left;verticalAlign=middle;whiteSpace=wrap;"
```

**Label:** Bold, `fontSize=9`, platform colour text.

#### Pill Badges (Outcome IDs, Capability IDs)

```
style="rounded=1;arcSize=20;fillColor=/*platform-base*/;fontColor=#FFFFFF;strokeColor=none;fontSize=9;fontFamily=Helvetica;align=center;verticalAlign=middle;whiteSpace=wrap;html=1;"
```

**Size:** 65 x 22px per pill. Arrange pills horizontally, wrapping to a new row if needed. Gap: 10px horizontal, 4px vertical.

#### Bounded Context Box

```
style="rounded=1;arcSize=10;fillColor=#FFFFFF;strokeColor=/*platform-base*/;strokeWidth=1.5;fontSize=10;fontFamily=Helvetica;fontColor=/*platform-base*/;fontStyle=1;align=center;verticalAlign=middle;whiteSpace=wrap;html=1;"
```

**Label:** Bold, `fontSize=10`, platform colour text. Format: `BC-NNN Context Name`.
**Size:** Width to fit text (min 180px), height 30px. If multiple BCs, arrange horizontally with 10px gap.

### Grid Dimensions

For a 3x3 grid on a 1920 x 1080 canvas:

| Dimension | Value |
|-----------|-------|
| Card width | 580px |
| Card height | 290px |
| Horizontal gap | 30px |
| Vertical gap | 20px |
| Grid origin (x) | 40px |
| Grid origin (y) | 80px (below title bar) |
| Title bar height | 50px |
| Title bar y | 15px |

Card positions (x, y):

| | Col 1 | Col 2 | Col 3 |
|---|-------|-------|-------|
| **Row 1** | 40, 80 | 650, 80 | 1260, 80 |
| **Row 2** | 40, 390 | 650, 390 | 1260, 390 |
| **Row 3** | 40, 700 | 650, 700 | 1260, 700 |


## File Structure

Platform landscape diagrams are views. In a workspace:

```
platforms/
  diagrams/
    platform-landscape.drawio          # The portfolio view
    platform-landscape.png             # 300 DPI export
```


## Naming Conventions

- **Cell IDs:** Use descriptive kebab-case prefixed by platform ID (e.g., `pl001-container`, `pl001-header`, `pl001-bc`)
- **Pill IDs:** `pl001-oc001`, `pl001-cap004` (platform prefix + element ID)
- **Legend IDs:** Prefix with `leg-`


## What Does NOT Appear on Platform Landscapes

- No component descriptions (that detail is in the platform `index.md`).
- No ABB or SBB identifiers (those appear on ABB diagrams and capability traceability).
- No connectors, arrows, or flow lines.
- No external actors or interfaces.
- No SLOs or self-service interface details.


## Reference Example

See `foundation/platforms/diagrams/platform-landscape.drawio` for a canonical implementation showing 9 foundation platforms in a 3x3 grid.


## AI Agent Self-Verification Checklist

Before finalising a platform landscape diagram, verify:

1. [ ] **Token Resolution**: Did you resolve colour IDs using the Visual Design Standard?
2. [ ] **Whimsy Applied**: Are all cards and boxes set to `arcSize=5` (cards) or `arcSize=8` (headers)?
3. [ ] **Card Completeness**: Does every card show header, owner, outcomes, capabilities, and bounded context(s)?
4. [ ] **Platform Colours**: Does each platform use a distinct colour from the secondary palette (cycling if >6)?
5. [ ] **No Connectors**: Are there zero edges/arrows on the landscape?
6. [ ] **ID Format**: Do all platforms use `PL-NNN` format?
7. [ ] **Legend Present**: Does the legend show the card element types?
8. [ ] **Title Bar**: Does the title bar include diagram name, version, and date?
9. [ ] **Canvas Specs**: Is the canvas 1920 x 1080 with background `1.3` and grid 10px?
10. [ ] **Consistency**: Does the diagram match the platform `index.md` files exactly?
