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
    SB-001/
      index.md            # The SBB document (this standard)
      summary.md          # Plain-text summary content
      summary.drawio      # Summary panel diagram (see Summary Panel section)
      summary.png         # Exported PNG of the summary panel
      components.drawio   # Component diagram (see standard-sbb-diagram.md)
      components.png      # Exported PNG of the component diagram
```

### Identifier Assignment

- SBB identifiers use the format `SB-NNN` (zero-padded to 3 digits).
- When creating a new SBB, use the next available sequential number.
- The folder name MUST match the SBB identifier exactly (e.g. `SB-011/`).


## Document Structure

### Front Matter

YAML front matter with Docusaurus-compatible metadata:

```yaml
---
title: "<SBB-ID> <SBB Name>"
sidebar_label: "<SBB-ID> <SBB Name>"
sidebar_position: <integer>
---
```

### Heading

```markdown
# <SBB-ID> <SBB Name>
```

### Document Control

A metadata table immediately after the heading:

| Property | Value | Notes |
|----------|-------|-------|
| **SBB ID** | `SB-NNN` | Unique identifier. Sequential numbering, zero-padded to 3 digits. |
| **SBB Name** | Full name | Human-readable name including the channel or platform variant. |
| **Short Name** | Acronym/abbreviation | Used in diagrams and cross-references. |
| **Version** | `MAJOR.MINOR.PATCH` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Category** | Category name | Logical grouping (e.g. `Messaging & Integration`, `Security`, `Compute`). |


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

![<SBB-ID> <Diagram Title> Component Diagram](./components.png)
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
SB-NNN/
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


## Conventions

- **Language:** Use British English spelling (e.g. "organisation", "localisation", "behaviour").
- **Tone:** Technology-specific. SBBs name products and vendors — this is where concrete implementation details belong.
- **Horizontal rules:** Do not use `---` horizontal rules between sections. Markdown headings provide sufficient visual separation.
- **ABB alignment:** Every ABB component and interface MUST be traceable in the SBB. Use the same interface IDs where the mapping is one-to-one.
- **PNG export:** All `.drawio` files MUST be exported to PNG at **300 DPI** to ensure small text remains legible in presentations. Use the Draw.io CLI flag `--scale 3.125` (300 ÷ 96 = 3.125) or set the DPI in the Draw.io desktop export dialog.
- **Bullet lead-ins:** When a bullet starts with a bold term, follow it with a full stop and a space, not a dash. Write `**Name.** Description text.` not `**Name** — Description text.`
- **Inline emphasis:** Do not use dash-bracketed callouts (` — like this — `) or bold text for emphasis within running sentences. Keep prose plain; reserve bold for lead-in terms at the start of bullets.
- **Cross-references:** All links to other building blocks MUST use relative folder paths (e.g. `../SB-010/`, `../../architecture-building-blocks/AB-008/`), never `index.md` explicitly. See the [Traceability & Hierarchy Standard](../../standard-traceability.md) for full rules and examples.
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


## Quick Reference Sections

1. **Purpose**: Realises `<ABB-ID>` + Specific Products + Deployment Topology.
2. **Building block**: Diagram + Product Mapping + Design Decisions + Message Flow + **IAM** + **Observability** + **Governance & Policy** + Constraints.
3. **Interfaces**: ID + Source/Target Products + Type + Description.
4. **Mapping**: Entity and Policy mapping at product level.
5. **ABB Traceability**: Capability-to-Realisation mapping table.
6. **Revision History**: Semantic versioning log.
