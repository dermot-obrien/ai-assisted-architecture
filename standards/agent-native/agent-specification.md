<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Agent Specification Standard"
classification: internal
version: 0.1.0
status: draft
created: 2026-06-05
last_modified: 2026-06-05
owner: "Architecture Team"
provenance:
  origin: ai-generated
  authored_by: claude-opus-4.8
  review_state: ai-verified
triggers:
  - "Specifying an AI agent (builder or runtime) as a catalogued artefact"
  - "Defining an agent's model, tools, skills, guardrails, identity, or discovery surface"
  - "Aligning an agent definition with MCP / A2A / OASF"
---

# Agent Specification Standard

Defines the **vendor-neutral component set** an AI agent carries, and how each component
maps onto contemporary interoperability standards. The machine-validatable form is
[`schemas/v1.1.0/agent-profile.schema.json`](../schemas/v1.1.0/agent-profile.schema.json).

An agent is **not a new metamodel entity** — it is modelled as a `Component`
(`component_type: service`; see [`agent-types.md`](agent-types.md)) that carries an **agent
profile**: the fields below. A `platform_guardrail` `Standard` governs it; an `Interface`
carries each contract.

## Standards this aligns to (verified, with currency)

| Standard | Owns | Status (2026) |
|---|---|---|
| **MCP** — Model Context Protocol | the **tool / data-connection** layer (Tools, Resources, Prompts; Sampling, Roots, Elicitation) over JSON-RPC 2.0 | spec rev **2025-11-25**; `modelcontextprotocol.io` |
| **A2A** — Agent-to-Agent | **discovery**: the **Agent Card** + **AgentSkill** object | ~v0.2.5–0.3.0; **Linux Foundation** (orig. Google); `a2a-protocol.org` |
| **OASF** — Open Agentic Schema Framework (AGNTCY) | vendor-neutral **capability/metadata catalogue**: the *record* + composable *Modules* | LF since **2025-07-29**; `docs.agntcy.org/oasf` |
| **Anthropic Agent Skills** | filesystem-packaged **skills** (`SKILL.md`) | `platform.claude.com` (verified 2026-06) |
| **OpenAI Agents SDK** | a vendor **agent object** (corroborates the component set; MCP first-class) | `openai.github.io/openai-agents-python` |
| **OWASP Top-10 for Agentic Applications (2026)** | the **threat model** the guardrail/identity components must answer (ASI01–ASI10) | `genai.owasp.org` |

> **Caveat:** MCP/A2A/OASF field schemas are verified against primary specs and are
> fast-moving (partly pre-1.0) — pin the version. The academic "policy-core + memory +
> verifier" decomposition rests on a single preprint; treat as representative, not ratified.

## The component set

| # | Component | Source standard | Key fields |
|---|---|---|---|
| 1 | **Identity** | A2A Agent Card / OASF record | `id`, `name`, `version`, `description` |
| 2 | **Model** (policy core) | vendor (OpenAI SDK `model`/`model_settings`) | `model`, `provider`, `inference_params` (temperature, top_p, max_tokens…) |
| 3 | **Instructions** | vendor (`instructions` = system prompt) | system prompt / persona (inline or ref) |
| 4 | **Tools** | **MCP Tool** | per tool: `name`, `title`, `description`, `inputSchema`, `outputSchema`, `annotations` (untrusted unless trusted source), `execution.taskSupport` (`forbidden`\|`optional`\|`required`); plus `tool_sources` (MCP servers) |
| 5 | **Skills** | **A2A AgentSkill** | per skill: `id`, `name`, `description`, `tags` (required) + `examples`, `inputModes`, `outputModes` |
| 5b | **Packaged skills** | **Anthropic `SKILL.md`** | `name` (≤64, lowercase/digits/hyphens, not "anthropic"/"claude"), `description` (≤1024); progressive disclosure L1 metadata → L2 body → L3 resources; bundles instructions/code/resources |
| 6 | **Memory** | academic | `short_term` (working context), `long_term` (persistent state) |
| 7 | **Knowledge / context** | MCP Resources | resource refs / RAG sources |
| 8 | **Capabilities / permissions** | MCP Roots + Elicitation; capability scoping | `allowed_actions`, `boundaries`, what it **may not** do |
| 9 | **Guardrails / safety** | `platform_guardrail` Standards + OWASP ASI01–ASI10 | refs to guardrail Standards + tier (T0–T3); input/output checks |
| 10 | **Identity / auth** | A2A `securitySchemes`; NIST agent identity; SPIFFE | `schemes` (api_key \| oauth2 \| mtls \| spiffe), workload identity |
| 11 | **Evaluation / observability** | (reconciliation + provenance) | `evals`, `observability` (telemetry) |
| 12 | **Provenance** | this framework ↔ OASF authors/annotations | `origin`, `authored_by`, `review_state`, `verified_by` |
| 13 | **Extensibility** | **OASF Modules** | composable `modules[]` |
| 14 | **Discovery** | A2A Agent Card (`/.well-known/agent-card.json`) + OASF record | the published runtime projection |

Two distinctions the research surfaced, kept explicit:
- **A2A AgentSkill ≠ Anthropic Skill.** The first is a *discovery descriptor* (§5); the
  second a *filesystem-packaged capability* (§5b). Both are valid; they are different things.
- **MCP `annotations` are untrusted** unless from a trusted source (mirrors the Skill
  security note). Tool/skill trust is a guardrail concern, not metadata to believe.

## Builder spec ↔ runtime card = ABB ↔ SBB

The same agent has two faces, and they are the framework's existing refinement edge:

| | Builder-time **specification** | Runtime **discovery card** |
|---|---|---|
| What | model, instructions, tools, skills, guardrails, capability scope | A2A Agent Card / OASF record published by the deployed agent |
| TOGAF level | **ABB** (logical, technology-agnostic) | **SBB** (concrete, endpoint-bound) |
| Authored by | builder agents (build-time) | emitted by the runtime agent (run-time) |
| Governed at | CI gates | discovery + action gates |

So the builder authors the **ABB-level profile**; on deploy, the runtime agent publishes its
**SBB-level Agent Card** — linked by `realises_abb_ids`, exactly as a product SBB realises a
logical ABB. A catalogued agent is therefore *also* an interoperable one (MCP for tools, A2A
for discovery) with no extra modelling.

## Mapping to the OWASP agentic threat model

The guardrail/identity/capability components (§8–10) exist to answer ASI01–ASI10:

| OWASP (2026) | Answered by |
|---|---|
| ASI: **Excessive Agency / Tool Misuse** | §8 capability scope + §4 tool `annotations` untrusted + tiered guardrails |
| **Memory Poisoning** | §6 memory provenance + §9 guardrails on memory writes |
| **Identity Abuse** | §10 auth (oauth2/mtls/SPIFFE workload identity) |
| **Agent Goal Hijack** | §3 instructions integrity + §9 input guardrails |
| **Human-Agent Trust Exploitation / Rogue Agents** | §12 provenance on every output + §11 observability + reconciliation |

## Self-verification checklist

1. [ ] Is the agent modelled as a `Component` with an attached agent profile?
2. [ ] Is every tool MCP-shaped, and are external tool `annotations` treated as untrusted?
3. [ ] Are discovery skills A2A-shaped and packaged skills `SKILL.md`-shaped (not conflated)?
4. [ ] Does every real-world action map to a `platform_guardrail` Standard with a tier?
5. [ ] Is auth specified with a workload identity scheme for a runtime agent?
6. [ ] Does the runtime agent publish an Agent Card that `realises` the builder-time profile?
7. [ ] Validate the profile against `schemas/v1.1.0/agent-profile.schema.json`.
