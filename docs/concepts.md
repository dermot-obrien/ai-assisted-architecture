# Concepts

The ideas you need to use AI-Assisted Architecture, in the order you meet them. For the
reasoning behind the hierarchy, with sources, read [Architectural Framework](architectural-framework.md).

## Skills, not prompts

Each workflow is an [Agent Skill](https://agentskills.io/specification): a folder holding a
`SKILL.md` with a name and a description, plus the references and code it needs. Any agent
that reads Agent Skills can use them, and the description lets the agent pick a skill when a
request matches, not only when you type `/aaa-create-abb`.

There are nine skills. Eight author one kind of artefact each (`aaa-create-*`). One,
`aaa-rung`, is read-only and reports how far each capability has been defined. See
[Skills](skills/README.md).

A skill carries the method. The standards it follows and the folders it writes to belong to
your workspace. The next three sections explain how it finds them.

## The workspace

The workspace is the folder your agent opens, normally a git repository. The installer puts
the skills in `.agents/skills/` there, and links `.claude/skills/` at them when `.claude`
exists. Everything a skill writes goes somewhere inside the workspace that you choose.

The framework itself also lives in the workspace, by convention as a clone at
`.ai-assisted-architecture/`, or under `node_modules/` when installed with npm. Its
`standards/` folder is the fallback copy of every standard.

## Bindings: where artefacts are written

No skill has a default location. A default would be whichever repository the skill was written
in, wrong everywhere else while looking like a feature. So each skill declares a contract in
its own `inputs.toml`, naming the folders it needs, and the workspace answers in
`[suite.<skill-name>]` of `.agents/skill-bindings.toml`:

```toml
[suite.aaa-create-abb]
abbDir        = "../building-blocks/architecture-building-blocks"
contextDir    = "../contexts"
capabilityDir = "../capabilities"
```

Paths resolve against the folder holding the bindings file, never the working directory. That
is why they start with `../` when the file is in `.agents/`.

Before doing anything, every `aaa-create-*` skill runs the `model` skill's resolver,
`model.py doctor --skill <name>`, and uses only the paths it prints. A required binding that is
missing stops the skill with a message naming the key. An optional binding that is missing
means the step that needs it is reported as not done, never quietly skipped. `aaa-rung` has its
own resolver, `rung.py --doctor`, which follows the same rules.

Every key is listed in [Configuration](configuration.md#skill-bindings).

## Standards: how artefacts are written

The standards are Markdown documents that fix the structure, front matter, diagram layout and
colours of each artefact kind. A skill loads the ones it needs before it writes anything, and
stops if one cannot be found. It looks in this order:

1. A path you give, or one recorded in `.aaw-config.yaml`.
2. A search of the workspace by file name, such as `standard-abb-document.md`. An organisation
   that keeps its standards in its own tree, say `governance/standards/`, is found this way.
3. The framework's copy under `standards/`, found through `modules.aaa.source_root` in
   `.aaw-config.yaml`.

The one standard you are expected to override is the visual design standard: copy
`standards/visual-design/visual-design-standard.md` anywhere in your workspace and change the
hex values, keeping the token numbering the diagram standards refer to. Each skill's
`references/standards-discovery.md` lists what it loads.

[standards/standards-index.md](../standards/standards-index.md) lists every standard and the
precedence rules. Apart from visual design, the standards are part of the method and are not
meant to be overridden: traceability, strategy, platform, capability, bounded context, ABB,
SBB, C4 context diagram, service, front matter and the definition ladder.

## The golden thread

Every artefact links to the one above it, so any building block can be traced to the business
outcome that justifies it.

```text
Outcome (OC) -> Use Case (UC) -> Platform (PL) -> Capability (CAP) -> Bounded Context (BC)
    -> Architecture Building Block (ABB) -> Solution Building Block (SBB) -> Service
```

| Artefact | Question it answers | Skill |
|---|---|---|
| Outcome, `OC-NNN` | Why? A measurable business result | `aaa-create-strategy` |
| Use Case, `UC-NNN` | How is it used? A scenario with a named actor | `aaa-create-strategy` |
| Platform, `PL-NNN` | Who owns and provides it? | `aaa-create-platform` |
| Capability, `CAP-NNN` | What must the organisation be able to do? | `aaa-create-capability` |
| Bounded Context, `BC-NNN` | Where does one domain model and its language hold? | `aaa-create-context` |
| ABB, `ABB-NNN` | How is it structured, independent of product? | `aaa-create-abb` |
| SBB, `SBB-NNN` | Which products realise it? | `aaa-create-sbb` |
| Service | How does it run? | `aaa-create-service` |

You can start anywhere. A skill that finds a parent missing proposes it and asks before
creating it, so asking for an SBB first will get you an offer to create its ABB and context.
The rules are in `standards/standard-traceability.md`, and the kinds and their relationships in
`standards/standard-metamodel.md`.

Two more kinds sit beside the thread. A runtime agent (`aaa-create-runtime-agent`) is an
autonomous agent catalogued with its guardrails and capability scope. A consideration
(`CN-NNN`) is an open question with more than one credible answer, settled by a decision
record (`DR-NNN`).

## Front matter is the model

Each artefact is a folder with an `index.md` whose YAML front matter carries its identity and
links: `id`, `kind`, `status`, and per-kind fields such as `realised_by_abbs` on a capability
or `requires` on an ABB. The prose explains; the front matter is what tools read.
`standards/standard-frontmatter.md` defines every field, and `standards/schemas/v1.1.0/` holds
the JSON Schemas that `scripts/validate-frontmatter.mjs` checks against.

## The definition ladder

How far has a capability been defined? The ladder answers with a rung that can be checked from
the artefacts, not asserted.

| Rung | Name | Holds when |
|---|---|---|
| R0 | Unrecognised | Not in the capability model |
| R1 | Named | A capability document with a level, a parent where needed, a purpose and a demand |
| R2 | Bounded | Its ABBs are named and each declares `requires`; open questions are listed as considerations, or it declares `open_questions: none` |
| R3 | Decided | Every consideration is resolved by an accepted decision record; a logical pattern realises it |
| R4 | Buildable | Every ABB has an accepted SBB; a physical pattern with a cost model realises it |
| R5 | Proven | The physical pattern links evidence |
| R6 | In service | The capability is `active` and a runbook is linked |

A capability holds the highest rung with every rung below it evidenced. A capability with
distinct jobs declares `flows[]`, and each flow climbs separately from R3 up; the capability sits
at its lowest flow. A rung recorded in `flows[].rung` that the evidence does not back is a
claim, and `rung.py --check` fails on it. Architecture's reach ends at R4: R5 and R6 are
received from implementation. The full rules are in
`standards/capabilities/standard-definition-ladder.md`.

Patterns, which R3 and above need, are authored with the
[architecture-pattern](https://github.com/dermot-obrien/architecture-pattern) skill. `aaa-rung`
reads their `realises`, `flows` and `references` front matter.

## The foundation seed

The framework ships a starter model under `foundation/`: 12 platforms, 44 capabilities, 12
bounded contexts, 8 ABBs, 3 SBBs, 13 outcomes and 5 use cases. `aaa install --seed` copies a
profile of it into your workspace, and from then on the workspace copy is yours to change.

| Profile | Seeds |
|---|---|
| `core` (the default) | The capability model files, CAP-001 to CAP-007, ABB-001 to ABB-003 |
| `integration` | `core` plus CAP-008, CAP-010, CAP-011, ABB-004 and ABB-005 |
| `infrastructure` | `core` plus CAP-009, CAP-012, CAP-013, ABB-006 and ABB-007 |
| `all` or `foundation` | All three profiles |

Each profile's list is in `foundation/profiles/<name>/profile.yaml`. The seed copies
capabilities and ABBs only, and no profile lists an SBB yet. Platforms, contexts, outcomes, use
cases, the SBBs and the remaining capabilities stay in `foundation/` as reference.

## The ontology

Separately from the Markdown artefacts, the framework defines a modernisation ontology: a JSON
Schema for platform, capability, component, change and risk data kept as YAML or JSON, with
scripts to validate, consolidate and de-duplicate it. It is optional. See [Ontology](ontology.md).
The architecture layer of the layered ontology, `ontology/architecture.schema.json`, links
architecture artefacts to the work items that produce them; see [ontology/README.md](../ontology/README.md).

## Where AI-Assisted Work fits

AAA installs through the engine in [AI-Assisted Work](https://github.com/dermot-obrien/ai-assisted-work)
(AAW), which also provides work-management skills. The seam between them, how a piece of work
produces architecture artefacts and so moves a capability up the ladder, is described in
[standards/aaw-work-seam.md](../standards/aaw-work-seam.md).
