import React, { useState, useCallback, useMemo } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Toolbar from "./components/Toolbar";
import FlowCanvas from "./components/FlowCanvas";
import ContextMenu from "./components/ContextMenu";
import DetailPanel from "./components/DetailPanel";
import FrameworkView from "./components/FrameworkView";
import { useGraphData } from "./hooks/useGraphData";
import { bfsConnected, bfsDirected, traceGoldenThread, traceConceptTree, expandOneHop } from "./graph-utils";
import { ALL_STATUSES } from "./constants";
import type { NodeType } from "./types";
import type { Status } from "./constants";

type ActiveView = "dag" | "framework";

const ALL_TYPES: Set<NodeType> = new Set([
  "outcome", "platform", "context", "capability", "abb", "sbb",
]);

const ALL_STATUS_SET: Set<Status> = new Set(ALL_STATUSES);

export default function App() {
  const { graphData, concepts, loading, error, refresh } = useGraphData();
  const [activeView, setActiveView] = useState<ActiveView>("dag");

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);
  const [traceNodeIds, setTraceNodeIds] = useState<Set<string> | null>(null);
  const [isolatedSubgraph, setIsolatedSubgraph] = useState<{
    nodeIds: Set<string>;
    edgeIndices: Set<number>;
  } | null>(null);
  const [showFramework, setShowFramework] = useState(true);
  const [showWorkspace, setShowWorkspace] = useState(true);
  const [showCrossCutting, setShowCrossCutting] = useState(false);
  const [highlightType, setHighlightType] = useState<NodeType | null>(null);
  const [visibleTypes, setVisibleTypes] = useState<Set<NodeType>>(new Set(ALL_TYPES));
  const [visibleStatuses, setVisibleStatuses] = useState<Set<Status>>(new Set(ALL_STATUS_SET));
  const [searchQuery, setSearchQuery] = useState("");

  // Compute search matches
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim() || !graphData) return null;
    const q = searchQuery.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const matchIds = new Set<string>();
    for (const n of graphData.nodes) {
      const haystack = `${n.id} ${n.name} ${n.type} ${n.level || ""} ${n.category || ""} ${n.origin}`.toLowerCase();
      if (terms.every((t) => haystack.includes(t))) {
        matchIds.add(n.id);
      }
    }
    return matchIds.size > 0 ? matchIds : null;
  }, [searchQuery, graphData]);

  // Toggle a single node type in the visible set
  const handleToggleType = useCallback((type: NodeType) => {
    setVisibleTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        // Don't allow hiding all types
        if (next.size <= 1) return prev;
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // Toggle a single status in the visible set
  const handleToggleStatus = useCallback((status: Status) => {
    setVisibleStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        if (next.size <= 1) return prev;
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  // Compute effective (filtered) graph data
  const effectiveData = useMemo(() => {
    if (!graphData || !graphData.nodes.length)
      return { nodes: [], edges: [] };

    let filteredNodes = graphData.nodes;
    let filteredEdges = graphData.edges;

    // Apply origin filter
    if (!showFramework || !showWorkspace) {
      filteredNodes = filteredNodes.filter((n) => {
        if (n.origin === "framework" && !showFramework) return false;
        if (n.origin === "workspace" && !showWorkspace) return false;
        return true;
      });
    }

    // Apply type filter
    if (visibleTypes.size < ALL_TYPES.size) {
      filteredNodes = filteredNodes.filter((n) => visibleTypes.has(n.type));
    }

    // Apply status filter
    if (visibleStatuses.size < ALL_STATUS_SET.size) {
      filteredNodes = filteredNodes.filter((n) => visibleStatuses.has((n.status || "unknown") as Status));
    }

    // Filter edges to only connect visible nodes
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    filteredEdges = filteredEdges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    // Apply edge relationship filter — hide cross-cutting/supporting unless enabled
    if (!showCrossCutting) {
      filteredEdges = filteredEdges.filter(
        (e) => e.relationship !== "cross-cutting" && e.relationship !== "supporting"
      );
    }

    // Apply isolation
    if (isolatedSubgraph) {
      filteredNodes = filteredNodes.filter((n) =>
        isolatedSubgraph.nodeIds.has(n.id)
      );
      const isoIds = new Set(filteredNodes.map((n) => n.id));
      filteredEdges = filteredEdges.filter(
        (e) => isoIds.has(e.source) && isoIds.has(e.target)
      );
    }

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [graphData, showFramework, showWorkspace, showCrossCutting, visibleTypes, visibleStatuses, isolatedSubgraph]);

  // Isolate to search results
  const handleSearchIsolate = useCallback(() => {
    if (!searchMatchIds) return;
    setIsolatedSubgraph({ nodeIds: searchMatchIds, edgeIndices: new Set() });
    setTraceNodeIds(null);
  }, [searchMatchIds]);

  // Reset all interactive state
  const resetView = useCallback(() => {
    setTraceNodeIds(null);
    setIsolatedSubgraph(null);
    setSelectedNode(null);
    setContextMenu(null);
    setHighlightType(null);
    setVisibleTypes(new Set(ALL_TYPES));
    setVisibleStatuses(new Set(ALL_STATUS_SET));
    setShowCrossCutting(false);
    setSearchQuery("");
  }, []);

  // Left-click: select node, show details, trace golden thread
  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      setSelectedNode(nodeId);
      setContextMenu(null);
      if (graphData) {
        const result = traceGoldenThread(nodeId, graphData.edges, "both");
        if (isolatedSubgraph) {
          const intersected = new Set([...result.nodeIds].filter((id) => isolatedSubgraph.nodeIds.has(id)));
          setTraceNodeIds(intersected.size > 0 ? intersected : result.nodeIds);
        } else {
          setTraceNodeIds(result.nodeIds);
        }
      }
    },
    [graphData, isolatedSubgraph]
  );

  // Right-click: context menu
  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, nodeId: string) => {
      event.preventDefault();
      setContextMenu({ x: event.clientX, y: event.clientY, nodeId });
    },
    []
  );

  // Context menu action handler
  const handleContextAction = useCallback(
    (action: string, nodeId: string) => {
      setContextMenu(null);

      switch (action) {
        case "trace": {
          if (!graphData) return;
          const result = traceGoldenThread(nodeId, graphData.edges, "both");
          // If already isolated, keep isolation and just highlight within it
          if (isolatedSubgraph) {
            const intersected = new Set([...result.nodeIds].filter((id) => isolatedSubgraph.nodeIds.has(id)));
            setTraceNodeIds(intersected.size > 0 ? intersected : result.nodeIds);
          } else {
            setTraceNodeIds(result.nodeIds);
          }
          break;
        }
        case "trace-up": {
          if (!graphData) return;
          const result = traceGoldenThread(nodeId, graphData.edges, "upstream");
          if (isolatedSubgraph) {
            const intersected = new Set([...result.nodeIds].filter((id) => isolatedSubgraph.nodeIds.has(id)));
            setTraceNodeIds(intersected.size > 0 ? intersected : result.nodeIds);
          } else {
            setTraceNodeIds(result.nodeIds);
          }
          break;
        }
        case "trace-down": {
          if (!graphData) return;
          const result = traceGoldenThread(nodeId, graphData.edges, "downstream");
          if (isolatedSubgraph) {
            const intersected = new Set([...result.nodeIds].filter((id) => isolatedSubgraph.nodeIds.has(id)));
            setTraceNodeIds(intersected.size > 0 ? intersected : result.nodeIds);
          } else {
            setTraceNodeIds(result.nodeIds);
          }
          break;
        }
        case "concept-tree": {
          if (!graphData) return;
          // Show the full capability tree (L1→L2→L3) using "parent of" edges
          const result = traceConceptTree(nodeId, graphData.edges, new Set(["parent of"]));
          setIsolatedSubgraph(result);
          // Highlight the clicked node within the tree
          setTraceNodeIds(new Set([nodeId]));
          setSelectedNode(nodeId);
          break;
        }
        case "expand-context": {
          if (!graphData) return;
          const currentIds = isolatedSubgraph
            ? new Set(isolatedSubgraph.nodeIds)
            : new Set(effectiveData.nodes.map((n) => n.id));
          const nodeTypeMap = new Map(graphData.nodes.map((n) => [n.id, n.type]));

          // Trace golden thread from the clicked node to find its related PL/BC
          const thread = traceGoldenThread(nodeId, graphData.edges, "both");
          const highlightIds = new Set<string>([nodeId]);
          for (const id of thread.nodeIds) {
            const type = nodeTypeMap.get(id);
            if (type === "platform" || type === "context") {
              highlightIds.add(id);
              currentIds.add(id);
            }
          }

          // Also expand one hop from current isolation for any adjacent PL/BC
          const candidates = expandOneHop(currentIds, graphData.edges);
          for (const id of candidates) {
            const type = nodeTypeMap.get(id);
            if (type === "platform" || type === "context") {
              currentIds.add(id);
            }
          }

          // Rebuild edge indices
          const expandedEdgeIndices = new Set<number>();
          graphData.edges.forEach((e, i) => {
            if (e.relationship === "cross-cutting" || e.relationship === "supporting") return;
            if (currentIds.has(e.source) && currentIds.has(e.target)) {
              expandedEdgeIndices.add(i);
            }
          });
          setIsolatedSubgraph({ nodeIds: currentIds, edgeIndices: expandedEdgeIndices });
          setTraceNodeIds(highlightIds);
          setSelectedNode(nodeId);
          break;
        }
        case "isolate": {
          if (!graphData) return;
          // Isolate subtree: the node + everything downstream, hierarchical only
          const result = traceGoldenThread(nodeId, graphData.edges, "downstream");
          setIsolatedSubgraph(result);
          setTraceNodeIds(null);
          break;
        }
        case "details": {
          setSelectedNode(nodeId);
          break;
        }
        case "reset": {
          resetView();
          break;
        }
      }
    },
    [graphData, isolatedSubgraph, effectiveData, resetView]
  );

  // Switch to DAG, optionally focusing on a node
  const switchToDAG = useCallback((focusNodeId?: string) => {
    setActiveView("dag");
    if (focusNodeId && graphData) {
      const result = traceGoldenThread(focusNodeId, graphData.edges, "both");
      setTraceNodeIds(result.nodeIds);
      setSelectedNode(focusNodeId);
    }
  }, [graphData]);

  if (error) {
    return <div className="loading">Failed to load graph: {error}</div>;
  }

  if (loading && !graphData) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading framework graph...
      </div>
    );
  }

  // Framework concepts view
  if (activeView === "framework") {
    return (
      <FrameworkView
        reference={concepts}
        graphData={graphData}
        onSwitchToDAG={switchToDAG}
      />
    );
  }

  // DAG view
  const hasActiveTrace = traceNodeIds !== null;
  const hasActiveIsolation = isolatedSubgraph !== null;

  return (
    <>
      <Toolbar
        graphData={graphData}
        showFramework={showFramework}
        showWorkspace={showWorkspace}
        showCrossCutting={showCrossCutting}
        hasActiveTrace={hasActiveTrace}
        hasActiveIsolation={hasActiveIsolation}
        highlightType={highlightType}
        visibleTypes={visibleTypes}
        visibleStatuses={visibleStatuses}
        searchQuery={searchQuery}
        searchMatchCount={searchMatchIds?.size ?? 0}
        onSearchChange={setSearchQuery}
        onSearchIsolate={handleSearchIsolate}
        onToggleFramework={() => setShowFramework((p) => !p)}
        onToggleWorkspace={() => setShowWorkspace((p) => !p)}
        onToggleCrossCutting={() => setShowCrossCutting((p) => !p)}
        onToggleType={handleToggleType}
        onToggleStatus={handleToggleStatus}
        onReset={resetView}
        onRefresh={refresh}
        onSwitchToFramework={() => setActiveView("framework")}
      />

      <div className="flow-container">
        <ReactFlowProvider>
          <FlowCanvas
            nodes={effectiveData.nodes}
            edges={effectiveData.edges}
            traceNodeIds={traceNodeIds}
            searchMatchIds={searchMatchIds}
            highlightType={highlightType}
            onNodeSelect={handleNodeSelect}
            onNodeContextMenu={handleNodeContextMenu}
          />
        </ReactFlowProvider>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          nodeType={graphData?.nodes.find((n) => n.id === contextMenu.nodeId)?.type}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}

      <DetailPanel
        selectedNode={selectedNode}
        graphData={graphData}
        concepts={concepts}
        onClose={() => setSelectedNode(null)}
        onNodeNavigate={handleNodeSelect}
      />
    </>
  );
}
