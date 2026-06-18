import React from "react";

/**
 * Berg PC — Alert
 * Inline banner for guidance, warnings, and confirmations. Left accent
 * rule + tinted field. Icon passed by the caller (Lucide recommended).
 */
export function Alert({ tone = "info", title, icon = null, onClose, children, style }) {
  const tones = {
    info:    { bar: "var(--info-500)",    bg: "var(--info-100)",    fg: "var(--info-700)" },
    success: { bar: "var(--success-500)", bg: "var(--success-100)", fg: "var(--success-700)" },
    warning: { bar: "var(--warning-500)", bg: "var(--warning-100)", fg: "var(--warning-700)" },
    danger:  { bar: "var(--danger-500)",  bg: "var(--danger-100)",  fg: "var(--danger-700)" },
    neutral: { bar: "var(--ink-700)",     bg: "var(--ink-50)",      fg: "var(--ink-800)" },
  };
  const t = tones[tone];
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        gap: "12px",
        background: t.bg,
        borderLeft: `var(--border-rule) solid ${t.bar}`,
        borderRadius: "var(--radius-sm)",
        padding: "14px 16px",
        fontFamily: "var(--font-ui)",
        ...style,
      }}
    >
      {icon && <span style={{ color: t.bar, display: "flex", flex: "none", marginTop: 1 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontWeight: "var(--weight-semibold)", color: "var(--ink-900)", fontSize: "var(--text-sm)", marginBottom: children ? 3 : 0 }}>
            {title}
          </div>
        )}
        {children && <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-700)", lineHeight: 1.5 }}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button" aria-label="Dismiss" onClick={onClose}
          style={{ border: "none", background: "transparent", color: "var(--ink-400)", cursor: "pointer", padding: 0, lineHeight: 0, flex: "none" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
