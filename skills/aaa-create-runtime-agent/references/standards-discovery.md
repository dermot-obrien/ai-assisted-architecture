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

1. A path the user gives explicitly.
2. A workspace search for the file by name, for example `agent-types.md`. A workspace that has
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
| Agent types | `agent-types.md` | `agent-native/agent-types.md` | Always. Builder plane versus runtime plane |
| Operating model | `operating-model.md` | `agent-native/operating-model.md` | Always. Guardrail tiers, capability scope, escalation |
| Provenance | `provenance.md` | `agent-native/provenance.md` | Always |
| Agent specification | `agent-specification.md` | `agent-native/agent-specification.md` | Always |
| Agent profile schema | `agent-profile.schema.json` | `schemas/v1.1.0/agent-profile.schema.json` | Always, for validation |
| Service | `standard-service.md` | `runtime/standard-service.md` | Always |
| Ontology | `ontology-schema.json` | `ontology/ontology-schema.json` | Always, with the ontology README, `ontology/README.md` |

For an agent-native workspace, meaning AI-majority engineering, also load `agent-types.md`,
`principles.md`, `operating-model.md` and `provenance.md` from the agent-native
standards, in `references/standards/agent-native/`.

The skill also carries the framework's ontology validator, at
[references/scripts/ontology/validate.cjs](scripts/ontology/validate.cjs). It defaults to the
copied `ontology/ontology-schema.json` and needs Node.js with `js-yaml`, `ajv` and
`ajv-formats` installed where it runs. A repository that wants it can bind it as
`ontologyValidator`, and bind the copied agent profile schema as `agentProfileSchema`.

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
