# AI-Assisted Architecture

[![Version](https://img.shields.io/badge/version-0.4.0-blue.svg)](CHANGELOG.md)
[![Licence: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-blue.svg)](LICENSES/CC-BY-4.0.txt)
[![Licence: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-blue.svg)](LICENSES/Apache-2.0.txt)
[![REUSE 3.3](https://img.shields.io/badge/REUSE-3.3-lightgrey.svg)](https://reuse.software/spec-3.3/)

A reusable framework for creating TOGAF-aligned Capabilities, Architecture Building Blocks (ABBs), and Solution Building Blocks (SBBs) with AI agent assistance. It ships as a bundle of nine standalone [Agent Skills](https://agentskills.io): eight write outcomes, platforms, capabilities, bounded contexts, ABBs, SBBs, services and runtime agents to its standards, keeping the golden thread of traceability intact, and the ninth, `aaa-rung`, is read-only and reports how far each capability has been defined and what blocks the next step. It works with any agent that reads Agent Skills.

## Install

You need git, Node.js 18 or later and Python 3.11 or later. draw.io desktop is optional, for PNG export of diagrams. No package registry is needed.

Each skill is complete on its own: it carries the standards it reads, the `.aaa-config.yaml` template and its own binding resolver, so you can install all nine or only the ones you use, and no other skill is needed. Install them with `bin/skills.mjs`, the standalone skills installer in [AI-Assisted Work](https://github.com/dermot-obrien/ai-assisted-work) (AAW), from the workspace root:

```bash
git clone https://github.com/dermot-obrien/ai-assisted-work ../ai-assisted-work
git clone https://github.com/dermot-obrien/ai-assisted-architecture ../ai-assisted-architecture
node ../ai-assisted-work/bin/skills.mjs install --bundle ../ai-assisted-architecture
```

Name skills after the command to install only those. For a team workspace, commit an `.agents/skills.json` that declares the bundle and let the installer fetch it and lock the commit:

```json
{ "sources": [ { "bundle": "https://github.com/dermot-obrien/ai-assisted-architecture.git", "ref": "main" } ] }
```

```bash
node scripts/skills.mjs sync --copy            # writes .agents/skills.lock.json; commit it
node scripts/skills.mjs sync --locked --copy   # after a clone: exactly the locked commits
```

Here `scripts/skills.mjs` is a copy of AAW's `bin/skills.mjs` kept in the workspace. The installer puts the skills in the workspace's `.agents/skills/`, and links `.claude/skills/` at them when a `.claude` folder exists (`--copy` copies instead). Which agent reads which folder:

| Agent | Workspace level | User level |
|---|---|---|
| VS Code with GitHub Copilot | `.agents/skills/`, `.github/skills/`, `.claude/skills/` | `~/.copilot/skills/`, `~/.agents/skills/` |
| Cursor | `.agents/skills/`, `.cursor/skills/`, `.claude/skills/` | `~/.cursor/skills/`, `~/.agents/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Gemini CLI | `.agents/skills/` | `~/.agents/skills/` |

Folders change between agent versions, so check your agent's documentation if a skill does not appear. To install without the installer, or for every workspace at user level, copy the `skills/aaa-*` folders into one of those folders; [Installation](docs/installation.md) covers that, updating and removing.

Version 0.3.0 and earlier installed through AAW's framework engine with `aaa install`. That installer and its npm commands were removed in 0.4.0; pin the `v0.3.0` tag if you still need them.

## Quick start

After installing, seed a starter model from the clone, bind `aaa-rung` to it, and ask where each capability stands:

```bash
node ../ai-assisted-architecture/scripts/seed-foundation.mjs --workspace .
printf '[suite.aaa-rung]\ncapabilityDir = "../capabilities"\nabbDir = "../building-blocks/architecture-building-blocks"\n' > .agents/skill-bindings.toml
python .agents/skills/aaa-rung/bin/rung.py
```

```powershell
node ../ai-assisted-architecture/scripts/seed-foundation.mjs --workspace .
'[suite.aaa-rung]', 'capabilityDir = "../capabilities"', 'abbDir = "../building-blocks/architecture-building-blocks"' | Set-Content -Encoding ascii .agents/skill-bindings.toml
python .agents/skills/aaa-rung/bin/rung.py
```

You should see a table of seven capabilities, each with its rung and the artefact blocking the next one. Then bind the other skills and type `/aaa-create-abb` (or any `/aaa-*` skill) in your agent. The [quick start](docs/quick-start.md) does all of this from an empty folder, in PowerShell and bash, in about ten minutes.

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
| [The continuum](docs/continuum.md) | The definitions the bundle is built on, from the enterprise landscape to a deployable unit, each anchored in current practice, with the relationships in one picture |
| [Architectural Framework](docs/architectural-framework.md) | The reasoning behind the hierarchy, with sources |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributing, and the checks to run before a pull request |
| [CHANGELOG.md](CHANGELOG.md) | What changed, release by release |

## Repository structure

```
skills/          The nine Agent Skills: SKILL.md, inputs.toml, references/ (with their copy of the standards), bin/
standards/       The standards the skills follow, with worked examples, the schemas, the ontology and the config template
foundation/      A generic starter model, optional, seeded into a workspace by scripts/seed-foundation.mjs
ontology/        The architecture ontology module (bundle.json names it)
scripts/         The foundation seeder, validators, ontology tools and maintainer scripts
docs/            This documentation
bundle.json      Each skill's version, purl and post-install check
skill-standards.json   Which standards each skill carries a copy of
```

## Licence

This framework is permissively licensed to encourage the widest possible adoption: private,
public, academic, and commercial. Attribution is the primary expectation.

- Documentation, standards, agent specifications, foundation seeds, diagrams
  ([`CC BY 4.0`](LICENSES/CC-BY-4.0.txt)): use, share, modify, and redistribute, including
  commercially, with attribution.
- Executable code (`scripts/`) ([`Apache-2.0`](LICENSES/Apache-2.0.txt)):
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
