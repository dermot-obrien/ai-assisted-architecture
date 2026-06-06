---
id: CAP-040
kind: capability
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "CAP-040 Build & Test Automation"
sidebar_label: "CAP-040 Build & Test Automation"
sidebar_position: 40
---

# CAP-040 Build & Test Automation

| Property | Value | Notes |
|----------|-------|-------|
| **Capability ID** | `CAP-040` | Unique identifier. |
| **Capability Name** | Build & Test Automation | Human-readable name. |
| **Realizes Outcome**| [OC-013 Continuous Delivery Velocity](../../../strategy/outcomes/OC-013/) | Primary strategic goal. |
| **Level** | `L3` | Specific capability. |
| **Parent** | `CAP-039` | Continuous Delivery. |
| **Version** | `1.0.0` | Semantic versioning. |
| **Status** | `draft`| Current lifecycle status. |
| **Platform** | [PL-012 Continuous Delivery](../../platforms/PL-012/) | Parent platform. |

The organisation must automate compilation, linting, unit testing, integration testing, and security scanning for every code change.


## 1  Purpose

Manual build and test processes are slow, error-prone, and create bottlenecks in the delivery pipeline. Build & Test Automation ensures every code change is compiled, validated, and scanned automatically, providing rapid feedback to developers and preventing defects from progressing through the pipeline.


## 2  Capability Definition

### 2.1  Organisation

- **Delivery Platform Team.** Owns build infrastructure and test orchestration tooling.
- **Development Teams.** Define build configurations and test suites for their services.
- **Quality Engineering Team.** Establishes testing standards and code quality thresholds.

### 2.2  People

- **Platform Engineers.** Build and maintain build infrastructure, runners, and caching layers.
- **Developers.** Author build definitions and maintain test suites.
- **Quality Engineers.** Define quality gates and testing standards.

### 2.3  Processes

- **Build Pipeline Execution.** Trigger, execute, and report on build and test stages for every commit and pull request.
- **Quality Gate Enforcement.** Automated pass/fail decisions based on test coverage, code quality, and security scan results.
- **Build Cache Management.** Maintain and invalidate build caches to optimise pipeline execution time.
- **Flaky Test Management.** Detect, quarantine, and track flaky tests to maintain pipeline reliability.

### 2.4  Technology

- **Build Engine.** Compiles source code with parallelism, caching, and reproducible builds.
- **Test Orchestrator.** Executes unit, integration, and end-to-end test suites with parallel execution and result aggregation.
- **Code Quality Scanner.** Analyses code for style, complexity, duplication, and security vulnerabilities.
- **Pipeline Cache.** Distributed cache for build artifacts, dependencies, and intermediate outputs.


## 3  Maturity

### 3.1  Maturity Model

| Level | Name | Description |
|-------|------|-------------|
| **0** | None | Capability does not exist. |
| **1** | Initial | Ad-hoc, manual, inconsistent. |
| **2** | Developing | Some automation, documented processes, repeatable. |
| **3** | Defined | Standardised, consistent, proactive. |
| **4** | Managed | Quantitatively managed, SLAs tracked, measured. |
| **5** | Optimising | Continuous improvement, data-driven optimisation, innovation. |

### 3.2  Current Assessment

| Property | Value |
|----------|-------|
| **Current Maturity** | 1 |
| **Target Maturity** | 3 |
| **Assessment Date** | 2026-03-08 |
| **Assessor** | Architecture Team |

Teams have individual build pipelines with inconsistent test coverage and no standardised quality gates. Build times vary widely with no shared caching strategy.


## 4  ABB Realisation

### 4.1  Relationship Model

ABB mappings will be defined when the relevant ABB is created.

### 4.2  ABB Mapping

*(To be defined)*

### 4.3  Gaps

ABB mappings will be defined when the relevant ABB is created.


## 6  Revision History

| Version | Date | Change Type | Description |
|---------|------|-------------|-------------|
| 1.0 | 2026-03-08 | Initial Draft | CAP-040 Build & Test Automation capability created. |
