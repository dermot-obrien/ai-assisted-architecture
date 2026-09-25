---
name: aaa-create-context
description: Create a Bounded Context defining a linguistic and structural boundary, capturing its ubiquitous language, its owning team, the capabilities it realises and the ABBs that live inside it. Use when asked to create or define a bounded context, a domain boundary, a ubiquitous language for a domain, or a BC-NNN artefact.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). Artefact locations come from [suite.<skill-name>] of the repository's .agents/skill-bindings.toml, resolved with the model skill's doctor; this skill ships no directory layout of its own.
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

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
python <skills>/model/bin/model.py doctor --skill aaa-create-context --json
```

`<skills>` is the directory this skill is installed in. It exits non-zero on `error`. Do not
proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `contextDir` | Where a new Bounded Context folder is created |
| `platformDir` | Searched for the Platform the context realises |
| `capabilityDir` (optional) | The Capabilities the context realises |

The contract is declared in `inputs.toml` beside this file. The repository answers it in
`[suite.aaa-create-context]` of its `.agents/skill-bindings.toml`. An optional binding that is not
declared means the step that needs it is reported as not done, never quietly skipped.

## Phase 1: Discovery

1. **Platform**: which Platform (`PL-NNN`) does this context realise? Search `<platformDir>`. If
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

### Step 1: `<contextDir>/BC-NNN/index.md`

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
