# Foundation Seed

This folder provides reusable baseline capabilities and building blocks that can seed a workspace. It is optional content: no skill needs it.

## Recommended Operating Model

1. Copy the foundation into your workspace.
2. Treat the workspace copy as canonical.
3. Keep this folder, in a clone of AI-Assisted Architecture, as read-only reference.

## Seed Scope

- `capabilities/`: Baseline capability taxonomy, mappings, and capability documents.
- `building-blocks/architecture-building-blocks/`: Baseline core ABBs.
- `building-blocks/solution-building-blocks/`: Optional baseline SBBs (none yet).
- `profiles/`: Installable profile definitions (`core`, `integration`, `infrastructure`).
- `foundation-manifest.yaml`: Top-level foundation metadata.
- `workspace-manifest.example.yaml`: Example workspace import/policy manifest.

## Available Profiles

- `core`: Identity/access, observability, and governance baseline.
- `integration`: API mediation and event streaming extensions (includes core dependencies).
- `infrastructure`: Compute runtime and storage extensions (includes core dependencies).

## Copy Commands

Run the seeder from a clone of this repository, in PowerShell or bash:

```bash
node path/to/ai-assisted-architecture/scripts/seed-foundation.mjs --workspace . --profile foundation
```

It has no dependencies. See `../scripts/README.md` and [Commands](../docs/commands.md#seed-foundationmjs) for its options (`--profile core|integration|infrastructure|all|foundation`, `--force`, `--dry-run`, `--workspace`).

## Fallback Rule

If a workspace has not been seeded yet, agents may read from this folder in a clone of AI-Assisted Architecture as a temporary baseline, but should create and edit workspace copies before making changes.
