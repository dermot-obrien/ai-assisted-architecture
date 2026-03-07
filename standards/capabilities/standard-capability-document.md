---
document_type: standards
title: "Capability — Document Standard"
classification: internal
version: 1.0
status: draft
created: 2026-03-07
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Creating or modifying capability documents (index.md)"
  - "Defining business capabilities and their hierarchy"
  - "Mapping capabilities to Architecture Building Blocks"
  - "Assessing capability maturity"
---

# Capability — Document Standard

This standard defines the structure, sections, and conventions for a Capability document. Capabilities describe **what** an organisation must be able to do, expressed in business terms, independent of **how** it is implemented. They sit above Architecture Building Blocks (ABBs) in the traceability chain and provide the bridge between strategic motivation and architecture.

Following The Open Group's definition, a capability encompasses four components: **organisation**, **people**, **processes**, and **technology**. The technology dimension is realised by ABBs and SBBs — the capability itself remains technology-agnostic.


## Traceability Chain

```
Goal / Outcome
  |  evidenced by
  v
Use Case
  |  requires
  v
Capability  (L1 -> L2 -> L3)       <-- this standard
  |  realised by
  v
Architecture Building Block (ABB)
  |  implemented by
  v
Solution Building Block (SBB)
```

Only **L3 capabilities** map directly to ABBs. L1 and L2 are organisational groupings.


## File Structure

Each capability is a folder named by its identifier, placed under `capabilities/` in the workspace:

```
capabilities/
  capability-model.md             # Master taxonomy (L1/L2/L3)
  CAP-001/
    index.md                      # The capability document (this standard)
  CAP-002/
    index.md
```

### Identifier Assignment

- Capability identifiers use the format `CAP-NNN` (zero-padded to 3 digits).
- When creating a new capability, use the next available sequential number.
- The folder name MUST match the capability identifier exactly (e.g. `CAP-012/`).


## Document Structure

### Front Matter

YAML front matter with Docusaurus-compatible metadata:

```yaml
---
title: "CAP-NNN <Capability Name>"
sidebar_label: "CAP-NNN <Capability Name>"
sidebar_position: <integer>
---
```

### Heading

```markdown
# CAP-NNN <Capability Name>
```

### Document Control

A metadata table immediately after the heading:

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-NNN` | Unique identifier. Sequential numbering, zero-padded to 3 digits. |
| **Capability Name** | Full name | Human-readable name of the capability. |
| **Level** | `L1` / `L2` / `L3` | Position in the capability hierarchy. |
| **Parent** | `CAP-NNN` or `—` | Parent capability ID (for L2 and L3). L1 capabilities have no parent. |
| **Version** | `MAJOR.MINOR.PATCH` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | Platform name | The L1 platform this capability belongs to (e.g. `Models`, `Agents`, `Governance`). |

### Description

A single paragraph immediately after Document Control that defines the capability in business terms. State what the organisation must be able to do and the scope boundary. This MUST be technology-agnostic — no product names.


### Section 1 — Purpose

**Heading:** `## 1  Purpose`

Explain *why* this capability is needed. Describe the business need it addresses, the value it provides, and any strategic drivers. Reference linked Goals if they exist.


### Section 2 — Capability Definition

**Heading:** `## 2  Capability Definition`

#### 2.1 Organisation

**Heading:** `### 2.1  Organisation`

Describe the governance structures, roles, and organisational units required to sustain this capability:

```markdown
- **<Role or Structure>.** <How it contributes to the capability.>
```

#### 2.2 People

**Heading:** `### 2.2  People`

List the skills, knowledge, and competencies needed:

```markdown
- **<Skill or Role>.** <What they contribute and why they are needed.>
```

#### 2.3 Processes

**Heading:** `### 2.3  Processes`

Describe the methods, procedures, and workflows that make this capability operational:

```markdown
- **<Process Name>.** <What it does and how it supports the capability.>
```

#### 2.4 Technology

**Heading:** `### 2.4  Technology`

Describe the technology requirements in **technology-agnostic** terms. This section bridges to the ABB layer — state what technology capabilities are needed, not which products deliver them. Specific products belong in SBBs.

```markdown
- **<Technology Need>.** <What it must provide.>
```


### Section 3 — Maturity

**Heading:** `## 3  Maturity`

#### 3.1 Maturity Model

**Heading:** `### 3.1  Maturity Model`

Assess the capability against the following maturity scale:

| Level | Name | Description |
|-------|------|-------------|
| **0** | None | Capability does not exist. |
| **1** | Initial | Ad-hoc, manual, inconsistent. |
| **2** | Developing | Some automation, documented processes, repeatable. |
| **3** | Defined | Standardised, consistent, proactive. |
| **4** | Managed | Quantitatively managed, SLAs tracked, measured. |
| **5** | Optimising | Continuous improvement, data-driven optimisation, innovation. |

#### 3.2 Current Assessment

**Heading:** `### 3.2  Current Assessment`

| Property | Value |
|----------|-------|
| **Current Maturity** | `0` – `5` |
| **Target Maturity** | `0` – `5` |
| **Assessment Date** | `YYYY-MM-DD` |
| **Assessor** | Name or team |

Provide a brief narrative explaining the current maturity rating — what evidence supports the assessment and what gaps exist.

#### 3.3 Maturity Roadmap

**Heading:** `### 3.3  Maturity Roadmap`

Describe the key steps needed to move from the current maturity level to the target. Each step should be a bullet:

```markdown
- **<Current> → <Target>.** <What must change to advance.>
```

This section is optional for L1 and L2 capabilities. It is REQUIRED for L3 capabilities.


### Section 4 — ABB Realisation

**Heading:** `## 4  ABB Realisation`

This section defines the relationship between this capability and the Architecture Building Blocks that realise it. This is the critical traceability link in the meta-model.

#### 4.1 Relationship Model

**Heading:** `### 4.1  Relationship Model`

The capability-to-ABB relationship follows these rules:

- The relationship is **many-to-many**: a single L3 capability may be realised by multiple ABBs, and a single ABB may contribute to multiple capabilities.
- Only **L3 capabilities** map directly to ABBs. L1 and L2 capabilities aggregate their children's mappings.
- **Cross-cutting ABBs** (e.g. IAM, Observability, Governance) are referenced by most capabilities but are not "owned" by any single capability. Mark these as `cross-cutting` in the mapping table.
- A capability that has no ABB realisation yet is a **gap** — the architecture does not yet support this business need.

#### 4.2 ABB Mapping

**Heading:** `### 4.2  ABB Mapping`

A table mapping this capability to its realising ABBs:

| ABB ID | ABB Name | Relationship | Coverage | Notes |
|--------|----------|-------------|----------|-------|
| [AB-NNN](../../building-blocks/architecture-building-blocks/AB-NNN/) | Name | `primary` / `supporting` / `cross-cutting` | `full` / `partial` | Optional notes |

**Relationship types:**

- **Primary.** The ABB directly realises a core aspect of this capability. Removing it would eliminate the capability.
- **Supporting.** The ABB provides functionality that enhances or enables the capability but is not its primary purpose.
- **Cross-cutting.** The ABB is a shared concern (IAM, Observability, Governance) that applies to this capability as it does to most others.

**Coverage:**

- **Full.** The ABB covers all of the technology needs described in Section 2.4 for this mapping.
- **Partial.** The ABB covers some but not all of the technology needs. Other ABBs or future work are needed.

#### 4.3 Gaps

**Heading:** `### 4.3  Gaps`

List any technology needs from Section 2.4 that are not yet realised by an ABB:

```markdown
- **<Technology Need>.** <What is missing and what the impact is.>
```

If there are no gaps, state "All technology needs are realised by the mapped ABBs."


### Section 5 — Sub-Capabilities

**Heading:** `## 5  Sub-Capabilities`

For L1 and L2 capabilities only. List the child capabilities:

| Capability ID | Name | Level | Maturity |
|---------------|------|-------|----------|
| [CAP-NNN](../CAP-NNN/) | Name | L2 / L3 | 0–5 |

For L3 capabilities, this section is omitted.


### Section 6 — Revision History

**Heading:** `## 6  Revision History`

A table tracking all changes:

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1 | YYYY-MM-DD | Initial Draft | Placeholder definition created. |

**Change Type** values: `Initial Draft`, `Initial Review`, `Architecture Review`, `Approved`, `Deprecated`.

Entries are listed in reverse chronological order (newest first).


## Capability Model File (`capability-model.md`)

The workspace MUST contain a `capabilities/capability-model.md` file that provides the complete capability taxonomy. This is the master index of all capabilities.

### Structure

```markdown
# Capability Model

## <L1 Platform Name>

### <L2 Group Name>

| Capability ID | Name | Level | Current Maturity | Target Maturity |
|---------------|------|-------|-----------------|-----------------|
| [CAP-NNN](./CAP-NNN/) | Name | L3 | 0–5 | 0–5 |
```

### Rules

- Every capability folder MUST have a corresponding entry in `capability-model.md`.
- The taxonomy is the authoritative source for the hierarchy (parent-child relationships).
- Maturity values in the taxonomy MUST match the values in individual capability documents.


## Conventions

- **Language:** Use British English spelling (e.g. "organisation", "optimisation", "behaviour").
- **Tone:** Technology-agnostic. No product or vendor names in capability documents; those belong in SBBs.
- **Horizontal rules:** Do not use `---` horizontal rules between sections. Markdown headings provide sufficient visual separation.
- **Cross-references:** All links to ABBs MUST use relative folder paths (e.g. `../../building-blocks/architecture-building-blocks/AB-001/`). All links to sibling capabilities use `../CAP-NNN/`. See the [Traceability & Hierarchy Standard](../standard-traceability.md) for full rules.
- **Bullet lead-ins:** When a bullet starts with a bold term, follow it with a full stop and a space, not a dash. Write `**Name.** Description text.` not `**Name** — Description text.`
- **L3 granularity:** An L3 capability should be specific enough that it maps to 1–5 ABBs. If an L3 maps to more than 5 ABBs, consider splitting it into multiple L3 capabilities. If it maps to zero ABBs, it is either a gap (document in Section 4.3) or too abstract (demote to L2 and create L3 children).


## AI Agent Self-Verification Checklist

Before finalising a capability document, verify:

1. [ ] **Folder-Relative Links**: Did you use folder-relative paths for all links? (No `index.md` in links).
2. [ ] **Technology-Agnostic**: Is the language free of specific product or vendor names?
3. [ ] **Correct Identifier**: Does the `CAP-NNN` identifier follow the sequential order and match the folder name?
4. [ ] **Level Correct**: Is the capability level (L1/L2/L3) consistent with its position in the hierarchy?
5. [ ] **Parent Set**: For L2/L3 capabilities, is the parent capability ID set correctly?
6. [ ] **ABB Mapping (L3)**: Does Section 4.2 list all ABBs that realise this capability?
7. [ ] **Gaps Documented**: Are unmet technology needs listed in Section 4.3?
8. [ ] **Maturity Assessed**: Does Section 3.2 contain a current maturity assessment?
9. [ ] **Taxonomy Updated**: Is the capability listed in `capability-model.md`?
10. [ ] **British English**: Did you use British English spelling?
11. [ ] **Sub-Capabilities (L1/L2)**: Does Section 5 list all child capabilities?


## Quick Reference Sections

1. **Purpose**: Why this capability is needed (business-driven).
2. **Capability Definition**: Organisation + People + Processes + Technology.
3. **Maturity**: Current assessment, target, and roadmap.
4. **ABB Realisation**: Mapping table, relationship types, coverage, and gaps.
5. **Sub-Capabilities**: Children (L1/L2 only).
6. **Revision History**: Semantic versioning log.
