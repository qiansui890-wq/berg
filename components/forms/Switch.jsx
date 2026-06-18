import React from "react";

/** Berg PC — Switch. Toggle for settings; ink-black track when on. */
export function Switch({ checked = false, onChange, disabled = false, label, id, style }) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "11px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-sm)",
        color: "var(--ink-700)",
        ...style,
      }}
    >
      <span style={{ position: "relative", display: "inline-block" }}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", opacity: 0, width: 40, height: 22, margin: 0, cursor: "inherit" }}
        />
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: 40,
            height: 22,
            borderRadius: "var(--radius-pill)",
            background: checked ? "var(--ink-900)" : "var(--ink-300)",
            transition: "background var(--duration-base) var(--ease-standard)",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "var(--radius-pill)",
            background: "var(--white)",
            boxShadow: "var(--shadow-sm)",
            transition: "left var(--duration-base) var(--ease-out)",
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
