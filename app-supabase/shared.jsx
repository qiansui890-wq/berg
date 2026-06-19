/* Berg PC Platform — shared UI helpers. Exports window.BergUI */
const DSU = window.BergPCDesignSystem_eb13e3;
const { Avatar, Badge, IconButton, Button, Input } = DSU;

const Ico = ({ n, s = 18, c, ...p }) => <i data-lucide={n} style={{ width: s, height: s, color: c, flex: "none" }} {...p}></i>;
const refreshIcons = () => { setTimeout(() => window.lucide && window.lucide.createIcons(), 20); };

const MARK_REV = (window.BERG_LOGOS && window.BERG_LOGOS.markRev) || "../assets/berg-pc-mark-reverse.png";
const LOGO_REV = (window.BERG_LOGOS && window.BERG_LOGOS.logoRev) || "../assets/berg-pc-logo-reverse.png";

/* ---- live DB subscription hook ---- */
function useDB() {
  const [, set] = React.useState(0);
  React.useEffect(() => window.DB.subscribe(() => set((x) => x + 1)), []);
  React.useEffect(refreshIcons);
}

/* ---- toast system ---- */
const ToastCtx = React.createContext(() => {});
function ToastHost({ children }) {
  const [items, setItems] = React.useState([]);
  const push = React.useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, ...t }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), t.duration || 3200);
  }, []);
  React.useEffect(refreshIcons);
  const bars = { success: "var(--success-500)", danger: "var(--danger-500)", info: "var(--info-500)", warning: "var(--warning-500)", neutral: "var(--ink-800)" };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position: "fixed", right: 20, bottom: 20, display: "flex", flexDirection: "column", gap: 10, zIndex: 9000 }}>
        {items.map((t) => (
          <div key={t.id} style={{ display: "flex", gap: 11, alignItems: "flex-start", width: 320, background: "var(--white)", borderRadius: "var(--radius-md)", borderLeft: `3px solid ${bars[t.tone || "neutral"]}`, boxShadow: "var(--shadow-lg)", padding: "13px 14px", animation: "berg-rise .2s var(--ease-out)" }}>
            <span style={{ color: bars[t.tone || "neutral"] }}><Ico n={t.icon || "info"} s={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {t.title && <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>{t.title}</div>}
              {t.msg && <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-600)", marginTop: 2, lineHeight: 1.45 }}>{t.msg}</div>}
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes berg-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

/* ---- app shell: sidebar + topbar ---- */
function Shell({ user, nav, active, onNav, onLogout, title, crumb, actions, children }) {
  useDB();
  const roleColor = { admin: "var(--danger-500)", lawyer: "var(--stone-400)", client: "var(--info-500)" };
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "var(--font-ui)", background: "var(--bg-page-alt)" }}>
      <aside style={{ width: 236, flex: "none", background: "var(--navy-900)", color: "var(--navy-100)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderBottom: "1px solid var(--navy-700)" }}>
          <img src={MARK_REV} alt="" style={{ height: 26, width: 26, objectFit: "contain", flex: "none" }} />
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600, color: "var(--cream)", lineHeight: 1, whiteSpace: "nowrap" }}>Berg PC</div>
            <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--stone-300)", whiteSpace: "nowrap" }}>Case Platform</div>
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map((item) => item.section ? (
            <div key={item.section} style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--navy-300)", padding: "14px 11px 6px" }}>{item.section}</div>
          ) : (
            <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); onNav(item.id); }}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: "var(--radius-sm)", textDecoration: "none", fontSize: 14, fontWeight: active === item.id ? 600 : 500, color: active === item.id ? "var(--cream)" : "var(--navy-200)", background: active === item.id ? "var(--navy-700)" : "transparent" }}
              onMouseEnter={(e) => { if (active !== item.id) e.currentTarget.style.background = "var(--navy-800)"; }}
              onMouseLeave={(e) => { if (active !== item.id) e.currentTarget.style.background = "transparent"; }}>
              <Ico n={item.icon} s={17} c={active === item.id ? "var(--stone-300)" : "var(--navy-300)"} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: "var(--navy-700)", color: "var(--navy-100)", borderRadius: 8, padding: "1px 7px" }}>{item.badge}</span>}
            </a>
          ))}
        </nav>
        <div style={{ padding: 13, borderTop: "1px solid var(--navy-700)", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={user.name} size={34} tone={user.role === "client" ? "navy" : "stone"} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cream)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: roleColor[user.role], fontWeight: 600 }}>{window.DB.ROLE_LABEL[user.role]}</div>
          </div>
          <IconButton label="Sign out" variant="ghost" onClick={onLogout} style={{ color: "var(--navy-200)" }}><Ico n="log-out" s={17} /></IconButton>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 62, flex: "none", borderBottom: "1px solid var(--border-subtle)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px" }}>
          <div>
            {crumb && <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginBottom: 2 }}>{crumb}</div>}
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 600, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>{actions}</div>
        </header>
        <style>{`@keyframes bergIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.berg-main-anim{animation:bergIn .5s cubic-bezier(.16,1,.3,1) both}
@media(prefers-reduced-motion:reduce){.berg-main-anim{animation:none}}`}</style>
        <main style={{ flex: 1, overflow: "auto" }}><div className="berg-main-anim" key={active}>{children}</div></main>
      </div>
    </div>
  );
}

/* ---- small reusable bits ---- */
function PageWrap({ children, style }) { return <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18, maxWidth: 1180, ...style }}>{children}</div>; }

function Empty({ icon = "inbox", title, hint, action }) {
  React.useEffect(refreshIcons);
  return (
    <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--ink-400)" }}>
      <Ico n={icon} s={34} />
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--ink-700)", margin: "14px 0 6px" }}>{title}</div>
      {hint && <div style={{ fontSize: 14, maxWidth: 380, margin: "0 auto 18px" }}>{hint}</div>}
      {action}
    </div>
  );
}

function StageBadge({ s }) { return <Badge tone={window.DB.STAGE_TONE[s] || "neutral"}>{s}</Badge>; }

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
      <div>
        {eyebrow && <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--stone-600)" }}>{eyebrow}</div>}
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "var(--ink-900)", margin: "8px 0 0", letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

/* editable field row (inline edit used across lawyer/client views) */
function EditRow({ label, value, onChange, type = "text", options, textarea, readOnly }) {
  const base = { width: "100%", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-900)", background: readOnly ? "var(--ink-50)" : "var(--white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "9px 11px", outline: "none" };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-600)" }}>{label}</span>
      {readOnly ? <div style={{ ...base, color: "var(--ink-700)" }}>{value || "—"}</div>
        : options ? (
          <select value={value} onChange={(e) => onChange(e.target.value)} style={base}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select>
        ) : textarea ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...base, resize: "vertical", lineHeight: 1.5 }} />
        ) : (
          <input type={type} lang="en" value={value} onChange={(e) => onChange(e.target.value)} style={base} />
        )}
    </label>
  );
}

/* secure message thread — used by lawyer (case detail) and client (portal) */
function MessageThread({ client, user, height = 360 }) {
  const [text, setText] = React.useState("");
  const [hover, setHover] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const fileRef = React.useRef(null);
  const endRef = React.useRef(null);
  const toast = useToast();
  const msgs = client.messages || [];
  React.useEffect(() => { window.DB.markMessagesRead(client.id, user.id); }, [client.id, msgs.length]);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; });
  React.useEffect(refreshIcons);
  function send() { if (!text.trim()) return; window.DB.sendMessage(client.id, user, text); setText(""); }
  function recall(m) { if (window.confirm("Recall this message? It will be removed for everyone on this case.")) window.DB.recallMessage(client.id, m.id, user); }
  async function pickFile(e) {
    const file = e.target.files && e.target.files[0]; e.target.value = "";
    if (!file) return;
    const MAX = 3 * 1024 * 1024;
    if (file.size > MAX) { toast({ tone: "danger", icon: "alert-circle", title: "File too large", msg: "Max 3 MB in chat — use Documents for larger files." }); return; }
    setBusy(true);
    try {
      const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
      await window.DB.sendMessage(client.id, user, "", { name: file.name, type: extType(file.name), size: fmtSize(file.size), dataUrl });
    } catch (err) { toast({ tone: "danger", icon: "alert-circle", title: "Couldn't attach", msg: String(err && err.message || err) }); }
    finally { setBusy(false); }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", background: "var(--white)", overflow: "hidden" }}>
      <div ref={endRef} style={{ height, overflowY: "auto", padding: "16px 16px", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg-page-alt)" }}>
        {msgs.length ? msgs.map((m) => {
          const mine = m.fromId === user.id;
          const att = m.attachment;
          const imgOnly = att && att.type === "img" && att.dataUrl && !m.text;
          return (
            <div key={m.id} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover((h) => (h === m.id ? null : h))}
              style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: mine ? "row" : "row-reverse", maxWidth: "82%" }}>
                {mine && !m.recalled && (
                  <button onClick={() => recall(m)} title="Recall message" aria-label="Recall message"
                    style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)", padding: 4, lineHeight: 0, opacity: hover === m.id ? 1 : 0, transition: "opacity var(--duration-fast) var(--ease-standard)", flex: "none" }}>
                    <Ico n="undo-2" s={14} />
                  </button>
                )}
                <div style={{ background: m.recalled ? "transparent" : mine ? "var(--navy-800)" : "var(--white)", color: mine ? "var(--cream)" : "var(--ink-800)",
                  border: m.recalled ? "1px dashed var(--border-default)" : mine ? "none" : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)", padding: imgOnly ? 4 : "9px 13px", fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.5, minWidth: 0 }}>
                  {m.recalled ? (
                    <span style={{ fontStyle: "italic", color: "var(--ink-400)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                      <Ico n="ban" s={14} /> {mine ? "You recalled a message" : (m.fromName + " recalled a message")}
                    </span>
                  ) : (
                    <>
                      {att && att.type === "img" && att.dataUrl ? (
                        <a href={att.dataUrl} target="_blank" rel="noreferrer" style={{ display: "block" }}>
                          <img src={att.dataUrl} alt={att.name} style={{ maxWidth: 230, maxHeight: 220, borderRadius: 7, display: "block" }} />
                        </a>
                      ) : att ? (
                        <a href={att.dataUrl || att.url || undefined} download={att.name} target="_blank" rel="noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: mine ? "var(--cream)" : "var(--ink-800)", background: mine ? "rgba(255,255,255,0.10)" : "var(--ink-50)", border: mine ? "none" : "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "8px 10px", minWidth: 180 }}>
                          <Ico n="file-text" s={18} />
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{att.name}</span>
                            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10.5, opacity: 0.7 }}>{att.size}</span>
                          </span>
                          <Ico n="download" s={15} />
                        </a>
                      ) : null}
                      {m.text ? <div style={{ marginTop: att ? 6 : 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.text}</div> : null}
                    </>
                  )}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-400)", marginTop: 4 }}>{mine ? "You" : m.fromName} · {new Date(m.ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}{m.recalled ? " · recalled" : ""}</div>
            </div>
          );
        }) : <div style={{ margin: "auto", textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 13.5 }}><Ico n="messages-square" s={26} /><div style={{ marginTop: 8 }}>No messages yet — start your secure conversation.</div></div>}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border-subtle)", background: "var(--white)", alignItems: "center" }}>
        <input ref={fileRef} type="file" accept="image/*,.pdf,.csv,.xls,.xlsx,.zip,.doc,.docx,.txt" onChange={pickFile} style={{ display: "none" }} />
        <button onClick={() => fileRef.current && fileRef.current.click()} disabled={busy} title="Attach file or image" aria-label="Attach file or image"
          style={{ border: "1px solid var(--border-default)", background: "var(--white)", color: busy ? "var(--ink-300)" : "var(--ink-600)", borderRadius: "var(--radius-sm)", width: 40, height: 40, cursor: busy ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Ico n={busy ? "loader" : "paperclip"} s={18} />
        </button>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Type a message, press Enter to send…"
          style={{ flex: 1, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontFamily: "var(--font-ui)", fontSize: 14, outline: "none" }} />
        <button onClick={send} disabled={!text.trim()} style={{ border: "none", background: text.trim() ? "var(--navy-800)" : "var(--ink-200)", color: "var(--cream)", borderRadius: "var(--radius-sm)", padding: "0 16px", height: 40, cursor: text.trim() ? "pointer" : "default", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600 }}><Ico n="send" s={16} /> Send</button>
      </div>
    </div>
  );
}

/* private lawyer notes panel */
function NotesPanel({ client, user }) {
  const [text, setText] = React.useState("");
  const notes = client.notes || [];
  React.useEffect(refreshIcons);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { window.DB.addNote(client.id, user, text); setText(""); } }} placeholder="Add an internal note (clients cannot see this)…"
          style={{ flex: 1, border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontFamily: "var(--font-ui)", fontSize: 14, outline: "none" }} />
        <button onClick={() => { if (text.trim()) { window.DB.addNote(client.id, user, text); setText(""); } }} disabled={!text.trim()} style={{ border: "none", background: text.trim() ? "var(--stone-600)" : "var(--ink-200)", color: "var(--cream)", borderRadius: "var(--radius-sm)", padding: "0 16px", cursor: text.trim() ? "pointer" : "default", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600 }}>Add</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notes.length ? notes.map((n) => (
          <div key={n.id} style={{ display: "flex", gap: 11, background: "var(--stone-50)", border: "1px solid var(--stone-200)", borderRadius: "var(--radius-md)", padding: "11px 13px" }}>
            <Ico n="sticky-note" s={16} c="var(--stone-600)" />
            <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-800)", lineHeight: 1.5 }}>{n.text}</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-400)", marginTop: 3 }}>{n.author} · {new Date(n.ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div></div>
            <button onClick={() => window.DB.removeNote(client.id, n.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-300)" }}><Ico n="x" s={15} /></button>
          </div>
        )) : <div style={{ padding: 24, textAlign: "center", color: "var(--ink-400)", fontFamily: "var(--font-ui)", fontSize: 13.5 }}>No internal notes yet. Visible only to the handling attorney and administrators.</div>}
      </div>
    </div>
  );
}

/* real file picker → reads the file and stores it (dataUrl in the demo,
   or the File object for the Supabase build). Styled as a button. */
function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}
function extType(name) {
  const e = (name.split(".").pop() || "").toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp", "heic"].includes(e)) return "img";
  if (["csv", "xls", "xlsx"].includes(e)) return "csv";
  if (["zip", "rar", "7z"].includes(e)) return "zip";
  return "pdf";
}
function UploadButton({ clientId, actorName, label = "Upload file", variant = "primary", onDone }) {
  const ref = React.useRef(null);
  const toast = useToast();
  const [busy, setBusy] = React.useState(false);
  React.useEffect(refreshIcons);
  async function pick(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    const MAX = 4 * 1024 * 1024; // 4 MB cap for the in-browser demo store
    const doc = { name: file.name, type: extType(file.name), size: fmtSize(file.size) };
    try {
      if (file.size <= MAX) {
        doc.dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
      } else {
        doc.note = "Stored as a reference (file exceeds 4 MB in-browser limit).";
      }
      doc.file = file; // used by the Supabase build's storage upload
      await window.DB.addDoc(clientId, doc, actorName);
      toast({ tone: "success", icon: "check-circle", title: "Uploaded", msg: file.name });
      if (onDone) onDone();
    } catch (err) {
      toast({ tone: "danger", icon: "alert-circle", title: "Upload failed", msg: String(err && err.message || err) });
    } finally { setBusy(false); }
  }
  const styles = {
    primary: { background: "var(--ink-900)", color: "var(--cream)", border: "1px solid var(--ink-900)" },
    secondary: { background: "transparent", color: "var(--ink-900)", border: "1px solid var(--border-strong)" },
  };
  return (
    <>
      <input ref={ref} type="file" onChange={pick} style={{ display: "none" }} accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.csv,.xls,.xlsx,.zip,.doc,.docx,.txt" />
      <button type="button" onClick={() => ref.current && ref.current.click()} disabled={busy}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, borderRadius: "var(--radius-sm)", padding: "10px 18px", cursor: busy ? "default" : "pointer", ...styles[variant] }}>
        <Ico n={busy ? "loader" : "upload"} s={16} /> {busy ? "Uploading…" : label}
      </button>
    </>
  );
}
async function downloadDoc(doc) {
  if (doc.dataUrl) { const a = document.createElement("a"); a.href = doc.dataUrl; a.download = doc.name || "file"; document.body.appendChild(a); a.click(); a.remove(); return true; }
  if (doc.url) { window.open(doc.url, "_blank"); return true; }
  if (doc.storage_key && window.DB.docUrl) { const u = await window.DB.docUrl(doc); if (u) { window.open(u, "_blank"); return true; } }
  return false;
}
function canDownload(doc) { return !!(doc.dataUrl || doc.url || doc.storage_key); }

/* look up an attorney headshot by account email (from attorneys.js) */
function attorneyPhoto(email) {
  if (!email) return undefined;
  const a = (window.BERG_ATTORNEYS || []).find((x) => x.email && x.email.toLowerCase() === String(email).toLowerCase());
  return a ? a.photo : undefined;
}

window.BergUI = { Ico, refreshIcons, useDB, ToastHost, useToast, Shell, PageWrap, Empty, StageBadge, SectionTitle, EditRow, MessageThread, NotesPanel, UploadButton, downloadDoc, canDownload, fmtSize, attorneyPhoto, extType, MARK_REV, LOGO_REV };
