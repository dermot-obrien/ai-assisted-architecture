# The continuum: from enterprise architecture to deployable units

The definitions this bundle is built on, in one place, each anchored in current practice and each stated with the intention behind it. The skills, the standards, the schemas and the metamodel conform to this page. Where one of them says something different, this page is the authority and the other is the thing to fix. [Architectural Framework](architectural-framework.md) gives the longer reasoning behind the hierarchy; this page fixes the words.

The page also records how three working repositories use the words today, where they disagree, and what the bundle does about each disagreement.

## Why this page exists

An architecture method is only as coherent as its vocabulary. The words below come from four traditions that overlap without agreeing: enterprise architecture (TOGAF and ArchiMate), strategic domain-driven design, platform engineering (Team Topologies and the CNCF platforms work) and software architecture description (the C4 model, arc42, ISO/IEC/IEEE 42010). Each tradition owns part of the continuum from an enterprise down to a process running in a cloud account, and none owns all of it. The bundle has to say, for each word, which tradition's meaning it takes and where the handover between traditions happens.

The intention is a single continuum that an architect, an engineer and an agent can all walk without changing vocabulary: start at the enterprise landscape, end at a container on a node, and at every step know what the thing is, what it answers, who owns it and what it links to above and below.

## The continuum in one picture

![The continuum from the enterprise landscape through platform, capability, bounded context, architecture building block, solution building block and service to deployment node, with outcomes, use cases, domains and products on the left, and patterns, considerations and contracts on the right](continuum.svg)

Three bands run across the picture. The problem space (landscape, platform, capability) says who owns what and what must be possible. The solution space (bounded context, architecture building block, solution building block) says how it is structured and built. The runtime (service, deployment node) says what runs where. Patterns sit beside the solution space because they compose building blocks at any scope; products sit beside the whole thing because they are what a consumer is offered and what a team runs.

## The levels

Each level below gives the definition the bundle adopts, the practice it is taken from, the question it answers, and how it appears in the bundle. The relationships are summarised in [one table](#the-relationships) after the levels.

### Enterprise landscape

The landscape is the whole set of platforms an enterprise runs, arranged in layers so that a platform consumes only the platforms in the layers below it, and only through their contracts. It answers: what platforms exist, and which depends on which.

In practice this is TOGAF's Enterprise Continuum applied to an organisation's own estate, and the platform-of-platforms shape that platform engineering describes: higher platforms are customers of lower ones, consumption is self-service and contract-mediated, and a platform with no consumers is retired rather than maintained. The layering the author uses puts foundation and infrastructure at the bottom, shared services above it, data and domain platforms above those, and products and experiences at the top. The same shape, with a layer holding platforms and a platform holding building blocks, connections and waves, is what the author's enterprise landscape model records for enterprise-scale work.

In the bundle the landscape has no entity yet. The metamodel's Organisation and Platform grouping is pending, and the ontology's platform entity carries no layer. The resolution below adds Layer to that grouping. In patternode-platform the landscape is `docs/architecture/platform-of-platforms.md`, with five layers L0 to L4; in LifeGuide it is `docs/2-architecture/platform-architecture.md`, with platforms PL-01 to PL-08 in layers L0 to L4.

### Platform

A platform is a team-owned, boundary-defined, self-service unit of capability: the organisational unit that owns outcomes, provides capabilities, contains one or more bounded contexts and offers products to consumers outside it. It answers: who owns and provides it.

The definition is platform engineering's. Evan Bottcher's digital platform is "a foundation of self-service APIs, tools, services, knowledge and support which are arranged as a compelling internal product"; Team Topologies gives the platform team, the Thinnest Viable Platform and the interaction modes; the CNCF Platforms White Paper gives the attributes a platform should show. The bundle keeps the executive owner and the owning team as required fields because ownership is the point of the level.

In the bundle a platform is `PL-NNN`, authored by `aaa-create-platform` to the [platform standard](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/platforms/platform-standard.md), with `owns_outcomes`, `provides_capabilities` and `contains_bounded_contexts`. The front matter is in the [frontmatter standard §6.3](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/standard-frontmatter.md).

### Domain and subdomain

A domain is the sphere of knowledge and activity a system is about: the problem space, before any decision about how it is solved. A subdomain is a part of a domain, classified as core (where the business differentiates), supporting (needed, not differentiating) or generic (bought or borrowed). A domain answers: what problem are we in.

This is Eric Evans's definition in Domain-Driven Design, with Vaughn Vernon's subdomain classification from Implementing Domain-Driven Design. The bundle's framework document argued that platform replaces domain as the grouping unit, and that holds for ownership. It does not hold for meaning: a platform is an ownership and consumption boundary, a domain is a boundary of subject matter, and the two usually coincide without being the same thing. Patternode's target state groups its contexts into trading, data, knowledge and platform; LifeGuide divides its contexts into core and supporting. Both are domain language, and both are useful beside the platform language.

In the bundle a domain is not a folder or an identifier. It is recorded in two places: the subdomain classification of each bounded context, `subdomain_kind: core | supporting | generic`, and the domain a platform serves, named in the platform's purpose. A domain is realised by one or more platforms and is never owned by more than one.

### Capability

A capability is what the organisation must be able to do, expressed in business terms and independent of how it is done. It encompasses organisation, people, processes and technology, and it survives a change of implementation. It answers: what must be possible.

The source is TOGAF's Business Architecture work on business capabilities, with BIZBOK's capability mapping behind it. The bundle adds two measures a capability carries: maturity, 0 to 5, which measures a capability once it operates, and the rung on the definition ladder, R0 Unrecognised to R6 In service, which measures how far it has been defined and is derived from the artefacts beneath it rather than asserted. The two are separate axes.

In the bundle a capability is `CAP-NNN`, authored by `aaa-create-capability` to the [capability standard](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/capabilities/standard-capability-document.md), with levels L1 to L3, `realised_by_abbs`, optional `flows[]` and the rung read by `aaa-rung`. Patternode's `capabilities/` has one area, AI Operations, with thirteen L2 capabilities at R1, and its L3 sub-capabilities listed inline without identifiers.

### Product

A product is a consumable offering of one platform: what a consumer asks for, stated in the consumer's terms, and what a named team runs. It has one owner, a state (backlog or available), a runbook, a measure and a known operating cost. It requires capabilities, and it runs services. It answers: what is someone offered, and who answers for it running.

The definition is the author's own, written in Patternode's [product and capability model](https://github.com/patternode/patternode-architecture/blob/main/governance/product-capability-model.md), and it resolves a word that had three meanings. A product is the consumable offering. A vendor's offering that realises a building block is a technology. A named output of an epic is a deliverable. Platform engineering's "platform as a product" is re-expressed as: a platform offers products.

In the bundle a product has no kind yet. The resolution below adds it, with the relationships Patternode already records: Platform offers Product, Product requires Capability (optionally narrowed to flows), Product runs Service. Patternode registers products as `PRD-NNN` in `products/products.csv`.

### Bounded context

A bounded context is the boundary within which one domain model and one ubiquitous language hold. It belongs to exactly one platform, is owned by one team, realises one or more capabilities, and contains the architecture building blocks that structure its model. It is a boundary of meaning and ownership, not a deployment. It answers: where does this model and this language apply.

The source is Evans, with Martin Fowler's summary that DDD "deals with large models by dividing them into different Bounded Contexts and being explicit about their interrelationships". The relationships between contexts are the context map patterns: published language, conformist, customer and supplier, open host service, shared kernel and anti-corruption layer. Inside a context the bundle expects a hexagonal layout: a domain that imports no framework, ports it declares, adapters that implement them, and one composition root per deployable.

In the bundle a bounded context is `BC-NNN`, authored by `aaa-create-context` to the [bounded context standard](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/contexts/standard-bounded-context.md), with `part_of` the platform, `realises_capabilities`, `contains` ABBs, `ubiquitous_language`, `relationships` and `subdomain_kind`. Both patternode-platform and LifeGuide lay out their code as `bounded-contexts/<name>/`; Patternode's target state names ten contexts with their kind, record, published contract and where each runs.

### Architecture building block

An architecture building block is a package of functionality defined at the logical level, technology-agnostic, with published and reasonably stable interfaces, that realises part of a capability. It says what must exist. It answers: how is it structured, independent of product.

The source is TOGAF's building blocks: a building block is a package of functionality defined to meet business needs, with a defined boundary recognisable as a thing by domain experts, interfaces that are published and stable, and the properties of being reusable, replaceable and well specified. TOGAF describes the early, functional-level block as an architecture building block and the later, product-level block as a solution building block. The bundle makes one deliberate addition from DDD: an architecture building block lives inside one bounded context, so that its logical model is governed by that context's language. Reuse across contexts happens through a pattern that names it, or through a cross-cutting platform whose block is consumed through an adapter, never by sharing the block's model.

In the bundle an architecture building block is `ABB-NNN`, authored by `aaa-create-abb` to the [ABB document](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/building-blocks/architecture-building-blocks/standard-abb-document.md) and [diagram](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/building-blocks/architecture-building-blocks/standard-abb-diagram.md) standards, with `part_of` the context, `realises_capabilities`, `realised_by` SBBs, `requires` other ABBs and `interfaces`. Patternode's `building-blocks/abbs/` is a placeholder, so every box in its patterns is a local role today. LifeGuide uses ABB-001 to ABB-006 only for persistence technology.

### Solution building block

A solution building block is a concrete realisation of one or more architecture building blocks using named technologies: products bought, services subscribed to or components built. It records which technology realises which component of the block, the cloud and the deployment model, and, when composite, its parts, ports and connectors. It says what we chose to build or buy. It answers: which technologies realise it.

The source is again TOGAF: the solution building block sits in the Solutions Continuum, specifies the products and components that implement the functionality, and maps to the architecture building blocks it satisfies. The bundle's composite form draws on UML composite structure, and its outside view on the C4 system context diagram.

In the bundle a solution building block is `SBB-NNN`, authored by `aaa-create-sbb`, with `realises` ABBs, `products` (to be renamed `technologies`, see below), `product_mapping`, `cloud_provider`, `deployment_model` and `realised_by_services`. Patternode's `building-blocks/sbbs/` is a placeholder. Patternode's word for a vendor's offering is technology, and the bundle adopts it.

### Pattern

A pattern is a reusable architecture model: building blocks, the interfaces between them, and the scenarios that walk across them, at any scope from one recurring problem to a whole platform. A solution design instantiates a pattern for one consumer. It answers: how is this kind of problem solved, in a form others can build from.

The word comes from Alexander through the design patterns literature: a solution to a recurring problem in a context, with the forces it balances. Len Bass and colleagues add the distinction that matters here: an architectural pattern is a set of constraints on element types and their interactions, not itself an architecture. The bundle's pattern construct, authored by the `pattern` skill in [architecture-pattern](https://github.com/dermot-obrien/architecture-pattern), has two independent axes:

| Axis | Values | Set how |
|---|---|---|
| Scope | `problem`; `domain`, `capability-area`, `platform`, `hosting-profile`, `epic` | Declared in front matter as `pattern_scope` |
| Abstraction | `conceptual`, `logical`, `physical`, `mixed` | Derived by `model validate` from the kinds of box, never declared |

A pattern names the capabilities it realises, and the definition ladder reads its abstraction: a logical pattern, every box an architecture building block, is what R3 Decided needs; a physical pattern with a cost model, every box a solution building block or technology, is what R4 Buildable needs.

### Architecture pattern and reference architecture

These are two types of pattern, not two constructs. An architecture pattern is technology-agnostic: its boxes are architecture building blocks and local roles, and it is expected to be logical. A reference architecture is technology-specific: its boxes are mainly solution building blocks and technologies, it is expected to be physical, and it names the architecture pattern it makes concrete, as a solution building block realises an architecture building block.

The practice literature does not agree on the words, and the bundle does not pretend otherwise. Philippe Kruchten defines a reference architecture as a predefined architectural pattern, or set of patterns, possibly partially or completely instantiated, designed and proven for use in particular business and technical contexts. Bass defines it as a reference model mapped onto software elements. Angelov, Grefen and Greefhorst list what one contains: domain rules, standards, software and hardware elements, styles and patterns, and best practice. What the definitions share is that a reference architecture is a pattern instantiated towards technology, which is exactly the abstraction axis above. TOGAF's Architecture Continuum adds a second axis, generality: foundation, common systems, industry and organisation-specific architectures. The bundle keeps generality separate from abstraction: generality is a property of the catalogue a pattern is published in, abstraction is derived from its boxes.

In the bundle a repository names its pattern types in `[suite.pattern.types.*]` of its binding file, each with a label, an identifier series and how physical it must be, and `model validate` warns when a pattern's boxes do not fit its type. With no types bound, every pattern is just a pattern. Patternode chose that: every model is `PAT-NNN` at any scope, with `REF-NNN` kept for the ones first published as reference architectures. Both choices are valid; the two names are a type distinction a repository turns on when its readers need it.

### Service, the deployable unit

A service is the unit of execution: a runtime boundary around code that runs as its own process, separately built, versioned, released and deployed, that realises one or more solution building blocks and lives inside one bounded context. It is run by a product and deployed to one or more deployment nodes. It answers: how does it run.

The definition is the C4 model's container, which Simon Brown describes as "a runtime boundary around some code that is being executed or some data that is being stored", with the examples he lists: a server-side web application, a serverless function, a console application, a mobile app, a database. He is explicit that JAR files, assemblies and modules organise code inside a container and are not containers, and that deployment is a separate concern from the container itself. Sam Newman's test for a microservice, that it is independently deployable, is the same test. ArchiMate calls the logical thing an application component and the deployed thing an artifact on a node.

The bundle narrows C4's container in one way. A service executes code. A data store (a named database, a bucket, a table) is a resource owned by one bounded context and recorded on the service that owns it and on the node that hosts it, not as a service of its own. Whether to keep that narrowing is one of the [decisions](#decisions-for-the-owner) below.

In the bundle a service is the `service` kind, authored by `aaa-create-service` to the [service standard](https://github.com/dermot-obrien/ai-assisted-architecture/blob/main/standards/runtime/standard-service.md), with a kebab-case id, an optional `numeric_id: SV-NNN`, `realises` SBBs, `part_of` one context, `runtime_type`, `repo` and `module_path`, and `deployed_to` nodes. Patternode calls these deployables and lists fourteen on GCP and six on AWS as built, and eleven in its target state. LifeGuide's are Cloud Run services, Cloud Functions and one MCP server per context. In both, the as-built mapping breaks the one-context rule in places: Patternode's strategy engine composes three target contexts in one process, and its Segmentation context runs only as a library inside its callers. The catalogue records those as findings against the target, not as exceptions to the definition.

### Module and component

A module is a unit of code inside a service: a Gradle module, a Python package, an assembly. It is built and versioned, but it is not separately deployed. In the bundle's hexagonal layout a bounded context's modules are its contract (the published types other contexts may use), its domain (entities, rules and ports, with no framework), its adapters (the infrastructure that implements the ports) and its service module (use cases, wiring and the composition root). It answers: how is the code inside a deployable organised.

The source is Alistair Cockburn's ports and adapters, with the C4 component as the level of description. A module is not an architecture building block: the block is the logical structure, the module is one implementation's code layout for it. The bundle records modules only on the service, as `module_path` and `packages`, and does not catalogue them.

### Deployment node

A deployment node is where a service runs: a cloud account and region, a runtime such as Cloud Run or Lambda, a virtual machine, a hosting service, a device. It carries the properties that matter to operating the service: the account, the region, the scaling model, the identity the service runs as. It answers: where does it run, and under whose account.

The source is ArchiMate's node and C4's deployment diagram, and TOGAF's technology architecture behind both. The bundle has reserved the kind as `DN-NNN` since frontmatter v1.1.0 without defining it. The resolution below defines it, because the deployable register Patternode needs cannot be written without it: the same service has run on a GCE VM and is proposed as four containers on one node, and that difference is a node property, not a service property.

### Beside the continuum

Four kinds sit beside the thread rather than on it. An outcome (`OC-NNN`) is a measurable business result a platform owns and a capability serves. A use case (`UC-NNN`) is a set of behaviours that gives an actor an observable result of value, in the UML sense, with owned scenarios. A consideration (`CN-NNN`) is an open question with more than one credible answer, affecting any artefact on the thread, and a decision record (`DR-NNN`, or `ADR-NNN` where a repository keeps that series) settles it. Interfaces, APIs and events are the contracts between contexts, declared on the building blocks and published as versioned artefacts from the owning context's contract module.

## The relationships

The golden thread the bundle has always drawn, Outcome to Service, extended with the kinds this page adds. Read each row as subject, relationship, object.

| From | Relationship | To | Where it is recorded |
|---|---|---|---|
| Landscape | has | Layer | Landscape (to be added) |
| Layer | holds | Platform | Platform `layer` (to be added) |
| Platform | consumes, down and through contracts only | Platform | Landscape dependencies (to be added) |
| Platform | owns | Outcome | Platform `owns_outcomes` |
| Platform | provides | Capability | Platform `provides_capabilities` |
| Platform | contains | Bounded context | Platform `contains_bounded_contexts`, context `part_of` |
| Platform | offers | Product | Product (to be added) |
| Domain | is realised by | Platform | Platform purpose; context `subdomain_kind` |
| Outcome | requires | Capability | Outcome `requires_capabilities` |
| Use case | supports | Outcome | Use case |
| Product | requires | Capability, optionally some flows | Product `requires`, `requires_flows` (to be added) |
| Product | runs | Service | Product (to be added); service `run_by` (to be added) |
| Capability | is realised by | Bounded context | Context `realises_capabilities` |
| Capability | is realised by | Architecture building block | ABB `realises_capabilities`, capability `realised_by_abbs` |
| Capability | is realised by | Pattern | Pattern `realises`, read by `aaa-rung` |
| Bounded context | contains | Architecture building block | Context `contains`, ABB `part_of` |
| Bounded context | relates to | Bounded context | Context `relationships`, with the context map pattern |
| Architecture building block | requires | Architecture building block | ABB `requires` |
| Architecture building block | is realised by | Solution building block | SBB `realises`, ABB `realised_by` |
| Pattern | composes | Architecture building block, solution building block, technology, local role | The pattern's Building Blocks table |
| Reference architecture | implements | Architecture pattern | Pattern `implements` |
| Solution building block | is realised by | Service | Service `realises`, SBB `realised_by_services` |
| Service | is part of | Bounded context | Service `part_of` |
| Service | owns | Store | Service `stores` (to be added) |
| Service | is deployed to | Deployment node | Service `deployed_to` |
| Consideration | affects | Capability, ABB, SBB, pattern | Consideration `affects` |
| Consideration | is resolved by | Decision record | Consideration `resolved_by` |

## What the repositories say today

The same words, as each repository uses them on 16 October 2026.

| Word | This bundle | architecture-pattern | patternode-architecture | LifeGuide |
|---|---|---|---|---|
| Landscape, layer | Not an entity | Not in scope | Platform of platforms, L0 to L4, still in patternode-platform | Platform architecture, L0 to L4, PL-01 to PL-08 |
| Platform | `PL-NNN`, replaces domain as the grouping | Not in scope; `platform` is a pattern scope | No platform page yet; products name a platform "not yet in the topology" | PL-01 to PL-08 in layers, each holding contexts |
| Domain | Replaced by platform | `domain` is a pattern scope | Four groups of contexts: trading, data, knowledge, platform | Core and supporting contexts |
| Capability | `CAP-NNN`, L1 to L3, maturity and rung | `realises: [CAP-NNN]` on a pattern | One area, thirteen L2 at R1, L3 inline | Not used |
| Product | Vendor offering on an SBB; "platform as a product" | Product is a kind of box | `PRD-NNN`, the consumable offering; technology; deliverable | Three products over one core platform |
| Bounded context | `BC-NNN`, one platform, contains ABBs | Not in scope | Ten target contexts; eight as built; no `BC-NNN` pages | Sixteen contexts, the authoritative master document |
| ABB | `ABB-NNN` inside a BC, with `requires` | A kind of box, catalogue level logical | Placeholder; every box local | Six, for persistence technology only |
| SBB | `SBB-NNN`, products, mapping, composite form | A kind of box, catalogue level physical | Placeholder | Six, for persistence technology only |
| Pattern | Realises capabilities; grouping 8 pending | One construct, scope and derived abstraction, optional types | `PAT-NNN` at any scope, `REF-NNN` kept, no types bound | Not used |
| Reference architecture | Mentioned, not defined | A pattern type expected to be physical | A pattern first published under `REF-NNN` | Not used |
| Service | `service` kind, one SBB, one BC, kebab id | Not in scope | "Deployable", in prose tables as built and target | Cloud Run services, Cloud Functions, MCP servers, no registry |
| Deployment node | `DN-NNN` reserved, undefined | Not in scope | Prose: GCE VM, Cloud Run, AWS accounts | Prose and Terraform |

## Where they disagree, and what the bundle does

Each disagreement below is real, and each has a resolution this page adopts. The resolutions change the bundle; they do not ask a repository to change its words where those words already work.

1. Domain against platform. The framework document says platform replaces domain. Patternode and LifeGuide both still need a word for subject matter. Resolution: both words stay, with different jobs. Platform is the unit of ownership and consumption. Domain is the problem space, recorded as the subdomain kind on each context and in a platform's purpose, never as a folder.
2. Reusable blocks against blocks inside a context. TOGAF's building blocks are reusable across the enterprise; the bundle puts each architecture building block inside one bounded context. Resolution: the context rule stays, because a block shared across languages is the coupling DDD exists to prevent. Reuse is through patterns, which name blocks from several contexts, and through cross-cutting platforms consumed through an adapter.
3. Pattern against reference architecture. The bundle's metamodel has no pattern entity; architecture-pattern makes every model a pattern with optional types; Patternode binds no types. Resolution: pattern is one construct with two axes, scope and abstraction. Architecture pattern and reference architecture are pattern types a repository may bind, with expectations on abstraction. The metamodel's Guidance grouping records this.
4. Product with three meanings. The bundle's SBB front matter says `products` for vendor offerings and the platform standard says "platform as a product". Patternode has settled the words. Resolution: adopt Patternode's. Product is the consumable offering, a new kind. Technology is the vendor's offering, and the SBB field is renamed `technologies` in the next schema version with `products` kept as an alias. A platform offers products.
5. Service against deployable. The bundle says service; Patternode says deployable; LifeGuide's services include functions and MCP servers. Resolution: service is the catalogue kind, deployable is its plain-language synonym, and the definition is C4's container narrowed to units that execute code. A unit that composes several contexts is recorded with that finding against it.
6. Which capability level maps to blocks. The capability standard says only L3 maps to building blocks; Patternode maps L2 and lists L3 inline. Resolution: blocks attach at the lowest level a capability is defined to, and L3 is optional.
7. Deployment node undefined. Resolution: define `DN-NNN` with account, region, runtime, scaling model and run-as identity, and make `deployed_to` on a service resolve to it.
8. No landscape or layer. Resolution: add Layer to the Organisation and Platform grouping, with `layer` on the platform and a landscape page that records the layers and the permitted dependency direction.
9. Stores. C4 counts a database as a container; the bundle's service executes code. Resolution proposed, not settled: a store is a resource owned by one context, recorded on the owning service and on its node. See the decisions below.

## Decisions for the owner

| # | Decision | Options | Recommended |
|---|---|---|---|
| D1 | A data store is a service, or a resource of one | A service in its own right, as C4 does; a resource recorded on the owning service and its node | A resource. A store has no code to release, and the ownership rule (one context, one store) is what matters |
| D2 | The SBB field for vendor offerings | Keep `products`; rename to `technologies` with an alias | Rename, in the next schema version |
| D3 | Service identifiers | Kebab-case slug only; slug with `numeric_id: SV-NNN`; `SV-NNN` as the primary id | Slug with `numeric_id`, so a repository whose prose links identifiers can link `SV-NNN` while code keeps the slug |
| D4 | Where blocks attach | L3 only; the lowest defined level | The lowest defined level |
| D5 | Pattern types in the bundle's own guidance | Define architecture pattern and reference architecture as named types; leave every pattern untyped | Define the two types as optional, with the abstraction each expects, and let each repository bind or not |

## What changes in the bundle

In the order the work should be done.

1. The metamodel. Consolidate groupings 2 (Organisation and Platform, with Layer and Product), 5 (Solution Boundary), 6 (Runtime, with Service, Store and Deployment Node) and 8 (Guidance, with Pattern and its types) against this page.
2. The frontmatter standard and schemas. Define `DN-NNN`, add the `product` kind, add `layer` to the platform, `run_by` and `stores` to the service, and `technologies` to the SBB.
3. The skills. `aaa-create-service` writes a folder per service as every other skill does, and links the product that runs it; a new `aaa-create-product` writes a product with its state and required capabilities and checks the state against the rungs; `aaa-create-platform` records the layer.
4. The documents. The concepts page and the framework document point here for definitions; the traceability standard carries the relationships table above.
5. The exemplar. Patternode's architecture repository applies the runtime level first: a register of its services and nodes as built and as targeted, each service carrying its context, its code path and its findings against the target, and one service traced back through solution building block, architecture building block, bounded context and capability to the platform that owns it.

## Sources

- The Open Group, TOGAF Standard, Enterprise Continuum and Building Blocks. Introductory text at [Introduction to Building Blocks](https://pubs.opengroup.org/architecture/togaf7-doc/arch/p4/bbs/bbs_intro.htm) and a summary of the continuums at [Understanding TOGAF's Continuums](https://togaf.visual-paradigm.com/2023/10/09/understanding-togafs-continuums/).
- Eric Evans, Domain-Driven Design (2003); Vaughn Vernon, Implementing Domain-Driven Design (2013); Martin Fowler, [BoundedContext](https://martinfowler.com/bliki/BoundedContext.html).
- Matthew Skelton and Manuel Pais, Team Topologies (2019); CNCF Platforms White Paper (2024); Evan Bottcher, What I Talk About When I Talk About Platforms (2018).
- Simon Brown, the C4 model, [Container](https://c4model.com/abstractions/container) and [Component](https://c4model.com/abstractions/component).
- Len Bass, Paul Clements and Rick Kazman, Software Architecture in Practice, [Architectural Patterns, Reference Models, and Reference Architectures](https://people.ece.ubc.ca/matei/EECE417/BASS/ch02lev1sec3.html).
- Philippe Kruchten, on reference architectures, and Angelov, Grefen and Greefhorst, A framework for analysis and design of software reference architectures (2012), as surveyed in [Towards suitable description of reference architectures](https://peerj.com/articles/cs-392).
- Robert Cloutier and colleagues, The Concept of Reference Architectures, Systems Engineering (2010).
- Alistair Cockburn, Hexagonal Architecture (2005); Sam Newman, Building Microservices (2nd edition, 2021).
- The Open Group, ArchiMate 3.2 Specification; ISO/IEC/IEEE 42010:2022.
- Patternode: [Product and Capability Model](https://github.com/patternode/patternode-architecture/blob/main/governance/product-capability-model.md), Target State, Platform Components and Pattern Specification. LifeGuide: Bounded Contexts and Platform Architecture.
