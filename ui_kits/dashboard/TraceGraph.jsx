/* Berg PC — Blockchain asset-trace flow graph (SVG). Exports window.BergTrace.
   Nodes positioned on a left→right flow; colored by trace role.
   NODES/TXNS are exported so the Inspector and the transaction ledger render
   from the same source of truth as the graph. */
const { AddressChip, Badge } = window.BergPCDesignSystem_eb13e3;

const ROLE_COLOR = {
  tainted: "var(--trace-tainted)", hop: "var(--trace-hop)", exchange: "var(--trace-exchange)",
  mixer: "var(--trace-mixer)", frozen: "var(--trace-frozen)",
};
const ROLE_FILL = {
  tainted: "#F4DFDB", hop: "#EDE7DC", exchange: "#DBE9F3", mixer: "#E6DEF0", frozen: "#DCEEE4",
};
const ROLE_BADGE = {
  tainted: ["danger", "Tainted origin"], hop: ["neutral", "Pass-through"], mixer: ["accent", "Mixer"],
  exchange: ["info", "Exchange / VASP"], frozen: ["success", "Frozen"],
};

const NODES = [
  { id: "victim", x: 70,  y: 180, role: "tainted",  label: "Victim wallet",          short: "bc1qvict…9j6l3", addr: "bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3", amt: "8.42 BTC",
    balance: "0.00 BTC", usd: "$0", txs: 6, first: "2025-01-30", last: "2025-02-05", cluster: "Self-custody (Ledger)", note: "Origin of the stolen funds — confirmed by the client." },
  { id: "h1",     x: 250, y: 100, role: "hop",      label: "Hop 1",                  short: "bc1qhop1…a7c2", addr: "bc1qhop1a7c2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9", amt: "5.10 BTC",
    balance: "0.00 BTC", usd: "$0", txs: 3, first: "2025-02-04", last: "2025-02-08", cluster: "Unclustered", note: "Short-lived pass-through wallet; emptied within 4 days." },
  { id: "h2",     x: 250, y: 260, role: "hop",      label: "Hop 2",                  short: "bc1qhop2…b3f8", addr: "bc1qhop2b3f84f8x3v0rd7t6yqe2h5n8s4p1w0c9", amt: "3.32 BTC",
    balance: "0.00 BTC", usd: "$0", txs: 2, first: "2025-02-05", last: "2025-02-09", cluster: "Unclustered", note: "Routed funds directly to an off-ramp exchange." },
  { id: "mix",    x: 440, y: 100, role: "mixer",    label: "Mixer",                  short: "bc1qmix…44ad",  addr: "bc1qmixer44adm4f8x3v0rd7t6yqe2h5n8s4p1w0c9", amt: "5.10 BTC",
    balance: "—", usd: "—", txs: 128, first: "2025-02-08", last: "ongoing", cluster: "Coin-mixer (high-risk)", note: "Funds entered a mixing service. Tracing continues on best-effort clustering; recovery of this branch is unlikely." },
  { id: "ex1",    x: 440, y: 260, role: "exchange", label: "Exchange A — off-ramp",  short: "0xa3f1…b204",   addr: "0xa3f19c4e7b2049d5f1c8a6037be29d4471e7b204", amt: "3.32 BTC",
    balance: "3.32 BTC", usd: "$214,800", txs: 41, first: "2025-02-14", last: "2025-04-02", cluster: "Binance hot wallet (likely)", note: "KYC subpoena prepared; awaiting court signature for account-holder records." },
  { id: "frozen", x: 630, y: 180, role: "frozen",   label: "Frozen — court order",   short: "0x7be2…c603",   addr: "0x7be29d4471e7b204a3f19c4e7b2049d5f1c8a603", amt: "3.32 BTC",
    balance: "3.32 BTC", usd: "$214,800", txs: 2, first: "2025-03-12", last: "2025-03-12", cluster: "Held by Exchange A", note: "Injunction served; funds frozen and held pending judgment." },
];

const TXNS = [
  { hash: "0x9f3c…1a47", from: "victim", to: "h1",     amount: "5.10 BTC", dest: "hop",      date: "2025-02-04", status: "Confirmed" },
  { hash: "0x3a8e…77b1", from: "victim", to: "h2",     amount: "3.32 BTC", dest: "hop",      date: "2025-02-05", status: "Confirmed" },
  { hash: "0x77d2…c0e9", from: "h1",     to: "mix",    amount: "5.10 BTC", dest: "mixer",    date: "2025-02-08", status: "Mixed" },
  { hash: "0xb204…f19c", from: "h2",     to: "ex1",    amount: "3.32 BTC", dest: "exchange", date: "2025-02-09", status: "Off-ramp" },
  { hash: "0xe4a1…be29", from: "ex1",    to: "frozen", amount: "3.32 BTC", dest: "frozen",   date: "2025-03-12", status: "Frozen" },
];

function TraceGraph({ height = 360, onSelect, selectedId }) {
  const N = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const edges = [["victim", "h1"], ["victim", "h2"], ["h1", "mix"], ["h2", "ex1"], ["ex1", "frozen"]];
  const W = 760, NW = 128, NH = 56;
  const cy = (n) => n.y + NH / 2;

  return (
    <div style={{ width: "100%", overflowX: "auto", background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ display: "block", minWidth: 760 }}>
        <defs>
          <marker id="bg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-300)" />
          </marker>
          <pattern id="bg-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="var(--ink-50)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={height} fill="url(#bg-grid)" />
        {edges.map(([a, b], i) => {
          const A = N[a], B = N[b];
          const x1 = A.x + NW, y1 = cy(A), x2 = B.x, y2 = cy(B);
          const mx = (x1 + x2) / 2;
          const active = selectedId && (a === selectedId || b === selectedId);
          return <path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke={active ? "var(--stone-500)" : "var(--ink-300)"} strokeWidth={active ? "2.4" : "1.8"} markerEnd="url(#bg-arrow)" />;
        })}
        {NODES.map((n) => {
          const sel = n.id === selectedId;
          return (
          <g key={n.id} style={{ cursor: onSelect ? "pointer" : "default" }}
             onClick={onSelect ? () => onSelect(n) : undefined}>
            {sel && <rect x={n.x-4} y={n.y-4} width={NW+8} height={NH+8} rx="11" fill="none" stroke={ROLE_COLOR[n.role]} strokeWidth="2" strokeDasharray="4 3" opacity="0.85" />}
            <rect x={n.x} y={n.y} width={NW} height={NH} rx="8" fill={sel ? "var(--white)" : ROLE_FILL[n.role]} stroke={ROLE_COLOR[n.role]} strokeWidth={sel ? "2.4" : "1.5"} />
            <circle cx={n.x + 13} cy={n.y + 15} r="4" fill={ROLE_COLOR[n.role]} />
            <text x={n.x + 24} y={n.y + 19} fontFamily="var(--font-ui)" fontSize="11.5" fontWeight="600" fill="var(--ink-900)" style={{pointerEvents:"none"}}>{n.label}</text>
            <text x={n.x + 12} y={n.y + 35} fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--ink-600)" style={{pointerEvents:"none"}}>{n.short}</text>
            <text x={n.x + 12} y={n.y + 49} fontFamily="var(--font-mono)" fontSize="10.5" fontWeight="600" fill={ROLE_COLOR[n.role]} style={{pointerEvents:"none"}}>{n.amt}</text>
          </g>
          );
        })}
      </svg>
    </div>
  );
}

function TraceLegend() {
  const items = [["tainted","Tainted origin"],["hop","Pass-through"],["mixer","Mixer"],["exchange","Exchange / VASP"],["frozen","Frozen / recovered"]];
  return (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", padding: "12px 2px" }}>
      {items.map(([r, l]) => (
        <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ink-600)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: ROLE_COLOR[r] }}></span>{l}
        </span>
      ))}
    </div>
  );
}

window.BergTrace = { TraceGraph, TraceLegend, ROLE_COLOR, ROLE_FILL, ROLE_BADGE, NODES, TXNS };
