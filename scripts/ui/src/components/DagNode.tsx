import React from "react";
import { Handle, Position } from "@xyflow/react";
import { TYPE_LABELS, STATUS_COLOURS, STATUS_LABELS } from "../constants";
import type { NodeType } from "../types";
import type { Status } from "../constants";

interface DagNodeData {
  id: string;
  name: string;
  type: NodeType;
  status?: string;
  level?: string;
  shortName?: string;
  origin: "framework" | "workspace";
  parentContext?: string;
}

interface DagNodeProps {
  data: DagNodeData;
}

export default function DagNode({ data }: DagNodeProps) {
  const { id, name, type, level, status, origin, parentContext } = data;
  const badgeText = level ? `${TYPE_LABELS[type]} ${level}` : TYPE_LABELS[type];
  const isWorkspace = origin === "workspace";
  const st = (status || "unknown") as Status;
  const statusColour = STATUS_COLOURS[st] || STATUS_COLOURS.unknown;
  const statusLabel = STATUS_LABELS[st] || status || "Unknown";

  return (
    <div
      className={`dag-node type-${type} status-${st}${isWorkspace ? " origin-workspace" : ""}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="node-id">{id}</div>
      <div className="node-name">{name}</div>
      <div className="badge-row">
        <span className="node-badge">{badgeText}</span>
        <span className="status-badge" style={{ background: statusColour }}>{statusLabel}</span>
        {isWorkspace && <span className="workspace-badge">Workspace</span>}
        {parentContext && <span className="bc-badge">{parentContext}</span>}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
