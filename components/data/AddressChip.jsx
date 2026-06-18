import React, { useState } from "react";

/**
 * Berg PC — AddressChip
 * Forensic wallet/transaction string in mono, middle-truncated, with a
 * one-click copy affordance. Optional role dot from the trace palette.
 */
export function AddressChip({ address, role, lead = 6, tail = 4, copyable = true, style }) {
  const [copied, setCopied] = useState(false);
  const short = address && address.length > lead + tail + 1
    ? `${address.slice(0, lead)}…${address.slice(-tail)}`
    : address;
  const roleColor = {
    tainted: "var(--trace-tainted)",
    hop: "var(--trace-hop)",
    exchange: "var(--trace-exchange)",
    mixer: "var(--trace-mixer)",
    frozen: "var(--trace-frozen)",
  }[role];

  const copy = () => {
    try { navigator.clipboard.writeText(address); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "var(--ink-50)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-sm)",
        padding: "4px 8px",
        fontFamily: "var(--font-data)",
        fontSize: "var(--text-sm)",
        color: "var(--ink-800)",
        ...style,
      }}
    >
      {role && <span style={{ width: 8, height: 8, borderRadius: "50%", background: roleColor, flex: "none" }} title={role} />}
      <span style={{ letterSpacing: "0.01em" }}>{short}</span>
      {copyable && (
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy address"}
          onClick={copy}
          style={{ border: "none", background: "transparent", cursor: "pointer", color: copied ? "var(--success-500)" : "var(--ink-400)", padding: 0, lineHeight: 0, display: "flex" }}
          onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "var(--ink-900)"; }}
          onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "var(--ink-400)"; }}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          )}
        </button>
      )}
    </span>
  );
}
