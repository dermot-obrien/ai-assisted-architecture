import React, { useRef } from "react";
import { TYPE_LABELS, TYPE_COLOURS } from "../constants";
import type { NodeType, Graph } from "../types";

interface ToolbarProps {
  graphData: Graph | null;
  showFramework: boolean;
  showWorkspace: boolean;
  showCrossCutting: boolean;
  hasActiveTrace: boolean;
  hasActiveIsolation: boolean;
  highlightType: NodeType | null;
  visibleTypes: Set<NodeType>;
  searchQuery: string;
  searchMatchCount: number;
  onSearchChange: (query: string) => void;
  onSearchIsolate: () => void;
  onToggleFramework: () => void;
  onToggleWorkspace: () => void;
  onToggleCrossCutting: () => void;
  onToggleType: (type: NodeType) => void;
  onReset: () => void;
  onRefresh: () => void;
  onSwitchToFramework: () => void;
}

function Legend({
  visibleTypes,
  onToggleType,
}: {
  visibleTypes: Set<NodeType>;
  onToggleType: (type: NodeType) => void;
}) {
  const items = Object.entries(TYPE_LABELS) as [NodeType, string][];
  return (
    <div className="legend">
      {items.map(([type, label]) => {
        const active = visibleTypes.has(type);
        return (
          <div
            className={`legend-item${active ? "" : " dimmed"}`}
            key={type}
            onClick={() => onToggleType(type)}
            title={`${active ? "Hide" : "Show"} ${label} nodes`}
          >
            <div
              className="legend-swatch"
              style={{
                background: TYPE_COLOURS[type],
                opacity: active ? 1 : 0.3,
              }}
            />
            {label}
          </div>
        );
      })}
    </div>
  );
}

export default function Toolbar({
  graphData,
  showFramework,
  showWorkspace,
  showCrossCutting,
  hasActiveTrace,
  hasActiveIsolation,
  highlightType,
  visibleTypes,
  searchQuery,
  searchMatchCount,
  onSearchChange,
  onSearchIsolate,
  onToggleFramework,
  onToggleWorkspace,
  onToggleCrossCutting,
  onToggleType,
  onReset,
  onRefresh,
  onSwitchToFramework,
}: ToolbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="toolbar">
      <h1>AI-Assisted Architecture</h1>

      {/* Search */}
      <div className="search-box">
        <input
          ref={searchRef}
          type="text"
          className="search-input"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchMatchCount > 0) onSearchIsolate();
            if (e.key === "Escape") { onSearchChange(""); searchRef.current?.blur(); }
          }}
        />
        {hasSearch && (
          <span className="search-count">
            {searchMatchCount > 0 ? `${searchMatchCount} found` : "no match"}
          </span>
        )}
        {hasSearch && searchMatchCount > 0 && (
          <button
            className="search-isolate-btn"
            onClick={onSearchIsolate}
            title="Isolate to search results (Enter)"
          >
            Isolate
          </button>
        )}
        {hasSearch && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange("")}
            title="Clear search (Esc)"
          >
            {"\u00D7"}
          </button>
        )}
      </div>

      <div className="separator" />

      <Legend visibleTypes={visibleTypes} onToggleType={onToggleType} />

      <div className="separator" />

      <button
        className={showFramework ? "active" : ""}
        onClick={onToggleFramework}
        title="Toggle framework nodes"
        style={
          showFramework
            ? { background: "var(--accent)", borderColor: "var(--accent)" }
            : { opacity: 0.6 }
        }
      >
        Framework
      </button>

      <button
        className={showWorkspace ? "active" : ""}
        onClick={onToggleWorkspace}
        title="Toggle workspace nodes"
        style={
          showWorkspace
            ? { background: "#8b6e2e", borderColor: "#8b6e2e" }
            : { opacity: 0.6 }
        }
      >
        Workspace
      </button>

      <button
        onClick={onToggleCrossCutting}
        title="Show dependency edges (IAM, Observability, Governance links between platforms)"
        style={
          showCrossCutting
            ? { background: "#555", borderColor: "#555" }
            : { opacity: 0.6 }
        }
      >
        Dependencies
      </button>

      <div className="separator" />

      <button
        onClick={onSwitchToFramework}
        title="Open full framework concepts view"
      >
        Framework Guide
      </button>

      <button
        onClick={onReset}
        title="Reset all filters, traces, and isolations"
        style={
          hasActiveTrace || hasActiveIsolation || highlightType || hasSearch
            ? { background: "#c44", borderColor: "#c44" }
            : {}
        }
      >
        Reset
      </button>

      {hasActiveTrace && (
        <span className="toolbar-badge trace">TRACE ACTIVE</span>
      )}

      {hasActiveIsolation && (
        <span className="toolbar-badge isolated">ISOLATED</span>
      )}

      {graphData && (
        <span className="meta">
          {graphData.meta.nodeCount} nodes {"\u00B7"} {graphData.meta.edgeCount}{" "}
          edges {"\u00B7"} {graphData.meta.source}
        </span>
      )}

      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}
