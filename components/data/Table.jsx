import React from "react";

/**
 * Berg PC — Table
 * Config-driven data table. Columns: {key, label, align, width, render}.
 * Quiet hairline rows, uppercase header, hover highlight. For case lists,
 * wallet ledgers, document tables.
 */
export function Table({ columns = [], rows = [], rowKey = "id", onRowClick, dense = false, style }) {
  const cellY = dense ? "9px" : "13px";
  return (
    <div style={{ width: "100%", overflowX: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--white)", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-ui)" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: `11px 16px`,
                  fontSize: "var(--text-2xs)",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink-500)",
                  borderBottom: "1px solid var(--border-default)",
                  background: "var(--ink-50)",
                  whiteSpace: "nowrap",
                  width: c.width,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[rowKey] ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ cursor: onRowClick ? "pointer" : "default", transition: "background var(--duration-fast) var(--ease-standard)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align || "left",
                    padding: `${cellY} 16px`,
                    fontSize: "var(--text-sm)",
                    color: "var(--ink-700)",
                    borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border-subtle)",
                    verticalAlign: "middle",
                  }}
                >
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
