<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
# Agent-Native Architecture

This standards area defines how the framework operates when **the majority of engineers
and architects are AI agents** rather than humans. It does not replace any existing layer
(strategy, platforms, capabilities, contexts, building-blocks, runtime, ontology) — it
**builds on them**, changing how they are *enforced and consumed* so that agents can author,
verify, and operate the architecture safely.

It is deliberately **domain-agnostic**: nothing here is specific to any industry or
workspace. Domain workspaces (e.g. a trading platform) apply these standards and supply
their own worked examples.

## Why a separate area

The rest of the framework is justified by *human* limits — cognitive load, coordination
cost, team boundaries, a portal someone browses, a review board someone sits on. When the
workforce is agents, the binding constraints change: **context window, cost of
verification, blast radius, and drift rate**. The same boundaries survive (they matter
more), but a human-optimised *implementation* degrades — trace links rot uncaught, prose
contracts get guessed at, review becomes a rubber stamp, and agent-speed generation
outruns manual upkeep.

| Dimension | Human-optimised | Agent-optimised |
|---|---|---|
| Binding limit | team cognitive load | context window + cost of verification |
| Boundary rationale | "small enough for a team to hold" | "small enough to load and independently verify" |
| Trust | trust the author, spot-check | zero-trust, adversarially verify |
| Source of truth | code; docs lag | the catalogued artefact / contract; code is derived |
| Governance | review forums | automated gates + adversarial agent review; humans escalate |
| Safety | trust + post-hoc audit | blast-radius containment as the primary axis |
| Docs | prose for onboarding | retrievable structured units, machine-checked |

## What it adds (and what it does NOT)

Most of what an agent-native architecture needs **already exists** in the framework. This
area only adds the parts that don't:

| Need | Already provided by | This area adds |
|---|---|---|
| A queryable model of the architecture | the **ontology** (`standards/ontology/`) + the **frontmatter catalog** (`standards/schemas/v1.1.0/`) and `validate`/`consolidate` tooling | nothing — reuse it; it *is* the graph |
| Traceability / golden thread | **Traceability Standard** + envelope relations | nothing — reuse it |
| Guardrails | **ontology `Standard` with `standard_type: platform_guardrail`** | reversibility **tiers** + capability scoping (in [operating-model](operating-model.md)) |
| Decisions / change seam | **AAW work seam** + Decision Records | nothing — reuse it |
| **AI-authorship provenance** | — | the **[provenance](provenance.md)** envelope extension |
| **Agent execution model** | — | the **[operating model](operating-model.md)** (author → verify → reconcile) |
| **Contracts bound to running code** | `api` / `service` kinds, ontology `Interface` | the **[executable-contracts](executable-contracts.md)** discipline |
| **Runtime drift control** | static `validate`/`consolidate` gate | **[continuous reconciliation](reconciliation.md)** |

## Two kinds of agent

An agent-native workspace has **two segmentations of agent**, and both do work:

- **Builder agents** do architecture + engineering — they author artefacts, contracts, and
  code *up to and including a deployable*. Governed at **build-time** (CI gates).
- **Runtime agents** are *deployed services* that do functional domain work in the live
  system and take actions in the world. Governed at **run-time** (action gates +
  reconciliation).

**Builders build runtime agents.** Same principles, two enforcement planes. See
[`agent-types.md`](agent-types.md) — read it early; it frames everything else.

## Which AAA metamodel system

Agent-native spans **both** of AAA's modelling systems — it adds no third:

- The **modernisation ontology** (`standards/ontology/`) — `Platform` / `Capability` /
  `Component` / `Interface` / `Standard`, ids like `P301`, `comp_P301_*`, `standard_P301_*`.
  This is where a **runtime agent is catalogued** (a `Component`) and where its **guardrails**
  live (`Standard` with `standard_type: platform_guardrail`). The worked example uses this.
- The **v1.1.0 frontmatter catalog** (`standards/schemas/v1.1.0/`) — the universal envelope +
  per-kind artefacts, ids like `PL-001`. This is where the **provenance envelope**
  ([`provenance.md`](provenance.md)) lives and where an **agent profile**
  ([`agent-profile.schema.json`](../schemas/v1.1.0/agent-profile.schema.json)) attaches.

They are complementary, not competing: the ontology answers governance/reporting queries;
the frontmatter catalog carries artefact authorship + the agent profile. Where a concept
could live in either, this area fixes which: **guardrails → ontology `Standard`; provenance →
frontmatter / profile / ontology sidecar; the agent profile references ontology `Standard`
ids for its guardrails.** Drift between the two systems is caught by reconciliation **R5**.

## Contents

| Standard | Purpose |
|---|---|
| [`agent-types.md`](agent-types.md) | **Builders vs runtime agents** — the two planes, their symmetry, lifecycle, and catalogue representation. |
| [`agent-specification.md`](agent-specification.md) | **The agent component set** — model, instructions, tools, skills, memory, capabilities, guardrails, identity/auth, eval — mapped to MCP / A2A / OASF / SKILL.md / OWASP. Schema: [`agent-profile.schema.json`](../schemas/v1.1.0/agent-profile.schema.json). |
| [`principles.md`](principles.md) | The nine commitments an agent-native workspace upholds (apply on both planes). |
| [`operating-model.md`](operating-model.md) | The author → verify → reconcile loop, capability-scoped agents, and human-escalation by reversibility. |
| [`provenance.md`](provenance.md) | The AI-authorship envelope extension (origin / authored-by / review-state / verified-by). |
| [`executable-contracts.md`](executable-contracts.md) | Refining `api` / `Interface` artefacts into runnable contracts + invariants + consumer-driven tests bound to code. |
| [`reconciliation.md`](reconciliation.md) | Standing loops that prove the catalog == reality and open work on drift. |

## The one rule that ties it together

> **The catalogued artefact (and its contract) is the source of truth; code is a verified
> projection of it. Agents author against the model, verify adversarially, and a human is
> touched only when reversibility runs out.**
