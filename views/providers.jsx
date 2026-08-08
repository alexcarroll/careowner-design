// Providers — the specialists a seller assembles around a deal, in one
// directory: Talent Acquisition Specialists (moved here from the old Find
// Buyers tab), plus Attorneys, CPAs, and Financial Advisors.
//   /providers           → My Network: providers you've contacted or connected with
//   /providers#explore   → Explore: the full vetted directory
// Rows come from TA_SPECIALISTS (merged with TA_PROVIDER_EXTRAS: team size,
// per-recruiter stats, testimonials, open-to flags) and PROVIDERS (data.jsx).
// A row opens the full-page profile (Figma 276:12076) — same anatomy as the
// Buyer profile. Contact happens only through CareOwner Messages — the compose
// modal writes into THREADS so every conversation is tracked on-platform.
(() => {

const PV_KINDS = [
  { id: "ta", label: "Talent Acquisition", slideoutTitle: "Talent Acquisition Specialist" },
  { id: "attorney", label: "Attorney", slideoutTitle: "Attorney" },
  { id: "cpa", label: "CPA", slideoutTitle: "CPA" },
  { id: "advisor", label: "Financial Advisor", slideoutTitle: "Financial Advisor" },
];
const pvKind = (k) => PV_KINDS.find(x => x.id === k) || { label: k, slideoutTitle: k };

const PV_AVATAR_COLORS = {
  teal:   "#1B6970",
  amber:  "#B45309",
  indigo: "#4F46E5",
  violet: "#6D28D9",
  green:  "#15803D",
  rose:   "#BE185D",
};

const PvAvatar = ({ p, size = 34, font = 13 }) => (
  <span className="ta-avatar" style={{ width: size, height: size, fontSize: font, background: PV_AVATAR_COLORS[p.color] || "#57534E" }}>
    {p.initials}
  </span>
);

const pvFirstName = (p) => p.name.split(" ")[0];

// One unified row shape: TA specialists carry their Providers-page extras and
// alias agency → firm so every card renders the same fields.
const pvRows = () =>
  TA_SPECIALISTS.map(t => ({ ...t, ...(TA_PROVIDER_EXTRAS[t.id] || {}), kind: "ta", firm: t.agency }))
    .concat(PROVIDERS);

// Connection state (same language as the specialist directory):
//   open → sent (messaged this session or seeded) → connected (they replied).
// TA threads keep the "ta-thread-" ids used by Promotions so both entry points
// see the same conversation.
const pvThreadId = (p) => (p.kind === "ta" ? "ta-thread-" : "pv-thread-") + p.id;
const pvConn = (p) => {
  if (p.connection === "connected") return "connected";
  const messaged = typeof THREADS !== "undefined" && THREADS.some(th => th.id === pvThreadId(p));
  return messaged ? "sent" : (p.connection || "open");
};

const PV_STATUS = {
  open:      { label: "Open",      cls: "co-badge--blue",  dot: null },
  sent:      { label: "Sent",      cls: "co-badge--amber", dot: "pending" },
  connected: { label: "Connected", cls: "co-badge--green", dot: "live" },
};

// "Open to" referral modes a TA firm opted into on their own profile.
const PV_OPEN_TO = [
  { key: "hires",  label: "Recruiting DVM Hires",  hint: "Helps practice owners find DVMs to hire full- or part-time" },
  { key: "buyers", label: "Referring DVM Buyers",  hint: "Sends DVMs in their network who want to buy a practice" },
];

const pvIntro = (p) => p.kind === "ta"
  ? `Hi ${pvFirstName(p)} — I own a ${PRACTICE.type.toLowerCase()} in the suburban Midwest, listed anonymously on CareOwner ` +
    `(“${MY_LISTING.title}”). I'm looking for a DVM buyer and thought of your network. ` +
    `Do you know any veterinarians who are exploring ownership right now? Happy to share more here on CareOwner.`
  : `Hi ${pvFirstName(p)} — I'm preparing to sell my ${PRACTICE.type.toLowerCase()}, listed on CareOwner ` +
    `(“${MY_LISTING.title}”), and I'm looking for help with ${p.focus.toLowerCase()}. ` +
    `Are you taking on new clients this quarter?`;

// ─── Message compose modal ────────────────────────────────────────────────────
// TODO(api): create a real thread; for now write into the in-memory THREADS
// store so the conversation shows up in Messages like any buyer thread.
const PvComposeModal = ({ p, onClose, onToast }) => {
  const [msg, setMsg] = React.useState(() => pvIntro(p));
  const send = () => {
    if (!msg.trim()) return;
    const existing = THREADS.find(th => th.id === pvThreadId(p));
    if (existing) {
      existing.messages.push({ from: "me", text: msg.trim(), time: "Just now" });
      Object.assign(existing, { last: msg.trim(), time: "now" });
    } else {
      THREADS.unshift({
        id: pvThreadId(p), name: p.name, initials: p.initials,
        last: msg.trim(), time: "now", unread: 0,
        messages: [{ from: "me", text: msg.trim(), time: "Just now" }],
      });
    }
    onToast(`Message sent to ${p.name}`);
    onClose();
  };
  return (
    <Modal title={`Message ${pvFirstName(p)}`} onClose={onClose} footer={<>
      <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
      <button className="co-btn co-btn--primary" onClick={send} disabled={!msg.trim()}>
        <Icon name="send" size={14} /> Send message
      </button>
    </>}>
      <div className="co-field">
        <label>Your message to {pvFirstName(p)}</label>
        <textarea rows={6} value={msg} onChange={e => setMsg(e.target.value)} />
      </div>
      <div className="pr-tip" style={{ marginTop: 8 }}>
        <Icon name="lock" size={13} /> Sent through CareOwner Messages — your name stays hidden until you choose to share it.
      </div>
    </Modal>
  );
};

// ─── Full-page profile (Figma 276:12076) ──────────────────────────────────────
// Same page anatomy as the Buyer profile (bp-* classes + BpCard from
// views/buyerprofile.jsx): header with badges, Background card on the left,
// sticky rail with "Open to..." (TA firms' opted-in referral modes) and the
// Network / Details read-only rows on the right.
const ProviderProfileView = ({ p, onBack, onToast }) => {
  const [composing, setComposing] = React.useState(false);
  const kind = pvKind(p.kind);
  const openTo = p.kind === "ta" ? PV_OPEN_TO.filter(o => p.openTo && p.openTo[o.key]) : [];
  const subLabel = { fontSize: "12px", fontWeight: 500 };

  return (
    <div className="co-body">
      <button className="co-btn-back" style={{ marginBottom: 16 }} onClick={onBack}>
        <Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back
      </button>

      <div className="bp-head">
        <div className="bp-head__avatar" style={{ background: PV_AVATAR_COLORS[p.color] || "#57534E" }}>{p.initials}</div>
        <div className="bp-head__main">
          <div className="bp-head__namerow">
            <h1 className="bp-head__name">{p.name}</h1>
            <span className="bp-type"><Icon name="briefcase" size={13} />{kind.label}</span>
          </div>
          <div className="bp-head__meta">
            <span><Icon name="location" size={15} />{p.location}</span>
            <span><Icon name="briefcase" size={15} />{p.title} · {p.firm}</span>
          </div>
        </div>
        <div className="bp-head__actions">
          <button className="co-btn-outline"><Icon name="star" size={15} />Save</button>
          <button className="co-btn-solid" onClick={() => setComposing(true)}><Icon name="message" size={15} />Message</button>
        </div>
      </div>

      <div className="bp-cols">
        <BpCard title="Background" icon="user">
          <div className="bp-block" style={{ marginTop: 0 }}>
            <div className="bp-sub" style={subLabel}>Bio</div>
            <p className="bp-prose">{p.about}</p>
          </div>
          <div className="bp-block">
            <div className="bp-sub" style={subLabel}>{p.kind === "ta" ? "Veterinary specialties" : "Focus"}</div>
            <div className="bp-chips">
              <span className="bp-chip">{p.focus}</span>
              {p.kind !== "ta" && p.credentials && <span className="bp-chip">{p.credentials}</span>}
            </div>
          </div>
          {p.kind === "ta" && (
            <div className="bp-block">
              <div className="bp-sub" style={subLabel}>Roles focused on</div>
              <div className="bp-chips">
                {(p.worksWith || []).map(w => <span key={w} className="bp-chip">{w}</span>)}
              </div>
            </div>
          )}
          {(p.testimonials || []).length > 0 && (
            <div className="bp-block">
              <div className="bp-sub" style={subLabel}>Testimonials</div>
              {p.testimonials.map((t, i) => (
                <blockquote key={i} className="pv-quote">
                  <p>“{t.quote}”</p>
                  <footer>{t.author}</footer>
                </blockquote>
              ))}
            </div>
          )}
        </BpCard>

        <aside className="bp-rail">
          {openTo.length > 0 && (
            <BpCard title="Open to..." icon="checkCircle">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                {openTo.map(o => (
                  <span key={o.key} className="bp-verify" title={o.hint}>
                    <Icon name="checkCircle" size={14} />{o.label}
                  </span>
                ))}
              </div>
            </BpCard>
          )}
          <BpCard title={p.kind === "ta" ? "Network" : "Details"} icon={p.kind === "ta" ? "users" : "info"}>
            <div className="bp-ro bp-ro--caps">
              <div className="bp-ro__row">
                <span className="bp-ro__label">Geography targeted</span>
                <span className="bp-ro__val" style={{ fontWeight: 400 }}>{p.regions.join(", ")}</span>
              </div>
              {p.kind === "ta" ? (
                <>
                  <div className="bp-ro__row"><span className="bp-ro__label">Recruiters on team</span><span className="bp-ro__val">{p.team}</span></div>
                  <div className="bp-ro__row"><span className="bp-ro__label">DVMs in team's network</span><span className="bp-ro__val">{p.dvmNetwork}</span></div>
                  <div className="bp-ro__row"><span className="bp-ro__label">DVMs recruited last year</span><span className="bp-ro__val">{(p.team || 0) * (p.recruitedPerRecruiter || 0)}</span></div>
                </>
              ) : (
                <>
                  <div className="bp-ro__row"><span className="bp-ro__label">Years of experience</span><span className="bp-ro__val">{p.yearsExp}</span></div>
                  <div className="bp-ro__row"><span className="bp-ro__label">Practice owners served</span><span className="bp-ro__val">{p.clientsServed}+</span></div>
                  <div className="bp-ro__row"><span className="bp-ro__label">Avg response time</span><span className="bp-ro__val">{p.avgResponse}</span></div>
                </>
              )}
            </div>
          </BpCard>
        </aside>
      </div>

      {composing && <PvComposeModal p={p} onClose={() => setComposing(false)} onToast={onToast} />}
    </div>
  );
};

// ─── Directory ────────────────────────────────────────────────────────────────
const ProvidersView = ({ tab, onToast }) => {
  const activeTab = tab === "explore" ? "explore" : "network";
  const [q, setQ] = React.useState("");
  const [kindFilter, setKindFilter] = React.useState("all");

  const all = pvRows();
  // Deep-linkable profiles: /providers#<provider-id> renders the full page —
  // this is also how the Promotions preview slideouts land here.
  const detail = tab ? all.find(p => p.id === tab) : null;
  const network = all.filter(p => pvConn(p) !== "open");
  const base = activeTab === "network" ? network : all;

  const filtered = base.filter(p => {
    if (kindFilter !== "all" && p.kind !== kindFilter) return false;
    if (q) {
      const hay = (p.name + " " + p.firm + " " + p.location + " " + p.regions.join(" ") + " " + p.focus + " " + pvKind(p.kind).label).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  // Active relationships first, then the rest of the platform.
  const order = { connected: 0, sent: 1, open: 2 };
  const rows = filtered.slice().sort((a, b) => order[pvConn(a)] - order[pvConn(b)]);

  const kindOptions = [{ value: "all", label: "All types" }].concat(PV_KINDS.map(k => ({ value: k.id, label: k.label })));

  // Clicking a row opens the full-page profile (same pattern as Buyers).
  if (detail) {
    return <ProviderProfileView p={detail} onBack={() => navigateTo("/providers")} onToast={onToast} />;
  }

  return (
    <>
      <SubHeader crumbs={["Providers"]} title="Providers"
        subtitle="The specialists who help you sell — talent acquisition, attorneys, CPAs, and financial advisors, all vetted and reachable through CareOwner." />
      <div className="co-body">
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="co-tabs" style={{ marginBottom: 20 }}>
            <button className={activeTab === "network" ? "is-active" : ""} onClick={() => navigateTo("/providers")}>
              My Network <span style={{ opacity: 0.6 }}>· {network.length}</span>
            </button>
            <button className={activeTab === "explore" ? "is-active" : ""} onClick={() => navigateTo("/providers#explore")}>
              Explore <span style={{ opacity: 0.6 }}>· {all.length}</span>
            </button>
          </div>

          <div className="bf-filters">
            <div className="co-search bf-search">
              <Icon name="search" />
              <input placeholder="Search providers…" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <BfSelect label="Type" value={kindFilter}
              display={kindFilter === "all" ? "All types" : pvKind(kindFilter).label}
              options={kindOptions} onSelect={setKindFilter} />
          </div>

          <div className="co-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="co-table ta-table">
              <thead>
                <tr>
                  <th style={{ width: 28 }}></th>
                  <th>Provider</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Focus</th>
                  <th>Status</th>
                  <th>Avg response</th>
                  <th style={{ width: 76 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(p => {
                  const conn = pvConn(p);
                  const meta = PV_STATUS[conn];
                  return (
                    <tr key={p.id} onClick={() => navigateTo("/providers#" + p.id)} style={{ cursor: "pointer" }}>
                      <td className="pr-table__dotcell">
                        {meta.dot && <span className={`pr-dot pr-dot--${meta.dot}`} title={meta.label} />}
                      </td>
                      <td>
                        <div className="ta-cell">
                          <PvAvatar p={p} />
                          <div style={{ minWidth: 0 }}>
                            <div className="co-table__name">{p.name}{p.verified && <Icon name="checkCircle" size={13} style={{ color: "var(--teal-brand)", marginLeft: 6, marginBottom: -2 }} />}</div>
                            <div className="co-table__sub">{p.firm}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{pvKind(p.kind).label}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{p.location}</td>
                      <td>{p.focus}</td>
                      <td><span className={`co-badge ${meta.cls} pr-badge`}>{meta.label}</span></td>
                      <td style={{ color: "var(--stone-500)", whiteSpace: "nowrap" }}>{p.avgResponse}</td>
                      <td className="ta-table__end">
                        {(p.unread || 0) > 0 && (
                          <span className="ta-unread" title={`${p.unread} unread`}><Icon name="inbox" size={12} /> {p.unread}</span>
                        )}
                        <Icon name="chevronRight" size={14} style={{ color: "var(--stone-400)" }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="co-empty">
                {activeTab === "network" && network.length === 0
                  ? <>You haven't connected with any providers yet. <button className="pr-link" onClick={() => navigateTo("/providers#explore")}>Explore the directory</button> to find one.</>
                  : "No providers match your filters."}
              </div>
            )}
          </div>

          <p className="ta-foot">
            <Icon name="lock" size={12} /> Providers are vetted CareOwner partners. They see your anonymous listing —
            never your practice name — until you choose to share it.
          </p>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { ProvidersView });

})();
