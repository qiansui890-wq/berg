/* Berg PC — Website: Crypto Recovery page + Intake form. Exports window.BergWebScreens. */
const _DS = window.BergPCDesignSystem_eb13e3;
const { Button, Badge, Card, CardHeader, Stat, Alert, Field, Input, Select, Textarea, Checkbox, Radio } = _DS;
const { Ico, SectionHead, PhotoSlot, LOGO_REV } = window.BergWeb;

/* ---------- Crypto Fraud & Recovery page ---------- */
function CryptoRecovery({ go }) {
  const caps = [
    ["search-code", "Tracing stolen assets", "We follow funds across the blockchain — through hops, bridges, and mixers — to where they come to rest."],
    ["crosshair", "Locating criminal wallets", "We identify the destination wallets and cluster them to the actors and services behind them."],
    ["user-search", "Identifying scammers", "Open-source and forensic investigation ties on-chain activity to real-world identities."],
    ["building-2", "Working with exchanges", "We coordinate with VASPs and exchanges to flag, trace, and hold tainted deposits."],
    ["snowflake", "Freezing wallets via courts", "We obtain injunctions that freeze criminal wallets — including a first-of-its-kind order in Texas."],
    ["scale", "Pursuing recovery", "We litigate to return funds to victims, on a contingency basis — no recovery, no fee."],
  ];
  return (
    <div>
      <section style={{ background: "var(--navy-900)", color: "var(--cream)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "70px 28px 60px" }}>
          <a href="#" onClick={(e)=>{e.preventDefault();go("home");}} style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--stone-300)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <Ico n="arrow-left" s={15}/> All practice areas
          </a>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--stone-300)" }}>Crypto Litigation</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 48, lineHeight: 1.08, letterSpacing: "-0.02em", margin: "16px 0 0", maxWidth: 760 }}>Crypto Fraud &amp; Recovery</h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 18, lineHeight: 1.6, color: "var(--navy-100)", maxWidth: 640, margin: "20px 0 0" }}>
            If you have been the victim of a cryptocurrency scam, we understand this may be the worst time of your life. Our attorneys and investigators work together to trace and recover what was taken.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--cream)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "70px 28px" }}>
          <SectionHead eyebrow="Our Capabilities" title="A rigorous, evidence-led process" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 40 }}>
            {caps.map(([icon, t, d]) => (
              <div key={t}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--stone-100)", color: "var(--stone-700)", marginBottom: 14 }}><Ico n={icon} s={21}/></span>
                <h3 style={{ fontFamily: "var(--font-ui)", fontSize: 17, fontWeight: 600, color: "var(--ink-900)", margin: "0 0 7px" }}>{t}</h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-600)", margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px 70px" }}>
          <Alert tone="warning" title="Beware of recovery scams" icon={<Ico n="shield-alert" s={20}/>}>
            Berg PC will never ask you to pay an upfront fee to recover stolen funds, and we cannot act until a full investigation is complete. If anyone guarantees recovery for a fee, stop and contact us directly.
          </Alert>
        </div>
      </section>

      <section style={{ background: "var(--navy-900)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 600, color: "var(--cream)", margin: 0, maxWidth: 520, letterSpacing: "-0.01em" }}>Tell us what happened. We'll review your case.</h2>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 15.5, color: "var(--navy-100)", margin: "12px 0 0" }}>The intake form takes about 10 minutes. There is no fee for the initial review.</p>
          </div>
          <Button variant="accent" size="lg" onClick={()=>go("intake")} iconRight={<Ico n="arrow-right"/>}>Begin intake</Button>
        </div>
      </section>
    </div>
  );
}

/* ---------- Intake form ---------- */
function Intake({ go }) {
  const [sent, setSent] = React.useState(false);
  const [method, setMethod] = React.useState("crypto");
  const [agree, setAgree] = React.useState(false);
  if (sent) {
    return (
      <section style={{ background: "var(--cream)", minHeight: 560 }}>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "90px 28px", textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "var(--success-100)", color: "var(--success-700)", marginBottom: 22 }}><Ico n="check" s={30}/></span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 600, color: "var(--ink-900)", margin: 0 }}>Your case has been submitted</h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--ink-600)", lineHeight: 1.6, margin: "16px 0 28px" }}>
            It has been placed in queue for review by our investigation team. Please do not call or email the office — we will reach out once an initial review is complete.
          </p>
          <Button variant="secondary" onClick={()=>go("home")}>Return home</Button>
        </div>
      </section>
    );
  }
  return (
    <section style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 28px 80px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48 }}>
        <aside>
          <a href="#" onClick={(e)=>{e.preventDefault();go("home");}} style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-500)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}><Ico n="arrow-left" s={15}/> Back</a>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--stone-600)" }}>Crypto Fraud &amp; Recovery</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 600, color: "var(--ink-900)", margin: "14px 0 14px", letterSpacing: "-0.01em" }}>Tell us about your case</h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--ink-600)", lineHeight: 1.6 }}>
            The more detail you provide, the faster we can assess whether and how we can help. Everything you share is confidential.
          </p>
          <Alert tone="neutral" icon={<Ico n="lock" s={18}/>} style={{ marginTop: 22 }}>
            Protected by attorney–client confidentiality.
          </Alert>
        </aside>

        <Card padding="lg">
          <form onSubmit={(e)=>{e.preventDefault();setSent(true);}} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First name" required><Input placeholder="Jane" required /></Field>
              <Field label="Last name" required><Input placeholder="Doe" required /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Email" required><Input type="email" placeholder="you@email.com" iconLeft={<Ico n="mail" s={16}/>} required /></Field>
              <Field label="Phone"><Input placeholder="(281) 555-0199" iconLeft={<Ico n="phone" s={16}/>} /></Field>
            </div>
            <Field label="How were the funds sent?" required>
              <div style={{ display: "flex", gap: 22, paddingTop: 4 }}>
                <Radio name="m" value="wire" checked={method==="wire"} onChange={()=>setMethod("wire")} label="Wire transfer" />
                <Radio name="m" value="crypto" checked={method==="crypto"} onChange={()=>setMethod("crypto")} label="Cryptocurrency" />
                <Radio name="m" value="both" checked={method==="both"} onChange={()=>setMethod("both")} label="Both" />
              </div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
              <Field label="Approximate amount lost (USD)" required><Input placeholder="$0.00" iconLeft={<Ico n="dollar-sign" s={16}/>} required /></Field>
              <Field label="Date of last transaction"><Input type="date" /></Field>
            </div>
            <Field label="Platform or exchange involved" hint="e.g. Coinbase, Binance, an unknown 'trading platform'">
              <Input placeholder="Name the platform, app, or website" iconLeft={<Ico n="globe" s={16}/>} />
            </Field>
            <Field label="Describe what happened" required>
              <Textarea rows={5} placeholder="When did you first notice something was wrong? How were you contacted? What were you asked to do?" />
            </Field>
            <Field>
              <Checkbox checked={agree} onChange={(e)=>setAgree(e.target.checked)} label="I have read and agree with the foregoing disclaimer, and understand Berg PC cannot act until a full investigation is complete." />
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
              <Button variant="ghost" type="button" onClick={()=>go("home")}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={!agree} iconRight={<Ico n="arrow-right"/>}>Submit case for review</Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}

window.BergWebScreens = { CryptoRecovery, Intake };
