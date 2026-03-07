---
document_type: standards
title: "Architecture Building Block (ABB) — Document Standard"
classification: internal
version: 2.1
status: approved
created: 2024-10-01
last_modified: 2026-03-08
owner: "Architecture Team"
triggers:
  - "Creating or modifying ABB narrative documents (index.md)"
  - "Creating or updating ABB summary documents (summary.md)"
  - "Defining logical capabilities and interfaces"
  - "Writing technology-agnostic architecture descriptions"
---

# Architecture Building Block (ABB) — Document Standard

This standard defines the structure, sections, and conventions for an Architecture Building Block document aligned to TOGAF. Every ABB document MUST follow this structure. Refer to the `example/` folder for a concrete implementation (AB-008 Human-in-the-Loop).

---

## File Structure

Each ABB is a folder named by its identifier, placed under `building-blocks/architecture-building-blocks/`:

```
building-blocks/
  architecture-building-blocks/
    AB-001/
      index.md            # The ABB document (this standard)
      summary.md          # Plain-text summary content
      summary.drawio      # Summary panel diagram (see Summary Panel section)
      summary.png         # Exported PNG of the summary panel
      components.drawio   # Component diagram (see standard-abb-diagram.md)
      components.png      # Exported PNG of the component diagram
```

### Identifier Assignment

- ABB identifiers use the format `AB-NNN` (zero-padded to 3 digits).
- When creating a new ABB, use the next available sequential number.
- The folder name MUST match the ABB identifier exactly (e.g. `AB-008/`).

---

## Document Structure

### Front Matter

YAML front matter with Docusaurus-compatible metadata:

```yaml
---
title: "<ABB-ID> <ABB Name>"
sidebar_label: "<ABB-ID> <ABB Name>"
sidebar_position: <integer>
---
```

### Heading

```markdown
# <ABB Name>
```

### Document Control

A metadata table immediately after the heading:

| Property | Value | Notes |
|----------|-------|-------|
| **ABB ID** | `AB-NNN` | Unique identifier. Sequential numbering, zero-padded to 3 digits. |
| **ABB Name** | Full name | Human-readable name of the building block. |
| **Short Name** | Acronym/abbreviation | Used in diagrams and cross-references. |
| **Version** | `MAJOR.MINOR.PATCH` | Semantic versioning. |
| **Status** | `DRAFT` / `REVIEW` / `APPROVED` / `DEPRECATED` | Current lifecycle status. |
| **Category** | Category name | Logical grouping (e.g. `Messaging & Integration`, `Security`, `Compute`). |

### Description

A single paragraph immediately after Document Control that defines the building block in technology-agnostic terms. State what the ABB captures and its scope boundary.

---

### Section 1 — Purpose

**Heading:** `## 1  Purpose`

Explain *why* this building block exists. Describe the architectural need it addresses, the problem space, and the value it provides. Keep this technology-agnostic — no product names.

---

### Section 2 — Building Block

**Heading:** `## 2  Building block`

#### Component Diagram

Embed the exported PNG of the component diagram:

```markdown
## Component Diagram

![<ABB-ID> <Diagram Title> Component Diagram](./components.png)
```

#### 2.1 Fundamental Functionality

**Heading:** `### 2.1  Fundamental functionality`

List each component shown in the diagram. Use this format for each:

```markdown
**<Component Name>** — <One to two sentence description of what this component does within the ABB.>
```

Components should be listed in logical order (e.g. top-to-bottom as they appear in the diagram, or grouped by the sub-ABB they belong to).

#### 2.2 Attributes

**Heading:** `### 2.2  Attributes`

List non-functional qualities the ABB exhibits. Each attribute is a bold name followed by a description:

```markdown
**<Attribute Name>** — <Description of how this quality is achieved.>
```

Common attributes include: Scalability, Localisability, Resilience, Performance, Extensibility. Include only those that are architecturally significant for this ABB.

#### 2.3 Semantic

**Heading:** `### 2.3  Semantic`

A paragraph that defines the ABB's meaning and scope boundary in precise architectural language. Clarify what is *inside* the boundary and what is *excluded*.

---

### Mandatory Cross-Cutting Sections

Every ABB MUST include the following three cross-cutting sections. These correspond to mandatory sub-ABB groups that MUST appear in the component diagram (see the diagram standard). They are not optional — even if an ABB's cross-cutting posture is simple, each section must explicitly state how the concern is addressed.

**Rationale:** TOGAF mandates security capability and manageability for every building block. NIST CSF 2.0 elevated Governance to a cross-cutting central function. Zero Trust Architecture (NIST SP 800-207) requires verifiable identity for every resource. The EU AI Act (effective August 2026) mandates logging, governance, and human oversight. All three major cloud Well-Architected Frameworks treat security, operational excellence, and governance as non-negotiable pillars.

#### 2.4 Identity & Access Management

**Heading:** `### 2.4  Identity & Access Management`

Describe the ABB's identity and access posture in technology-agnostic terms:

- **Authentication model** — How callers and the ABB itself are identified (e.g. federated identity, workload identity, certificate-based).
- **Authorisation approach** — How access decisions are made (e.g. role-based, attribute-based, policy-driven).
- **Non-human identity** — How the ABB's own workload identity is established and managed.
- **Credential management** — Approach to secrets, tokens, and key material (e.g. no stored secrets, short-lived tokens).

#### 2.5 Observability

**Heading:** `### 2.5  Observability`

Describe how the ABB is monitored, traced, and audited:

- **Signals emitted** — What logs, metrics, and traces the ABB produces.
- **Audit trail** — What decisions, state transitions, and access events are recorded for compliance.
- **Health and liveness** — How operational health is measured and reported.
- **Compliance data feeds** — How observability data supports regulatory requirements (e.g. GDPR, AI Act).

#### 2.6 Governance & Policy Enforcement

**Heading:** `### 2.6  Governance & Policy Enforcement`

Describe how the ABB is governed and how policies are enforced:

- **Policy enforcement** — How policy decisions are applied (e.g. deny, allow, step-up authentication).
- **Regulatory alignment** — Which regulations or standards this ABB must comply with and how.
- **Data classification** — What category of data this ABB handles (none, PII, sensitive, regulated) and the protection posture.
- **Change governance** — Who can modify the ABB's configuration or behaviour, and through what process.

---

### Section 3 — Interfaces

**Heading:** `## 3  Interfaces`

#### 3.1 Overview

**Heading:** `### 3.1  Overview`

A table listing all interfaces:

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Source → Target | Type (e.g. Message payload, Token exchange, Event stream) | What flows across this interface |

Interface IDs use the format `I<N>` with sequential numbering.

**Direction** uses the pattern `<Source Component/ABB> → <Target Component/ABB>`.

#### 3.2 Interoperability

**Heading:** `### 3.2  Interoperability`

Describe how the interfaces enable loose coupling and interoperability. Explain which interfaces define normalised models and what standards they conform to.

#### 3.3 Dependent Building Blocks

**Heading:** `### 3.3  Dependent building blocks`

A table mapping ABB-to-ABB dependencies:

| ABB | Required functionality | Named interface |
|-----|----------------------|--------------------|
| Source ABB → Target ABB | What the dependency provides | I-refs (e.g. I1, I2) |

---

### Section 4 — Mapping

**Heading:** `## 4  Mapping`

#### 4.1 Mapping to Business/Organisational Entities

**Heading:** `### 4.1  Mapping to business/organisational entities`

For each major component or actor in the ABB, state the business entity it maps to:

```markdown
**<Component/Actor>** → <Business entity or organisational function.>
```

#### 4.2 Mapping to Business/Organisational Policies

**Heading:** `### 4.2  Mapping to business/organisational policies`

List each relevant policy and how the ABB supports or enforces it:

```markdown
**<Policy Name>** — <How this ABB aligns with or enforces the policy.>
```

---

### Section 5 — Solution Building Block (SBB) Guidance

**Heading:** `## 5. Solution Building Block (SBB) Guidance`

This section bridges the ABB to concrete implementations. It provides guidance for teams creating Solution Building Blocks that realise this ABB.

#### 5.1 Structural Pattern for SBBs

**Heading:** `### 5.1  Structural Pattern for <Type> SBBs`

Describe the common structural pattern that all SBBs inheriting this ABB should follow.

#### 5.2 Shared Patterns

**Heading:** `### 5.2  Shared Patterns`

List patterns and capabilities that SBBs inherit directly from the ABB and MUST NOT replicate.

#### 5.3 SBB-Specific Constraints

**Heading:** `### 5.3  <Type>-Specific Constraints`

List the dimensions each SBB must document for its specific context.

---

### Section 6 — Revision History

**Heading:** `## 6. Revision History`

A table tracking all changes:

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1 | YYYY-MM-DD | Initial Draft | Placeholder definition created. |

**Change Type** values: `Initial Draft`, `Initial Review`, `Architecture Review`, `Guidance`, `Approved`, `Deprecated`.

Entries are listed in reverse chronological order (newest first).

---

## Summary Panel (`summary.drawio` / `summary.png`)

Every ABB folder MUST include a `summary.drawio` file and its exported `summary.png`. The summary panel is a Draw.io diagram containing styled text blocks that renders at **960 x 1080** — sized to be pasted into the **right half** of a 1920 x 1080 presentation slide alongside the component diagram on the left.

### File Structure

```
AB-NNN/
  summary.drawio    # Draw.io text panel (this section)
  summary.png       # Exported PNG of the summary panel
```

### Canvas & Layout

- **Page mode:** Disabled (`page="0"` in the `mxGraphModel`). This tells Draw.io to export the bounding box of the diagram content rather than a fixed page rectangle.
- **Content width:** 768px (80% of 960), left margin 96px (`x="96"`). Top margin 40px (`y="40"`).
- **Cell height:** The text cell height MUST match the rendered text height exactly so that no empty space appears below the last line. Set the height, export to PNG, inspect the result, and adjust the height downward until the image crops tightly to the final line of text.
- **Font family:** Helvetica throughout.

### Visual Structure

The entire panel is a **single Draw.io text cell** containing all sections as one HTML block. No title bar, metadata line, separator lines, tables, or multiple cells — just one cell with section headings and bulleted text. This maximises the content area and allows the largest possible font size.

- **Font size:** Start at **16pt** and reduce only if the content exceeds 1080px in height (the maximum for a half-slide). The goal is the largest font size that fits.
- **Section headings:** Bold, colour `1.1`. Separated from the previous section by a blank line (`<br><br>`).
- **Body text:** Colour `3.1`, normal weight. Bulleted lists use `•` characters.
- **Bold lead-ins:** Each bullet starts with a bold term followed by a full stop and a space (not a dash). Example: `• **Name.** Description text.`

### Sections (in order)

1. **Purpose** — 2-3 sentences.
2. **Key Components** — Bulleted list, maximum 6-8 items. `• **Name.** Description.`
3. **Cross-Cutting Posture** — Three bullets (one per concern): `• **Identity & Access.** Approach.` / `• **Observability.** Approach.` / `• **Governance & Policy.** Approach.`
4. **Key Interfaces** — Bulleted list, maximum 6 items. `• **I1** Source → Target. Description.`
5. **Policy Alignment** — Bulleted list. `• **Policy Name.** How the ABB supports it.`

### Style Tokens

| Element | Fill | Stroke | Text Colour | Font |
|---------|------|--------|-------------|------|
| Section heading | none | none | `1.1` | 16pt bold (or largest that fits) |
| Body text | none | none | `3.1` | 16pt (or largest that fits) |

### Conventions

- The panel MUST be a single Draw.io text cell (one `mxCell`), not multiple cells.
- No title bar, metadata line, horizontal rules, or tables in the panel.
- All content is plain bulleted text under section headings.
- Bullet lead-ins use a full stop and space (`. `) as separator, not a dash (` — `).
- Maximum **6-8 components** and **6 interfaces** listed; group or summarise if there are more.
- Font size SHOULD be **16pt**; reduce only if content height exceeds 1080px.
- All text must be technology-agnostic (same as the main document).
- The summary panel is a derivative of `index.md` — keep it in sync when the main document changes.
- The `summary.md` file is retained as a plain-text source for the panel content.

---

## Conventions

- **Language:** Use British English spelling (e.g. "organisation", "localisation", "behaviour").
- **Tone:** Technology-agnostic. No product or vendor names in the ABB document; those belong in SBBs.
- **Horizontal rules:** Use `---` between major sections for visual separation.
- **Component descriptions:** Keep to one or two sentences. The diagram provides the visual context.
- **Interface IDs:** Referenced consistently between the Overview table (Section 3.1), the diagram, and the Dependent Building Blocks table (Section 3.3).
- **PNG export:** All `.drawio` files MUST be exported to PNG at **300 DPI** to ensure small text remains legible in presentations. Use the Draw.io CLI flag `--scale 3.125` (300 ÷ 96 = 3.125) or set the DPI in the Draw.io desktop export dialog.
- **Bullet lead-ins:** When a bullet starts with a bold term, follow it with a full stop and a space, not a dash. Write `**Name.** Description text.` not `**Name** — Description text.`
- **Inline emphasis:** Do not use dash-bracketed callouts (` — like this — `) or bold text for emphasis within running sentences. Keep prose plain; reserve bold for lead-in terms at the start of bullets.
- **Cross-references:** All links to other building blocks MUST use relative folder paths (e.g. `../AB-003/`), never `index.md` explicitly. See the [Cross-Referencing Standard](../standard-cross-referencing.md) for full rules and examples.

---

## AI Agent Self-Verification Checklist

Before finalising an ABB document, verify:

1. [ ] **Folder-Relative Links**: Did you use folder-relative paths (e.g. `../AB-003/`) for all links? (No `index.md` in links).
2. [ ] **Technology-Agnostic**: Is the language free of specific product or vendor names?
3. [ ] **Correct Identifier**: Does the `AB-NNN` identifier follow the sequential order and match the folder name?
4. [ ] **Interface Consistency**: Do the Interface IDs (`I1`, `I2`, etc.) match those used in the diagram and Section 3.1 table?
5. [ ] **British English**: Did you use British English spelling (e.g., "organisation", "localisation")?
6. [ ] **Traceability**: Does Section 2.1 list every component shown in the diagram?
7. [ ] **Cross-Cutting Sections**: Does the document include all three mandatory sections — 2.4 (IAM), 2.5 (Observability), 2.6 (Governance & Policy)?
8. [ ] **Cross-Cutting Diagram**: Does the component diagram show IAM, Observability, and Governance & Policy as sub-ABB groups?
9. [ ] **Summary Panel**: Do `summary.drawio` and `summary.png` exist and are they in sync with `index.md`?

---

## Quick Reference Sections

1. **Purpose**: Why it exists (agnostic).
2. **Building block**: Diagram + Functionality + Attributes + Semantic + **IAM** + **Observability** + **Governance & Policy**.
3. **Interfaces**: ID + Direction + Type + Description.
4. **Mapping**: To business entities and policies.
5. **SBB Guidance**: Structural patterns and shared capabilities.
6. **Revision History**: Semantic versioning log.
