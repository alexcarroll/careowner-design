// Requests view — every inbound connection request in one inbox.
//   /requests (legacy alias: /inquiries)
// Counterparties are mixed by design: potential buyers, Talent Acquisition
// Specialists, and vetted third-party partners all request a connection the same
// way, so they share one queue with a "From" filter rather than separate pages.

const REQUEST_TYPE_META = {
  buyer:      { icon: "user",  cls: "rq-type--buyer" },
  specialist: { icon: "users", cls: "rq-type--specialist" },
  partner:    { icon: "briefcase", cls: "rq-type--partner" },
};

const RequestsView = ({ section, onSection, onEdit }) => {
  const [filter, setFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [selected, setSelected] = React.useState(null);

  const byStatus = (s) => REQUESTS.filter(r => r.status === s).length;
  const byType = (t) => REQUESTS.filter(r => r.type === t).length;

  const filtered = REQUESTS.filter(r =>
    (filter === "all" || r.status === filter) &&
    (typeFilter === "all" || r.type === typeFilter));

  const Status = ({ s }) => ({
    new: <span className="co-badge co-badge--blue">New</span>,
    replied: <span className="co-badge co-badge--green">Replied</span>,
    closed: <span className="co-badge co-badge--gray">Closed</span>,
  }[s]);
  const Priority = ({ p }) => ({
    high: <span className="co-badge co-badge--rose">High</span>,
    medium: <span className="co-badge co-badge--amber">Medium</span>,
    low: <span className="co-badge co-badge--gray">Low</span>,
  }[p]);

  const statusTabs = [
    { id: "all", label: "All", n: REQUESTS.length },
    { id: "new", label: "New", n: byStatus("new") },
    { id: "replied", label: "Replied", n: byStatus("replied") },
    { id: "closed", label: "Closed", n: byStatus("closed") },
  ];
  const typeTabs = [
    { id: "all", label: "Everyone" },
    { id: "buyer", label: "Buyers", n: byType("buyer") },
    { id: "specialist", label: "Talent Specialists", n: byType("specialist") },
    { id: "partner", label: "Partners", n: byType("partner") },
  ];

  return (
    <>
      <SubHeader crumbs={["Requests"]} title="Requests"
        subtitle="Connection requests from buyers, talent specialists, and partners — all in one place."
        actions={<>
          <button className="co-btn-outline"><Icon name="download" /> Export</button>
        </>} />
      <div className="co-body">
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="co-card" style={{ padding: 0 }}>
            <div className="rq-toolbar">
              <div className="co-filters" style={{ margin: 0 }}>
                {statusTabs.map(f => (
                  <button key={f.id} className={`co-chip ${filter === f.id ? "is-active" : ""}`} onClick={() => setFilter(f.id)}>
                    {f.label} <span style={{ opacity: 0.6 }}>· {f.n}</span>
                  </button>
                ))}
              </div>
              <div className="bf-field">
                <span className="bf-label">From</span>
                <select className="ta-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  {typeTabs.map(t => (
                    <option key={t.id} value={t.id}>{t.label}{t.n != null ? ` · ${t.n}` : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <table className="co-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Type</th>
                  <th>Request</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const m = REQUEST_TYPE_META[r.type] || REQUEST_TYPE_META.buyer;
                  return (
                    <tr key={r.id} onClick={() => setSelected(r)} style={{ cursor: "pointer" }}>
                      <td>
                        <div className="co-table__name">{r.from}</div>
                        <div className="co-table__sub">{r.org}</div>
                      </td>
                      <td>
                        <span className={`rq-type ${m.cls}`}><Icon name={m.icon} size={12} /> {REQUEST_TYPE_LABELS[r.type]}</span>
                      </td>
                      <td>{r.subject}</td>
                      <td><Priority p={r.priority} /></td>
                      <td><Status s={r.status} /></td>
                      <td style={{ color: "var(--stone-500)", whiteSpace: "nowrap" }}>{r.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="co-empty">No requests match your filters.</div>}
          </div>
        </div>
      </div>
      {selected && (
        <Modal title={selected.subject} onClose={() => setSelected(null)} footer={<>
          <button className="co-btn co-btn--ghost" onClick={() => setSelected(null)}>Close</button>
          <button className="co-btn co-btn--primary" onClick={() => { setSelected(null); onEdit({ title: "Reply", kind: "reply", msg: "Your request has been received." }); }}>
            <Icon name="send" size={14} /> Reply
          </button>
        </>}>
          <div style={{ marginBottom: 16 }}>
            <div className="co-deal__label">From</div>
            <div className="co-deal__value">{selected.from}</div>
            <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>
              {selected.org} · {REQUEST_TYPE_LABELS[selected.type]}
            </div>
          </div>
          <div style={{ marginBottom: 16, display: "flex", gap: 20 }}>
            <div><div className="co-deal__label">Priority</div><div><Priority p={selected.priority} /></div></div>
            <div><div className="co-deal__label">Status</div><div><Status s={selected.status} /></div></div>
            <div><div className="co-deal__label">Date</div><div className="co-deal__value">{selected.date}</div></div>
          </div>
          <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)", borderLeft: "3px solid var(--stone-200)", paddingLeft: 14, margin: 0 }}>
            {selected.type === "specialist"
              ? `We work with DVMs across the region and think there's a match for your practice. Happy to make an introduction through CareOwner whenever you're ready.`
              : selected.type === "partner"
                ? `We'd like to connect regarding ${selected.subject.toLowerCase()}. Everything can be handled through CareOwner at your convenience.`
                : `We're reviewing the AnimalCare listing and would like to proceed to the next step. Please confirm availability for ${selected.subject.toLowerCase()} at your earliest convenience.`}
          </p>
        </Modal>
      )}
    </>
  );
};

Object.assign(window, { RequestsView });
