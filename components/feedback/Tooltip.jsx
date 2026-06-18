import React, { useState } from "react";

/** Berg PC — Tooltip. Ink bubble on hover/focus. CSS-positioned, four sides. */
export function Tooltip({ label, side = "top", children, style }) {
  const [open, setOpen] = useState(false);
  const pos = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };
  return (
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: "absolute",
          ...pos[side],
          background: "var(--ink-900)",
          color: "var(--cream)",
          fontFamily: "var(--font-ui)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-medium)",
          lineHeight: 1.4,
          padding: "6px 9px",
          borderRadius: "var(--radius-sm)",
          whiteSpace: "nowrap",
          boxShadow: "var(--shadow-md)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "opacity var(--duration-fast) var(--ease-standard)",
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {label}
      </span>
    </span>
  );
}
