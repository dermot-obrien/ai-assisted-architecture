# Resolving the canonical standards

This skill ships its own copy of the standards it reads, in
[references/standards/](../standards/), so it works installed on its own, with no framework
clone beside it. That copy is the default. A workspace that governs its own standards
overrides it: a standard the workspace holds always wins over the skill's copy. The copy is
written from the framework's `standards/` and checked against it in CI, so it does not drift
from the release the skill shipped in. It holds the standards in the table below and the
images they embed; a link in it to a framework file it does not hold goes to that file on
GitHub.

## Resolution order

For each standard below, take the first hit:

1. A path the user gives explicitly.
2. A workspace search for the file by name, for example `standard-abb-document.md`. A workspace that has
   relocated the standards, such as into `governance/standards/`, is found this way. Leave
   installed skills out of the search (`.agents/skills/`, `.claude/skills/` and any other
   skills directory): the `references/standards/` folders there are skill copies, not
   workspace standards.
3. This skill's own copy, at the path the table gives under
   [references/standards/](../standards/). It keeps the layout of the framework's `standards/`,
   so links between the copied standards resolve.

If a standard cannot be found by any of these, stop and tell the user which one is missing.
Do not proceed on an assumed contract.

## Standards this skill needs

| Standard | File name to search for | Copy in `references/standards/` | When |
|----------|-------------------------|-------------------------------|------|
| Building block calibration | `standard-building-block-calibration.md` | `building-blocks/standard-building-block-calibration.md` | Always, before an identifier is assigned |
| ABB document | `standard-abb-document.md` | `building-blocks/architecture-building-blocks/standard-abb-document.md` | Always |
| ABB diagram | `standard-abb-diagram.md` | `building-blocks/architecture-building-blocks/standard-abb-diagram.md` | Always |
| Traceability | `standard-traceability.md` | `standard-traceability.md` | Always |
| Frontmatter | `standard-frontmatter.md` | `standard-frontmatter.md` | Always, v1.1.0 or later |
| Visual design | `visual-design-standard.md` | `visual-design/visual-design-standard.md` | Always |
| C4 context diagram | `standard-c4-context-diagram.md` | `building-blocks/standard-c4-context-diagram.md` | Only when a context view is produced for the parent capability |

For an agent-native workspace, meaning AI-majority engineering, also load
`agent-types.md`, `principles.md`, `operating-model.md` and `provenance.md` from the
agent-native standards, in `references/standards/agent-native/`.

## Scope routing across the family

Which standard governs which artefact, for when a request turns out to need another flow:

| Artefact | Standard | Skill |
|----------|----------|-------|
| Business outcomes and use cases | `standard-strategy.md` | `/architecture strategy` |
| Business platforms | `platform-standard.md` | `/architecture platform` |
| Capability documents | `standard-capability-document.md` | `/architecture capability` |
| Capability maps and traceability matrices | `standard-capability-diagram.md` | `/architecture capability` |
| Bounded context definitions | `standard-bounded-context.md` | `/architecture context` |
| ABB narrative and content | `standard-abb-document.md` | `/architecture abb` |
| SBB narrative and content | `standard-sbb-document.md` | `/architecture sbb` |
| Runtime services | `standard-service.md` | `/architecture service` |
| Links between all layers | `standard-traceability.md` | every skill |
| YAML frontmatter on every catalog artefact | `standard-frontmatter.md` | every skill |
