import type { GraphEdge } from "./types";

type Direction = "both" | "upstream" | "downstream";

/** Relationships to exclude when tracing the Golden Thread */
const NON_HIERARCHICAL = new Set(["cross-cutting", "supporting"]);

/**
 * Directed BFS from startId.
 *
 * direction:
 *   "downstream" — follow source→target (toward SBBs/Services)
 *   "upstream"   — follow target→source (toward Outcomes/Platforms)
 *   "both"       — undirected
 *
 * excludeRelationships: skip edges with these relationship types.
 */
export function bfsDirected(
  startId: string,
  edges: GraphEdge[],
  direction: Direction = "both",
  excludeRelationships?: Set<string>
): { nodeIds: Set<string>; edgeIndices: Set<number> } {
  // Build adjacency list based on direction
  const adj: Record<string, Array<{ target: string; edgeIdx: number }>> = {};
  const validEdgeIndices: number[] = [];

  edges.forEach((e, i) => {
    if (excludeRelationships && e.relationship && excludeRelationships.has(e.relationship)) {
      return;
    }
    validEdgeIndices.push(i);

    if (direction === "downstream" || direction === "both") {
      if (!adj[e.source]) adj[e.source] = [];
      adj[e.source].push({ target: e.target, edgeIdx: i });
    }
    if (direction === "upstream" || direction === "both") {
      if (!adj[e.target]) adj[e.target] = [];
      adj[e.target].push({ target: e.source, edgeIdx: i });
    }
  });

  // BFS
  const visited = new Set<string>();
  const queue = [startId];
  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const nb of adj[current] || []) {
      if (!visited.has(nb.target)) {
        visited.add(nb.target);
        queue.push(nb.target);
      }
    }
  }

  // Collect edge indices within the subgraph
  const edgeIndices = new Set<number>();
  for (const i of validEdgeIndices) {
    const e = edges[i];
    if (visited.has(e.source) && visited.has(e.target)) {
      edgeIndices.add(i);
    }
  }

  return { nodeIds: visited, edgeIndices };
}

/** Undirected BFS (legacy compat) */
export function bfsConnected(
  startId: string,
  edges: GraphEdge[],
  excludeRelationships?: Set<string>
): { nodeIds: Set<string>; edgeIndices: Set<number> } {
  return bfsDirected(startId, edges, "both", excludeRelationships);
}

/**
 * Edge labels that represent the primary containment/realisation chain.
 * These are the edges that form the Golden Thread when traversed in their
 * natural direction (source→target):
 *   Platform --contains--> BC --contains--> ABB
 *   Platform --provides--> Capability
 *   Capability --realised by--> ABB
 *   ABB --realised by--> SBB
 *   Outcome --drives--> Platform
 *   Capability --parent of--> Capability
 *   Capability --traces to--> Outcome
 *
 * "realised in" is the reverse — it goes from ABB/CAP→BC, which fans out.
 * For upstream tracing we follow these edges in reverse (target→source).
 * For downstream we follow source→target.
 */
const GOLDEN_THREAD_LABELS = new Set([
  "contains", "provides", "realised by", "parent of", "drives", "traces to",
]);

/**
 * Trace the Golden Thread — follows only the direct containment/realisation edges.
 *
 * "both" traces upstream AND downstream independently from the start node,
 * then unions the results. This gives the direct lineage without fan-out
 * through sibling branches at intermediate levels.
 */
export function traceGoldenThread(
  startId: string,
  edges: GraphEdge[],
  direction: Direction = "both"
): { nodeIds: Set<string>; edgeIndices: Set<number> } {
  // Filter to only golden thread edges (by label), excluding cross-cutting/supporting
  const threadEdges = edges.map((e, i) => ({ edge: e, idx: i })).filter(({ edge }) => {
    if (edge.relationship === "cross-cutting" || edge.relationship === "supporting") return false;
    if (GOLDEN_THREAD_LABELS.has(edge.label)) return true;
    return false;
  });

  // Build directed adjacency lists
  const downAdj: Record<string, Array<{ target: string; edgeIdx: number }>> = {};
  const upAdj: Record<string, Array<{ target: string; edgeIdx: number }>> = {};

  for (const { edge, idx } of threadEdges) {
    if (!downAdj[edge.source]) downAdj[edge.source] = [];
    downAdj[edge.source].push({ target: edge.target, edgeIdx: idx });
    if (!upAdj[edge.target]) upAdj[edge.target] = [];
    upAdj[edge.target].push({ target: edge.source, edgeIdx: idx });
  }

  const visited = new Set<string>();
  visited.add(startId);

  // BFS upstream (target→source)
  if (direction === "upstream" || direction === "both") {
    const queue = [startId];
    const seen = new Set<string>([startId]);
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const nb of upAdj[current] || []) {
        if (!seen.has(nb.target)) {
          seen.add(nb.target);
          visited.add(nb.target);
          queue.push(nb.target);
        }
      }
    }
  }

  // BFS downstream (source→target)
  if (direction === "downstream" || direction === "both") {
    const queue = [startId];
    const seen = new Set<string>([startId]);
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const nb of downAdj[current] || []) {
        if (!seen.has(nb.target)) {
          seen.add(nb.target);
          visited.add(nb.target);
          queue.push(nb.target);
        }
      }
    }
  }

  // Collect edge indices connecting nodes in the result
  const edgeIndices = new Set<number>();
  for (const { idx, edge } of threadEdges) {
    if (visited.has(edge.source) && visited.has(edge.target)) {
      edgeIndices.add(idx);
    }
  }

  return { nodeIds: visited, edgeIndices };
}

/**
 * Trace a concept-type tree — only follows edges with specific labels.
 * For capabilities: follows "parent of" edges to find the full L1→L2→L3 tree.
 * Goes upstream to find the root, then downstream to find all siblings/cousins.
 */
export function traceConceptTree(
  startId: string,
  edges: GraphEdge[],
  edgeLabels: Set<string>
): { nodeIds: Set<string>; edgeIndices: Set<number> } {
  // First find the root by going upstream through matching edges only
  const upAdj: Record<string, Array<{ target: string; edgeIdx: number }>> = {};
  const downAdj: Record<string, Array<{ target: string; edgeIdx: number }>> = {};
  const validEdgeIndices: number[] = [];

  edges.forEach((e, i) => {
    if (!edgeLabels.has(e.label)) return;
    validEdgeIndices.push(i);
    // "parent of" means source is parent, target is child
    // upstream = target→source (child to parent)
    if (!upAdj[e.target]) upAdj[e.target] = [];
    upAdj[e.target].push({ target: e.source, edgeIdx: i });
    // downstream = source→target (parent to child)
    if (!downAdj[e.source]) downAdj[e.source] = [];
    downAdj[e.source].push({ target: e.target, edgeIdx: i });
  });

  // Walk upstream to find root
  let root = startId;
  const visited = new Set<string>();
  visited.add(root);
  let current = root;
  while (true) {
    const parents = upAdj[current] || [];
    const unvisitedParent = parents.find((p) => !visited.has(p.target));
    if (!unvisitedParent) break;
    visited.add(unvisitedParent.target);
    current = unvisitedParent.target;
    root = current;
  }

  // Now BFS downstream from root to get the full tree
  const treeNodes = new Set<string>();
  const queue = [root];
  treeNodes.add(root);

  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const child of downAdj[node] || []) {
      if (!treeNodes.has(child.target)) {
        treeNodes.add(child.target);
        queue.push(child.target);
      }
    }
  }

  // Collect matching edge indices
  const edgeIndices = new Set<number>();
  for (const i of validEdgeIndices) {
    const e = edges[i];
    if (treeNodes.has(e.source) && treeNodes.has(e.target)) {
      edgeIndices.add(i);
    }
  }

  return { nodeIds: treeNodes, edgeIndices };
}

/**
 * Expand an existing isolated node set by adding directly connected nodes
 * one hop out via hierarchical edges.
 * Returns the set of candidate node IDs (caller can filter by type).
 */
export function expandOneHop(
  currentNodeIds: Set<string>,
  edges: GraphEdge[]
): Set<string> {
  const candidates = new Set<string>();

  for (const e of edges) {
    if (e.relationship === "cross-cutting" || e.relationship === "supporting") continue;
    if (currentNodeIds.has(e.source) && !currentNodeIds.has(e.target)) {
      candidates.add(e.target);
    }
    if (currentNodeIds.has(e.target) && !currentNodeIds.has(e.source)) {
      candidates.add(e.source);
    }
  }

  return candidates;
}
