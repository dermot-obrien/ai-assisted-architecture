import ELK from "elkjs/lib/elk.bundled.js";
import { ELK_OPTIONS, TYPE_PARTITION } from "./constants";
import type { GraphNode, GraphEdge, NodeType } from "./types";

const elk = new ELK();

function estimateNodeWidth(node: GraphNode): number {
  const idLen = (node.id || "").length;
  const nameLen = (node.name || "").length;
  const maxLen = Math.max(idLen, nameLen);
  return Math.max(170, Math.min(240, maxLen * 7.5 + 40));
}

function estimateNodeHeight(node: GraphNode): number {
  const nameLen = (node.name || "").length;
  if (nameLen > 28) return 76;
  return 62;
}

export interface LayoutResult {
  children: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

/**
 * Runs ELK layered layout on the given graph data.
 * Returns positioned nodes with x, y, width, height.
 */
export async function layoutGraph(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Promise<LayoutResult> {
  const elkNodes = nodes.map((n) => ({
    id: n.id,
    width: estimateNodeWidth(n),
    height: estimateNodeHeight(n),
    layoutOptions: {
      "elk.partitioning.partition": String(
        TYPE_PARTITION[n.type as NodeType] ?? 3
      ),
    },
  }));

  const elkEdges = edges.map((e, i) => ({
    id: `e-${i}`,
    sources: [e.source],
    targets: [e.target],
  }));

  const layout = await elk.layout({
    id: "root",
    layoutOptions: ELK_OPTIONS,
    children: elkNodes,
    edges: elkEdges,
  });

  return layout as LayoutResult;
}
