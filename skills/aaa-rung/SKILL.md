---
name: aaa-rung
description: Derive each capability's rung on the definition ladder (R0 Unrecognised to R6 In service), per flow, from the architecture artefacts that exist, and name the specific missing artefact that blocks the next rung. Read-only. Use when asked what rung a capability is on, how far a capability has been defined, what is blocking a capability from moving up, whether a recorded or planned rung is backed by evidence, or for the starting and finishing rungs of an epic or a planning period.
license: Apache-2.0
compatibility: Python 3.11+ (tomllib). PyYAML is used when installed and is not required. Artefact locations come from [suite.aaa-rung] of the repository's .agents/skill-bindings.toml; this skill ships no directory layout of its own.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Rung

A capability's rung on the definition ladder is a claim that can be checked, so this skill checks it rather than asking anyone. It reads the capability, its ABBs, the considerations that affect them, the decision records that resolve those, the SBBs, and the patterns that realise the capability, and reports the highest rung held with every rung below it evidenced. For the next rung up it names the artefact that is missing or says the wrong thing.

It never writes. It does not edit a capability's recorded rungs, and it does not create the missing artefact. Those are for the user, or for the `aaa-create-*` skill that authors that kind.

## Step 0, before anything else

Resolve the bindings and use only the paths printed:

```bash
python <skills>/aaa-rung/bin/rung.py --doctor
```

`<skills>` is the directory this skill is installed in. It exits 2 when the bindings do not resolve and names each missing or wrong key. Do not proceed on an error, and do not guess a path: a rung derived over the wrong directory looks exactly like a real one.

| Binding | Holds |
|---|---|
| `capabilityDir` | Capability documents (`CAP-NNN`) |
| `abbDir` | Architecture Building Blocks (`ABB-NNN`) |
| `sbbDir` | Solution Building Blocks (`SBB-NNN`) |
| `decisionDir` | Decision records (`DR-NNN`) |
| `considerationDir` | Considerations (`CN-NNN`) |
| `patternDir` | Patterns, with `realises: [CAP-NNN]` in their front matter |
| `localPattern` | Optional. The regex for a local box id such as `07`. Falls back to `[model] local_pattern`, then `[0-9]{1,3}` |

The contract is in `inputs.toml` beside this file. The repository answers it in `[suite.aaa-rung]` of its `.agents/skill-bindings.toml`, and paths resolve against that file's directory. Every directory is searched recursively for Markdown with front matter.

## Derive

```bash
python <skills>/aaa-rung/bin/rung.py                 # every capability, and each of its flows
python <skills>/aaa-rung/bin/rung.py CAP-012 -v      # one capability, every blocker
python <skills>/aaa-rung/bin/rung.py --json          # for tools, including quarter planning
python <skills>/aaa-rung/bin/rung.py --check         # exit 1 if a recorded rung claims more than the evidence
```

The table shows, for each capability and each declared flow, the rung held, the rung recorded in `flows[].rung` where there is one (marked `claimed` when above the derived rung and `stale` when below it), and the first blocker for the next rung. Notes follow for latent evidence and for capabilities that patterns or considerations name but that have no document.

## The rules it applies

These are the checks from the Definition Ladder Standard (`standards/capabilities/standard-definition-ladder.md`, section 2). A rung holds only when its own check passes and every rung below it holds.

| Rung | Passes when |
|---|---|
| R1 Named | The capability document has `level`; `parent` if L2 or L3; a purpose, as `description` or a Purpose section; and `required_by_outcomes` or `demand_assumption` |
| R2 Bounded | `realised_by_abbs` is non-empty; each ABB has a document that declares `requires` (an empty list is enough); and a consideration affects the capability or one of its ABBs, or the capability declares `open_questions: none` |
| R3 Decided | Every consideration affecting the capability or its ABBs, other than withdrawn ones, is `resolved` by a decision record whose status is `accepted` or `active`; and a realising pattern has every box an ABB (or is already physical) |
| R4 Buildable | Every ABB is realised by an SBB whose status is `accepted` or `active`; and a realising pattern is physical, every box an SBB, with a `cost-model` reference |
| R5 Proven | A physical realising pattern has an `evidence` reference |
| R6 In service | The capability's status is `active`, and it or a realising pattern has a `runbook` reference |

A pattern's abstraction is derived from the identifiers in its Building Blocks or Required Building Blocks table, by the `model` skill's rule: all local roles is conceptual, ABBs with or without local roles is logical, all SBBs is physical, anything else is mixed. Rows marked `external` or `context` in a Kind column are ignored, and an ABB or SBB id with no document counts as unknown, which makes the pattern mixed.

Flows. R1 and R2 belong to the capability. From R3 up, a flow counts only the realising patterns that list it in their `flows`, or that list no flows. The capability's rung is its lowest flow's.

Latent evidence. A rung whose own check passes above the rung held is reported as latent and never counted. Running code for a capability with no document is R0, whatever else exists.

## Reporting back

Give the rung for each capability asked about, per flow where it has flows, and quote the blocker for the next rung exactly as the tool printed it, because it names the artefact to create or fix. Say which `aaa-create-*` skill authors that artefact where one does (`/aaa-create-capability`, `/aaa-create-abb`, `/aaa-create-sbb`, `/pattern`). Report any recorded rung marked `claimed` as a claim without evidence, not as the capability's rung. Report latent evidence as work that will count once the rungs below it exist. Never state a rung the tool did not derive.

When the output feeds planning, pass `--json`. An epic's starting rung is the derived rung now, and the rung reached at the end of a period is the derived rung then. The seam is described in `standards/aaw-work-seam.md`.

## Related skills

- `/aaa-create-capability` authors the capability document, its flows and its demand.
- `/aaa-create-abb` and `/aaa-create-sbb` author the building blocks R2 and R4 need.
- `/pattern` authors the pattern that realises the capability, with `realises`, `flows` and its `cost-model` and `evidence` references.
- `quarter-planning` (AI-Assisted Work) plans rung movements and reads this skill's `--json` output.
