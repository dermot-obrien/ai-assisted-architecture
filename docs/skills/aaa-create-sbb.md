# aaa-create-sbb

Creates a TOGAF-aligned Solution Building Block: the realisation of an ABB in real products. It
decides whether the SBB is simple or composite, maps every ABB component to a product, and for a
composite authors the structure of ports, parts and connectors.

Use it when you want to create, add or scaffold an SBB, map a product or vendor technology onto
an ABB, or model a composite assembly of sub-SBBs.

## Before you start

| Binding | Required | Used for |
|---|---|---|
| `sbbDir` | yes | Where `SBB-NNN/` folders are created, composites included |
| `abbDir` | no | The ABB it realises, for the link |

Standards it loads: SBB document and SBB diagram (`standard-sbb-document.md`,
`standard-sbb-diagram.md`), front matter including the composite fields, traceability and
visual design, plus the C4 context diagram standard for a composite. PNG export needs draw.io
desktop.

## What it asks you

1. The ABB (`ABB-NNN`) it realises. If missing, it suggests one from the product, such as a
   "Structured Data Store" ABB for PostgreSQL.
2. The bounded context, if the ABB is missing too.
3. Whether to create that vertical slice first.
4. The products, platforms and cloud providers.

Then it decides simple or composite by the test in the SBB document standard. Simple is one
product or family with a flat mapping; composite is an assembly of sub-SBBs whose structure is
worth modelling. When in doubt it starts simple.

## What it writes

| File | Contents |
|---|---|
| `<sbbDir>/SBB-NNN/index.md` | The SBB, with every component of the parent ABB mapped to a product in section 2.2, and any unmapped component named as a gap |
| `components.drawio`, `components.png` | For a simple SBB: the component diagram with ABB reference badges and the cross-cutting containers |
| Mermaid composite-structure diagram in `index.md` | For a composite: the normative view, with `composite: true`, `ports`, `parts` and `connectors` in the front matter |
| `summary.md`, `summary.drawio`, `summary.png` | The summary panel |

An SBB with status `accepted` or `active` for every ABB of a capability is what R4 on the
[definition ladder](../concepts.md#the-definition-ladder) needs.

## Try it

```text
/aaa-create-sbb Realise the Delivery Event Ingestor ABB with a managed Kafka service and a
small stream processor.
```

## Related

- [aaa-create-abb](aaa-create-abb.md) creates the ABB it realises.
- [aaa-create-service](aaa-create-service.md) creates the runtime service that deploys it.
- Worked examples, simple and composite, are in
  `standards/building-blocks/solution-building-blocks/`; see [Examples](../examples.md).
