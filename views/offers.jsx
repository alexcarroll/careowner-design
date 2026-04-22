// Offers view

const OffersView = ({ section, onSection, onEdit }) => {
  const [sort, setSort] = React.useState({ key: "amount", dir: "desc" });
  const [selected, setSelected] = React.useState(null);

  const Status = ({ s }) => ({
    pending: <span className="co-badge co-badge--amber">Pending Review</span>,
    counter: <span className="co-badge co-badge--blue">Countered</span>,
    "accepted-prelim": <span className="co-badge co-badge--green">Prelim Accepted</span>,
    declined: <span className="co-badge co-badge--gray">Declined</span>,
  }[s]);

  const parseAmt = (s) => parseInt(s.replace(/[^0-9]/g, ""), 10);

  const sorted = [...OFFERS].sort((a, b) => {
    if (sort.key === "amount") {
      const d = parseAmt(a.amount) - parseAmt(b.amount);
      return sort.dir === "asc" ? d : -d;
    }
    const d = String(a[sort.key]).localeCompare(String(b[sort.key]));
    return sort.dir === "asc" ? d : -d;
  });

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });

  const topOffer = OFFERS.reduce((m, o) => parseAmt(o.amount) > parseAmt(m.amount) ? o : m);

  return (
    <>
      <SubHeader crumbs={["Offers"]} title="Offers" actions={<>
        <button className="co-btn-outline"><Icon name="download" /> Export</button>
        <button className="co-btn-solid" onClick={() => onEdit({ title: "Counter-offer Template", kind: "counter" })}>
          Counter Template
        </button>
      </>} />
      <div className="co-page">
        <LeftRail section={section} onSection={onSection} />
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="co-kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="co-kpi"><div className="co-kpi__label">Total Offers</div><div className="co-kpi__value">{OFFERS.length}</div><div className="co-kpi__delta up"><Icon name="arrowUp" size={12} />+2 this week</div></div>
            <div className="co-kpi"><div className="co-kpi__label">Highest Offer</div><div className="co-kpi__value">{topOffer.amount}</div><div className="co-kpi__delta" style={{color:"var(--stone-500)"}}>{topOffer.from}</div></div>
            <div className="co-kpi"><div className="co-kpi__label">Avg Offer</div><div className="co-kpi__value">$846K</div><div className="co-kpi__delta up"><Icon name="arrowUp" size={12} />+4.2% vs last month</div></div>
            <div className="co-kpi"><div className="co-kpi__label">Asking Price</div><div className="co-kpi__value">$836K</div><div className="co-kpi__delta" style={{color:"var(--stone-500)"}}>2025 listing</div></div>
          </div>

          <div className="co-card" style={{ padding: 0 }}>
            <table className="co-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("from")} className={sort.key==="from"?"is-sorted":""}>Buyer</th>
                  <th onClick={() => toggleSort("amount")} className={sort.key==="amount"?"is-sorted":""}>Amount <Icon name={sort.key==="amount"&&sort.dir==="asc"?"arrowUp":"arrowDown"} size={11} /></th>
                  <th>Deal Type</th>
                  <th>Submitted</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(o => (
                  <tr key={o.id} onClick={() => setSelected(o)} style={{ cursor: "pointer" }}>
                    <td className="co-table__name">{o.from}</td>
                    <td style={{ font: "700 16px/1 Inter" }}>{o.amount}</td>
                    <td>{o.type}</td>
                    <td style={{ color: "var(--stone-500)" }}>{o.submitted}</td>
                    <td style={{ color: "var(--stone-500)" }}>{o.expires}</td>
                    <td><Status s={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selected && (
        <Modal title={`Offer from ${selected.from}`} onClose={() => setSelected(null)} footer={<>
          <button className="co-btn co-btn--ghost" onClick={() => setSelected(null)}>Decline</button>
          <button className="co-btn co-btn--ghost" onClick={() => { setSelected(null); onEdit({ title: "Send Counter-offer", kind: "counter", from: selected.from }); }}>Counter</button>
          <button className="co-btn co-btn--primary" onClick={() => { setSelected(null); onEdit({ title: "Accept Offer", kind: "accept", from: selected.from, amt: selected.amount }); }}>Accept</button>
        </>}>
          <div style={{ marginBottom: 20, padding: 16, background: "var(--stone-50)", borderRadius: 8, textAlign: "center" }}>
            <div className="co-deal__label">Offer Amount</div>
            <div style={{ font: "700 32px/1 Inter", letterSpacing: "-0.02em", marginTop: 6 }}>{selected.amount}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><div className="co-deal__label">Deal Type</div><div className="co-deal__value">{selected.type}</div></div>
            <div><div className="co-deal__label">Status</div><div><Status s={selected.status} /></div></div>
            <div><div className="co-deal__label">Submitted</div><div className="co-deal__value">{selected.submitted}</div></div>
            <div><div className="co-deal__label">Expires</div><div className="co-deal__value">{selected.expires}</div></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="co-deal__label">Key Terms</div>
            <ul style={{ font: "400 14px/1.8 Inter", color: "var(--stone-700)", paddingLeft: 20, margin: "6px 0 0" }}>
              <li>60-day due diligence period</li>
              <li>2-year seller transition with {selected.type === "Joint Venture" ? "40% equity retained" : "full exit"}</li>
              <li>Existing staff retention clause (6-month minimum)</li>
              <li>Financing contingent on financial verification</li>
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};

Object.assign(window, { OffersView });
