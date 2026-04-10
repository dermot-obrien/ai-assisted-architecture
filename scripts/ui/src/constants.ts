import type { NodeType } from "./types";

export const TYPE_COLOURS: Record<NodeType, string> = {
  outcome: "#5b8cd4",
  platform: "#2e8b7a",
  context: "#d4c05b",
  capability: "#d4915b",
  abb: "#9b6ccf",
  sbb: "#c26cb0",
};

export const TYPE_LABELS: Record<NodeType, string> = {
  outcome: "Outcome",
  platform: "Platform",
  context: "Bounded Context",
  capability: "Capability",
  abb: "ABB",
  sbb: "SBB",
};

export const TYPE_PARTITION: Record<NodeType, number> = {
  outcome: 0,
  platform: 1,
  context: 2,
  capability: 3,
  abb: 4,
  sbb: 5,
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
