# Quick start

From an empty folder to a derived capability rung in about ten minutes. You will install the
framework into a scratch workspace, bind the skills to folders, seed a starter capability
model, and have `aaa-rung` tell you how far each capability has been defined and what blocks
the next step. Then you hand the workspace to your agent.

Every command below has been run as written on Windows, in PowerShell 5.1 and in Git Bash.
Where the two shells differ, both forms are given. On macOS and Linux use the bash form, and
type `python3` where it says `python`.

## 0. Check the prerequisites

You need git, Node.js 18 or later and Python 3.11 or later. draw.io desktop is only needed
later, when a skill exports diagrams to PNG.

```bash
git --version
node --version
python --version
```

You should see three version numbers, with Node at `v18` or above and Python at `3.11` or
above. If `python` is not found on Windows, try `py -3 --version` and use `py -3` wherever
this guide says `python`.

## 1. Make a scratch workspace

A workspace is any folder your agent opens. A git repository is detected as the workspace
root, so initialise one.

```powershell
mkdir aaa-quickstart
cd aaa-quickstart
git init
```

```bash
mkdir aaa-quickstart && cd aaa-quickstart
git init
```

If you use Claude Code, also create its folder now, so the installer links the skills into
it (`mkdir .claude`). Other agents need nothing extra.

## 2. Get the frameworks

AI-Assisted Architecture (AAA) installs through the engine in AI-Assisted Work (AAW), and its
skills resolve their folder bindings with the `model` skill from diagram-model. Clone all three
into the workspace. The commands are the same in both shells.

```bash
git clone https://github.com/dermot-obrien/ai-assisted-work .ai-assisted-work
git clone https://github.com/dermot-obrien/ai-assisted-architecture .ai-assisted-architecture
git clone https://github.com/dermot-obrien/diagram-model .diagram-model
```

## 3. Install AAW, then AAA

AAA declares AAW as a dependency, so AAW goes in first. `--yes` answers the setup questions
with defaults, and `--work-items-path` keeps AAW's work items inside this workspace rather
than under your home folder.

```bash
node .ai-assisted-work/bin/aaw.js install --yes --work-items-path work-items
node .ai-assisted-architecture/bin/aaa.js install --workspace . --seed
```

The second command should end like this:

```text
▸ Installing AI-Assisted Architecture (aaa@0.3.0)
  ▸ skills: installed 9 → .agents\skills/
      aaa-create-abb, aaa-create-capability, aaa-create-context, aaa-create-platform, aaa-create-runtime-agent, aaa-create-sbb, aaa-create-service, aaa-create-strategy, aaa-rung
  ▸ seeded .aaa-config.yaml
  ▸ seeding content via node src/seed-foundation.mjs
  ...
  seed complete — capabilities: 7, ABBs: 3, SBBs: 0

Done. aaa@0.3.0 — 9 skill(s).
```

You now have the nine AAA skills in `.agents/skills/`, a `.aaa-config.yaml`, and a starter
capability model: `capabilities/` with seven capabilities and `building-blocks/` with three
ABBs, copied from the framework's `core` foundation profile.

## 4. Install the model skill

Copy the `model` skill in beside the others.

```powershell
Copy-Item -Recurse .diagram-model/skills/model .agents/skills/model
```

```bash
cp -r .diagram-model/skills/model .agents/skills/model
```

If you created `.claude` in step 1, copy the folder into `.claude/skills/model` as well. The
installer links its own skills there, but `model` comes from another repository.

## 5. Bind the skills to folders

No skill has a default location for what it writes. You say where each kind of artefact
lives in `.agents/skill-bindings.toml`, and paths resolve against that file's folder. This
layout matches what the seed created, plus folders for the kinds the seed does not include.

```powershell
mkdir strategy/outcomes, strategy/use-cases, platforms, contexts, runtime/services, decisions, considerations, patterns
@'
[suite.aaa-create-strategy]
outcomeDir = "../strategy/outcomes"
useCaseDir = "../strategy/use-cases"

[suite.aaa-create-platform]
platformDir = "../platforms"
outcomeDir  = "../strategy/outcomes"

[suite.aaa-create-capability]
capabilityDir = "../capabilities"
platformDir   = "../platforms"

[suite.aaa-create-context]
contextDir    = "../contexts"
platformDir   = "../platforms"
capabilityDir = "../capabilities"

[suite.aaa-create-abb]
abbDir        = "../building-blocks/architecture-building-blocks"
contextDir    = "../contexts"
capabilityDir = "../capabilities"

[suite.aaa-create-sbb]
sbbDir = "../building-blocks/solution-building-blocks"
abbDir = "../building-blocks/architecture-building-blocks"

[suite.aaa-create-service]
serviceDir = "../runtime/services"
contextDir = "../contexts"
sbbDir     = "../building-blocks/solution-building-blocks"

[suite.aaa-rung]
capabilityDir    = "../capabilities"
abbDir           = "../building-blocks/architecture-building-blocks"
sbbDir           = "../building-blocks/solution-building-blocks"
decisionDir      = "../decisions"
considerationDir = "../considerations"
patternDir       = "../patterns"
'@ | Set-Content -Encoding ascii .agents/skill-bindings.toml
```

```bash
mkdir -p strategy/outcomes strategy/use-cases platforms contexts runtime/services decisions considerations patterns
cat > .agents/skill-bindings.toml <<'EOF'
[suite.aaa-create-strategy]
outcomeDir = "../strategy/outcomes"
useCaseDir = "../strategy/use-cases"

[suite.aaa-create-platform]
platformDir = "../platforms"
outcomeDir  = "../strategy/outcomes"

[suite.aaa-create-capability]
capabilityDir = "../capabilities"
platformDir   = "../platforms"

[suite.aaa-create-context]
contextDir    = "../contexts"
platformDir   = "../platforms"
capabilityDir = "../capabilities"

[suite.aaa-create-abb]
abbDir        = "../building-blocks/architecture-building-blocks"
contextDir    = "../contexts"
capabilityDir = "../capabilities"

[suite.aaa-create-sbb]
sbbDir = "../building-blocks/solution-building-blocks"
abbDir = "../building-blocks/architecture-building-blocks"

[suite.aaa-create-service]
serviceDir = "../runtime/services"
contextDir = "../contexts"
sbbDir     = "../building-blocks/solution-building-blocks"

[suite.aaa-rung]
capabilityDir    = "../capabilities"
abbDir           = "../building-blocks/architecture-building-blocks"
sbbDir           = "../building-blocks/solution-building-blocks"
decisionDir      = "../decisions"
considerationDir = "../considerations"
patternDir       = "../patterns"
EOF
```

In PowerShell 5.1, write these files with `-Encoding ascii` as shown. The default UTF-8
encoding there adds a byte order mark, and the TOML reader rejects a bindings file that starts
with one.

Then point `.aaa-config.yaml` at the ontology schema that ships with the framework. The
template names a path your workspace does not have yet.

```powershell
(Get-Content .aaa-config.yaml) -replace 'governance/metamodel/ontology-schema.json', '.ai-assisted-architecture/standards/ontology/ontology-schema.json' | Set-Content -Encoding ascii .aaa-config.yaml
```

```bash
sed -i.bak 's#governance/metamodel/ontology-schema.json#.ai-assisted-architecture/standards/ontology/ontology-schema.json#' .aaa-config.yaml && rm .aaa-config.yaml.bak
```

## 6. Check the installation

Every skill ships a post-install check. Run them all the way an installer does:

```bash
node .ai-assisted-architecture/scripts/validate-bundle.mjs --run-checks . .ai-assisted-architecture
```

You should see nine `ok` lines and no warnings. If PyYAML is not installed you also see
`warning: PyYAML is not installed`, which is harmless: `aaa-rung` has its own front matter
parser.

```text
  ok   aaa-create-abb: node bin/check.mjs exited 0
        aaa-create-abb: ok
  ...
  ok   aaa-rung: python bin/check.py exited 0
        aaa-rung: ok
```

Ask the resolver what one skill will use. This is the first thing every `aaa-create-*` skill
runs in your agent:

```bash
python .agents/skills/model/bin/model.py doctor --skill aaa-create-abb
```

It prints the binding file and the resolved `abbDir`, `capabilityDir` and `contextDir`, and
ends with `result       : ok`.

## 7. Derive the rungs of the starter model

```bash
python .agents/skills/aaa-rung/bin/rung.py
```

```text
Capability  Flow  Rung             Recorded  Blocking the next rung
----------  ----  ---------------  --------  ----------------------
CAP-001     -     R0 Unrecognised            CAP-001 names no demand: add required_by_outcomes, or record demand_assumption
CAP-002     -     R0 Unrecognised            CAP-002 names no demand: add required_by_outcomes, or record demand_assumption
CAP-003     -     R0 Unrecognised            CAP-003 names no demand: add required_by_outcomes, or record demand_assumption
CAP-004     -     R1 Named                   ABB-001 does not declare requires (an empty list is enough) (+3 more)
CAP-005     -     R1 Named                   ABB-001 does not declare requires (an empty list is enough) (+3 more)
CAP-006     -     R1 Named                   ABB-002 does not declare requires (an empty list is enough) (+3 more)
CAP-007     -     R1 Named                   ABB-003 does not declare requires (an empty list is enough) (+3 more)
```

That is your first real result. Each row is a capability, the rung it has earned from the
documents that exist, and the specific thing stopping it from moving up. The seed is
deliberately incomplete, so there is work to do. [Concepts](concepts.md#the-definition-ladder)
explains the rungs.

## 8. Add a capability of your own

Here is a tiny capability document. It claims its one flow is already at R2. It carries only
the fields the ladder reads; a document written by `/aaa-create-capability` carries the full
set the capability standard requires.

```powershell
mkdir capabilities/CAP-100
@'
---
id: CAP-100
kind: capability
title: Order Notifications
level: L1
status: draft
description: Tell each customer when their order ships and when it arrives.
demand_assumption: Customer service asked for fewer where-is-my-order calls.
flows:
  - id: shipping
    name: Shipping update
    rung: R2
---

# Order Notifications
'@ | Set-Content -Encoding ascii capabilities/CAP-100/index.md
```

```bash
mkdir -p capabilities/CAP-100
cat > capabilities/CAP-100/index.md <<'EOF'
---
id: CAP-100
kind: capability
title: Order Notifications
level: L1
status: draft
description: Tell each customer when their order ships and when it arrives.
demand_assumption: Customer service asked for fewer where-is-my-order calls.
flows:
  - id: shipping
    name: Shipping update
    rung: R2
---

# Order Notifications
EOF
```

Derive it, with every blocker, then check the claim. The first command prints:

```bash
python .agents/skills/aaa-rung/bin/rung.py CAP-100 -v
python .agents/skills/aaa-rung/bin/rung.py CAP-100 --check
```

```text
Capability  Flow         Rung      Recorded    Blocking the next rung
----------  -----------  --------  ----------  ----------------------
CAP-100     (all flows)  R1 Named              CAP-100 names no ABB in realised_by_abbs
                                               no consideration affects CAP-100 or its ABBs, and it does not declare open_questions: none
            shipping     R1 Named  R2 claimed  CAP-100 names no ABB in realised_by_abbs
                                               no consideration affects CAP-100 or its ABBs, and it does not declare open_questions: none
```

The capability is R1 Named: it has a level, a purpose and a demand. The recorded R2 is marked
`claimed` because the evidence does not back it, and `--check` exits with code 1, which is
how a CI job would catch it.

## 9. Earn R2

R2 needs a named building block that declares what it requires, and either a consideration
or an explicit statement that there are no open questions. Add a minimal ABB and link it.

```powershell
mkdir building-blocks/architecture-building-blocks/ABB-100
@'
---
id: ABB-100
kind: abb
title: Notification Dispatcher
status: draft
requires: []
---

# Notification Dispatcher
'@ | Set-Content -Encoding ascii building-blocks/architecture-building-blocks/ABB-100/index.md
(Get-Content capabilities/CAP-100/index.md) -replace '^(demand_assumption:.*)$', "`$1`nrealised_by_abbs: [ABB-100]`nopen_questions: none" | Set-Content -Encoding ascii capabilities/CAP-100/index.md
```

```bash
mkdir -p building-blocks/architecture-building-blocks/ABB-100
cat > building-blocks/architecture-building-blocks/ABB-100/index.md <<'EOF'
---
id: ABB-100
kind: abb
title: Notification Dispatcher
status: draft
requires: []
---

# Notification Dispatcher
EOF
sed -i.bak 's/^demand_assumption:.*/&\nrealised_by_abbs: [ABB-100]\nopen_questions: none/' capabilities/CAP-100/index.md && rm capabilities/CAP-100/index.md.bak
```

```bash
python .agents/skills/aaa-rung/bin/rung.py CAP-100 --check
```

```text
Capability  Flow         Rung        Recorded  Blocking the next rung
----------  -----------  ----------  --------  ----------------------
CAP-100     (all flows)  R2 Bounded            no pattern realises CAP-100 for flow shipping: add realises: [CAP-100] to a logical pattern
            shipping     R2 Bounded  R2        no pattern realises CAP-100 for flow shipping: add realises: [CAP-100] to a logical pattern
```

The recorded rung is now backed by evidence, `--check` exits 0, and the blocker names the next
artefact to write.

## 10. Hand it to your agent

Open the workspace in your agent (VS Code with GitHub Copilot, Cursor, Claude Code, Codex,
Gemini CLI or any other Agent Skills host) and type `/` to see the skills. Then try:

```text
/aaa-create-abb Create an ABB for the Notification Dispatcher's delivery channel router,
under capability CAP-100.
```

The skill runs the `doctor` you ran in step 6, finds that no bounded context exists yet,
proposes one rather than inventing it, and asks before creating anything. Once you agree it
writes `building-blocks/architecture-building-blocks/ABB-NNN/index.md` and its diagrams,
following the standards it loads from `.ai-assisted-architecture/standards/`. Run
`rung.py` again afterwards to see what changed.

## Where next

- [Concepts](concepts.md): the golden thread, bindings and the definition ladder.
- [Skills](skills/README.md): what each skill asks, writes and needs.
- [Configuration](configuration.md): every binding and config key.
- [Troubleshooting](troubleshooting.md): the messages you may meet, and what to do.

To throw the scratch workspace away, delete the `aaa-quickstart` folder. Nothing was written
outside it.
