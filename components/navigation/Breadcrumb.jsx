import React from "react";

/**
 * Berg PC — Breadcrumb
 * Hierarchy trail. items: [{ label, href? }]. The last item is the current
 * page (ink, non-link). Separator is a thin stone chevron.
 */
export function Breadcrumb({ items = [], style }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 7, fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", ...style }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last || !it.href ? (
              <span style={{ color: last ? "var(--ink-900)" : "var(--ink-500)", fontWeight: last ? "var(--weight-semibold)" : "var(--weight-medium)" }} aria-current={last ? "page" : undefined}>{it.label}</span>
            ) : (
              <a href={it.href} style={{ color: "var(--ink-500)", textDecoration: "none", fontWeight: "var(--weight-medium)", transition: "color var(--duration-fast) var(--ease-standard)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy-700)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-500)")}>{it.label}</a>
            )}
            {!last && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--stone-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><polyline points="9 18 15 12 9 6" /></svg>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
