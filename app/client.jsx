/* Berg PC Platform — client portal + intake. Exports window.BergClient */
const DSCl = window.BergPCDesignSystem_eb13e3;
const { Card: ClCard, CardHeader: ClCH, Stat: ClStat, Badge: ClBadge, Button: ClBtn, Avatar: ClAvatar, Alert: ClAlert, Input: ClInput, Field: ClField, Textarea: ClTextarea, Select: ClSelect, Radio: ClRadio, Checkbox: ClCheck, Dialog: ClDialog } = DSCl;
const { Ico: ClIco, refreshIcons: clRefresh, StageBadge: ClStage, EditRow: ClEdit, useToast: clToast, MessageThread: ClMsg, UploadButton: ClUpload, downloadDoc: ClDownload, canDownload: ClCanDl } = window.BergUI;

function ClientApp({ user, view, onNav }) {
  const client = window.DB.clientByUser(user.id);
  if (!client) return <div style={{ padding: 40 }}>No linked case found. Please contact the firm.</div>;
  if (!client.intakeComplete && view !== "profile") return <Intake client={client} user={user} />;
  if (view === "documents") return <ClientDocs client={client} user={user} />;
  if (view === "messages") return <ClientMessages client={client} user={user} />;
  if (view === "help") return <window.BergEducation />;
  if (view === "profile") return <ClientProfile client={client} user={user} />;
  return <ClientHome client={client} user={user} onNav={onNav} />;
}

/* ---- intake (ref: intake.bergppc.com) ---- */
function Intake({ client, user }) {
  const toast = clToast();
  const [step, setStep] = React.useState(1);
  const [f, setF] = React.useState({
    name: client.name || user.name, email: client.email || user.email, phone: "", dob: "", occupation: "", address: "",
    idType: "Driver's License", idNumber: "", matterType: "Crypto Fraud", fundsMethod: "crypto", amountLost: "", dateOfLoss: "",
    platform: "", overseas: false, jurisdiction: "", narrative: "", contactPref: "Email", howHeard: "",
  });
  clRefresh();
  const up = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const total = 3;

  function finish() {
    window.DB.updateClient(client.id, {
      name: f.name, email: f.email, phone: f.phone, dob: f.dob, occupation: f.occupation, address: f.address,
      idType: f.idType, idNumber: f.idNumber, matterType: f.matterType, fundsMethod: f.fundsMethod,
      amountLost: Number(f.amountLost) || 0, dateOfLoss: f.dateOfLoss, platform: f.platform, overseas: f.overseas,
      jurisdiction: f.jurisdiction || (f.overseas ? "Overseas" : "Domestic"), narrative: f.narrative, intakeComplete: true,
    }, f.name);
    window.DB.addTimeline(client.id, { icon: "check", text: "Client completed intake" }, f.name);
    toast({ tone: "success", icon: "check-circle", title: "Intake submitted", msg: "Your case is now in the review queue." });
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 26px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--stone-600)" }}>Case intake · Step {step}/{total}</div>
      </div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 600, color: "var(--ink-900)", margin: "4px 0 4px" }}>
        {step === 1 ? "Your personal information" : step === 2 ? "Case details" : "What happened"}
      </h1>
      <div style={{ display: "flex", gap: 6, margin: "14px 0 22px" }}>
        {[1, 2, 3].map((s) => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "var(--ink-900)" : "var(--border-default)" }} />)}
      </div>

      <ClCard padding="lg">
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
            <ClEdit label="Name" value={f.name} onChange={up("name")} />
            <ClEdit label="Email" value={f.email} onChange={up("email")} type="email" />
            <ClEdit label="Phone" value={f.phone} onChange={up("phone")} />
            <ClEdit label="Date of birth" value={f.dob} onChange={up("dob")} type="date" />
            <ClEdit label="Occupation" value={f.occupation} onChange={up("occupation")} />
            <ClEdit label="Contact preference" value={f.contactPref} onChange={up("contactPref")} options={["Email", "Phone", "Either"]} />
            <div style={{ gridColumn: "1 / -1" }}><ClEdit label="Home address" value={f.address} onChange={up("address")} /></div>
            <ClEdit label="ID type" value={f.idType} onChange={up("idType")} options={["Driver's License", "Passport", "ID Card", "Business License"]} />
            <ClEdit label="ID number" value={f.idNumber} onChange={up("idNumber")} />
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
            <ClEdit label="Matter type" value={f.matterType} onChange={up("matterType")} options={["Crypto Fraud", "Coinbase Data Breach", "Meta Scam Ads", "Crypto Transaction Dispute", "Other"]} />
            <ClEdit label="Funds method" value={f.fundsMethod} onChange={up("fundsMethod")} options={["crypto", "wire", "both"]} />
            <ClEdit label="Amount lost (USD)" value={f.amountLost} onChange={up("amountLost")} type="number" />
            <ClEdit label="Date of loss" value={f.dateOfLoss} onChange={up("dateOfLoss")} type="date" />
            <div style={{ gridColumn: "1 / -1" }}><ClEdit label="Platform / app / website involved" value={f.platform} onChange={up("platform")} /></div>
            <ClEdit label="Where is the other party located?" value={f.jurisdiction} onChange={up("jurisdiction")} />
            <label style={{ display: "flex", alignItems: "flex-end", paddingBottom: 9 }}>
              <ClCheck checked={f.overseas} onChange={(e) => up("overseas")(e.target.checked)} label="Suspected overseas ring" />
            </label>
            <div style={{ gridColumn: "1 / -1" }}><ClEdit label="How did you hear about us?" value={f.howHeard} onChange={up("howHeard")} /></div>
          </div>
        )}
        {step === 3 && (
          <div>
            <ClEdit label="Please describe what happened in as much detail as possible" value={f.narrative} onChange={up("narrative")} textarea />
            <ClAlert tone="neutral" icon={<ClIco n="lock" s={17} />} style={{ marginTop: 16 }}>
              Everything you submit is protected by attorney–client privilege. After submitting, the firm will review your case — please do not call or email repeatedly.
            </ClAlert>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <ClBtn variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)} iconLeft={<ClIco n="arrow-left" s={16} />}>Back</ClBtn>
          {step < total
            ? <ClBtn variant="primary" onClick={() => setStep((s) => s + 1)} iconRight={<ClIco n="arrow-right" s={16} />}>Next</ClBtn>
            : <ClBtn variant="primary" onClick={finish} iconRight={<ClIco n="check" s={16} />}>Submit intake</ClBtn>}
        </div>
      </ClCard>
    </div>
  );
}

/* ---- client home ---- */
function ClientHome({ client, user, onNav }) {
  clRefresh();
  const STEPS_MAP = window.DB.STAGES;
  const idx = STEPS_MAP.indexOf(client.status);
  const traced = client.wallets.length ? Math.min(99, 40 + client.wallets.length * 12) : 0;
  const EST = { "Intake": "~1 week", "Investigating": "~2–4 weeks", "Filed": "~4–8 weeks", "Frozen": "~1–3 months", "Recovered": "", "Closed": "" };
  const tracedAmt = Math.round((+client.amountLost || 0) * traced / 100);
  const frozenAmt = idx >= 3 ? Math.round((+client.amountLost || 0) * 0.7) : 0;
  const recoveredAmt = idx >= 4 ? (+client.amountLost || 0) : 0;
  const lawyer = window.DB.users().find((u) => u.id === client.lawyerId);
  const [grown, setGrown] = React.useState(false);
  const [tv, setTv] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setGrown(true), 60);
    let i = 0; const id = setInterval(() => { i++; setTv(Math.round(traced * Math.min(1, i / 40))); if (i >= 40) { setTv(traced); clearInterval(id); } }, 16);
    return () => { clearTimeout(t); clearInterval(id); };
  }, []);
  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "30px 26px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--stone-600)" }}>{client.matterType}</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, margin: "10px 0 0", color: "var(--ink-900)" }}>Welcome back, {client.name.split(" ")[0]}</h1>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-500)" }}>Case {client.id.toUpperCase()}</span>
      </div>

      <ClAlert tone="info" icon={<ClIco n="info" s={18} />} style={{ margin: "18px 0 22px" }}>
        Your case is progressing — current stage is “{client.status}”. Your team will reach out to you; there's no need to call the firm.
      </ClAlert>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, alignItems: "start" }}>
        <ClCard padding="lg">
          <ClCH eyebrow="Case progress" title="Where things stand" trailing={<ClStage s={client.status} />} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS_MAP.map((t, i) => {
              const st = i < idx ? "done" : i === idx ? "active" : "todo";
              return (
                <div key={t} style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", flex: "none", background: st === "done" ? "var(--success-500)" : st === "active" ? "var(--navy-800)" : "var(--ink-100)", color: st === "todo" ? "var(--ink-400)" : "var(--cream)", border: st === "active" ? "3px solid var(--stone-300)" : "none" }}>
                      {st === "done" ? <ClIco n="check" s={15} /> : st === "active" ? <ClIco n="loader" s={15} /> : <span style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}</span>}
                    </span>
                    {i < STEPS_MAP.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 22, background: i < idx ? "var(--success-500)" : "var(--border-default)", transform: grown ? "scaleY(1)" : "scaleY(0)", transformOrigin: "top", transition: "transform .5s ease " + (i * 0.12) + "s" }} />}
                  </div>
                  <div style={{ paddingBottom: 16 }}><div style={{ fontFamily: "var(--font-ui)", fontSize: 14.5, fontWeight: st === "todo" ? 500 : 600, color: st === "todo" ? "var(--ink-400)" : "var(--ink-900)" }}>{t}{st === "active" && EST[t] ? <span style={{ fontWeight: 500, fontSize: 12.5, color: "var(--stone-600)", marginLeft: 8 }}>· typically {EST[t]}</span> : null}</div></div>
                </div>
              );
            })}
          </div>
        </ClCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ClCard padding="lg" style={{ background: "var(--stone-100)", border: "none", display: "flex", gap: 26 }}>
            <ClStat label="Amount at issue" value={window.DB.fmtMoney(client.amountLost)} />
            <div style={{ width: 1, background: "var(--stone-300)" }} />
            <ClStat label="Traced" value={tv + "%"} caption="of fund flow" />
          </ClCard>
          <ClCard padding="lg">
            <ClCH title="Recovery progress" />
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[["Traced", tracedAmt, "var(--info-500)", "search"], ["Frozen", frozenAmt, "var(--warning-500)", "snowflake"], ["Recovered", recoveredAmt, "var(--success-500)", "badge-check"]].map(([lbl, amt, col, ic]) => {
                const pct = client.amountLost ? Math.round((amt / client.amountLost) * 100) : 0;
                return (
                  <div key={lbl}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-ui)", fontSize: 13, marginBottom: 5 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--ink-700)", fontWeight: 500 }}><ClIco n={ic} s={14} c={col} /> {lbl}</span>
                      <span style={{ color: "var(--ink-500)" }}>{window.DB.fmtMoney(amt)}</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 4, background: "var(--ink-100)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, background: col, width: (grown ? pct : 0) + "%", transition: "width 1s cubic-bezier(.16,1,.3,1)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </ClCard>

          <ClCard padding="lg">
            <ClCH title="Your team" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <ClAvatar name={lawyer ? lawyer.name : "Berg PC"} size={40} tone="navy" />
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{lawyer ? lawyer.name : "Unassigned"}</div><div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>{lawyer ? (lawyer.title || "Handling attorney") : "The firm will assign one shortly"}</div></div>
              </div>
              <ClBtn variant="secondary" fullWidth iconLeft={<ClIco n="message-square" s={16} />} onClick={() => onNav && onNav("messages")}>Send a secure message</ClBtn>
            </div>
          </ClCard>
        </div>
      </div>
    </div>
  );
}

/* ---- client documents ---- */
function ClientDocs({ client, user }) {
  clRefresh();
  const icon = (t) => ({ pdf: "file-text", zip: "file-archive", csv: "file-spreadsheet", img: "file-image" })[t] || "file";
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "30px 26px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, margin: 0, color: "var(--ink-900)" }}>My documents</h1>
        <ClUpload clientId={client.id} actorName={client.name} label="Upload file" variant="primary" />
      </div>
      <ClAlert tone="neutral" icon={<ClIco n="shield-check" s={17} />} style={{ marginBottom: 16 }}>Files you upload enter the case evidence vault and are verified by your handling attorney.</ClAlert>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {client.documents.map((d) => (
          <ClCard key={d.id} padding="sm">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--stone-600)" }}><ClIco n={icon(d.type)} s={19} /></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-800)" }}>{d.name}</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-400)" }}>{d.size} · {d.uploadedBy}</div></div>
              {ClCanDl(d) && <button onClick={() => ClDownload(d)} title="Download" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-500)" }}><ClIco n="download" s={16} /></button>}
              <ClBadge tone={d.status === "verified" ? "success" : "warning"}>{d.status === "verified" ? "Verified" : "In review"}</ClBadge>
            </div>
          </ClCard>
        ))}
        {!client.documents.length && <div style={{ padding: 40, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)" }}>No files uploaded yet.</div>}
      </div>
    </div>
  );
}

/* ---- client profile (read-only of their own data) ---- */
function ClientProfile({ client, user }) {
  clRefresh();
  const row = (k, v) => <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}><span style={{ fontSize: 13.5, color: "var(--ink-500)" }}>{k}</span><span style={{ fontSize: 13.5, color: "var(--ink-900)", fontWeight: 500 }}>{v || "—"}</span></div>;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "30px 26px 60px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, margin: "0 0 16px", color: "var(--ink-900)" }}>My profile</h1>
      <ClCard padding="lg">
        {row("Name", client.name)}{row("Email", client.email)}{row("Phone", client.phone)}
        {row("Address", client.address)}{row("Occupation", client.occupation)}{row("Matter type", client.matterType)}
        {row("Amount at issue", window.DB.fmtMoney(client.amountLost))}{row("Date of loss", client.dateOfLoss)}{row("Platform involved", client.platform)}
        <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--ink-400)" }}>To update your details, contact your handling attorney via secure message.</div>
      </ClCard>
    </div>
  );
}

/* ---- client messages ---- */
function ClientMessages({ client, user }) {
  clRefresh();
  const lawyer = window.DB.users().find((u) => u.id === client.lawyerId);
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "30px 26px 40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, margin: "0 0 4px", color: "var(--ink-900)" }}>Secure messages</h1>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-500)", margin: "0 0 18px" }}>A secure conversation with your handling attorney {lawyer ? lawyer.name : "(to be assigned)"}, protected by attorney–client privilege.</p>
      <ClMsg client={client} user={user} height={420} />
    </div>
  );
}

window.BergClient = { ClientApp };
