# AI-Assisted Architecture Standards

This directory contains the canonical standards for all architectural layers in the framework. All AI agents and architects MUST follow these standards when creating or modifying artifacts.

## Directory Structure

| Folder | Layer | Purpose |
| :--- | :--- | :--- |
| `strategy/` | **Strategy & Operational** | Outcomes and Use Cases. |
| `capabilities/` | **Business** | Capability definitions and mapping. |
| `contexts/` | **Organizational/Solution** | Bounded Context boundaries and ownership. |
| `building-blocks/` | **Logical & Physical** | ABBs and SBBs. |
| `runtime/` | **Runtime** | Services and execution units. |
| `visual-design/` | **Visual** | Color palette, typography, and diagram styling. |

## Key Standards

- **[Traceability & Hierarchy Standard](./standard-traceability.md)**: The "Golden Thread" linking all layers.
- **[Visual Design Standard](./visual-design/visual-design-standard.md)**: The core UI/UX rules for diagrams and docs.

## Enforcement

Agents use the `triggers:` section in the YAML front matter of each standard to determine which rules to apply to a specific task.
