# Agent Configuration

This file defines top-level discovery and precedence rules for AI agents working with this framework. All paths are relative to the submodule root (`.ai-assisted-architecture/`).

## Agent Skills

| Skill | Claude Code | Cursor / Copilot | Description |
|-------|-------------|-------------------|-------------|
| Create ABB | `/create-abb` | `@create-abb` | End-to-end ABB creation: discovery, document, diagram, summary, PowerPoint. |
| Create SBB | `/create-sbb` | `@create-sbb` | End-to-end SBB creation: discovery, document, diagram, summary, PowerPoint. |

## Scripts

| Script | Path | Prerequisites | Description |
|--------|------|---------------|-------------|
| Building Block Slide | `.ai-assisted-architecture/scripts/create-building-block-slide.py` | `pip install python-pptx Pillow` | Creates a PowerPoint slide from a building block folder's `components.png` and `summary.png`. |

## Canonical Standards

Always load these standards before creating or modifying ABB/SBB artefacts:

- **Visual design standard** — search the workspace for a folder named `visual-design` containing `visual-design-standard.md`. If found, load it. If not found, fall back to `.ai-assisted-architecture/standards/visual-design/visual-design-standard.md`.
- `.ai-assisted-architecture/standards/building-blocks/standard-cross-referencing.md`
- `.ai-assisted-architecture/standards/building-blocks/architecture-building-block/standard-abb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/architecture-building-block/standard-abb-diagram.md`
- `.ai-assisted-architecture/standards/building-blocks/solution-building-block/standard-sbb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/solution-building-block/standard-sbb-diagram.md`

**Note:** The visual design standard defines the colour palette and typography for your organisation. The `visual-design` folder can live anywhere in the workspace hierarchy — agents search by folder name. If no workspace copy exists, agents use the framework's example palette. See the README for how to create your own.

## Scope Routing

- For ABB narrative/content documents, apply `standard-abb-document.md`.
- For ABB diagrams and ABB visual artefacts, apply `standard-abb-diagram.md`.
- For SBB narrative/content documents, apply `standard-sbb-document.md`.
- For SBB diagrams and SBB visual artefacts, apply `standard-sbb-diagram.md`.
- For links between ABB/SBB artefacts, apply `standard-cross-referencing.md`.
- For PowerPoint generation, use `.ai-assisted-architecture/scripts/create-building-block-slide.py`.

## Precedence Rules

When rules overlap or conflict, apply this order:

1. `visual-design-standard.md` for colour, contrast, and accessibility
2. ABB/SBB diagram standards for diagram structure and styling
3. ABB/SBB document standards for document structure and traceability
4. `standard-cross-referencing.md` for path/link conventions

## Enforcement Rules

- Colour references in generated artefacts must use colour identifiers from the visual design standard (for example `1.1`, `2.6`, `4.3`), not ad hoc hex values, unless a file format strictly requires resolved hex output.
- When hex output is required (CSS/SVG/export), resolve from the current visual design standard token map.
- Cross-references between ABB/SBB artefacts must use folder-relative paths and must not append `/index.md`.
- Treat `example/` directories under standards as non-normative illustrations. If an example conflicts with a standard, the standard file is authoritative.

## Discovery Check (Agent Self-Check)

Before finalising an ABB/SBB artefact, confirm:

1. All canonical standards above were loaded for the relevant artefact type.
2. Colour token usage matches defined IDs (no implicit aliases such as `2.1.1`).
3. Cross-references follow folder-relative rules and do not use `/index.md`.
4. Traceability requirements (ABB to SBB mapping and interface alignment) were applied.
