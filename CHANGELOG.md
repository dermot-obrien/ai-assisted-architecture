# Changelog

All notable changes to AI-Assisted Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **AAW work seam** (`standards/aaw-work-seam.md`): defines the contract between AAA and the AI-Assisted Work work-classification standard. A `decision` deliverable (from any work, or a validated AAR inquiry) → an AAA Decision Record (`DR-NNN`); a cross-cutting AAW `intervention` → a Capability / ABB / SBB revision via the `create-*` agents. Aligns the vocabularies so one classification flows across the frameworks without drift.

- **Unified installer integration.** A `framework.manifest.yaml` and a zero-dependency `bin/aaa.js` launcher install AAA through the shared AI-Assisted Work (AAW) engine — `aaa install` (add `--seed` to scaffold the foundation), wiring `create-*` command shims for Claude/Cursor/Copilot/Gemini. The Windows-only `scripts/seed-foundation.ps1` was ported to a cross-platform Node seeder (`src/seed-foundation.mjs`). AAA is now consumable as an npm git-dependency (no registry) that auto-pulls AAW.
- **Frontmatter Standard** (`standards/standard-frontmatter.md`) — universal envelope, per-kind extensions for all 15 artefact kinds, relationship vocabulary with inverse-consistency rules, status lifecycle, and lifecycle-state semantics for baseline/in-flight/target/retired coexistent versions.
- **JSON Schemas** (`standards/schemas/v1.1.0/`) — JSON Schema 2020-12 validators per kind: `envelope.schema.json` plus per-kind schemas for outcome, use-case, platform, capability, bounded-context, abb, sbb, service, decision-record, snapshot, transition. Placeholder schemas under `_placeholders/` reserve `view`, `event`, `deployment-node`, `api`.
- **Decision Record artefact type** (`DR-NNN`) — first-class metamodel element for architectural decisions. MADR body + Y-statement frontmatter + `change_type` and `affects_artefacts` relations. Schema in v1.1.0 set; full body-section standard forthcoming.
- **Snapshot artefact type** (`SN-NNN`) — named architecture state at a point in time. Manifest of `id@version` pairs. Used for baseline / target / transition architectures.
- **Transition artefact type** (`TR-NNN`) — multi-step migration between two Snapshots, sequenced by Decision Records.
- Universal `lifecycle_state` field on every artefact (`baseline | in-flight | target | retired`).

### Changed

- **Relicensed for wide adoption.** Replaced the AGPL-3.0 + Commercial dual licence with a permissive split: **CC BY 4.0** for content (documentation, standards, agent specifications, foundation seeds, diagrams) and **Apache-2.0** for executable code (`scripts/*`, `src/*`, `bin/*`). Commercial use is now explicitly permitted under both licences; attribution is required.
- Adopted [REUSE Specification 3.3](https://reuse.software/spec-3.3/) with `REUSE.toml` and `SPDX-License-Identifier` headers for per-file licensing metadata.
- Added a trademark notice for the "AI-Assisted Architecture" name; CC BY 4.0 and Apache-2.0 do not grant trademark rights.
- `agents/FRAMEWORK_AGENTS.md` references the new Frontmatter Standard in canonical-standards list and scope-routing section.

### Removed
- `LICENSE-AGPL-3.0.txt` and `LICENSE-COMMERCIAL.txt` (superseded by `LICENSES/CC-BY-4.0.txt` and `LICENSES/Apache-2.0.txt`).

### Notes

- v1.1.0 is design-spec stage; no breaking changes. Existing v1.0.0 artefacts continue to validate via the `lenient-v1.0.0-compat` schema profile. New artefacts use `strict-v1.1.0`.
- Decision Record / Snapshot / Transition agent skills (`agents/create-decision.md`, `create-snapshot.md`, `create-transition.md`) are forthcoming.
- Validator script and CI hook recipe are forthcoming.

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
- Foundation seed with 8 ABBs (ABB-001 through ABB-008) and 3 SBBs (SBB-001 through SBB-003).
- Foundation seed with 13 strategic outcomes (OC-001 through OC-013).
- Platform landscape diagram (Draw.io + PNG).
- Capability map and capability-to-ABB traceability diagrams.
- PowerPoint generation script for building block summary slides.
- Foundation seeding script (`seed-foundation.ps1`) with profile support.
- 300 DPI PNG export standard for all diagrams.

---

[Unreleased]: https://github.com/dermot-obrien/ai-assisted-architecture/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dermot-obrien/ai-assisted-architecture/releases/tag/v1.0.0
