import React from "react";

/**
 * Berg PC — Card
 * The base surface: white, hairline border, restrained shadow.
 * `as` lets it render as a link/section. `interactive` adds hover lift.
 */
export function Card({ padding = "lg", interactive = false, as = "div", children, style, ...rest }) {
  const Tag = as;
  const pads = { none: 0, sm: "var(--space-4)", md: "var(--space-5)", lg: "var(--space-6)" };
  const [hover, setHover] = React.useState(false);
  return (
    <Tag
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
        padding: pads[padding],
        transition: "box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)",
        transform: hover ? "translateY(-2px)" : "none",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Optional card header: title + optional eyebrow and trailing slot. */
export function CardHeader({ eyebrow, title, trailing, style }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "var(--space-4)", ...style }}>
      <div>
        {eyebrow && (
          <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--stone-600)", marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        {title && <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.2 }}>{title}</div>}
      </div>
      {trailing}
    </div>
  );
}
