---
sidebar_label: Ontology Scripts
status: Draft
version: "0.2"
last_modified: 2026-05-18
author: Dermot O'Brien
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# Ontology Scripts

> Part of the [ai-assisted-architecture](https://github.com/dermot-obrien/ai-assisted-architecture) framework.

Reference documentation for the CLI scripts that operate on YAML/JSON files conforming to the modernisation ontology. The scripts are generic operations on schema-conformant data — they make no assumption about industry, palette, reporting format, or any other organisation-specific convention.

The scripts live at `scripts/ontology/`. The schema and this document live at `standards/ontology/`.

## Terminology

- **Ontology.** The conceptual model: which entity types exist (Platform, Capability, Component, etc.), what they mean, and how they relate. Documented in `./README.md` and `./SPECIFICATION.md`.
- **Schema.** The formal expression of the ontology as a JSON Schema document at `./ontology-schema.json`. This is the authoritative artefact for validation.
- **Metamodel.** The model that defines what models look like. In this repository the metamodel is the JSON Schema specification itself (draft 2020-12), not anything we author. Avoid using "metamodel" for our own schema; that creates confusion with the language we write the schema in.

## Installation

The framework uses a single Node install at its root. Requires Node.js 18 or later.

```powershell
# If you cloned the framework directly
npm install

# If you added it as a submodule at .ai-assisted-architecture/
cd .ai-assisted-architecture; npm install; cd ..
```

That fetches `ajv`, `ajv-formats`, and `js-yaml` into `node_modules/` inside the framework directory. The three CLI scripts under `scripts/ontology/` then work without further setup.

### Invocation paths

Examples below use forms that work when you are running from the framework directory itself. When the framework is installed as a submodule, prefix the script paths with `.ai-assisted-architecture/`:

```powershell
# From inside the framework
node scripts/ontology/validate.cjs <root>

# From a workspace that consumes the framework as a submodule
node .ai-assisted-architecture/scripts/ontology/validate.cjs <root>
```

The `<root>` argument is your own ontology data folder; it does not need to be inside the framework directory.

## Inventory

| Script | Purpose |
|---|---|
| `validate.cjs` | Validate one file or a folder of ontology documents against the schema. |
| `consolidate.cjs` | Merge all ontology documents under a root folder into one aggregate document. |
| `namespace-divergent.cjs` | For cross-platform entity types (Driver, Stakeholder, Viewpoint, etc.), rename IDs that occur in more than one file so each platform owns a distinct entity. Idempotent. |

Each script is invokable in three ways:

- Direct: `node scripts/ontology/<script>.cjs <args>`
- Via npm script: `npm run validate -- <args>` (and similarly `consolidate`, `namespace-divergent`)
- Via the bin shortcut after install: `npx validate-ontology <args>` (and similarly `consolidate-ontology`, `namespace-divergent-ontology`)

All examples below use the direct form for clarity.

## What is NOT here

The earlier version of this document referenced report-generation scripts (Board pack pages, motivation infographic, milestone timeline, etc.) and theme/viewpoint normalisation scripts. Those were organisation-specific and have been removed from this framework. They depended on:

- Hardcoded palette and typography choices
- A specific Board pack page structure
- A hardcoded keyword taxonomy for theme classification
- Two specific canonical viewpoints

Users who want such tooling should build it on top of the ontology in their own repository — the schema gives a stable shape to query against.

## validate.cjs

Validates a single file, or every ontology document under a root folder, against the JSON Schema.

### Usage

```powershell
node scripts/ontology/validate.cjs <root>
```

`<root>` is either a single `.yaml` / `.yml` / `.json` file, or a folder to walk recursively.

### Selection rule

When `<root>` is a folder, the validator walks recursively for files with extension `.yaml`, `.yml`, or `.json`, then filters by content: only files whose top-level `ontology_id` field equals `"modernisation-ontology"` are validated. Everything else is silently skipped (or listed with `--verbose`).

Directories ignored during the walk: `node_modules`, `build`, `dist`, `.next`, `.turbo`, `.cache`, `.venv`, `venv`, `__pycache__`, plus any directory starting with a dot.

### Options

| Flag | Description |
|---|---|
| `--schema <path>` | Use a specific schema, overriding both config and default. |
| `--quiet` | Suppress per-file OK lines; only print failures and the summary. |
| `--verbose` | Also list files skipped because they are not ontology documents. |
| `-h`, `--help` | Show usage. |

### Schema resolution order

All scripts resolve the schema in this priority:

1. **Explicit `--schema` argument** — highest priority, used as-is.
2. **`ontology.schema` from `.aaw-config.yaml`** — the script walks up from `cwd` to find `.aaw-config.yaml`. If found and `ontology.schema` is set to a valid path, that schema is used. This is how workspaces point to an extension schema.
3. **Framework default** — `standards/ontology/ontology-schema.json` in this package.

Example `.aaw-config.yaml`:

```yaml
ontology:
  schema: path/to/my-extension-schema.json
```

### Exit codes

| Code | Meaning |
|---|---|
| 0 | All ontology documents conform to the schema. |
| 1 | At least one document failed validation. |
| 2 | Invocation or I/O error (root not found, schema parse failure, etc.). |

### Examples

Validate the bundled example:

```powershell
node scripts/ontology/validate.cjs standards/ontology/example-identity-platform.json
```

Validate everything under a folder of per-platform ontology documents:

```powershell
node scripts/ontology/validate.cjs <your-ontology-data-root>
```

Validate against a candidate v2 schema:

```powershell
node scripts/ontology/validate.cjs <your-ontology-data-root> --schema path\to\ontology-schema-v2.json
```

### Output shape

Each validated file produces one line: `OK    <relative path>` or `FAIL  <relative path>  N error(s)`. Failures are followed by indented per-error lines of the form `  <instance path>  <message>  <params>`. The final line is a summary: `Summary: V validated, S skipped, F failed  (schema <name> v<version>)`.

## consolidate.cjs

Walks a root folder, finds all ontology documents, and merges their top-level entity arrays (`platform[]`, `capability[]`, `component[]`, …, `industry_reference_domain[]`) into a single aggregate document of the same shape.

The aggregate has the same schema as a single-platform file. **You do not need a separate schema for aggregates.** The existing schema defines each top-level entity property as an array, so it accepts one platform per file or many platforms in one file identically.

### Usage

```powershell
node scripts/ontology/consolidate.cjs <root> [options]
```

### Options

| Flag | Description |
|---|---|
| `--output <path>` | Write the aggregate to this file. Default: write to stdout. |
| `--format yaml\|json` | Output format. Default: `yaml`. If `--output` has a `.json` extension this is ignored. |
| `--validate` | Validate the aggregate against the schema before writing. Non-zero exit if validation fails. |
| `--on-collision <mode>` | How to handle duplicate IDs across files. `error` (default) aborts; `first-wins` keeps the first occurrence; `last-wins` keeps the last. |
| `--annotate-source` | Append the source filename to each entity's `notes` field so provenance is preserved in the aggregate. |
| `--schema <path>` | Override schema location for `--validate`. |
| `--quiet` | Suppress per-file progress (still prints errors). |
| `-h`, `--help` | Show usage. |

### Exit codes

| Code | Meaning |
|---|---|
| 0 | Aggregate produced (and validated, if `--validate` was used). |
| 1 | Collision detected with `--on-collision=error`. |
| 2 | Invocation or I/O error, parse failure, or validation failure. |

### Examples

Produce a YAML aggregate, with collisions reported as errors:

```powershell
node scripts/ontology/consolidate.cjs <your-ontology-data-root> --output aggregate.yaml
```

Force progress through collisions (first occurrence wins) and validate:

```powershell
node scripts/ontology/consolidate.cjs <your-ontology-data-root> --output aggregate.yaml --on-collision first-wins --validate
```

Annotate every entity with its source file for provenance:

```powershell
node scripts/ontology/consolidate.cjs <your-ontology-data-root> --output aggregate.json --on-collision first-wins --annotate-source
```

Stream JSON to another tool:

```powershell
node scripts/ontology/consolidate.cjs <your-ontology-data-root> --on-collision first-wins --format json | jq '.platform | length'
```

## namespace-divergent.cjs

Resolves apparent ID collisions for cross-platform entity types when each platform has authored its own copy of an entity with the same ID. Renames each occurrence to include the file's platform code so the entities become distinct.

### When to use

Use this when the consolidator reports collisions on cross-platform entity types (Driver, Stakeholder, Viewpoint, View, etc.) and the duplicates turn out to have different content per platform. The diagnostic question is: are the "duplicates" really the same entity (in which case they should be deduplicated to a shared file), or are they per-platform customisations that happen to share an ID?

### Usage

```powershell
node scripts/ontology/namespace-divergent.cjs <root> [--dry-run] [--quiet]
```

`<root>` is either a single file or a folder to walk recursively.

### What it does

For each cross-platform entity type (`driver`, `pattern`, `standard`, `risk`, `control`, `stakeholder`, `viewpoint`, `view`, `decision`, `industry_reference_domain`):

1. Collects every (id, file, platform_code) instance across all input documents.
2. For each ID that appears in more than one file, computes a namespaced replacement of the form `<typePrefix>_P###_<rest>` where `P###` is that file's primary platform code (taken from `platform[0].id`).
3. For each file containing such an ID, performs a word-boundary text replacement so the entity definition and all in-file references are updated together.

Singletons (IDs that appear in only one file) are left unchanged. IDs that already contain a `_P###_` fragment are left unchanged (idempotent).

The schema's `driver`, `risk`, `control`, and `standard` id patterns accept an optional `_P###_` fragment to permit this style: `^driver_(P\d{3}_)?[a-z0-9_]+$`. The other cross-platform types (`pattern`, `stakeholder`, `viewpoint`, `view`, `decision`, `industry_reference_domain`) have no id pattern enforced and accept any value.

### Options

| Flag | Description |
|---|---|
| `--dry-run` | List proposed renames without modifying any file. |
| `--quiet` | Suppress per-file progress (errors still printed). |
| `-h`, `--help` | Show usage. |

### Exit codes

| Code | Meaning |
|---|---|
| 0 | Finished (or dry-run completed) successfully. |
| 2 | Parse or I/O error. |

### Examples

Dry-run against the whole tree:

```powershell
node scripts/ontology/namespace-divergent.cjs <your-ontology-data-root> --dry-run
```

Apply for real:

```powershell
node scripts/ontology/namespace-divergent.cjs <your-ontology-data-root>
```

### Caveats

- Word-boundary regex replacement preserves YAML formatting, comments, and key ordering.
- The script does not deduplicate byte-identical duplicates; if you have those, they should be moved to a shared file rather than namespaced.
- The script does not check whether the rename produces meaningful IDs for the local-id portion. If your IDs already contained per-platform context that is now redundant after namespacing (e.g., `vp_p029_portfolio_status` becoming `vp_P029_p029_portfolio_status`), that is cosmetic only and does not affect validation.

## Wiring into build and commit hook

Exit code 1 from `validate.cjs` will fail a build or block a commit.

### Build step

The root `package.json` already exposes `npm run validate`. Wire it as a `prebuild` step in your consuming repo:

```json
{
  "scripts": {
    "prebuild": "npm run validate -- <your-ontology-data-root>"
  }
}
```

### Pre-commit hook (husky + lint-staged)

Scope the check to staged files only:

```json
{
  "lint-staged": {
    "**/*.{yaml,yml,json}": [
      "node scripts/ontology/validate.cjs"
    ]
  }
}
```

`lint-staged` passes each staged file path as an argument to the validator; the validator then validates each individually rather than walking the whole tree. This keeps the hook fast.

If you would prefer the hook to walk a fixed root (e.g. always check a specific folder of ontology data), call the validator with that root directly from `.husky/pre-commit` rather than via lint-staged.

## Common workflows

### "Did my edit break anything?"

```powershell
node scripts/ontology/validate.cjs <your-ontology-data-root>
```

Run after editing any YAML or JSON ontology document. Exits 0 if everything still conforms.

### "What do all platforms together look like?"

```powershell
node scripts/ontology/consolidate.cjs <your-ontology-data-root> --output aggregate.yaml --on-collision first-wins --validate
```

Produces a single document containing every entity declared across every platform file, validated against the schema.

### "Where did this entity come from?"

Add `--annotate-source` to the consolidation step; each entity's `notes` field will be appended with `[source: <relative-path>]`.

### "Diagnose a single-platform validation error"

```powershell
node scripts/ontology/validate.cjs "<your-ontology-data-root>\<platform-name>\working\<platform-tsa-document>.yaml"
```

The error output uses JSON Pointer paths into the document, so `/component/3/realises_capability_ids` means "the fourth component's realises_capability_ids array".

## Related documents

- `./README.md` for ontology usage and conventions.
- `./SPECIFICATION.md` for design rationale and entity definitions.
- `./ontology-schema.json` for the authoritative JSON Schema.
- `./example-identity-platform.json` for a worked example of a single-platform ontology document.
