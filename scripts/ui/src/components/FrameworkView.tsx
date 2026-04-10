import React, { useState } from "react";
import { TYPE_COLOURS } from "../constants";
import type { FrameworkReference, FrameworkDoc, Graph, GraphNode, NodeType } from "../types";

// ---------------------------------------------------------------------------
// Inline markdown renderer (shared with ReferencePanel)
// ---------------------------------------------------------------------------

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(
        <code key={match.index} className="fw-inline-code">
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      parts.push(
        <a key={match.index} href={match[9]} target="_blank" rel="noopener noreferrer" className="fw-link">
          {match[8]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}

function renderTable(lines: string[], key: string): React.ReactNode {
  const parseRow = (line: string): string[] =>
    line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
  const dataRows = lines.filter((l) => !l.replace(/[|:\-\s]/g, "").match(/^$/));
  if (dataRows.length === 0) return null;
  const headerCells = parseRow(dataRows[0]);
  const bodyRows = dataRows.slice(1).map(parseRow);

  return (
    <table key={key} className="fw-table">
      <thead>
        <tr>
          {headerCells.map((cell, ci) => (
            <th key={ci}>{renderInline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci}>{renderInline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderMarkdown(md: string): React.ReactNode {
  // Strip YAML frontmatter
  const clean = md.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  const lines = clean.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }

    // Code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={`code-${i}`} className="fw-code-block">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Heading
    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const level = hm[1].length;
      const Tag = `h${Math.min(level, 6)}` as keyof React.JSX.IntrinsicElements;
      const className = `fw-heading fw-h${level}`;
      elements.push(<Tag key={i} className={className}>{renderInline(hm[2])}</Tag>);
      i++; continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const ql: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) { ql.push(lines[i].slice(2)); i++; }
      elements.push(
        <blockquote key={`bq-${i}`} className="fw-blockquote">
          {ql.map((q, qi) => <span key={qi}>{renderInline(q)}<br /></span>)}
        </blockquote>
      );
      continue;
    }

    // Table
    if (line.includes("|") && line.trim().startsWith("|")) {
      const tl: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tl.push(lines[i]); i++; }
      elements.push(renderTable(tl, `tbl-${i}`));
      continue;
    }

    // List
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*[-*\d.]+\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="fw-list">
          {items.map((li, idx) => <li key={idx}>{renderInline(li)}</li>)}
        </ul>
      );
      continue;
    }

    // Paragraph
    elements.push(<p key={i} className="fw-paragraph">{renderInline(line)}</p>);
    i++;
  }
  return <>{elements}</>;
}

// ---------------------------------------------------------------------------
// Golden Thread visual component
// ---------------------------------------------------------------------------

const THREAD_STEPS: Array<{ key: string; label: string; desc: string }> = [
  { key: "outcome", label: "Outcome", desc: "A measurable strategic result. Why does this matter?" },
  { key: "platform", label: "Platform", desc: "A team-owned, boundary-defined, self-service unit of capability." },
  { key: "capability", label: "Capability", desc: "An enduring business ability provided by a Platform." },
  { key: "context", label: "Bounded Context", desc: "A linguistic boundary where a domain model is valid." },
  { key: "abb", label: "ABB", desc: "A logical, technology-agnostic architecture building block." },
  { key: "sbb", label: "SBB", desc: "A concrete product realising an ABB." },
];

function GoldenThread({ onSelect }: { onSelect: (key: string) => void }) {
  return (
    <div className="fw-golden-thread">
      <h2 className="fw-section-title">The Golden Thread</h2>
      <p className="fw-section-subtitle">
        Every artefact traces upward to a Strategic Outcome and downward to its realisation.
        Gaps are errors, not warnings.
      </p>
      <div className="fw-thread-chain">
        {THREAD_STEPS.map((step, i) => (
          <React.Fragment key={step.key}>
            <div
              className="fw-thread-node"
              onClick={() => onSelect(step.key)}
              style={{ borderColor: TYPE_COLOURS[step.key as NodeType] }}
            >
              <span
                className="fw-thread-dot"
                style={{ background: TYPE_COLOURS[step.key as NodeType] }}
              />
              <div className="fw-thread-content">
                <span className="fw-thread-label">{step.label}</span>
                <span className="fw-thread-desc">{step.desc}</span>
              </div>
            </div>
            {i < THREAD_STEPS.length - 1 && (
              <div className="fw-thread-connector">
                <svg width="2" height="24" viewBox="0 0 2 24">
                  <line x1="1" y1="0" x2="1" y2="24" stroke="#4a4e6a" strokeWidth="2" strokeDasharray="4 3" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Concept detail section
// ---------------------------------------------------------------------------

const CONCEPT_ORDER: string[] = ["outcome", "platform", "capability", "context", "abb", "sbb"];
const CONCEPT_LABELS: Record<string, string> = {
  outcome: "Outcome", platform: "Platform", context: "Bounded Context",
  capability: "Capability", abb: "Architecture Building Block (ABB)", sbb: "Solution Building Block (SBB)",
};

// ---------------------------------------------------------------------------
// Live node chips — show actual graph nodes for this concept type
// ---------------------------------------------------------------------------

function NodeChips({
  nodes,
  typeKey,
  onNodeClick,
}: {
  nodes: GraphNode[];
  typeKey: string;
  onNodeClick: (nodeId: string) => void;
}) {
  const filtered = nodes.filter((n) => n.type === typeKey);
  if (filtered.length === 0) return null;

  const colour = TYPE_COLOURS[typeKey as NodeType];
  const fwNodes = filtered.filter((n) => n.origin === "framework");
  const wsNodes = filtered.filter((n) => n.origin === "workspace");

  const renderChip = (n: GraphNode) => (
    <button
      key={n.id}
      className={`fw-node-chip${n.origin === "workspace" ? " workspace" : ""}`}
      style={{ borderColor: colour }}
      onClick={() => onNodeClick(n.id)}
      title={`${n.id} — ${n.name}`}
    >
      <span className="fw-node-chip-id">{n.id}</span>
      <span className="fw-node-chip-name">{n.name}</span>
      {n.level && <span className="fw-node-chip-level">{n.level}</span>}
    </button>
  );

  return (
    <div className="fw-concept-card-section">
      <h4 className="fw-card-subhead">
        Instances ({filtered.length})
        {wsNodes.length > 0 && (
          <span className="fw-card-subhead-ws"> — {wsNodes.length} workspace</span>
        )}
      </h4>
      <div className="fw-node-chips">
        {fwNodes.map(renderChip)}
        {wsNodes.map(renderChip)}
      </div>
    </div>
  );
}

interface ConceptSectionProps {
  typeKey: string;
  reference: FrameworkReference;
  graphNodes: GraphNode[];
  onOpenDoc: (doc: FrameworkDoc) => void;
  onNodeClick: (nodeId: string) => void;
  isActive: boolean;
}

function ConceptSection({ typeKey, reference, graphNodes, onOpenDoc, onNodeClick, isActive }: ConceptSectionProps) {
  const concept = reference.concepts[typeKey];
  if (!concept) return null;

  const standards = reference.standards.filter((d) => d.conceptType === typeKey);
  const agents = reference.agents.filter((d) => d.conceptType === typeKey);

  return (
    <div
      className={`fw-concept-card${isActive ? " active" : ""}`}
      id={`concept-${typeKey}`}
    >
      <div className="fw-concept-card-header">
        <span
          className="fw-concept-card-dot"
          style={{ background: TYPE_COLOURS[typeKey as NodeType] }}
        />
        <h3 className="fw-concept-card-title">{CONCEPT_LABELS[typeKey] || typeKey}</h3>
      </div>

      <div className="fw-concept-card-body">
        {renderMarkdown(concept.markdown)}
      </div>

      {/* Live nodes from the graph */}
      <NodeChips nodes={graphNodes} typeKey={typeKey} onNodeClick={onNodeClick} />

      {standards.length > 0 && (
        <div className="fw-concept-card-section">
          <h4 className="fw-card-subhead">Standards & Templates</h4>
          <div className="fw-doc-list">
            {standards.map((doc, idx) => (
              <button key={idx} className="fw-doc-item" onClick={() => onOpenDoc(doc)}>
                <span className="fw-doc-item-title">{doc.title}</span>
                <span className="fw-doc-item-cat">{doc.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {agents.length > 0 && (
        <div className="fw-concept-card-section">
          <h4 className="fw-card-subhead">Agent Skills</h4>
          <div className="fw-doc-list">
            {agents.map((doc, idx) => (
              <button key={idx} className="fw-doc-item agent" onClick={() => onOpenDoc(doc)}>
                <span className="fw-doc-item-icon">/</span>
                <span className="fw-doc-item-title">{doc.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Document viewer overlay
// ---------------------------------------------------------------------------

function DocOverlay({ doc, onClose }: { doc: FrameworkDoc; onClose: () => void }) {
  return (
    <div className="fw-doc-overlay">
      <div className="fw-doc-overlay-inner">
        <div className="fw-doc-overlay-header">
          <button className="fw-doc-overlay-back" onClick={onClose}>{"< Back to Framework"}</button>
          <span className="fw-doc-overlay-path">{doc.path}</span>
        </div>
        <div className="fw-doc-overlay-content">
          <h1 className="fw-doc-overlay-title">{doc.title}</h1>
          {renderMarkdown(doc.markdown)}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Framework View
// ---------------------------------------------------------------------------

interface FrameworkViewProps {
  reference: FrameworkReference | null;
  graphData: Graph | null;
  onSwitchToDAG: (focusNodeId?: string) => void;
}

export default function FrameworkView({ reference, graphData, onSwitchToDAG }: FrameworkViewProps) {
  const [activeDoc, setActiveDoc] = useState<FrameworkDoc | null>(null);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  const graphNodes = graphData?.nodes || [];

  if (!reference) {
    return (
      <div className="fw-view">
        <div className="loading">Loading framework reference...</div>
      </div>
    );
  }

  const handleConceptSelect = (key: string) => {
    setActiveConcept(key);
    const el = document.getElementById(`concept-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // General agents (no specific concept type, like FRAMEWORK_AGENTS.md)
  const generalAgents = reference.agents.filter((d) => !d.conceptType);

  return (
    <div className="fw-view">
      {/* Document overlay */}
      {activeDoc && <DocOverlay doc={activeDoc} onClose={() => setActiveDoc(null)} />}

      {/* Top bar */}
      <div className="fw-topbar">
        <h1 className="fw-topbar-title">AI-Assisted Architecture Framework</h1>
        <button className="fw-topbar-btn" onClick={onSwitchToDAG}>
          View DAG
        </button>
      </div>

      {/* Main content */}
      <div className="fw-content">
        {/* Hero section */}
        <div className="fw-hero">
          <p className="fw-hero-text">
            A framework combining TOGAF, DDD, Team Topologies, and Platform Engineering
            into a unified, AI-assisted architecture practice. Every artefact is traceable
            from strategic outcomes to runtime services.
          </p>
        </div>

        {/* Golden Thread */}
        <GoldenThread onSelect={handleConceptSelect} />

        {/* Conceptual Hierarchy table */}
        {reference.hierarchy && (
          <div className="fw-section">
            <h2 className="fw-section-title">Conceptual Hierarchy</h2>
            <div className="fw-hierarchy-table">
              {renderMarkdown(reference.hierarchy)}
            </div>
          </div>
        )}

        {/* Concept cards */}
        <div className="fw-section">
          <h2 className="fw-section-title">Concepts</h2>
          <p className="fw-section-subtitle">
            Click any concept to explore its definition, standards, and agent skills.
          </p>
          <div className="fw-concepts-grid">
            {CONCEPT_ORDER.map((key) => (
              <ConceptSection
                key={key}
                typeKey={key}
                reference={reference}
                graphNodes={graphNodes}
                onOpenDoc={setActiveDoc}
                onNodeClick={(nodeId) => onSwitchToDAG(nodeId)}
                isActive={activeConcept === key}
              />
            ))}
          </div>
        </div>

        {/* Traceability */}
        {reference.traceability && (
          <div className="fw-section">
            <h2 className="fw-section-title">Traceability Standard</h2>
            <p className="fw-section-subtitle">
              The Golden Thread is structural, not aspirational. Every artefact must trace
              upward to a Strategic Outcome and downward to its realisation.
            </p>
            <button
              className="fw-doc-item wide"
              onClick={() => setActiveDoc(reference.traceability!)}
            >
              <span className="fw-doc-item-title">{reference.traceability.title}</span>
              <span className="fw-doc-item-cat">standard</span>
            </button>
          </div>
        )}

        {/* Agent Skills overview */}
        {generalAgents.length > 0 && (
          <div className="fw-section">
            <h2 className="fw-section-title">Agent Configuration</h2>
            <p className="fw-section-subtitle">
              Discovery rules, precedence, and enforcement for all agent skills.
            </p>
            {generalAgents.map((doc, idx) => (
              <button
                key={idx}
                className="fw-doc-item wide"
                onClick={() => setActiveDoc(doc)}
              >
                <span className="fw-doc-item-title">{doc.title}</span>
                <span className="fw-doc-item-cat">agent</span>
              </button>
            ))}
          </div>
        )}

        {/* Articles */}
        {reference.articles.length > 0 && (
          <div className="fw-section">
            <h2 className="fw-section-title">Articles & Rationale</h2>
            <p className="fw-section-subtitle">
              Design decisions, trade-offs, and the reasoning behind the framework.
            </p>
            {reference.articles.map((doc, idx) => (
              <button
                key={idx}
                className="fw-doc-item wide"
                onClick={() => setActiveDoc(doc)}
              >
                <span className="fw-doc-item-title">{doc.title}</span>
                <span className="fw-doc-item-cat">article</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
