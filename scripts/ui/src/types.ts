export type NodeType = "outcome" | "platform" | "context" | "capability" | "abb" | "sbb";

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  status: string;
  origin: "framework" | "workspace";
  level?: string;
  category?: string;
  shortName?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  relationship?: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta: {
    scannedAt: string;
    source: string;
    nodeCount: number;
    edgeCount: number;
  };
}

export interface ConceptDef {
  heading: string;
  markdown: string;
}

export interface FrameworkDoc {
  title: string;
  path: string;
  category: string;
  conceptType?: string;
  markdown: string;
}

export interface FrameworkReference {
  hierarchy: string;
  concepts: Record<string, ConceptDef>;
  standards: FrameworkDoc[];
  articles: FrameworkDoc[];
  agents: FrameworkDoc[];
  traceability: FrameworkDoc | null;
}

// Backwards compat alias
export type ConceptsResponse = FrameworkReference;
