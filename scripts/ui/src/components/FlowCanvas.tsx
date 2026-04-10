import React, { useEffect, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import DagNode from "./DagNode";
import { TYPE_COLOURS } from "../constants";
import { layoutGraph } from "../layout";
import type { GraphNode, GraphEdge, NodeType } from "../types";

const nodeTypes = { dag: DagNode };

interface FlowCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traceNodeIds: Set<string> | null;
  searchMatchIds: Set<string> | null;
  highlightType: NodeType | null;
  onNodeSelect: (nodeId: string) => void;
  onNodeContextMenu: (event: React.MouseEvent, nodeId: string) => void;
}

export default function FlowCanvas({
  nodes: graphNodes,
  edges: graphEdges,
  traceNodeIds,
  searchMatchIds,
  highlightType,
  onNodeSelect,
  onNodeContextMenu,
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  // Store layout result so visual updates don't re-run ELK
  const layoutRef = useRef<{ children: Array<{ id: string; x: number; y: number; width: number; height: number }> } | null>(null);

  // Effect 1: Re-layout only when graph structure changes
  useEffect(() => {
    if (!graphNodes.length) {
      setNodes([]);
      setEdges([]);
      layoutRef.current = null;
      return;
    }

    layoutGraph(graphNodes, graphEdges).then((layout) => {
      layoutRef.current = layout;

      // Build initial nodes/edges (visual styling applied by Effect 2)
      const rfNodes = layout.children.map((elkNode) => {
        const original = graphNodes.find((n) => n.id === elkNode.id);
        const nodeData = original || {
          id: elkNode.id,
          name: elkNode.id,
          type: "abb" as NodeType,
          status: "unknown",
          origin: "framework" as const,
        };
        return {
          id: elkNode.id,
          type: "dag" as const,
          position: { x: elkNode.x, y: elkNode.y },
          data: nodeData,
          style: { width: elkNode.width, opacity: 1, transition: "opacity 0.3s ease" },
        };
      });

      const rfEdges = graphEdges.map((e, i) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label,
        type: "smoothstep" as const,
        animated: e.relationship === "cross-cutting",
        style: { stroke: "#4a4e6a", strokeWidth: e.relationship === "primary" ? 2 : 1, opacity: e.relationship === "cross-cutting" ? 0.4 : 0.7, transition: "opacity 0.3s ease, stroke 0.3s ease" },
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: e.relationship === "cross-cutting" ? "#555" : "#4a4e6a" },
        labelStyle: { fill: "#6b7084", fontSize: 9, fontWeight: 500 },
        labelBgStyle: { fill: "#0f1117", fillOpacity: 0.85 },
        labelBgPadding: [4, 2] as [number, number],
      }));

      setNodes(rfNodes);
      setEdges(rfEdges);

      requestAnimationFrame(() => {
        fitView({ padding: 0.12, duration: 400 });
      });
    });
  }, [graphNodes, graphEdges]);

  // Effect 2: Update visual styling (opacity, stroke, animation) without re-layout or fitView
  useEffect(() => {
    if (!layoutRef.current) return;

    const highlightNodeIds = highlightType
      ? new Set(graphNodes.filter((n) => n.type === highlightType).map((n) => n.id))
      : null;

    setNodes((prev) =>
      prev.map((node) => {
        let opacity = 1;
        if (traceNodeIds && !traceNodeIds.has(node.id)) opacity = 0.15;
        if (searchMatchIds && !searchMatchIds.has(node.id)) opacity = Math.min(opacity, 0.15);
        if (highlightNodeIds && !highlightNodeIds.has(node.id)) opacity = Math.min(opacity, 0.25);
        return { ...node, style: { ...node.style, opacity } };
      })
    );

    setEdges((prev) =>
      prev.map((edge, i) => {
        const e = graphEdges[i];
        if (!e) return edge;

        const isInTrace = traceNodeIds
          ? traceNodeIds.has(e.source) && traceNodeIds.has(e.target)
          : true;

        const baseStroke = e.relationship === "cross-cutting" ? "#555" : e.relationship === "supporting" ? "#666" : "#4a4e6a";
        const stroke = traceNodeIds ? (isInTrace ? "#8b9cf5" : baseStroke) : baseStroke;
        const strokeWidth = traceNodeIds ? (isInTrace ? 3 : (e.relationship === "primary" ? 2 : 1)) : (e.relationship === "primary" ? 2 : 1);
        const edgeOpacity = traceNodeIds ? (isInTrace ? 1 : 0.08) : (e.relationship === "cross-cutting" ? 0.4 : 0.7);

        return {
          ...edge,
          animated: e.relationship === "cross-cutting" || (traceNodeIds !== null && isInTrace),
          style: { ...edge.style, stroke, strokeWidth, opacity: edgeOpacity },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: traceNodeIds && isInTrace ? "#8b9cf5" : (e.relationship === "cross-cutting" ? "#555" : "#4a4e6a"),
          },
        };
      })
    );
  }, [traceNodeIds, searchMatchIds, highlightType, graphNodes, graphEdges]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault();
      onNodeContextMenu(event, node.id);
    },
    [onNodeContextMenu]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onNodeContextMenu={handleNodeContextMenu}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      maxZoom={2}
      defaultEdgeOptions={{ type: "smoothstep" }}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={"dots" as any} gap={20} size={1} color="#1e2130" />
      <Controls position="bottom-left" showInteractive={false} />
      <MiniMap
        position="bottom-right"
        nodeColor={(n: any) => TYPE_COLOURS[n.data?.type as NodeType] || "#444"}
        maskColor="rgba(15, 17, 23, 0.8)"
        style={{ width: 160, height: 100 }}
      />
    </ReactFlow>
  );
}
