import React, { useState } from "react";

/** Berg PC — Textarea. Multi-line field matching Input's focus treatment. */
export function Textarea({ invalid = false, disabled = false, rows = 4, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const border = invalid ? "var(--danger-500)" : focus ? "var(--ink-900)" : "var(--border-default)";
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: "100%",
        resize: "vertical",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-base)",
        lineHeight: 1.55,
        color: "var(--ink-900)",
        background: disabled ? "var(--ink-50)" : "var(--white)",
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-sm)",
        boxShadow: focus ? "var(--focus-ring)" : "none",
        padding: "11px 13px",
        outline: "none",
        transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
        ...style,
      }}
      {...rest}
    />
  );
}
