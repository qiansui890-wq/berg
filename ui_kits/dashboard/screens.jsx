/* Berg PC — Dashboard screens (overview, cases, case detail). Exports window.BergDash. */
const _D = window.BergPCDesignSystem_eb13e3;
const { Card, CardHeader, Stat, Table, Badge, Button, AddressChip, Tabs, Tag, Alert, Input, IconButton, Pagination, EmptyState } = _D;
const { AIco } = window.BergApp;
const { TraceGraph, TraceLegend } = window.BergTrace;

const CASES = [
  { id: "BPC-2025-0417", client: "Jane Doe", type: "Crypto Fraud", stage: "Tracing", amount: "$182,400", wallet: "bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3", role: "tainted", updated: "2h ago" },
  { id: "BPC-2025-0388", client: "Apex Holdings LLC", type: "Crypto Fraud", stage: "Frozen", amount: "$54,900", wallet: "0xa3f19c4e7b2049d5f1c8a6037be29d4471e7b204", role: "exchange", updated: "1d ago" },
  { id: "BPC-2025-0356", client: "R. Okafor", type: "Coinbase Breach", stage: "Filed", amount: "$1.2M", wallet: "bc1qxy2kgd9q8r3v7m0w5t4f6h8s2p1c0j9l3k7n5", role: "hop", updated: "3d ago" },
  { id: "BPC-2025-0341", client: "Meridian Fund", type: "Crypto Fraud", stage: "Recovered", amount: "$500,000", wallet: "0x7be29d4471e7b204a3f19c4e7b2049d5f1c8a603", role: "frozen", updated: "1w ago" },
  { id: "BPC-2025-0322", client: "T. Nguyen", type: "Meta Scam Ads", stage: "Intake", amount: "$38,200", wallet: "—", role: "hop", updated: "1w ago" },
];
const STAGE_TONE = { Intake: "neutral", Tracing: "info", Filed: "accent", Frozen: "warning", Recovered: "success" };

function StageBadge({ s }) { return <Badge tone={STAGE_TONE[s] || "neutral"}>{s}</Badge>; }

function Overview({ openCase }) {
  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          ["Active cases", "23", "folder-search", "+3 this month"],
          ["At issue", "$4.1M", "scale", "across active"],
          ["Recovered (YTD)", "$1.7M", "badge-check", "+$500K"],
          ["Wallets watched", "146", "wallet", "12 flagged"],
        ].map(([l, v, ic, cap]) => (
          <Card key={l} padding="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Stat label={l} value={v} caption={cap} />
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)" }}><AIco n={ic} s={19}/></span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18 }}>
        <Card padding="none">
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, margin: 0, color: "var(--ink-900)" }}>Recent cases</h3>
            <Button size="sm" variant="ghost" iconRight={<AIco n="arrow-right" s={15}/>} onClick={()=>openCase(null)}>View all</Button>
          </div>
          <Table rowKey="id" onRowClick={(r)=>openCase(r.id)}
            columns={[
              { key: "id", label: "Case", render: (v)=> <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-800)" }}>{v}</span> },
              { key: "client", label: "Client" },
              { key: "stage", label: "Stage", render: (v)=> <StageBadge s={v} /> },
              { key: "amount", label: "At issue", align: "right" },
            ]}
            rows={CASES.slice(0,4)} />
        </Card>

        <Card padding="lg">
          <CardHeader eyebrow="This week" title="Action needed" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Alert tone="warning" icon={<AIco n="clock" s={17}/>}>Injunction response due in <b>3 days</b> — BPC-2025-0356.</Alert>
            <Alert tone="info" icon={<AIco n="git-branch" s={17}/>}>New off-ramp detected on <b>BPC-2025-0417</b>.</Alert>
            <Alert tone="success" icon={<AIco n="snowflake" s={17}/>}>Exchange confirmed freeze — <b>$54,900</b>.</Alert>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CaseList({ openCase }) {
  const [q, setQ] = React.useState("");
  const rows = CASES.filter(c => (c.id + c.client + c.type).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 320 }}><Input placeholder="Search cases, clients…" iconLeft={<AIco n="search" s={16}/>} value={q} onChange={(e)=>setQ(e.target.value)} /></div>
        <Tag iconLeft={<AIco n="filter" s={14}/>}>Stage: All</Tag>
        <Tag iconLeft={<AIco n="filter" s={14}/>}>Type: Crypto</Tag>
        <div style={{ flex: 1 }}></div>
        <Button variant="primary" iconLeft={<AIco n="plus" s={16}/>}>New case</Button>
      </div>
      <Card padding="none">
        <Table rowKey="id" onRowClick={(r)=>openCase(r.id)}
          columns={[
            { key: "id", label: "Case", render: (v)=> <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-800)" }}>{v}</span> },
            { key: "client", label: "Client" },
            { key: "type", label: "Matter" },
            { key: "wallet", label: "Primary wallet", render: (v, r)=> v === "—" ? <span style={{ color: "var(--ink-300)" }}>—</span> : <AddressChip address={v} role={r.role} /> },
            { key: "stage", label: "Stage", render: (v)=> <StageBadge s={v} /> },
            { key: "amount", label: "At issue", align: "right" },
            { key: "updated", label: "Updated", align: "right", render: (v)=> <span style={{ color: "var(--ink-400)", fontSize: 13 }}>{v}</span> },
          ]}
          rows={rows} />
      </Card>
    </div>
  );
}

function CaseDetail({ id, back }) {
  const c = CASES.find(x => x.id === id) || CASES[0];
  const [tab, setTab] = React.useState("trace");
  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <button onClick={back} style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-500)", display: "inline-flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 10 }}><AIco n="arrow-left" s={15}/> All cases</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, margin: 0, color: "var(--ink-900)" }}>{c.client}</h2>
            <StageBadge s={c.stage} />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-500)", marginTop: 5 }}>{c.id} · {c.type}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" iconLeft={<AIco n="file-down" s={16}/>}>Export report</Button>
          <Button variant="primary" iconLeft={<AIco n="snowflake" s={16}/>}>Request freeze</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <Card padding="md"><Stat label="At issue" value={c.amount} /></Card>
        <Card padding="md"><Stat label="Traced" value="86%" caption="of stolen funds" /></Card>
        <Card padding="md"><Stat label="Hops" value="7" caption="to known off-ramp" /></Card>
        <Card padding="md"><Stat label="Frozen" value="$54.9K" deltaTone="success" delta="confirmed" /></Card>
      </div>

      <Card padding="lg">
        <Tabs value={tab} onChange={setTab} items={[
          { id: "trace", label: "Asset trace", icon: <AIco n="git-branch" s={15}/> },
          { id: "wallets", label: "Wallets", icon: <AIco n="wallet" s={15}/> },
          { id: "timeline", label: "Timeline", icon: <AIco n="clock" s={15}/> },
        ]} />
        <div style={{ paddingTop: 18 }}>
          {tab === "trace" && <><TraceGraph /><TraceLegend /></>}
          {tab === "wallets" && (
            <Table rowKey="wallet"
              columns={[
                { key: "wallet", label: "Address", render: (v, r)=> <AddressChip address={v} role={r.role} /> },
                { key: "role", label: "Role", render: (v)=> <Badge tone="neutral">{v}</Badge> },
                { key: "amt", label: "Balance", align: "right" },
              ]}
              rows={[
                { wallet: "bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3", role: "tainted", amt: "8.42 BTC" },
                { wallet: "bc1qhop1a7c2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9", role: "hop", amt: "5.10 BTC" },
                { wallet: "0xa3f19c4e7b2049d5f1c8a6037be29d4471e7b204", role: "exchange", amt: "3.32 BTC" },
              ]} />
          )}
          {tab === "timeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 4 }}>
              {[
                ["check", "Intake submitted and reviewed", "Apr 17"],
                ["git-branch", "Initial trace completed — 7 hops mapped", "Apr 19"],
                ["building-2", "Exchange A subpoenaed for KYC", "Apr 24"],
                ["snowflake", "Freeze confirmed on $54,900", "May 02"],
              ].map(([ic, t, d], i, arr) => (
                <div key={t} style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "var(--stone-100)", color: "var(--stone-700)", flex: "none" }}><AIco n={ic} s={15}/></span>
                    {i < arr.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--border-default)", minHeight: 18 }}></span>}
                  </div>
                  <div style={{ paddingBottom: 18 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-800)", fontWeight: 500 }}>{t}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-400)", marginTop: 2 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

const WATCH = [
  { id: "w1", wallet: "bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3", case: "BPC-2025-0417", role: "tainted",  risk: "Critical", balance: "8.42 BTC", last: "12m ago",  status: "Watching" },
  { id: "w2", wallet: "0xa3f19c4e7b2049d5f1c8a6037be29d4471e7b204", case: "BPC-2025-0388", role: "exchange", risk: "High",     balance: "3.32 BTC", last: "1h ago",   status: "Frozen" },
  { id: "w3", wallet: "bc1qhop1a7c2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9", case: "BPC-2025-0417", role: "hop",      risk: "Medium",   balance: "0.00 BTC", last: "4h ago",   status: "Watching" },
  { id: "w4", wallet: "bc1qmixer44adm4f8x3v0rd7t6yqe2h5n8s4p1w0c9", case: "BPC-2025-0417", role: "mixer",    risk: "Critical", balance: "—",        last: "ongoing",  status: "Watching" },
  { id: "w5", wallet: "0x7be29d4471e7b204a3f19c4e7b2049d5f1c8a603", case: "BPC-2025-0341", role: "frozen",   risk: "Low",      balance: "3.32 BTC", last: "1d ago",   status: "Frozen" },
  { id: "w6", wallet: "bc1qxy2kgd9q8r3v7m0w5t4f6h8s2p1c0j9l3k7n5", case: "BPC-2025-0356", role: "hop",      risk: "Medium",   balance: "1.04 BTC", last: "2d ago",   status: "Cleared" },
];
const RISK_TONE = { Critical: "danger", High: "warning", Medium: "accent", Low: "neutral" };
const WSTATUS_TONE = { Watching: "info", Frozen: "success", Cleared: "neutral" };
const ROLE_LABEL = { tainted: "Tainted", hop: "Pass-through", mixer: "Mixer", exchange: "Exchange", frozen: "Frozen" };

function WalletWatchlist() {
  const [page, setPage] = React.useState(1);
  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[["Watched", "146", "wallet"], ["Flagged", "12", "flag"], ["Frozen", "8", "snowflake"], ["Cleared", "31", "check-circle"]].map(([l,v,ic])=>(
          <Card key={l} padding="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Stat label={l} value={v} />
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)" }}><AIco n={ic} s={19}/></span>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 320 }}><Input placeholder="Search wallets…" iconLeft={<AIco n="search" s={16}/>} /></div>
        <Tag iconLeft={<AIco n="filter" s={14}/>}>Risk: All</Tag>
        <Tag iconLeft={<AIco n="filter" s={14}/>}>Status: All</Tag>
        <div style={{ flex: 1 }}></div>
        <Button variant="primary" iconLeft={<AIco n="plus" s={16}/>}>Watch address</Button>
      </div>
      <Card padding="none">
        <Table rowKey="id"
          columns={[
            { key: "wallet", label: "Address", render: (v, r)=> <AddressChip address={v} role={r.role} /> },
            { key: "role", label: "Role", render: (v)=> <span style={{ fontSize: 13, color: "var(--ink-600)" }}>{ROLE_LABEL[v]}</span> },
            { key: "case", label: "Case", render: (v)=> <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-700)" }}>{v}</span> },
            { key: "risk", label: "Risk", render: (v)=> <Badge tone={RISK_TONE[v]}>{v}</Badge> },
            { key: "balance", label: "Balance", align: "right", render: (v)=> <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{v}</span> },
            { key: "last", label: "Last seen", align: "right", render: (v)=> <span style={{ color: "var(--ink-400)", fontSize: 13 }}>{v}</span> },
            { key: "status", label: "Status", render: (v)=> <Badge tone={WSTATUS_TONE[v]}>{v}</Badge> },
          ]}
          rows={WATCH} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderTop: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: 13, color: "var(--ink-500)" }}>Showing 1–6 of 146 watched wallets</span>
          <Pagination page={page} pageCount={24} onChange={setPage} />
        </div>
      </Card>
    </div>
  );
}

const VASPS = [
  { id: "e1", name: "Binance", jur: "Global / Malta", cases: 9, reqs: 6, status: "Cooperating", resp: "~2 days" },
  { id: "e2", name: "Coinbase", jur: "United States", cases: 7, reqs: 5, status: "Cooperating", resp: "~1 day" },
  { id: "e3", name: "Kraken", jur: "United States", cases: 3, reqs: 2, status: "Cooperating", resp: "~3 days" },
  { id: "e4", name: "Tether (USDT)", jur: "Issuer freeze", cases: 4, reqs: 3, status: "Pending", resp: "—" },
  { id: "e5", name: "Huobi / HTX", jur: "Seychelles", cases: 2, reqs: 2, status: "Slow", resp: "~10 days" },
  { id: "e6", name: "Unknown VASP", jur: "Unattributed", cases: 1, reqs: 0, status: "Declined", resp: "—" },
];
const VASP_TONE = { Cooperating: "success", Pending: "warning", Slow: "accent", Declined: "danger" };

function Exchanges() {
  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
      <Alert tone="info" icon={<AIco n="building-2" s={17}/>}>
        Track freeze requests and KYC cooperation across exchanges and VASPs. Response times feed the recovery timeline for each case.
      </Alert>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 320 }}><Input placeholder="Search exchanges / VASPs…" iconLeft={<AIco n="search" s={16}/>} /></div>
        <div style={{ flex: 1 }}></div>
        <Button variant="primary" iconLeft={<AIco n="send" s={16}/>}>New freeze request</Button>
      </div>
      <Card padding="none">
        <Table rowKey="id"
          columns={[
            { key: "name", label: "Exchange / VASP", render: (v)=> <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 600, color: "var(--ink-900)" }}><span style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: "var(--navy-900)", color: "var(--stone-300)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "var(--font-serif)", fontWeight: 700 }}>{v[0]}</span>{v}</span> },
            { key: "jur", label: "Jurisdiction", render: (v)=> <span style={{ fontSize: 13, color: "var(--ink-600)" }}>{v}</span> },
            { key: "cases", label: "Cases", align: "right" },
            { key: "reqs", label: "Freeze requests", align: "right" },
            { key: "resp", label: "Avg. response", align: "right", render: (v)=> <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-600)" }}>{v}</span> },
            { key: "status", label: "Status", render: (v)=> <Badge tone={VASP_TONE[v]}>{v}</Badge> },
          ]}
          rows={VASPS} />
      </Card>
    </div>
  );
}

const FILES = [
  { id: "d1", name: "Chain-of-funds report.pdf", case: "BPC-2025-0417", type: "Forensic report", by: "Investigations", date: "May 02", status: "verified" },
  { id: "d2", name: "Bank statement — Feb 2025.pdf", case: "BPC-2025-0417", type: "Evidence", by: "Jane Doe", date: "Apr 17", status: "verified" },
  { id: "d3", name: "Exchange A — KYC subpoena.docx", case: "BPC-2025-0388", type: "Filing", by: "Geoffrey Berg", date: "Apr 24", status: "verified" },
  { id: "d4", name: "Screenshots — platform chat.zip", case: "BPC-2025-0417", type: "Evidence", by: "Jane Doe", date: "Apr 18", status: "review" },
  { id: "d5", name: "Injunction order — draft.pdf", case: "BPC-2025-0356", type: "Filing", by: "Kathryn E. Nelson", date: "May 06", status: "review" },
];

function Documents() {
  const [q, setQ] = React.useState("");
  const rows = FILES.filter((f)=> (f.name + f.case + f.type).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 320 }}><Input placeholder="Search documents…" iconLeft={<AIco n="search" s={16}/>} value={q} onChange={(e)=>setQ(e.target.value)} /></div>
        <Tag iconLeft={<AIco n="filter" s={14}/>}>Type: All</Tag>
        <div style={{ flex: 1 }}></div>
        <Button variant="primary" iconLeft={<AIco n="upload" s={16}/>}>Upload</Button>
      </div>
      <Card padding="none">
        {rows.length === 0 ? (
          <EmptyState icon={<AIco n="file-search" s={22}/>} title="No documents match" description="Try a different search term, or upload a new file to a case." />
        ) : (
          <Table rowKey="id"
            columns={[
              { key: "name", label: "Document", render: (v)=> <span style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "var(--ink-800)", fontWeight: 500 }}><span style={{ color: "var(--stone-600)" }}><AIco n="file-text" s={17}/></span>{v}</span> },
              { key: "case", label: "Case", render: (v)=> <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-700)" }}>{v}</span> },
              { key: "type", label: "Type", render: (v)=> <Tag>{v}</Tag> },
              { key: "by", label: "Added by" },
              { key: "date", label: "Date", align: "right", render: (v)=> <span style={{ color: "var(--ink-400)", fontSize: 13 }}>{v}</span> },
              { key: "status", label: "Status", render: (v)=> <Badge tone={v==="verified"?"success":"warning"}>{v==="verified"?"Verified":"In review"}</Badge> },
            ]}
            rows={rows} />
        )}
      </Card>
    </div>
  );
}

window.BergDash = { Overview, CaseList, CaseDetail, WalletWatchlist, Exchanges, Documents, CASES };
