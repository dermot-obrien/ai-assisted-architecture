---
document_type: standards
title: "Building Block Cross-Referencing Standard"
classification: internal
version: 1.1
status: approved
created: 2024-10-01
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Linking between ABBs and SBBs"
  - "Creating traceability matrices"
  - "Organising building block folder structures"
---

# Building Block Cross-Referencing Standard

This standard defines how Architecture Building Blocks (ABBs) and Solution Building Blocks (SBBs) reference each other in documents, diagrams, and any other artefacts. All agents and authors MUST follow these conventions.

---

## Principle

Every building block document is named `index.md` inside a folder named by its identifier. Static site generators (e.g. Docusaurus) and file browsers resolve folder paths to `index.md` automatically. Therefore, all cross-references MUST use **folder-relative paths** — never reference `index.md` explicitly.

---

## Reference Format

### Within Markdown Documents

Use standard markdown links with a relative path to the target **folder**, not the file:

```markdown
[AB-008 Human-in-the-Loop](../../architecture-building-blocks/AB-008/)
```

### Path Structure

Common reference patterns:

| From | To | Relative Path |
|------|----|---------------|
| ABB → ABB (sibling) | `AB-008` → `AB-003` | `../AB-003/` |
| SBB → SBB (sibling) | `SB-011` → `SB-010` | `../SB-010/` |
| SBB → parent ABB | `SB-011` → `AB-008` | `../../architecture-building-blocks/AB-008/` |
| ABB → child SBB | `AB-008` → `SB-011` | `../../solution-building-blocks/SB-011/` |

---

## AI Agent Self-Verification Checklist

Before finalising any cross-reference, verify:

1. [ ] **Folder-Only**: Did you link to the folder (e.g., `../AB-008/`) and NOT the file (e.g., `../AB-008/index.md`)?
2. [ ] **Relative Paths**: Are all links relative to the current file's location? (No absolute or root-relative paths).
3. [ ] **ID in Text**: Does the link text explicitly include the ID (e.g., `AB-008`)?
4. [ ] **SBB-to-ABB**: Does the SBB Purpose section link back to its parent ABB?
5. [ ] **No index.md**: Did you verify that no link in the document ends in `index.md`?
