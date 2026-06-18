import React from "react";

/**
 * Berg PC — Tabs
 * Underlined tab bar with an ink active indicator. Controlled.
 * items: [{ id, label, icon? }]
 */
export function Tabs({ items = [], value, onChange, style }) {
  return (
    <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--border-default)", ...style }}>
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange && onChange(it.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-sm)",
              fontWeight: active ? 600 : 500,
              color: active ? "var(--ink-900)" : "var(--ink-500)",
              padding: "11px 14px",
              marginBottom: -1,
              borderBottom: `2px solid ${active ? "var(--ink-900)" : "transparent"}`,
              transition: "color var(--duration-fast) var(--ease-standard)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--ink-800)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--ink-500)"; }}
          >
            {it.icon}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
