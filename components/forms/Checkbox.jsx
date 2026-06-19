import React from "react";

/** Berg PC — Checkbox. Squared check; ink-black when selected. */
export function Checkbox({ checked, defaultChecked, onChange, disabled = false, label, id, style }) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-sm)",
        color: "var(--ink-700)",
        lineHeight: 1.45,
        ...style,
      }}
    >
      <span style={{ position: "relative", flex: "none", marginTop: 1 }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", opacity: 0, width: 18, height: 18, margin: 0, cursor: "inherit" }}
        />
        <span
          aria-hidden="true"
          data-box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "var(--radius-xs)",
            border: `1.5px solid ${checked ? "var(--fill-ink)" : "var(--border-strong)"}`,
            background: checked ? "var(--fill-ink)" : "var(--white)",
            transition: "all var(--duration-fast) var(--ease-standard)",
          }}
        >
          {checked && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
