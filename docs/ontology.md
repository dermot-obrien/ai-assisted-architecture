# Ontology

AI-Assisted Architecture ships an optional modernisation ontology: a JSON Schema that gives shape to enterprise reporting. It captures platforms, capabilities, components (ABBs and SBBs), interfaces, changes, milestones, commitments, transitions, initiatives, slips, decisions, drivers, risks, controls, standards, patterns, views and stakeholders, with an optional anchor to an industry reference taxonomy. It is industry-neutral and tool-neutral: author the data in YAML or JSON, validate it, and aggregate it across platforms.

It runs beside the Markdown artefacts, not instead of them. Use it when you want a queryable
model for governance reporting; ignore it when documents and diagrams are enough. The
`/architecture runtime-agent` skill writes its records in this ontology.

## Where it lives

```text
standards/ontology/
  README.md                        How to use it; read this first
  SPECIFICATION.md                 Design rationale and entity definitions
  SCRIPTS.md                       Full reference for the three scripts
  ontology-schema.json             The schema (JSON Schema 2020-12)
  example-identity-platform.json   A worked example for one platform
scripts/ontology/
  validate.cjs                     Validate a file or a folder
  consolidate.cjs                  Merge per-platform documents into one
  namespace-divergent.cjs          Resolve id collisions across platforms
ontology/
  architecture.schema.json         The architecture layer of the layered ontology
```

## Setup

The scripts are CommonJS for Node.js 18 or later and need `ajv`, `ajv-formats` and `js-yaml`.

In a workspace, use the validator `/architecture runtime-agent` carries, with the schema beside it, and install its dependencies in the workspace:

```bash
npm install js-yaml ajv ajv-formats
node .agents/skills/architecture/references/scripts/ontology/validate.cjs ontology-data
```

It uses `references/standards/ontology/ontology-schema.json` in the skill unless `--schema` or `ontology.schema` in `.aaa-config.yaml` names another. `consolidate.cjs` and `namespace-divergent.cjs` are not carried by any skill; run them from a clone of this repository, after `npm install` there.

## Use

From the root of a clone of this repository (in a workspace, replace `scripts/ontology/validate.cjs` with the skill's copy above):

```bash
# Validate the worked example
node scripts/ontology/validate.cjs standards/ontology/example-identity-platform.json

# Validate every ontology document under a folder
node scripts/ontology/validate.cjs path/to/ontology-data

# Merge per-platform documents into one, validating the result
node scripts/ontology/consolidate.cjs path/to/ontology-data --output aggregate.yaml --on-collision first-wins --validate

# Preview renames of ids shared across platforms
node scripts/ontology/namespace-divergent.cjs path/to/ontology-data --dry-run
```

The same three are `npm run validate`, `npm run consolidate` and `npm run namespace-divergent`.

A file counts as an ontology document only when its top level has
`ontology_id: "modernisation-ontology"`. Other YAML and JSON under the same folder is skipped,
so ontology data can sit beside anything else. Start from the worked example: copy it, rename
it for your platform, and add to it.

Options and exit codes are in [Commands](commands.md#ontology-tools), and the full reference,
with hook and CI wiring, in [SCRIPTS.md](../standards/ontology/SCRIPTS.md). Which schema the
scripts use when you do not pass `--schema` is in
[Configuration](configuration.md#aaa-configyaml).

## In CI

`validate.cjs` exits non-zero when a document does not conform, so it works as a build step or
pre-commit hook. For example, in a workspace `package.json`:

```json
{
  "scripts": {
    "validate:ontology": "node .agents/skills/architecture/references/scripts/ontology/validate.cjs ontology-data"
  }
}
```

## The architecture layer

`ontology/architecture.schema.json` is a separate, additive module: the architecture layer of
the layered ontology AI-Assisted Work defines. It extends the work layer's work item and
deliverable with the architecture artefacts they produce, and names the base ontology's
architecture concepts by reference. See [ontology/README.md](../ontology/README.md).
