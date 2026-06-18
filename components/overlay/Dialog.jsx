import React from "react";

/**
 * Berg PC — Dialog
 * Centered modal over a navy scrim. Title, optional description, body,
 * and a footer slot for actions. Controlled via `open`/`onClose`.
 */
export function Dialog({ open, onClose, title, description, footer, width = 480, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "color-mix(in oklch, var(--navy-950) 60%, transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 100,
        animation: "berg-fade var(--duration-base) var(--ease-out)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "100%",
          maxHeight: "calc(100vh - 48px)",
          overflow: "auto",
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          animation: "berg-rise var(--duration-base) var(--ease-out)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", padding: "22px 24px 0" }}>
          <div>
            {title && <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--ink-900)", margin: 0, lineHeight: 1.2 }}>{title}</h2>}
            {description && <p style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--ink-500)", margin: "6px 0 0", lineHeight: 1.5 }}>{description}</p>}
          </div>
          <button
            type="button" aria-label="Close" onClick={onClose}
            style={{ border: "none", background: "transparent", color: "var(--ink-400)", cursor: "pointer", padding: 4, margin: -4, lineHeight: 0, flex: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-900)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-400)")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: "16px 24px", fontFamily: "var(--font-ui)", fontSize: "var(--text-base)", color: "var(--ink-700)", lineHeight: 1.55 }}>
          {children}
        </div>
        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "0 24px 22px" }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes berg-fade{from{opacity:0}to{opacity:1}}@keyframes berg-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
