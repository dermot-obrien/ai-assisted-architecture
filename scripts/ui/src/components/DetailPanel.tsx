import React from "react";
import { TYPE_LABELS } from "../constants";
import type { Graph } from "../types";

interface DetailPanelProps {
  selectedNode: string | null;
  graphData: Graph | null;
  onClose: () => void;
}

export default function DetailPanel({
  selectedNode,
  graphData,
  onClose,
}: DetailPanelProps) {
  if (!selectedNode || !graphData) return null;

  const node = graphData.nodes.find((n) => n.id === selectedNode);
  if (!node) return null;

  const incoming = graphData.edges.filter((e) => e.target === selectedNode);
  const outgoing = graphData.edges.filter((e) => e.source === selectedNode);

  const nodeNameMap: Record<string, string> = {};
  graphData.nodes.forEach((n) => {
    nodeNameMap[n.id] = n.name;
  });

  const originClass = node.origin === "workspace" ? "workspace" : "framework";
  const originLabel = node.origin === "workspace" ? "Workspace" : "Framework";

  return (
    <div className={`detail-panel ${selectedNode ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        {"\u00D7"}
      </button>
      <div className="detail-id">{node.id}</div>
      <h2>{node.name}</h2>

      <div className="detail-section">
        <h3>Type</h3>
        <div style={{ fontSize: "12px" }}>
          {TYPE_LABELS[node.type] +
            (node.level ? ` (${node.level})` : "") +
            (node.category ? ` \u2014 ${node.category}` : "")}
        </div>
      </div>

      <div className="detail-section">
        <h3>Origin</h3>
        <span className={`detail-origin-badge ${originClass}`}>
          {originLabel}
        </span>
      </div>

      <div className="detail-section">
        <h3>Status</h3>
        <div style={{ fontSize: "12px" }}>{node.status}</div>
      </div>

      {node.shortName && (
        <div className="detail-section">
          <h3>Short Name</h3>
          <div style={{ fontSize: "12px" }}>{node.shortName}</div>
        </div>
      )}

      {incoming.length > 0 && (
        <div className="detail-section">
          <h3>Incoming ({incoming.length})</h3>
          <ul>
            {incoming.map((e, i) => (
              <li key={i}>
                {nodeNameMap[e.source] || e.source}
                <span className="edge-label">({e.label})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {outgoing.length > 0 && (
        <div className="detail-section">
          <h3>Outgoing ({outgoing.length})</h3>
          <ul>
            {outgoing.map((e, i) => (
              <li key={i}>
                {nodeNameMap[e.target] || e.target}
                <span className="edge-label">({e.label})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
