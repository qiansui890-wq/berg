import React from "react";

/**
 * Berg PC — Badge
 * Compact status label. Tones map to the semantic palette; "neutral"
 * and "accent" cover non-status uses. Subtle by default.
 */
export function Badge({ tone = "neutral", variant = "soft", size = "md", iconLeft = null, children, style }) {
  const tones = {
    neutral: { soft: ["var(--ink-100)", "var(--ink-700)"], solid: ["var(--ink-900)", "var(--cream)"] },
    accent:  { soft: ["var(--stone-100)", "var(--stone-700)"], solid: ["var(--stone-600)", "var(--cream)"] },
    success: { soft: ["var(--success-100)", "var(--success-700)"], solid: ["var(--success-500)", "#fff"] },
    danger:  { soft: ["var(--danger-100)", "var(--danger-700)"], solid: ["var(--danger-500)", "#fff"] },
    warning: { soft: ["var(--warning-100)", "var(--warning-700)"], solid: ["var(--warning-500)", "#fff"] },
    info:    { soft: ["var(--info-100)", "var(--info-700)"], solid: ["var(--info-500)", "#fff"] },
  };
  const [bg, fg] = tones[tone][variant];
  const sizes = {
    sm: { padding: "2px 8px", fontSize: "var(--text-2xs)" },
    md: { padding: "3px 10px", fontSize: "var(--text-xs)" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: bg,
        color: fg,
        fontFamily: "var(--font-ui)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "0.03em",
        borderRadius: "var(--radius-sm)",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        ...sizes[size],
        ...style,
      }}
    >
      {iconLeft}
      {children}
    </span>
  );
}
