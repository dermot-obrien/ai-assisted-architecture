# aaa-create-context

Creates a bounded context: the boundary inside which one domain model and its language hold,
with its ubiquitous language, owning team, the capabilities it realises and the ABBs inside it.

Use it when you want to create or define a bounded context, a domain boundary, a ubiquitous
language for a domain, or a `BC-NNN` artefact.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `contextDir` | yes | Where `BC-NNN/` folders are created |
| `platformDir` | yes | Searched for the platform the context belongs to |
| `capabilityDir` | no | For mapping the context to the capabilities it realises |

Standards it loads: bounded context (`standard-bounded-context.md`), traceability and front
matter.

## What it asks you

1. The platform (`PL-NNN`). If none exists, it offers
   [aaa-create-platform](aaa-create-platform.md) first.
2. The context name, such as "Shipment Tracking".
3. The owning team, for both the model and the implementation.
4. The five to ten most important terms in the domain, and what each means here.

It pushes on the language. A term that means something different in a neighbouring context
marks the boundary, and is worth recording.

## What it writes

| File | Contents |
|---|---|
| `<contextDir>/BC-NNN/index.md` | The context, its Ubiquitous Language section, the capabilities it realises, and links to the ABBs inside it |

## Try it

```text
/aaa-create-context Create the Shipment Tracking context on the Fulfilment platform, owned by
the tracking team. Key terms: shipment, consignment, carrier event, delivery promise.
```

## Related

- [aaa-create-capability](aaa-create-capability.md) creates the capability it realises.
- [aaa-create-abb](aaa-create-abb.md) creates the building blocks inside it.
