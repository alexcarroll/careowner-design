// Home dashboard

const HomeView = ({ section, onSection, onNav }) => {
  const tint = (t) => ({
    green: { bg: "#D1FAE5", c: "#047857" },
    amber: { bg: "#FEF3C7", c: "#92400E" },
    indigo: { bg: "#E0E7FF", c: "#4338CA" },
    rose: { bg: "#FFE4E6", c: "#9F1239" },
  }[t] || { bg: "var(--stone-100)", c: "var(--stone-700)" });

  return (
    <>
      <SubHeader
        crumbs={["Home"]}
        title="Welcome back, Dr. Thompson"
        actions={<>
          <button className="co-btn-outline" onClick={() => onNav("practice")}><Icon name="eye" /> View Listing</button>
          <button className="co-btn-solid" onClick={() => onNav("offers")}>Review Offers</button>
        </>}
      />
      <div className="co-page" style={{ gridTemplateColumns: "260px 1fr 320px" }}>
        <LeftRail section={section} onSection={onSection} />
        <div>
          <h2 className="co-sec-title" style={{ marginBottom: 16 }}>This Week</h2>
          <div className="co-kpi-grid">
            <div className="co-kpi"><div className="co-kpi__label">Listing Views</div><div className="co-kpi__value">342</div><div className="co-kpi__delta up"><Icon name="arrowUp" size={12} />+18% vs last week</div></div>
            <div className="co-kpi"><div className="co-kpi__label">New Inquiries</div><div className="co-kpi__value">7</div><div className="co-kpi__delta up"><Icon name="arrowUp" size={12} />+3 vs last week</div></div>
            <div className="co-kpi"><div className="co-kpi__label">Active Offers</div><div className="co-kpi__value">{OFFERS.filter(o => o.status !== "declined").length}</div><div className="co-kpi__delta up"><Icon name="arrowUp" size={12} />+1 this week</div></div>
            <div className="co-kpi"><div className="co-kpi__label">Highest Offer</div><div className="co-kpi__value">$920K</div><div className="co-kpi__delta" style={{color:"var(--stone-500)"}}>Midwest Animal Holdings</div></div>
          </div>

          <div className="co-card">
            <div className="co-card__head">
              <h3 className="co-card__title">Recent Activity</h3>
              <button className="co-edit">View all</button>
            </div>
            <div>
              {ACTIVITY.map(a => {
                const t = tint(a.tint);
                return (
                  <div key={a.id} className="co-activity-item">
                    <div className="co-activity-item__icon" style={{ background: t.bg, color: t.c }}>
                      <Icon name={a.icon} />
                    </div>
                    <div>
                      <div className="co-activity-item__text" dangerouslySetInnerHTML={{ __html: a.text }} />
                      <div className="co-activity-item__time">{a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="co-card">
            <div className="co-card__head">
              <h3 className="co-card__title">Listing Performance</h3>
              <span className="co-card__meta">Last 30 days</span>
            </div>
            <Sparkline />
          </div>
        </div>
        <aside className="co-aside">
          <div className="co-card" style={{ padding: 18 }}>
            <div className="co-card__head" style={{ marginBottom: 12 }}>
              <h3 className="co-card__title"><Icon name="calendar" />Next Meeting</h3>
            </div>
            <div style={{ font: "600 14px/1.4 Inter", marginBottom: 6 }}>{MEETINGS[0].title}</div>
            <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginBottom: 12 }}>{MEETINGS[0].day} {MEETINGS[0].month} · {MEETINGS[0].time}</div>
            <button className="co-btn co-btn--primary" style={{ width: "100%" }} onClick={() => onNav("meetings")}>View details</button>
          </div>

          <div className="co-card" style={{ padding: 18 }}>
            <h3 className="co-card__title" style={{ marginBottom: 12 }}><Icon name="checkCircle" />Listing Checklist</h3>
            <ChecklistItem done label="Financials verified" />
            <ChecklistItem done label="Operations data uploaded" />
            <ChecklistItem done label="Preview listing published" />
            <ChecklistItem label="Lease documents uploaded" />
            <ChecklistItem label="Equipment inventory added" />
          </div>

          <div className="co-card" style={{ padding: 18 }}>
            <h3 className="co-card__title" style={{ marginBottom: 12 }}><Icon name="info" />Your Advisor</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="co-owner__avatar violet">ET</div>
              <div>
                <div style={{ font: "600 14px/1.2 Inter" }}>Eliza Tan</div>
                <div style={{ font: "400 12px/1.3 Inter", color: "var(--stone-500)" }}>Sr. Transaction Advisor</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              <button className="co-btn co-btn--ghost" style={{ justifyContent: "center" }}><Icon name="message" size={14} /> Message</button>
              <button className="co-btn co-btn--ghost" style={{ justifyContent: "center" }}><Icon name="calendar" size={14} /> Book</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

const ChecklistItem = ({ done, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", font: "400 14px/1.4 Inter", color: done ? "var(--stone-500)" : "var(--stone-900)", textDecoration: done ? "line-through" : "none" }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: done ? "#00AA55" : "transparent", border: done ? "0" : "1.5px solid var(--stone-200)", display: "grid", placeItems: "center", flexShrink: 0, color: "#fff" }}>
      {done && <Icon name="check" size={12} />}
    </div>
    {label}
  </div>
);

const Sparkline = () => {
  // Pretend area chart with SVG
  const data = [40, 52, 48, 62, 58, 70, 78, 72, 85, 92, 88, 105, 118, 124, 130];
  const max = Math.max(...data);
  const w = 720, h = 160, pad = 10;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((d, i) => [pad + i * step, h - pad - ((d / max) * (h - pad * 2))]);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p.join(",")).join(" ");
  const area = `${line} L${pts[pts.length-1][0]},${h-pad} L${pts[0][0]},${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h, display: "block" }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(35,127,134,0.25)" />
          <stop offset="100%" stopColor="rgba(35,127,134,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g1)" />
      <path d={line} fill="none" stroke="#237F86" strokeWidth="2" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill="#237F86" />)}
    </svg>
  );
};

Object.assign(window, { HomeView });
