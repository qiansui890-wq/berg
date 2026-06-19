import React from "react";

/**
 * Berg PC — EmptyState
 * Centered placeholder for empty tables, searches, inboxes, and dashboards.
 * icon = ReactNode (e.g. a Lucide <i>), title, description, action = ReactNode.
 */
export function EmptyState({ icon, title = "Nothing here yet", description, action, style }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "48px 28px", fontFamily: "var(--font-ui)", ...style,
    }}>
      {icon ? (
        <div style={{
          width: 52, height: 52, borderRadius: "var(--radius-lg)",
          background: "var(--stone-100)", border: "1px solid var(--border-subtle)",
          color: "var(--stone-600)", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>{icon}</div>
      ) : null}
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: "var(--weight-semibold)", color: "var(--ink-900)", letterSpacing: "-0.01em" }}>{title}</div>
      {description ? (
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-500)", margin: "8px 0 0", maxWidth: 360 }}>{description}</p>
      ) : null}
      {action ? <div style={{ marginTop: 20 }}>{action}</div> : null}
    </div>
  );
}
