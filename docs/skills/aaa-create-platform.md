# aaa-create-platform

Creates a business platform: the team-owned, executive-sponsored area of the business that owns
strategic outcomes and the capabilities beneath them.

Use it when you want to create or define a business platform, a platform domain, an
executive-owned area of the business, or a `PL-NNN` artefact.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `platformDir` | yes | Where `PL-NNN/` folders are created |
| `outcomeDir` | no | Where the outcomes it owns live, so links are written as paths |

Standards it loads: platform (`platform-standard.md`), traceability and front matter.

## What it asks you

1. The platform name, a business area such as "Fulfilment".
2. The strategic owner: the executive accountable.
3. The owner team that runs it day to day.
4. Its purpose: the business mission.
5. The outcomes (`OC-NNN`) it owns.

A platform named after a product or system is a mislabelled building block, and the skill
says so.

## What it writes

| File | Contents |
|---|---|
| `<platformDir>/PL-NNN/index.md` | The platform, linked to its outcomes by folder-relative paths |

## Try it

```text
/aaa-create-platform Create a Fulfilment platform, owned by the operations director and run by
the fulfilment platform team, owning the outcome we just created.
```

## Related

- [aaa-create-strategy](aaa-create-strategy.md) creates the outcomes it owns.
- [aaa-create-capability](aaa-create-capability.md) creates the capabilities it provides.
- [Architectural Framework](../architectural-framework.md#22-platforms-the-who-owns-and-provides-it)
  explains why the platform is the unit of ownership.
