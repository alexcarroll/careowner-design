// Find Buyers view — sortable, selectable table with filter chips

const BuyersView = ({ section, onSection, onEdit }) => {
  const [filter, setFilter] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState({ key: "lastActive", dir: "asc" });
  const [selected, setSelected] = React.useState(new Set());
  const [detail, setDetail] = React.useState(null);

  const filtered = React.useMemo(() => {
    let list = BUYERS.slice();
    if (filter !== "all") list = list.filter(b => b.interest.toLowerCase() === filter);
    if (q) list = list.filter(b => (b.name + b.type + b.location).toLowerCase().includes(q.toLowerCase()));
    list.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filter, q, sort]);

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  const toggleRow = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const SortHead = ({ k, children, style }) => (
    <th style={style} className={sort.key === k ? "is-sorted" : ""} onClick={() => toggleSort(k)}>
      <span className="co-sort">{children}{sort.key === k && <Icon name={sort.dir === "asc" ? "arrowUp" : "arrowDown"} size={11} />}</span>
    </th>
  );

  const BadgeStatus = ({ s }) => ({
    active: <span className="co-badge co-badge--green">Active</span>,
    verified: <span className="co-badge co-badge--blue">Verified</span>,
    paused: <span className="co-badge co-badge--gray">Paused</span>,
  }[s]);

  return (
    <>
      <SubHeader crumbs={["Find Buyers"]} title="Find Buyers" actions={<>
        <button className="co-btn-outline"><Icon name="filter" /> Saved Searches</button>
        <button className="co-btn-solid"><Icon name="plus" /> Invite Buyer</button>
      </>} />
      <div className="co-page">
        <LeftRail section={section} onSection={onSection} />
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="co-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 16, borderBottom: "1px solid var(--stone-200)" }}>
              <div className="co-filters">
                <div className="co-search">
                  <Icon name="search" />
                  <input placeholder="Search buyers by name, type, or location…" value={q} onChange={e => setQ(e.target.value)} />
                </div>
                {["all", "high", "medium", "low"].map(f => (
                  <button key={f} className={`co-chip ${filter === f ? "is-active" : ""}`} onClick={() => setFilter(f)}>
                    {f === "all" ? "All Interest" : f.charAt(0).toUpperCase() + f.slice(1) + " Interest"}
                  </button>
                ))}
                {selected.size > 0 && (
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ font: "500 13px/1 Inter", color: "var(--stone-500)" }}>{selected.size} selected</span>
                    <button className="co-btn co-btn--ghost"><Icon name="message" size={14} /> Message</button>
                    <button className="co-btn co-btn--primary"><Icon name="send" size={14} /> Invite to Review</button>
                  </div>
                )}
              </div>
            </div>
            <table className="co-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <SortHead k="name">Buyer</SortHead>
                  <SortHead k="type">Type</SortHead>
                  <SortHead k="location">Location</SortHead>
                  <SortHead k="funds">Funds</SortHead>
                  <SortHead k="offers">Offers</SortHead>
                  <SortHead k="status">Status</SortHead>
                  <SortHead k="lastActive">Last Active</SortHead>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className={selected.has(b.id) ? "is-selected" : ""} onClick={() => setDetail(b)} style={{ cursor: "pointer" }}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" className="co-table__cb" checked={selected.has(b.id)} onChange={() => toggleRow(b.id)} /></td>
                    <td>
                      <div className="co-table__name">{b.name}</div>
                      <div className="co-table__sub">Interest: {b.interest}</div>
                    </td>
                    <td>{b.type}</td>
                    <td>{b.location}</td>
                    <td>{b.funds}</td>
                    <td>{b.offers}</td>
                    <td><BadgeStatus s={b.status} /></td>
                    <td style={{ color: "var(--stone-500)" }}>{b.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="co-empty">No buyers match your filters.</div>}
          </div>
        </div>
      </div>
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)} footer={<>
          <button className="co-btn co-btn--ghost" onClick={() => setDetail(null)}>Close</button>
          <button className="co-btn co-btn--primary" onClick={() => { setDetail(null); onEdit({ title: `Message ${detail.name}`, kind: "message-buyer" }); }}>
            <Icon name="message" size={14} /> Message Buyer
          </button>
        </>}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><div className="co-deal__label">Type</div><div className="co-deal__value">{detail.type}</div></div>
            <div><div className="co-deal__label">Location</div><div className="co-deal__value">{detail.location}</div></div>
            <div><div className="co-deal__label">Funds Available</div><div className="co-deal__value">{detail.funds}</div></div>
            <div><div className="co-deal__label">Interest Level</div><div className="co-deal__value">{detail.interest}</div></div>
            <div><div className="co-deal__label">Offers Submitted</div><div className="co-deal__value">{detail.offers}</div></div>
            <div><div className="co-deal__label">Last Active</div><div className="co-deal__value">{detail.lastActive}</div></div>
          </div>
          <p style={{ marginTop: 16, font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>
            {detail.type.includes("Corporate") ? "Multi-location operator actively consolidating Midwest small-animal practices. Strong preference for joint-venture structures with 2–3 year seller transitions." : "Verified professional with completed CareOwner buyer onboarding. Pre-approved for stated range."}
          </p>
        </Modal>
      )}
    </>
  );
};

Object.assign(window, { BuyersView });
