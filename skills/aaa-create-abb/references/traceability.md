# Traceability and enforcement

## The golden thread

Every new artefact must trace upward through the full chain:

```
Outcome -> Use Case -> Platform -> Capability -> Context -> ABB -> SBB -> Service
```

An artefact that cannot name its parent is not finished, whatever else is complete.

## Enforcement rules

- Traceability requirements apply to every new artefact, without exception.
- Colour references use identifiers from the visual design standard, for example `1.1`,
  never raw hex values inline.
- Cross-references use folder-relative paths and must not append `/index.md`.

## Proposing a missing parent

Where a parent does not exist, propose it rather than inventing it silently or creating it
unasked. Name a plausible candidate, say what it would contain, and ask whether to create the
vertical slice. A user who declines gets the artefact with its gap recorded, not a fabricated
parent.

## Self-check before finalising

Confirm all four:

1. Every canonical standard for this artefact type was loaded before anything was written.
2. This skill's workflow was followed in order, with no phase skipped.
3. The AI Agent Self-Verification Checklist from the relevant standard was executed.
4. The golden thread back to a Strategic Outcome is intact and every link resolves.

If any check fails, fix it before reporting the artefact as created. Report honestly which
checks passed rather than asserting completion.
