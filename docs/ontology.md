# Ontology

The framework ships an optional modernisation ontology: a JSON Schema that gives shape to
enterprise reporting. It captures platforms, capabilities, components (ABBs and SBBs),
interfaces, changes, milestones, commitments, transitions, initiatives, slips, decisions,
drivers, risks, controls, standards, patterns, views and stakeholders, with an optional anchor
to an industry reference taxonomy. It is industry-neutral and tool-neutral: author the data in
YAML or JSON, validate it, and aggregate it across platforms.

It runs beside the Markdown artefacts, not instead of them. Use it when you want a queryable
model for governance reporting; ignore it when documents and diagrams are enough. The
`aaa-create-runtime-agent` skill writes its records in this ontology.

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
Install them once in the framework folder:

```bash
cd .ai-assisted-architecture
npm install
cd ..
```

## Use

```bash
# Validate the worked example
node .ai-assisted-architecture/scripts/ontology/validate.cjs .ai-assisted-architecture/standards/ontology/example-identity-platform.json

# Validate every ontology document under a folder
node .ai-assisted-architecture/scripts/ontology/validate.cjs ontology-data

# Merge per-platform documents into one, validating the result
node .ai-assisted-architecture/scripts/ontology/consolidate.cjs ontology-data --output aggregate.yaml --on-collision first-wins --validate

# Preview renames of ids shared across platforms
node .ai-assisted-architecture/scripts/ontology/namespace-divergent.cjs ontology-data --dry-run
```

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
    "validate:ontology": "node .ai-assisted-architecture/scripts/ontology/validate.cjs ontology-data"
  }
}
```

## The architecture layer

`ontology/architecture.schema.json` is a separate, additive module: the architecture layer of
the layered ontology AI-Assisted Work defines. It extends the work layer's work item and
deliverable with the architecture artefacts they produce, and names the base ontology's
architecture concepts by reference. See [ontology/README.md](../ontology/README.md).
