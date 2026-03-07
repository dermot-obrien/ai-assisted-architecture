---
document_type: standards
title: "Traceability & Hierarchy Standard"
classification: internal
version: 2.0
status: approved
created: 2024-10-01
last_modified: 2026-03-07
owner: "Architecture Team"
triggers:
  - "Linking between any architectural layers"
  - "Maintaining the unified hierarchy"
  - "Creating traceability matrices"
---

# Traceability & Hierarchy Standard

This standard defines how all architectural layers—from Strategic Outcomes to Runtime Services—reference each other to maintain a "Golden Thread" of traceability.

---

## 1. The Unified Hierarchy

All artifacts must be linked according to the following downward and upward traceability rules:

| Source Layer | Target Layer | Relationship |
| :--- | :--- | :--- |
| **Outcome** | Capability | Outcome *requires* Capability to be achieved. |
| **Use Case** | Outcome | Use Case *supports* the realization of the Outcome. |
| **Use Case** | ABB | Use Case *is realized by* one or more ABBs. |
| **Capability** | Bounded Context | Capability *is technicaly owned and realized by* the Context. |
| **Bounded Context**| ABB | Bounded Context *contains* the logical logical model (ABB). |
| **ABB** | SBB | SBB *is a concrete realization* of the ABB. |
| **SBB** | Service | Service *is the runtime manifestation* of the SBB. |

---

## 2. Linking Conventions

### 2.1 File-Based Traceability (Markdown)
Use folder-relative paths for all links between artifacts. Do not link to `index.md` files explicitly.

**Example Link (Service to SBB):**
`[SB-003 Policy Decision Service](../../building-blocks/solution-building-blocks/SB-003/)`

### 2.2 Metadata Traceability (YAML)
Every artifact must include its parent or related IDs in its front matter or metadata tables to allow for automated matrix generation.

---

## 3. Maintenance Rules

1.  **Orphan Prevention**: No ABB, SBB, or Service should exist without a link to its parent layer.
2.  **Linguistic Consistency**: If a term is defined in a Bounded Context, it must be used consistently in the child ABBs and Services.
3.  **Cross-Context Linking**: Links between Bounded Contexts must only happen at the ABB Interface level.

---

## AI Agent Self-Verification Checklist

1. [ ] **Golden Thread**: Can you trace the current artifact back to a Strategic Outcome?
2. [ ] **Folder-Relative**: Are all links relative to the file location?
3. [ ] **No index.md**: Did you verify that no link ends in `index.md`?
4. [ ] **Metadata Alignment**: Does the artifact's metadata table match the IDs in the linked files?
