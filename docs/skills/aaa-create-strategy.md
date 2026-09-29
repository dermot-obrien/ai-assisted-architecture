# aaa-create-strategy

Creates a business outcome and the use case that supports it: the top of the golden thread.
Every outcome carries a concrete measure, and every use case a named primary actor.

Use it when you want to create or define a business outcome, a strategic outcome, a use case, a
KPI-backed goal, or an `OC-NNN` or `UC-NNN` artefact.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `outcomeDir` | yes | Where `OC-NNN/` folders are created |
| `useCaseDir` | yes | Where `UC-NNN/` folders are created; may equal `outcomeDir` |

Standards it loads: strategy (`standard-strategy.md`), traceability and front matter.

## What it asks you

1. The outcome: the measurable business result, such as "Reduce cloud spend by 15%".
2. The measures: the KPI, its current value, and any further measures the outcome is judged
   by.
3. The use case: a scenario that supports the outcome, and its primary actor.
4. Traceability: which capabilities (`CAP-NNN`) it needs.

An outcome without a measure is a slogan, and the skill will say so and work on the measure
with you before creating anything.

## What it writes

| File | Contents |
|---|---|
| `<outcomeDir>/OC-NNN/index.md` | The outcome, its definition, and `measures[]` with ids `OC-NNN-M1`, `OC-NNN-M2` and so on |
| `<useCaseDir>/UC-NNN/index.md` | The use case, linked to its outcome by a folder-relative path |

Measure ids are permanent. Planning cites them as `advances_criterion_ids` and considerations
list them as criteria, so a dropped measure keeps its number and a new one takes the next. The
skill tells you the ids it created.

## Try it

```text
/aaa-create-strategy Outcome: cut customer where-is-my-order calls by 40% within a year.
Use case: a customer checks their order's delivery status without calling.
```

## Related

- [aaa-create-platform](aaa-create-platform.md) creates the platform that owns the outcome.
- [aaa-create-capability](aaa-create-capability.md) creates the capabilities the use case
  needs, and records the outcome in `required_by_outcomes`, which R1 on the
  [definition ladder](../concepts.md#the-definition-ladder) requires.
