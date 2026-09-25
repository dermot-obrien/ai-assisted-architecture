---
name: aaa-create-context
description: Create a Bounded Context defining a linguistic and structural boundary, capturing its ubiquitous language, its owning team, the capabilities it realises and the ABBs that live inside it. Use when asked to create or define a bounded context, a domain boundary, a ubiquitous language for a domain, or a BC-NNN artefact.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md).
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Bounded Context

You are an enterprise architecture agent defining linguistic and structural boundaries. The
value of a bounded context is the language it fixes: inside it, each term means exactly one
thing.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Phase 1: Discovery

1. **Platform**: which Platform (`PL-NNN`) does this context realise? Search `platforms/`. If
   none exists, offer `/aaa-create-platform` first.
2. **Context name**: the technical boundary, for example "Claims Management".
3. **Owner**: which team owns the model and the implementation.
4. **Ubiquitous language**: the five to ten most important terms in this domain and what each
   means here specifically.

Push on the language. Where a term already means something different in a neighbouring
context, that difference is the boundary and is worth recording explicitly.

## Phase 2: Load standards

Load the bounded context, traceability and frontmatter standards.

## Phase 3: Create artefacts

### Step 1: contexts/BC-NNN/index.md

Create the folder and `index.md`. Include the Ubiquitous Language section, and map the context
to the parent business Capability folders it realises.

### Step 2: Map the ABBs

Identify which logical ABBs (`ABB-NNN`) live within this context and link them using
folder-relative paths with no `/index.md` suffix.

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-capability` creates the capability this context realises.
- `/aaa-create-abb` creates the building blocks inside it.
