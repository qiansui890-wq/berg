/* Berg PC Platform — extra features: Analytics (admin) + Education (client).
   Exposes window.BergAnalytics and window.BergEducation. */
const DSX = window.BergPCDesignSystem_eb13e3;
const { Card: XCard, CardHeader: XCH, Stat: XStat, Badge: XBadge } = DSX;
const { Ico: XIco, refreshIcons: xRefresh, PageWrap: XWrap, SectionTitle: XSec } = window.BergUI;

/* ---------------- Admin Analytics dashboard ---------------- */
function Analytics({ user }) {
  xRefresh();
  const clients = window.DB.clientsFor({ role: "admin" });
  const lawyers = window.DB.lawyers();
  const n = clients.length || 1;
  const recovered = clients.filter((c) => c.status === "Recovered");
  const closed = clients.filter((c) => c.status === "Closed");
  const recoveryRate = Math.round((recovered.length / n) * 100);
  const atIssue = clients.reduce((s, c) => s + (+c.amountLost || 0), 0);
  const recoveredAmt = recovered.reduce((s, c) => s + (+c.amountLost || 0), 0);
  const pipeline = clients.filter((c) => !["Recovered", "Closed", "Intake"].includes(c.status)).reduce((s, c) => s + (+c.amountLost || 0), 0);
  const CONTINGENCY = 0.30;
  const projected = Math.round((recoveredAmt + pipeline * 0.5) * CONTINGENCY);
  const avgDays = Math.round(clients.reduce((s, c) => s + Math.max(1, (Date.now() - new Date(c.createdAt)) / 86400000), 0) / n);
  const overseas = clients.filter((c) => c.overseas).length;

  // case-type mix
  const typeMap = {};
  clients.forEach((c) => { typeMap[c.matterType] = (typeMap[c.matterType] || 0) + 1; });
  const types = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);
  // stage funnel
  const stageMap = window.DB.STAGES.map((s) => ({ s, n: clients.filter((c) => c.status === s).length }));
  const stageTone = { "Intake": "var(--ink-300)", "Investigating": "var(--info-500)", "Filed": "var(--stone-500)", "Frozen": "var(--warning-500)", "Recovered": "var(--success-500)", "Closed": "var(--ink-500)" };
  const typeColors = ["var(--navy-700)", "var(--stone-500)", "var(--info-500)", "var(--warning-500)", "var(--success-500)", "var(--ink-400)"];

  const [grown, setGrown] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setGrown(true), 70); return () => clearTimeout(t); }, []);

  const kpis = [
    ["Recovery rate", recoveryRate + "%", "trending-up", recovered.length + " of " + clients.length + " recovered"],
    ["Recovered to date", window.DB.fmtMoney(recoveredAmt), "badge-check", "across " + recovered.length + " cases"],
    ["Projected fees", window.DB.fmtMoney(projected), "scale", "~30% contingency"],
    ["Avg. case age", avgDays + " days", "clock", "open cases"],
  ];

  return (
    <XWrap>
      <XSec eyebrow="Console" title="Analytics" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {kpis.map(([l, v, ic, cap]) => (
          <XCard key={l} padding="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ minWidth: 0 }}><XStat label={l} value={v} caption={cap} /></div>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)", flex: "none" }}><XIco n={ic} s={19} /></span>
            </div>
          </XCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start" }}>
        {/* case type mix */}
        <XCard padding="lg">
          <XCH eyebrow="Portfolio" title="Case-type mix" />
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {types.map(([t, c], i) => (
              <div key={t}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 13.5, marginBottom: 5 }}>
                  <span style={{ color: "var(--ink-800)", fontWeight: 500 }}>{t}</span><span style={{ color: "var(--ink-500)" }}>{c}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--ink-100)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: typeColors[i % typeColors.length], width: (grown ? (c / n) * 100 : 0) + "%", transition: "width .9s cubic-bezier(.16,1,.3,1) " + (i * 0.08) + "s" }} />
                </div>
              </div>
            ))}
          </div>
        </XCard>

        {/* stage funnel */}
        <XCard padding="lg">
          <XCH eyebrow="Pipeline" title="Cases by stage" />
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {stageMap.map(({ s, n: cnt }, i) => {
              const max = Math.max(1, ...stageMap.map((x) => x.n));
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 92, fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--ink-600)", textAlign: "right", flex: "none" }}>{s}</span>
                  <div style={{ flex: 1, height: 22, borderRadius: 4, background: "var(--ink-50)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: stageTone[s], width: (grown ? (cnt / max) * 100 : 0) + "%", transition: "width .9s cubic-bezier(.16,1,.3,1) " + (i * 0.07) + "s" }} />
                  </div>
                  <span style={{ width: 22, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-800)", flex: "none" }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </XCard>
      </div>

      {/* lawyer performance */}
      <XCard padding="none">
        <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, margin: 0, color: "var(--ink-900)" }}>Attorney performance</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-ui)" }}>
            <thead><tr>{["Attorney", "Cases", "At issue", "Recovered", "Rate"].map((h, i) => <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "11px 18px", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-500)", borderBottom: "1px solid var(--border-default)", background: "var(--ink-50)" }}>{h}</th>)}</tr></thead>
            <tbody>
              {lawyers.map((l, i) => {
                const cs = window.DB.clientsFor(l);
                const rec = cs.filter((c) => c.status === "Recovered");
                const ai = cs.reduce((s, c) => s + (+c.amountLost || 0), 0);
                const rc = rec.reduce((s, c) => s + (+c.amountLost || 0), 0);
                const rate = cs.length ? Math.round((rec.length / cs.length) * 100) : 0;
                return (
                  <tr key={l.id} style={{ borderBottom: i < lawyers.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <td style={{ padding: "12px 18px", fontSize: 13.5, color: "var(--ink-900)", fontWeight: 500 }}>{l.name}</td>
                    <td style={{ padding: "12px 18px", fontSize: 13.5, color: "var(--ink-700)", textAlign: "right" }}>{cs.length}</td>
                    <td style={{ padding: "12px 18px", fontSize: 13.5, color: "var(--ink-700)", textAlign: "right" }}>{window.DB.fmtMoney(ai)}</td>
                    <td style={{ padding: "12px 18px", fontSize: 13.5, color: "var(--success-700)", textAlign: "right", fontWeight: 600 }}>{window.DB.fmtMoney(rc)}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}><XBadge tone={rate >= 50 ? "success" : rate > 0 ? "warning" : "neutral"}>{rate}%</XBadge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </XCard>

      <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-400)", textAlign: "center" }}>
        Projected fees assume a 30% contingency on recovered funds plus 50%-weighted active pipeline. Indicative only.
      </div>
    </XWrap>
  );
}

/* ---------------- Client Education / FAQ ---------------- */
function Education() {
  xRefresh();
  const [open, setOpen] = React.useState(0);
  const faqs = [
    ["Can my stolen crypto really be recovered?", "Sometimes — it depends on where the funds went and how quickly we act. We trace the assets, and if they reach a regulated exchange or identifiable wallet, we can pursue freezing and recovery through the courts. We'll give you an honest assessment after reviewing your case."],
    ["How long does recovery take?", "It varies. Tracing and identifying funds takes days to weeks; freezing and litigation can take months. Cross-border cases take longer. Your case page shows the current stage and what's next."],
    ["What does it cost?", "We work on a contingency basis for recovery matters — no recovery, no fee. We never ask for upfront payment to 'release' your funds. Anyone who does is running a scam."],
    ["Why can't you guarantee recovery?", "No honest firm can. Criminals move fast and some funds are unrecoverable. We can guarantee a rigorous, evidence-led effort — not an outcome."],
    ["What should I send you?", "Anything documenting the loss: transaction IDs, wallet addresses, bank/wire records, screenshots of chats, and the platform or app involved. Upload them under 'My Documents'."],
  ];
  const warnings = [
    ["shield-alert", "Never pay an upfront 'recovery fee'", "Berg PC is paid only from recovered funds. A demand for money to unlock or recover your assets is always a scam."],
    ["user-x", "Beware of 'recovery agents' who contact you", "Scammers target victims a second time, posing as recovery experts or even government agencies. Verify independently before trusting anyone."],
    ["lock", "We will never ask for your seed phrase", "Your recovery phrase or private keys are never needed for our work. Anyone asking for them is trying to steal what's left."],
  ];
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "30px 26px 60px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--stone-600)" }}>Help &amp; Safety</div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, margin: "8px 0 18px", color: "var(--ink-900)" }}>Understanding your case</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 30 }}>
        {warnings.map(([ic, t, d]) => (
          <div key={t} style={{ display: "flex", gap: 13, background: "var(--warning-100)", borderLeft: "3px solid var(--warning-500)", borderRadius: "var(--radius-md)", padding: "15px 16px" }}>
            <span style={{ color: "var(--warning-700)", flex: "none", marginTop: 1 }}><XIco n={ic} s={19} /></span>
            <div><div style={{ fontFamily: "var(--font-ui)", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 3 }}>{t}</div><div style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.55 }}>{d}</div></div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone-600)", marginBottom: 12 }}>Frequently asked</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {faqs.map(([q, a], i) => (
          <div key={i} style={{ border: "1px solid var(--ink-100)", borderRadius: "var(--radius-md)", background: "var(--white)", overflow: "hidden" }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, border: "none", background: "none", padding: "15px 16px", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-ui)", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)" }}>
              {q}<span style={{ flex: "none", transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--ink-400)" }}><XIco n="chevron-down" s={18} /></span>
            </button>
            {open === i && <div style={{ padding: "0 16px 16px", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-600)", lineHeight: 1.6 }}>{a}</div>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 26, background: "var(--navy-900)", borderRadius: "var(--radius-lg)", padding: "22px 24px", color: "var(--cream)" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, marginBottom: 6 }}>Still have a question?</div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--navy-100)", lineHeight: 1.55 }}>Use <b style={{ color: "var(--cream)" }}>Secure messages</b> to ask your handling attorney directly — it's confidential and goes straight to your team.</div>
      </div>
    </div>
  );
}

/* ---------------- Lawyer: document generator ---------------- */
function DocGen({ client, user }) {
  xRefresh();
  const toast = window.BergUI.useToast();
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const wallets = client.wallets || [];
  const walletRows = wallets.map((w) => `<tr><td style="font-family:monospace;font-size:12px">${w.addr}</td><td>${w.role}</td><td>${w.usd || w.balance || "—"}</td></tr>`).join("");

  const templates = [
    { id: "demand", icon: "mail", title: "Demand letter", desc: "Formal demand to an identified party to return misappropriated assets.",
      body: () => `
        <p>${today}</p>
        <p><b>RE: Demand for Return of Misappropriated Digital Assets — Matter ${client.id.toUpperCase()}</b></p>
        <p>To Whom It May Concern:</p>
        <p>This firm represents ${client.name} in connection with the theft of cryptocurrency assets valued at approximately ${window.DB.fmtMoney(client.amountLost)}, occurring on or about ${client.dateOfLoss || "[date]"} via ${client.platform || "[platform]"}.</p>
        <p>Our forensic investigation has traced the movement of these assets across the blockchain. Demand is hereby made for the immediate return of all misappropriated funds. Should you fail to respond within ten (10) business days, we are prepared to pursue all available legal and equitable remedies, including injunctive relief.</p>
        <p>Sincerely,<br/>${user.name}<br/>Berg PC · 24 Greenway Plaza, Suite 1800, Houston, Texas 77046</p>` },
    { id: "freeze", icon: "snowflake", title: "Application to freeze wallets", desc: "Petition supporting an injunction freezing the identified wallets.",
      body: () => `
        <p>${today}</p>
        <p><b>APPLICATION FOR TEMPORARY RESTRAINING ORDER — Matter ${client.id.toUpperCase()}</b></p>
        <p>Applicant ${client.name} respectfully moves this Court for an order freezing the digital asset wallets identified below, which our forensic tracing has linked to the misappropriation of Applicant's funds (${window.DB.fmtMoney(client.amountLost)}).</p>
        <table style="width:100%;border-collapse:collapse;margin:10px 0"><tr><th align="left">Wallet address</th><th align="left">Role</th><th align="left">Value</th></tr>${walletRows || '<tr><td colspan=3>[wallets pending]</td></tr>'}</table>
        <p>Absent immediate relief, these assets are likely to be dissipated beyond recovery. Applicant therefore requests that the Court enjoin any transfer from the above addresses pending further proceedings.</p>
        <p>Respectfully submitted,<br/>${user.name}, Counsel for Applicant</p>` },
    { id: "forensic", icon: "file-search", title: "Forensic tracing summary", desc: "Chain-of-funds summary suitable for enforcement referral.",
      body: () => `
        <p>${today}</p>
        <p><b>BLOCKCHAIN FORENSIC SUMMARY — Matter ${client.id.toUpperCase()}</b></p>
        <p><b>Subject:</b> ${client.name} &nbsp; <b>Loss:</b> ${window.DB.fmtMoney(client.amountLost)} &nbsp; <b>Date:</b> ${client.dateOfLoss || "—"}</p>
        <p>The following wallets were identified in the flow of funds originating from the victim's account. Tracing was performed across ${wallets.length} hop(s), including pass-through, mixing, and off-ramp addresses.</p>
        <table style="width:100%;border-collapse:collapse;margin:10px 0"><tr><th align="left">Wallet address</th><th align="left">Role</th><th align="left">Value</th></tr>${walletRows || '<tr><td colspan=3>[wallets pending]</td></tr>'}</table>
        <p>Recovery strategies under consideration: ${(client.strategies || []).map((s) => { const st = window.DB.strategyById(s); return st ? st.label : s; }).join("; ") || "—"}.</p>
        <p>Prepared by ${user.name}, Berg PC. For authorized use only.</p>` },
  ];

  function open(tpl) {
    const w = window.open("", "_blank");
    if (!w) { toast({ tone: "warning", icon: "alert-triangle", title: "Please allow pop-ups" }); return; }
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${tpl.title} — ${client.name}</title>
      <style>body{font-family:Georgia,serif;color:#1A1714;max-width:720px;margin:48px auto;padding:0 28px;line-height:1.7;font-size:15px}
      .ey{font-family:Arial;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8A7B66}
      hr{border:0;border-top:3px solid #8A7B66;width:54px;margin:14px 0 22px}
      table td,table th{border-bottom:1px solid #ddd;padding:6px 8px;font-family:Arial;font-size:12.5px}
      b{color:#16202E}</style></head><body>
      <div class="ey">Berg PC · Confidential Draft</div><hr>${tpl.body()}
      <p style="font-family:Arial;font-size:11px;color:#8C867D;margin-top:34px">Auto-generated draft — review and adapt before filing or sending. Not legal advice until reviewed by counsel.</p>
      <script>setTimeout(()=>window.print(),350)<\/script></body></html>`);
    w.document.close();
    window.DB.addTimeline(client.id, { icon: tpl.icon, text: "Generated draft: " + tpl.title }, user.name);
    toast({ tone: "success", icon: "file-down", title: "Draft generated", msg: "Print or save as PDF in the new tab." });
  }

  return (
    <div>
      <div style={{ fontSize: 13.5, color: "var(--ink-500)", fontFamily: "var(--font-ui)", marginBottom: 14 }}>Auto-fill legal drafts from this case's data, then print or save as PDF.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {templates.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid var(--ink-100)", borderRadius: "var(--radius-md)", background: "var(--white)", padding: "15px 16px" }}>
            <span style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><XIco n={t.icon} s={20} /></span>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{t.title}</div><div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-500)", lineHeight: 1.45 }}>{t.desc}</div></div>
            <button onClick={() => open(t)} style={{ border: "1px solid var(--border-strong)", background: "var(--white)", color: "var(--ink-900)", borderRadius: "var(--radius-sm)", padding: "9px 15px", fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", flex: "none", display: "inline-flex", alignItems: "center", gap: 7 }}><XIco n="printer" s={15} /> Generate</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Lawyer: blockchain explorer (API-ready + mock) ---------------- */
function Explorer({ client }) {
  xRefresh();
  const [addr, setAddr] = React.useState((client.wallets && client.wallets[0] && client.wallets[0].addr) || "");
  const [data, setData] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [live, setLive] = React.useState(false);

  function mock(a) {
    let h = 0; for (let i = 0; i < a.length; i++) h = (h * 31 + a.charCodeAt(i)) >>> 0;
    const isBtc = /^(bc1|[13])/.test(a);
    const bal = ((h % 90000) / 1000 + 0.3).toFixed(4);
    const txc = (h % 480) + 3;
    const usd = Math.round(bal * (isBtc ? 64000 : 3400));
    const txs = Array.from({ length: 5 }, (_, i) => {
      const hh = (h + i * 2654435761) >>> 0;
      return { hash: (isBtc ? "" : "0x") + hh.toString(16).padStart(8, "0") + "…" + ((hh * 7) >>> 0).toString(16).slice(0, 6), val: ((hh % 40000) / 1000).toFixed(4), dir: hh % 2 ? "in" : "out", age: (hh % 60) + "d ago" };
    });
    return { isBtc, bal, txc, usd, txs };
  }

  async function lookup() {
    if (!addr.trim()) return;
    setBusy(true); setData(null); setLive(false);
    const a = addr.trim();
    try {
      const isBtc = /^(bc1|[13])/.test(a);
      const url = isBtc
        ? "https://api.blockchair.com/bitcoin/dashboards/address/" + a
        : "https://api.blockchair.com/ethereum/dashboards/address/" + a;
      const res = await fetch(url);
      if (!res.ok) throw new Error("api");
      const j = await res.json();
      const d = j.data && j.data[a];
      if (!d) throw new Error("nodata");
      const addrInfo = d.address || {};
      setData({
        isBtc,
        bal: isBtc ? (addrInfo.balance / 1e8).toFixed(4) : (addrInfo.balance / 1e18).toFixed(4),
        txc: addrInfo.transaction_count || (d.transactions ? d.transactions.length : 0),
        usd: Math.round(addrInfo.balance_usd || 0),
        txs: (d.transactions || []).slice(0, 5).map((t) => ({ hash: (typeof t === "string" ? t : t.hash || "").slice(0, 12) + "…", val: "—", dir: "—", age: "" })),
      });
      setLive(true);
    } catch (e) {
      setData(mock(a)); setLive(false);
    } finally { setBusy(false); }
  }

  const roleColor = { tainted: "var(--trace-tainted)", hop: "var(--trace-hop)", exchange: "var(--trace-exchange)", mixer: "var(--trace-mixer)", frozen: "var(--trace-frozen)" };
  return (
    <div>
      <div style={{ fontSize: 13.5, color: "var(--ink-500)", fontFamily: "var(--font-ui)", marginBottom: 12 }}>Paste any wallet address to look up its balance and recent activity.</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={addr} onChange={(e) => setAddr(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") lookup(); }} placeholder="bc1q… or 0x…"
          style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 13.5, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "11px 13px", outline: "none", color: "var(--ink-900)" }} />
        <button onClick={lookup} disabled={busy} style={{ border: "none", background: "var(--ink-900)", color: "var(--cream)", borderRadius: "var(--radius-sm)", padding: "0 18px", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}><XIco n={busy ? "loader" : "search"} s={16} /> {busy ? "…" : "Look up"}</button>
      </div>

      {client.wallets && client.wallets.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
          {client.wallets.map((w, i) => (
            <button key={i} onClick={() => { setAddr(w.addr); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid var(--border-default)", background: "var(--white)", borderRadius: "var(--radius-pill)", padding: "5px 11px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-700)", cursor: "pointer" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: roleColor[w.role] || "var(--ink-400)" }} />{w.addr.slice(0, 8)}…{w.addr.slice(-4)}
            </button>
          ))}
        </div>
      )}

      {data && (
        <div style={{ border: "1px solid var(--ink-100)", borderRadius: "var(--radius-lg)", background: "var(--white)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--ink-100)" }}>
            {[["Balance", data.bal + " " + (data.isBtc ? "BTC" : "ETH")], ["Approx. USD", "$" + Number(data.usd).toLocaleString("en-US")], ["Transactions", data.txc]].map(([l, v], i) => (
              <div key={l} style={{ flex: 1, padding: "16px 18px", borderLeft: i ? "1px solid var(--ink-100)" : "none" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-500)" }}>{l}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--ink-900)", marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 18px" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 8 }}>Recent transactions</div>
            {data.txs.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i ? "1px solid var(--ink-50)" : "none", fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                <span style={{ color: t.dir === "in" ? "var(--success-600)" : t.dir === "out" ? "var(--danger-500)" : "var(--ink-400)", flex: "none" }}>{t.dir === "in" ? "↓" : t.dir === "out" ? "↑" : "·"}</span>
                <span style={{ flex: 1, color: "var(--ink-700)", overflow: "hidden", textOverflow: "ellipsis" }}>{t.hash}</span>
                <span style={{ color: "var(--ink-600)" }}>{t.val !== "—" ? t.val : ""}</span>
                <span style={{ color: "var(--ink-400)", width: 56, textAlign: "right" }}>{t.age}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 18px", background: live ? "var(--success-100)" : "var(--ink-50)", fontFamily: "var(--font-ui)", fontSize: 12, color: live ? "var(--success-700)" : "var(--ink-500)", display: "flex", alignItems: "center", gap: 7 }}>
            <XIco n={live ? "wifi" : "info"} s={14} /> {live ? "Live data from Blockchair." : "Demo figures (live blockchain API blocked offline — works once deployed)."}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BergAnalytics: Analytics, BergEducation: Education, BergDocGen: DocGen, BergExplorer: Explorer, BergTasks: Tasks });

/* ---------------- Lawyer: tasks & deadlines ---------------- */
function Tasks({ client, user }) {
  xRefresh();
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [title, setTitle] = React.useState("");
  const [due, setDue] = React.useState("");
  const tasks = window.DB.tasksFor(client.id).slice().sort((a, b) => (a.due || "9999") < (b.due || "9999") ? -1 : 1);
  const today = new Date().toISOString().slice(0, 10);
  function add() { if (!title.trim()) return; window.DB.addTask(client.id, { title, due }, user.name); setTitle(""); setDue(""); force(); }
  const fld = { fontFamily: "var(--font-ui)", fontSize: 14, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "10px 12px", outline: "none", color: "var(--ink-900)" };
  function meta(t) {
    if (t.done) return ["Done", "var(--success-700)", "var(--success-100)"];
    if (!t.due) return ["No date", "var(--ink-500)", "var(--ink-50)"];
    if (t.due < today) return ["Overdue", "var(--danger-700)", "var(--danger-100)"];
    if (t.due === today) return ["Due today", "var(--warning-700)", "var(--warning-100)"];
    const days = Math.round((new Date(t.due) - new Date(today)) / 86400000);
    return ["In " + days + "d", "var(--ink-600)", "var(--ink-50)"];
  }
  return (
    <div>
      <div style={{ fontSize: 13.5, color: "var(--ink-500)", fontFamily: "var(--font-ui)", marginBottom: 14 }}>Track deadlines and follow-ups for this case — statute dates, court filings, client check-ins.</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder="New task — e.g. File TRO application" style={{ ...fld, flex: 1 }} />
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={{ ...fld, width: 150 }} />
        <button onClick={add} style={{ border: "none", background: "var(--ink-900)", color: "var(--cream)", borderRadius: "var(--radius-sm)", padding: "0 16px", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tasks.map((t) => {
          const [lbl, fg, bg] = meta(t);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid var(--ink-100)", borderRadius: "var(--radius-md)", background: "var(--white)", padding: "12px 14px" }}>
              <button onClick={() => { window.DB.toggleTask(client.id, t.id); force(); }} style={{ width: 22, height: 22, borderRadius: "var(--radius-xs)", border: "1.5px solid " + (t.done ? "var(--success-500)" : "var(--border-strong)"), background: t.done ? "var(--success-500)" : "var(--white)", cursor: "pointer", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                {t.done && <XIco n="check" s={13} c="#fff" />}
              </button>
              <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 14.5, color: t.done ? "var(--ink-400)" : "var(--ink-900)", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: bg, color: fg }}>{lbl}{t.due && !t.done ? " · " + t.due : ""}</span>
              <button onClick={() => { window.DB.removeTask(client.id, t.id); force(); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-300)" }}><XIco n="x" s={16} /></button>
            </div>
          );
        })}
        {!tasks.length && <div style={{ textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 14, padding: "30px 0" }}>No tasks yet.</div>}
      </div>
    </div>
  );
}
