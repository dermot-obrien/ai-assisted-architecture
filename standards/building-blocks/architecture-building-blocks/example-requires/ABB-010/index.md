<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
$schema: ../../../../schemas/v1.1.0/abb.schema.json
id: ABB-010
kind: abb
title: "ABB-010 AI Agent Platform"
short_name: "Agent Platform"
description: "Logical building block for a production AI agent: the runtime that turns a goal into actions by reasoning over context, invoking tools, optionally remembering across turns, and operating within safety guardrails."

version: 0.1.0
status: draft
created: 2026-06-06
last_modified: 2026-06-06
last_modified_by: claude-opus-4-8

lifecycle_state: baseline
owner: "Agent Platform Team"
classification: internal
governance_zone: application

category: "AI & Autonomous Systems"

# --- Traceability (Golden Thread) ---
part_of: BC-010
realises_capabilities: [CAP-040]
realised_by: []

# --- Capability dependencies (requires): logical ABBs this ABB needs ---
requires:
  - abb: ABB-011
    cardinality: "1"
    rationale: "Every agent needs a reasoning engine"
  - abb: ABB-012
    cardinality: "1..n"
    rationale: "Agents interact with external systems via tools"
  - abb: ABB-013
    cardinality: "0..1"
    rationale: "Stateful agents need persistent memory"
  - abb: ABB-014
    cardinality: "1"
    rationale: "Production agents require safety guardrails"

domains: [application, technology]
interfaces:
  - { id: "I1", direction: "in",  type: "request", description: "Goal / task submission (prompt + context)" }
  - { id: "I2", direction: "out", type: "callback", description: "Tool invocation request to a Tool Integration ABB" }
  - { id: "I3", direction: "out", type: "event",    description: "Action / decision trace for audit" }
  - { id: "I4", direction: "in",  type: "query",    description: "Memory read/write to an Agent Memory ABB" }

mandatory_subabbs: [iam, observability, governance]
cross_cutting: false

tags: [ai, agent, example, requires]
sidebar_label: "ABB-010 AI Agent Platform"
sidebar_position: 10

provenance:
  origin: ai-generated
  authored_by: claude-opus-4-8
  review_state: ai-raw
---

# ABB-010 AI Agent Platform

> **Worked example** — the canonical reference for the ABB **`requires`** field (capability
> dependencies between logical building blocks). It demonstrates how one ABB declares the
> other ABBs it depends on, with cardinality and rationale, and how those dependencies feed
> gap analysis. The four required ABBs (ABB-011…ABB-014) exist as minimal examples in sibling
> folders. The AI-agent domain is illustrative; the *dependency pattern* is the point.

## 1  Purpose

An AI Agent Platform is the logical runtime that turns a **goal** into **actions**. It interprets a task, reasons over the available context, decides what to do, acts through tools, optionally remembers what happened across turns, and stays inside a safety envelope while doing so. This ABB captures that orchestration role in technology-agnostic terms; it is deliberately *thin* — it coordinates capabilities that other ABBs provide rather than implementing them itself.

That thinness is why this ABB is a good illustration of `requires`. An agent platform that owned its own model, its own tool runtime, its own memory store, and its own guardrail engine would be a monolith. Instead it **depends on** four distinct logical building blocks, each independently ownable and substitutable, and declares those dependencies explicitly so the architecture is checkable and the gaps are visible.

## 2  Building block

### 2.1  Component Diagram

The diagram shows the agent platform as an orchestration boundary that depends on four external logical ABBs. The orchestrator owns the agent loop (perceive → reason → act → observe); the reasoning, tools, memory, and guardrail concerns sit outside its boundary and are reached through the declared interfaces.

*(Diagram omitted in this worked example — see the foundation ABBs for full `components.drawio`/`.png` sets. This example focuses on the `requires` frontmatter and §3.4.)*

### 2.2  Fundamental functionality

- **Agent Orchestrator.** Runs the agent loop: assembles context, calls the reasoning engine, dispatches tool calls, folds results back into context, and decides when the goal is met.
- **Context Assembler.** Builds the working context for each step from the task, retrieved memory, and tool results.
- **Action Dispatcher.** Translates the reasoning engine's chosen action into a tool invocation and normalises the result.
- **Trace Emitter.** Records every reasoning step, tool call, and decision as an audit trace.

### 2.3  Attributes

- **Substitutability.** Each dependency is satisfied through a logical interface, so the reasoning engine, tool set, memory, or guardrail implementation can be swapped without changing the platform.
- **Boundedness.** The platform cannot act except through tools, and every tool call passes the guardrail check — the blast radius is contained by construction.
- **Observability-by-default.** Every loop iteration emits a trace, so agent behaviour is reconstructable after the fact.

### 2.4  Semantic

Inside the boundary: the agent loop, context assembly, action dispatch, and trace emission. Outside the boundary: the model that does the reasoning (ABB-011), the tools the agent acts through (ABB-012), any cross-turn memory (ABB-013), and the safety policy engine (ABB-014). The platform is the *coordinator*; the capabilities it coordinates are separate ABBs it `requires`.

### 2.5  Identity & Access Management

- **Authentication model.** The agent runs under its own non-human workload identity; callers submitting goals authenticate via federated identity.
- **Authorisation approach.** Tool access is scoped per agent identity; the agent may only invoke tools its capability scope permits.
- **Non-human identity.** Each agent instance is a first-class workload principal with a short-lived credential.
- **Credential management.** No standing secrets in the agent; tool credentials are brokered per call.

### 2.6  Observability

- **Signals emitted.** Reasoning steps, tool invocations, token usage, and decision outcomes as structured traces and metrics.
- **Audit trail.** The full perceive-reason-act-observe sequence is recorded per task for replay and compliance.
- **Health and liveness.** Loop progress, error rates, and guardrail-rejection rates are reported as metrics.
- **Compliance data feeds.** Traces feed AI Act logging and human-oversight requirements.

### 2.7  Governance & Policy Enforcement

- **Policy enforcement.** Every action is checked against the Safety & Guardrails ABB before dispatch; the platform enforces the verdict (allow, deny, escalate).
- **Regulatory alignment.** EU AI Act human-oversight and logging obligations; organisational AI-use policy.
- **Data classification.** The agent may handle regulated data passed in context; classification is propagated to memory and tool calls.
- **Change governance.** Changes to the agent's instructions, tool scope, or guardrail set are governed Decision Records.

## 3  Interfaces

### 3.1  Overview

| ID | Direction | Type | Description |
|----|-----------|------|-------------|
| **I1** | Caller → Agent Platform | Request | Goal / task submission (prompt + context). |
| **I2** | Agent Platform → Tool Integration | Callback | Tool invocation request and result. |
| **I3** | Agent Platform → Observability | Event stream | Action / decision trace for audit. |
| **I4** | Agent Platform → Agent Memory | Query | Memory read/write across turns. |

### 3.2  Interoperability

Interfaces are model- and vendor-neutral: I2 conforms to a tool-calling contract (e.g. an MCP-style tool schema) so any Tool Integration realisation interoperates; I4 is a memory read/write contract independent of the backing store.

### 3.3  Dependent building blocks

| ABB | Required functionality | Named interface |
|-----|----------------------|--------------------|
| Agent Platform → Tool Integration | Executes tool calls on external systems | I2 |
| Agent Platform → Agent Memory | Persists and retrieves cross-turn state | I4 |

### 3.4  Capability dependencies (requires)

This ABB depends on four other logical ABBs to deliver its capability. These are **capability-level** dependencies (which logical building blocks must exist), distinct from the §3.3 interface-level list and from any concrete product wiring in a realising SBB. They are declared in the `requires` frontmatter and feed gap analysis: any required ABB absent from the catalogue is an architecture gap, and a `cardinality: "1"` dependency that is missing is a *hard* gap.

| Required ABB | Cardinality | Rationale |
|--------------|-------------|-----------|
| [ABB-011](../ABB-011/) Reasoning Engine | 1 | Every agent needs a reasoning engine — without a model to plan and decide, there is no agent. |
| [ABB-012](../ABB-012/) Tool Integration | 1..n | Agents interact with external systems via tools; a useful agent has at least one, usually many. |
| [ABB-013](../ABB-013/) Agent Memory | 0..1 | Stateful agents need persistent memory across turns; purely reactive agents may omit it. |
| [ABB-014](../ABB-014/) Safety & Guardrails | 1 | Production agents require safety guardrails on every action before it is dispatched. |

## 4  Mapping

### 4.1  Mapping to business/organisational entities

- **Agent Orchestrator** → the autonomous-operations function that owns agent behaviour.
- **Trace Emitter** → the compliance/audit function.

### 4.2  Mapping to business/organisational policies

- **AI Use Policy.** The platform enforces approved-use and human-oversight rules via ABB-014.
- **Data Handling Policy.** Classification is propagated through context, memory, and tool calls.

### 4.3  Mapping to capabilities

Capability mapping is illustrative in this worked example. In a real workspace this ABB would realise a dedicated AI / Autonomous-Agent capability under the platform foundation; `realises_capabilities` is set to a placeholder (`CAP-040`) only so the example validates against the schema's "≥1 capability" rule. Replace it with the genuine capability when adapting this pattern.

## 5. Solution Building Block (SBB) Guidance

### 5.1  Structural Pattern for Agent SBBs

A realising SBB selects a concrete model (for ABB-011), a tool runtime (for ABB-012), an optional memory store (for ABB-013), and a policy engine (for ABB-014), then wires them — often as a **composite SBB** whose parts realise the required ABBs. The `requires` list tells the SBB author exactly which logical pieces must be satisfied.

### 5.2  Shared Patterns

SBBs inherit the agent loop, trace emission, and guardrail-before-dispatch enforcement from this ABB and MUST NOT re-implement them.

### 5.3  Agent-Specific Constraints

Each SBB documents its model family, context-window budget, tool set and scopes, memory retention policy, and the specific guardrail tiers it enforces.

## 6. Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 0.1.0 | 2026-06-06 | Initial Draft | AI Agent Platform example created to demonstrate the `requires` capability-dependency field. |
