# DAG Visualisation Design Research

**Date:** 2026-04-10
**Status:** Complete
**Method:** 2 parallel research agents (Claude, Gemini) — commercial EA tools, ArchiMate conventions, React Flow patterns, Tailwind dark theme styling.

This document captures the visual design research for the framework's DAG visualization server (`scripts/serve-framework.ts`). The current viewer has a functional dark theme; this research provides recommendations to evolve it toward professional EA tool standards.

---

## 1. Commercial EA tool visual patterns

### LeanIX (SAP LeanIX)
- **Capability Matrix**: Grid-based heatmap with application cards colour-coded by lifecycle status: Plan (blue), Phase In (green), Active (green), Phase Out (amber), End of Life (red).
- **Timeline Scrubber**: Horizontal slider between current-state and target-state architecture — diagram morphs to show transitions.

### Ardoq
- **Graph-native data model**: Built on a graph database. All visualisations auto-generated from structured data.
- **Node shape vocabulary**: Groups/components use **squared corners**; referenced components use **rounded corners**. Reference parents get **dotted borders**. Collapsed hierarchies indicated by **double borders**.
- **Interactive filtering**: "Show Only Connected Components" toggle, collapse-groups slider, hover highlights all visible instances of a component.

### Sparx Enterprise Architect
- **Gallery approach**: Pre-built diagram types for UML, SysML, ArchiMate, BPMN. Colour application is notation-driven.

### ServiceNow CMDB / Service Mapping
- **Typed edges**: Nodes represent CIs; edges carry relationship semantics ("runs on", "communicates with", "depends on").

---

## 2. ArchiMate layer colour conventions

ArchiMate assigns colours by architectural layer:

| Layer | Colour | Hex | Framework mapping |
|---|---|---|---|
| Motivation | Purple/Violet | `#CCCCFF` / `#B3B3E6` | Outcomes, Use Cases |
| Strategy | Brown/Tan | `#F5DEB3` / `#D4A574` | Outcomes |
| Business | Yellow/Gold | `#FFFFB5` / `#FFD700` | Platforms, Bounded Contexts |
| Application | Blue | `#B5E3FF` / `#7EC8E3` | Capabilities, ABBs |
| Technology | Green | `#C9E7B7` / `#93C47D` | SBBs, Services |
| Physical | Dark Green | `#8FBC8F` | Infrastructure |
| Implementation | Salmon/Red | `#FFB5B5` | Deployments |

### Recommended dark-theme adaptation

Translating ArchiMate's light-background palette to a dark theme (slate-900 background):

| Node type | ArchiMate layer | Dark theme colour | Tailwind |
|---|---|---|---|
| **Outcome** | Motivation | `#A78BFA` (violet-400) | `violet-400` |
| **Platform** | Business | `#F59E0B` (amber-500) | `amber-500` |
| **Bounded Context** | Business | `#FBBF24` (amber-400) | `amber-400` |
| **Capability** | Application | `#2DD4BF` (teal-400) | `teal-400` |
| **ABB** | Application | `#60A5FA` (blue-400) | `blue-400` |
| **SBB** | Technology | `#4ADE80` (green-400) | `green-400` |
| **Service** | Technology | `#FB7185` (rose-400) | `rose-400` |

Background: `slate-900` (#0F172A). Card surface: `slate-800` (#1E293B). Muted text: `slate-400` (#94A3B8).

---

## 3. Node card anatomy

Recommended card structure for each node:

```
┌──────────────────────────────────┐
│ ● CAPABILITY L3         draft    │  ← layer badge + status chip
│                                  │
│ CAP-010                          │  ← artefact code
│ API Mediation & Contract         │  ← name (wrap as needed)
│ Enforcement                      │
│                                  │
│ ████████░░░░░░░░  Maturity: 2/5  │  ← maturity progress bar
│                                  │
│ Integration  Primary             │  ← tags (category, relationship)
└──────────────────────────────────┘
```

Key design decisions:
- **Layer badge** in the top-left corner identifies the node type with its colour
- **Status chip** in the top-right (draft, active, deprecated) — colour-coded per LeanIX conventions
- **Maturity bar** only shown for capabilities (the only artefact type that tracks maturity)
- **Tags** shown as small pills at the bottom

---

## 4. ELK.js layout configuration

Recommended ELK.js options for architecture DAGs:

```js
const ELK_OPTIONS = {
  'elk.algorithm': 'layered',              // Sugiyama-style layered layout
  'elk.direction': 'DOWN',                 // Top-to-bottom (Golden Thread direction)
  'elk.spacing.nodeNode': '40',            // Horizontal spacing between siblings
  'elk.layered.spacing.nodeNodeBetweenLayers': '60',  // Vertical spacing between layers
  'elk.edgeRouting': 'ORTHOGONAL',         // Right-angle edges (cleaner for architecture)
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',  // Reduce edge crossings
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',     // Better vertical alignment
  'elk.partitioning.activate': 'true',     // Enforce layer ordering
};
```

**Partition mapping** (enforces Golden Thread layer ordering):
- Outcomes → partition 0
- Platforms → partition 1
- Bounded Contexts → partition 2
- Capabilities → partition 3
- ABBs → partition 4
- SBBs → partition 5
- Services → partition 6

---

## 5. Interactive patterns worth implementing

Priority-ordered:

1. **Click-to-detail panel** (right slide-out) — already implemented in current viewer
2. **Cmd+K search** — filter/focus on specific artefact by ID or name
3. **Expand/collapse groups** — Platform nodes that contain their BCs, which contain their ABBs. Collapse to show just the Platform.
4. **Breadcrumb navigation** — show current drill-down path (e.g., "PL-001 > BC-001 > AB-001")
5. **Minimap** — already implemented in current viewer
6. **Hover highlight connected** — on hover, dim all nodes except the hovered node's direct connections
7. **Filter by type** — toggle visibility of specific node types (e.g., hide outcomes to focus on the technical layers)
8. **Edge label toggle** — show/hide edge labels to reduce visual noise

---

## 6. React Flow reference implementations

| Project | What it demonstrates | Relevance |
|---|---|---|
| **React Flow Turbo** (free example) | Dark theme with animated gradient borders, glow effects | Visual polish reference |
| **Backstage catalog-graph** | Entity relationship graph with configurable depth and relation filtering | Architecture entity relationships |
| **React Flow Pro: Expand/Collapse** | Collapsible node trees for hierarchical flows | Platform > BC > ABB drill-down |
| **React Flow Pro: Auto Layout** | ELK.js / dagre / d3-force layout comparison | Layout algorithm selection |
| **Bit Cloud** | Component dependency visualization | Dependency graph patterns |
| **Open Metadata** | Metadata lineage and integration architecture | Data lineage visualization |

---

## 7. Gap between current viewer and research recommendations

| Feature | Current viewer | Research recommendation | Priority |
|---|---|---|---|
| **Colour palette** | Generic dark theme (custom hex values) | ArchiMate-inspired layer colours (§2) | High |
| **Node card design** | Simple: ID + name + type badge | Rich: layer badge, status chip, maturity bar, tags (§3) | High |
| **Edge styling** | Uniform grey with relationship-based opacity | Typed edges with visual distinction (solid/dashed/dotted) per relationship type | Medium |
| **Search** | None | Cmd+K fuzzy search | Medium |
| **Group containment** | None (flat graph) | Expand/collapse groups for Platform > BC > ABB hierarchy | Medium |
| **Hover highlighting** | None | Dim unconnected nodes on hover | Low |
| **Filter by type** | None | Toggle node type visibility | Low |
| **Breadcrumbs** | None | Drill-down path display | Low |
