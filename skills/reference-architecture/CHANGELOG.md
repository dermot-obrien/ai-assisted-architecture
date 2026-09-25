<!-- SPDX-License-Identifier: Apache-2.0 -->

# Changelog

## [0.2.0] - 2026-09-25

### Added

- `scripts/publish.py <folder>`, which publishes every declared model in a folder: views rendered beside each document as `<stem>.svg` and `<stem>-sN.svg`, then a deck and PDF per document under `dist/<name>/`. Models that fail validation are skipped unless `--force`. `--thumbnails` passes through to `markdown-deck`.
- Guidance on local identifiers and the mapping table, on `model rename` for promotion, and on `model sync --adopt` for bringing a hand-drawn diagram into a model.

### Changed

- The procedure declares the diagram in the document's front matter, so validation and publishing find it without being told. Requires `model` 0.2.0.

## [0.1.0] - 2026-09-25

First release.

### Added

- `assets/template.md`, the reference architecture template, with each section's grounding recorded in SKILL.md rather than asserted.
- The authoring order, which is not document order: context and non-goals, then patterns, then building blocks, then interfaces, then the diagram, then scenarios. Interfaces is where the thinking happens and it usually sends you back to revise the building blocks.
- A worked example, `examples/knowledge-retrieval`, with committed inputs and outputs and a `run.sh` that regenerates every artefact.
- `inputs.toml`, declaring what this skill needs from the repository and nothing about where it lives. The repository answers in `[suite.reference-architecture]`, and `model doctor --skill reference-architecture` checks one against the other.
- A generic template. The identifier series, the deliverable code, the diagram palette and the ontology conformance statement are a house profile and now live in the consuming repository's own template, bound as `template`. A published skill should not ship one organisation's vocabulary.
- Declared dependencies on `model` and `markdown-deck`, with an explicit stop if either is absent, since no tool resolves skill-to-skill dependencies outside the Claude Code plugin route.
