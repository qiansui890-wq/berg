import React from "react";

/**
 * Berg PC — Toast
 * Presentational notification card (white, left accent rule, icon + copy).
 * Caller controls mounting/positioning and dismissal.
 */
export function Toast({ tone = "neutral", title, icon = null, onClose, children, style }) {
  const bars = {
    neutral: "var(--ink-800)",
    success: "var(--success-500)",
    danger: "var(--danger-500)",
    warning: "var(--warning-500)",
    info: "var(--info-500)",
  };
  return (
    <div
      role="status"
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        width: 360,
        maxWidth: "calc(100vw - 32px)",
        background: "var(--white)",
        borderRadius: "var(--radius-md)",
        borderLeft: `var(--border-rule) solid ${bars[tone]}`,
        boxShadow: "var(--shadow-lg)",
        padding: "14px 15px",
        fontFamily: "var(--font-ui)",
        ...style,
      }}
    >
      {icon && <span style={{ color: bars[tone], display: "flex", flex: "none", marginTop: 1 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: "var(--weight-semibold)", color: "var(--ink-900)", fontSize: "var(--text-sm)" }}>{title}</div>}
        {children && <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-600)", lineHeight: 1.45, marginTop: title ? 2 : 0 }}>{children}</div>}
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
