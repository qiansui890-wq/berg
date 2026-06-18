import React from "react";

/** Berg PC — Tag. Outlined label, optionally removable (filters, selected platforms). */
export function Tag({ children, onRemove, iconLeft = null, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        background: "var(--white)",
        color: "var(--ink-700)",
        border: "1px solid var(--border-default)",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)",
        borderRadius: "var(--radius-sm)",
        padding: "4px 10px",
        lineHeight: 1.4,
        ...style,
      }}
    >
      {iconLeft}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            color: "var(--ink-400)",
            cursor: "pointer",
            padding: 0,
            margin: "0 -2px 0 0",
            lineHeight: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-900)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-400)")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
}
