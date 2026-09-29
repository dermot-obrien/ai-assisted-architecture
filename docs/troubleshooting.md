# Troubleshooting

Find the message you saw, then read what it means and what to do. Messages are quoted as the
tools print them; `<...>` stands for a path, key or value that varies.

- [Installing](#installing)
- [Bindings and post-install checks](#bindings-and-post-install-checks)
- [aaa-rung](#aaa-rung)
- [Rung blockers](#rung-blockers): what each one asks you to create or fix
- [In your agent](#in-your-agent)
- [Validation and ontology scripts](#validation-and-ontology-scripts)

## Installing

#### ``AAA requires AAW (it provides the shared install engine). Install AAW into this target workspace first, or ensure .aaw-config.yaml records modules.aaw.source_root, then re-run `aaa install`.``

`aaa install` could not find the AAW engine. Clone AAW to `.ai-assisted-work/` and run
`node .ai-assisted-work/bin/aaw.js install --yes --work-items-path work-items`, or install
`ai-assisted-work` as an npm dependency. Exit code 1.

#### `Unknown command: <word>`

`aaa` has one command, `install`. Exit code 2.

#### `--workspace requires a path argument`

Give a folder after `--workspace`.

#### `▸ Detected tools: none`, and there is no `.claude/skills/`

The installer links `.claude/skills/` only when `.claude` exists. Skills are still in
`.agents/skills/`, which most agents read. For Claude Code, create `.claude` and re-run
`aaa install`.

#### `▸ Non-interactive: tenant=local, mode=local-fs, work_items_path=<home>\aaw\local\<name>\work-items`

AAW defaulted its work items to your home folder. Pass `--work-items-path work-items` to keep
them in the workspace, or edit `work_items_path` in `.aaw-config.yaml`.

#### Each skill appears twice in Cursor or GitHub Copilot

Those tools read both `.agents/skills/` and `.claude/skills/`. The second entry is a link to
the same folder, so either works.

#### `/create-abb` (or any `/create-*`) does nothing

The unprefixed command shims were removed. Use `/aaa-create-abb` and so on. `aaa install`
deletes shims an older version wrote.

#### `= skip existing: <name>`

The seeder found the file or folder already in the workspace and left it alone. Add
`--force` to `seed-foundation.mjs` to overwrite.

#### `! profile not found: <name> (<path>)`

`--profile` named a profile that does not exist. Use `core`, `integration`,
`infrastructure`, `all` or `foundation`.

#### `Workspace root points to the framework root`

The seeder was pointed at the framework's own folder. Run it from the workspace root, or
pass `--workspace`.

#### `Error: Workspace root not found: <path>`

`--workspace` names a folder that does not exist. The seeder does not create it; make the
folder first, or correct the path.

## Bindings and post-install checks

#### `.aaa-config.yaml: not found in <root>. Run the AI-Assisted Architecture installer in the workspace root, or copy install/templates/aaa-config.yaml from it.`

The check runs from the workspace root and found no config. Run `aaa install` there, or
run the check from the right folder.

#### `warning: .aaa-config.yaml: ontology.schema <path> does not exist, so nothing can be validated against the ontology. Put the schema there, or correct the path.`

The template's default path is not in your workspace. Set `ontology.schema` to
`.ai-assisted-architecture/standards/ontology/ontology-schema.json`, or copy the schema to
the path named. See [Configuration](configuration.md#aaa-configyaml).

#### `.agents/skill-bindings.toml: not found at or above <root>. Create it with [suite.<skill>] declaring <keys>.`

No bindings file. Create one; the [quick start](quick-start.md#5-bind-the-skills-to-folders)
has a complete example.

#### `<file>: [suite.<skill>] does not declare <key>. Name the folder; it has no default.`

A required binding is missing. Add it to that skill's table.
[Configuration](configuration.md#skill-bindings) lists every key.

#### `<file>: [suite.<skill>] <key> = "<value>" resolves to <path>, which does not exist. Create it, or correct <key>.`

Paths resolve against the bindings file's folder, not the working directory. With the file
in `.agents/`, a folder at the workspace root is `"../name"`.

#### `<file>: [suite.<skill>] <key> = "<value>" is a file; it should name a folder.`

A `dir` binding points at a file.

#### `error  suite.<skill>: '<key>' is required and not set. <description>`

The same as the missing binding above, as `model doctor` reports it. Often preceded by
`warn  bindings: no binding file found; built-in defaults are in use.`, which means the file
itself was not found.

#### `error  suite.<skill>: '<key>' points at <path>, which does not exist`

The same as the missing path above, from `model doctor`.

#### `<file> is not valid TOML: Invalid statement (at line 1, column 1)`

Almost always a byte order mark at the start of the file, which PowerShell 5.1 writes with
`Set-Content -Encoding utf8` or `Out-File`. Rewrite the file with `-Encoding ascii`, or save
it as UTF-8 without BOM in your editor. Any other position means a real TOML syntax error at
that line.

#### `Node.js <version> is too old: this check needs 18 or newer.`

Upgrade Node.js. Exit code 2.

#### `Python <version> is too old: aaa-rung needs 3.11 or newer.`

`aaa-rung` reads TOML with `tomllib`, new in 3.11. Upgrade Python, or run it with a newer
interpreter such as `py -3.12`. Exit code 2.

#### `warning: PyYAML is not installed; the built-in front matter parser is used instead.`

Harmless. `pip install pyyaml` silences it.

#### `warning: <file>: [suite.aaa-rung] binds no directory, so every capability derives from nothing. Bind capabilityDir at least.`

`[suite.aaa-rung]` is empty or missing. Bind at least `capabilityDir`.

#### `usage: check.mjs   (run from the workspace root; takes no arguments)`

The checks take no arguments. Set `SKILL_DIR` instead; see
[Commands](commands.md#post-install-checks).

## aaa-rung

#### `! bindings did not resolve:` followed by one line per problem

`rung.py` stopped before reading anything, with exit code 2. The lines below it are:

#### `no .agents/skill-bindings.toml found above the working directory. Add [suite.aaa-rung] to the repository's bindings file, or pass --bindings`

Run from inside the workspace, or pass `--bindings <path>`.

#### `[suite.aaa-rung] <key> = '<value>' resolves to <path>, which is not a directory`

A bound folder does not exist. Create it, correct it, or delete the key to leave that kind
unbound.

#### `[suite.aaa-rung] <key> is not a key this skill declares`

A typo, or a key from another skill's table. The keys are listed in
[Configuration](configuration.md#aaa-rung).

#### `local pattern '<regex>' is not a valid regex: <reason>`

Fix `localPattern`, or `[model] local_pattern`. Use a single-quoted TOML string so
backslashes stay as written.

#### `reading bindings needs Python 3.11 or newer (tomllib)`

As above: upgrade Python.

#### `(capabilityDir is not bound, and none named by a pattern or consideration)`

Nothing to report because no capabilities folder is bound. Bind `capabilityDir`.

#### `(no capabilities found under capabilityDir, and none named by a pattern or consideration)`

The folder is bound but no document in it was indexed. A capability is indexed only when its
file starts with a `---` front matter block, its `id` is `CAP-` and three digits, and its
`kind` is `capability` or absent.

#### `unbound  <key>: no <kind>, so <consequence>`

That kind of artefact is not bound, so the rungs that need it cannot be evidenced. It is a
gap in the workspace, not in the capability. Bind the folder if the workspace keeps that kind.

#### `warn  <path>: front matter is not valid YAML: <reason>` or `front matter is not a mapping`

That document was skipped. Fix its front matter. Tabs in indentation are refused.

#### `Recorded` shows `<rung> claimed`

A flow records a rung higher than the evidence supports, and `--check` exits 1. Either add
the missing evidence (the blocker says what) or lower `flows[].rung`.

#### `Recorded` shows `<rung> stale`

The evidence supports more than the recorded rung. Raise `flows[].rung`, or remove it and let
`aaa-rung` derive it.

#### `note  <CAP>: latent evidence at <rungs>, not counted until the rungs below hold`

Artefacts for a higher rung exist, but a lower rung is not yet met. They will count once it is.

#### `note  <CAP>: named by <pattern or consideration> but has no capability document`

Something refers to a capability that does not exist. Create it with `/aaa-create-capability`,
or correct the reference.

#### `warn  pattern <id> names flow <flow>, which <CAP> does not declare`

The pattern's `flows` and the capability's `flows[].id` disagree. Correct one of them.

## Rung blockers

The last column of the `rung.py` table names what stops the next rung. Each blocker, what it
means, and who writes the fix.

| Blocker | Fix | Skill |
|---|---|---|
| `no capability document for <CAP> under capabilityDir` | Create the capability | `/aaa-create-capability` |
| `<CAP> has no level (L1, L2 or L3)` | Add `level` | `/aaa-create-capability` |
| `<CAP> is <level> but names no parent` | Add `parent` for L2 and L3 | `/aaa-create-capability` |
| `<CAP> states no purpose: add a description, or a Purpose section` | Add `description` or a Purpose section | `/aaa-create-capability` |
| `<CAP> names no demand: add required_by_outcomes, or record demand_assumption` | Link an outcome, or record the demand as an assumption | `/aaa-create-strategy`, `/aaa-create-capability` |
| `<CAP> names no ABB in realised_by_abbs` | Name the ABBs that realise it | `/aaa-create-abb` |
| `<ABB> is named by <CAP> but has no ABB document under abbDir` | Create the ABB, or correct the id | `/aaa-create-abb` |
| `<ABB> does not declare requires (an empty list is enough)` | Add `requires`, `[]` if it needs nothing | `/aaa-create-abb` |
| `no consideration affects <CAP> or its ABBs, and it does not declare open_questions: none` | Record each open question as a consideration, or state there are none | You; considerations have no skill yet |
| `<CN> is <status>: it needs an accepted decision record in resolved_by` | Decide, and resolve the consideration | You |
| `<CN> is resolved but names no resolved_by decision record` | Add `resolved_by: DR-NNN` | You |
| `<CN> is resolved by <DR>, which has no document under decisionDir` | Create the decision record, or bind `decisionDir` | You |
| `<CN> is resolved by <DR>, whose status is <status>, not accepted or active` | Accept the decision | You |
| `no pattern realises <CAP> for flow <flow>: add realises: [<CAP>] to a logical pattern` | Author a pattern that realises it | `/pattern` |
| `pattern <id> is <abstraction>: <boxes> not logical` | Replace the named boxes with ABBs | `/pattern` |
| `no SBB realises <ABB>` | Create an SBB that realises the ABB | `/aaa-create-sbb` |
| `<ABB> is realised only by <SBB> (<status>): an SBB must be accepted or active` | Accept the SBB | You |
| `no physical pattern realises <CAP> for flow <flow>: pattern <id> is <abstraction>: ...` | Make a pattern physical, every box an SBB | `/pattern` |
| `pattern <id> is physical but has no cost-model reference` | Add a `references` entry of type `cost-model` | `/pattern` |
| `pattern <id> links no evidence: add a reference of type evidence` | Link the implementation's evidence | You, from implementation |
| `<CAP> status is <status>, not active` | Set the capability `active` once in service | You |
| `no runbook reference on <CAP> or a pattern that realises it` | Link the runbook as type `runbook` | You, from implementation |
| `needs R<n> first` | Fix the lower rung's blockers first | |

`/pattern` is the [architecture-pattern](https://github.com/dermot-obrien/architecture-pattern)
skill, installed separately.

## In your agent

#### The skill says `doctor` failed and stops

That is deliberate: a skill never guesses a path. Run the same command yourself,
`python .agents/skills/model/bin/model.py doctor --skill <name>`, and fix what it reports.

#### The skill cannot find the `model` skill

Install it beside the others, from [diagram-model](https://github.com/dermot-obrien/diagram-model).
See [Installation](installation.md#the-model-skill).

#### The skill stops and names a standard it cannot find

The standards come from the workspace, then from the framework. Check that
`.ai-assisted-architecture/standards/` exists, or that `modules.aaa.source_root` in
`.aaw-config.yaml` points at the framework. A workspace that moved its standards must keep
the file names, such as `standard-abb-document.md`, so the search finds them.

#### The skill writes files, but PNG export fails

draw.io desktop is not on `PATH`. Install it and add its folder to `PATH`, or export the
`.drawio` files by hand later. See [Commands](commands.md#exporting-diagrams).

#### Diagrams use colours you did not expect

No workspace `visual-design-standard.md` was found, so the framework's example palette was
used. Copy it into your workspace and edit it; see [Concepts](concepts.md#standards-how-artefacts-are-written).

#### The runtime agent is reported as "authored but not validated"

`agentProfileSchema` or `ontologyValidator` is not bound for `aaa-create-runtime-agent`.
Bind them; see [Configuration](configuration.md#aaa-create-runtime-agent).

## Validation and ontology scripts

#### `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml'` or `Error: Cannot find module 'js-yaml'`

`validate-frontmatter.mjs`, `migrate-frontmatter.mjs` and the ontology scripts need the
framework's Node dependencies. Run `npm install` once in the framework folder.

#### `validate-frontmatter: ... fail=<n>`, with lines such as `/ must have required property 'components'`

A document does not meet its kind's schema in `standards/schemas/v1.1.0/`. The minimal
documents in the quick start carry only what the ladder reads, and fail here; the
`aaa-create-*` skills write the full set.

#### `FAIL  <file>  1 error(s)` with `/version  must be equal to constant {"allowedValue":"<version>"}`

The document's `version` is not the schema's version. Update it, or validate against the
schema version it was written for with `--schema`.

#### `Root not found: <path>`

The path given to an ontology script does not exist. Exit code 2.

#### `No skills directory at <path>`

`validate-skills.mjs` was given a folder that does not exist, which includes `--help`, since
it takes no options.

#### `<file>: '<key>' is an unquoted value containing ': ', which is invalid YAML; quote it`

A `SKILL.md` front matter value needs quotes. Other `validate-skills.mjs` errors name the
field and the limit it breaks.
