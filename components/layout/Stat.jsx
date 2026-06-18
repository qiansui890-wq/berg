import React from "react";

/**
 * Berg PC — Stat
 * Headline metric for results & dashboards (e.g. "$500K recovered").
 * Serif value for editorial weight; optional delta and caption.
 */
export function Stat({ label, value, caption, delta, deltaTone = "success", align = "left", style }) {
  const tones = { success: "var(--success-700)", danger: "var(--danger-700)", neutral: "var(--ink-500)" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: align, ...style }}>
      {label && (
        <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-500)", whiteSpace: "nowrap" }}>
          {label}
        </span>
      )}
      <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
        {value}
      </span>
      <div style={{ display: "flex", gap: "8px", alignItems: "baseline", justifyContent: align === "center" ? "center" : "flex-start" }}>
        {delta && <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: 600, color: tones[deltaTone] }}>{delta}</span>}
        {caption && <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--ink-500)" }}>{caption}</span>}
      </div>
    </div>
  );
}
