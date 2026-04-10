import type { NodeType } from "./types";

export const TYPE_COLOURS: Record<NodeType, string> = {
  outcome: "#5b8cd4",
  platform: "#2e8b7a",
  context: "#d4c05b",
  capability: "#d4915b",
  abb: "#9b6ccf",
  sbb: "#c26cb0",
  decision: "#4a90d9",
};

export const TYPE_LABELS: Record<NodeType, string> = {
  outcome: "Outcome",
  platform: "Platform",
  context: "Bounded Context",
  capability: "Capability",
  abb: "ABB",
  sbb: "SBB",
  decision: "Decision Record",
};

// Lifecycle statuses — ordered from early to mature
export type Status = "proposed" | "draft" | "approved" | "active" | "deprecated" | "candidate" | "rejected" | "unknown";

export const STATUS_LABELS: Record<Status, string> = {
  proposed: "Proposed",
  draft: "Draft",
  approved: "Approved",
  active: "Active",
  deprecated: "Deprecated",
  candidate: "Candidate",
  rejected: "Rejected",
  unknown: "Unknown",
};

export const STATUS_COLOURS: Record<Status, string> = {
  proposed: "#e0a832",   // amber — under evaluation
  draft: "#6b7084",      // grey — work in progress
  approved: "#5b8cd4",   // blue — reviewed and accepted
  active: "#4caf78",     // green — live, in production
  deprecated: "#c44",    // red — phasing out
  candidate: "#e0a832",  // amber — under evaluation, not yet committed
  rejected: "#888",      // dimmed — evaluated but not selected
  unknown: "#555",
};

export const ALL_STATUSES: Status[] = ["proposed", "draft", "approved", "active", "deprecated", "candidate", "rejected"];

export const TYPE_PARTITION: Record<NodeType, number> = {
  outcome: 0,
  platform: 1,
  context: 2,
  capability: 3,
  abb: 4,
  sbb: 5,
  decision: 6,
};

export const ELK_OPTIONS: Record<string, string> = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "40",
  "elk.layered.spacing.nodeNodeBetweenLayers": "60",
  "elk.layered.spacing.edgeNodeBetweenLayers": "30",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.hierarchyHandling": "INCLUDE_CHILDREN",
  "elk.partitioning.activate": "true",
};
