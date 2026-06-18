/* Berg PC Platform — interactive trace graph. Exports window.BergTraceI */
const { Ico: TIco, refreshIcons: tRefresh } = window.BergUI;
const DST = window.BergPCDesignSystem_eb13e3;
const { AddressChip: TAddr, Badge: TBadge, Button: TBtn, Stat: TStat } = DST;

const ROLE_COLOR = { tainted: "#BC3B2C", hop: "#8A7B66", exchange: "#2E76A6", mixer: "#6B4E8C", frozen: "#2F8A57" };
const ROLE_FILL = { tainted: "#F4DFDB", hop: "#EDE7DC", exchange: "#DBE9F3", mixer: "#E6DEF0", frozen: "#DCEEE4" };
const ROLE_LABEL = { tainted: "Tainted origin", hop: "Pass-through", exchange: "Exchange / off-ramp", mixer: "Mixer", frozen: "Frozen" };

/* derive a layered layout from a wallet list */
function layout(wallets) {
  const cols = { tainted: 0, hop: 1, mixer: 2, exchange: 2, frozen: 3 };
  const buckets = {};
  wallets.forEach((w) => { const c = cols[w.role] ?? 1; (buckets[c] = buckets[c] || []).push(w); });
  const nodes = [];
  Object.keys(buckets).sort().forEach((c) => {
    const arr = buckets[c]; const n = arr.length;
    arr.forEach((w, i) => {
      nodes.push({ ...w, x: 40 + Number(c) * 185, y: 40 + (i - (n - 1) / 2) * 96 + 150 });
    });
  });
  return nodes;
}
function edgesFrom(nodes) {
  // connect each node to the nearest node in the next column
  const byCol = {};
  nodes.forEach((n) => { const c = Math.round((n.x - 40) / 185); (byCol[c] = byCol[c] || []).push(n); });
  const es = [];
  Object.keys(byCol).map(Number).sort((a, b) => a - b).forEach((c) => {
    const next = byCol[c + 1]; if (!next) return;
    byCol[c].forEach((n, i) => { const t = next[Math.min(i, next.length - 1)]; if (t) es.push([n, t]); });
  });
  return es;
}

function TraceGraph({ wallets, selected, onSelect, height = 420 }) {
  tRefresh();
  const nodes = React.useMemo(() => layout(wallets), [wallets]);
  const edges = React.useMemo(() => edgesFrom(nodes), [nodes]);
  const NW = 150, NH = 60;
  const maxX = Math.max(360, ...nodes.map((n) => n.x + NW + 40));
  const cy = (n) => n.y + NH / 2;
  if (!wallets.length) return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)" }}><TIco n="git-branch" s={28} /><div style={{ marginTop: 10 }}>No wallet data yet — add addresses in the “Wallets” tab to build the fund-flow graph.</div></div>;
  return (
    <div style={{ width: "100%", overflowX: "auto", background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
      <svg viewBox={`0 0 ${maxX} ${height}`} width="100%" style={{ display: "block", minWidth: maxX }}>
        <defs>
          <marker id="ti-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-300)" /></marker>
          <pattern id="ti-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="var(--ink-50)" strokeWidth="1" /></pattern>
        </defs>
        <rect x="0" y="0" width={maxX} height={height} fill="url(#ti-grid)" />
        {edges.map(([a, b], i) => {
          const x1 = a.x + NW, y1 = cy(a), x2 = b.x, y2 = cy(b), mx = (x1 + x2) / 2;
          return <path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke="var(--ink-300)" strokeWidth="1.8" markerEnd="url(#ti-arrow)" />;
        })}
        {nodes.map((n) => {
          const on = selected === n.addr;
          return (
            <g key={n.addr} style={{ cursor: "pointer" }} onClick={() => onSelect(n.addr)}>
              <rect x={n.x} y={n.y} width={NW} height={NH} rx="9" fill={ROLE_FILL[n.role]} stroke={ROLE_COLOR[n.role]} strokeWidth={on ? 3 : 1.5} />
              {on && <rect x={n.x - 4} y={n.y - 4} width={NW + 8} height={NH + 8} rx="12" fill="none" stroke={ROLE_COLOR[n.role]} strokeWidth="1.4" strokeDasharray="4 3" opacity="0.6" />}
              <circle cx={n.x + 14} cy={n.y + 16} r="4.5" fill={ROLE_COLOR[n.role]} />
              <text x={n.x + 26} y={n.y + 20} fontFamily="var(--font-ui)" fontSize="12" fontWeight="600" fill="var(--ink-900)">{n.label || ROLE_LABEL[n.role]}</text>
              <text x={n.x + 13} y={n.y + 37} fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--ink-600)">{n.addr.slice(0, 10)}…{n.addr.slice(-4)}</text>
              <text x={n.x + 13} y={n.y + 52} fontFamily="var(--font-mono)" fontSize="11" fontWeight="600" fill={ROLE_COLOR[n.role]}>{n.balance}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TraceLegend() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "12px 2px" }}>
      {Object.keys(ROLE_LABEL).map((r) => (
        <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ink-600)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: ROLE_COLOR[r] }}></span>{ROLE_LABEL[r]}
        </span>
      ))}
    </div>
  );
}

/* wallet inspector panel for a selected node */
function Inspector({ wallet, onFreeze, canAct }) {
  tRefresh();
  if (!wallet) return (
    <div style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 28, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)" }}>
      <TIco n="mouse-pointer-click" s={26} /><div style={{ marginTop: 10, fontSize: 14 }}>Click any wallet in the fund-flow graph to see details.</div>
    </div>
  );
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 20, display: "flex", flexDirection: "column", gap: 15 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: ROLE_COLOR[wallet.role] }}></span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, margin: 0, color: "var(--ink-900)" }}>{wallet.label || ROLE_LABEL[wallet.role]}</h3>
        </div>
        <TBadge tone="neutral">{ROLE_LABEL[wallet.role]}</TBadge>
      </div>
      <TAddr address={wallet.addr} role={wallet.role} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <TStat label="Balance" value={wallet.balance} caption={wallet.usd} />
        <TStat label="Role" value={ROLE_LABEL[wallet.role]} />
      </div>
      {wallet.role === "frozen" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--success-100)", color: "var(--success-700)", borderRadius: "var(--radius-sm)", padding: "11px 13px", fontSize: 13.5, fontFamily: "var(--font-ui)" }}><TIco n="snowflake" s={17} /> Funds in this wallet are frozen.</div>
      ) : canAct ? (
        <TBtn variant="primary" fullWidth iconLeft={<TIco n="snowflake" s={16} />} onClick={() => onFreeze(wallet)}>Initiate freeze / cooperation request</TBtn>
      ) : (
        <div style={{ fontSize: 12.5, color: "var(--ink-400)", fontFamily: "var(--font-ui)" }}>Only the handling attorney can initiate a freeze.</div>
      )}
    </div>
  );
}

window.BergTraceI = { TraceGraph, TraceLegend, Inspector, ROLE_COLOR, ROLE_LABEL };
