/* Berg PC Platform — admin console. Exports window.BergAdmin */
const DSAd = window.BergPCDesignSystem_eb13e3;
const { Card: AdCard, CardHeader: AdCH, Stat: AdStat, Table: AdTable, Badge: AdBadge, Button: AdBtn, Avatar: AdAvatar, Dialog: AdDialog, Input: AdInput, Tag: AdTag } = DSAd;
const { Ico: AdIco, refreshIcons: adRefresh, StageBadge: AdStage, PageWrap: AdWrap, SectionTitle: AdSec, EditRow: AdEdit, useToast: adToast } = window.BergUI;
const { CaseDetail: AdCaseDetail } = window.BergCase;

function AdminApp({ user, view, openClientId }) {
  const [openId, setOpenId] = React.useState(null);
  React.useEffect(() => { if (openClientId) setOpenId(String(openClientId).split(":")[0]); }, [openClientId]);
  const open = openId ? window.DB.clientById(openId) : null;
  if (open) return <AdCaseDetail client={open} user={user} onBack={() => setOpenId(null)} />;
  if (view === "users") return <Users />;
  if (view === "assign") return <Assignments onOpen={setOpenId} />;
  if (view === "activity") return <ActivityLog />;
  return <AdminOverview onOpen={setOpenId} />;
}

/* ---- overview ---- */
function AdminOverview({ onOpen }) {
  adRefresh();
  const [grown, setGrown] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setGrown(true), 60); return () => clearTimeout(t); }, []);
  const clients = window.DB.clientsFor({ role: "admin" });
  const lawyers = window.DB.lawyers();
  const totalAtIssue = clients.reduce((s, c) => s + (Number(c.amountLost) || 0), 0);
  const overseas = clients.filter((c) => c.overseas).length;
  const acts = window.DB.activity().slice(0, 8);
  return (
    <AdWrap>
      <AdSec eyebrow="Console" title="Firm overview" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
        {[["Total cases", clients.length, "folder-search"], ["Total at issue", window.DB.fmtMoney(totalAtIssue), "scale"], ["Attorneys", lawyers.length, "users"], ["Overseas cases", overseas, "globe"]].map(([l, v, ic]) => (
          <AdCard key={l} padding="md"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}><div style={{ minWidth: 0 }}><AdStat label={l} value={v} /></div><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)", flex: "none" }}><AdIco n={ic} s={19} /></span></div></AdCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start" }}>
        <AdCard padding="none">
          <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--border-subtle)" }}><h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, margin: 0, color: "var(--ink-900)" }}>Attorney workload</h3></div>
          <div style={{ padding: "8px 8px" }}>
            {lawyers.map((l) => {
              const cs = window.DB.clientsFor(l);
              const amt = cs.reduce((s, c) => s + (Number(c.amountLost) || 0), 0);
              const maxC = Math.max(1, ...lawyers.map((x) => window.DB.clientsFor(x).length));
              return (
                <div key={l.id} style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <AdAvatar name={l.name} size={36} tone="stone" />
                    <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{l.name}</div><div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>{l.title || "Attorney"}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink-900)" }}>{cs.length} cases</div><div style={{ fontSize: 12, color: "var(--ink-500)" }}>{window.DB.fmtMoney(amt)}</div></div>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "var(--ink-100)", marginTop: 9, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: "var(--stone-500)", width: (grown ? cs.length / maxC * 100 : 0) + "%", transition: "width .9s cubic-bezier(.16,1,.3,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AdCard>

        <AdCard padding="lg">
          <AdCH eyebrow="Activity" title="Daily updates" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {acts.map((a) => (
              <div key={a.id} style={{ display: "flex", gap: 10 }}>
                <span style={{ marginTop: 4, width: 7, height: 7, borderRadius: "50%", background: "var(--stone-500)", flex: "none" }} />
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-700)", lineHeight: 1.45 }}><b>{a.actor}</b> {a.action}{a.target && <> · <span style={{ color: "var(--ink-500)" }}>{a.target}</span></>}<div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-400)", marginTop: 1 }}>{new Date(a.ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div></div>
              </div>
            ))}
          </div>
        </AdCard>
      </div>
    </AdWrap>
  );
}

/* ---- user management ---- */
function Users() {
  adRefresh();
  const toast = adToast();
  const [dlg, setDlg] = React.useState(false);
  const [f, setF] = React.useState({ name: "", email: "", password: "", role: "lawyer", title: "" });
  const users = window.DB.users();
  function add() {
    if (!f.name.trim() || !f.email.trim() || !f.password.trim()) { toast({ tone: "warning", icon: "alert-triangle", title: "Please complete all fields" }); return; }
    if (users.some((u) => u.email.toLowerCase() === f.email.toLowerCase().trim())) { toast({ tone: "danger", icon: "alert-circle", title: "Email already exists" }); return; }
    window.DB.addUser({ name: f.name.trim(), email: f.email.trim(), password: f.password.trim(), role: f.role, title: f.title.trim() });
    setDlg(false); setF({ name: "", email: "", password: "", role: "lawyer", title: "" });
    toast({ tone: "success", icon: "user-plus", title: "Account created", msg: f.name });
  }
  const roleTone = { admin: "danger", lawyer: "accent", client: "info" };
  return (
    <AdWrap>
      <AdSec eyebrow="Accounts" title={`User management (${users.length})`} right={<AdBtn variant="primary" iconLeft={<AdIco n="user-plus" s={16} />} onClick={() => setDlg(true)}>New account</AdBtn>} />
      <AdCard padding="none">
        <AdTable rowKey="id"
          columns={[
            { key: "name", label: "Name", render: (v, r) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><AdAvatar name={v} size={30} tone={r.role === "client" ? "navy" : "stone"} />{v}</span> },
            { key: "email", label: "Email", render: (v) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-600)" }}>{v}</span> },
            { key: "role", label: "Role", render: (v) => <AdBadge tone={roleTone[v]}>{window.DB.ROLE_LABEL[v]}</AdBadge> },
            { key: "title", label: "Title", render: (v) => v || "—" },
            { key: "id", label: "", align: "right", render: (v, r) => r.role !== "admin" ? <button onClick={() => { if (confirm("Delete account " + r.name + "?")) { window.DB.deleteUser(v); toast({ tone: "neutral", icon: "trash-2", title: "Deleted" }); } }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)" }}><AdIco n="trash-2" s={16} /></button> : <span style={{ fontSize: 12, color: "var(--ink-300)" }}>—</span> },
          ]}
          rows={users} />
      </AdCard>

      <AdDialog open={dlg} onClose={() => setDlg(false)} title="New account" description="Create a login for an attorney or client." width={460}
        footer={<><AdBtn variant="ghost" onClick={() => setDlg(false)}>Cancel</AdBtn><AdBtn variant="primary" onClick={add} iconLeft={<AdIco n="check" s={16} />}>Create</AdBtn></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <AdEdit label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <AdEdit label="Role" value={f.role} onChange={(v) => setF({ ...f, role: v })} options={["lawyer", "client", "admin"]} />
            <AdEdit label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} />
          </div>
          <AdEdit label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} type="email" />
          <AdEdit label="Initial password" value={f.password} onChange={(v) => setF({ ...f, password: v })} />
        </div>
      </AdDialog>
    </AdWrap>
  );
}

/* ---- assignment + visibility ---- */
function Assignments({ onOpen }) {
  adRefresh();
  const toast = adToast();
  const clients = window.DB.clientsFor({ role: "admin" });
  const lawyers = window.DB.lawyers();
  return (
    <AdWrap>
      <AdSec eyebrow="Permissions & visibility" title="Client assignment" />
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-600)", margin: 0, maxWidth: 620, lineHeight: 1.55 }}>
        Each attorney can only see clients assigned to them. Adjust ownership here to control who can view a case.
      </p>
      <AdCard padding="none">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-ui)" }}>
            <thead><tr>{["Client", "Matter", "Overseas", "Handling attorney (visible to)", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-500)", borderBottom: "1px solid var(--border-default)", background: "var(--ink-50)" }}>{h}</th>)}</tr></thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < clients.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <td style={{ padding: "11px 16px", fontSize: 13.5, color: "var(--ink-900)", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "11px 16px", fontSize: 13.5, color: "var(--ink-600)" }}>{c.matterType}</td>
                  <td style={{ padding: "11px 16px" }}>{c.overseas ? <AdBadge tone="warning">Overseas</AdBadge> : <span style={{ color: "var(--ink-400)", fontSize: 13 }}>Domestic</span>}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <select value={c.lawyerId || ""} onChange={(e) => { window.DB.assign(c.id, e.target.value); toast({ tone: "success", icon: "user-check", title: "Ownership updated", msg: c.name }); }}
                      style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "6px 10px", color: "var(--ink-800)", minWidth: 160 }}>
                      <option value="">— Unassigned —</option>
                      {lawyers.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "11px 16px", textAlign: "right" }}><AdBtn size="sm" variant="ghost" iconRight={<AdIco n="arrow-right" s={14} />} onClick={() => onOpen(c.id)}>View</AdBtn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdCard>
    </AdWrap>
  );
}

/* ---- full activity log ---- */
function ActivityLog() {
  adRefresh();
  const acts = window.DB.activity();
  return (
    <AdWrap>
      <AdSec eyebrow="Audit" title="Activity log" />
      <AdCard padding="lg">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {acts.map((a, i) => (
            <div key={a.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < acts.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: "var(--stone-100)", color: "var(--stone-700)", flex: "none" }}><AdIco n="activity" s={15} /></span>
              <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-800)" }}><b>{a.actor}</b> {a.action}{a.target && <> · <span style={{ color: "var(--ink-500)" }}>{a.target}</span></>}</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-400)", marginTop: 2 }}>{new Date(a.ts).toLocaleString("en-US")}</div></div>
            </div>
          ))}
        </div>
      </AdCard>
    </AdWrap>
  );
}

window.BergAdmin = { AdminApp };
