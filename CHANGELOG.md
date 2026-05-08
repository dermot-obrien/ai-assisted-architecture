# Changelog

All notable changes to AI-Assisted Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Relicensed for wide adoption.** Replaced the AGPL-3.0 + Commercial dual licence with a permissive split: **CC BY 4.0** for content (documentation, standards, agent specifications, foundation seeds, diagrams) and **Apache-2.0** for executable code (`scripts/*.py`, `scripts/*.ps1`). Commercial use is now explicitly permitted under both licences; attribution is required.
- Adopted [REUSE Specification 3.3](https://reuse.software/spec-3.3/) with `REUSE.toml` and `SPDX-License-Identifier` headers for per-file licensing metadata.
- Added a trademark notice for the "AI-Assisted Architecture" name; CC BY 4.0 and Apache-2.0 do not grant trademark rights.

### Removed
- `LICENSE-AGPL-3.0.txt` and `LICENSE-COMMERCIAL.txt` (superseded by `LICENSES/CC-BY-4.0.txt` and `LICENSES/Apache-2.0.txt`).

## [1.0.0] - 2026-03-08

### Added
- TOGAF-aligned ABB and SBB document and diagram standards.
- Visual design standard with colour tokens, typography, and accessibility rules.
- Traceability standard ("Golden Thread") linking Outcomes to Services.
- Strategy standard for Business Outcomes and Use Cases.
- Platform standard with platform-as-product model (Team Topologies, CNCF, Gartner).
- Platform diagram standard for landscape visualisation.
- Capability document and diagram standards with maturity model.
- Bounded Context standard with ubiquitous language and platform containment.
- Runtime Service standard.
- Repository structured as an installable Git submodule (`.ai-assisted-architecture/`).
- Agent specifications for 7 creation skills: strategy, platform, capability, context, ABB, SBB, service.
- `agents/FRAMEWORK_AGENTS.md` for agent discovery and precedence rules.
- IDE integration wrappers for Claude Code, Cursor, GitHub Copilot, Gemini, Cline, and Windsurf.
- Foundation seed with 12 platforms (PL-001 through PL-012).
- Foundation seed with 44 capabilities across L1/L2/L3 hierarchy.
- Foundation seed with 12 bounded contexts (BC-001 through BC-012).
- Foundation seed with 8 ABBs (AB-001 through AB-008) and 3 SBBs (SB-001 through SB-003).
- Foundation seed with 13 strategic outcomes (OC-001 through OC-013).
- Platform landscape diagram (Draw.io + PNG).
- Capability map and capability-to-ABB traceability diagrams.
- PowerPoint generation script for building block summary slides.
- Foundation seeding script (`seed-foundation.ps1`) with profile support.
- 300 DPI PNG export standard for all diagrams.

---

[Unreleased]: https://github.com/dermot-obrien/ai-assisted-architecture/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dermot-obrien/ai-assisted-architecture/releases/tag/v1.0.0
