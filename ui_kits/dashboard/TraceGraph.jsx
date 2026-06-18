/* Berg PC — Blockchain asset-trace flow graph (SVG). Exports window.BergTrace.TraceGraph.
   Nodes positioned on a left→right flow; colored by trace role. */
const { AddressChip, Badge } = window.BergPCDesignSystem_eb13e3;

const ROLE_COLOR = {
  tainted: "var(--trace-tainted)", hop: "var(--trace-hop)", exchange: "var(--trace-exchange)",
  mixer: "var(--trace-mixer)", frozen: "var(--trace-frozen)",
};
const ROLE_FILL = {
  tainted: "#F4DFDB", hop: "#EDE7DC", exchange: "#DBE9F3", mixer: "#E6DEF0", frozen: "#DCEEE4",
};

function TraceGraph({ height = 360, onSelect, selectedId }) {
  // x in columns, y in px
  const nodes = [
    { id: "victim", x: 70,  y: 180, role: "tainted", label: "Victim wallet", addr: "bc1qvict…9j6l3", amt: "8.42 BTC" },
    { id: "h1",     x: 250, y: 100, role: "hop",     label: "Hop 1",         addr: "bc1qhop1…a7c2", amt: "5.10 BTC" },
    { id: "h2",     x: 250, y: 260, role: "hop",     label: "Hop 2",         addr: "bc1qhop2…b3f8", amt: "3.32 BTC" },
    { id: "mix",    x: 440, y: 100, role: "mixer",   label: "Mixer",         addr: "bc1qmix…44ad",  amt: "5.10 BTC" },
    { id: "ex1",    x: 440, y: 260, role: "exchange",label: "Exchange A",    addr: "0xa3f1…b204",   amt: "3.32 BTC" },
    { id: "frozen", x: 630, y: 180, role: "frozen",  label: "Frozen — court order", addr: "0x7be2…c603", amt: "3.32 BTC" },
  ];
  const N = Object.fromEntries(nodes.map(n => [n.id, n]));
  const edges = [
    ["victim", "h1"], ["victim", "h2"], ["h1", "mix"], ["h2", "ex1"], ["ex1", "frozen"],
  ];
  const W = 720, NW = 128, NH = 56;
  const cx = (n) => n.x + NW / 2, cy = (n) => n.y + NH / 2;

  return (
    <div style={{ width: "100%", overflowX: "auto", background: "var(--white)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ display: "block", minWidth: 720 }}>
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
          return <path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke="var(--ink-300)" strokeWidth="1.8" markerEnd="url(#bg-arrow)" />;
        })}
        {nodes.map((n) => {
          const sel = n.id === selectedId;
          return (
          <g key={n.id} style={{ cursor: onSelect ? "pointer" : "default" }}
             onClick={onSelect ? () => onSelect(n) : undefined}>
            {sel && <rect x={n.x-4} y={n.y-4} width={NW+8} height={NH+8} rx="11" fill="none" stroke={ROLE_COLOR[n.role]} strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />}
            <rect x={n.x} y={n.y} width={NW} height={NH} rx="8" fill={sel ? "var(--white)" : ROLE_FILL[n.role]} stroke={ROLE_COLOR[n.role]} strokeWidth={sel ? "2.4" : "1.5"} />
            <circle cx={n.x + 13} cy={n.y + 15} r="4" fill={ROLE_COLOR[n.role]} />
            <text x={n.x + 24} y={n.y + 19} fontFamily="var(--font-ui)" fontSize="11.5" fontWeight="600" fill="var(--ink-900)" style={{pointerEvents:"none"}}>{n.label}</text>
            <text x={n.x + 12} y={n.y + 35} fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--ink-600)" style={{pointerEvents:"none"}}>{n.addr}</text>
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

window.BergTrace = { TraceGraph, TraceLegend, ROLE_COLOR };
