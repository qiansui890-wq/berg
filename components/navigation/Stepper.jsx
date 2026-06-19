import React from "react";

/**
 * Berg PC — Stepper
 * Horizontal progress through case stages (e.g. Intake → Investigating →
 * Filed → Frozen → Recovered, or the trace → identify → freeze → recover flow).
 * steps: array of strings OR { label, sub? } objects. current = 0-based index.
 */
export function Stepper({ steps = [], current = 0, style }) {
  const items = steps.map((s) => (typeof s === "string" ? { label: s } : s));
  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%", fontFamily: "var(--font-ui)", ...style }}>
      {items.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === items.length - 1;
        const dotBg = done ? "var(--fill-ink)" : active ? "var(--surface-card)" : "var(--surface-card)";
        const dotBorder = done ? "var(--fill-ink)" : active ? "var(--stone-500)" : "var(--border-default)";
        const dotFg = done ? "var(--cream)" : active ? "var(--text-strong)" : "var(--text-subtle)";
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: last ? "0 0 auto" : "1 1 0", minWidth: 0, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <div style={{ flex: 1, height: 2, background: i === 0 ? "transparent" : (done || active ? "var(--text-strong)" : "var(--border-default)") }} />
              <div style={{
                flex: "none", width: 28, height: 28, borderRadius: "var(--radius-pill)",
                background: dotBg, border: `2px solid ${dotBorder}`, color: dotFg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12.5, fontWeight: "var(--weight-semibold)",
                boxShadow: active ? "0 0 0 4px color-mix(in oklch, var(--stone-500) 16%, transparent)" : "none",
                transition: "all var(--duration-fast) var(--ease-standard)",
              }}>
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (i + 1)}
              </div>
              <div style={{ flex: 1, height: 2, background: last ? "transparent" : (done ? "var(--ink-900)" : "var(--border-default)") }} />
            </div>
            <div style={{ marginTop: 8, textAlign: "center", padding: "0 6px" }}>
              <div style={{ fontSize: 12.5, fontWeight: active || done ? "var(--weight-semibold)" : "var(--weight-medium)", color: active ? "var(--ink-900)" : done ? "var(--ink-700)" : "var(--ink-400)", letterSpacing: "0.01em" }}>{s.label}</div>
              {s.sub ? <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 2 }}>{s.sub}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
