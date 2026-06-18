/* ============================================================
   Berg PC Case Platform — Supabase data layer (drop-in for db.js)
   ------------------------------------------------------------
   Exposes the SAME window.DB API as the localStorage db.js, so the
   React components do not change. Strategy:
     • On login, hydrate an in-memory cache of everything the signed-in
       user is allowed to see (RLS enforces this on the server).
     • Reads (clientsFor, clientById, activity…) are synchronous against
       the cache — exactly like the demo.
     • Writes call Supabase, then refresh the cache and emit() so the UI
       re-renders. Realtime keeps multiple sessions in sync.

   SETUP
     1. Run supabase/schema.sql in your Supabase project.
     2. Fill in supabase/config.js (URL + anon key).
     3. In app/index.html, load the SDK + config + THIS file instead of db.js
        (see supabase/README.md for the exact tags), and make login/register
        await window.DB.login(...) (auth.jsx diff in the README).
   ============================================================ */
(function () {
  // Loaded globals (see README for script tags):
  //   window.supabase            — @supabase/supabase-js UMD
  //   window.BERG_SUPABASE_URL / window.BERG_SUPABASE_ANON_KEY  (config.js)
  const sb = window.supabase.createClient("https://wfaloikmocgbxtgiwcrk.supabase.co", "sb_publishable_e5bo2j5ZLq0lgUQYRLZHCw_pmao2kXG");

  /* ---- constants (identical to db.js — kept client-side) ---- */
  const STRATEGIES = [
    { id: "court_freeze", label: "Court injunction (wallet freeze)", icon: "snowflake", group: "Judicial", desc: "Petition the court for an injunction freezing identifiable criminal wallets within the jurisdiction.", domesticOnly: true },
    { id: "vasp_freeze", label: "Exchange / VASP cooperation freeze", icon: "building-2", group: "Judicial", desc: "Coordinate with the exchange where funds landed to flag and freeze tainted deposits." },
    { id: "stablecoin_freeze", label: "Stablecoin issuer freeze (USDT/USDC)", icon: "coins", group: "On-chain", desc: "File a freeze request with Tether / Circle to blacklist the implicated address." },
    { id: "mlat", label: "Mutual Legal Assistance (MLAT)", icon: "globe", group: "Cross-border", desc: "Use treaty channels to request investigation and seizure by foreign authorities." },
    { id: "ic3_fbi", label: "IC3 / FBI report & referral", icon: "shield", group: "Law enforcement", desc: "File with the FBI's IC3 to drive freezes and tracing at the enforcement level." },
    { id: "interpol", label: "Interpol / cross-border enforcement", icon: "siren", group: "Cross-border", desc: "For overseas rings, push for international enforcement cooperation and red notices." },
    { id: "forensic_report", label: "Blockchain forensic report", icon: "file-search", group: "On-chain", desc: "Produce a chain-of-funds forensic report admissible for enforcement and litigation." },
    { id: "osint_id", label: "OSINT identity attribution", icon: "user-search", group: "Investigation", desc: "Use open-source intelligence and on-chain clustering to identify the perpetrators." },
    { id: "foreign_civil", label: "Foreign civil litigation", icon: "scale", group: "Cross-border", desc: "Bring a civil recovery action in the foreign jurisdiction where funds or actors sit." },
    { id: "demand_letter", label: "Demand letter / settlement", icon: "mail", group: "Litigation", desc: "Send a demand letter to identifiable parties to push for return or settlement." },
    { id: "bank_recall", label: "Wire recall / chargeback", icon: "banknote", group: "Banking", desc: "For wire portions, initiate a bank recall or chargeback procedure." },
    { id: "insurance", label: "Insurance / platform liability claim", icon: "umbrella", group: "Other", desc: "Assess cyber-insurance or platform liability and pursue a claim." },
  ];
  const STAGES = ["Intake", "Investigating", "Filed", "Frozen", "Recovered", "Closed"];
  const STAGE_TONE = { "Intake": "neutral", "Investigating": "info", "Filed": "accent", "Frozen": "warning", "Recovered": "success", "Closed": "neutral" };
  const ROLE_LABEL = { admin: "Administrator", lawyer: "Attorney", client: "Client" };

  /* ---- in-memory cache + subscribers ---- */
  let me = null;                  // { id, role, name, email, title }
  let cache = { users: [], clients: [], activity: [] };
  const subs = new Set();
  const emit = () => subs.forEach((f) => { try { f(); } catch (e) {} });

  /* map a DB row (snake_case + children) to the camelCase shape the app expects */
  function mapClient(row) {
    return {
      id: row.id, userId: row.user_id, lawyerId: row.lawyer_id,
      name: row.name, email: row.email, phone: row.phone, address: row.address, dob: row.dob,
      occupation: row.occupation, idType: row.id_type, idNumber: row.id_number,
      status: row.status, matterType: row.matter_type, amountLost: Number(row.amount_lost) || 0,
      currency: row.currency, dateOfLoss: row.date_of_loss, platform: row.platform, fundsMethod: row.funds_method,
      jurisdiction: row.jurisdiction, overseas: row.overseas, narrative: row.narrative,
      strategies: row.strategies || [], intakeComplete: row.intake_complete,
      createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at,
      wallets: (row.wallets || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0)),
      documents: (row.documents || []).map((d) => ({ ...d, uploadedBy: d.uploaded_by, uploadedAt: d.uploaded_at })),
      timeline: row.timeline || [],
      messages: (row.messages || []).map((m) => ({ ...m, fromId: m.from_id, fromName: m.from_name, fromRole: m.from_role })).sort((a, b) => new Date(a.ts) - new Date(b.ts)),
      notes: (row.notes || []).slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)),
    };
  }

  /* hydrate everything the current user can see (RLS does the filtering) */
  async function hydrate() {
    if (!me) return;
    const [{ data: profiles }, { data: clients }, { data: activity }] = await Promise.all([
      sb.from("profiles").select("*"),
      sb.from("clients").select("*, wallets(*), documents(*), timeline(*), messages(*), notes(*)").order("created_at", { ascending: false }),
      sb.from("activity").select("*").order("ts", { ascending: false }).limit(60),
    ]);
    cache.users = (profiles || []).map((p) => ({ id: p.id, role: p.role, name: p.name, email: p.email, title: p.title }));
    cache.clients = (clients || []).map(mapClient);
    cache.activity = activity || [];
    emit();
  }

  async function refreshClient(id) {
    const { data } = await sb.from("clients").select("*, wallets(*), documents(*), timeline(*), messages(*), notes(*)").eq("id", id).single();
    if (!data) return;
    const mapped = mapClient(data);
    const i = cache.clients.findIndex((c) => c.id === id);
    if (i >= 0) cache.clients[i] = mapped; else cache.clients.unshift(mapped);
    emit();
  }

  async function logActivity(action, target) {
    await sb.from("activity").insert({ actor: me ? me.name : "System", action, target: target || "" });
  }

  /* ---- realtime: any change to a visible row re-hydrates ---- */
  function subscribeRealtime() {
    sb.channel("berg-all")
      .on("postgres_changes", { event: "*", schema: "public" }, () => { hydrate(); })
      .subscribe();
  }

  const DB = {
    STRATEGIES, STAGES, STAGE_TONE, ROLE_LABEL,
    strategyById: (id) => STRATEGIES.find((s) => s.id === id),
    fmtMoney: (n) => "$" + Number(n || 0).toLocaleString("en-US"),
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

    /* Call once at boot BEFORE rendering: restores an existing session. */
    async init() {
      try {
        const { data } = await sb.auth.getSession();
        if (data && data.session) {
          const { data: prof } = await sb.from("profiles").select("*").eq("id", data.session.user.id).single();
          if (prof) { me = { id: prof.id, role: prof.role, name: prof.name, email: prof.email, title: prof.title }; await hydrate(); subscribeRealtime(); }
        }
      } catch (e) { console.error("init failed (continuing to login):", e); }
      return me;
    },

    currentUser() { return me; },

    async login(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email: String(email).trim(), password });
      if (error) return { error: error.message || "Incorrect email or password" };
      const { data: prof } = await sb.from("profiles").select("*").eq("id", data.user.id).single();
      me = prof ? { id: prof.id, role: prof.role, name: prof.name, email: prof.email, title: prof.title } : { id: data.user.id, role: "client", name: data.user.email, email: data.user.email };
      await hydrate(); subscribeRealtime();
      return { user: me };
    },

    async logout() { await sb.auth.signOut(); me = null; cache = { users: [], clients: [], activity: [] }; emit(); },

    async register({ name, email, password, role = "client" }) {
      const { data, error } = await sb.auth.signUp({ email: String(email).trim(), password, options: { data: { name, role } } });
      if (error) return { error: error.message };
      // the DB trigger creates profile + blank case; sign in to get a session
      return await this.login(email, password);
    },

    /* ---- synchronous reads (against cache) ---- */
    users() { return cache.users; },
    lawyers() { return cache.users.filter((u) => u.role === "lawyer"); },
    clientsFor(user) {
      if (!user) return [];
      if (user.role === "admin") return cache.clients;
      if (user.role === "lawyer") return cache.clients.filter((c) => c.lawyerId === user.id);
      return cache.clients.filter((c) => c.userId === user.id);
    },
    clientById(id) { return cache.clients.find((c) => c.id === id) || null; },
    clientByUser(userId) { return cache.clients.find((c) => c.userId === userId) || null; },
    activity() { return cache.activity; },
    unreadFor(user) { let n = 0; this.clientsFor(user).forEach((c) => (c.messages || []).forEach((m) => { if (m.fromId !== user.id && !m.read) n++; })); return n; },

    /* ---- writes (async; update cache + emit) ---- */
    async addUser(u) {
      // admin-created accounts: use a server function or the Admin API in production.
      // For now, register through normal signup (requires email confirmation off).
      const r = await sb.auth.admin ? null : null;
      const res = await sb.auth.signUp({ email: u.email, password: u.password, options: { data: { name: u.name, role: u.role, title: u.title || "" } } });
      await logActivity("created " + ROLE_LABEL[u.role] + " account", u.name);
      await hydrate();
      return res.data && res.data.user;
    },
    async updateUser(id, patch) {
      const p = {}; if (patch.name != null) p.name = patch.name; if (patch.title != null) p.title = patch.title; if (patch.role != null) p.role = patch.role;
      await sb.from("profiles").update(p).eq("id", id); await hydrate();
    },
    async deleteUser(id) { await sb.from("profiles").delete().eq("id", id); await hydrate(); },

    async updateClient(id, patch, actorName) {
      const p = {};
      const map = { name: "name", email: "email", phone: "phone", address: "address", dob: "dob", occupation: "occupation", idType: "id_type", idNumber: "id_number", status: "status", matterType: "matter_type", amountLost: "amount_lost", dateOfLoss: "date_of_loss", platform: "platform", fundsMethod: "funds_method", jurisdiction: "jurisdiction", overseas: "overseas", narrative: "narrative", intakeComplete: "intake_complete", lawyerId: "lawyer_id" };
      Object.keys(patch).forEach((k) => { if (map[k]) p[map[k]] = patch[k]; });
      p.updated_at = new Date().toISOString();
      await sb.from("clients").update(p).eq("id", id);
      if (actorName) await logActivity("updated client profile / case", patch.name || (cache.clients.find((c) => c.id === id) || {}).name);
      await refreshClient(id);
    },
    async assign(clientId, lawyerId) {
      await sb.from("clients").update({ lawyer_id: lawyerId || null }).eq("id", clientId);
      const l = cache.users.find((u) => u.id === lawyerId);
      await logActivity("assigned to " + (l ? l.name : "—"), (cache.clients.find((c) => c.id === clientId) || {}).name);
      await hydrate();
    },
    async addClientByLawyer(lawyer, data) {
      const { data: row } = await sb.from("clients").insert({
        lawyer_id: lawyer.id, created_by: lawyer.id, intake_complete: true,
        name: data.name, email: data.email || "", phone: data.phone || "", matter_type: data.matterType || "Crypto Fraud",
        amount_lost: data.amountLost || 0, overseas: !!data.overseas, jurisdiction: data.jurisdiction || (data.overseas ? "Overseas" : "Domestic"),
      }).select().single();
      await logActivity("created case", data.name);
      await hydrate();
      return row ? mapClient(row) : null;
    },

    async addDoc(clientId, doc, actorName) {
      await sb.from("documents").insert({ client_id: clientId, name: doc.name, type: doc.type, size: doc.size, status: "review", uploaded_by: actorName || "" });
      await logActivity("uploaded evidence " + doc.name, (cache.clients.find((c) => c.id === clientId) || {}).name);
      await refreshClient(clientId);
    },
    async setDocStatus(clientId, docId, status) { await sb.from("documents").update({ status }).eq("id", docId); await refreshClient(clientId); },
    async removeDoc(clientId, docId) { await sb.from("documents").delete().eq("id", docId); await refreshClient(clientId); },

    async addTimeline(clientId, entry, actorName) {
      await sb.from("timeline").insert({ client_id: clientId, icon: entry.icon || "dot", text: entry.text, by: actorName || "", date: (entry.date || new Date().toISOString().slice(0, 10)) });
      await logActivity(entry.text, (cache.clients.find((c) => c.id === clientId) || {}).name);
      await refreshClient(clientId);
    },
    async setStrategies(clientId, ids, actorName) {
      await sb.from("clients").update({ strategies: ids }).eq("id", clientId);
      await logActivity("updated recovery strategy (" + ids.length + " selected)", (cache.clients.find((c) => c.id === clientId) || {}).name);
      await refreshClient(clientId);
    },
    async setStage(clientId, stage, actorName) {
      await sb.from("clients").update({ status: stage }).eq("id", clientId);
      await sb.from("timeline").insert({ client_id: clientId, icon: "flag", text: "Stage changed to “" + stage + "”", by: actorName || "" });
      await logActivity("changed stage to “" + stage + "”", (cache.clients.find((c) => c.id === clientId) || {}).name);
      await refreshClient(clientId);
    },

    async sendMessage(clientId, fromUser, text) {
      if (!text.trim()) return;
      await sb.from("messages").insert({ client_id: clientId, from_id: fromUser.id, from_name: fromUser.name, from_role: fromUser.role, text: text.trim(), read: false });
      await logActivity("sent a secure message", (cache.clients.find((c) => c.id === clientId) || {}).name);
      await refreshClient(clientId);
    },
    async markMessagesRead(clientId, userId) {
      await sb.from("messages").update({ read: true }).eq("client_id", clientId).neq("from_id", userId).eq("read", false);
      await refreshClient(clientId);
    },
    async addNote(clientId, author, text) {
      if (!text.trim()) return;
      await sb.from("notes").insert({ client_id: clientId, author: author.name, text: text.trim() });
      await logActivity("added an internal note", (cache.clients.find((c) => c.id === clientId) || {}).name);
      await refreshClient(clientId);
    },
    async removeNote(clientId, noteId) { await sb.from("notes").delete().eq("id", noteId); await refreshClient(clientId); },

    async log(actor, action, target) { await logActivity(action, target); await hydrate(); },

    /* not applicable to a shared backend */
    reset() { console.warn("DB.reset() is disabled on the Supabase backend."); },
    blankClient: () => ({}),
  };

  window.DB = DB;
})();
