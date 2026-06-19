import React from "react";

/**
 * Berg PC — Pagination
 * Prev / numbered pages with ellipsis / Next. Controlled.
 * page = 1-based current; pageCount = total pages; onChange(nextPage).
 */
export function Pagination({ page = 1, pageCount = 1, onChange, siblingCount = 1, style }) {
  const go = (p) => { if (p >= 1 && p <= pageCount && p !== page && onChange) onChange(p); };

  // build the page list with ellipses
  const pages = [];
  const range = (a, b) => { for (let i = a; i <= b; i++) pages.push(i); };
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(pageCount - 1, page + siblingCount);
  pages.push(1);
  if (left > 2) pages.push("…l");
  range(left, right);
  if (right < pageCount - 1) pages.push("…r");
  if (pageCount > 1) pages.push(pageCount);

  const base = {
    minWidth: 34, height: 34, padding: "0 8px", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-default)", background: "var(--white)",
    fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: "var(--weight-medium)",
    color: "var(--ink-700)", cursor: "pointer", display: "inline-flex",
    alignItems: "center", justifyContent: "center",
    transition: "all var(--duration-fast) var(--ease-standard)",
  };
  const Arrow = ({ dir, disabled }) => (
    <button type="button" onClick={() => go(page + (dir === "next" ? 1 : -1))} disabled={disabled} aria-label={dir === "next" ? "Next page" : "Previous page"}
      style={{ ...base, color: disabled ? "var(--ink-300)" : "var(--ink-700)", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "next" ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
      </svg>
    </button>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, ...style }}>
      <Arrow dir="prev" disabled={page <= 1} />
      {pages.map((p, i) =>
        typeof p === "string" ? (
          <span key={p + i} style={{ minWidth: 22, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 13.5 }}>…</span>
        ) : (
          <button key={p} type="button" onClick={() => go(p)} aria-current={p === page ? "page" : undefined}
            style={{ ...base,
              background: p === page ? "var(--fill-ink)" : "var(--white)",
              borderColor: p === page ? "var(--fill-ink)" : "var(--border-default)",
              color: p === page ? "var(--cream)" : "var(--ink-700)",
              fontWeight: p === page ? "var(--weight-semibold)" : "var(--weight-medium)" }}>
            {p}
          </button>
        )
      )}
      <Arrow dir="next" disabled={page >= pageCount} />
    </div>
  );
}
