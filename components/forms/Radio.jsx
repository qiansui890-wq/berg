import React from "react";

/** Berg PC — Radio. Round selector with ink-black dot. */
export function Radio({ checked, name, value, onChange, disabled = false, label, id, style }) {
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
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", opacity: 0, width: 18, height: 18, margin: 0, cursor: "inherit" }}
        />
        <span
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "var(--radius-pill)",
            border: `1.5px solid ${checked ? "var(--ink-900)" : "var(--border-strong)"}`,
            background: "var(--white)",
            transition: "all var(--duration-fast) var(--ease-standard)",
          }}
        >
          {checked && <span style={{ width: 9, height: 9, borderRadius: "var(--radius-pill)", background: "var(--ink-900)" }} />}
        </span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
