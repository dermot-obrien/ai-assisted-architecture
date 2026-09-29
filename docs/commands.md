# Command reference

Every command the framework ships, with its options as its `--help` prints them. Paths assume
the framework is at `.ai-assisted-architecture/` in your workspace and the skills are installed
in `.agents/skills/`. From a clone of this repository, drop the `.ai-assisted-architecture/`
prefix.

On macOS and Linux type `python3` where this page says `python`.

- [Installing](#installing): `aaa install`, the AAW engine, the seeder
- [Skill tools](#skill-tools): `rung.py`, the post-install checks, `model doctor`
- [Validation](#validation): skills, bundle, front matter
- [Ontology tools](#ontology-tools): validate, consolidate, namespace-divergent
- [Maintainer scripts](#maintainer-scripts)
- [Exporting diagrams](#exporting-diagrams)

## Installing

### aaa install

```text
node .ai-assisted-architecture/bin/aaa.js install [--workspace PATH] [--seed] [--no-python]
node .ai-assisted-architecture/bin/aaa.js --help
npx aaa install ...                        # when installed as an npm dependency
```

Installs the nine skills into `.agents/skills/` and links `.claude/skills/<name>` at each one
when `.claude` exists (a directory junction on Windows, a symlink elsewhere, a copy where both
are refused). Writes `.aaa-config.yaml` if it does not exist, records the framework in
`.aaw-config.yaml`, and removes command shims an older version installed. Existing files are
never overwritten. Re-run it after pulling a new framework version.

| Option | Effect |
|---|---|
| `--workspace PATH` | Install into this folder. Without it, the installer asks in a terminal, defaulting to the nearest folder above the current one holding `.git` or `.aaw-config.yaml` |
| `--seed` | Also copy the `core` foundation profile into the workspace; see [seed-foundation.mjs](#seed-foundationmjs) |
| `--no-python` | Skip the engine's pip install step. AAA declares no Python dependencies, so this changes nothing for AAA |
| `--help`, `-h` | Print usage and exit 0 |

Any other option is passed to `aaw install --framework <this framework>`. `aaa` finds the AAW
engine through the `ai-assisted-work` npm package, then `modules.aaw.source_root` in
`.aaw-config.yaml`, then `node_modules/ai-assisted-work`, then `.ai-assisted-work/`.

Exit codes: 0 installed, 1 AAW not found or the install finished with warnings, 2 unknown
command.

### aaw install

AAA does not install AAW. Install it first, from its own clone or package:

```text
node .ai-assisted-work/bin/aaw.js install [--yes] [--workspace PATH]
    [--tenant NAME] [--mode local-fs|cloud] [--work-items-path PATH]
node .ai-assisted-work/bin/aaw.js install --framework PATH [--workspace PATH] [--seed] [--no-python]
node .ai-assisted-work/bin/aaw.js check-skills
```

`--yes` never prompts, taking existing values or defaults; it is automatic without a terminal.
Pass `--work-items-path` to keep AAW's work items inside the workspace; the default is under
your home folder. `--framework PATH` is what `aaa install` calls. `check-skills` reports
installed skills that no longer match the framework that owns them. AAW's own README documents
the rest.

### seed-foundation.mjs

```text
node .ai-assisted-architecture/src/seed-foundation.mjs [--workspace <dir>] [--profile <names>] [--force] [--dry-run]
```

Copies a foundation profile into a workspace: the capability model files
(`capability-model.md`, its two CSVs, `README.md` and `diagrams/`) into `capabilities/`, each
listed capability into `capabilities/CAP-NNN/`, each ABB into
`building-blocks/architecture-building-blocks/`, each SBB into
`building-blocks/solution-building-blocks/`, and `foundation-workspace.yaml` at the root.
`aaa install --seed` runs it with `--profile core`.

| Option | Default | Effect |
|---|---|---|
| `--workspace <dir>` | current folder | Where to seed. Refuses the framework's own folder |
| `--profile <names>` | `core` | Comma-separated: `core`, `integration`, `infrastructure`; `all` or `foundation` for all three |
| `--force` | off | Overwrite what already exists. Without it, existing files print `= skip existing` |
| `--dry-run` | off | Print `[dry-run] <from> -> <to>` for each copy without writing |
| `--help`, `-h` | | Print usage and exit 0 |

Ends with a `seed complete` line giving the number of capabilities, ABBs and SBBs copied. A profile name it does not know
prints `! profile not found` and is skipped.

`scripts/seed-foundation.ps1` is the older Windows-only version, kept for existing scripts. It
takes `-Profile core|integration|infrastructure|all|foundation`, `-WorkspaceRoot`, `-Force` and
`-DryRun`. Use the Node seeder instead.

## Skill tools

### rung.py

```text
python .agents/skills/aaa-rung/bin/rung.py [CAP-NNN ...] [--bindings BINDINGS] [--json] [--verbose] [--check] [--doctor] [--version]
```

Derives each capability's rung on the definition ladder, per flow, and names what blocks the
next rung. Read-only.

| Option | Effect |
|---|---|
| `CAP-NNN ...` | Only these capabilities. Default: every one |
| `--bindings BINDINGS` | The bindings file to use. Default: the nearest `.agents/skill-bindings.toml` above the working directory |
| `--json` | Machine-readable output: `result`, `bindings`, `ladder`, `capabilities` (each with `rung`, `flows`, `blockers`, `latent`), `unbound`, `warnings` |
| `--verbose`, `-v` | Every blocker, not only the first |
| `--check` | Exit 1 when a rung recorded in `flows[].rung` is above the derived one |
| `--doctor` | Resolve the bindings, print them, and stop |
| `--version` | Print `aaa-rung <version>` |
| `--help`, `-h` | Print usage |

In the table, `Recorded` shows a flow's recorded rung, with `claimed` when it is above the
derived rung and `stale` when below. Lines after the table start with `unbound` (a kind with
no folder bound), `note` (latent evidence, or a capability named elsewhere with no document) or
`warn` (a document that could not be read).

Exit codes: 0 done, 1 `--check` found a claim above the evidence, 2 the bindings did not
resolve.

### Post-install checks

Each skill carries a check an installer runs after installing it. Run all of them from the
workspace root with:

```text
node .ai-assisted-architecture/scripts/validate-bundle.mjs --run-checks . .ai-assisted-architecture
```

Or one at a time, with `SKILL_DIR` set to the installed skill:

```bash
SKILL_DIR=.agents/skills/aaa-create-abb node .agents/skills/aaa-create-abb/bin/check.mjs
SKILL_DIR=.agents/skills/aaa-rung python .agents/skills/aaa-rung/bin/check.py
```

```powershell
$env:SKILL_DIR = ".agents/skills/aaa-create-abb"; node .agents/skills/aaa-create-abb/bin/check.mjs
$env:SKILL_DIR = ".agents/skills/aaa-rung"; python .agents/skills/aaa-rung/bin/check.py
```

`bin/check.mjs`, the same file in every `aaa-create-*` skill, checks that `.aaa-config.yaml`
exists, that its `ontology.schema` exists (a warning when not), and that
`[suite.<skill>]` declares every required binding and each declared path exists.
`bin/check.py` resolves `[suite.aaa-rung]` as `rung.py --doctor` does, and warns when PyYAML
is absent or nothing is bound. Both take no arguments except `--help`.

Exit codes: 0 correct (warnings may print), 1 problems, one per line, 2 usage or environment
error (Node older than 18, Python older than 3.11, or an argument given).

### model doctor

The `aaa-create-*` skills resolve their bindings with the `model` skill, installed from
[diagram-model](https://github.com/dermot-obrien/diagram-model):

```text
python .agents/skills/model/bin/model.py doctor --skill <name> [--json] [--near DIR] [--config FILE]
```

It prints the binding file, each resolved path and `result : ok`, or an `error` line per
problem and exits non-zero. `--json` is the form the skills read. `--near` resolves the binding
file from another folder. Its own README documents the other options.

## Validation

### validate-skills.mjs

```text
node scripts/validate-skills.mjs [skillsRoot]
```

Checks every `<skillsRoot>/<name>/SKILL.md` against the Agent Skills specification: front
matter first, `name` matching the folder and at most 64 characters, `description` at most 1024,
`compatibility` at most 500, no unquoted `: ` in a value, relative links resolving, and body
length against the 500-line and 5,000-token guidance (warnings). Default root: `./skills`.
Exits 1 when any skill has an error. It takes no options, so `--help` is read as a folder name.

The specification's reference validator does the same job and CI runs both:

```bash
pip install "git+https://github.com/agentskills/agentskills.git#subdirectory=skills-ref"
skills-ref validate skills/aaa-rung
```

### validate-bundle.mjs

```text
node scripts/validate-bundle.mjs [bundleDir ...]
node scripts/validate-bundle.mjs --instance <file.json> --schema <$id|file>[#pointer]
node scripts/validate-bundle.mjs --run-checks <workspace> [--skills <dir>] [bundleDir]
any form: --schemas <dir> to load more schemas
```

The first form checks `bundle.json` against the bundle schema and against the skills: every
skill listed and nothing else, versions and names equal to each `SKILL.md`, purls well formed,
check commands present, and the ontology module's references resolved. The second validates
one JSON document against a schema. The third runs every skill's post-install check from
`<workspace>`, with skills in `<workspace>/.agents/skills` unless `--skills` says otherwise.
This file is a copy of the one in AI-Assisted Work; change it there.

### validate-frontmatter.mjs

```text
node scripts/validate-frontmatter.mjs [--root <dir>] [--quiet]
```

Validates the front matter of every `index.md` under `--root` (default `foundation`) against
the per-kind schemas in `standards/schemas/v1.1.0/`, chosen by `kind`. Prints `ok`, `FAIL` or
`skip` per file and `validate-frontmatter: N files under <root> -> pass=N fail=N skip=N`. Exit 1
when any file fails. Needs `npm install` in the framework folder.

To validate your own workspace, point it at a folder of artefacts:

```bash
node .ai-assisted-architecture/scripts/validate-frontmatter.mjs --root capabilities
```

## Ontology tools

Need `npm install` once in the framework folder. Full reference: [Ontology](ontology.md) and
[standards/ontology/SCRIPTS.md](../standards/ontology/SCRIPTS.md).

| Command | Does | Exit codes |
|---|---|---|
| `node scripts/ontology/validate.cjs <root> [--schema <path>] [--quiet] [--verbose]` | Validates every YAML or JSON file under `<root>` (or one file) whose top-level `ontology_id` is `modernisation-ontology` | 0 all conform, 1 one or more do not, 2 invocation or I/O error |
| `node scripts/ontology/consolidate.cjs <root> [--schema <path>] [--output <path>] [--format yaml\|json] [--validate] [--on-collision error\|first-wins\|last-wins] [--annotate-source] [--quiet]` | Merges the documents into one aggregate | 0 produced, 1 collision with `error`, 2 invocation, parse or validation failure |
| `node scripts/ontology/namespace-divergent.cjs <root> [--dry-run] [--quiet]` | Renames shared ids of cross-platform entity types to per-platform ids, updating references | 0 done, 2 invocation or I/O error |

The same three are `npm run validate`, `npm run consolidate` and `npm run namespace-divergent`
inside the framework folder, and the package's `validate-ontology`, `consolidate-ontology` and
`namespace-divergent-ontology` binaries.

## Maintainer scripts

For working on this repository. Run from its root.

| Command | Does |
|---|---|
| `python -m unittest discover skills/aaa-rung/tests` | `aaa-rung` tests. CI also runs them with `AAA_RUNG_PURE_YAML=1` |
| `node scripts/test-architecture-ontology.mjs` | Tests `ontology/architecture.schema.json` against the base ontology's worked example and cases it must refuse |
| `node scripts/migrate-frontmatter.mjs [--root <dir>] [--date YYYY-MM-DD] [--dry-run]` | Brings front matter up to v1.1.0 from each document's body. Idempotent. Default root `foundation` |
| `node scripts/gen-capability-csvs.mjs` | Regenerates the foundation's `capability-hierarchy.csv` and `capability-abb-mapping.csv` from `capability-model.md` |
| `node scripts/sync-cap-abb-frontmatter.mjs` | Aligns each foundation L3 capability's `realised_by_abbs` with the traceability matrix |
| `python scripts/generate_sbb_diagrams.py` | Regenerates the foundation SBBs' `components.drawio` |

Each accepts `--help`. The last three take no other options and write files.
[CONTRIBUTING.md](../CONTRIBUTING.md#checks-before-a-pull-request) lists what to run before a
pull request.

## Exporting diagrams

The skills export draw.io diagrams to PNG at 300 DPI with draw.io desktop on `PATH`:

```text
draw.io --export --format png --scale 3.125 --output components.png components.drawio
```

On Windows the executable is usually `C:\Program Files\draw.io\draw.io.exe`; add its folder to
`PATH`, or call it by full path.
