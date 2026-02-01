# GitHub Copilot Instructions

## AI Assisted Work

---

### Work Management Agents

#### `/aiaw-start-work` - Initialize New Work Items

**Full instructions:** Read `.ai-assisted-work/agents/work-management/start-work.md`

**Required reading:**
- `.ai-assisted-work/agents/work-management/AGENTS.md` - Agent rules and concurrency model
- `.ai-assisted-work/agents/work-management/README.md` - Core concepts

**Purpose:** Create a new work item with scope, plan, and progress tracking.

---

#### `/aiaw-progress-work` - Continue Work on Items

**Full instructions:** Read `.ai-assisted-work/agents/work-management/progress-work.md`

**Required reading:**
- `.ai-assisted-work/agents/work-management/AGENTS.md` - Agent rules and concurrency model
- `.ai-assisted-work/agents/work-management/README.md` - Core concepts

**Purpose:** Execute tasks and update progress on an existing work item.

---

#### `/aiaw-pivot-work` - Rescope and Replan

**Full instructions:** Read `.ai-assisted-work/agents/work-management/pivot-work.md`

**Required reading:**
- `.ai-assisted-work/agents/work-management/AGENTS.md` - Agent rules and concurrency model
- `.ai-assisted-work/agents/work-management/README.md` - Core concepts

**Purpose:** Revise the scope and plan when requirements change or the current approach isn't working.

---

#### `/aiaw-work-status` - Report Work Item Status

**Full instructions:** Read `.ai-assisted-work/agents/work-management/work-status.md`

**Required reading:**
- `.ai-assisted-work/agents/work-management/README.md` - Core concepts

**Purpose:** Generate a status report for work items.

---

### Image Management Agents

#### `/aiaw-replace-ascii-diagrams` - Convert ASCII to Images

**Full instructions:** Read `.ai-assisted-work/agents/image-management/replace-ascii-diagrams.md`

**Required reading:**
- `.ai-assisted-work/agents/image-management/AGENTS.md` - Agent rules for image conversion
- `.ai-assisted-work/agents/image-management/README.md` - Overview

**Purpose:** Scan documents for ASCII diagrams and replace them with Draw.io diagrams and PNG images.

---

### Path Adjustment

The paths above assume you deployed AI-Assisted Work to `.ai-assisted-work/`.

**If you used a different folder name**, update all paths accordingly:

| Your Deployment | Replace `.ai-assisted-work/` with |
|-----------------|-----------------------------------|
| `.ai-work/` | `.ai-work/` |
| `vendor/ai-assisted-work/` | `vendor/ai-assisted-work/` |
| (Root level) | `agents/` (no prefix) |

---

### Design Principles

- **Thin wrappers:** The `copilot-instructions.md` for AI Assisted Work should be minimal - all logic lives in agent instruction files
- **Single source of truth:** Agent files in `.ai-assisted-work/agents/` contain the full behavior
- **Cross-platform:** Same agents work with Cursor, Claude Code, GitHub Copilot
- **Easy updates:** Update agent behavior by updating the `.ai-assisted-work/` folder