# aaa-create-abb

Creates a TOGAF-aligned Architecture Building Block: a logical, product-independent component,
with its document, component diagram, C4 system context view where it is top-level, PNG exports
and summary.

Use it when you want to create, add or scaffold an ABB, define a logical building block under a
capability or bounded context, or fill an ABB gap that another artefact's `requires` list
exposed.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `abbDir` | yes | Where `ABB-NNN/` folders are created |
| `contextDir` | no | The parent bounded context, for the mandatory link back |
| `capabilityDir` | no | The parent capability, for the mandatory link back |

Standards it loads: ABB document and ABB diagram (`standard-abb-document.md`,
`standard-abb-diagram.md`), traceability, front matter and visual design, plus the C4 context
diagram standard for a top-level ABB. PNG export needs draw.io desktop.

## What it asks you

1. The bounded context it lives in. If missing, it suggests one and an owner.
2. The capability it realises. If missing, it suggests a technology-agnostic L3 capability.
3. Whether to create that vertical slice, context and capability and ABB, together.
4. Its key interfaces and the SBBs you plan.
5. Its dependencies on other ABBs: for each, the `ABB-NNN`, the cardinality (`1`, `0..1`,
   `1..n`, `0..n`) and a one-line rationale. A dependency that does not exist yet is noted as
   a gap, with an offer to create it.

Identity and access, observability and governance are always assumed, as
`mandatory_subabbs`, and are not listed as dependencies.

## What it writes

| File | Contents |
|---|---|
| `<abbDir>/ABB-NNN/index.md` | The ABB, linked to its context and capability, with `requires` and the Capability Dependencies table where it has dependencies, and a C4 System Context section (2.1.1) when top-level |
| `components.drawio`, `components.png` | The 960 by 1080 component diagram with the cross-cutting sub-ABBs and a legend, exported at 300 DPI |
| `summary.md`, `summary.drawio`, `summary.png` | The summary panel |

`requires` is what moves a capability to R2 on the
[definition ladder](../concepts.md#the-definition-ladder): an ABB with no dependencies declares
`requires: []`.

## Try it

```text
/aaa-create-abb Create an ABB for a Delivery Event Ingestor in the Shipment Tracking context,
realising Order Tracking. It needs a message broker ABB.
```

## Related

- [aaa-create-context](aaa-create-context.md) and [aaa-create-capability](aaa-create-capability.md)
  create its parents.
- [aaa-create-sbb](aaa-create-sbb.md) creates the SBB that realises it.
- The worked example is in `standards/building-blocks/architecture-building-blocks/example/`;
  see [Examples](../examples.md).
