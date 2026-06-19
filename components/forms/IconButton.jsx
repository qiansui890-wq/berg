import React from "react";

/**
 * Berg PC — IconButton
 * Square/round icon-only control for toolbars, table rows, dialog close.
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  shape = "square",
  disabled = false,
  label,
  children,
  style,
  ...rest
}) {
  const dims = { sm: 30, md: 38, lg: 44 };
  const variants = {
    ghost:   { background: "transparent",     color: "var(--ink-700)",  border: "1px solid transparent" },
    outline: { background: "var(--white)",     color: "var(--ink-800)",  border: "1px solid var(--border-default)" },
    solid:   { background: "var(--fill-ink)",   color: "var(--cream)",    border: "1px solid var(--fill-ink)" },
  };
  const d = dims[size];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: d,
        height: d,
        borderRadius: shape === "round" ? "var(--radius-pill)" : "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "ghost") e.currentTarget.style.background = "var(--ink-100)";
        if (variant === "outline") e.currentTarget.style.borderColor = "var(--fill-ink)";
        if (variant === "solid") e.currentTarget.style.background = "var(--fill-ink-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.borderColor = variants[variant].border.split(" ").pop();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
