import React, { useMemo, useState } from "react";
import { TYPE_LABELS, TYPE_COLOURS, STATUS_COLOURS, STATUS_LABELS } from "../constants";
import type { GraphNode, GraphEdge, NodeType } from "../types";
import type { Status } from "../constants";

interface TableViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  allNodes: GraphNode[];  // full graph for name resolution
  onNodeNavigate: (nodeId: string) => void;
  onSwitchToDAG: (nodeId?: string) => void;
}

// Layer ordering for the table
const LAYER_ORDER: NodeType[] = ["outcome", "platform", "context", "capability", "abb", "sbb", "decision"];

interface RowData {
  node: GraphNode;
  upstream: Array<{ id: string; label: string }>;
  downstream: Array<{ id: string; label: string }>;
}

export default function TableView({
  nodes,
  edges,
  allNodes,
  onNodeNavigate,
  onSwitchToDAG,
}: TableViewProps) {
  const [expandedBCs, setExpandedBCs] = useState<Set<string>>(new Set(["_all"]));
  const [sortColumn, setSortColumn] = useState<"id" | "name" | "status">("id");

  // Name lookup across ALL nodes (not just filtered)
  const nameMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const n of allNodes) m.set(n.id, n.name);
    return m;
  }, [allNodes]);

  // Node set for quick lookup
  const nodeIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);

  // Build row data with relationships
  const rows: RowData[] = useMemo(() => {
    return nodes.map((node) => {
      const upstream: Array<{ id: string; label: string }> = [];
      const downstream: Array<{ id: string; label: string }> = [];

      for (const e of edges) {
        if (e.target === node.id && nodeIds.has(e.source)) {
          upstream.push({ id: e.source, label: e.label });
        }
        if (e.source === node.id && nodeIds.has(e.target)) {
          downstream.push({ id: e.target, label: e.label });
        }
      }

      return { node, upstream, downstream };
    });
  }, [nodes, edges, nodeIds]);

  // Group nodes by layer, then by BC within ABB/SBB layers
  const grouped = useMemo(() => {
    const groups = new Map<string, RowData[]>();

    for (const type of LAYER_ORDER) {
      const layerRows = rows.filter((r) => r.node.type === type);
      if (layerRows.length === 0) continue;

      if (type === "abb" || type === "sbb") {
        // Sub-group by parentContext
        const byBC = new Map<string, RowData[]>();
        for (const row of layerRows) {
          const bc = row.node.parentContext || "_unassigned";
          if (!byBC.has(bc)) byBC.set(bc, []);
          byBC.get(bc)!.push(row);
        }
        // Sort BC groups: workspace first, then framework
        const sortedBCs = [...byBC.entries()].sort(([a], [b]) => {
          if (a === "_unassigned") return 1;
          if (b === "_unassigned") return -1;
          const aWs = a.includes("-NPC-") ? 0 : 1;
          const bWs = b.includes("-NPC-") ? 0 : 1;
          return aWs - bWs || a.localeCompare(b);
        });
        for (const [bcId, bcRows] of sortedBCs) {
          const key = `${type}:${bcId}`;
          groups.set(key, sortRows(bcRows, sortColumn));
        }
      } else {
        groups.set(type, sortRows(layerRows, sortColumn));
      }
    }

    return groups;
  }, [rows, sortColumn]);

  function toggleBC(bcId: string) {
    setExpandedBCs((prev) => {
      const next = new Set(prev);
      if (next.has(bcId)) next.delete(bcId);
      else next.add(bcId);
      return next;
    });
  }

  const allExpanded = expandedBCs.has("_all");
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedBCs(new Set());
    } else {
      setExpandedBCs(new Set(["_all"]));
    }
  };

  return (
    <div className="table-view">
      <div className="table-view-header">
        <h2>Architecture Table View</h2>
        <div className="table-view-controls">
          <button onClick={toggleAll}>
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
          <button onClick={() => onSwitchToDAG()}>
            Switch to DAG
          </button>
        </div>
      </div>

      <div className="table-view-content">
        {[...grouped.entries()].map(([groupKey, groupRows]) => {
          const [layerType, bcId] = groupKey.includes(":")
            ? groupKey.split(":", 2)
            : [groupKey, undefined];

          const isSubGroup = !!bcId;
          const sectionId = bcId || layerType;
          const isExpanded = allExpanded || expandedBCs.has(sectionId);

          // Section header
          const layerColour = TYPE_COLOURS[layerType as NodeType] || "#666";
          const bcName = bcId && bcId !== "_unassigned" ? nameMap.get(bcId) : undefined;
          const sectionTitle = isSubGroup
            ? `${TYPE_LABELS[layerType as NodeType]} — ${bcName ? `${bcId} ${bcName}` : (bcId === "_unassigned" ? "No BC assigned" : bcId)}`
            : TYPE_LABELS[layerType as NodeType] || layerType;

          return (
            <div key={groupKey} className="table-section">
              <div
                className="table-section-header"
                onClick={() => toggleBC(sectionId)}
                style={{ borderLeftColor: layerColour }}
              >
                <span className="table-section-arrow">{isExpanded ? "\u25BC" : "\u25B6"}</span>
                <span className="table-section-title">{sectionTitle}</span>
                <span className="table-section-count">{groupRows.length}</span>
              </div>

              {isExpanded && (
                <table className="table-artefacts">
                  <thead>
                    <tr>
                      <th className="col-id" onClick={() => setSortColumn("id")}>
                        ID {sortColumn === "id" ? "\u25B4" : ""}
                      </th>
                      <th className="col-name" onClick={() => setSortColumn("name")}>
                        Name {sortColumn === "name" ? "\u25B4" : ""}
                      </th>
                      <th className="col-status" onClick={() => setSortColumn("status")}>
                        Status {sortColumn === "status" ? "\u25B4" : ""}
                      </th>
                      <th className="col-origin">Origin</th>
                      {!isSubGroup && <th className="col-bc">BC</th>}
                      <th className="col-upstream">Upstream</th>
                      <th className="col-downstream">Downstream</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupRows.map((row) => {
                      const st = (row.node.status || "unknown") as Status;
                      return (
                        <tr
                          key={row.node.id}
                          className={`table-row origin-${row.node.origin}`}
                          onClick={() => onNodeNavigate(row.node.id)}
                        >
                          <td className="col-id">
                            <span className="table-id-dot" style={{ background: layerColour }} />
                            {row.node.id}
                          </td>
                          <td className="col-name">
                            {row.node.name}
                            {row.node.level && (
                              <span className="table-level-badge">{row.node.level}</span>
                            )}
                          </td>
                          <td className="col-status">
                            <span
                              className="table-status-badge"
                              style={{ background: STATUS_COLOURS[st] || STATUS_COLOURS.unknown }}
                            >
                              {STATUS_LABELS[st] || st}
                            </span>
                          </td>
                          <td className="col-origin">
                            <span className={`table-origin-badge ${row.node.origin}`}>
                              {row.node.origin === "workspace" ? "WS" : "FW"}
                            </span>
                          </td>
                          {!isSubGroup && (
                            <td className="col-bc">
                              {row.node.parentContext ? (
                                <span
                                  className="table-bc-link"
                                  onClick={(e) => { e.stopPropagation(); onNodeNavigate(row.node.parentContext!); }}
                                >
                                  {row.node.parentContext}
                                </span>
                              ) : row.node.parentPlatform ? (
                                <span
                                  className="table-bc-link"
                                  onClick={(e) => { e.stopPropagation(); onNodeNavigate(row.node.parentPlatform!); }}
                                >
                                  {row.node.parentPlatform}
                                </span>
                              ) : "—"}
                            </td>
                          )}
                          <td className="col-upstream">
                            {row.upstream.slice(0, 3).map((u, i) => (
                              <span
                                key={i}
                                className="table-rel-chip"
                                onClick={(e) => { e.stopPropagation(); onNodeNavigate(u.id); }}
                                title={`${u.id}: ${u.label}`}
                              >
                                {u.id}
                              </span>
                            ))}
                            {row.upstream.length > 3 && (
                              <span className="table-rel-overflow">+{row.upstream.length - 3}</span>
                            )}
                          </td>
                          <td className="col-downstream">
                            {row.downstream.slice(0, 3).map((d, i) => (
                              <span
                                key={i}
                                className="table-rel-chip"
                                onClick={(e) => { e.stopPropagation(); onNodeNavigate(d.id); }}
                                title={`${d.id}: ${d.label}`}
                              >
                                {d.id}
                              </span>
                            ))}
                            {row.downstream.length > 3 && (
                              <span className="table-rel-overflow">+{row.downstream.length - 3}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function sortRows(rows: RowData[], column: "id" | "name" | "status"): RowData[] {
  return [...rows].sort((a, b) => {
    const av = column === "id" ? a.node.id : column === "name" ? a.node.name : a.node.status;
    const bv = column === "id" ? b.node.id : column === "name" ? b.node.name : b.node.status;
    return av.localeCompare(bv);
  });
}
