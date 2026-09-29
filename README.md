# AI-Assisted Architecture

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Licence: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-blue.svg)](LICENSES/CC-BY-4.0.txt)
[![Licence: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-blue.svg)](LICENSES/Apache-2.0.txt)
[![REUSE 3.3](https://img.shields.io/badge/REUSE-3.3-lightgrey.svg)](https://reuse.software/spec-3.3/)

A reusable framework for creating TOGAF-aligned Capabilities, Architecture Building Blocks
(ABBs), and Solution Building Blocks (SBBs) with AI agent assistance. It ships nine
[Agent Skills](https://agentskills.io): eight write outcomes, platforms, capabilities, bounded
contexts, ABBs, SBBs, services and runtime agents to its standards, keeping the golden thread
of traceability intact, and the ninth, `aaa-rung`, is read-only and reports how far each
capability has been defined and what blocks the next step. It works with any agent that reads
Agent Skills.

## Install

You need git, Node.js 18 or later and Python 3.11 or later. draw.io desktop is optional, for
PNG export of diagrams.

The framework's installer runs on the engine in
[AI-Assisted Work](https://github.com/dermot-obrien/ai-assisted-work) (AAW), so install AAW
first. Every skill resolves its folders with the `model` skill from
[diagram-model](https://github.com/dermot-obrien/diagram-model), so install that beside them.
No package registry is needed.

```bash
git clone https://github.com/dermot-obrien/ai-assisted-work .ai-assisted-work
git clone https://github.com/dermot-obrien/ai-assisted-architecture .ai-assisted-architecture
git clone https://github.com/dermot-obrien/diagram-model .diagram-model
node .ai-assisted-work/bin/aaw.js install --yes --work-items-path work-items
node .ai-assisted-architecture/bin/aaa.js install --workspace .
cp -r .diagram-model/skills/model .agents/skills/model
```

In PowerShell the last line is `Copy-Item -Recurse .diagram-model/skills/model .agents/skills/model`.

The installer puts the skills in the workspace's `.agents/skills/`, and links
`.claude/skills/` at them when a `.claude` folder exists. Which agent reads which folder:

| Agent | Workspace level | User level |
|---|---|---|
| VS Code with GitHub Copilot | `.agents/skills/`, `.github/skills/`, `.claude/skills/` | `~/.copilot/skills/`, `~/.agents/skills/` |
| Cursor | `.agents/skills/`, `.cursor/skills/`, `.claude/skills/` | `~/.cursor/skills/`, `~/.agents/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Gemini CLI | `.agents/skills/` | `~/.agents/skills/` |

Folders change between agent versions, so check your agent's documentation if a skill does not
appear. To install without the installer, or for every workspace at user level, copy the
`skills/aaa-*` folders into one of those folders; [Installation](docs/installation.md) covers
that, the npm git dependency route, updating and removing.

## Quick start

After installing, seed a starter model, bind `aaa-rung` to it, and ask where each capability
stands:

```bash
node .ai-assisted-architecture/bin/aaa.js install --workspace . --seed
printf '[suite.aaa-rung]
capabilityDir = "../capabilities"
abbDir = "../building-blocks/architecture-building-blocks"
' > .agents/skill-bindings.toml
python .agents/skills/aaa-rung/bin/rung.py
```

```powershell
node .ai-assisted-architecture/bin/aaa.js install --workspace . --seed
'[suite.aaa-rung]', 'capabilityDir = "../capabilities"', 'abbDir = "../building-blocks/architecture-building-blocks"' | Set-Content -Encoding ascii .agents/skill-bindings.toml
python .agents/skills/aaa-rung/bin/rung.py
```

You should see a table of seven capabilities, each with its rung and the artefact blocking the
next one. Then bind the other skills and type `/aaa-create-abb` (or any `/aaa-*` skill) in your
agent. The [quick start](docs/quick-start.md) does all of this from an empty folder, in
PowerShell and bash, in about ten minutes.

## Skills

| Skill | Does |
|---|---|
| [`aaa-create-strategy`](docs/skills/aaa-create-strategy.md) | Business outcomes with their measures, and the use cases that support them |
| [`aaa-create-platform`](docs/skills/aaa-create-platform.md) | Business platforms with an executive owner |
| [`aaa-create-capability`](docs/skills/aaa-create-capability.md) | Capabilities, added to the capability model |
| [`aaa-create-context`](docs/skills/aaa-create-context.md) | Bounded contexts and their ubiquitous language |
| [`aaa-create-abb`](docs/skills/aaa-create-abb.md) | Architecture Building Blocks with their diagrams |
| [`aaa-create-sbb`](docs/skills/aaa-create-sbb.md) | Solution Building Blocks, simple or composite, mapped to products |
| [`aaa-create-service`](docs/skills/aaa-create-service.md) | Runtime services that implement an SBB |
| [`aaa-create-runtime-agent`](docs/skills/aaa-create-runtime-agent.md) | Autonomous runtime agents with guardrails, capability scope and provenance |
| [`aaa-rung`](docs/skills/aaa-rung.md) | Read-only. Each capability's rung on the definition ladder, per flow, and what blocks the next |

Every skill follows the [Agent Skills specification](https://agentskills.io/specification). CI
validates them on every pull request with the specification's reference validator,
`skills-ref`, and with `scripts/validate-skills.mjs`, which also checks that relative links
resolve and warns when a `SKILL.md` body passes the specification's 500-line or 5,000-token
guidance.

The `pattern` skill, which authors an architecture pattern as one Markdown document that is
also the model and the deck, began here and now lives in
[architecture-pattern](https://github.com/dermot-obrien/architecture-pattern). `aaa-rung` still
reads a pattern's front matter.

## Documentation

| Page | Read it for |
|---|---|
| [Quick start](docs/quick-start.md) | A first real result in about ten minutes |
| [Installation](docs/installation.md) | Every install route, for every agent, and updating and removing |
| [Concepts](docs/concepts.md) | Skills, bindings, standards, the golden thread and the definition ladder, in the order you need them |
| [Skills](docs/skills/README.md) | One page per skill: what it asks, writes and needs |
| [Configuration](docs/configuration.md) | Every binding key, config key and front matter field the tools read, with precedence |
| [Commands](docs/commands.md) | Every script, option and exit code |
| [Troubleshooting](docs/troubleshooting.md) | The messages the tools print, and what to do |
| [Examples](docs/examples.md) | The worked examples in this repository |
| [Ontology](docs/ontology.md) | The optional modernisation ontology and its scripts |
| [Architectural Framework](docs/architectural-framework.md) | The reasoning behind the hierarchy, with sources |
| [install/README.md](install/README.md) | What the installer places, and the instruction files you merge by hand |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributing, and the checks to run before a pull request |
| [CHANGELOG.md](CHANGELOG.md) | What changed, release by release |

## Repository structure

```
skills/          The nine Agent Skills: SKILL.md, inputs.toml, references/, bin/
standards/       The standards the skills follow, with worked examples, the schemas and the ontology
foundation/      A generic starter model, seeded into a workspace with --seed
install/         Instruction-file snippets to merge once, and the config template
ontology/        The architecture ontology module (bundle.json names it)
bin/ src/        The aaa installer launcher and the foundation seeder
scripts/         Validators, ontology tools and maintainer scripts
docs/            This documentation
bundle.json      Each skill's version, purl and post-install check
```

## Licence

This framework is permissively licensed to encourage the widest possible adoption: private,
public, academic, and commercial. Attribution is the primary expectation.

- Documentation, standards, agent specifications, foundation seeds, diagrams
  ([`CC BY 4.0`](LICENSES/CC-BY-4.0.txt)): use, share, modify, and redistribute, including
  commercially, with attribution.
- Executable code (`scripts/`, `bin/`, `src/`) ([`Apache-2.0`](LICENSES/Apache-2.0.txt)):
  same permissions, with an explicit patent grant.

Per-file licensing is declared via SPDX identifiers and the [`REUSE.toml`](REUSE.toml)
manifest, following the [REUSE Specification 3.3](https://reuse.software/spec-3.3/). See
[`LICENSE`](LICENSE) for the full overview.

### Trademark

"AI-Assisted Architecture" and any associated logos are trademarks of Dermot O'Brien. The
licences above grant rights to the content and code only; they do not grant rights to use
these marks. Nominative use ("based on AI-Assisted Architecture") is welcome; please use a
different name for forks or derivative offerings.

## Attribution

Created by Dermot O'Brien ([@dermot-obrien](https://github.com/dermot-obrien)).

If you use, fork, or build on this framework, please credit the original project and link to
this repository. Both CC BY 4.0 and Apache-2.0 require attribution; keep the copyright notices
and indicate any changes you have made.
