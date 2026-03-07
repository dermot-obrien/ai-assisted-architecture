# AI-Assisted Architecture Standards

This directory contains the canonical standards for all architectural layers in the framework. All AI agents and architects MUST follow these standards when creating or modifying artefacts.

## Directory Structure

| Folder | Layer | Purpose |
| :--- | :--- | :--- |
| `strategy/` | **Strategy & Operational** | Outcomes and Use Cases. |
| `platforms/` | **Organisational** | Platform definitions, ownership, and grouping. |
| `capabilities/` | **Business** | Capability definitions and mapping. |
| `contexts/` | **Solution** | Bounded Context boundaries and model ownership. |
| `building-blocks/` | **Logical & Physical** | ABBs and SBBs. |
| `runtime/` | **Runtime** | Services and execution units. |
| `visual-design/` | **Visual** | Colour palette, typography, and diagram styling. |

## Key Standards

- **[Platform Standard](./platforms/platform-standard.md)**: The primary organisational and architectural unit.
- **[Traceability & Hierarchy Standard](./standard-traceability.md)**: The "Golden Thread" linking all layers.
- **[Visual Design Standard](./visual-design/visual-design-standard.md)**: The core UI/UX rules for diagrams and docs.

## Enforcement

Agents use the `triggers:` section in the YAML front matter of each standard to determine which rules to apply to a specific task.
