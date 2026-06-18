import React, { useState } from "react";

/**
 * Berg PC — Input
 * Squared text field with a quiet border that deepens to ink on focus,
 * plus a soft navy focus ring. Optional leading/trailing adornments.
 */
export function Input({
  size = "md",
  invalid = false,
  disabled = false,
  iconLeft = null,
  trailing = null,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const sizes = {
    sm: { padding: "8px 11px", fontSize: "var(--text-sm)" },
    md: { padding: "11px 13px", fontSize: "var(--text-base)" },
    lg: { padding: "14px 16px", fontSize: "var(--text-md)" },
  };
  const border = invalid ? "var(--danger-500)" : focus ? "var(--ink-900)" : "var(--border-default)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        background: disabled ? "var(--ink-50)" : "var(--white)",
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-sm)",
        boxShadow: focus ? "var(--focus-ring)" : "none",
        transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
        opacity: disabled ? 0.6 : 1,
        ...sizes[size],
        paddingTop: 0, paddingBottom: 0,
        ...style,
      }}
    >
      {iconLeft && <span style={{ display: "flex", color: "var(--ink-400)" }}>{iconLeft}</span>}
      <input
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-ui)",
          fontSize: "inherit",
          color: "var(--ink-900)",
          padding: sizes[size].padding,
          paddingLeft: 0, paddingRight: 0,
          minWidth: 0,
        }}
        {...rest}
      />
      {trailing && <span style={{ display: "flex", color: "var(--ink-400)" }}>{trailing}</span>}
    </div>
  );
}
