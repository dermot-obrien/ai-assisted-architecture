---
name: aaa-create-service
description: Create a runtime Service, the deployable unit of execution that implements an SBB, linking it to its parent SBB and bounded context and validating that it implements the interfaces its parent ABB and SBB declare. Use when asked to create or define a service, a deployable runtime unit, a microservice entry in the catalogue, or a runtime artefact under an SBB.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md).
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

### Step 1: runtime/services/<name>.md

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
