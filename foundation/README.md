# Foundation Seed

This folder provides reusable baseline capabilities and building blocks that can seed a workspace.

## Recommended Operating Model

1. Copy the foundation into your workspace.
2. Treat the workspace copy as canonical.
3. Keep `.ai-assisted-architecture/foundation/` read-only reference.

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

## Copy Commands (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .ai-assisted-architecture\scripts\seed-foundation.ps1 -Profile foundation
```

See `../scripts/README.md` for script options (`-Profile all` / `-Profile foundation`, `-Force`, `-DryRun`, `-WorkspaceRoot`).

## Fallback Rule

If a workspace has not been seeded yet, agents may read from `.ai-assisted-architecture/foundation/` as a temporary baseline, but should create and edit workspace copies before making changes.
