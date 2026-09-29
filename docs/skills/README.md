# Skills

Nine Agent Skills, one page each. Every skill's own `SKILL.md` is the definition the agent
follows; these pages are for the person using it.

| Skill | Does | Writes |
|---|---|---|
| [aaa-create-strategy](aaa-create-strategy.md) | Creates a business outcome with its measures, and a use case that supports it | `OC-NNN/`, `UC-NNN/` |
| [aaa-create-platform](aaa-create-platform.md) | Creates a business platform with its executive owner and mission | `PL-NNN/` |
| [aaa-create-capability](aaa-create-capability.md) | Creates a capability and adds it to the capability model | `CAP-NNN/`, `capability-model.md` |
| [aaa-create-context](aaa-create-context.md) | Creates a bounded context with its ubiquitous language | `BC-NNN/` |
| [aaa-create-abb](aaa-create-abb.md) | Creates a logical Architecture Building Block with its diagrams | `ABB-NNN/` |
| [aaa-create-sbb](aaa-create-sbb.md) | Creates a Solution Building Block that maps an ABB to products, simple or composite | `SBB-NNN/` |
| [aaa-create-service](aaa-create-service.md) | Creates a runtime service that implements an SBB | `<name>.md` |
| [aaa-create-runtime-agent](aaa-create-runtime-agent.md) | Specifies an autonomous runtime agent with guardrails, scope and provenance | Ontology records and an agent profile |
| [aaa-rung](aaa-rung.md) | Derives each capability's rung on the definition ladder and what blocks the next | Nothing: read-only |

## How the eight create skills work

The `aaa-create-*` skills share one shape, so learning one teaches you the rest.

1. Step 0, resolve. The skill runs `model doctor --skill <name>` and uses only the paths it
   prints. A missing required binding stops it.
2. Phase 1, discovery. It asks what it needs and checks that the parents exist. A missing
   parent is proposed, with a plausible name, and created only if you agree.
3. Phase 2, load standards. It finds each standard it needs in the workspace, falling back to
   the framework, and stops if one is missing. Each skill's
   `references/standards-discovery.md` lists them.
4. Phase 3, create. It writes the artefacts in a fixed order, at the next free identifier.
5. Phase 4, self-verify. It runs the checklist from the standard and the traceability checks,
   and reports which passed rather than asserting completion.

You invoke a skill by typing its name after `/`, or by asking for what it does: each skill's
description lets the agent pick it when a request matches.

## Where to start

Follow the golden thread from the top when you are modelling something new: strategy,
platform, capability, context, ABB, SBB, service. When you already know the building block you
need, start there; the skill will offer to create what is missing above it. Use `aaa-rung` at
any point to see where each capability stands.
