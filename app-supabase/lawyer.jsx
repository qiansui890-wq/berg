/* Berg PC Platform — lawyer workspace. Exports window.BergLawyer */
const DSL = window.BergPCDesignSystem_eb13e3;
const { Card: LCard, CardHeader: LCH, Stat: LStat, Table: LTable, Badge: LBadge, Button: LBtn, AddressChip: LAddr, Input: LInput, Tag: LTag, Dialog: LDialog, Alert: LAlert } = DSL;
const { Ico: LIco, refreshIcons: lRefresh, StageBadge: LStage, PageWrap: LWrap, SectionTitle: LSec, Empty: LEmpty, EditRow: LEdit, useToast: lToast } = window.BergUI;
const { CaseDetail: LCaseDetail } = window.BergCase;

function LawyerApp({ user, initial, openClientId }) {
  const [view, setView] = React.useState(initial || "board");
  const [openId, setOpenId] = React.useState(null);
  React.useEffect(() => { if (initial) { setView(initial); setOpenId(null); } }, [initial]);
  React.useEffect(() => { if (openClientId) setOpenId(String(openClientId).split(":")[0]); }, [openClientId]);
  const clients = window.DB.clientsFor(user);
  const open = openId ? window.DB.clientById(openId) : null;

  if (open) return <LCaseDetail client={open} user={user} onBack={() => setOpenId(null)} />;
  if (view === "clients") return <ClientList user={user} clients={clients} onOpen={setOpenId} />;
  return <Board user={user} clients={clients} onOpen={setOpenId} onAll={() => setView("clients")} />;
}

/* ---- stage distribution mini bar ---- */
function StageBar({ clients }) {
  const tones = { "Intake": "var(--ink-300)", "Investigating": "var(--info-500)", "Filed": "var(--stone-500)", "Frozen": "var(--warning-500)", "Recovered": "var(--success-500)", "Closed": "var(--ink-500)" };
  const counts = window.DB.STAGES.map((s) => ({ s, n: clients.filter((c) => c.status === s).length }));
  const total = clients.length || 1;
  const [grown, setGrown] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setGrown(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", background: "var(--ink-100)" }}>
        {counts.map(({ s, n }) => n > 0 && <div key={s} title={`${s}: ${n}`} style={{ width: (grown ? n / total * 100 : 0) + "%", background: tones[s], transition: "width .9s cubic-bezier(.16,1,.3,1)" }} />)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 12 }}>
        {counts.map(({ s, n }) => (
          <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ink-600)" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: tones[s] }} />{s} <b style={{ color: "var(--ink-900)" }}>{n}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---- daily board ---- */
function Board({ user, clients, onOpen, onAll }) {
  lRefresh();
  const toast = lToast();
  const totalAtIssue = clients.reduce((s, c) => s + (Number(c.amountLost) || 0), 0);
  const recovered = clients.filter((c) => c.status === "Recovered").reduce((s, c) => s + (Number(c.amountLost) || 0), 0);
  const frozen = clients.reduce((s, c) => s + c.wallets.filter((w) => w.role === "frozen").length, 0);
  const acts = window.DB.activity().filter((a) => clients.some((c) => c.name === a.target) || a.actor === user.name).slice(0, 7);
  const needsAttention = clients.filter((c) => ["Intake", "Investigating"].includes(c.status));
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <LWrap>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone-600)" }}>{today}</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600, color: "var(--ink-900)", margin: "8px 0 0", whiteSpace: "nowrap" }}>Good morning, {user.name.split(" ")[0]}</h2>
        </div>
        <NewCaseButton user={user} onCreated={onOpen} toast={toast} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
        {[["Active cases", clients.length, "folder-search", clients.length + " clients"],
          ["Total at issue", window.DB.fmtMoney(totalAtIssue), "scale", "in progress"],
          ["Recovered", window.DB.fmtMoney(recovered), "badge-check", "this year"],
          ["Frozen wallets", frozen, "snowflake", "addresses"]].map(([l, v, ic, cap]) => (
          <LCard key={l} padding="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ minWidth: 0 }}><LStat label={l} value={v} caption={cap} /></div>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)", flex: "none" }}><LIco n={ic} s={19} /></span>
            </div>
          </LCard>
        ))}
      </div>

      <LCard padding="lg">
        <LCH eyebrow="Portfolio" title="Cases by stage" />
        <StageBar clients={clients} />
      </LCard>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, alignItems: "start" }}>
        <LCard padding="none">
          <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, margin: 0, color: "var(--ink-900)" }}>My cases</h3>
            <LBtn size="sm" variant="ghost" iconRight={<LIco n="arrow-right" s={15} />} onClick={onAll}>View all</LBtn>
          </div>
          {clients.length ? (
            <LTable rowKey="id" onRowClick={(r) => onOpen(r.id)}
              columns={[
                { key: "name", label: "Client" },
                { key: "matterType", label: "Matter" },
                { key: "status", label: "Stage", render: (v) => <LStage s={v} /> },
                { key: "amountLost", label: "At issue", align: "right", render: (v) => window.DB.fmtMoney(v) },
              ]}
              rows={clients.slice(0, 6)} />
          ) : <LEmpty icon="folder-plus" title="No cases yet" hint="Create a case to get started." />}
        </LCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <LCard padding="lg">
            <LCH eyebrow="Today" title="Needs attention" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {needsAttention.length ? needsAttention.slice(0, 4).map((c) => (
                <button key={c.id} onClick={() => onOpen(c.id)} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--white)", padding: "10px 12px", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ color: "var(--warning-600)" }}><LIco n="alert-circle" s={17} /></span>
                  <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{c.name}</div><div style={{ fontSize: 12, color: "var(--ink-500)" }}>Stage: {c.status} · needs action</div></div>
                  <LIco n="chevron-right" s={16} c="var(--ink-300)" />
                </button>
              )) : <div style={{ fontSize: 13.5, color: "var(--ink-400)", fontFamily: "var(--font-ui)" }}>Nothing pending 🎉</div>}
            </div>
          </LCard>

          <LCard padding="lg">
            <LCH eyebrow="Activity" title="Daily updates" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {acts.length ? acts.map((a) => (
                <div key={a.id} style={{ display: "flex", gap: 10 }}>
                  <span style={{ marginTop: 4, width: 7, height: 7, borderRadius: "50%", background: "var(--stone-500)", flex: "none" }}></span>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-700)", lineHeight: 1.45 }}>
                    <b>{a.actor}</b> {a.action}{a.target && <> · <span style={{ color: "var(--ink-500)" }}>{a.target}</span></>}
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-400)", marginTop: 1 }}>{new Date(a.ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              )) : <div style={{ fontSize: 13, color: "var(--ink-400)" }}>No activity yet</div>}
            </div>
          </LCard>
        </div>
      </div>
    </LWrap>
  );
}

/* ---- client list with search/filter + bulk actions ---- */
function ClientList({ user, clients, onOpen }) {
  lRefresh();
  const toast = lToast();
  const [q, setQ] = React.useState("");
  const [stage, setStage] = React.useState("All");
  const [picked, setPicked] = React.useState([]);
  const [bulkStage, setBulkStage] = React.useState("");
  const rows = clients.filter((c) =>
    (stage === "All" || c.status === stage) &&
    (c.name + c.matterType + c.id).toLowerCase().includes(q.toLowerCase()));
  const toggle = (id) => setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const allPicked = rows.length > 0 && rows.every((r) => picked.includes(r.id));
  function applyBulkStage() {
    if (!bulkStage) return;
    picked.forEach((id) => window.DB.setStage(id, bulkStage, user.name));
    toast({ tone: "success", icon: "flag", title: "Bulk update", msg: `Moved ${picked.length} case(s) to “${bulkStage}”.` });
    setPicked([]); setBulkStage("");
  }
  const cb = { width: 16, height: 16, accentColor: "var(--ink-900)", cursor: "pointer" };
  return (
    <LWrap>
      <LSec eyebrow="My clients" title={`Cases (${clients.length})`} right={<NewCaseButton user={user} onCreated={onOpen} toast={toast} />} />
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ width: 300 }}><LInput placeholder="Search clients, matters…" iconLeft={<LIco n="search" s={16} />} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", ...window.DB.STAGES].map((s) => (
            <button key={s} onClick={() => setStage(s)} style={{ border: `1px solid ${stage === s ? "var(--ink-900)" : "var(--border-default)"}`, background: stage === s ? "var(--ink-900)" : "var(--white)", color: stage === s ? "var(--cream)" : "var(--ink-600)", borderRadius: "var(--radius-pill)", padding: "5px 13px", fontSize: 12.5, fontFamily: "var(--font-ui)", cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      </div>

      {picked.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--navy-900)", color: "var(--cream)", borderRadius: "var(--radius-md)", padding: "10px 16px" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600 }}>{picked.length} selected</span>
          <div style={{ flex: 1 }} />
          <select value={bulkStage} onChange={(e) => setBulkStage(e.target.value)} style={{ fontFamily: "var(--font-ui)", fontSize: 13, border: "none", borderRadius: "var(--radius-sm)", padding: "7px 10px", background: "var(--navy-700)", color: "var(--cream)" }}>
            <option value="">Set stage to…</option>
            {window.DB.STAGES.map((s) => <option key={s} value={s} style={{ color: "#000" }}>{s}</option>)}
          </select>
          <LBtn size="sm" variant="accent" disabled={!bulkStage} onClick={applyBulkStage}>Apply</LBtn>
          <button onClick={() => setPicked([])} style={{ border: "none", background: "transparent", color: "var(--navy-200)", cursor: "pointer", display: "inline-flex" }}><LIco n="x" s={17} /></button>
        </div>
      )}

      <LCard padding="none">
        {rows.length ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-ui)" }}>
              <thead><tr>
                <th style={thBulk}><input type="checkbox" checked={allPicked} onChange={() => setPicked(allPicked ? [] : rows.map((r) => r.id))} style={cb} /></th>
                {["Case", "Client", "Matter", "Jurisdiction", "Stage", "At issue"].map((h, i) => <th key={h} style={{ ...thBulk, textAlign: i === 5 ? "right" : "left" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: "1px solid var(--border-subtle)", cursor: "pointer", background: picked.includes(c.id) ? "var(--ink-50)" : "transparent" }}
                    onMouseEnter={(e) => { if (!picked.includes(c.id)) e.currentTarget.style.background = "var(--ink-50)"; }}
                    onMouseLeave={(e) => { if (!picked.includes(c.id)) e.currentTarget.style.background = "transparent"; }}>
                    <td style={tdBulk} onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={picked.includes(c.id)} onChange={() => toggle(c.id)} style={cb} /></td>
                    <td style={tdBulk} onClick={() => onOpen(c.id)}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-700)" }}>{c.id.toUpperCase()}</span></td>
                    <td style={tdBulk} onClick={() => onOpen(c.id)}>{c.name}</td>
                    <td style={tdBulk} onClick={() => onOpen(c.id)}>{c.matterType}</td>
                    <td style={tdBulk} onClick={() => onOpen(c.id)}>{c.overseas ? <LBadge tone="warning">Overseas</LBadge> : <span style={{ fontSize: 13, color: "var(--ink-500)" }}>{c.jurisdiction || "Domestic"}</span>}</td>
                    <td style={tdBulk} onClick={() => onOpen(c.id)}><LStage s={c.status} /></td>
                    <td style={{ ...tdBulk, textAlign: "right" }} onClick={() => onOpen(c.id)}>{window.DB.fmtMoney(c.amountLost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <LEmpty icon="search-x" title="No matching cases" hint="Adjust your search or filters." />}
      </LCard>
    </LWrap>
  );
}
const thBulk = { padding: "11px 16px", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-500)", borderBottom: "1px solid var(--border-default)", background: "var(--ink-50)", whiteSpace: "nowrap" };
const tdBulk = { padding: "11px 16px", fontSize: 13.5, color: "var(--ink-700)", verticalAlign: "middle" };

/* ---- new case dialog ---- */
function NewCaseButton({ user, onCreated, toast }) {
  const [open, setOpen] = React.useState(false);
  const [f, setF] = React.useState({ name: "", email: "", phone: "", matterType: "Crypto Fraud", amountLost: "", overseas: false });
  lRefresh();
  function create() {
    if (!f.name.trim()) { toast({ tone: "warning", icon: "alert-triangle", title: "Please enter a client name" }); return; }
    const c = window.DB.addClientByLawyer(user, { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), matterType: f.matterType, amountLost: Number(f.amountLost) || 0, overseas: f.overseas, jurisdiction: f.overseas ? "Overseas" : "Domestic" });
    setOpen(false); setF({ name: "", email: "", phone: "", matterType: "Crypto Fraud", amountLost: "", overseas: false });
    toast({ tone: "success", icon: "folder-plus", title: "Case created", msg: c.name });
    onCreated(c.id);
  }
  return (
    <>
      <LBtn variant="primary" iconLeft={<LIco n="plus" s={16} />} onClick={() => setOpen(true)}>New case</LBtn>
      <LDialog open={open} onClose={() => setOpen(false)} title="New case" description="After creating, complete the profile, wallets, and evidence in the case detail." width={480}
        footer={<><LBtn variant="ghost" onClick={() => setOpen(false)}>Cancel</LBtn><LBtn variant="primary" onClick={create} iconLeft={<LIco n="check" s={16} />}>Create case</LBtn></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <LEdit label="Client name / entity" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <LEdit label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
            <LEdit label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <LEdit label="Matter" value={f.matterType} onChange={(v) => setF({ ...f, matterType: v })} options={["Crypto Fraud", "Coinbase Data Breach", "Meta Scam Ads", "Crypto Transaction Dispute", "Other"]} />
            <LEdit label="Amount lost (USD)" value={f.amountLost} onChange={(v) => setF({ ...f, amountLost: v })} type="number" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-700)", cursor: "pointer" }}>
            <input type="checkbox" checked={f.overseas} onChange={(e) => setF({ ...f, overseas: e.target.checked })} /> Overseas ring (funds may not be freezable by a court directly)
          </label>
        </div>
      </LDialog>
    </>
  );
}

window.BergLawyer = { LawyerApp };
