import React from "react";
import { Handle, Position } from "@xyflow/react";
import { TYPE_LABELS } from "../constants";
import type { NodeType } from "../types";

interface DagNodeData {
  id: string;
  name: string;
  type: NodeType;
  level?: string;
  shortName?: string;
  origin: "framework" | "workspace";
}

interface DagNodeProps {
  data: DagNodeData;
}

export default function DagNode({ data }: DagNodeProps) {
  const { id, name, type, level, origin } = data;
  const badgeText = level ? `${TYPE_LABELS[type]} ${level}` : TYPE_LABELS[type];
  const isWorkspace = origin === "workspace";

  return (
    <div
      className={`dag-node type-${type}${isWorkspace ? " origin-workspace" : ""}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="node-id">{id}</div>
      <div className="node-name">{name}</div>
      <div className="badge-row">
        <span className="node-badge">{badgeText}</span>
        {isWorkspace && <span className="workspace-badge">Workspace</span>}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
