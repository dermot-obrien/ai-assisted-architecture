# Resolving the canonical standards

This skill ships its own copy of the standards it reads, in
[references/standards/](standards/), so it works installed on its own, with no framework
clone beside it. That copy is the default. A workspace that governs its own standards
overrides it: a standard the workspace holds always wins over the skill's copy. The copy is
written from the framework's `standards/` and checked against it in CI, so it does not drift
from the release the skill shipped in. It holds the standards in the table below and the
images they embed; a link in it to a framework file it does not hold goes to that file on
GitHub.

## Resolution order

For each standard below, take the first hit:

1. A path given explicitly by the user or by `.aaw-config.yaml`.
2. A workspace search for the file by name, for example `standard-capability-document.md`. A workspace that has
   relocated the standards, such as into `governance/standards/`, is found this way. Leave
   installed skills out of the search (`.agents/skills/`, `.claude/skills/` and any other
   skills directory): the `references/standards/` folders there are skill copies, not
   workspace standards.
3. This skill's own copy, at the path the table gives under
   [references/standards/](standards/). It keeps the layout of the framework's `standards/`,
   so links between the copied standards resolve.

If a standard cannot be found by any of these, stop and tell the user which one is missing.
Do not proceed on an assumed contract.

## Standards this skill needs

| Standard | File name to search for | Copy in `references/standards/` | When |
|----------|-------------------------|-------------------------------|------|
| Capability document | `standard-capability-document.md` | `capabilities/standard-capability-document.md` | Always |
| Capability diagram | `standard-capability-diagram.md` | `capabilities/standard-capability-diagram.md` | When creating an L1 domain map |
| Traceability | `standard-traceability.md` | `standard-traceability.md` | Always |
| Frontmatter | `standard-frontmatter.md` | `standard-frontmatter.md` | Always, v1.1.0 or later |
| Visual design | `visual-design-standard.md` | `visual-design/visual-design-standard.md` | When drawing a map |

For an agent-native workspace, meaning AI-majority engineering, also load `agent-types.md`,
`principles.md`, `operating-model.md` and `provenance.md` from the agent-native
standards, in `references/standards/agent-native/`.

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
| Runtime agents | `agent-specification.md` | `/aaa-create-runtime-agent` |
| Links between all layers | `standard-traceability.md` | every skill |
| YAML frontmatter on every catalog artefact | `standard-frontmatter.md` | every skill |
