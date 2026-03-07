# Changelog

All notable changes to AI-Assisted Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repository restructured as an installable Git submodule
- `agents/` directory with canonical agent specifications (IDE-agnostic)
- `scripts/` directory with PowerPoint generation script
- `standards/` directory at top level for framework standards
- `example/` directory showing a complete workspace layout
- Thin IDE wrappers for Claude Code, Cursor, and GitHub Copilot
- `AGENTS.md` for agent discovery and precedence rules
- `README.md` with prerequisites, installation, and workspace setup
- ABB and SBB creation agent skills (`/create-abb`, `/create-sbb`)
- PowerPoint slide generation from building block artefacts
- Summary panel Draw.io standard (single text cell, 16pt, `page="0"`)
- 300 DPI PNG export standard for all diagrams
- Cross-referencing standard for ABB/SBB traceability
- Visual design standard with colour tokens and accessibility rules

## [1.0.0] - 2026-02-01

### Added
- Initial release
- TOGAF-aligned ABB and SBB document standards
- ABB and SBB diagram standards for Draw.io
- Visual design standard with brand palette
- Example ABB (AB-008) and SBB (SB-011)

---

[Unreleased]: https://github.com/dermot-obrien/ai-assisted-architecture/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dermot-obrien/ai-assisted-architecture/releases/tag/v1.0.0
