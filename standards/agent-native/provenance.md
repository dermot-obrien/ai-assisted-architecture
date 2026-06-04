<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Provenance Envelope Standard"
classification: internal
version: 0.1.0
status: draft
created: 2026-06-05
last_modified: 2026-06-05
owner: "Architecture Team"
provenance:
  origin: ai-generated
  authored_by: claude-opus-4.8
  review_state: ai-raw
triggers:
  - "Authoring or editing any catalog artefact in an agent-native workspace"
  - "Recording AI authorship and verification on a change"
  - "Wiring a CI gate that requires provenance"
---

# Provenance Envelope Standard

Implements **P4** (provenance on everything). Adds an **optional, universal `provenance`
block** to the [Frontmatter Standard](../standard-frontmatter.md) envelope, recording how an
artefact was produced and verified. It is the machine-native generalisation of the
`provenance:` / `review_state:` pattern already used in research lineage (AAR).

The machine-validatable form lives in [`schemas/v1.1.0/envelope.schema.json`](../schemas/v1.1.0/envelope.schema.json)
(the `$defs/provenance` definition and the optional `provenance` property).

## Why

When agents make most decisions, "who decided this and why" cannot live in anyone's head or
a chat log that scrolls away. The envelope makes lineage a **field**, so the question *which
agent, under what instruction, with what verification, shipped this?* has a precise machine
answer in seconds — not a forensic reconstruction. This matters most where actions are
irreversible.

## The block

```yaml
provenance:
  origin: ai-generated            # ai-generated | ai-edited | human-authored | human-edited
  authored_by: claude-opus-4.8    # model/agent identifier (or person)
  authored_at: "2026-06-05T00:00:00Z"
  task_ref: WI-052                # work item / inquiry / prompt that triggered it
  prompt_digest: "sha256:9f0e…"   # hash of the driving instruction (auditable, not raw text)
  review_state: ai-verified       # ai-raw | ai-verified | human-reviewed | human-approved
  verified_by:                    # the adversarial verifier stage (operating-model.md)
    - agent: claude-opus-4.8
      verdict: pass
      checks: [invariants, contract, guardrails]
  supersedes_provenance: null     # prior provenance this record replaces
```

Only `origin` and `review_state` are required when the block is present; the block itself is
optional so v1.0.0/v1.1.0 artefacts remain valid.

## `review_state` is a lifecycle

```
ai-raw ──(survives adversarial verify)──▶ ai-verified ──(blast-radius)──▶ human-reviewed ──▶ human-approved
```

- `ai-raw` — authored, not yet verified.
- `ai-verified` — survived the verifier stage (the default ceiling for reversible change).
- `human-reviewed` / `human-approved` — only for T0/T1 blast-radius changes (operating
  model, P7). A T1 change **must** reach `human-approved` before merge.

## Where it attaches

| Artefact | Carrier |
|---|---|
| Catalog artefacts (any `kind`) | the `provenance:` block in frontmatter |
| Code changes | a structured commit trailer (`Provenance-Origin:`, `Task-Ref:`, `Review-State:`) |
| Generated artefacts (models, exports) | a sidecar `*.provenance.yaml` |
| Runtime records | carry the change's `prompt_digest` so each runtime event traces to the artefact + change + model that produced it |
| Modernisation-ontology documents | the ontology schema has **no** per-entity provenance field, so provenance is carried in a sidecar `*.provenance.yaml` (or a document-level header), not inline. Agent profiles (`agent-profile.schema.json`) carry their own `provenance` block inline. |

## The gate

- CI **rejects** any artefact whose `provenance` block is present but malformed.
- CI **rejects** any commit without a valid provenance trailer (in an agent-native
  workspace where the trailer is required).
- A change touching a T0/T1 guardrail **must** reach the required `review_state` before
  merge — the envelope is how that is checked mechanically.

## Not bureaucracy

Provenance is what makes P2 (verify-don't-review) and P7 (human budget) *auditable after the
fact*. It is the standing answer to "what happened and who is accountable," which is the
precondition for letting agents act autonomously on the reversible majority of changes.
