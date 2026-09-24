# Resolving the canonical standards

The standards are workspace content, not skill content. They stay governed by the
organisation and are versioned with the architecture, so this skill locates them rather than
bundling a copy that would silently drift.

## Resolution order

For each standard below, take the first hit:

1. A path given explicitly by the user or by `.aaw-config.yaml`.
2. A workspace search for the file by name, for example `standard-abb-document.md`. A
   workspace that has relocated the standards, such as into `governance/standards/`, is
   found this way.
3. The framework's own copy under the AI-Assisted Architecture install root, whose default
   relative location is `.ai-assisted-architecture/standards/`. Resolve that root from the
   `modules.aaa.source_root` entry in `.aaw-config.yaml` if it is present, rather than
   assuming the directory name.

If a standard cannot be found by any of these, stop and tell the user which one is missing.
Do not proceed on an assumed contract.

## Standards this skill needs

| Standard | File name to search for | When |
|----------|-------------------------|------|
| ABB document | `standard-abb-document.md` | Always |
| ABB diagram | `standard-abb-diagram.md` | Always |
| Traceability | `standard-traceability.md` | Always |
| Frontmatter | `standard-frontmatter.md` | Always, v1.1.0 or later |
| Visual design | `visual-design-standard.md` | Always |
| C4 context diagram | `standard-c4-context-diagram.md` | Top-level ABBs only |

For an agent-native workspace, meaning AI-majority engineering, also load
`agent-types.md`, `principles.md`, `operating-model.md` and `provenance.md` from the
agent-native standards.

## Scope routing across the family

Which standard governs which artefact, for when a request turns out to need a sibling skill:

| Artefact | Standard | Skill |
|----------|----------|-------|
| Business outcomes and use cases | `standard-strategy.md` | `/aaa-create-strategy` |
| Business platforms | `platform-standard.md` | `/aaa-create-platform` |
| Capability documents | `standard-capability-document.md` | `/aaa-create-capability` |
| Capability maps and traceability matrices | `standard-capability-diagram.md` | `/aaa-create-capability` |
| Bounded context definitions | `standard-bounded-context.md` | `/aaa-create-context` |
| ABB narrative and content | `standard-abb-document.md` | `/aaa-create-abb` |
| SBB narrative and content | `standard-sbb-document.md` | `/aaa-create-sbb` |
| Runtime services | `standard-service.md` | `/aaa-create-service` |
| Links between all layers | `standard-traceability.md` | every skill |
| YAML frontmatter on every catalog artefact | `standard-frontmatter.md` | every skill |
