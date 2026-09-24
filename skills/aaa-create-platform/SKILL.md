---
name: aaa-create-platform
description: Create a Business Platform, the problem-space grouping that owns strategic outcomes and the capabilities beneath them, with its executive owner, owning team and business mission. Use when asked to create or define a business platform, a platform domain, an executive-owned area of the business, or a PL-NNN artefact.
license: CC-BY-4.0
compatibility: Needs the AI-Assisted Architecture standards present in the workspace (see references/standards-discovery.md).
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

### Step 1: platforms/PL-NNN/index.md

Create the Platform folder and `index.md`, using the next available identifier. Link to the
parent Strategic Outcome folders using folder-relative paths with no `/index.md` suffix.

## Phase 4: Self-verification

Execute the AI Agent Self-Verification Checklist from the standards listed above, then confirm
the framework-level checks in [references/traceability.md](references/traceability.md).

## Related skills

- `/aaa-create-strategy` creates the outcomes this platform owns.
- `/aaa-create-capability` creates the capabilities that belong to it.
