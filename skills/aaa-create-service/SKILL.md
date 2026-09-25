---
name: aaa-create-service
description: Create a runtime Service, the deployable unit of execution that implements an SBB, linking it to its parent SBB and bounded context and validating that it implements the interfaces its parent ABB and SBB declare. Use when asked to create or define a service, a deployable runtime unit, a microservice entry in the catalogue, or a runtime artefact under an SBB.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). Artefact locations come from [suite.<skill-name>] of the repository's .agents/skill-bindings.toml, resolved with the model skill's doctor; this skill ships no directory layout of its own.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Service (Runtime)

You are an enterprise architecture agent defining deployable units of execution. A service is
the runtime end of the golden thread.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
python <skills>/model/bin/model.py doctor --skill aaa-create-service --json
```

`<skills>` is the directory this skill is installed in. It exits non-zero on `error`. Do not
proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `serviceDir` | Where a service definition is written |
| `contextDir` (optional) | The parent Bounded Context, for the mandatory link |
| `sbbDir` (optional) | The physical SBB, for the mandatory link |

The contract is declared in `inputs.toml` beside this file. The repository answers it in
`[suite.aaa-create-service]` of its `.agents/skill-bindings.toml`. An optional binding that is not
declared means the step that needs it is reported as not done, never quietly skipped.

## Phase 1: Discovery and proactive traceability

1. **SBB realised**: which SBB (`SBB-NNN`) does this service implement? If missing, suggest a
   plausible SBB name from the service, for example "If you are creating `auth-svc`, I suggest
   we first define a 'Centralised Authentication Service' SBB".
2. **Bounded context**: if missing, suggest the owning context, for example "This service
   should live in the 'Identity & Access' Bounded Context".
3. **The proposal**: "To ensure runtime integrity, I suggest we create the parent SBB and
   Context first. Should I generate this implementation slice for you?"
4. **Details**: the kebab-case name and the runtime environment.

If this service is an autonomous agent doing domain work rather than a conventional service,
stop and use `/aaa-create-runtime-agent` instead: it needs guardrails, capability scope and
provenance that this skill does not author.

## Phase 2: Load standards

Load the service, traceability and frontmatter standards.

## Phase 3: Create artefacts

### Step 1: `<serviceDir>/<name>.md`

Create the service definition. The metadata must link to both the parent Bounded Context and
the physical SBB.

### Step 2: Interface validation

Verify the service implements the exact interfaces declared by its parent ABB and SBB. A
mismatch is a finding to report, not a difference to absorb silently into the service
definition.

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-sbb` creates the SBB this service implements.
- `/aaa-create-runtime-agent` is the right skill when the service is an autonomous agent.
