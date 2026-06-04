<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
# Create Runtime Agent

You are a **builder** agent. Your job is to author a **runtime agent** — an autonomous,
deployed service that does functional domain work in the live system — as a first-class
catalogue artefact, with its contracts, its run-time guardrails, its capability scope, and
its provenance discipline.

Read [`standards/agent-native/agent-types.md`](../standards/agent-native/agent-types.md)
first: you are on the *builder plane*; the artefact you produce operates on the *runtime
plane*. You build it; it acts. It must never be able to change its own guardrails.

## Phase 1: Discovery & Traceability

1. **Capability**: which `Capability` (`cap_P###_…`) does this runtime agent operate? If
   missing, suggest creating it via `create-capability`.
2. **Host**: which deployable `Component`/`service` hosts it (or is it standalone)?
3. **Contracts**: what does it **consume** and **produce**? Each becomes an `Interface`.
4. **Actions in the world**: enumerate the real-world actions it can take (write, send,
   order, spend). These determine its guardrails and capability scope.
5. **Autonomy**: which actions are fully autonomous vs require human approval (irreversible
   / high-stakes — see P7)?

## Phase 2: Load standards

Load and internalise:
- `standards/agent-native/agent-types.md` (builder vs runtime)
- `standards/agent-native/operating-model.md` (guardrail tiers, capability scope, escalation)
- `standards/agent-native/provenance.md` (output provenance)
- `standards/ontology/README.md` + `ontology-schema.json` (how to encode the artefacts)
- `standards/runtime/standard-service.md`

## Phase 3: Create artefacts (in the modernisation ontology)

1. **Component** — `component_type: service`, typically `building_block_type: sbb`,
   `realises_capability_ids` = the operated capability. In `notes`, declare it a **runtime
   agent** and link its agent profile (next step).
1b. **Agent profile** — author the full specification per
   [`standards/agent-native/agent-specification.md`](../standards/agent-native/agent-specification.md),
   validated against `schemas/v1.1.0/agent-profile.schema.json`: identity, **model**,
   instructions, **tools** (MCP-shaped), **skills** (A2A-shaped) / **packaged_skills**
   (SKILL.md-shaped), memory, capabilities (allowed + **forbidden**), guardrail refs (tiered),
   auth (with a workload identity for runtime), evaluation, and provenance. On deploy, the
   agent publishes an **A2A Agent Card** that `realises` this profile (ABB→SBB).
2. **Interfaces** — one `Interface` per consumed/produced contract, with the contract
   reference and criticality.
3. **Guardrail Standards** — one `Standard` (`standard_type: platform_guardrail`) per
   run-time limit. For each, state in the description: the **tier** (T0/T1/T2/T3), the
   **invariant** it maps to, and the **change path** (`human-only` / `human-approved` /
   `agent`). Link them via the Component's `complies_with_standard_ids`.
4. **Capability scope** — record what the agent **may do** and, explicitly, what it **may
   not** (it may not change a guardrail value; that is a builder + human-approved change).

## Phase 4: Provenance & enforcement

- Stamp the artefacts' `provenance` envelope (`origin`, `authored_by`, `review_state:
  ai-raw`).
- Specify that **every runtime output/action the agent emits carries provenance** (which
  agent, which model, which release) into its output record.
- Specify that **T0/T1 guardrails are enforced outside the agent's editable code** (an
  external action-time check), not merely in-process.

## Phase 5: Self-verification checklist

1. [ ] Is the agent modelled as a `Component` that `realises` a real `Capability`?
2. [ ] Does every action-in-the-world map to a `platform_guardrail` `Standard` with a tier
   and change path?
3. [ ] Is the agent **forbidden** (by capability scope) from changing its own guardrails?
4. [ ] Does every consumed/produced contract have an `Interface`?
5. [ ] Is output provenance specified (agent + model + release on every action)?
6. [ ] Are irreversible/high-stakes actions routed to human approval (P7)?
7. [ ] Validate the document: `node scripts/ontology/validate.cjs <path>`.
