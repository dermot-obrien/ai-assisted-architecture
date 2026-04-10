import React, { useState, useEffect } from "react";
import { TYPE_LABELS, TYPE_COLOURS } from "../constants";
import type { Graph, GraphNode, NodeType, FrameworkReference, FrameworkDoc } from "../types";

interface DetailPanelProps {
  selectedNode: string | null;
  graphData: Graph | null;
  concepts: FrameworkReference | null;
  onClose: () => void;
  onNodeNavigate: (nodeId: string) => void;
}

// ---------------------------------------------------------------------------
// Inline markdown renderer (lightweight)
// ---------------------------------------------------------------------------

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1]) parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={match.index}>{match[4]}</em>);
    else if (match[5]) parts.push(<code key={match.index} className="ref-inline-code">{match[6]}</code>);
    else if (match[7]) parts.push(<a key={match.index} href={match[9]} target="_blank" rel="noopener noreferrer" className="ref-link">{match[8]}</a>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}

function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }

    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const level = hm[1].length;
      const Tag = `h${Math.min(level + 2, 6)}` as keyof React.JSX.IntrinsicElements;
      elements.push(<Tag key={i} style={{ margin: "8px 0 4px", fontSize: `${14 - level}px` }}>{renderInline(hm[2])}</Tag>);
      i++; continue;
    }

    if (line.startsWith("> ")) {
      const ql: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) { ql.push(lines[i].slice(2)); i++; }
      elements.push(
        <blockquote key={`bq-${i}`} className="ref-blockquote">
          {ql.map((q, qi) => <span key={qi}>{renderInline(q)}<br /></span>)}
        </blockquote>
      );
      continue;
    }

    if (line.includes("|") && line.trim().startsWith("|")) {
      const tl: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tl.push(lines[i]); i++; }
      const parseRow = (l: string): string[] => l.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
      const dataRows = tl.filter((l) => !l.replace(/[|:\-\s]/g, "").match(/^$/));
      if (dataRows.length > 0) {
        const headerCells = parseRow(dataRows[0]);
        const bodyRows = dataRows.slice(1).map(parseRow);
        elements.push(
          <table key={`tbl-${i}`} className="ref-table">
            <thead><tr>{headerCells.map((cell, ci) => <th key={ci}>{renderInline(cell)}</th>)}</tr></thead>
            <tbody>{bodyRows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{renderInline(cell)}</td>)}</tr>)}</tbody>
          </table>
        );
      }
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*[-*\d.]+\s+/, ""));
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="ref-list">{items.map((li, idx) => <li key={idx}>{renderInline(li)}</li>)}</ul>);
      continue;
    }

    elements.push(<p key={i} className="ref-paragraph">{renderInline(line)}</p>);
    i++;
  }
  return <>{elements}</>;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RelationshipList({
  title,
  edges,
  nodeNameMap,
  nodeTypeMap,
  onNavigate,
}: {
  title: string;
  edges: Array<{ id: string; label: string; relationship?: string }>;
  nodeNameMap: Record<string, string>;
  nodeTypeMap: Record<string, NodeType>;
  onNavigate: (id: string) => void;
}) {
  if (edges.length === 0) return null;
  return (
    <div className="detail-section">
      <h3>{title} ({edges.length})</h3>
      <ul className="detail-rel-list">
        {edges.map((e, i) => {
          const type = nodeTypeMap[e.id];
          return (
            <li key={i} className="detail-rel-item" onClick={() => onNavigate(e.id)}>
              <span
                className="detail-rel-dot"
                style={{ background: type ? TYPE_COLOURS[type] : "#666" }}
              />
              <span className="detail-rel-name">{nodeNameMap[e.id] || e.id}</span>
              <span className="detail-rel-label">{e.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NodeContentSummary({ markdown, onShowFull }: { markdown: string; onShowFull: () => void }) {
  // Extract purpose section (usually section 1)
  const lines = markdown.split("\n");
  const summaryLines: string[] = [];
  let inPurpose = false;
  let foundPurpose = false;

  for (const line of lines) {
    // Skip the H1 title and properties table at top
    if (line.startsWith("# ")) continue;

    // Look for Purpose section
    if (/^##\s+\d*\.?\s*Purpose/i.test(line)) {
      inPurpose = true;
      foundPurpose = true;
      continue;
    }
    // Stop at next H2
    if (inPurpose && /^##\s+/.test(line)) break;
    if (inPurpose && line.trim()) {
      summaryLines.push(line);
    }
  }

  // If no purpose section, take the first non-table, non-heading paragraph
  if (!foundPurpose) {
    let inTable = false;
    for (const line of lines) {
      if (line.startsWith("# ") || line.startsWith("## ")) continue;
      if (line.trim().startsWith("|")) { inTable = true; continue; }
      if (inTable && !line.trim().startsWith("|")) inTable = false;
      if (!inTable && line.trim() && !line.startsWith("---")) {
        summaryLines.push(line);
        if (summaryLines.length >= 4) break;
      }
    }
  }

  if (summaryLines.length === 0) return null;

  return (
    <div className="detail-section detail-node-content">
      <div className="detail-node-summary">
        {renderMarkdown(summaryLines.join("\n"))}
      </div>
      <button className="detail-view-full-btn" onClick={onShowFull}>
        View full document
      </button>
    </div>
  );
}

function DocCard({ doc, onOpen }: { doc: FrameworkDoc; onOpen: (doc: FrameworkDoc) => void }) {
  return (
    <div className="detail-doc-card" onClick={() => onOpen(doc)}>
      <span className="detail-doc-title">{doc.title}</span>
      <span className="detail-doc-category">{doc.category}</span>
    </div>
  );
}

function DocViewer({ doc, onBack }: { doc: FrameworkDoc; onBack: () => void }) {
  const content = doc.markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  return (
    <div className="detail-doc-viewer">
      <button className="detail-back-btn" onClick={onBack}>{"< Back"}</button>
      <h3 className="detail-doc-viewer-title">{doc.title}</h3>
      <span className="detail-doc-path">{doc.path}</span>
      <div className="detail-doc-content">{renderMarkdown(content)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

const TYPE_TO_CONCEPT: Record<NodeType, string> = {
  outcome: "outcome",
  platform: "platform",
  context: "context",
  capability: "capability",
  abb: "abb",
  sbb: "sbb",
  decision: "decision",
};

export default function DetailPanel({
  selectedNode,
  graphData,
  concepts,
  onClose,
  onNodeNavigate,
}: DetailPanelProps) {
  const [activeDoc, setActiveDoc] = useState<FrameworkDoc | null>(null);
  const [nodeMarkdown, setNodeMarkdown] = useState<string | null>(null);
  const [showFullDoc, setShowFullDoc] = useState(false);

  // Fetch node content when selection changes
  useEffect(() => {
    setNodeMarkdown(null);
    setActiveDoc(null);
    setShowFullDoc(false);
    if (!selectedNode) return;
    fetch(`/api/node?id=${encodeURIComponent(selectedNode)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.markdown) setNodeMarkdown(data.markdown); })
      .catch(() => {});
  }, [selectedNode]);

  if (!selectedNode || !graphData) return null;

  const node = graphData.nodes.find((n) => n.id === selectedNode);
  if (!node) return null;

  // Build lookup maps
  const nodeNameMap: Record<string, string> = {};
  const nodeTypeMap: Record<string, NodeType> = {};
  graphData.nodes.forEach((n) => {
    nodeNameMap[n.id] = n.name;
    nodeTypeMap[n.id] = n.type;
  });

  // Relationships
  const incoming = graphData.edges
    .filter((e) => e.target === selectedNode)
    .map((e) => ({ id: e.source, label: e.label, relationship: e.relationship }));
  const outgoing = graphData.edges
    .filter((e) => e.source === selectedNode)
    .map((e) => ({ id: e.target, label: e.label, relationship: e.relationship }));

  // Contextual reference for this node type
  const conceptKey = TYPE_TO_CONCEPT[node.type];
  const conceptDef = concepts?.concepts[conceptKey];
  const relevantStandards = concepts?.standards.filter((s) => s.conceptType === conceptKey) || [];
  const relevantAgents = concepts?.agents.filter((a) => a.conceptType === conceptKey) || [];

  const originClass = node.origin === "workspace" ? "workspace" : "framework";
  const originLabel = node.origin === "workspace" ? "Workspace" : "Framework";
  const colour = TYPE_COLOURS[node.type];

  // Strip frontmatter from markdown for display
  const strippedMarkdown = nodeMarkdown?.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "") || null;

  // If viewing a full framework doc (standard/agent)
  if (activeDoc) {
    return (
      <div className="detail-panel open">
        <button className="close-btn" onClick={onClose}>{"\u00D7"}</button>
        <DocViewer doc={activeDoc} onBack={() => setActiveDoc(null)} />
      </div>
    );
  }

  // If viewing the full node document
  if (showFullDoc && strippedMarkdown) {
    return (
      <div className="detail-panel open">
        <button className="close-btn" onClick={onClose}>{"\u00D7"}</button>
        <div className="detail-doc-viewer">
          <button className="detail-back-btn" onClick={() => setShowFullDoc(false)}>{"< Back"}</button>
          <h3 className="detail-doc-viewer-title">{node.id} {node.name}</h3>
          <div className="detail-doc-content">{renderMarkdown(strippedMarkdown)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-panel open">
      <button className="close-btn" onClick={onClose}>{"\u00D7"}</button>

      {/* Node identity */}
      <div className="detail-header" style={{ borderLeftColor: colour }}>
        <div className="detail-id">{node.id}</div>
        <h2 className="detail-name">{node.name}</h2>
        <div className="detail-meta-row">
          <span className="detail-type-badge" style={{ background: colour }}>
            {TYPE_LABELS[node.type]}{node.level ? ` ${node.level}` : ""}
          </span>
          <span className={`detail-origin-badge ${originClass}`}>{originLabel}</span>
          {node.category && <span className="detail-category">{node.category}</span>}
        </div>
        {node.tags && node.tags.length > 0 && (
          <div className="detail-tags">
            {node.tags.map((tag) => (
              <span key={tag} className="detail-tag-chip">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Node content summary — first few sections from the actual document */}
      {strippedMarkdown && (
        <NodeContentSummary
          markdown={strippedMarkdown}
          onShowFull={() => setShowFullDoc(true)}
        />
      )}

      {/* Relationships */}
      <RelationshipList
        title="Upstream"
        edges={incoming}
        nodeNameMap={nodeNameMap}
        nodeTypeMap={nodeTypeMap}
        onNavigate={onNodeNavigate}
      />
      <RelationshipList
        title="Downstream"
        edges={outgoing}
        nodeNameMap={nodeNameMap}
        nodeTypeMap={nodeTypeMap}
        onNavigate={onNodeNavigate}
      />

      {/* Contextual concept reference */}
      {conceptDef && (
        <div className="detail-section detail-concept-ref">
          <h3>
            <span className="detail-concept-dot" style={{ background: colour }} />
            What is a {TYPE_LABELS[node.type]}?
          </h3>
          <div className="detail-concept-body">{renderMarkdown(conceptDef.markdown)}</div>
        </div>
      )}

      {/* Relevant standards */}
      {relevantStandards.length > 0 && (
        <div className="detail-section">
          <h3>Standards & Templates</h3>
          {relevantStandards.map((doc, idx) => (
            <DocCard key={idx} doc={doc} onOpen={setActiveDoc} />
          ))}
        </div>
      )}

      {/* Relevant agent */}
      {relevantAgents.length > 0 && (
        <div className="detail-section">
          <h3>Agent Skills</h3>
          {relevantAgents.map((doc, idx) => (
            <DocCard key={idx} doc={doc} onOpen={setActiveDoc} />
          ))}
        </div>
      )}
    </div>
  );
}
