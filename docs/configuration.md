# Configuration reference

Every setting the skills and tools read, where it lives, and what wins when two places say
different things.

| File | Written by | Read by |
|---|---|---|
| [`.agents/skill-bindings.toml`](#skill-bindings) | You | Every skill, through `model doctor` or `rung.py --doctor`, and the post-install checks |
| [`.aaa-config.yaml`](#aaa-configyaml) | The installer, once, from `install/templates/aaa-config.yaml` | The post-install checks and the ontology scripts |
| [`.aaw-config.yaml`](#aaw-configyaml) | The AAW installer | `aaa install`, and the skills when they look for the standards |
| [`foundation-workspace.yaml`](#foundation-workspaceyaml) | `aaa install --seed` | Nothing yet; a record of what was seeded |
| [Front matter](#front-matter-read-by-aaa-rung) | The skills, or you | `aaa-rung`, `validate-frontmatter.mjs` |
| [Environment variables](#environment-variables) | You | The checks, `aaa-rung`, `model` |
| [Foundation profiles](#foundation-profiles) | Framework maintainers | The seeder |

## Skill bindings

`.agents/skill-bindings.toml` tells each skill where the workspace keeps each kind of artefact.
Each skill reads only its own table, `[suite.<skill-name>]`. The contract behind each table is
the skill's `inputs.toml`.

Rules that apply to every key below:

- Type `dir` is a folder, `file` is a file, `str` is a string.
- No key has a default. A required key that is missing stops the skill, naming the key. An
  optional key that is missing means the step that needs it is reported as not done.
- Relative paths resolve against the folder holding the bindings file, never the working
  directory. With the file in `.agents/`, paths start with `../`.
- A path that is set must exist. `aaa-rung` also rejects a key its contract does not declare.
- The file is found by searching upward from the working directory for
  `.agents/skill-bindings.toml`, then `skill-bindings.toml`, taking the first. `rung.py
  --bindings <path>` overrides the search for `aaa-rung`.
- Write the file as UTF-8 without a byte order mark. PowerShell 5.1 adds one unless you use
  `-Encoding ascii`.

### aaa-create-strategy

| Key | Type | Required | Used for |
|---|---|---|---|
| `outcomeDir` | dir | yes | Where `OC-NNN` folders are created |
| `useCaseDir` | dir | yes | Where `UC-NNN` folders are created. May be the same folder as `outcomeDir` |

```toml
[suite.aaa-create-strategy]
outcomeDir = "../strategy/outcomes"
useCaseDir = "../strategy/use-cases"
```

### aaa-create-platform

| Key | Type | Required | Used for |
|---|---|---|---|
| `platformDir` | dir | yes | Where `PL-NNN` folders are created |
| `outcomeDir` | dir | no | Where the outcomes a platform links up to live, so the link is written as a relative path rather than searched for |

```toml
[suite.aaa-create-platform]
platformDir = "../platforms"
outcomeDir  = "../strategy/outcomes"
```

### aaa-create-capability

| Key | Type | Required | Used for |
|---|---|---|---|
| `capabilityDir` | dir | yes | Where `CAP-NNN` folders are created, and where `capability-model.md` and its two CSVs live |
| `platformDir` | dir | yes | Searched for the platform a capability belongs to, the skill's first question |

```toml
[suite.aaa-create-capability]
capabilityDir = "../capabilities"
platformDir   = "../platforms"
```

### aaa-create-context

| Key | Type | Required | Used for |
|---|---|---|---|
| `contextDir` | dir | yes | Where `BC-NNN` folders are created |
| `platformDir` | dir | yes | Searched for the platform the context realises |
| `capabilityDir` | dir | no | For mapping the context to the capabilities it realises |

```toml
[suite.aaa-create-context]
contextDir    = "../contexts"
platformDir   = "../platforms"
capabilityDir = "../capabilities"
```

### aaa-create-abb

| Key | Type | Required | Used for |
|---|---|---|---|
| `abbDir` | dir | yes | Where `ABB-NNN` folders are created |
| `contextDir` | dir | no | The parent bounded context, for the mandatory link back |
| `capabilityDir` | dir | no | The parent capability, for the mandatory link back |

```toml
[suite.aaa-create-abb]
abbDir        = "../building-blocks/architecture-building-blocks"
contextDir    = "../contexts"
capabilityDir = "../capabilities"
```

### aaa-create-sbb

| Key | Type | Required | Used for |
|---|---|---|---|
| `sbbDir` | dir | yes | Where `SBB-NNN` folders are created, composites included |
| `abbDir` | dir | no | The ABB an SBB realises, for the link |

```toml
[suite.aaa-create-sbb]
sbbDir = "../building-blocks/solution-building-blocks"
abbDir = "../building-blocks/architecture-building-blocks"
```

### aaa-create-service

| Key | Type | Required | Used for |
|---|---|---|---|
| `serviceDir` | dir | yes | Where service definitions are written, one file per service |
| `contextDir` | dir | no | The parent bounded context, for the mandatory link |
| `sbbDir` | dir | no | The SBB the service implements, for the mandatory link |

```toml
[suite.aaa-create-service]
serviceDir = "../runtime/services"
contextDir = "../contexts"
sbbDir     = "../building-blocks/solution-building-blocks"
```

### aaa-create-runtime-agent

| Key | Type | Required | Used for |
|---|---|---|---|
| `agentProfileSchema` | file | no | The JSON Schema an agent profile is validated against. Unbound: the profile is written and reported as not schema-checked |
| `ontologyValidator` | file | no | The validator run over each record the skill writes. Unbound: records are reported as authored, not validated |

```toml
[suite.aaa-create-runtime-agent]
agentProfileSchema = "../.ai-assisted-architecture/standards/schemas/v1.1.0/agent-profile.schema.json"
ontologyValidator  = "../.ai-assisted-architecture/scripts/ontology/validate.cjs"
```

The validator needs the framework's Node dependencies; see [Ontology](ontology.md#setup).

### aaa-rung

Every key is optional. A folder left unset means the workspace does not keep that kind: nothing
is read for it, and the report names it with the rungs it cannot evidence. With no
`[suite.aaa-rung]` table at all, every kind is unbound and the report is empty, but the run
succeeds. Every folder is searched recursively for Markdown files with front matter.

| Key | Type | Holds | If unbound |
|---|---|---|---|
| `capabilityDir` | dir | Capabilities, `kind: capability`, `CAP-NNN` | Every capability is R0 |
| `abbDir` | dir | ABBs, `kind: abb`, read for `requires` | R2 cannot be evidenced |
| `sbbDir` | dir | SBBs, `kind: sbb`, read for `realises` and `status` | R4 cannot be evidenced |
| `decisionDir` | dir | Decision records, `kind: decision-record`, read for `status` | A resolved consideration cannot be confirmed at R3 |
| `considerationDir` | dir | Considerations, `kind: consideration`, read for `affects`, `consideration_status`, `resolved_by` | R2 needs `open_questions: none` on the capability |
| `patternDir` | dir | Patterns, read for `realises`, `flows`, `references` and their Building Blocks tables | R3 and above cannot be evidenced |
| `localPattern` | str | Regex for a model-local box id leading a Building Blocks cell, such as `07` in `07 Gateway` | Falls back as below |

`localPattern` precedence: `[suite.aaa-rung] localPattern`, then `[model] local_pattern` in the
same file, then `[0-9]{1,3}`. Write a regex in a single-quoted TOML string so backslashes are
not treated as escapes.

```toml
[suite.aaa-rung]
capabilityDir    = "../capabilities"
abbDir           = "../building-blocks/architecture-building-blocks"
sbbDir           = "../building-blocks/solution-building-blocks"
decisionDir      = "../decisions"
considerationDir = "../considerations"
patternDir       = "../patterns"
localPattern     = '[0-9]{2}'
```

### Keys owned by other skills

The same file may hold tables for other skills, such as `[model]`, `[markdown.*]` and
`bindingsVersion` for the `model` skill, or `[suite.pattern]` for architecture-pattern. Those
are documented in their own repositories. AAA reads only `[model] local_pattern`, as a
fallback for `aaa-rung`.

## .aaa-config.yaml

Written at the workspace root by the first `aaa install`, and never overwritten after that.

| Key | Type | Default in the template | Meaning |
|---|---|---|---|
| `version` | integer | `1` | Format version of this file |
| `mode` | string | `local-fs` | Where artefacts live. Only `local-fs` is used |
| `ontology.schema` | path | `governance/metamodel/ontology-schema.json` | The ontology schema, relative to the workspace root |
| `ontology.specification` | path | `governance/metamodel/ontology-specification.md` | Its companion specification, for people and agents to read |

The template's schema path is a suggestion for workspaces that govern their own copy. Until the
file exists, every `aaa-create-*` check warns. Point it at the framework's copy to start with:

```yaml
ontology:
  schema: .ai-assisted-architecture/standards/ontology/ontology-schema.json
```

Precedence for the ontology scripts' schema: `--schema` on the command line, then
`ontology.schema` in the nearest `.aaa-config.yaml` found upward from the working directory,
then `ontology.schema` (or `modules.aaa.ontology_schema`) in `.aaw-config.yaml`, then
`standards/ontology/ontology-schema.json` in the framework. A configured path that does not
exist is skipped.

## .aaw-config.yaml

Written and maintained by the AAW installer. AAA reads two entries and writes one:

| Key | Meaning |
|---|---|
| `modules.aaw.source_root` | Where the AAW clone is, relative to the workspace. `aaa install` uses it to find the install engine |
| `modules.aaa.source_root` | Where the AAA framework is. Recorded by `aaa install`; the skills use it to find the framework copy of the standards |
| `modules.aaa.version`, `name`, `runtime` | Recorded by the installer |

How `aaa install` finds the AAW engine, first match wins: the `ai-assisted-work` npm package,
`modules.aaw.source_root`, `node_modules/ai-assisted-work`, then `.ai-assisted-work/` in the
workspace.

## foundation-workspace.yaml

Copied from `foundation/workspace-manifest.example.yaml` by `aaa install --seed`, if it does
not exist. It records `foundation_source`, `imported_profiles` and a `policy` block
(`workspace_is_canonical`, `allow_framework_fallback_readonly`, `require_copy_before_edit`). No
tool reads it yet. Treat it as a note of what was seeded and on what terms.

## Front matter read by aaa-rung

`aaa-rung` reads a small set of front matter fields. The full field list for every kind, with
types and required fields, is in `standards/standard-frontmatter.md` and the schemas in
`standards/schemas/v1.1.0/`.

A document is indexed when it has front matter, an `id` matching its kind's pattern
(`CAP-NNN`, `ABB-NNN`, `SBB-NNN` with up to two `.N` parts, `DR-NNN` or `CN-NNN`, each with three digits), and
either no `kind` or the right one.

| Kind | Field | Used for |
|---|---|---|
| capability | `level` | R1. `L1`, `L2` or `L3` |
| capability | `parent` | R1, for L2 and L3 |
| capability | `description`, or a Purpose section | R1 |
| capability | `required_by_outcomes`, or `demand_assumption` | R1 |
| capability | `realised_by_abbs` | R2 |
| capability | `open_questions: none` | R2, when no consideration applies |
| capability | `flows[]`: `id`, `name`, `description`, `rung` (`R0` to `R6`) | Per-flow rungs, and the recorded rung `--check` compares against |
| capability | `status` | R6 needs `active` |
| capability, pattern | `references[]` with `type` `cost-model`, `evidence` or `runbook` | R4, R5, R6 |
| abb | `requires` | R2. An empty list is enough |
| sbb | `realises`, `status` | R4. Status `accepted` or `active` |
| consideration | `affects`, `consideration_status`, `resolved_by` | R2 and R3 |
| decision-record | `status` | R3. `accepted` or `active` |
| pattern | `realises`, `flows`, and the ids in its Building Blocks table | R3 and R4, by the pattern's derived abstraction |

## Environment variables

| Variable | Read by | Effect |
|---|---|---|
| `SKILL_DIR` | Each skill's `bin/check.mjs` or `bin/check.py` | The installed skill's folder. Defaults to the folder above `bin/`. Installers set it |
| `AAA_RUNG_PURE_YAML` | `aaa-rung` | Any non-empty value forces the built-in front matter parser even when PyYAML is installed |
| `AGENT_SKILLS_PATH` | The `model` skill's `doctor` | Extra folders to search for sibling skills, separated as `PATH` is |

## Foundation profiles

`foundation/profiles/<name>/profile.yaml` lists what `--profile <name>` seeds, under
`includes:` in three lists: `capabilities`, `architecture_building_blocks` and
`solution_building_blocks`, each of `ID` items. `paths:` in the same file is informational; the
seeder always writes to `capabilities/` and `building-blocks/` under the workspace. Profiles are
registered in `foundation/foundation-manifest.yaml`.

## Maintainer files

These configure the framework, not a workspace.

| File | What it sets |
|---|---|
| `framework.manifest.yaml` | The install contract AAW reads: `id`, `version`, `depends`, `skills.src`, the `config` files to seed, and the `seed` command |
| `bundle.json` | Each skill's `version`, `purl` and post-install `check`, and the ontology module with the work layer range it extends. Validated by `scripts/validate-bundle.mjs` |
| `skills/<name>/inputs.toml` | A skill's binding contract: `[inputs.options.<key>]` with `type`, `required` and `description` |
