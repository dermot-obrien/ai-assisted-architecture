<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Agent Types — Builders and Runtime Agents"
classification: internal
version: 0.1.0
status: draft
created: 2026-06-05
last_modified: 2026-06-05
owner: "Architecture Team"
provenance:
  origin: ai-generated
  authored_by: claude-opus-4.8
  review_state: ai-raw
triggers:
  - "Deciding whether an agent is a builder or a runtime agent"
  - "Modelling an autonomous runtime service in the catalog"
  - "Designing guardrails, provenance, or capability scopes for either plane"
---

# Agent Types — Builders and Runtime Agents

An agent-native workspace has **two kinds of agent**, segmented by *what they produce* and
*when they are governed*. Both do work; they are governed on **two different planes**. This
standard defines them, their symmetry, their lifecycle relationship, and how each is
represented in the catalogue.

## The two types

| | **Builder agents** | **Runtime agents** |
|---|---|---|
| **What they do** | Architecture + engineering: author artefacts, contracts, and code, up to and including a deployable | Functional domain work in the live system: evaluate, classify, decide, act, answer |
| **Output** | Catalogue artefacts + code (**including runtime agents**) | Operational outputs and **actions in the world** (an order, a message, a write) |
| **Form** | Invoked to make a change; not themselves deployed services | **Deployed services** — they *are* part of the running system |
| **Governed at** | **Build-time** — CI gates at merge | **Run-time** — action gates at the moment of acting, + reconciliation of outputs |
| **Catalogued as** | not an artefact (they operate *on* the catalogue) | a first-class **`service` / `Component`** artefact |
| **Loop** | [author → verify → reconcile](operating-model.md) | sense → guardrail-check → act → log → reconcile |

> **Builders build runtime agents.** A runtime agent is produced and maintained by builder
> agents — it goes through the builder author→verify→reconcile loop like any other
> deployable, and then it runs and does functional work. Both do work; the segmentation is
> *build the system* vs *operate in the system*.

## The symmetry (same principles, two planes)

Every agent-native principle applies to **both** types — but enforced on a different plane.
This is the key idea: you don't need two governance models, you need one model applied at
two times.

| Concern | Builder plane (build-time) | Runtime plane (run-time) |
|---|---|---|
| **Work** | a change to artefacts/code | an operational action or output |
| **Guardrails** (P3) | what the agent may *change* (tiers on artefacts) | what the agent may *do in the world* (tiers on actions) |
| **Verification** (P2) | adversarial verify before merge | guardrail check before the action; reconcile the output after |
| **Provenance** (P4) | who authored the artefact/commit | who/which model produced the action/output (stamped on the record) |
| **Capability scope** | over the catalogue + codebase | over runtime credentials + permitted actions |
| **Human escalation** (P7) | irreversible *change* (e.g. raise a limit) | irreversible *action* (e.g. an oversized or irreversible order) |
| **Reconciliation** (P9) | catalog ↔ code drift | action log ↔ intended policy drift |

The guardrail **tiers (T0–T3)** from the [operating model](operating-model.md) apply
identically on both planes. A T0/T1 guardrail is just *enforced in a different place*:

- on the **builder plane**, "you may not merge a change that raises this limit without human
  approval";
- on the **runtime plane**, "you may not take an action that breaches this limit, full
  stop" — the limit is checked at action time, outside any code the runtime agent could
  influence.

## The separation that bounds blast radius

The two types are kept apart by capability scope, and the separation is load-bearing:

- A **runtime agent may not change its own guardrails.** Changing a guardrail value is a
  *builder* change, gated by human approval (T1) or a Decision Record (T0). The runtime
  agent only ever *operates within* them.
- A **builder agent holds no runtime action credentials.** It can ship the code that lets a
  runtime agent place an order; it cannot place one.

So the worst case of a confused agent is bounded on each plane independently: a bad builder
change is caught at merge and is reversible; a bad runtime action is blocked by an
action-time guardrail it cannot rewrite.

## Lifecycle: how a runtime agent comes to exist and stays honest

```
builder agents ──author→verify→reconcile──▶ deploy ──▶ RUNTIME AGENT operates
      ▲                                                      │
      │                                                      │ produces actions/outputs
      │                                                      │ (each stamped with provenance)
      │                                                      ▼
      └──────────── reconciliation opens builder work ◀── drift / guardrail near-miss / new need
```

1. **Built** — builder agents author the runtime agent as a `service`/`Component`, with its
   contracts, its guardrail `Standard`s, and its capability scope. It passes the build-time
   gates.
2. **Deployed** — a deployer-scoped builder ships it; the release is stamped.
3. **Operates** — it does functional work, checking each action against its run-time
   guardrails and stamping each output with provenance (which agent, which model, which
   release).
4. **Reconciled** — [reconciliation](reconciliation.md) loops compare its action log to its
   intended policy and its catalogue entry to its deployment; drift or a guardrail near-miss
   **opens builder work**, closing the loop back to the top.

This is the productive relationship in full: builders produce runtime agents; runtime agents
do the functional work and emit signals (drift, near-misses, new demand) that become more
builder work. Both are agents; both do work; they occupy different segments of the same loop.

## Representing a runtime agent in the catalogue

A runtime agent is **not a new metamodel entity** — model it within the existing ontology to
avoid proliferation:

- It is a **`Component`** (`component_type: service`), typically `building_block_type: sbb`,
  realising the capability it operates.
- Its run-time guardrails are **`Standard`** artefacts with `standard_type:
  platform_guardrail`, linked via `complies_with_standard_ids`.
- Its contracts (what it consumes/produces) are **`Interface`** artefacts.
- Its **agent nature** — model, instructions, tools, skills, memory, capabilities, auth,
  evaluation — is carried in a first-class **agent profile**: see
  [`agent-specification.md`](agent-specification.md) and
  [`schemas/v1.1.0/agent-profile.schema.json`](../schemas/v1.1.0/agent-profile.schema.json).
  The profile is MCP-/A2A-/OASF-aligned, so a catalogued agent is also interoperable.

The builder-time profile is the **ABB** (logical); the **A2A Agent Card** the deployed agent
publishes is the **SBB** (concrete, discoverable), linked by `realises_abb_ids` — the same
refinement edge as any ABB→SBB. See `agent-specification.md` §"Builder spec ↔ runtime card".

See the Patternode worked example (`order-portfolio.ontology.json`): the
`comp_*_order_portfolio_service` is the deployable a builder maintains, and
`comp_*_signal_executor_agent` is the **runtime agent** inside it — governed by four
`platform_guardrail` Standards (market hours, position cap, loss breaker, daily cap), able to
submit orders within them but unable to change them.

## Edge cases

- **A builder that runs continuously** (e.g. a reconciler on a schedule) is still a builder
  if its output is *changes to the system*, not *actions in the world*. Plane is decided by
  output, not by whether it's always-on.
- **A runtime agent that proposes a change** (e.g. detects drift and drafts a fix) does not
  *make* the change — it opens builder work. The proposal is a runtime output; the change is
  a builder action. The separation holds.
- **Builders building builders** is allowed and follows the same rules; the artefact a
  builder produces may itself be a builder agent's prompt/scope definition.
