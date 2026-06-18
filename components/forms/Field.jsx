import React from "react";

/**
 * Berg PC — Field
 * Label + optional required mark, hint, and error message wrapper.
 * Wrap any control (Input, Textarea, Select, etc.).
 */
export function Field({ label, htmlFor, required = false, hint, error, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--ink-800)",
            letterSpacing: "0.01em",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--danger-500)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
