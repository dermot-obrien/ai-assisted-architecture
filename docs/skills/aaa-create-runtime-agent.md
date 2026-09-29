# aaa-create-runtime-agent

Specifies an autonomous runtime agent, one that acts in the live system, as a catalogued
artefact: its agent profile, contracts, tiered guardrails, capability scope and output
provenance. The aim is an agent that cannot change its own limits.

Use it when you want to create, define or catalogue a runtime agent, an agent profile or A2A
agent card, or to specify agent guardrails and capability scope.

It sits outside the linear golden thread: it operates a capability rather than realising one
level of it.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `agentProfileSchema` | no | The JSON Schema the agent profile is validated against |
| `ontologyValidator` | no | The validator run over each record written |

Both are optional. Unbound, the skill writes the records and reports them as authored but not
validated, and says why. The framework ships both:
`standards/schemas/v1.1.0/agent-profile.schema.json` and `scripts/ontology/validate.cjs`, which
needs `npm install` in the framework folder. See [Configuration](../configuration.md#aaa-create-runtime-agent).

Standards it loads: the agent-native standards (`agent-types.md`, `operating-model.md`,
`provenance.md`, `agent-specification.md`), the ontology README and schema, and the service
standard.

## What it asks you

1. The capability it operates. If missing, it suggests
   [aaa-create-capability](aaa-create-capability.md).
2. The component or service that hosts it, or whether it stands alone.
3. The contracts it consumes and produces.
4. Every action it can take in the world: write, send, order, spend. The skill is exhaustive
   here, because an action not listed has no guardrail.
5. Which actions are autonomous and which need human approval because they are irreversible or
   high-stakes.

## What it writes

Records in the [modernisation ontology](../ontology.md):

| Record | Holds |
|---|---|
| Component | `component_type: service`, usually `building_block_type: sbb`, realising the operated capability, and declared a runtime agent in `notes` |
| Agent profile | Identity, model, instructions, tools, skills, memory, allowed and forbidden capabilities, guardrail references, workload identity, evaluation and provenance |
| Interfaces | One per consumed or produced contract |
| Guardrail standards | One `platform_guardrail` Standard per run-time limit, each with its tier (T0 to T3), the invariant it maps to and its change path |

Every record carries a `provenance` envelope with `review_state: ai-raw`. The profile requires
provenance on every action the agent takes, and T0 and T1 guardrails enforced outside the
agent's editable code.

## Try it

```text
/aaa-create-runtime-agent Specify a delivery-exception agent that reads carrier events,
reschedules deliveries and emails customers. Rescheduling is autonomous; refunds need approval.
```

## Related

- [aaa-create-service](aaa-create-service.md) is the skill for a conventional service.
- `standards/agent-native/` holds the principles and operating model the skill applies.
