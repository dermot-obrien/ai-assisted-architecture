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

## create-building-block-slide.py

Creates a PowerPoint slide for an ABB or SBB building block.

Reads `components.png` and `summary.png` from a building block folder and produces a single-slide `.pptx` with the images positioned for a 16:9 widescreen presentation.

### Prerequisites

```bash
pip install python-pptx Pillow
```

### Usage

```bash
python scripts/create-building-block-slide.py <block-folder> [--output <path>]
```

### Examples

```bash
# ABB
python scripts/create-building-block-slide.py building-blocks/architecture-building-blocks/AB-008/

# SBB with custom output path
python scripts/create-building-block-slide.py building-blocks/solution-building-blocks/SB-011/ -o slides/SB-011.pptx
```
