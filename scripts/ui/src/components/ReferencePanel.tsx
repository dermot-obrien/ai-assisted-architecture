import React, { useState } from "react";
import { TYPE_COLOURS } from "../constants";
import type { FrameworkReference, FrameworkDoc, NodeType } from "../types";

interface ReferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: FrameworkReference | null;
  highlightedType: NodeType | null;
  onConceptClick: (typeKey: string) => void;
}

// ---------------------------------------------------------------------------
// Markdown renderer
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
        <code key={match.index} className="ref-inline-code">
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      parts.push(
        <a key={match.index} href={match[9]} target="_blank" rel="noopener noreferrer" className="ref-link">
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
    <table key={key} className="ref-table">
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
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }

    // Heading
    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const level = hm[1].length;
      const Tag = `h${Math.min(level + 2, 6)}` as keyof React.JSX.IntrinsicElements;
      elements.push(<Tag key={i} style={{ margin: "8px 0 4px", fontSize: `${14 - level}px` }}>{renderInline(hm[2])}</Tag>);
      i++; continue;
    }

    // Blockquote
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
        <ul key={`ul-${i}`} className="ref-list">
          {items.map((li, idx) => <li key={idx}>{renderInline(li)}</li>)}
        </ul>
      );
      continue;
    }

    // Paragraph
    elements.push(<p key={i} className="ref-paragraph">{renderInline(line)}</p>);
    i++;
  }
  return <>{elements}</>;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StandardItem({ doc, onSelect }: { doc: FrameworkDoc; onSelect: (doc: FrameworkDoc) => void }) {
  return (
    <div className="ref-standard-item" onClick={() => onSelect(doc)}>
      <span className="ref-standard-title">{doc.title}</span>
      <span className="ref-standard-category">{doc.category}</span>
    </div>
  );
}

function DocViewer({ doc, onBack }: { doc: FrameworkDoc; onBack: () => void }) {
  // Strip YAML frontmatter for display
  const content = doc.markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  return (
    <div className="ref-doc-viewer">
      <button className="ref-back-btn" onClick={onBack}>{"< Back"}</button>
      <h3 className="ref-doc-title">{doc.title}</h3>
      <span className="ref-doc-path">{doc.path}</span>
      <div className="ref-doc-content">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Concept type ordering (matches the Golden Thread)
// ---------------------------------------------------------------------------
const CONCEPT_ORDER: string[] = ["outcome", "platform", "context", "capability", "abb", "sbb"];
const CONCEPT_LABELS: Record<string, string> = {
  outcome: "Outcome", platform: "Platform", context: "Bounded Context",
  capability: "Capability", abb: "ABB", sbb: "SBB",
};

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export default function ReferencePanel({
  isOpen,
  onClose,
  concepts,
  highlightedType,
  onConceptClick,
}: ReferencePanelProps) {
  const [activeDoc, setActiveDoc] = useState<FrameworkDoc | null>(null);
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  if (!concepts) return null;

  // Group standards by concept type
  const standardsByType: Record<string, FrameworkDoc[]> = {};
  for (const doc of concepts.standards) {
    const key = doc.conceptType || "other";
    if (!standardsByType[key]) standardsByType[key] = [];
    standardsByType[key].push(doc);
  }

  // If viewing a full document
  if (activeDoc) {
    return (
      <div className={`reference-panel ${isOpen ? "open" : ""}`}>
        <div className="ref-header">
          <h2>Framework Reference</h2>
          <button className="close-btn" onClick={onClose}>{"\u00D7"}</button>
        </div>
        <div className="ref-body">
          <DocViewer doc={activeDoc} onBack={() => setActiveDoc(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className={`reference-panel ${isOpen ? "open" : ""}`}>
      <div className="ref-header">
        <h2>Framework Reference</h2>
        <button className="close-btn" onClick={onClose}>{"\u00D7"}</button>
      </div>
      <div className="ref-body">
        {/* Hierarchy table */}
        {concepts.hierarchy && (
          <div className="ref-section">
            <h3 className="ref-section-title">The Conceptual Hierarchy</h3>
            {renderMarkdown(concepts.hierarchy)}
          </div>
        )}

        {/* Concepts + their standards, organized by type */}
        {CONCEPT_ORDER.map((typeKey) => {
          const concept = concepts.concepts[typeKey];
          if (!concept) return null;
          const standards = standardsByType[typeKey] || [];
          const isExpanded = expandedConcept === typeKey;

          return (
            <div
              key={typeKey}
              className={`ref-concept-section${highlightedType === typeKey ? " highlighted" : ""}`}
            >
              {/* Concept header — click to highlight in graph */}
              <div
                className="ref-concept-header"
                onClick={() => onConceptClick(typeKey)}
              >
                <span
                  className="ref-concept-dot"
                  style={{ background: TYPE_COLOURS[typeKey as NodeType] || "var(--text)" }}
                />
                <span className="ref-concept-label">
                  {CONCEPT_LABELS[typeKey] || typeKey}
                </span>
                <span className="ref-concept-hint">click to highlight</span>
              </div>

              {/* Concept definition (always visible) */}
              <div className="ref-concept-def">
                {renderMarkdown(concept.markdown)}
              </div>

              {/* Standards toggle */}
              {standards.length > 0 && (
                <div className="ref-standards-section">
                  <button
                    className="ref-standards-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedConcept(isExpanded ? null : typeKey);
                    }}
                  >
                    {isExpanded ? "\u25BC" : "\u25B6"} {standards.length} standard{standards.length > 1 ? "s" : ""} & template{standards.length > 1 ? "s" : ""}
                  </button>
                  {isExpanded && (
                    <div className="ref-standards-list">
                      {standards.map((doc, idx) => (
                        <StandardItem key={idx} doc={doc} onSelect={setActiveDoc} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Traceability */}
        {concepts.traceability && (
          <div className="ref-section">
            <h3 className="ref-section-title">Traceability & Golden Thread</h3>
            <StandardItem doc={concepts.traceability} onSelect={setActiveDoc} />
          </div>
        )}

        {/* Articles */}
        {concepts.articles && concepts.articles.length > 0 && (
          <div className="ref-section">
            <h3 className="ref-section-title">Articles & Rationale</h3>
            {concepts.articles.map((doc, idx) => (
              <StandardItem key={idx} doc={doc} onSelect={setActiveDoc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
