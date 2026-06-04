<!--
SPDX-FileCopyrightText: 2026 Dermot O'Brien
SPDX-License-Identifier: CC-BY-4.0
-->
---
document_type: standards
title: "Executable Contracts Standard"
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
  - "Defining the seam between two bounded contexts or platforms"
  - "Refining an api / Interface artefact into a runnable contract"
  - "Adding contract or invariant gates to CI"
---

# Executable Contracts Standard

Implements **P1** (the artefact is the source of truth) and **P5** (machine-checkable).
Refines the catalogued `api` / `service` artefacts (and the ontology `Interface`) from a
*described* contract into a **runnable** one that the implementation is verified against
continuously.

## Why

At agent scale, the contract on a seam is the **substitute for the human judgment** that no
longer sits at each node. When a human owned the consuming side, they read the producer's
code and used judgment. Agents integrate against the *declared interface*: if it is prose,
the agent guesses; if it is executable, the agent is checked.

## The three artefacts of a seam

A context's seam (its `api` and consumed/produced events) is defined by three
machine-checkable artefacts, plus a declared SLO and a generated client SDK:

1. **Synchronous API** — an OpenAPI/gRPC document referenced from the `api` artefact, with
   explicit versioning and a deprecation policy.
2. **Asynchronous events** — a JSON Schema per event consumed and produced, in a registry,
   so a consumer knows the shape without reading the producer.
3. **Invariants** — property-based assertions that must hold for *any* implementation. These
   are the executable form of the spec; they are what an agent must preserve when it
   regenerates the code.

## Invariants are the spec, not example tests

The distinction that makes this agent-native:

- An **example test** says "given input X, expect Y." It pins one path.
- An **invariant** says "for all inputs, property P holds." It pins every path.

Invariants are what survive a rewrite. An agent cannot satisfy them by accident, and cannot
quietly drop one without a red test. Author invariants as `for-all` statements derived from
the artefact's guardrails and accounting rules; back them with property-based tests.

## Verification (the gate)

| Check | When | Fails the merge if |
|---|---|---|
| **Schema lint** | every commit | the OpenAPI/event schema is malformed |
| **Property tests** | every commit | any invariant is violated by the implementation |
| **Consumer-driven contract tests** | every commit on the producer | a known consumer's expectations break |
| **Breaking-change detection** | every contract change | a backward-incompatible change ships without a version bump + deprecation |

**Consumer-driven contract testing is the key scaling move:** the *consumer's* expectations
run in the *producer's* CI, so the producer cannot silently break a downstream context. It
is the machine-native replacement for "the two teams talked before merging," and it is what
lets a context graduate to its own repository without losing the seam guarantee.

## Relationship to the building-block standards

The OpenAPI/event document is the **SBB-level** (technology-specific) realisation of the
`Interface`; the `api` artefact and its invariants are the **ABB-level** (technology-agnostic)
contract. Keeping the invariants at the ABB level means they survive a change of
implementation technology — the contract is stable while the SBB beneath it changes.
