import React, { useState } from "react";

/** Berg PC — Select. Native select styled to match Input, with a chevron. */
export function Select({ size = "md", invalid = false, disabled = false, children, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const sizes = {
    sm: { padding: "8px 34px 8px 11px", fontSize: "var(--text-sm)" },
    md: { padding: "11px 38px 11px 13px", fontSize: "var(--text-base)" },
    lg: { padding: "14px 40px 14px 16px", fontSize: "var(--text-md)" },
  };
  const border = invalid ? "var(--danger-500)" : focus ? "var(--ink-900)" : "var(--border-default)";
  return (
    <div style={{ position: "relative", display: "inline-flex", width: "100%", ...style }}>
      <select
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          fontFamily: "var(--font-ui)",
          color: "var(--ink-900)",
          background: disabled ? "var(--ink-50)" : "var(--white)",
          border: `1px solid ${border}`,
          borderRadius: "var(--radius-sm)",
          boxShadow: focus ? "var(--focus-ring)" : "none",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
          ...sizes[size],
        }}
        {...rest}
      >
        {children}
      </select>
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="var(--ink-500)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
