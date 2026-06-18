import React from "react";

/**
 * Berg PC — Button
 * Primary is ink-black (matches the firm's mark); accent is warm stone;
 * secondary is outlined; ghost is quiet; danger for destructive actions.
 * Corners are restrained (radius-sm) — legal, not playful.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "7px 14px", fontSize: "var(--text-sm)", gap: "7px" },
    md: { padding: "11px 22px", fontSize: "var(--text-base)", gap: "9px" },
    lg: { padding: "15px 30px", fontSize: "var(--text-md)", gap: "11px" },
  };

  const variants = {
    primary:   { background: "var(--primary)",       color: "var(--cream)",      border: "1px solid var(--primary)" },
    accent:    { background: "var(--accent-strong)",  color: "var(--cream)",      border: "1px solid var(--accent-strong)" },
    secondary: { background: "transparent",           color: "var(--ink-900)",    border: "1px solid var(--border-strong)" },
    ghost:     { background: "transparent",           color: "var(--ink-800)",    border: "1px solid transparent" },
    danger:    { background: "var(--danger-500)",     color: "#fff",              border: "1px solid var(--danger-500)" },
  };

  const hover = {
    primary: "var(--primary-hover)",
    accent: "var(--accent-deep)",
    danger: "var(--danger-700)",
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-ui)",
    fontWeight: "var(--weight-semibold)",
    lineHeight: 1,
    letterSpacing: "0.01em",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    width: fullWidth ? "100%" : "auto",
    transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
    whiteSpace: "nowrap",
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={base}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (hover[variant]) e.currentTarget.style.background = hover[variant];
        if (variant === "secondary") { e.currentTarget.style.borderColor = "var(--ink-900)"; e.currentTarget.style.background = "var(--ink-50)"; }
        if (variant === "ghost") e.currentTarget.style.background = "var(--ink-100)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.borderColor = variants[variant].border.split(" ").pop();
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(1px)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
