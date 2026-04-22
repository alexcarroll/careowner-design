// Inquiries view

const InquiriesView = ({ section, onSection, onEdit }) => {
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState({ key: "date", dir: "desc" });
  const [selected, setSelected] = React.useState(null);

  const filtered = INQUIRIES.filter(i => filter === "all" || i.status === filter);
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

  return (
    <>
      <SubHeader crumbs={["Inquiries"]} title="Buyer Inquiries" actions={<>
        <button className="co-btn-outline"><Icon name="download" /> Export</button>
      </>} />
      <div className="co-page">
        <LeftRail section={section} onSection={onSection} />
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="co-card" style={{ padding: 0 }}>
            <div style={{ padding: 16, borderBottom: "1px solid var(--stone-200)" }}>
              <div className="co-filters">
                {[
                  { id: "all", label: "All", n: INQUIRIES.length },
                  { id: "new", label: "New", n: INQUIRIES.filter(i => i.status === "new").length },
                  { id: "replied", label: "Replied", n: INQUIRIES.filter(i => i.status === "replied").length },
                  { id: "closed", label: "Closed", n: INQUIRIES.filter(i => i.status === "closed").length },
                ].map(f => (
                  <button key={f.id} className={`co-chip ${filter === f.id ? "is-active" : ""}`} onClick={() => setFilter(f.id)}>
                    {f.label} <span style={{ opacity: 0.6 }}>· {f.n}</span>
                  </button>
                ))}
              </div>
            </div>
            <table className="co-table">
              <thead>
                <tr>
                  <th onClick={() => setSort(s => ({ key: "from", dir: s.dir === "asc" ? "desc" : "asc" }))} className={sort.key === "from" ? "is-sorted" : ""}>From</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id} onClick={() => setSelected(i)} style={{ cursor: "pointer" }}>
                    <td className="co-table__name">{i.from}</td>
                    <td>{i.subject}</td>
                    <td><Priority p={i.priority} /></td>
                    <td><Status s={i.status} /></td>
                    <td style={{ color: "var(--stone-500)" }}>{i.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selected && (
        <Modal title={selected.subject} onClose={() => setSelected(null)} footer={<>
          <button className="co-btn co-btn--ghost" onClick={() => setSelected(null)}>Close</button>
          <button className="co-btn co-btn--primary" onClick={() => { setSelected(null); onEdit({ title: "Reply", kind: "reply", msg: "Your inquiry has been received." }); }}>
            <Icon name="send" size={14} /> Reply
          </button>
        </>}>
          <div style={{ marginBottom: 16 }}>
            <div className="co-deal__label">From</div>
            <div className="co-deal__value">{selected.from}</div>
          </div>
          <div style={{ marginBottom: 16, display: "flex", gap: 20 }}>
            <div><div className="co-deal__label">Priority</div><div><Priority p={selected.priority} /></div></div>
            <div><div className="co-deal__label">Status</div><div><Status s={selected.status} /></div></div>
            <div><div className="co-deal__label">Date</div><div className="co-deal__value">{selected.date}</div></div>
          </div>
          <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)", borderLeft: "3px solid var(--stone-200)", paddingLeft: 14, margin: 0 }}>
            We're reviewing the AnimalCare listing and would like to proceed to the next step. Please confirm availability for {selected.subject.toLowerCase()} at your earliest convenience.
          </p>
        </Modal>
      )}
    </>
  );
};

Object.assign(window, { InquiriesView });
