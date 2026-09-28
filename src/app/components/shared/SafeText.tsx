import { useState } from "react";
import { useTranslation } from "react-i18next";

// ── SafeText ──────────────────────────────────────────────────────────────────
// Compact, layout-safe text rendering. Use for table cells, labels, badges.

interface SafeTextProps {
  value: unknown;
  fallback?: string;
  mode?: "truncate" | "wrap" | "break";
  lines?: 1 | 2 | 3 | 4;
  className?: string;
  title?: string;
  as?: "span" | "p" | "div";
}

export function SafeText({
  value,
  fallback = "—",
  mode = "truncate",
  lines,
  className = "",
  title: titleProp,
  as: Tag = "span",
}: SafeTextProps) {
  const text = (value === null || value === undefined || value === "")
    ? fallback
    : String(value);

  const modeClass = `safe-text--${mode}`;
  const blockClass = Tag !== "span" ? "safe-text--block" : "";
  const lineClamp = lines && mode !== "truncate"
    ? { WebkitLineClamp: lines, display: "-webkit-box", WebkitBoxOrient: "vertical" as const, overflow: "hidden" }
    : undefined;

  return (
    <Tag
      className={["safe-text", modeClass, blockClass, className].filter(Boolean).join(" ")}
      title={mode === "truncate" ? (titleProp ?? (text !== fallback ? text : undefined)) : titleProp}
      style={lineClamp}
    >
      {text}
    </Tag>
  );
}

// ── ExpandableText ────────────────────────────────────────────────────────────
// For detail areas: collapses long text with "See more / See less" toggle.

interface ExpandableTextProps {
  value: unknown;
  fallback?: string;
  maxChars?: number;
  collapsedLines?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  buttonClassName?: string;
  as?: "p" | "div" | "span";
  preserveLineBreaks?: boolean;
  mode?: "block" | "inline";
}

export function ExpandableText({
  value,
  fallback = "—",
  maxChars = 160,
  collapsedLines = 3,
  className = "",
  buttonClassName = "",
  as: Tag = "div",
  preserveLineBreaks = false,
  mode = "block",
}: ExpandableTextProps) {
  const { t: tc } = useTranslation("common");
  const [expanded, setExpanded] = useState(false);

  const text = (value === null || value === undefined || value === "")
    ? fallback
    : String(value);

  const isLong = text.length > maxChars;
  const modeClass = `expandable-text--${mode}`;

  if (!isLong) {
    return (
      <Tag
        className={["expandable-text", modeClass, className].filter(Boolean).join(" ")}
        style={preserveLineBreaks ? { whiteSpace: "pre-wrap" } : undefined}
      >
        <span className="expandable-text__content expandable-text__content--expanded">{text}</span>
      </Tag>
    );
  }

  const collapsedStyle: React.CSSProperties = expanded
    ? {}
    : { WebkitLineClamp: collapsedLines, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" };

  return (
    <Tag className={["expandable-text", modeClass, className].filter(Boolean).join(" ")}>
      <span
        className={["expandable-text__content", expanded ? "expandable-text__content--expanded" : "expandable-text__content--collapsed"].filter(Boolean).join(" ")}
        style={preserveLineBreaks ? { ...collapsedStyle, whiteSpace: "pre-wrap" } : collapsedStyle}
      >
        {text}
      </span>
      <button
        type="button"
        className={["expandable-text__toggle", buttonClassName].filter(Boolean).join(" ")}
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        aria-expanded={expanded}
      >
        {expanded ? tc("actions.seeLess") : tc("actions.seeMore")}
      </button>
    </Tag>
  );
}
