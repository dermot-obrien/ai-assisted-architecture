---
name: aaa-create-runtime-agent
description: Author an autonomous runtime agent as a catalogued artefact with its agent profile, contracts, tiered guardrails, capability scope and output provenance, so it cannot change its own limits. Use when asked to create, define or catalogue a runtime agent, an autonomous agent that acts in the live system, an agent profile or A2A agent card, or to specify agent guardrails and capability scope.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). Validation uses scripts/ontology/validate.cjs, which needs Node.js.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Runtime Agent

You are a builder agent. You are authoring a runtime agent: an autonomous, deployed service
that does functional domain work in the live system, as a first-class catalogue artefact with
its contracts, its run-time guardrails, its capability scope and its provenance discipline.

Read the agent types standard first. You are on the builder plane; what you produce operates on
the runtime plane. You build it, it acts. It must never be able to change its own guardrails.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Phase 1: Discovery and traceability

1. **Capability**: which Capability (`cap_P###_...`) does this agent operate? If missing,
   suggest creating it via `/aaa-create-capability`.
2. **Host**: which deployable Component or service hosts it, or is it standalone?
3. **Contracts**: what does it consume and produce? Each becomes an Interface.
4. **Actions in the world**: enumerate every real-world action it can take, such as write,
   send, order, spend. These determine its guardrails and capability scope.
5. **Autonomy**: which actions are fully autonomous, and which need human approval because they
   are irreversible or high-stakes, per principle P7?

Be exhaustive on step 4. An action not enumerated here is an action with no guardrail.

## Phase 2: Load standards

Load the agent types, operating model, provenance and agent specification standards, the
ontology README and schema, and the service standard.

## Phase 3: Create artefacts in the modernisation ontology

1. **Component**: `component_type: service`, typically `building_block_type: sbb`, with
   `realises_capability_ids` set to the operated capability. In `notes`, declare it a runtime
   agent and link its agent profile.
2. **Agent profile**: author the full specification per the agent specification standard,
   validated against `schemas/v1.1.0/agent-profile.schema.json`. It carries identity, model,
   instructions, tools (MCP-shaped), skills (A2A-shaped) or packaged_skills (SKILL.md-shaped),
   memory, capabilities both allowed and forbidden, tiered guardrail references, auth with a
   workload identity for runtime, evaluation, and provenance. On deploy the agent publishes an
   A2A Agent Card that realises this profile, which is the ABB to SBB relationship.
3. **Interfaces**: one per consumed or produced contract, with its contract reference and
   criticality.
4. **Guardrail standards**: one Standard with `standard_type: platform_guardrail` per run-time
   limit. Each description states its tier (T0, T1, T2 or T3), the invariant it maps to, and
   its change path (`human-only`, `human-approved` or `agent`). Link them from the Component's
   `complies_with_standard_ids`.
5. **Capability scope**: record what the agent may do and, explicitly, what it may not. It may
   not change a guardrail value; that is a builder change requiring human approval.

## Phase 3b: Provenance and enforcement

- Stamp each artefact's `provenance` envelope: `origin`, `authored_by`,
  `review_state: ai-raw`.
- Specify that every runtime output or action the agent emits carries provenance into its
  output record: which agent, which model, which release.
- Specify that T0 and T1 guardrails are enforced outside the agent's editable code, by an
  external action-time check, not merely in-process. A guardrail the agent could edit is not a
  guardrail.

## Phase 4: Self-verification

1. [ ] Is the agent modelled as a Component that realises a real Capability?
2. [ ] Does every action-in-the-world map to a `platform_guardrail` Standard with a tier and a
       change path?
3. [ ] Is the agent forbidden, by capability scope, from changing its own guardrails?
4. [ ] Does every consumed and produced contract have an Interface?
5. [ ] Is output provenance specified: agent, model and release on every action?
6. [ ] Are irreversible and high-stakes actions routed to human approval, per P7?
7. [ ] Does it validate? `node scripts/ontology/validate.cjs <path>`

Then confirm the framework-level checks in
[references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-capability` creates the capability this agent operates.
- `/aaa-create-service` is the right skill for a conventional, non-autonomous service.
