/* Berg PC Platform — case detail (editable). Exports window.BergCase.CaseDetail */
const DSC = window.BergPCDesignSystem_eb13e3;
const { Button: CBtn, Badge: CBadge, Tabs: CTabs, Card: CCard, Stat: CStat, AddressChip: CAddr, Dialog: CDialog, Input: CInput, Checkbox: CCheck } = DSC;
const { Ico: CIco, refreshIcons: cRefresh, StageBadge: CStage, EditRow, useToast, MessageThread: CMsg, NotesPanel: CNotes, UploadButton: CUpload, downloadDoc: CDownload, canDownload: CCanDl } = window.BergUI;
const { TraceGraph: CTrace, TraceLegend: CLegend, Inspector: CInspector, ROLE_LABEL: CWalletRole } = window.BergTraceI;

function CaseDetail({ client, user, onBack, readOnly }) {
  const toast = useToast();
  const [tab, setTab] = React.useState("profile");
  const [draft, setDraft] = React.useState(client);
  const [dirty, setDirty] = React.useState(false);
  const [sel, setSel] = React.useState(null);
  const [freezeFor, setFreezeFor] = React.useState(null);
  const [walletDlg, setWalletDlg] = React.useState(false);
  React.useEffect(() => { setDraft(client); setDirty(false); }, [client.id, client.updatedAt]);
  cRefresh();

  const editable = !readOnly && (user.role === "lawyer" || user.role === "admin");
  const set = (patch) => { setDraft((d) => ({ ...d, ...patch })); setDirty(true); };

  function saveProfile() {
    window.DB.updateClient(client.id, {
      name: draft.name, email: draft.email, phone: draft.phone, address: draft.address, dob: draft.dob,
      occupation: draft.occupation, idType: draft.idType, idNumber: draft.idNumber, matterType: draft.matterType,
      amountLost: Number(draft.amountLost) || 0, currency: draft.currency, dateOfLoss: draft.dateOfLoss,
      platform: draft.platform, fundsMethod: draft.fundsMethod, jurisdiction: draft.jurisdiction,
      overseas: draft.overseas, narrative: draft.narrative,
    }, user.name);
    setDirty(false); toast({ tone: "success", icon: "check-circle", title: "Saved", msg: "Client profile and case details updated." });
  }

  function doFreeze(wallet) {
    const w = client.wallets.map((x) => x.addr === wallet.addr ? { ...x, role: "frozen" } : x);
    window.DB.updateClient(client.id, { wallets: w }, user.name);
    window.DB.addTimeline(client.id, { icon: "snowflake", text: "Initiated freeze / cooperation on " + (wallet.label || wallet.addr.slice(0, 10)) }, user.name);
    setFreezeFor(null); toast({ tone: "success", icon: "snowflake", title: "Freeze initiated", msg: "Wallet marked as frozen and logged to the timeline." });
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <CIco n="user" s={15} /> },
    { id: "trace", label: "Fund flow", icon: <CIco n="git-branch" s={15} /> },
    { id: "wallets", label: "Wallets", icon: <CIco n="wallet" s={15} /> },
    { id: "strategy", label: "Recovery strategy", icon: <CIco n="target" s={15} /> },
    { id: "evidence", label: "Evidence", icon: <CIco n="folder-lock" s={15} /> },
    ...(editable ? [{ id: "drafts", label: "Drafts", icon: <CIco n="file-pen" s={15} /> }, { id: "explorer", label: "Explorer", icon: <CIco n="radar" s={15} /> }, { id: "tasks", label: "Tasks", icon: <CIco n="list-checks" s={15} /> }] : []),
    { id: "messages", label: "Messages", icon: <CIco n="message-circle" s={15} /> },
    { id: "notes", label: "Internal notes", icon: <CIco n="sticky-note" s={15} /> },
    { id: "timeline", label: "Timeline", icon: <CIco n="clock" s={15} /> },
  ];

  return (
    <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-500)", display: "inline-flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 10 }}><CIco n="arrow-left" s={15} /> Back to list</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, margin: 0, color: "var(--ink-900)" }}>{client.name || "Unnamed client"}</h2>
            <CStage s={client.status} />
            {client.overseas && <CBadge tone="warning" iconLeft={<CIco n="globe" s={12} />}>Overseas</CBadge>}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-500)", marginTop: 5 }}>{client.id.toUpperCase()} · {client.matterType}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {editable && <StageMenu client={client} user={user} toast={toast} />}
          <CBtn variant="secondary" iconLeft={<CIco n="file-down" s={16} />} onClick={() => exportReport(client, toast)}>Export report</CBtn>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
        <CCard padding="md"><CStat label="Amount at issue" value={window.DB.fmtMoney(client.amountLost)} /></CCard>
        <CCard padding="md"><CStat label="Wallets" value={client.wallets.length} caption="addresses" /></CCard>
        <CCard padding="md"><CStat label="Strategies" value={client.strategies.length} caption="selected" /></CCard>
        <CCard padding="md"><CStat label="Evidence" value={client.documents.length} caption="files" /></CCard>
      </div>

      <CCard padding="lg">
        <CTabs value={tab} onChange={setTab} items={tabs} />
        <div style={{ paddingTop: 18 }}>
          {tab === "profile" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <EditRow label="Name / entity" value={draft.name} onChange={(v) => set({ name: v })} readOnly={!editable} />
                <EditRow label="Email" value={draft.email} onChange={(v) => set({ email: v })} readOnly={!editable} />
                <EditRow label="Phone" value={draft.phone} onChange={(v) => set({ phone: v })} readOnly={!editable} />
                <EditRow label="ID type" value={draft.idType} onChange={(v) => set({ idType: v })} options={["Driver's License", "Passport", "ID Card", "Business License"]} readOnly={!editable} />
                <EditRow label="ID number" value={draft.idNumber} onChange={(v) => set({ idNumber: v })} readOnly={!editable} />
                <EditRow label="Date of birth" value={draft.dob} onChange={(v) => set({ dob: v })} type="date" readOnly={!editable} />
                <EditRow label="Occupation" value={draft.occupation} onChange={(v) => set({ occupation: v })} readOnly={!editable} />
                <EditRow label="Address" value={draft.address} onChange={(v) => set({ address: v })} readOnly={!editable} />
                <EditRow label="Matter type" value={draft.matterType} onChange={(v) => set({ matterType: v })} options={["Crypto Fraud", "Coinbase Data Breach", "Meta Scam Ads", "Crypto Transaction Dispute", "Other"]} readOnly={!editable} />
                <EditRow label="Amount lost (USD)" value={draft.amountLost} onChange={(v) => set({ amountLost: v })} type="number" readOnly={!editable} />
                <EditRow label="Date of loss" value={draft.dateOfLoss} onChange={(v) => set({ dateOfLoss: v })} type="date" readOnly={!editable} />
                <EditRow label="Funds method" value={draft.fundsMethod} onChange={(v) => set({ fundsMethod: v })} options={["crypto", "wire", "both"]} readOnly={!editable} />
                <EditRow label="Platform involved" value={draft.platform} onChange={(v) => set({ platform: v })} readOnly={!editable} />
                <EditRow label="Jurisdiction / destination" value={draft.jurisdiction} onChange={(v) => set({ jurisdiction: v })} readOnly={!editable} />
                <label style={{ display: "flex", alignItems: "flex-end", paddingBottom: 9 }}>
                  {editable ? <CCheck checked={!!draft.overseas} onChange={(e) => set({ overseas: e.target.checked })} label="Overseas ring / no direct court freeze" />
                    : <span style={{ fontSize: 13, color: "var(--ink-600)" }}>{draft.overseas ? "Overseas case" : "Domestic case"}</span>}
                </label>
              </div>
              <div style={{ marginTop: 16 }}>
                <EditRow label="Case narrative" value={draft.narrative} onChange={(v) => set({ narrative: v })} textarea readOnly={!editable} />
              </div>
              {editable && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                  {dirty && <span style={{ alignSelf: "center", fontSize: 13, color: "var(--warning-700)" }}>● Unsaved changes</span>}
                  <CBtn variant="ghost" onClick={() => { setDraft(client); setDirty(false); }} disabled={!dirty}>Discard</CBtn>
                  <CBtn variant="primary" onClick={saveProfile} disabled={!dirty} iconLeft={<CIco n="save" s={16} />}>Save changes</CBtn>
                </div>
              )}
            </div>
          )}

          {tab === "trace" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>
              <div><CTrace wallets={client.wallets} selected={sel} onSelect={setSel} /><CLegend /></div>
              <CInspector wallet={client.wallets.find((w) => w.addr === sel)} canAct={editable} onFreeze={(w) => setFreezeFor(w)} />
            </div>
          )}

          {tab === "wallets" && <WalletsTab client={client} user={user} editable={editable} onAdd={() => setWalletDlg(true)} toast={toast} />}
          {tab === "strategy" && <StrategyTab client={client} user={user} editable={editable} toast={toast} />}
          {tab === "evidence" && <EvidenceTab client={client} user={user} editable={editable} toast={toast} />}
          {tab === "messages" && <CMsg client={client} user={user} />}
          {tab === "notes" && <CNotes client={client} user={user} />}
          {tab === "drafts" && <window.BergDocGen client={client} user={user} />}
          {tab === "explorer" && <window.BergExplorer client={client} />}
          {tab === "tasks" && <window.BergTasks client={client} user={user} />}
          {tab === "timeline" && <TimelineTab client={client} user={user} editable={editable} toast={toast} />}
        </div>
      </CCard>

      {/* freeze confirm */}
      <CDialog open={!!freezeFor} onClose={() => setFreezeFor(null)} title="Initiate freeze / cooperation"
        description={freezeFor ? "Initiate a freeze on wallet " + (freezeFor.label || freezeFor.addr.slice(0, 12)) + ". The selected recovery strategies will be advanced accordingly." : ""}
        footer={<><CBtn variant="ghost" onClick={() => setFreezeFor(null)}>Cancel</CBtn><CBtn variant="primary" onClick={() => doFreeze(freezeFor)} iconLeft={<CIco n="snowflake" s={16} />}>Confirm</CBtn></>}>
        {freezeFor && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-700)" }}>{freezeFor.addr}</div>}
      </CDialog>

      <AddWalletDialog open={walletDlg} onClose={() => setWalletDlg(false)} client={client} user={user} toast={toast} />
    </div>
  );
}

/* ---- stage menu ---- */
function StageMenu({ client, user, toast }) {
  const [open, setOpen] = React.useState(false);
  cRefresh();
  return (
    <div style={{ position: "relative" }}>
      <CBtn variant="secondary" iconRight={<CIco n="chevron-down" s={15} />} onClick={() => setOpen((o) => !o)}>Change stage</CBtn>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "var(--white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", zIndex: 30, width: 160, padding: 6 }}>
          {window.DB.STAGES.map((s) => (
            <button key={s} onClick={() => { window.DB.setStage(client.id, s, user.name); setOpen(false); toast({ tone: "info", icon: "flag", title: "Stage updated", msg: "Case stage: " + s }); }}
              style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, border: "none", background: client.status === s ? "var(--ink-50)" : "transparent", borderRadius: "var(--radius-sm)", padding: "8px 10px", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-800)", textAlign: "left" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--stone-500)" }}></span>{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- wallets tab ---- */
function WalletsTab({ client, editable, onAdd }) {
  cRefresh();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, color: "var(--ink-500)", fontFamily: "var(--font-ui)" }}>{client.wallets.length} address(es)</div>
        {editable && <CBtn size="sm" variant="primary" iconLeft={<CIco n="plus" s={15} />} onClick={onAdd}>Add wallet</CBtn>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {client.wallets.map((w) => (
          <div key={w.addr} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--white)" }}>
            <CAddr address={w.addr} role={w.role} />
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-700)" }}>{w.label || CWalletRole[w.role]}</span>
            <div style={{ flex: 1 }}></div>
            <CBadge tone={w.role === "frozen" ? "success" : w.role === "tainted" ? "danger" : "neutral"}>{CWalletRole[w.role]}</CBadge>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-800)", minWidth: 90, textAlign: "right" }}>{w.balance}</span>
          </div>
        ))}
        {!client.wallets.length && <div style={{ padding: 30, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 14 }}>No wallets yet. Click “Add wallet” to start building the fund-flow graph.</div>}
      </div>
    </div>
  );
}

function AddWalletDialog({ open, onClose, client, user, toast }) {
  const [addr, setAddr] = React.useState(""); const [label, setLabel] = React.useState(""); const [role, setRole] = React.useState("hop"); const [bal, setBal] = React.useState("");
  cRefresh();
  function add() {
    if (!addr.trim()) return;
    const w = [...client.wallets, { addr: addr.trim(), label: label.trim(), role, balance: bal.trim() || "—", usd: "" }];
    window.DB.updateClient(client.id, { wallets: w }, user.name);
    setAddr(""); setLabel(""); setBal(""); setRole("hop"); onClose();
    toast({ tone: "success", icon: "wallet", title: "Wallet added", msg: "Fund-flow graph updated." });
  }
  return (
    <CDialog open={open} onClose={onClose} title="Add wallet address" width={460}
      footer={<><CBtn variant="ghost" onClick={onClose}>Cancel</CBtn><CBtn variant="primary" onClick={add} iconLeft={<CIco n="plus" s={16} />}>Add</CBtn></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <EditRow label="Wallet address" value={addr} onChange={setAddr} />
        <EditRow label="Label" value={label} onChange={setLabel} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <EditRow label="Role" value={role} onChange={setRole} options={["tainted", "hop", "mixer", "exchange", "frozen"]} />
          <EditRow label="Balance" value={bal} onChange={setBal} />
        </div>
      </div>
    </CDialog>
  );
}

/* ---- recovery strategy multi-select ---- */
function StrategyTab({ client, user, editable, toast }) {
  const [sel, setSel] = React.useState(client.strategies);
  React.useEffect(() => setSel(client.strategies), [client.strategies]);
  cRefresh();
  const groups = {};
  window.DB.STRATEGIES.forEach((s) => { (groups[s.group] = groups[s.group] || []).push(s); });
  const toggle = (id) => setSel((x) => x.includes(id) ? x.filter((i) => i !== id) : [...x, id]);
  const dirty = JSON.stringify(sel) !== JSON.stringify(client.strategies);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-600)", margin: 0, maxWidth: 560, lineHeight: 1.55 }}>
          Select recovery paths for this case. Funds taken by <b>overseas rings</b> often cannot be frozen by a court directly — combine exchange cooperation, stablecoin issuer freezes, mutual legal assistance, and enforcement referrals.
        </p>
        {editable && <CBtn variant="primary" disabled={!dirty} iconLeft={<CIco n="save" s={16} />} onClick={() => { window.DB.setStrategies(client.id, sel, user.name); toast({ tone: "success", icon: "target", title: "Strategy saved", msg: "Updated " + sel.length + " recovery path(s)." }); }}>Save strategy</CBtn>}
      </div>
      {Object.keys(groups).map((g) => (
        <div key={g} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--stone-600)", marginBottom: 9 }}>{g}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {groups[g].map((s) => {
              const on = sel.includes(s.id);
              const disabled = s.domesticOnly && client.overseas;
              return (
                <button key={s.id} type="button" disabled={!editable || disabled} onClick={() => toggle(s.id)}
                  style={{ display: "flex", gap: 11, alignItems: "flex-start", textAlign: "left", padding: "13px 14px", borderRadius: "var(--radius-md)", cursor: editable && !disabled ? "pointer" : "default", opacity: disabled ? 0.5 : 1,
                    border: `1.5px solid ${on ? "var(--ink-900)" : "var(--border-default)"}`, background: on ? "var(--ink-50)" : "var(--white)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "var(--radius-sm)", flex: "none", background: on ? "var(--navy-900)" : "var(--stone-100)", color: on ? "var(--stone-300)" : "var(--stone-700)" }}><CIco n={s.icon} s={17} /></span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{s.label}{on && <CIco n="check" s={14} c="var(--success-600)" />}</span>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-500)", marginTop: 3, lineHeight: 1.45 }}>{disabled ? "(Not directly available for overseas cases)" : s.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- evidence vault ---- */
function EvidenceTab({ client, user, editable, toast }) {
  cRefresh();
  const icon = (t) => ({ pdf: "file-text", zip: "file-archive", csv: "file-spreadsheet", img: "file-image" })[t] || "file";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, color: "var(--ink-500)", fontFamily: "var(--font-ui)" }}>{client.documents.length} evidence file(s) · protected by attorney–client privilege</div>
        {(editable || user.role === "client") && <CUpload clientId={client.id} actorName={user.name} label="Upload evidence" variant="primary" />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {client.documents.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--white)" }}>
            <span style={{ color: "var(--stone-600)" }}><CIco n={icon(d.type)} s={19} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-800)" }}>{d.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-400)" }}>{d.size} · {d.uploadedBy}</div>
            </div>
            {CCanDl(d) && <button onClick={() => CDownload(d)} title="Download" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-500)" }}><CIco n="download" s={16} /></button>}
            {editable ? (
              <select value={d.status} onChange={(e) => window.DB.setDocStatus(client.id, d.id, e.target.value)} style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "4px 8px", color: "var(--ink-700)" }}>
                <option value="review">In review</option><option value="verified">Verified</option><option value="flagged">Flagged</option>
              </select>
            ) : <CBadge tone={d.status === "verified" ? "success" : "warning"}>{d.status === "verified" ? "Verified" : "In review"}</CBadge>}
            {editable && <button onClick={() => { window.DB.removeDoc(client.id, d.id); toast({ tone: "neutral", icon: "trash-2", title: "Deleted" }); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)" }}><CIco n="trash-2" s={16} /></button>}
          </div>
        ))}
        {!client.documents.length && <div style={{ padding: 30, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 14 }}>No evidence files yet.</div>}
      </div>
    </div>
  );
}

function UploadDialog({ open, onClose, client, user, toast }) {
  const [name, setName] = React.useState(""); const [type, setType] = React.useState("pdf"); const [size, setSize] = React.useState("");
  cRefresh();
  function add() {
    const n = name.trim() || "untitled." + type;
    window.DB.addDoc(client.id, { name: n, type, size: size.trim() || "—" }, user.name);
    setName(""); setSize(""); onClose();
    toast({ tone: "success", icon: "check-circle", title: "Uploaded", msg: n + " added to case evidence." });
  }
  return (
    <CDialog open={open} onClose={onClose} title="Upload evidence file" description="Supports PDF / image / spreadsheet / archive (metadata registration in this demo)." width={460}
      footer={<><CBtn variant="ghost" onClick={onClose}>Cancel</CBtn><CBtn variant="primary" onClick={add} iconLeft={<CIco n="upload" s={16} />}>Add to case</CBtn></>}>
      <div style={{ border: "2px dashed var(--border-strong)", borderRadius: "var(--radius-md)", padding: "26px 20px", textAlign: "center", color: "var(--ink-500)", background: "var(--ink-50)", marginBottom: 14 }}>
        <CIco n="upload-cloud" s={28} /><div style={{ marginTop: 8, fontSize: 13.5 }}>Drag a file here, or fill in the details below</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <EditRow label="File name" value={name} onChange={setName} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <EditRow label="Type" value={type} onChange={setType} options={["pdf", "img", "csv", "zip"]} />
          <EditRow label="Size" value={size} onChange={setSize} />
        </div>
      </div>
    </CDialog>
  );
}

/* ---- timeline ---- */
function TimelineTab({ client, user, editable, toast }) {
  const [note, setNote] = React.useState("");
  cRefresh();
  const items = [...client.timeline].reverse();
  return (
    <div style={{ display: "grid", gridTemplateColumns: editable ? "1fr 300px" : "1fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((t, i) => (
          <div key={t.id} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "var(--stone-100)", color: "var(--stone-700)", flex: "none" }}><CIco n={t.icon || "dot"} s={15} /></span>
              {i < items.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--border-default)", minHeight: 18 }}></span>}
            </div>
            <div style={{ paddingBottom: 18 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-800)", fontWeight: 500 }}>{t.text}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-400)", marginTop: 2 }}>{(t.date || "").slice(0, 10)} · {t.by}</div>
            </div>
          </div>
        ))}
        {!items.length && <div style={{ color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 14 }}>No timeline entries yet.</div>}
      </div>
      {editable && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-600)", marginBottom: 8 }}>Add a progress entry</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Log a case update…" style={{ width: "100%", fontFamily: "var(--font-ui)", fontSize: 13.5, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "10px 12px", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <CBtn variant="primary" fullWidth style={{ marginTop: 10 }} disabled={!note.trim()} iconLeft={<CIco n="plus" s={16} />}
            onClick={() => { window.DB.addTimeline(client.id, { icon: "message-square", text: note.trim() }, user.name); setNote(""); toast({ tone: "success", icon: "check", title: "Logged" }); }}>Add to timeline</CBtn>
        </div>
      )}
    </div>
  );
}

/* ---- export report (opens printable window) ---- */
function exportReport(client, toast) {
  const strat = client.strategies.map((id) => { const s = window.DB.strategyById(id); return s ? s.label : id; });
  const w = window.open("", "_blank");
  if (!w) { toast({ tone: "warning", icon: "alert-triangle", title: "Please allow pop-ups", msg: "The browser blocked the report window." }); return; }
  const rows = client.wallets.map((x) => `<tr><td style="font-family:monospace;font-size:12px">${x.addr}</td><td>${CWalletRole[x.role] || x.role}</td><td>${x.balance}</td></tr>`).join("");
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Case Report — ${client.name}</title>
  <style>body{font-family:Georgia,serif;color:#1A1714;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.6}
  h1{font-size:28px;margin:0 0 4px}.ey{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8A7B66;font-family:Arial}
  hr{border:0;border-top:3px solid #8A7B66;width:54px;margin:14px 0}table{width:100%;border-collapse:collapse;margin:8px 0}
  td,th{border-bottom:1px solid #ddd;padding:7px 8px;text-align:left;font-size:13px;font-family:Arial}
  .k{color:#6B665E;font-family:Arial;font-size:13px}.v{font-family:Arial;font-size:13px}.box{background:#F7F4EE;padding:14px 16px;border-radius:8px;font-family:Arial;font-size:13px}
  ul{font-family:Arial;font-size:13px}</style></head><body>
  <div class="ey">Berg PC · Confidential Case Report</div><hr>
  <h1>${client.name}</h1><div class="k">${client.id.toUpperCase()} · ${client.matterType} · Stage: ${client.status}</div>
  <h3>Party information</h3><div class="box">Email: ${client.email || "—"} Phone: ${client.phone || "—"}<br>Address: ${client.address || "—"}<br>Amount at issue: ${window.DB.fmtMoney(client.amountLost)} Date of loss: ${client.dateOfLoss || "—"}<br>Platform: ${client.platform || "—"} Jurisdiction: ${client.jurisdiction || "—"} (${client.overseas ? "Overseas" : "Domestic"})</div>
  <h3>Case narrative</h3><p style="font-family:Arial;font-size:13px">${client.narrative || "—"}</p>
  <h3>Wallets involved (${client.wallets.length})</h3><table><tr><th>Address</th><th>Role</th><th>Balance</th></tr>${rows || '<tr><td colspan=3>—</td></tr>'}</table>
  <h3>Recovery strategy (${strat.length})</h3><ul>${strat.map((s) => `<li>${s}</li>`).join("") || "<li>—</li>"}</ul>
  <p style="font-family:Arial;font-size:11px;color:#8C867D;margin-top:30px">Generated by the Berg PC case management platform · For authorized personnel only</p>
  <script>setTimeout(()=>window.print(),300)</script></body></html>`);
  w.document.close();
  toast({ tone: "success", icon: "file-down", title: "Report generated", msg: "Print or save as PDF in the new window." });
}

window.BergCase = { CaseDetail, exportReport };
