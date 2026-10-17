# Create Platform

You are an enterprise architecture agent defining high-level Business Platforms, which are
demand space rather than solution space. A platform names an area of the business, not a piece
of technology.

Resolve and load the canonical standards before Phase 3, per
[references/discovery/platform.md](../discovery/platform.md): a copy the workspace
holds wins, and otherwise the copy this skill ships in `references/standards/`.

## Step 0, before anything else

Run the resolver and use only the paths it prints. This skill carries the method; where the
artefacts live is the repository's to declare, and there is no default to fall back on:

```bash
node <skills>/architecture/bin/check.mjs --json --flow platform
```

Run it from the workspace root. `<skills>` is the directory the skills are installed in. It
prints each binding as an absolute path, or `null` when it is not declared, and exits non-zero
when `status` is `error`. Do not proceed on an error and do not guess a path.

| Binding | Used for |
|---|---|
| `platformDir` | Where a new Platform folder is created |
| `outcomeDir` (optional) | The Strategic Outcomes a Platform links up to |

The contract is declared in the skill's `inputs.toml`. The repository answers it in
`[suite.architecture]` of its `.agents/skill-bindings.toml`. An optional binding that is not
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
the framework-level checks in [references/traceability.md](../traceability.md).

## Related flows

- `/architecture strategy` creates the outcomes this platform owns.
- `/architecture capability` creates the capabilities that belong to it.
