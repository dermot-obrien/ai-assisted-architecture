# Scripts

## seed-foundation.ps1

Seeds a workspace with foundation capabilities and building blocks from the framework.

### Usage

```powershell
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture/scripts/seed-foundation.ps1 -Profile foundation
```

### Parameters

- `-Profile core|integration|infrastructure|all|foundation` (default: `core`)
- `-WorkspaceRoot <path>` (default: current directory)
- `-Force` overwrite existing workspace files/folders
- `-DryRun` preview copy actions without writing

### Notes

- Run this from the workspace root (not from `.ai-assisted-architecture`).
- Workspace files are canonical after seeding.
- Framework foundation remains read-only fallback/reference.

## generate_sbb_diagrams.py

Regenerates the Draw.io component diagrams for the foundation SBBs (SBB-001/002/003). The component definitions are declared inline in the script; run it from the workspace root after editing those definitions.

Uses only the Python standard library — no third-party packages required.

### Usage

```bash
python scripts/generate_sbb_diagrams.py
```

## gen-capability-csvs.mjs

Regenerates the two derived capability CSVs (`foundation/capabilities/capability-hierarchy.csv` and `capability-abb-mapping.csv`) from the authoritative `capability-model.md` (the Canonical Capability Registry and the Capability-to-ABB Traceability Matrix). Coverage/scope columns are derived from each relationship by a fixed rule (primary→full/core, supporting→partial/core, cross-cutting→full/context). Zero-dependency Node.

```bash
node scripts/gen-capability-csvs.mjs
```

## sync-cap-abb-frontmatter.mjs

Aligns each L3 capability's `realised_by_abbs` frontmatter with the traceability matrix in `capability-model.md`, so the model, the per-capability frontmatter, and the mapping CSV stay in lock-step. Idempotent, zero-dependency Node.

```bash
node scripts/sync-cap-abb-frontmatter.mjs
```
