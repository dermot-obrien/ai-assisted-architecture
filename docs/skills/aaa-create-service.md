# aaa-create-service

Creates a runtime service: the deployable unit of execution that implements an SBB. It links the
service to its SBB and bounded context and checks that it implements the interfaces its ABB and
SBB declare.

Use it when you want to create or define a service, a deployable runtime unit, a microservice
entry in the catalogue, or a runtime artefact under an SBB.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `serviceDir` | yes | Where service definitions are written, one file per service |
| `contextDir` | no | The parent bounded context, for the mandatory link |
| `sbbDir` | no | The SBB it implements, for the mandatory link |

Standards it loads: service (`standard-service.md`), traceability and front matter.

## What it asks you

1. The SBB (`SBB-NNN`) it implements. If missing, it suggests one from the service name.
2. The bounded context, if missing.
3. Whether to create them first.
4. The service's kebab-case name and runtime environment.

If the service is an autonomous agent doing domain work, the skill stops and hands over to
[aaa-create-runtime-agent](aaa-create-runtime-agent.md), which authors the guardrails, scope and
provenance an agent needs.

## What it writes

| File | Contents |
|---|---|
| `<serviceDir>/<name>.md` | The service definition, linked to its bounded context and SBB |

It then compares the service's interfaces with those its ABB and SBB declare, and reports a
mismatch as a finding rather than absorbing it.

## Try it

```text
/aaa-create-service Create delivery-event-ingest, running on the container platform, for the
Delivery Event Ingestor SBB.
```

## Related

- [aaa-create-sbb](aaa-create-sbb.md) creates the SBB it implements.
- [aaa-create-runtime-agent](aaa-create-runtime-agent.md) is the skill for an autonomous agent.
