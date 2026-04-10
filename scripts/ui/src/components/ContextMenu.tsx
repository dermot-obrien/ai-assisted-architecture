import React, { useEffect, useRef } from "react";
import type { NodeType } from "../types";

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  nodeType?: NodeType;
  onAction: (action: string, nodeId: string) => void;
  onClose: () => void;
}

interface MenuItem {
  key: string;
  icon?: string;
  label?: string;
  showFor?: NodeType[];  // only show for these node types; undefined = always
}

const ITEMS: MenuItem[] = [
  { key: "trace-up", icon: "\u2191", label: "Trace Upstream" },
  { key: "trace-down", icon: "\u2193", label: "Trace Downstream" },
  { key: "trace", icon: "\u2195", label: "Trace Full Thread" },
  { key: "divider1" },
  { key: "concept-tree", icon: "\u{1F333}", label: "Show Capability Tree", showFor: ["capability"] },
  { key: "isolate", icon: "\u29BF", label: "Isolate Subtree" },
  { key: "expand-context", icon: "\u2726", label: "Expand with Platforms & BCs" },
  { key: "details", icon: "\u2139", label: "Show Details" },
  { key: "divider2" },
  { key: "reset", icon: "\u21BA", label: "Reset View" },
];

export default function ContextMenu({
  x,
  y,
  nodeId,
  nodeType,
  onAction,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Filter items based on node type
  const visibleItems = ITEMS.filter((item) => {
    if (!item.showFor) return true;
    return nodeType && item.showFor.includes(nodeType);
  });

  return (
    <div className="context-menu" style={{ left: x, top: y }} ref={menuRef}>
      <div className="context-menu-node-id">{nodeId}</div>
      {visibleItems.map((item) => {
        if (item.key.startsWith("divider")) {
          return <div key={item.key} className="context-menu-divider" />;
        }
        return (
          <button
            key={item.key}
            className="context-menu-item"
            onClick={() => onAction(item.key, nodeId)}
          >
            <span className="cm-icon">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
