---
document_type: standards
title: "Solution Building Block (SBB) — Document Standard"
classification: internal
version: 1.0
status: draft
created: 2024-10-01
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Creating or modifying SBB implementation documents (index.md)"
  - "Creating or updating SBB summary documents (summary.md)"
  - "Defining product-specific implementation details"
  - "Mapping technology-specific components to parent ABBs"
---

# Solution Building Block (SBB) — Document Standard

This standard defines the structure, sections, and conventions for a Solution Building Block document. An SBB realises an Architecture Building Block (ABB) using specific products, services, and deployment patterns.


## File Structure

Each SBB is a folder named by its identifier, placed under `building-blocks/solution-building-blocks/`:

```
building-blocks/
  solution-building-blocks/
    SBB-001/
      index.md            # The SBB document (this standard)
      summary.md          # Plain-text summary content
      summary.drawio      # Summary panel diagram (see Summary Panel section)
      summary.png         # Exported PNG of the summary panel
      components.drawio   # Component diagram (see standard-sbb-diagram.md)
      components.png      # Exported PNG of the component diagram
```

### Identifier Assignment

- SBB identifiers use the format `SBB-NNN` (zero-padded to 3 digits).
- When creating a new SBB, use the next available sequential number.
- The folder name MUST match the SBB identifier exactly (e.g. `SBB-011/`).


## Document Structure

### Front Matter

YAML front matter with Docusaurus-compatible metadata and building block identity:

```yaml
---
# Docusaurus presentation
title: "<SBB-ID> <SBB Name>"
sidebar_label: "<SBB-ID> <SBB Name>"
sidebar_position: <integer>

# Universal envelope (required)
id: <SBB-NNN>                          # must match the folder name and the ^SBB-\d{3}$ pattern
kind: sbb
version: "0.1.0"                       # semver: major.minor.patch
status: draft                          # draft | proposed | accepted | active | deprecated | superseded | retired
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
last_modified_by: "<Author name>"      # who last edited (replaces the old `author` field)
owner: "<Owning team or person>"

# Envelope (optional but recommended)
short_name: "<Acronym or abbreviation for diagrams and cross-references>"

# SBB-specific (required by sbb.schema.json)
realises: [<ABB-NNN>, ...]             # one or more parent ABBs this SBB realises (≥1)
products:                              # ≥1 concrete product/service
  - { name: "<Product name>", vendor: "<Vendor>", licensing: "<Licensing model>" }
product_mapping:                       # ≥1 ABB-component → SBB-product row
  - { abb_component: "<ABB component>", sbb_product: "<Product / service>", notes: "<Implementation detail>" }

# SBB-specific (optional)
cloud_provider: <azure | aws | gcp | onprem | multi | none>
deployment_model: <managed | self-hosted | hybrid>
---
```

The front matter captures all identity and classification metadata for the SBB. Do NOT duplicate this information in a Document Control table in the body. The fields above validate against [`sbb.schema.json`](../../schemas/v1.1.0/sbb.schema.json) (which composes the universal [`envelope.schema.json`](../../schemas/v1.1.0/envelope.schema.json)); see the [Frontmatter Standard](../../standard-frontmatter.md) for the full field catalogue. Composite SBBs add `composite`, `ports`, `parts`, and `connectors` — see the Composite SBBs section below.

### Heading

```markdown
# <SBB-ID> <SBB Name>
```

### Section 1 — Purpose

**Heading:** `## 1  Purpose`

A paragraph that:

1. Names the ABB this SBB realises (with a link to the ABB document using a folder-relative path).
2. States the specific products, platforms, and cloud providers used.
3. Describes the deployment topology at a high level.
4. If variants exist (e.g. Teams vs Outlook), names the sibling SBBs and states what differs.


### Section 2 — Building Block

**Heading:** `## 2  Building block`

#### 2.1 Component Diagram

**Heading:** `### 2.1  Component Diagram`

A brief introductory paragraph that describes what the diagram shows — the scope boundary, the vendor/platform groupings, and how to read the layout. This orients the reader before they examine the diagram itself.

Embed the exported PNG of the component diagram immediately after the paragraph:

```markdown
### 2.1  Component Diagram

<Introductory paragraph describing the diagram.>

![<SBB-ID> <Diagram Title> Component Diagram](components.png)
```

#### 2.2 Product Mapping (ABB → SBB)

**Heading:** `### 2.2  Product mapping (ABB → SBB)`

A table mapping every ABB component to its SBB product or service:

| ABB Component | SBB Product / Service | Notes |
|---------------|----------------------|-------|
| ABB component name | Specific product/service | Implementation details |

Every component listed in the parent ABB's Section 2.2 MUST appear in this table, including components from the three mandatory cross-cutting sub-ABBs (IAM, Observability, Governance & Policy).

#### 2.3 Key Design Decisions

**Heading:** `### 2.3  Key design decisions`

Bullet list of significant architectural decisions. Each entry is a bold decision title followed by a description:

```markdown
- **<Decision Title>**. <Rationale and implications.>
```

#### 2.4 Message Flow

**Heading:** `### 2.4  Message flow`

A numbered sequence describing the end-to-end message flow through the SBB. Each step names the specific product or component involved.


### Mandatory Cross-Cutting Sections

Every SBB MUST include the following three cross-cutting sections. These correspond to the mandatory sub-ABB groups defined in the parent ABB and MUST appear as vendor/platform containers in the SBB component diagram (see the SBB diagram standard).

Where the ABB describes these concerns in technology-agnostic terms, the SBB names the specific products and services that realise them.

#### 2.5 Identity & Access Management

**Heading:** `### 2.5  Identity & Access Management`

Describe the specific products and services that provide IAM:

```markdown
- **<Product / Mechanism>**. <How it provides identity and access control in this SBB.>
```

Cover: identity providers, authentication protocols, authorisation mechanisms, workload identity, credential management, and federation.

#### 2.6 Observability

**Heading:** `### 2.6  Observability`

Describe the specific products and services that provide observability and audit:

```markdown
- **<Product / Capability>**. <What it captures and how it supports compliance.>
```

Cover: distributed tracing, metrics and dashboards, audit logs, sign-in logs, and compliance reporting.

#### 2.7 Governance & Policy Enforcement

**Heading:** `### 2.7  Governance & Policy Enforcement`

Describe the specific products and services that enforce governance and policy:

```markdown
- **<Product / Mechanism>**. <How it enforces policy in this SBB.>
```

Cover: conditional access, DLP policies, data classification enforcement, regulatory alignment (GDPR, AI Act), and change governance.


#### 2.8 Channel/Domain-Specific Constraints

**Heading:** `### 2.8  <Channel/Domain>-Specific Constraints`

Replace `<Channel/Domain>` with the relevant context (e.g. "Channel", "API", "Batch").

Document constraints using these dimensions (include only those that apply):

- **Message Payload Limits.** Size limits, attachment handling.
- **Interaction Latency.** Timeout values, expected response times.
- **User Lifecycle.** Membership requirements, deprovisioning behaviour.
- **Rate Limiting & Throttling.** API limits, backoff requirements.
- **Fallback & Retry Logic.** Failure handling, escalation, recovery.
- **Rich Content Support.** Card formats, media, action types.

#### 2.9 Dwell & Escalation Policies (Optional)

**Heading:** `### 2.9  Dwell & Escalation Policies`

Include this section when the SBB involves human interaction with time-sensitive responses.


### Section 3 — Interfaces

**Heading:** `## 3  Interfaces`

#### 3.1 Overview

**Heading:** `### 3.1  Overview`

A table listing all interfaces at the SBB (product/service) level:

| ID | Direction | Type | Description (SBB-specific) |
|----|-----------|------|---------------------------|
| **I1** | Source Product → Target Product | Type | What flows across this interface |

Interface IDs SHOULD align with the parent ABB's interface IDs where the mapping is one-to-one.

#### 3.2 Dependent Building Blocks

**Heading:** `### 3.2  Dependent building blocks`

A table mapping SBB-to-SBB dependencies at the product level:

| SBB Dependency | Product / Service | Interface |
|----------------|------------------|-----------|
| Source → Target | Specific product | I-refs (e.g. I1, I2) |


### Section 4 — Mapping

**Heading:** `## 4  Mapping`

#### 4.1 Entity Mapping

**Heading:** `### 4.1  Entity mapping`

For each major component or actor in the SBB, state the product/service and its role.

#### 4.2 Policy Mapping

**Heading:** `### 4.2  Policy mapping`

List each relevant policy and how the SBB enforces it with specific products.


### Section 5 — ABB Traceability

**Heading:** `## 5. ABB Traceability`

A paragraph stating which ABB this SBB realises and confirming that every ABB component is accounted for.

Followed by a traceability table:

| ABB Capability | SBB Realisation |
|----------------|-----------------|
| ABB component name | Specific product/service and how it realises the capability |

Every component from the parent ABB's Section 2.2 MUST appear in this table, including components from the mandatory cross-cutting sub-ABBs.


### Section 6 — Revision History

**Heading:** `## 6. Revision History`

A table tracking all changes:

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1 | YYYY-MM-DD | Initial Draft | Placeholder definition created. |

**Change Type** values: `Initial Draft`, `Initial Review`, `Architecture Review`, `Guidance`, `Approved`, `Deprecated`.

Entries are listed in reverse chronological order (newest first).


## Summary Panel (`summary.drawio` / `summary.png`)

Every SBB folder MUST include a `summary.drawio` file and its exported `summary.png`. The summary panel is a Draw.io diagram containing styled text blocks that renders at **960 x 1080** — sized to be pasted into the **right half** of a 1920 x 1080 presentation slide alongside the component diagram on the left.

### File Structure

```
SBB-NNN/
  summary.drawio    # Draw.io text panel (this section)
  summary.png       # Exported PNG of the summary panel
```

### Canvas & Layout

- **Page mode:** Disabled (`page="0"` in the `mxGraphModel`). This tells Draw.io to export the bounding box of the diagram content rather than a fixed page rectangle.
- **Content width:** 768px (80% of 960), left margin 96px (`x="96"`). Top margin 40px (`y="40"`).
- **Cell height:** The text cell height MUST match the rendered text height exactly so that no empty space appears below the last line. Set the height, export to PNG, inspect the result, and adjust the height downward until the image crops tightly to the final line of text.
- **Font family:** Helvetica throughout.

### Visual Structure

The entire panel is a **single Draw.io text cell** containing all sections as one HTML block. No title bar, metadata line, separator lines, tables, or multiple cells — just one cell with section headings and bulleted text. This maximises the content area and allows the largest possible font size. See the [ABB Document Standard](../architecture-building-blocks/standard-abb-document.md) for shared style tokens.

- **Font size:** Start at **16pt** and reduce only if the content exceeds 1080px in height (the maximum for a half-slide). The goal is the largest font size that fits.
- **Section headings:** Bold, colour `1.1`. Separated from the previous section by a blank line (`<br><br>`).
- **Body text:** Colour `3.1`, normal weight. Bulleted lists use `•` characters.
- **Bold lead-ins:** Each bullet starts with a bold term followed by a full stop and a space (not a dash). Example: `• **Name.** Description text.`

### Sections (in order)

1. **Purpose** — 2-3 sentences naming parent ABB, products, and topology.
2. **Product Mapping** — Bulleted list, maximum 8-10 items. `• **ABB Component.** Product / Service.`
3. **Cross-Cutting Posture** — Three bullets (one per concern): `• **Identity & Access.** Products.` / `• **Observability.** Products.` / `• **Governance & Policy.** Products.`
4. **Key Design Decisions** — Bulleted list, maximum 3-4 items. `• **Decision.** Rationale.`
5. **Key Interfaces** — Bulleted list, maximum 6 items. `• **I1** Source → Target. Description.`

### Conventions

- The panel MUST be a single Draw.io text cell (one `mxCell`), not multiple cells.
- No title bar, metadata line, horizontal rules, or tables in the panel.
- All content is plain bulleted text under section headings.
- Bullet lead-ins use a full stop and space (`. `) as separator, not a dash (` — `).
- Maximum **8-10 product mappings** and **6 interfaces** listed; group or summarise if there are more.
- Font size SHOULD be **16pt**; reduce only if content height exceeds 1080px.
- The summary panel is technology-specific — name products and vendors.
- The summary panel is a derivative of `index.md` — keep it in sync when the main document changes.
- The `summary.md` file is retained as a plain-text source for the panel content.


## Composite SBBs

Most SBBs are **simple**: one boundary, a flat product mapping from ABB components to products. A **composite** SBB is instead an *assembly of sub-SBBs* — it has internal structure worth modelling explicitly. The framework models that structure with the UML 2 composite-structure grammar: **parts**, **ports**, and **connectors**.

| UML concept | Meaning in an SBB | Frontmatter field |
|---|---|---|
| **Part** | A typed role inside the composite, normally played by a sub-SBB (composite-of-composites). | `parts[]` |
| **Port** | An interaction point on the SBB boundary. `provided` = a contract offered (ball/lollipop); `required` = a contract consumed (socket). | `ports[]` |
| **Connector — delegation** | Forwards a boundary port inward to the part that implements (or needs) it. | `connectors[].type: delegation` |
| **Connector — assembly** | Wires one part's *required* interface to another part's *provided* interface (ball-and-socket). | `connectors[].type: assembly` |

The composite structure is declared in frontmatter (see [Frontmatter Standard §6.7.1](../../standard-frontmatter.md#671-composite-sbbs-uml-composite-structure)) and drawn with the Mermaid composite-structure convention in the [SBB Diagram Standard](./standard-sbb-diagram.md#composite-structure-diagrams-mermaid). Ports map to TOGAF service contracts: a `provided` port is the SBB-level realisation of one of the parent ABB's `interfaces` (link them with `ports[].abb_interface`), so the technology-agnostic contract on the ABB stays stable while the products beneath the SBB change ([Executable Contracts Standard](../../agent-native/executable-contracts.md)).

### <a id="composite-vs-simple-sbbs"></a>When to use composite vs simple SBBs

Use a **composite SBB** when **two or more** of the following hold:

- The realisation decomposes into **sub-SBBs that are independently versioned, deployed, or owned** (each is a candidate for its own folder and its own runtime Service).
- The internal wiring is itself an architectural decision — the **assembly** of parts, not just the parts, carries meaning (e.g. an order-execution part must sit behind a risk-check part).
- The SBB exposes a **small, stable boundary contract** (a handful of ports) over a **larger, churning interior** — the classic Thinnest-Viable-Platform / blast-radius-containment shape ([Agent-Native principle P8](../../agent-native/principles.md)).
- You want the parts to be **substitutable**: a part typed by a sub-SBB can be swapped for a sibling sub-SBB that provides the same port contracts.

Use a **simple SBB** (omit `composite`, `ports`, `parts`, `connectors`; keep the flat `product_mapping`) when:

- The SBB is **one product or one tightly-coupled product family** with no meaningful internal seam (e.g. SBB-001 Identity Lifecycle Service realised entirely on Microsoft Entra).
- Decomposition would create sub-SBBs that are **never reused or deployed independently** — the seam would be fiction.
- The realisation is small enough that one component diagram and one product-mapping table tell the whole story.

> **Rule of thumb:** if you would draw boxes-inside-a-box and the inner boxes have their own lifecycles, it is composite. If you would draw one box with a parts list, it is simple. When in doubt, start simple — promoting a simple SBB to composite later is additive (add the four fields; the existing `product_mapping` stays as the per-part detail).

### Composite-specific document sections

A composite SBB's `index.md` adds two things to the structure above:

1. **§2.1 Component Diagram** uses the **Mermaid composite-structure diagram** (parts as nested subgraphs, ports on the boundary, connectors between them) — see the diagram standard. The Draw.io `components.drawio`/`.png` pair is **optional** for composites; the Mermaid block is the normative view because it renders the parts/ports/connectors directly from the frontmatter and stays diffable.
2. A new subsection **§2.10 Composite Structure** that documents, in prose + tables, the parts, ports, and connectors:

```markdown
### 2.10  Composite structure

This SBB is composite. It assembles the sub-SBBs below behind a <N>-port boundary.

**Boundary ports**

| Port | Direction | Protocol | Contract | Realises ABB interface |
|------|-----------|----------|----------|------------------------|
| `order-api` | provided | REST/HTTP | openapi/v3 | I1 |

**Parts**

| Part (role) | Sub-SBB | Responsibility | Multiplicity |
|-------------|---------|----------------|--------------|
| `bar-builder` | [SBB-310](../SBB-310/) | Aggregates ticks into OHLCV bars | 1 |

**Connectors**

| From | To | Type | Notes |
|------|----|------|-------|
| `order-api` | `order-router.command-in` | delegation | Boundary order requests routed to the order router. |
| `bar-builder.bars-out` | `signal-generator.bars-in` | assembly | Bars feed signal generation. |
```

Every `parts[].sbb` MUST also appear in the SBB's `contains` relation (and the sub-SBB carries the inverse `part_of`), so the composition is bidirectionally traceable per the [Traceability Standard](../../standard-traceability.md).

A complete worked example lives at [`example-composite/`](./example-composite/) (`SBB-301 Strategy Engine`): a composite SBB assembling three sub-SBBs behind a two-port boundary, with the matching Mermaid composite diagram and §2.10 tables. For a simple SBB, see [`example/`](./example/).


## Conventions

- **Language:** Use British English spelling (e.g. "organisation", "localisation", "behaviour").
- **Tone:** Technology-specific. SBBs name products and vendors — this is where concrete implementation details belong.
- **Horizontal rules:** Do not use `---` horizontal rules between sections. Markdown headings provide sufficient visual separation.
- **ABB alignment:** Every ABB component and interface MUST be traceable in the SBB. Use the same interface IDs where the mapping is one-to-one.
- **PNG export:** All `.drawio` files MUST be exported to PNG at **300 DPI** to ensure small text remains legible in presentations. Use the Draw.io CLI flag `--scale 3.125` (300 ÷ 96 = 3.125) or set the DPI in the Draw.io desktop export dialog.
- **Bullet lead-ins:** When a bullet starts with a bold term, follow it with a full stop and a space, not a dash. Write `**Name.** Description text.` not `**Name** — Description text.`
- **Inline emphasis:** Do not use dash-bracketed callouts (` — like this — `) or bold text for emphasis within running sentences. Keep prose plain; reserve bold for lead-in terms at the start of bullets.
- **Cross-references:** All links to other building blocks MUST use relative folder paths (e.g. `../SBB-010/`, `../../architecture-building-blocks/ABB-008/`), never `index.md` explicitly. See the [Traceability & Hierarchy Standard](../../standard-traceability.md) for full rules and examples.
- **Variants:** When multiple SBBs realise the same ABB (e.g. different channels), each SBB document should reference its siblings and state what differs.


## AI Agent Self-Verification Checklist

Before finalising an SBB document, verify:

1. [ ] **ABB Traceability**: Does Section 1 and Section 5 link back to the parent ABB using folder-relative paths?
2. [ ] **Product Mapping**: Does Section 2.2 map every component from the parent ABB to a specific product/service?
3. [ ] **Cross-Cutting Sections**: Does the document include all three mandatory sections — 2.5 (IAM), 2.6 (Observability), 2.7 (Governance & Policy)?
4. [ ] **Technology-Specific**: Does the document correctly name products, vendors, and cloud providers?
5. [ ] **Interface Alignment**: Do Interface IDs align with the parent ABB where the mapping is one-to-one?
6. [ ] **Folder-Relative Links**: Did you avoid using `index.md` in any cross-references?
7. [ ] **Cross-Cutting Diagram**: Does the component diagram show IAM, Observability, and Governance & Policy as containers with products?
8. [ ] **Revision History**: Is the versioning and history updated for this change?
9. [ ] **Summary Panel**: Do `summary.drawio` and `summary.png` exist and are they in sync with `index.md`?
10. [ ] **Composite (if applicable)**: If `composite: true`, are `parts` (≥1) and `connectors` (≥1) declared, is there a §2.10 Composite Structure section, and does §2.1 use the Mermaid composite-structure diagram?
11. [ ] **Composite traceability (if applicable)**: Does every `parts[].sbb` appear in `contains`, with the inverse `part_of` on the sub-SBB, and does every boundary `provided` port link to a parent ABB interface via `abb_interface`?


## Quick Reference Sections

1. **Purpose**: Realises `<ABB-ID>` + Specific Products + Deployment Topology.
2. **Building block**: Diagram + Product Mapping + Design Decisions + Message Flow + **IAM** + **Observability** + **Governance & Policy** + Constraints.
3. **Interfaces**: ID + Source/Target Products + Type + Description.
4. **Mapping**: Entity and Policy mapping at product level.
5. **ABB Traceability**: Capability-to-Realisation mapping table.
6. **Revision History**: Semantic versioning log.
