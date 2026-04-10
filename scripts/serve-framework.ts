#!/usr/bin/env bun
/**
 * serve-framework.ts — DAG visualizer for the AI-Assisted Architecture framework.
 *
 * Walks markdown artefacts (Outcomes, Platforms, Bounded Contexts, Capabilities,
 * ABBs, SBBs), extracts relationships from Document Control tables and markdown
 * sections, builds a JSON graph, and serves it alongside a React Flow + ELK.js
 * single-page UI.
 *
 * Usage:
 *   bun scripts/serve-framework.ts [--port 3141] [--workspace /path/to/workspace]
 *
 * When --workspace is omitted the tool scans foundation/ in the current repo.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { port: number; workspace: string | null; repoRoot: string } {
  const args = Bun.argv.slice(2);
  let port = 3141;
  let workspace: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--port" && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--workspace" && args[i + 1]) {
      workspace = resolve(args[i + 1]);
      i++;
    }
  }

  // Repo root is the parent of the scripts/ directory
  const scriptDir = dirname(new URL(import.meta.url).pathname);
  const repoRoot = resolve(scriptDir, "..");

  return { port, workspace, repoRoot };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NodeType = "outcome" | "platform" | "context" | "capability" | "abb" | "sbb";

interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  status: string;
  origin: "framework" | "workspace";  // NPC-prefixed = workspace
  level?: string;        // L1, L2, L3 for capabilities
  category?: string;     // for ABBs/SBBs
  shortName?: string;    // diagram abbreviation
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
  relationship?: string; // primary, supporting, cross-cutting
}

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta: {
    scannedAt: string;
    source: string;
    nodeCount: number;
    edgeCount: number;
  };
}

// ---------------------------------------------------------------------------
// Markdown parsing helpers
// ---------------------------------------------------------------------------

/** Determine if an artefact ID is workspace-specific (NPC prefix) or framework */
function getOrigin(id: string): "framework" | "workspace" {
  return /-NPC-/.test(id) ? "workspace" : "framework";
}

/** Extract YAML frontmatter title */
function extractFrontmatterTitle(content: string): string | null {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return titleMatch ? titleMatch[1] : null;
}

/** Extract the first H1 heading */
function extractH1(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/** Extract a property value from a markdown table row like | **Key** | Value | */
function extractTableProperty(content: string, key: string): string | null {
  // Build a regex that matches the property key (bold or plain) in a table row.
  // Handles both | **Key** | value | and | **Key** | value | notes |
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `\\|\\s*\\*{0,2}${escaped}\\*{0,2}\\s*\\|\\s*(.+?)\\s*\\|`,
    "im"
  );
  const match = content.match(regex);
  if (!match) return null;
  return match[1].trim();
}

/** Extract an artefact ID from text like `PL-001` or [PL-001 ...](url) */
function extractId(text: string): string | null {
  const match = text.match(/\b(OC|PL|BC|CAP|AB|SB|SBB)-(?:[A-Z]+-)?(\d{3})\b/);
  return match ? match[0] : null;
}

/** Extract all artefact IDs from a block of text */
function extractAllIds(text: string): string[] {
  const matches = text.matchAll(/\b(OC|PL|BC|CAP|AB|SB)-(?:[A-Z]+-)*\d{3}\b/g);
  return [...new Set([...matches].map((m) => m[0]))];
}

/** Extract markdown link references like [AB-004 Name](../path/) and return IDs */
function extractLinkedIds(text: string): string[] {
  const matches = text.matchAll(
    /\[([^\]]*?(?:OC|PL|BC|CAP|AB|SB)-(?:[A-Z]+-)*\d{3}[^\]]*?)\]\([^)]+\)/g
  );
  const ids: string[] = [];
  for (const m of matches) {
    const id = extractId(m[1]);
    if (id) ids.push(id);
  }
  return [...new Set(ids)];
}

/** Extract a named section's content (from heading to next same-or-higher-level heading or EOF) */
function extractSection(content: string, sectionPattern: string): string | null {
  const escaped = sectionPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Find the heading line containing the pattern (any heading level)
  const headingRegex = new RegExp(
    `^#{2,4}\\s+[\\d.]*\\s*${escaped}[^\\n]*`,
    "m"
  );
  const headingMatch = headingRegex.exec(content);
  if (!headingMatch) return null;

  // Determine heading level to find end boundary
  const headingLevel = (headingMatch[0].match(/^#+/) || ["##"])[0].length;
  const startIdx = headingMatch.index + headingMatch[0].length;
  const rest = content.slice(startIdx);

  // Find next heading of same or higher level (fewer or equal #)
  const endPattern = new RegExp(`^#{2,${headingLevel}}\\s`, "m");
  const endMatch = endPattern.exec(rest);
  const sectionText = endMatch ? rest.slice(0, endMatch.index) : rest;
  return sectionText.trim() || null;
}

// ---------------------------------------------------------------------------
// Artefact scanners
// ---------------------------------------------------------------------------

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function scanDirectory(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && /^(OC|PL|BC|CAP|AB|SB)-/.test(e.name))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

async function readArtefact(dir: string, id: string): Promise<string | null> {
  const indexPath = join(dir, id, "index.md");
  if (!(await fileExists(indexPath))) return null;
  return readFile(indexPath, "utf-8");
}

// ---------------------------------------------------------------------------
// Parse each artefact type
// ---------------------------------------------------------------------------

function parseOutcome(id: string, content: string): { node: GraphNode; edges: GraphEdge[] } {
  const name =
    extractTableProperty(content, "Name") ||
    extractFrontmatterTitle(content)?.replace(/^OC-\d+\s+/, "") ||
    extractH1(content)?.replace(/^OC-\d+\s+/, "") ||
    id;
  const status = extractTableProperty(content, "Status")?.replace(/`/g, "").toLowerCase().trim() || "unknown";

  const node: GraphNode = { id, name, type: "outcome", status, origin: getOrigin(id) };
  const edges: GraphEdge[] = [];

  // Outcomes trace to capabilities via Traceability section
  const traceSection = extractSection(content, "Traceability");
  if (traceSection) {
    const capIds = extractLinkedIds(traceSection);
    for (const capId of capIds) {
      edges.push({ source: id, target: capId, label: "traces to" });
    }
  }

  return { node, edges };
}

function parsePlatform(id: string, content: string): { node: GraphNode; edges: GraphEdge[] } {
  const name =
    extractTableProperty(content, "Name") ||
    extractFrontmatterTitle(content)?.replace(/^PL-\S+\s+/, "") ||
    extractH1(content)?.replace(/^PL-\S+\s+/, "") ||
    id;
  const status = extractTableProperty(content, "Status")?.replace(/`/g, "").toLowerCase().trim() || "unknown";

  const node: GraphNode = { id, name, type: "platform", status, origin: getOrigin(id) };
  const edges: GraphEdge[] = [];

  // Platform -> Outcomes (Strategic Outcomes section)
  const outcomeSection = extractSection(content, "Strategic Outcomes");
  if (outcomeSection) {
    const ocIds = extractLinkedIds(outcomeSection);
    for (const ocId of ocIds) {
      edges.push({ source: ocId, target: id, label: "drives" });
    }
  }

  // Platform -> Capabilities
  const capSection = extractSection(content, "Capabilities");
  if (capSection) {
    const capIds = extractLinkedIds(capSection);
    for (const capId of capIds) {
      edges.push({ source: id, target: capId, label: "provides" });
    }
  }

  // Platform -> Bounded Contexts
  const bcSection = extractSection(content, "Bounded Contexts");
  if (bcSection) {
    const bcIds = extractLinkedIds(bcSection);
    for (const bcId of bcIds) {
      edges.push({ source: id, target: bcId, label: "contains" });
    }
  }

  return { node, edges };
}

function parseContext(id: string, content: string): { node: GraphNode; edges: GraphEdge[] } {
  const name =
    extractTableProperty(content, "Context Name") ||
    extractFrontmatterTitle(content)?.replace(/^BC-\S+\s+/, "") ||
    extractH1(content)?.replace(/^BC-\S+\s+/, "") ||
    id;
  const status = "draft"; // BCs don't always have explicit status

  const node: GraphNode = { id, name, type: "context", status, origin: getOrigin(id) };
  const edges: GraphEdge[] = [];

  // BC -> Platform (via Platform property in table)
  const platformVal = extractTableProperty(content, "Platform");
  if (platformVal) {
    const plId = extractId(platformVal);
    if (plId) {
      // Edge from platform to context (already created by platform scanner),
      // but add reverse for robustness
      edges.push({ source: plId, target: id, label: "contains" });
    }
  }

  // BC -> ABBs (Contained ABBs section)
  const abbSection = extractSection(content, "Contained ABBs");
  if (abbSection) {
    const abbIds = extractLinkedIds(abbSection);
    for (const abbId of abbIds) {
      edges.push({ source: id, target: abbId, label: "contains" });
    }
  }

  // BC -> Capabilities (Realised Capabilities section)
  const capSection = extractSection(content, "Realised Capabilities");
  if (capSection) {
    const capIds = extractLinkedIds(capSection);
    for (const capId of capIds) {
      edges.push({ source: capId, target: id, label: "realised in" });
    }
  }

  return { node, edges };
}

function parseCapability(id: string, content: string): { node: GraphNode; edges: GraphEdge[] } {
  const name =
    extractTableProperty(content, "Capability Name") ||
    extractFrontmatterTitle(content)?.replace(/^CAP-\S+\s+/, "") ||
    extractH1(content)?.replace(/^CAP-\S+\s+/, "") ||
    id;
  const status = extractTableProperty(content, "Status")?.replace(/`/g, "").toLowerCase().trim() || "unknown";
  const level = extractTableProperty(content, "Level")?.replace(/`/g, "") || undefined;
  const parentRaw = extractTableProperty(content, "Parent")?.replace(/`/g, "") || undefined;

  const node: GraphNode = { id, name, type: "capability", status, origin: getOrigin(id), level };
  const edges: GraphEdge[] = [];

  // Parent capability (hierarchy)
  if (parentRaw) {
    const parentId = extractId(parentRaw) || parentRaw;
    if (/^CAP-/.test(parentId)) {
      edges.push({ source: parentId, target: id, label: "parent of" });
    }
  }

  // Platform link
  const platformVal = extractTableProperty(content, "Platform");
  if (platformVal) {
    const plId = extractId(platformVal);
    if (plId) {
      edges.push({ source: plId, target: id, label: "provides" });
    }
  }

  // ABB Mapping section — extract primary/supporting ABB relationships
  const abbSection = extractSection(content, "ABB Mapping");
  if (abbSection) {
    // Parse table rows:  | AB-004 | Name | primary | ...
    const rows = abbSection.matchAll(
      /\|\s*\[?(AB-\d{3})\]?[^|]*\|[^|]*\|\s*`?(primary|supporting|cross-cutting)`?\s*\|/gi
    );
    for (const row of rows) {
      const abbId = row[1];
      const rel = row[2].toLowerCase();
      if (rel === "primary") {
        edges.push({ source: id, target: abbId, label: "realised by", relationship: "primary" });
      } else if (rel === "supporting") {
        edges.push({ source: id, target: abbId, label: "supported by", relationship: "supporting" });
      }
      // Skip cross-cutting to avoid visual clutter
    }
  }

  // Sub-Capabilities section
  const subSection = extractSection(content, "Sub-Capabilities");
  if (subSection) {
    const subIds = extractLinkedIds(subSection);
    for (const subId of subIds) {
      edges.push({ source: id, target: subId, label: "parent of" });
    }
  }

  return { node, edges };
}

function parseABB(id: string, content: string): { node: GraphNode; edges: GraphEdge[] } {
  const name =
    extractTableProperty(content, "ABB Name") ||
    extractFrontmatterTitle(content)?.replace(/^AB-\S+\s+/, "") ||
    extractH1(content) ||
    id;
  const status = extractTableProperty(content, "Status")?.replace(/`/g, "").toLowerCase().trim() || "unknown";
  const category = extractTableProperty(content, "Category")?.replace(/`/g, "") || undefined;
  const shortName = extractTableProperty(content, "Short Name") || undefined;

  const node: GraphNode = { id, name, type: "abb", status, origin: getOrigin(id), category, shortName };
  const edges: GraphEdge[] = [];

  // Parent Bounded Context
  const bcVal =
    extractTableProperty(content, "Parent Bounded Context") ||
    extractTableProperty(content, "Bounded Context");
  if (bcVal) {
    const bcId = extractId(bcVal);
    if (bcId) {
      edges.push({ source: bcId, target: id, label: "contains" });
    }
  }

  // Parent Capability
  const capVal =
    extractTableProperty(content, "Parent Capability") ||
    extractTableProperty(content, "Realizes Capability");
  if (capVal) {
    const capId = extractId(capVal);
    if (capId) {
      edges.push({ source: capId, target: id, label: "realised by", relationship: "primary" });
    }
  }

  // Dependent building blocks section (cross-cutting dependencies)
  // These may use plain text like "AB-001 IAM" instead of markdown links
  const depSection = extractSection(content, "Dependent building blocks");
  if (depSection) {
    const depIds = extractAllIds(depSection);
    for (const depId of depIds) {
      if (depId !== id && /^AB-/.test(depId)) {
        edges.push({ source: id, target: depId, label: "depends on", relationship: "cross-cutting" });
      }
    }
  }

  return { node, edges };
}

function parseSBB(id: string, content: string): { node: GraphNode; edges: GraphEdge[] } {
  const name =
    extractTableProperty(content, "SBB Name") ||
    extractFrontmatterTitle(content)?.replace(/^SB-\S+\s+/, "") ||
    extractH1(content) ||
    id;
  const status = extractTableProperty(content, "Status")?.replace(/`/g, "").toLowerCase().trim() || "unknown";
  const category = extractTableProperty(content, "Category")?.replace(/`/g, "") || undefined;
  const shortName = extractTableProperty(content, "Short Name") || undefined;

  const node: GraphNode = { id, name, type: "sbb", status, origin: getOrigin(id), category, shortName };
  const edges: GraphEdge[] = [];

  // Realizes ABB (note: both "Realizes" and "Realises" spellings)
  const abbVal =
    extractTableProperty(content, "Realizes ABB") ||
    extractTableProperty(content, "Realises ABB");
  if (abbVal) {
    const abbId = extractId(abbVal);
    if (abbId) {
      edges.push({ source: abbId, target: id, label: "realised by" });
    }
  }

  return { node, edges };
}

// ---------------------------------------------------------------------------
// Graph builder
// ---------------------------------------------------------------------------

// Content cache: nodeId → markdown source
let cachedNodeContent: Record<string, string> = {};

async function buildGraph(config: { workspace: string | null; repoRoot: string }): Promise<Graph> {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const seenNodes = new Set<string>();
  const seenEdges = new Set<string>();
  const nodeContent: Record<string, string> = {};

  function addNode(node: GraphNode, markdown?: string) {
    if (seenNodes.has(node.id)) return;
    seenNodes.add(node.id);
    nodes.push(node);
    if (markdown) nodeContent[node.id] = markdown;
  }

  function addEdge(edge: GraphEdge) {
    const key = `${edge.source}--${edge.label}-->${edge.target}`;
    if (seenEdges.has(key)) return;
    // Don't add edges to nodes we haven't seen (will filter at the end)
    seenEdges.add(key);
    edges.push(edge);
  }

  // Determine base directories
  let outcomesDir: string;
  let platformsDir: string;
  let contextsDir: string;
  let capabilitiesDir: string;
  let abbDir: string;
  let sbbDir: string;

  if (config.workspace) {
    // Workspace mode -- artefacts at root level
    outcomesDir = join(config.workspace, "strategy", "outcomes");
    platformsDir = join(config.workspace, "platforms");
    contextsDir = join(config.workspace, "contexts");
    capabilitiesDir = join(config.workspace, "capabilities");
    abbDir = join(config.workspace, "building-blocks", "architecture-building-blocks");
    sbbDir = join(config.workspace, "building-blocks", "solution-building-blocks");
  } else {
    // Foundation mode -- artefacts under foundation/
    const foundation = join(config.repoRoot, "foundation");
    outcomesDir = join(foundation, "strategy", "outcomes");
    platformsDir = join(foundation, "platforms");
    contextsDir = join(foundation, "contexts");
    capabilitiesDir = join(foundation, "capabilities");
    abbDir = join(foundation, "building-blocks", "architecture-building-blocks");
    sbbDir = join(foundation, "building-blocks", "solution-building-blocks");
  }

  const sourceLabel = config.workspace || "foundation";

  // --- Scan Outcomes ---
  const outcomeIds = await scanDirectory(outcomesDir);
  for (const ocId of outcomeIds) {
    const content = await readArtefact(outcomesDir, ocId);
    if (!content) continue;
    const { node, edges: ocEdges } = parseOutcome(ocId, content);
    addNode(node, content);
    for (const e of ocEdges) addEdge(e);
  }

  // --- Scan Platforms ---
  const platformIds = await scanDirectory(platformsDir);
  for (const plId of platformIds) {
    const content = await readArtefact(platformsDir, plId);
    if (!content) continue;
    const { node, edges: plEdges } = parsePlatform(plId, content);
    addNode(node, content);
    for (const e of plEdges) addEdge(e);
  }

  // --- Scan Bounded Contexts ---
  const contextIds = await scanDirectory(contextsDir);
  for (const bcId of contextIds) {
    const content = await readArtefact(contextsDir, bcId);
    if (!content) continue;
    const { node, edges: bcEdges } = parseContext(bcId, content);
    addNode(node, content);
    for (const e of bcEdges) addEdge(e);
  }

  // --- Scan Capabilities ---
  const capIds = await scanDirectory(capabilitiesDir);
  for (const capId of capIds) {
    const content = await readArtefact(capabilitiesDir, capId);
    if (!content) continue;
    const { node, edges: capEdges } = parseCapability(capId, content);
    addNode(node, content);
    for (const e of capEdges) addEdge(e);
  }

  // --- Scan ABBs ---
  const abbIds = await scanDirectory(abbDir);
  for (const abId of abbIds) {
    const content = await readArtefact(abbDir, abId);
    if (!content) continue;
    const { node, edges: abEdges } = parseABB(abId, content);
    addNode(node, content);
    for (const e of abEdges) addEdge(e);
  }

  // --- Scan SBBs ---
  const sbbIds = await scanDirectory(sbbDir);
  for (const sbId of sbbIds) {
    const content = await readArtefact(sbbDir, sbId);
    if (!content) continue;
    const { node, edges: sbEdges } = parseSBB(sbId, content);
    addNode(node, content);
    for (const e of sbEdges) addEdge(e);
  }

  // Store content cache
  cachedNodeContent = nodeContent;

  // Filter edges to only those whose source and target both exist
  const validEdges = edges.filter(
    (e) => seenNodes.has(e.source) && seenNodes.has(e.target)
  );

  return {
    nodes,
    edges: validEdges,
    meta: {
      scannedAt: new Date().toISOString(),
      source: sourceLabel,
      nodeCount: nodes.length,
      edgeCount: validEdges.length,
    },
  };
}

// ---------------------------------------------------------------------------
// Markdown-driven framework reference extraction
// ---------------------------------------------------------------------------

interface FrameworkDoc {
  title: string;
  path: string;          // relative path within the repo
  category: string;      // "conceptual-model" | "standard" | "example" | "article" | "traceability"
  conceptType?: string;  // which concept type this relates to (outcome, platform, etc.)
  markdown: string;
}

interface ConceptDef {
  heading: string;
  markdown: string;
}

interface FrameworkReference {
  hierarchy: string;                        // conceptual hierarchy table
  concepts: Record<string, ConceptDef>;     // concept definitions from architectural-framework.md
  standards: FrameworkDoc[];                 // canonical standard templates
  articles: FrameworkDoc[];                 // rationale articles
  agents: FrameworkDoc[];                   // agent skill specifications
  traceability: FrameworkDoc | null;        // traceability standard
}

/** Extract YAML frontmatter title from a file */
function extractFmTitle(content: string): string | null {
  const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const t = fm[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return t ? t[1] : null;
}

/** Read a markdown file and build a FrameworkDoc */
async function readFrameworkDoc(
  filePath: string,
  repoRoot: string,
  category: string,
  conceptType?: string
): Promise<FrameworkDoc | null> {
  try {
    const content = await readFile(filePath, "utf-8");
    const title = extractFmTitle(content)
      || content.match(/^#\s+(.+)$/m)?.[1]
      || filePath.split("/").pop()?.replace(".md", "")
      || "Untitled";
    const relativePath = filePath.replace(repoRoot + "/", "");
    return { title, path: relativePath, category, conceptType, markdown: content };
  } catch {
    return null;
  }
}

/**
 * Scans the framework repo to build a complete reference index.
 * Sources: docs/architectural-framework.md, standards/, docs/articles/
 */
async function extractFrameworkReference(repoRoot: string): Promise<FrameworkReference> {
  const result: FrameworkReference = {
    hierarchy: "",
    concepts: {},
    standards: [],
    articles: [],
    agents: [],
    traceability: null,
  };

  // --- 1. Conceptual model (docs/architectural-framework.md) ---
  const fwPath = join(repoRoot, "docs", "architectural-framework.md");
  try {
    const content = await readFile(fwPath, "utf-8");

    // Extract hierarchy table from §1
    const hierarchySection = content.match(
      /## 1\.\s+The Conceptual Hierarchy\s*\n([\s\S]*?)(?=\n## \d)/
    );
    if (hierarchySection) {
      result.hierarchy = hierarchySection[1]
        .split("\n")
        .filter((line) => line.trim().startsWith("|"))
        .join("\n");
    }

    // Extract concept sections §2.1–§2.6
    const sectionMap: Array<{ pattern: RegExp; key: string }> = [
      { pattern: /### 2\.1\s+(.+)/, key: "outcome" },
      { pattern: /### 2\.2\s+(.+)/, key: "platform" },
      { pattern: /### 2\.3\s+(.+)/, key: "capability" },
      { pattern: /### 2\.4\s+(.+)/, key: "context" },
      { pattern: /### 2\.5\s+(.+)/, key: "abb" },
      { pattern: /### 2\.6\s+(.+)/, key: "sbb" },
    ];

    const lines = content.split("\n");
    for (const { pattern, key } of sectionMap) {
      let headingIdx = -1;
      let heading = "";
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(pattern);
        if (match) { headingIdx = i; heading = match[1].trim(); break; }
      }
      if (headingIdx === -1) continue;
      const contentLines: string[] = [];
      for (let i = headingIdx + 1; i < lines.length; i++) {
        if (/^#{2,3}\s+\d/.test(lines[i])) break;
        contentLines.push(lines[i]);
      }
      result.concepts[key] = { heading, markdown: contentLines.join("\n").trim() };
    }
  } catch {
    console.warn("Warning: Could not read architectural-framework.md");
  }

  // --- 2. Standards (standards/**/*.md) ---
  const standardsDir = join(repoRoot, "standards");
  const standardMappings: Array<{ path: string; conceptType: string }> = [
    { path: "strategy/standard-strategy.md", conceptType: "outcome" },
    { path: "platforms/platform-standard.md", conceptType: "platform" },
    { path: "platforms/platform-diagram-standard.md", conceptType: "platform" },
    { path: "capabilities/standard-capability-document.md", conceptType: "capability" },
    { path: "capabilities/standard-capability-diagram.md", conceptType: "capability" },
    { path: "contexts/standard-bounded-context.md", conceptType: "context" },
    { path: "building-blocks/architecture-building-blocks/standard-abb-document.md", conceptType: "abb" },
    { path: "building-blocks/architecture-building-blocks/standard-abb-diagram.md", conceptType: "abb" },
    { path: "building-blocks/solution-building-blocks/standard-sbb-document.md", conceptType: "sbb" },
    { path: "building-blocks/solution-building-blocks/standard-sbb-diagram.md", conceptType: "sbb" },
    { path: "runtime/standard-service.md", conceptType: "sbb" },
    { path: "visual-design/visual-design-standard.md", conceptType: "abb" },
  ];

  for (const { path, conceptType } of standardMappings) {
    const doc = await readFrameworkDoc(
      join(standardsDir, path), repoRoot, "standard", conceptType
    );
    if (doc) result.standards.push(doc);
  }

  // --- 3. Traceability standard ---
  const tracDoc = await readFrameworkDoc(
    join(standardsDir, "standard-traceability.md"), repoRoot, "traceability"
  );
  if (tracDoc) result.traceability = tracDoc;

  // --- 4. Articles (docs/articles/) ---
  const articlesDir = join(repoRoot, "docs", "articles");
  try {
    const articleDirs = await readdir(articlesDir, { withFileTypes: true });
    for (const entry of articleDirs) {
      if (!entry.isDirectory()) continue;
      // Convention: article dir contains a .md file with the same name
      const mdPath = join(articlesDir, entry.name, `${entry.name}.md`);
      const doc = await readFrameworkDoc(mdPath, repoRoot, "article");
      if (doc) result.articles.push(doc);
    }
  } catch { /* no articles dir */ }

  // --- 5. Agent skills (agents/) ---
  const agentsDir = join(repoRoot, "agents");
  const agentMappings: Array<{ file: string; conceptType: string }> = [
    { file: "create-strategy.md", conceptType: "outcome" },
    { file: "create-platform.md", conceptType: "platform" },
    { file: "create-capability.md", conceptType: "capability" },
    { file: "create-context.md", conceptType: "context" },
    { file: "create-abb.md", conceptType: "abb" },
    { file: "create-sbb.md", conceptType: "sbb" },
    { file: "create-service.md", conceptType: "sbb" },
    { file: "FRAMEWORK_AGENTS.md", conceptType: "" },
  ];
  for (const { file, conceptType } of agentMappings) {
    const doc = await readFrameworkDoc(
      join(agentsDir, file), repoRoot, "agent", conceptType || undefined
    );
    if (doc) result.agents.push(doc);
  }

  // --- 6. Worked examples (standards/.../example/) ---
  const examplePaths = [
    { path: "building-blocks/architecture-building-blocks/example/index.md", conceptType: "abb" },
    { path: "building-blocks/solution-building-blocks/example/index.md", conceptType: "sbb" },
  ];
  for (const { path, conceptType } of examplePaths) {
    const doc = await readFrameworkDoc(
      join(standardsDir, path), repoRoot, "example", conceptType
    );
    if (doc) result.standards.push(doc);
  }

  return result;
}


// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

const { port, workspace, repoRoot } = parseArgs();

// Pre-build graph and extract framework reference on startup
let cachedGraph = await buildGraph({ workspace, repoRoot });
const cachedReference = await extractFrameworkReference(repoRoot);

const uiDir = join(dirname(new URL(import.meta.url).pathname), "ui");

// ---------------------------------------------------------------------------
// Bun build step — bundle TSX components into a single ES module
// ---------------------------------------------------------------------------

console.log("Building UI bundle...");
const buildResult = await Bun.build({
  entrypoints: [join(uiDir, "src", "main.tsx")],
  outdir: join(uiDir, "dist"),
  format: "esm",
  external: [
    "react",
    "react-dom",
    "react-dom/client",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "@xyflow/react",
    "elkjs/lib/elk.bundled.js",
  ],
  minify: false,
});

if (!buildResult.success) {
  console.error("Build failed:", buildResult.logs);
  process.exit(1);
}
console.log("UI bundle built successfully.");

// ---------------------------------------------------------------------------
// Content-type helper
// ---------------------------------------------------------------------------

function mimeType(path: string): string {
  if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

// ---------------------------------------------------------------------------
// HTTP fetch handler
// ---------------------------------------------------------------------------

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // API endpoint — framework reference (markdown-driven)
    if (url.pathname === "/api/concepts") {
      return new Response(JSON.stringify(cachedReference, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // API endpoint — individual standard/article content by path
    if (url.pathname === "/api/doc") {
      const docPath = url.searchParams.get("path");
      if (!docPath) {
        return new Response(JSON.stringify({ error: "Missing ?path= parameter" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      // Find the doc in the cached reference
      const allDocs = [
        ...cachedReference.standards,
        ...cachedReference.articles,
        ...cachedReference.agents,
        ...(cachedReference.traceability ? [cachedReference.traceability] : []),
      ];
      const doc = allDocs.find((d) => d.path === docPath);
      if (!doc) {
        return new Response(JSON.stringify({ error: "Document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(doc, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // API endpoint — node markdown content
    if (url.pathname === "/api/node") {
      const nodeId = url.searchParams.get("id");
      if (!nodeId) {
        return new Response(JSON.stringify({ error: "Missing ?id= parameter" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const markdown = cachedNodeContent[nodeId];
      if (!markdown) {
        return new Response(JSON.stringify({ error: "Node not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ id: nodeId, markdown }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // API endpoint — return graph JSON
    if (url.pathname === "/api/graph") {
      // Check for refresh query param
      if (url.searchParams.has("refresh")) {
        cachedGraph = await buildGraph({ workspace, repoRoot });
      }
      return new Response(JSON.stringify(cachedGraph, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Serve the HTML UI
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const htmlPath = join(uiDir, "index.html");
      const html = await readFile(htmlPath, "utf-8");
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Serve bundled JS from dist/
    if (url.pathname.startsWith("/dist/")) {
      const distPath = join(uiDir, url.pathname);
      if (await fileExists(distPath)) {
        const file = Bun.file(distPath);
        return new Response(file, {
          headers: { "Content-Type": mimeType(distPath) },
        });
      }
    }

    // Serve CSS and other static files from ui/
    const safePath = url.pathname.replace(/\.\./g, "");
    const filePath = join(uiDir, safePath);
    if (await fileExists(filePath)) {
      const file = Bun.file(filePath);
      return new Response(file, {
        headers: { "Content-Type": mimeType(filePath) },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

const sourceDesc = workspace ? `workspace: ${workspace}` : "foundation content";
console.log(`
  ╔══════════════════════════════════════════════════╗
  ║  AI-Assisted Architecture — DAG Visualizer       ║
  ╠══════════════════════════════════════════════════╣
  ║  URL:    http://localhost:${port}                    ║
  ║  Source: ${sourceDesc.padEnd(40)}║
  ║  Nodes:  ${String(cachedGraph.meta.nodeCount).padEnd(39)}║
  ║  Edges:  ${String(cachedGraph.meta.edgeCount).padEnd(39)}║
  ╚══════════════════════════════════════════════════╝
`);
