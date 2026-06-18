/* Berg PC Platform — auth (login + register), Supabase build. Exports window.BergAuth */
const DSA = window.BergPCDesignSystem_eb13e3;
const { Button, Input, Field } = DSA;
const { Ico, refreshIcons } = window.BergUI;
const LOGO_REV_A = (window.BERG_LOGOS && window.BERG_LOGOS.logoRev) || "../assets/berg-pc-logo-reverse.png";

/* animated node-network background (shared by the brand panel) */
function bergNet(c){
  const x=c.getContext('2d'); let W,H,nodes,DPR=Math.min(devicePixelRatio||1,2);
  const LINK=150;
  function size(){
    const r=c.getBoundingClientRect(); W=r.width; H=r.height;
    c.width=W*DPR; c.height=H*DPR; x.setTransform(DPR,0,0,DPR,0,0);
    const n=Math.min(70,Math.round(W*H/13000));
    nodes=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.34,vy:(Math.random()-.5)*.34,r:Math.random()*1.6+1.3,gold:Math.random()>.8}));
  }
  size(); addEventListener('resize',size);
  const pulses=[]; setInterval(()=>{ if(!nodes||nodes.length<2)return; const a=nodes[(Math.random()*nodes.length)|0]; let b=null,best=LINK; for(const m of nodes){if(m===a)continue;const d=Math.hypot(m.x-a.x,m.y-a.y);if(d<best){best=d;b=m;}} if(b)pulses.push({a,b,t:0,sp:.013+Math.random()*.012}); },300);
  function tick(){
    x.clearRect(0,0,W,H);
    for(let i=0;i<nodes.length;i++){const a=nodes[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
      for(let j=i+1;j<nodes.length;j++){const b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<LINK){const o=(1-d/LINK)*.5;x.strokeStyle='rgba(120,150,186,'+o+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}}
    for(const n of nodes){x.beginPath();x.arc(n.x,n.y,n.r,0,7);x.fillStyle=n.gold?'rgba(214,180,108,1)':'rgba(160,180,205,.85)';x.fill();if(n.gold){x.beginPath();x.arc(n.x,n.y,n.r+4,0,7);x.fillStyle='rgba(203,168,92,.2)';x.fill();}}
    for(let i=pulses.length-1;i>=0;i--){const p=pulses[i];p.t+=p.sp;if(p.t>=1){pulses.splice(i,1);continue;}const px=p.a.x+(p.b.x-p.a.x)*p.t,py=p.a.y+(p.b.y-p.a.y)*p.t;x.beginPath();x.arc(px,py,3,0,7);x.fillStyle='rgba(220,186,110,1)';x.fill();x.beginPath();x.arc(px,py,9,0,7);x.fillStyle='rgba(203,168,92,.26)';x.fill();}
    requestAnimationFrame(tick);
  }
  tick();
}

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = React.useState("login");
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    refreshIcons();
    const c = document.getElementById('authnet');
    if (c && !c.dataset.on) { c.dataset.on = '1'; bergNet(c); }
  }, []);
  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const res = mode === "login"
        ? await window.DB.login(form.email, form.password)
        : await window.DB.register({ name: form.name, email: form.email, password: form.password, role: "client" });
      if (res.error) { setErr(res.error); return; }
      onAuthed(res.user);
    } catch (e) {
      setErr("Could not reach the server. Check your Supabase config and connection.");
    } finally { setBusy(false); }
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-ui)", background: "var(--cream)" }}>
      <BrandPanel />

      <div style={{ flex: "1 1 52%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 384 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 24 }}>
            <span style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "var(--navy-900)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--stone-300)" }}><Ico n="scale" s={18} /></span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.01em" }}>Berg PC</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.015em" }}>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-500)", margin: "9px 0 28px", lineHeight: 1.55 }}>
            {mode === "login" ? "Sign in to manage your cases, evidence, and tracing progress." : "Register to file your case, upload evidence, and track recovery."}
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <Field label="Full name" required><Input value={form.name} onChange={up("name")} placeholder="Your name" iconLeft={<Ico n="user" s={16} />} /></Field>
            )}
            <Field label="Email" required><Input type="email" value={form.email} onChange={up("email")} placeholder="you@email.com" iconLeft={<Ico n="mail" s={16} />} /></Field>
            <Field label="Password" required>
              <Input type={show ? "text" : "password"} value={form.password} onChange={up("password")} placeholder="••••••••"
                iconLeft={<Ico n="lock" s={16} />} trailing={<span style={{ cursor: "pointer", display: "flex" }} onClick={() => setShow((s) => !s)}><Ico n={show ? "eye-off" : "eye"} s={16} /></span>} />
            </Field>
            {err && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--danger-700)", background: "var(--danger-100)", borderRadius: "var(--radius-sm)", padding: "9px 12px" }}><Ico n="alert-circle" s={16} /> {err}</div>}
            <Button type="submit" variant="primary" fullWidth size="lg" disabled={busy} iconRight={<Ico n="arrow-right" s={18} />}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Register & continue"}</Button>
          </form>

          <div style={{ textAlign: "center", margin: "18px 0", fontSize: 14, color: "var(--ink-500)" }}>
            {mode === "login" ? <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode("register"); setErr(""); }} style={{ color: "var(--navy-700)", fontWeight: 600 }}>Register</a></>
              : <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); setErr(""); }} style={{ color: "var(--navy-700)", fontWeight: 600 }}>Back to sign in</a></>}
          </div>

          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, fontSize: 12.5, color: "var(--ink-400)", lineHeight: 1.6, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Ico n="database" s={15} c="var(--stone-600)" /> <span>Connected to Supabase. Accounts are created by your firm's administrator (or via Register for clients).</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* premium brand panel */
function BrandPanel() {
  return (
    <div style={{ flex: "1 1 48%", position: "relative", overflow: "hidden", color: "var(--cream)",
      background: "radial-gradient(120% 90% at 18% 12%, #1E2C3E 0%, #16202E 42%, #0E1622 100%)",
      padding: "60px 60px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

      <canvas id="authnet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.7, pointerEvents: "none" }}></canvas>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.05, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2.0, color: "#fff", padding: "30px 0 0 60px", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}>
        {["bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3 →","0xa3f19c4e7b2049d5f1c8a6037be29d4471e7b204 →","bc1qhop1a7c2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9 →","TX-injunction · 30 wallets frozen →","trace · hop · mixer · exchange · frozen →","bc1qmix44adm4f8x3v0rd7t6yqe2h5n8s4p1w0c9 →"].map((t, i) => <div key={i}>{t} {t}</div>)}
      </div>
      <div aria-hidden="true" style={{ position: "absolute", right: -120, bottom: -120, width: 460, height: 460, borderRadius: "50%", border: "1px solid rgba(138,123,102,0.18)" }} />
      <div aria-hidden="true" style={{ position: "absolute", right: -60, bottom: -60, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(138,123,102,0.12)" }} />
      <div aria-hidden="true" style={{ position: "absolute", right: 40, bottom: 40, width: 170, height: 170, borderRadius: "50%", border: "1px solid rgba(138,123,102,0.08)" }} />

      <img src={LOGO_REV_A} alt="Berg PC" style={{ height: 50, alignSelf: "flex-start", position: "relative", zIndex: 2 }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone-300)" }}>Crypto Fraud &amp; Recovery</div>
        <hr style={{ width: 56, height: 3, background: "var(--stone-500)", border: 0, margin: "22px 0 26px" }} />
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 50, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0, maxWidth: 470, color: "var(--cream)" }}>
          Recover what was <span style={{ fontStyle: "italic", color: "var(--stone-300)" }}>taken.</span>
        </h1>
        <p style={{ fontSize: 16.5, color: "var(--navy-100)", lineHeight: 1.65, maxWidth: 430, marginTop: 22 }}>
          Senior attorneys and digital forensics experts, working together — tracing stolen assets across the blockchain and pursuing recovery through the courts.
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 18, fontSize: 12.5, color: "var(--navy-200)", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Ico n="shield-check" s={15} c="var(--stone-300)" /> Attorney–client privilege</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--navy-400)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Ico n="lock" s={15} c="var(--stone-300)" /> Encrypted &amp; isolated</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--navy-400)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Ico n="map-pin" s={15} c="var(--stone-300)" /> Houston, Texas</span>
      </div>
    </div>
  );
}

window.BergAuth = { AuthScreen, BrandPanel };
