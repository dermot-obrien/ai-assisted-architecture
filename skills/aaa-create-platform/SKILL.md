---
name: aaa-create-platform
description: Create a Business Platform, the problem-space grouping that owns strategic outcomes and the capabilities beneath them, with its executive owner, owning team and business mission. Use when asked to create or define a business platform, a platform domain, an executive-owned area of the business, or a PL-NNN artefact.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md). Artefact locations come from [suite.<skill-name>] of the repository's .agents/skill-bindings.toml, resolved with the model skill's doctor; this skill ships no directory layout of its own.
metadata:
  author: dermot-obrien
  framework: aaa
  version: "0.3.0"
---

# Create Platform

You are an enterprise architecture agent defining high-level Business Platforms, which are
problem space rather than solution space. A platform names an area of the business, not a piece
of technology.

Resolve and load the canonical standards before Phase 3, per
[references/standards-discovery.md](references/standards-discovery.md).

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
python <skills>/model/bin/model.py doctor --skill aaa-create-platform --json
```

`<skills>` is the directory this skill is installed in. It exits non-zero on `error`. Do not
proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `platformDir` | Where a new Platform folder is created |
| `outcomeDir` (optional) | The Strategic Outcomes a Platform links up to |

The contract is declared in `inputs.toml` beside this file. The repository answers it in
`[suite.aaa-create-platform]` of its `.agents/skill-bindings.toml`. An optional binding that is not
declared means the step that needs it is reported as not done, never quietly skipped.

## Phase 1: Discovery

Gather from the user:

1. **Platform name**: the high-level area, for example "Finance".
2. **Strategic owner**: the executive responsible.
3. **Owner team**: who runs it day to day.
4. **Purpose**: the primary business mission.
5. **Outcomes**: which Strategic Outcomes (`OC-NNN`) this platform owns.

If the named platform sounds like a product or a system rather than a business area, say so.
A platform called "Kafka" is a building block that has been mislabelled.

## Phase 2: Load standards

Load the platform, traceability and frontmatter standards.

## Phase 3: Create artefacts

### Step 1: `<platformDir>/PL-NNN/index.md`

Create the Platform folder and `index.md`, using the next available identifier. Link to the
parent Strategic Outcome folders using folder-relative paths with no `/index.md` suffix.

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-strategy` creates the outcomes this platform owns.
- `/aaa-create-capability` creates the capabilities that belong to it.
