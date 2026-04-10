---
document_type: standards
title: "Decision Record (DR) — Document Standard"
classification: internal
version: 1.0
status: draft
created: 2026-04-10
last_modified: 2026-04-10
owner: "Architecture Team"
triggers:
  - "Recording an architectural decision and its rationale"
  - "Evaluating SBB candidates during an assessment"
  - "Documenting why a technology or approach was chosen or rejected"
---

# Decision Record (DR) — Document Standard

This standard defines the structure, sections, and conventions for a Decision Record. A DR captures the rationale behind an architectural decision, typically the selection or rejection of SBB candidates during an assessment. The format follows [MADR](https://github.com/adr/madr) (Markdown Any Decision Records).


## File Structure

Each DR is a folder named by its identifier, placed under `decisions/`:

```
decisions/
  DR-001/
    index.md            # The decision record (this standard)
```

### Identifier Assignment

- DR identifiers use the format `DR-NNN` (zero-padded to 3 digits).
- When creating a new DR, use the next available sequential number.
- The folder name MUST match the DR identifier exactly (e.g. `DR-001/`).


## Document Structure

### Front Matter

YAML front matter with Docusaurus-compatible metadata:

```yaml
---
title: "<DR-ID> <Decision Title>"
sidebar_label: "<DR-ID> <Decision Title>"
sidebar_position: <integer>
---
```

### Heading

```markdown
# <DR-ID> <Decision Title>
```

### Document Control Table

A three-column metadata table immediately after the heading:

| Property | Value | Notes |
|---|---|---|
| **Decision ID** | `DR-NNN` | Unique identifier |
| **Status** | `proposed` | proposed / accepted / rejected / superseded / deprecated |
| **Date** | YYYY-MM-DD | Decision date |
| **Decision Owner** | Team or individual name | Accountable for the decision |
| **Tags** | `tag-1`, `tag-2` | Comma-separated assessment/project tags |
| **Platform** | `[PL-NNN Name](../../platforms/PL-NNN/)` | Owning platform (folder-relative link) |
| **Evaluated SBBs** | `SB-NNN`, `SB-NNN` | SBBs under consideration |

**Status values** for Decision Records follow the MADR convention:

- **proposed** — under discussion, not yet decided
- **accepted** — decision made and approved
- **rejected** — decision considered but not adopted
- **superseded** — replaced by a later DR
- **deprecated** — no longer applicable

### 1. Context and Problem Statement

Describe the context and the problem or opportunity that requires a decision. Reference the assessment or initiative that prompted this DR.

### 2. Decision Drivers

List the key factors, constraints, and requirements that influence the decision:

- Technical constraints
- Business requirements
- Budget limitations
- Compliance obligations
- Integration requirements

### 3. Considered Options

List each option evaluated, with its identifier and a brief description:

1. **SB-NNN Option Name** — brief description
2. **SB-NNN Option Name** — brief description
3. **SB-NNN Option Name** — brief description

### 4. Decision Outcome

State the chosen option and the reasoning:

> Chose **SB-NNN Option Name** because [concise rationale].

Include trade-offs acknowledged and conditions under which the decision should be revisited.

### 5. Consequences

State the concrete effects of this decision:

- Which SBBs change status (e.g. `SB-NNN` status → `draft`, `SB-NNN` status → `rejected`)
- What follow-up work is required
- What risks are accepted


## Traceability

- The DR links to evaluated SBBs via the `| **Evaluated SBBs** |` table row. The graph edge label is `evaluates`.
- The DR links to its owning Platform via `| **Platform** |`. The graph edge label is `owns`.
- Tags enable filtering DRs by assessment or project (e.g. `coupa-jde-eval`).


## AI Agent Self-Verification Checklist

1. [ ] **MADR Structure**: Does the DR follow the five MADR sections (Context, Drivers, Options, Outcome, Consequences)?
2. [ ] **Golden Thread**: Does the DR link to a Platform and at least one SBB?
3. [ ] **Folder-Relative Links**: Are all links relative to the file location?
4. [ ] **No index.md**: Did you verify that no link ends in `index.md`?
5. [ ] **Tags**: If part of an assessment, does the DR carry the assessment tag?
6. [ ] **Consequences Stated**: Does the Decision Outcome section state the status changes to evaluated SBBs?
