// Market Check — Responses / Requests / Market Profile / Preferences + New Request flow
// Lets a seller share an anonymized practice snapshot with curated buyers and collect
// non-binding ballpark valuations. Market Profile tab mirrors Figma node 43:1004.

const MC_TABS = [
  { id: "responses", label: "Responses" },
  { id: "requests", label: "Requests" },
  { id: "market-profile", label: "Market Profile" },
  { id: "preferences", label: "Preferences" },
];

const fmtRange = (lo, hi) => `$${lo.toFixed(1)}M – $${hi.toFixed(1)}M`;
const mcMid = (r) => (r.low + r.high) / 2;

const InterestBadge = ({ i, long }) => {
  const cls = i === "High" ? "co-badge--green" : i === "Medium" ? "co-badge--blue" : "co-badge--gray";
  return <span className={`co-badge ${cls}`}>{long ? i + " interest" : i}</span>;
};

const fmtM = (v) => "$" + v.toFixed(1) + "M";                       // 3 → "$3.0M"
const fmtMid = (v) => "$" + v.toFixed(2).replace(/0$/, "") + "M";   // 3.25 → "$3.25M", 3 → "$3.0M"

const effortBadge = (e) => {
  const cls = e === "High" ? "co-badge--amber" : e === "Medium" ? "co-badge--blue" : "co-badge--green";
  return <span className={`co-badge ${cls}`}>{e} effort</span>;
};

// Small filled up/down triangle for delta pills.
const Tri = ({ up }) => (
  <svg width="9" height="9" viewBox="0 0 8 8" aria-hidden="true">
    <path d={up ? "M4 0 L8 7 L0 7 Z" : "M4 8 L0 1 L8 1 Z"} fill="currentColor" />
  </svg>
);

// Results filter dropdown (label + styled select).
const MCFilter = ({ label, options }) => (
  <div className="mc-filter">
    <span className="mc-filter__label">{label}</span>
    <span className="mc-select">
      <select defaultValue={options[0]}>{options.map(o => <option key={o}>{o}</option>)}</select>
      <Icon name="chevronDown" />
    </span>
  </div>
);

// "Valuation change by period" line chart. SVG fills the card (preserveAspectRatio
// none → strokes use non-scaling-stroke); dots + labels are HTML so they stay crisp.
const MCLineChart = ({ periods, series }) => {
  const N = series.length;
  const padL = 7, padR = 7, padT = 16, padB = 14;
  const min = Math.min(...series), max = Math.max(...series), span = (max - min) || 1;
  const xs = series.map((_, i) => padL + (i * (100 - padL - padR)) / (N - 1));
  const ys = series.map(v => padT + (1 - (v - min) / span) * (100 - padT - padB));
  const pts = xs.map((x, i) => `${x.toFixed(2)},${ys[i].toFixed(2)}`).join(" ");
  return (
    <div>
      <div className="mc-linechart">
        <svg className="mc-linechart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[20, 40, 60, 80].map(y => <line key={y} className="grid" x1="0" y1={y} x2="100" y2={y} vectorEffect="non-scaling-stroke" />)}
          <polyline className="line" points={pts} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        {xs.map((x, i) => <span key={i} className="mc-linechart__dot" style={{ left: x + "%", top: ys[i] + "%" }} />)}
      </div>
      <div className="mc-linechart__xlabels">
        {periods.map((p, i) => <span key={p} style={{ left: xs[i] + "%" }}>{p}</span>)}
      </div>
    </div>
  );
};

// Results by Snapshot Type — "Connected Data" lens (verified vs self-reported).
const MCSnapConnected = () => {
  const s = MC_SNAPSHOT_RESULTS.connected;
  const row = (dot, name, val, delta) => (
    <div className="mc-snap-row">
      <span className={`mc-snap-row__dot mc-snap-row__dot--${dot}`} />
      <span className="mc-snap-row__name">{name}</span>
      {delta && <span className="mc-trend mc-trend--up"><Tri up />{delta}</span>}
      <span className="mc-snap-row__val">{val}</span>
    </div>
  );
  return (
    <>
      <p className="mc-snap-desc">Response results for sharing connected and verified data vs. self-entered data</p>
      <div className="mc-snap-eyebrow">Average Valuation</div>
      {row("v", "Verified", s.valuation.verified, s.valuation.verifiedDelta)}
      {row("s", "Self-Reported", s.valuation.self)}
      <div className="mc-snap-eyebrow">Response Rate</div>
      {row("v", "Verified", s.responseRate.verified, s.responseRate.verifiedDelta)}
      {row("s", "Self-Reported", s.responseRate.self)}
    </>
  );
};

// Results by Snapshot Type — "Amount Shared" lens. Completeness bands × data source.
const MCSnapShared = () => {
  const s = MC_SNAPSHOT_RESULTS.amountShared;
  const group = (label, dot, rows) => (
    <div className="mc-share-group">
      <div className="mc-share-grouplabel"><span className={`mc-snap-row__dot mc-snap-row__dot--${dot}`} />{label}</div>
      <div className="mc-share-head"><span>Completeness</span><span>Est. value</span><span>Resp.</span></div>
      {rows.map(r => (
        <div className="mc-share-row" key={r.band}>
          <span className="mc-share-row__band">{r.band}</span>
          <span className="mc-share-row__val">{r.valuation}</span>
          <span className="mc-share-row__rate">{r.rate}</span>
        </div>
      ))}
    </div>
  );
  return (
    <>
      <p className="mc-snap-desc">How much of your profile you share moves the estimate. Completeness = share of available metrics included, grouped by whether that data is connected/verified or self-reported.</p>
      {group("Connected / Verified", "v", s.verified)}
      {group("Self-Reported", "s", s.self)}
    </>
  );
};

const ProvChip = ({ p }) => {
  if (p === "verified") return <span className="co-prov co-prov--verified"><Icon name="checkCircle" />Verified</span>;
  if (p === "self") return <span className="co-prov co-prov--self"><Icon name="edit" />Self-reported</span>;
  return <span className="co-prov co-prov--none">Not provided</span>;
};

// ─── Top-level view ───────────────────────────────────────────────────────────

const MarketCheckView = ({ tab, sub }) => {
  const [completed, setCompleted] = React.useState(true);
  if (sub === "new") return <NewRequestFlow />;
  const activeTab = tab || "responses";
  return (
    <>
      <SubHeader
        title="Market Check"
        subtitle="Prepare your practice for sale and understand market interest"
        actions={<>
          {activeTab === "market-profile"
            ? <label className="mc-toggle"><span>Completed Profile</span><button className={`co-switch ${completed ? "is-on" : ""}`} onClick={() => setCompleted(!completed)} aria-pressed={completed} /></label>
            : <button className="co-btn-outline"><Icon name="download" /> Download</button>}
          <button className="co-btn-solid" onClick={() => navigateTo("/practice/market-check/new")}><Icon name="plus" /> New Request</button>
        </>}
      />
      <div className="co-body">
        <div>
          <div className="co-tabs" style={{ marginBottom: 16 }}>
            {MC_TABS.map(t => (
              <button key={t.id} className={activeTab === t.id ? "is-active" : ""} onClick={() => navigateTo("/practice/market-check#" + t.id)}>{t.label}</button>
            ))}
          </div>
          {activeTab === "responses" && <MCResponses />}
          {activeTab === "requests" && <MCRequests />}
          {activeTab === "market-profile" && <MCMarketProfile completed={completed} />}
          {activeTab === "preferences" && <MCPreferences />}
        </div>
      </div>
    </>
  );
};

// ─── Responses tab ────────────────────────────────────────────────────────────

const MCResponses = () => {
  const [selected, setSelected] = React.useState(null);
  const [trendView, setTrendView] = React.useState("consensus");
  const [snapView, setSnapView] = React.useState("connected");
  const R = MARKET_CHECK_RESPONSES;
  const C = MC_CONSENSUS;
  const mix = MC_BUYER_MIX;
  const pct = (v) => ((v - mix.axisMin) / (mix.axisMax - mix.axisMin)) * 100;

  const ticks = [];
  for (let t = mix.axisMin; t <= mix.axisMax + 1e-9; t += mix.tickStep) ticks.push(Math.round(t * 10) / 10);

  const maxUplift = Math.max(...MC_RECOMMENDED_ACTIONS.map(a => a.uplift));
  const drivers = MC_IMPACT_DRIVERS;
  const maxPos = Math.max(...drivers.filter(d => d.value > 0).map(d => d.value));
  const maxNeg = Math.max(...drivers.filter(d => d.value < 0).map(d => -d.value));

  return (
    <>
      {/* In-tab header */}
      <div className="mc-resp-head">
        <div>
          <h2 className="mc-resp-head__title">Responses</h2>
          <p className="mc-resp-head__sub">{C.responses} buyers responded to your anonymized market check · model midpoint {C.modelMidpoint}</p>
        </div>
        <div className="mc-resp-head__actions">
          <button className="co-btn-outline"><Icon name="download" /> Export</button>
          <button className="co-btn-outline"><Icon name="upload" /> Share snapshot</button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mc-filterbar">
        <MCFilter label="Period" options={["All", "Q1 2026", "Q4 2025", "Q3 2025"]} />
        <MCFilter label="Buyer type" options={["All types", "Private Equity", "Specialty Group / DSO", "Corporate Group", "Regional Group", "Individual Vet"]} />
        <MCFilter label="Interest" options={["All levels", "High interest", "Medium interest", "Low interest"]} />
        <MCFilter label="Source" options={["All sources", "Verified", "Self-reported"]} />
        <button className="mc-clear">Clear</button>
      </div>

      {/* KPI strip */}
      <div className="mc-kpi-grid">
        <div className="mc-kpi">
          <div className="mc-kpi__label">Consensus Valuation</div>
          <div className="mc-kpi__value">{C.valuation}</div>
          <div className="mc-kpi__foot"><span className="mc-trend mc-trend--up"><Tri up />{C.delta}</span> {C.deltaVs}</div>
        </div>
        <div className="mc-kpi">
          <div className="mc-kpi__label">Indicative Range</div>
          <div className="mc-kpi__value mc-kpi__value--sm">{C.range}</div>
          <div className="mc-kpi__sub">{C.rangeSub}</div>
        </div>
        <div className="mc-kpi">
          <div className="mc-kpi__label">Buyers Responses</div>
          <div className="mc-kpi__value">{C.responses}</div>
          <div className="mc-kpi__foot">{C.sent} sent <span className="mc-trend mc-trend--up">{C.responseRate} response rate</span></div>
        </div>
        <div className="mc-kpi">
          <div className="mc-kpi__label">Growth Opportunities</div>
          <div className="mc-kpi__value">{C.growthUpside}</div>
          <div className="mc-kpi__sub">{C.growthSub}</div>
        </div>
        <div className="mc-kpi">
          <div className="mc-kpi__label">Highest Offer</div>
          <div className="mc-kpi__value">{C.highestOffer}</div>
          <button className="mc-kpi__link" onClick={() => setSelected(R[0])}>{C.highestOfferBuyer} <Icon name="chevronRight" /></button>
        </div>
      </div>

      {/* Trend + Snapshot type */}
      <div className="mc-cols mc-cols--wide-left" style={{ marginTop: 0 }}>
        <div className="co-card" style={{ marginTop: 0 }}>
          <div className="co-card__head">
            <div>
              <h3 className="co-card__title">Valuation change by period</h3>
              <div className="mc-card-sub">Consensus midpoint and full buyer range across market-check periods</div>
            </div>
            <div className="mc-seg">
              <button className={trendView === "consensus" ? "is-active" : ""} onClick={() => setTrendView("consensus")}>Consensus</button>
              <button className={trendView === "highest" ? "is-active" : ""} onClick={() => setTrendView("highest")}>Highest Offer</button>
            </div>
          </div>
          <MCLineChart periods={MC_VALUATION_TREND.periods} series={trendView === "consensus" ? MC_VALUATION_TREND.consensus : MC_VALUATION_TREND.highestOffer} />
        </div>

        <div className="co-card" style={{ marginTop: 0 }}>
          <div className="co-card__head" style={{ marginBottom: 12 }}>
            <div>
              <h3 className="co-card__title">Results by Snapshot Type</h3>
              <div className="mc-card-sub">Average median estimated value</div>
            </div>
          </div>
          <div className="mc-seg mc-seg--full">
            <button className={snapView === "connected" ? "is-active" : ""} onClick={() => setSnapView("connected")}>Connected Data</button>
            <button className={snapView === "shared" ? "is-active" : ""} onClick={() => setSnapView("shared")}>Amount Shared</button>
          </div>
          {snapView === "connected" ? <MCSnapConnected /> : <MCSnapShared />}
        </div>
      </div>

      {/* Buyer mix & valuation ranges */}
      <div className="co-card" style={{ marginTop: 24 }}>
        <div className="co-card__head" style={{ marginBottom: 10 }}>
          <div>
            <h3 className="co-card__title">Buyer mix &amp; valuation ranges</h3>
            <div className="mc-card-sub">Every buyer's indicative range on one scale — the shaded band is where the middle 50% agree</div>
          </div>
        </div>
        <div className="mc-mix">
          <div className="mc-mix__rows">
            <div className="mc-mix__overlay">
              <div className="mc-mix__band" style={{ left: pct(mix.bandLow) + "%", width: (pct(mix.bandHigh) - pct(mix.bandLow)) + "%" }} />
              <div className="mc-mix__median" style={{ left: pct(mix.median) + "%" }}>
                <span className="mc-mix__median-pill">Median {fmtM(mix.median)}</span>
              </div>
            </div>
            {R.map(r => (
              <div className="mc-mix__row" key={r.id}>
                <div>
                  <div className="mc-mix__label"><span className="mc-mix__label-dot" style={{ background: r.color }} />{r.buyer} ({r.count})</div>
                  <div className="mc-mix__sub">{fmtRange(r.low, r.high)}</div>
                </div>
                <div className="mc-mix__lane">
                  <div className="mc-mix__bar" style={{ left: pct(r.low) + "%", width: (pct(r.high) - pct(r.low)) + "%", background: r.color }} />
                  <div className="mc-mix__dot" style={{ left: pct(mcMid(r)) + "%", border: "3px solid " + r.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mc-mix__axis">
            {ticks.map(t => <span key={t} className="mc-mix__tick" style={{ left: pct(t) + "%" }}>{fmtM(t)}</span>)}
          </div>
        </div>
      </div>

      {/* Recommended actions + Impact drivers */}
      <div className="mc-cols mc-cols--even">
        <div className="co-card" style={{ marginTop: 0 }}>
          <div className="co-card__head">
            <div>
              <h3 className="co-card__title">Recommended actions to raise value</h3>
              <div className="mc-card-sub">Aggregated from buyer notes, ranked by estimated uplift</div>
            </div>
            <span className="mc-actions__total">{C.growthUpside} total upside</span>
          </div>
          <div>
            {MC_RECOMMENDED_ACTIONS.map(a => (
              <div className="mc-action" key={a.rank}>
                <div className="mc-action__rank">{a.rank}</div>
                <div>
                  <div className="mc-action__title">{a.title}</div>
                  <div className="mc-action__bar"><span style={{ width: (a.uplift / maxUplift * 100) + "%" }} /></div>
                  <div className="mc-action__flag">{a.flagged} buyers flagged</div>
                </div>
                <div className="mc-action__right">
                  <div className="mc-action__uplift">+${a.uplift}K</div>
                  <div className="mc-action__effort">{effortBadge(a.effort)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="co-card" style={{ marginTop: 0 }}>
          <div className="co-card__head" style={{ marginBottom: 18 }}>
            <div>
              <h3 className="co-card__title">Valuation impact drivers</h3>
              <div className="mc-card-sub">Estimated impact of each value driver, from buyer feedback</div>
            </div>
          </div>
          <div>
            {drivers.map(d => {
              const positive = d.value > 0;
              const w = positive ? (d.value / maxPos) * 60 : (-d.value / maxNeg) * 40;
              return (
                <div className="mc-driver" key={d.label}>
                  <div className="mc-driver__label">{d.label}</div>
                  <div className="mc-driver__plot">
                    <div className="mc-driver__zero" />
                    <div className={"mc-driver__bar " + (positive ? "mc-driver__bar--pos" : "mc-driver__bar--neg")} style={{ width: w + "%" }} />
                  </div>
                  <div className={"mc-driver__val " + (positive ? "mc-driver__val--pos" : "mc-driver__val--neg")}>{positive ? "+" : "−"}${Math.abs(d.value)}K</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buyer responses table */}
      <div className="co-card" style={{ marginTop: 24 }}>
        <div className="co-card__head">
          <h3 className="co-card__title">Buyer responses <span className="co-card__meta" style={{ marginLeft: 4 }}>{R.length} responses</span></h3>
        </div>
        <table className="co-table mc-rtable">
          <thead>
            <tr><th>Buyer</th><th>Data</th><th>Interest</th><th>Indicative Range</th><th>Midpoint</th><th>Submitted</th><th></th></tr>
          </thead>
          <tbody>
            {R.map(r => (
              <tr key={r.id} onClick={() => setSelected(r)} style={{ cursor: "pointer" }}>
                <td className="co-table__name"><span className="mc-rtable__dot" style={{ background: r.color }} />{r.buyer}</td>
                <td>{r.verified ? <ProvChip p="verified" /> : <ProvChip p="self" />}</td>
                <td><InterestBadge i={r.interest} long /></td>
                <td><span className="mc-rtable__range">{fmtRange(r.low, r.high)}</span></td>
                <td>{fmtMid(mcMid(r))}</td>
                <td style={{ color: "var(--stone-500)" }}>{r.submitted}</td>
                <td style={{ textAlign: "right" }}><Icon name="chevronRight" size={16} className="mc-rtable__arrow" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <MCResponseSlideout r={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

const MCResponseSlideout = ({ r, onClose }) => (
  <>
    <div className="co-slideout-overlay" onClick={onClose} />
    <div className="co-slideout">
      <div className="co-slideout__header">
        <div style={{ flex: 1 }}>
          <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Buyer Response</div>
          <h2>{r.buyer}</h2>
        </div>
        <button onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="co-slideout__body">
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <InterestBadge i={r.interest} />
          {r.verified ? <ProvChip p="verified" /> : <ProvChip p="self" />}
        </div>
        <div className="co-card" style={{ marginTop: 0 }}>
          <div className="co-metric__label">Indicative Offer Range</div>
          <div style={{ font: "700 24px/1 Inter", color: "#047857", marginTop: 6 }}>{fmtRange(r.low, r.high)}</div>
          <div style={{ font: "400 14px/1 Inter", color: "var(--stone-500)", marginTop: 6 }}>Midpoint ${mcMid(r).toFixed(2)}M · {r.buyerType}</div>
        </div>
        <h3 className="co-sec-title" style={{ marginTop: 20 }}>Feedback</h3>
        <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)", margin: 0 }}>{r.feedback}</p>
        <h3 className="co-sec-title" style={{ marginTop: 20 }}>Recommendations to Increase Value</h3>
        <div>
          {r.recs.map((rec, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>
              <Icon name="trendUp" size={16} style={{ color: "var(--teal-brand)", flexShrink: 0, marginTop: 2 }} />{rec}
            </div>
          ))}
        </div>
      </div>
      <div className="co-slideout__footer">
        <button className="co-btn co-btn--ghost" onClick={onClose}>Close</button>
        <button className="co-btn co-btn--primary"><Icon name="send" size={14} /> Invite to formal process</button>
      </div>
    </div>
  </>
);

// ─── Requests tab ─────────────────────────────────────────────────────────────

const MCRequests = () => {
  const statusBadge = (s) => ({
    collecting: <span className="co-badge co-badge--blue">Collecting</span>,
    closed: <span className="co-badge co-badge--gray">Closed</span>,
    draft: <span className="co-badge co-badge--amber">Draft</span>,
  }[s]);

  return (
    <>
      <div className="mc-intro">
        <div className="mc-intro__text">
          <h3 className="mc-intro__title">Your Requests</h3>
          <p className="mc-intro__desc">Market checks you've sent. Track responses as they arrive, send reminders, or duplicate a snapshot for a new round.</p>
        </div>
        <button className="co-btn-solid" onClick={() => navigateTo("/practice/market-check/new")}><Icon name="plus" /> New Request</button>
      </div>

      {MARKET_CHECK_REQUESTS.map(req => (
        <div className="co-card" key={req.id}>
          <div className="co-card__head" style={{ marginBottom: 14 }}>
            <h3 className="co-card__title">{req.name} {statusBadge(req.status)}</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {req.status === "draft"
                ? <button className="co-btn co-btn--primary" onClick={() => navigateTo("/practice/market-check/new")}>Continue editing</button>
                : <>
                    <button className="co-btn co-btn--ghost" onClick={() => navigateTo("/practice/market-check#responses")}>View responses</button>
                    {req.status === "collecting" && <button className="co-btn co-btn--ghost"><Icon name="bell" size={14} /> Remind</button>}
                  </>}
            </div>
          </div>
          <div className="co-deals">
            <div><div className="co-deal__label">Snapshot</div><div className="co-deal__value" style={{ fontSize: 14 }}>{req.metrics} metrics</div><div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>{req.verifiedMix}</div></div>
            <div><div className="co-deal__label">Sent To</div><div className="co-deal__value" style={{ fontSize: 14 }}>{req.buyersSent} buyers</div></div>
            <div><div className="co-deal__label">Responses</div><div className="co-deal__value" style={{ fontSize: 14 }}>{req.responded} / {req.buyersSent}</div></div>
            <div><div className="co-deal__label">{req.status === "collecting" ? "Deadline" : req.status === "closed" ? "Closed" : "Status"}</div><div className="co-deal__value" style={{ fontSize: 14 }}>{req.deadline || (req.status === "draft" ? "Not sent" : "—")}</div></div>
          </div>
        </div>
      ))}
    </>
  );
};

// ─── Market Profile tab (mirrors Figma 43:1004) ───────────────────────────────

const MC_RANGES = {
  revenue: ["Under $1M", "$1M – $2M", "$2M – $3M", "$3M – $5M", "$5M+"],
  ebitda: ["Under $250K", "$250K – $500K", "$500K – $750K", "$750K – $1M", "$1M+"],
  margin: ["Under 10%", "10% – 15%", "15% – 20%", "20% – 25%", "25%+"],
  clients: ["Under 500", "500 – 1,000", "1,000 – 2,000", "2,000+"],
  revVisit: ["Under $250", "$250 – $400", "$400 – $550", "$550+"],
  revDoctor: ["Under $400K", "$400K – $600K", "$600K – $800K", "$800K+"],
};

const MCField = ({ label, def, placeholder }) => (
  <div className="co-field"><label>{label}</label><input defaultValue={def} placeholder={placeholder} /></div>
);
const MCRangeField = ({ label, options }) => (
  <div className="co-field"><label>{label}</label>
    <select defaultValue=""><option value="" disabled>Select a range…</option>{options.map(o => <option key={o}>{o}</option>)}</select>
  </div>
);

const MC_EDIT_TITLES = { financials: "Financials", operations: "Operations", doctors: "Doctors", support: "Support Staff", facilities: "Facilities", ownership: "Ownership Structure", details: "Details", services: "Services" };

const MCEditSlideout = ({ kind, completed, onClose }) => {
  const ranges = !completed; // incomplete profiles enter ranges instead of exact values
  const isFinOps = kind === "financials" || kind === "operations";
  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout">
        <div className="co-slideout__header">
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Market Profile</div>
            <h2>Edit {MC_EDIT_TITLES[kind]}</h2>
          </div>
          <button onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="co-slideout__body">
          <div className="mc-callout mc-callout--info">
            <Icon name="info" size={16} />
            <div>Updating info here only changes your <b>Market Profile</b>. It won't affect the rest of your practice profile.</div>
          </div>
          {isFinOps && completed && (
            <div className="mc-callout mc-callout--warn">
              <Icon name="info" size={16} />
              <div>If you edit these figures, they'll be shown to buyers as <b>Self-reported</b> instead of <b>Verified</b> — they'll no longer pull automatically from your connected accounts.</div>
            </div>
          )}

          {kind === "financials" && (ranges ? <>
            <MCRangeField label="High-Level Revenue" options={MC_RANGES.revenue} />
            <MCRangeField label="EBITDA" options={MC_RANGES.ebitda} />
            <MCRangeField label="Adjusted EBITDA Margin" options={MC_RANGES.margin} />
          </> : <>
            <MCField label="TTM Revenue" def="$2.45M" />
            <MCField label="EBITDA" def="$612K" />
            <MCField label="Adjusted EBITDA Margin" def="20%" />
          </>)}

          {kind === "operations" && (ranges ? <>
            <MCRangeField label="Active Clients" options={MC_RANGES.clients} />
            <MCRangeField label="Revenue / Visit" options={MC_RANGES.revVisit} />
            <MCRangeField label="Revenue / Doctor" options={MC_RANGES.revDoctor} />
          </> : <>
            <MCField label="Active Clients" def="1,240" />
            <MCField label="Revenue / Visit" def="$456" />
            <MCField label="Revenue / Doctor" def="$612K" />
          </>)}

          {(kind === "doctors" || kind === "support") && <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <MCField label="Full-time" def={completed ? "3" : ""} placeholder="0" />
              <MCField label="Part-time" def={completed ? "2" : ""} placeholder="0" />
            </div>
            <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", marginTop: 4 }}>Average experience and tenure are calculated automatically from your team bios elsewhere in the platform.</p>
          </>}

          {kind === "facilities" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <MCField label="Exam Rooms" def={completed ? "5" : ""} placeholder="e.g. 5" />
              <MCField label="Building Size" def={completed ? "2,300 sq ft" : ""} placeholder="e.g. 2,300 sq ft" />
              <MCField label="Monthly Rent" def={completed ? "$10,000/mo" : ""} placeholder="e.g. $10,000/mo" />
              <MCField label="Lease Expires" def={completed ? "12/2030" : ""} placeholder="MM/YYYY" />
            </div>
          )}

          {kind === "ownership" && <>
            {PRACTICE.owners.map((o, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: i < PRACTICE.owners.length - 1 ? "1px solid var(--stone-100)" : "none" }}>
                <MCField label="Owner name" def={o.name} />
                <MCField label="Role" def={o.role} />
                <MCField label="Equity" def={o.share} />
                <MCField label="Owner since" def={i === 0 ? "2013" : "2018"} />
              </div>
            ))}
            <button className="co-add-row"><Icon name="plus" size={14} /> Add owner</button>
          </>}

          {kind === "details" && <>
            <div className="co-field"><label>Location type</label><select defaultValue="Suburban"><option>Urban</option><option>Suburban</option><option>Rural</option></select></div>
            <MCField label="Practice type" def={PRACTICE.type} />
            <MCField label="Founded" def={String(PRACTICE.founded)} />
          </>}

          {kind === "services" && <>
            <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", marginTop: 0 }}>Toggle which services are offered.</p>
            {["Wellness Exams", "Laboratory Services", "Vaccinations", "Radiology", "Surgery", "Emergency Care", "Dental Care", "Rehabilitation", "Boarding", "Grooming"].map(s => (
              <label key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", font: "500 14px/1 Inter", borderBottom: "1px solid var(--stone-100)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked={PRACTICE.services.includes(s)} /> {s}
              </label>
            ))}
          </>}
        </div>
        <div className="co-slideout__footer">
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={onClose}>Save changes</button>
        </div>
      </div>
    </>
  );
};

const MCEmptyCard = ({ icon, title, blurb, onAdd }) => (
  <div className="co-card" style={{ marginTop: 0 }}>
    <div className="co-card__head">
      <h3 className="co-card__title"><span className="co-metric__icon" style={{ width: 36, height: 36 }}><Icon name={icon} /></span> {title} <ProvChip p="none" /></h3>
      <button className="co-edit" onClick={onAdd}><Icon name="plus" /> Add</button>
    </div>
    <div className="mc-empty-card">
      <p>{blurb}</p>
      <button className="co-btn co-btn--ghost" onClick={onAdd}><Icon name="plus" size={14} /> Add details</button>
    </div>
  </div>
);

// Full-width staffing card: summary metrics + per-staff-member table (mirrors client's vet-staffing sheet).
const StaffCard = ({ icon, title, anon, data, preview, edit }) => (
  <div className="co-card mc-staff" style={{ marginTop: 0 }}>
    <div className="co-card__head">
      <h3 className="co-card__title"><span className="co-metric__icon" style={{ width: 36, height: 36 }}><Icon name={icon} /></span> {title} <span className="mc-count">{data.count}</span></h3>
      {edit}
    </div>
    <div className="mc-staff__summary">
      <div className="mc-staff__stat"><div className="co-metric__label">Full-time</div><div className="co-metric__value">{data.fullTime}</div></div>
      <div className="mc-staff__stat"><div className="co-metric__label">Part-time</div><div className="co-metric__value">{data.partTime}</div></div>
      <div className="mc-staff__stat"><div className="co-metric__label">Avg Tenure</div><div className="co-metric__value">{data.avgTenure}</div></div>
      <div className="mc-staff__divider" />
      <div className="mc-staff__group">
        <div className="mc-staff__grouplabel">Total Compensation</div>
        <div className="mc-staff__pair">
          <div><div className="mc-staff__sub">TTM YTD</div><div className="mc-staff__num">{data.comp.ttm}</div></div>
          <div><div className="mc-staff__sub">2025</div><div className="mc-staff__num">{data.comp.y2025}</div></div>
        </div>
      </div>
      <div className="mc-staff__divider" />
      <div className="mc-staff__group">
        <div className="mc-staff__grouplabel">Total Production</div>
        <div className="mc-staff__pair">
          <div><div className="mc-staff__sub">TTM YTD</div><div className="mc-staff__num">{data.production.ttm}</div></div>
          <div><div className="mc-staff__sub">2025</div><div className="mc-staff__num">{data.production.y2025}</div></div>
        </div>
      </div>
    </div>
    <div className="mc-staff__tablewrap">
      <table className="co-table mc-staff__table">
        <thead>
          <tr className="mc-staff__grouprow">
            <th colSpan={4}></th>
            <th colSpan={2} className="mc-staff__prodgroup">Production</th>
          </tr>
          <tr>
            <th>Staff Member</th>
            <th>HR/WK</th>
            <th>Tenure</th>
            <th>Compensation</th>
            <th className="mc-staff__prodcol">2025</th>
            <th className="mc-staff__prodcol">TTM YTD</th>
          </tr>
        </thead>
        <tbody>
          {data.members.map((m, i) => (
            <tr key={i}>
              <td className="co-table__name">{preview ? `${anon} ${i + 1}` : m.name}</td>
              <td>{m.hrwk}</td>
              <td>{m.tenure}</td>
              <td>{m.comp}{m.compYtd && <span className="mc-staff__muted"> ({m.compYtd} YTD)</span>}</td>
              <td>{m.prod2025}</td>
              <td>{m.prodTtm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MCMarketProfile = ({ completed }) => {
  const [preview, setPreview] = React.useState(false);
  const [edit, setEdit] = React.useState(null);
  const incomplete = !completed;
  const openEdit = (kind) => setEdit(kind);
  const editBtn = (kind) => !preview && <button className="co-edit" onClick={() => openEdit(kind)}><Icon name="edit" /> Edit</button>;

  return (
    <div className="mc-profile">
      <div className="mc-intro">
        <div className="mc-intro__text">
          <h3 className="mc-intro__title">Your Market Profile</h3>
          <p className="mc-intro__desc">Your view of the non-anonymized version of the metrics. Select "Preview as Buyer" to see the anonymized version.</p>
        </div>
        <button className="co-btn-outline" onClick={() => setPreview(p => !p)}>
          <Icon name="eye" /> {preview ? "Exit Buyer Preview" : "Preview as Buyer"}
        </button>
      </div>

      {/* Seller completion prompt (incomplete profile, own view) */}
      {incomplete && !preview && (
        <div className="mc-callout mc-callout--warn">
          <Icon name="info" size={16} />
          <div>
            <b>Your Market Profile isn't complete.</b> Connect QuickBooks &amp; PIMS and fill out the remaining sections to share verified data — you'll get more accurate responses from buyers.
            <div style={{ marginTop: 10 }}><button className="co-btn co-btn--primary" onClick={() => navigateTo("/practice/financials")}><Icon name="plus" size={14} /> Connect accounts</button></div>
          </div>
        </div>
      )}

      {/* Buyer preview banner */}
      {preview && (
        <div className="mc-preview-card" style={{ marginBottom: 16, padding: "14px 18px" }}>
          <span className="mc-preview-card__tag" style={{ marginBottom: 0 }}>
            <Icon name="eye" size={14} /> Buyer's anonymized view — practice name, exact location and identifying details are hidden.{incomplete && " Figures shown are self-reported by the seller (not verified via connected accounts)."}
          </span>
        </div>
      )}

      <div className="mc-grid">
        {/* main column */}
        <div className="mc-stack">
          {/* Financials */}
          {completed ? (
            <div className="co-card" style={{ marginTop: 0 }}>
              <div className="co-card__head">
                <h3 className="co-card__title"><span className="co-metric__icon co-metric__icon--green" style={{ width: 36, height: 36 }}><Icon name="dollarSign" /></span> Financials <ProvChip p="verified" /></h3>
                {editBtn("financials")}
              </div>
              <div className="co-metrics">
                <Metric noIcon label="TTM Revenue" value="$2.45M" />
                <Metric noIcon label="EBITDA" value="$612K" />
                <Metric noIcon label="Margin" value="20%" />
              </div>
            </div>
          ) : <MCEmptyCard icon="dollarSign" title="Financials" blurb="Add your high-level financials. You can share ranges instead of exact figures." onAdd={() => openEdit("financials")} />}

          {/* Operations */}
          {completed ? (
            <div className="co-card">
              <div className="co-card__head">
                <h3 className="co-card__title"><span className="co-metric__icon co-metric__icon--amber" style={{ width: 36, height: 36 }}><Icon name="activity" /></span> Operations <ProvChip p="verified" /></h3>
                {editBtn("operations")}
              </div>
              <div className="co-metrics">
                <Metric noIcon label="Active Clients" value="1,240" />
                <Metric noIcon label="Revenue / Visit" value="$456" />
                <Metric noIcon label="Revenue / Doctor" value="$612K" />
              </div>
            </div>
          ) : <MCEmptyCard icon="activity" title="Operations" blurb="Add your operational metrics as ranges to give buyers a sense of scale." onAdd={() => openEdit("operations")} />}

          {/* Doctors — full-width staffing card */}
          {completed
            ? <StaffCard icon="stethoscope" title="Doctors" anon="Veterinarian" data={MARKET_PROFILE_STAFF.doctors} preview={preview} edit={editBtn("doctors")} />
            : <MCEmptyCard icon="stethoscope" title="Doctors" blurb="Add how many DVMs you employ (full- and part-time)." onAdd={() => openEdit("doctors")} />}

          {/* Support Staff — full-width staffing card */}
          {completed
            ? <StaffCard icon="users" title="Support Staff" anon="Staff member" data={MARKET_PROFILE_STAFF.support} preview={preview} edit={editBtn("support")} />
            : <MCEmptyCard icon="users" title="Support Staff" blurb="Add how many support staff you employ (full- and part-time)." onAdd={() => openEdit("support")} />}

          {/* Facilities — moved from the sidebar into a horizontal info card */}
          {completed ? (
            <div className="co-card">
              <div className="co-card__head">
                <h3 className="co-card__title"><span className="co-metric__icon" style={{ width: 36, height: 36 }}><Icon name="building" /></span> Facilities <ProvChip p="verified" /></h3>
                {editBtn("facilities")}
              </div>
              <div className="co-deals">
                <div><div className="co-deal__label">Exam Rooms</div><div className="co-deal__value">{PRACTICE.facilities.examRooms}</div></div>
                <div><div className="co-deal__label">Building Size</div><div className="co-deal__value">{PRACTICE.facilities.buildingSize}</div></div>
                <div><div className="co-deal__label">Monthly Rent</div><div className="co-deal__value">{preview ? "Disclosed in diligence" : PRACTICE.facilities.monthlyRent}</div></div>
                <div><div className="co-deal__label">Lease Expires</div><div className="co-deal__value">{PRACTICE.facilities.leaseExpires}</div></div>
              </div>
            </div>
          ) : <MCEmptyCard icon="building" title="Facilities" blurb="Add your space and facilities details (exam rooms, square footage, lease)." onAdd={() => openEdit("facilities")} />}

          {/* Ownership Structure — last card in the main stack */}
          {completed ? (
            <div className="co-card">
              <div className="co-card__head">
                <h3 className="co-card__title"><span className="co-metric__icon" style={{ width: 36, height: 36 }}><Icon name="users" /></span> Ownership Structure</h3>
                {editBtn("ownership")}
              </div>
              <table className="co-table">
                <thead><tr><th>Owner</th><th>Role</th><th>Equity</th><th>Since</th></tr></thead>
                <tbody>
                  {PRACTICE.owners.map((o, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className={`co-owner__avatar ${!preview && o.color === "violet" ? "violet" : ""}`}>{preview ? "O" + (i + 1) : o.initials}</div>
                          <div className="co-table__name">{preview ? "Owner " + (i + 1) : o.name}</div>
                        </div>
                      </td>
                      <td>{o.role}</td>
                      <td><span className="co-badge co-badge--gray">{o.share}</span></td>
                      <td>{i === 0 ? "2013" : "2018"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <MCEmptyCard icon="users" title="Ownership Structure" blurb="Add your ownership breakdown (owners, roles and equity)." onAdd={() => openEdit("ownership")} />}
        </div>

        {/* aside */}
        <aside className="co-aside" style={{ position: "static" }}>
          <div className="co-preview">
            <h4 className="co-preview__title">About Your Market Profile</h4>
            <p className="co-preview__desc" style={{ margin: 0 }}>This page contains all the details and metrics that are available to share with buyers in the market when you request a Market Check. When you send a new request for a Market Check, you will be able to select which fields you wish to include or hide.</p>
          </div>

          <div className="co-card" style={{ padding: "18px 20px" }}>
            <div className="co-card__head" style={{ marginBottom: 12 }}>
              <h3 className="co-card__title"><Icon name="list" />Details {incomplete && <ProvChip p="self" />}</h3>
              {editBtn("details")}
            </div>
            <div className="co-info__row"><span className="co-info__k">Location</span><span className="co-info__v">Suburban{!preview && <span style={{ color: "var(--stone-500)", fontWeight: 400 }}> · Bannockburn, IL</span>}</span></div>
            <div className="co-info__row"><span className="co-info__k">Type</span><span className="co-info__v">{PRACTICE.type}</span></div>
            <div className="co-info__row"><span className="co-info__k">Founded</span><span className="co-info__v">{preview ? "~10 yrs ago" : PRACTICE.founded}</span></div>
            <div className="co-info__row"><span className="co-info__k">Rating</span><span className="co-info__v"><Icon name="star" size={12} style={{ color: "#F59E0B", fill: "#F59E0B", marginRight: 4, marginBottom: -1 }} />{PRACTICE.rating} ({PRACTICE.reviewCount})</span></div>
            <div style={{ marginTop: 12 }}>
              <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--stone-500)", marginBottom: 8 }}>Certifications / Licenses</div>
              <span className="co-badge co-badge--green">{PRACTICE.cert[0]}</span>
            </div>
          </div>

          <div className="co-card" style={{ padding: "18px 20px" }}>
            <div className="co-card__head" style={{ marginBottom: 12 }}>
              <h3 className="co-card__title"><Icon name="list" />Services</h3>
              {editBtn("services")}
            </div>
            <div className="co-chip-grid">
              {PRACTICE.services.map(s => <div key={s}>{s}</div>)}
            </div>
          </div>
        </aside>
      </div>

      {edit && <MCEditSlideout kind={edit} completed={completed} onClose={() => setEdit(null)} />}
    </div>
  );
};

// ─── Preferences tab ──────────────────────────────────────────────────────────

const MCPreferences = () => {
  const buyerTypes = ["Corporate Group", "Private Equity", "Individual Vet", "Regional Group"];
  const asks = [
    { id: "range", label: "Indicative valuation range", locked: true },
    { id: "interest", label: "Interest level" },
    { id: "feedback", label: "Written feedback" },
    { id: "recs", label: "Recommendations to increase value" },
    { id: "followup", label: "Willingness to follow up" },
  ];
  const [sel, setSel] = React.useState({ "Corporate Group": true, "Private Equity": true, "Individual Vet": true, "Regional Group": false });
  const [askSel, setAskSel] = React.useState({ range: true, interest: true, feedback: true, recs: true, followup: false });

  return (
    <>
      <div className="mc-intro">
        <div className="mc-intro__text">
          <h3 className="mc-intro__title">Market Check Preferences</h3>
          <p className="mc-intro__desc">Defaults applied to every new request, and the buyers you're willing to share an anonymized snapshot with.</p>
        </div>
      </div>

      <div className="co-card">
        <div className="co-card__head"><h3 className="co-card__title">Request Defaults</h3></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="co-field"><label>Default response deadline</label><select defaultValue="14 days"><option>7 days</option><option>14 days</option><option>30 days</option></select></div>
          <div className="co-field"><label>Anonymization granularity</label><select defaultValue="Region + density"><option>Metro area</option><option>Region + density</option><option>State only</option></select></div>
        </div>
        <div style={{ marginTop: 4 }}>
          <div className="co-deal__label" style={{ marginBottom: 10 }}>What to ask buyers for</div>
          {asks.map(a => (
            <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", font: "500 14px/1 Inter", borderBottom: "1px solid var(--stone-100)", cursor: a.locked ? "default" : "pointer" }}>
              <input type="checkbox" checked={askSel[a.id]} disabled={a.locked} onChange={e => setAskSel({ ...askSel, [a.id]: e.target.checked })} />
              {a.label}{a.locked && <span className="co-prov co-prov--none" style={{ marginLeft: 6 }}>Always included</span>}
            </label>
          ))}
        </div>
      </div>

      <div className="co-card">
        <div className="co-card__head"><h3 className="co-card__title">Buyer Targeting</h3></div>
        <div className="co-deal__label" style={{ marginBottom: 10 }}>Preferred buyer types</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {buyerTypes.map(t => (
            <button key={t} className={`co-chip ${sel[t] ? "is-active" : ""}`} onClick={() => setSel({ ...sel, [t]: !sel[t] })}>
              {sel[t] && <Icon name="check" size={12} />}{t}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="co-field"><label>Geography appetite</label><select defaultValue="National"><option>Local / Metro</option><option>Regional (Midwest)</option><option>National</option></select></div>
          <div className="co-field"><label>Deal-size appetite</label><select defaultValue="$2M – $4M"><option>Under $2M</option><option>$2M – $4M</option><option>$4M+</option></select></div>
          <div className="co-field" style={{ gridColumn: "1 / -1" }}><label>Exclusions</label><input placeholder="e.g. direct competitors within 25 miles, specific buyers…" defaultValue="Exclude direct competitors within 25 miles" /></div>
        </div>
      </div>

      <div className="co-card">
        <div className="co-card__head"><h3 className="co-card__title">Confidentiality & Notifications</h3></div>
        <div className="co-benefit-row">
          <div className="co-benefit-row__info"><div className="co-benefit-row__name">Show data provenance to buyers</div><div className="co-benefit-row__detail">Buyers see whether each figure is verified or self-reported.</div></div>
          <Switch on={true} onChange={() => {}} label="" />
        </div>
        <div className="co-benefit-row">
          <div className="co-benefit-row__info"><div className="co-benefit-row__name">Re-identification protection</div><div className="co-benefit-row__detail">Warn me when a snapshot could identify my practice.</div></div>
          <Switch on={true} onChange={() => {}} label="" />
        </div>
        <div className="co-benefit-row">
          <div className="co-benefit-row__info"><div className="co-benefit-row__name">Email me when a response arrives</div><div className="co-benefit-row__detail">Get notified as buyers submit valuations.</div></div>
          <Switch on={true} onChange={() => {}} label="" />
        </div>
      </div>
    </>
  );
};

// ─── New Request flow (/practice/market-check/new) ────────────────────────────

// What buyers see for a given metric once anonymized. Most figures pass through
// exactly; identifying fields (geography, pricing, size) are generalized.
const anonValue = (m, regionLabel) => {
  if (m.id === "geo") return regionLabel + " · ~$95K median HH income";
  if (m.id === "pricing") return "~12% above regional median";
  if (m.id === "facilities") return "~2,300 sq ft · 5 exam rooms";
  return m.value;
};

const MC_STEPS = ["Metrics & preview", "Options", "Review & send"];

const NewRequestFlow = () => {
  const allItems = MARKET_METRICS.flatMap(g => g.items);
  const [step, setStep] = React.useState(1);
  const [metricSel, setMetricSel] = React.useState(() => Object.fromEntries(allItems.map(m => [m.id, true])));
  const [snapshotMode, setSnapshotMode] = React.useState("current");
  const [buyerMode, setBuyerMode] = React.useState("auto");
  const [buyerSel, setBuyerSel] = React.useState([1, 3, 5]);
  const [granularity, setGranularity] = React.useState("Region + density");
  const [deadline, setDeadline] = React.useState("14 days");
  const [coverNote, setCoverNote] = React.useState("");
  const [showProv, setShowProv] = React.useState(true);

  const selectedMetrics = allItems.filter(m => metricSel[m.id]);
  const selfCount = selectedMetrics.filter(m => m.provenance === "self").length;
  const verifiedCount = selectedMetrics.filter(m => m.provenance === "verified").length;
  const strength = Math.round((selectedMetrics.length / allItems.length) * 100);
  const regionLabel = granularity === "State only" ? "Illinois" : granularity === "Metro area" ? "Chicago Metro" : "Suburban Midwest";

  const toggleMetric = (id) => setMetricSel(s => ({ ...s, [id]: !s[id] }));
  const toggleBuyer = (id) => setBuyerSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => step === 1 ? navigateTo("/practice/market-check#requests") : setStep(s => s - 1);
  const send = () => navigateTo("/practice/market-check#requests");

  return (
    <>
      <SubHeader
        title="New Market Check Request"
        subtitle="Build an anonymized snapshot and send it to curated buyers for an indicative valuation."
        actions={<button className="co-btn-outline" onClick={() => navigateTo("/practice/market-check#requests")}><Icon name="x" /> Cancel</button>}
      />
      <div className="co-body">
        <div>
          <div className="mc-steps">
            {MC_STEPS.map((label, i) => {
              const n = i + 1;
              const cls = n === step ? "is-active" : n < step ? "is-done" : "";
              return (
                <React.Fragment key={label}>
                  <div className={`mc-step ${cls}`}>
                    <div className="mc-step__num">{n < step ? <Icon name="check" /> : n}</div>
                    <div className="mc-step__label">{label}</div>
                  </div>
                  {n < MC_STEPS.length && <div className="mc-step__line" />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="co-card">
            {step === 1 && (
              <>
                <div className="co-card__head"><h3 className="co-card__title">Metrics &amp; buyer preview</h3><span className="co-card__meta">{selectedMetrics.length} of {allItems.length} shared</span></div>

                <div className="mc-group-title" style={{ marginTop: 0 }}>How to share</div>
                <div className="mc-radio-cards" style={{ marginBottom: 8 }}>
                  <button type="button" className={`mc-radio-card ${snapshotMode === "current" ? "is-selected" : ""}`} onClick={() => setSnapshotMode("current")}>
                    <span className="mc-radio-card__radio" />
                    <span><span className="mc-radio-card__title">Send current snapshot</span><span className="mc-radio-card__desc">A point-in-time snapshot of your live data, exactly as it is today.</span></span>
                  </button>
                  <button type="button" className={`mc-radio-card ${snapshotMode === "feed" ? "is-selected" : ""}`} onClick={() => setSnapshotMode("feed")}>
                    <span className="mc-radio-card__radio" />
                    <span><span className="mc-radio-card__title">Share continuous data feed</span><span className="mc-radio-card__desc">Automatically updates the connected data in real time for as long as the buyer has access.</span></span>
                  </button>
                </div>

                <div style={{ margin: "20px 0 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", font: "500 14px/1 Inter", marginBottom: 6 }}><span>Snapshot strength</span><span>{strength}%</span></div>
                  <div className="mc-meter"><span style={{ width: strength + "%" }} /></div>
                  <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", marginTop: 8 }}>{verifiedCount} verified · {selfCount} self-reported. Toggle a metric to include it — <b style={{ fontWeight: 500, color: "var(--stone-700)" }}>Buyers see</b> shows its anonymized form. Practice name and exact address are always hidden.</div>
                </div>
                {MARKET_METRICS.map(g => (
                  <div key={g.group}>
                    <div className="mc-group-title">{g.group}</div>
                    {g.items.map(m => {
                      const on = !!metricSel[m.id];
                      return (
                        <div className="mc-mrow" key={m.id}>
                          <div className="mc-mrow__main" style={{ opacity: on ? 1 : 0.45 }}>
                            <div className="mc-mrow__name">{m.label}</div>
                            <div className="mc-mrow__xform">
                              <span className="mc-mrow__raw">{m.value}</span>
                              <Icon name="chevronRight" size={13} className="mc-mrow__arrow" />
                              <span className="mc-mrow__anon"><Icon name="eye" size={13} /> {anonValue(m, regionLabel)}</span>
                            </div>
                          </div>
                          <ProvChip p={m.provenance} />
                          <Switch on={on} onChange={() => toggleMetric(m.id)} label="" />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            )}

            {step === 2 && (
              <>
                <div className="co-card__head"><h3 className="co-card__title">Options</h3></div>

                <div className="mc-group-title" style={{ marginTop: 0 }}>Who to send to</div>
                <div className="mc-radio-cards" style={{ marginBottom: 14 }}>
                  <button type="button" className={`mc-radio-card ${buyerMode === "auto" ? "is-selected" : ""}`} onClick={() => setBuyerMode("auto")}>
                    <span className="mc-radio-card__radio" />
                    <span><span className="mc-radio-card__title">Let CareOwner choose buyers</span><span className="mc-radio-card__desc">We'll send your request to a curated group of buyers we think are the best fit.</span></span>
                  </button>
                  <button type="button" className={`mc-radio-card ${buyerMode === "manual" ? "is-selected" : ""}`} onClick={() => setBuyerMode("manual")}>
                    <span className="mc-radio-card__radio" />
                    <span><span className="mc-radio-card__title">Choose buyers</span><span className="mc-radio-card__desc">Pick from the current list of buyer types yourself.</span></span>
                  </button>
                </div>
                {buyerMode === "manual" && (
                  <div className="mc-buyer-grid" style={{ marginBottom: 20 }}>
                    {BUYERS.map(b => {
                      const on = buyerSel.includes(b.id);
                      return (
                        <button key={b.id} className={`mc-buyer ${on ? "is-selected" : ""}`} onClick={() => toggleBuyer(b.id)}>
                          <span className="mc-buyer__check"><Icon name="check" size={12} /></span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span className="mc-buyer__name">{b.type}</span>
                            <span className="mc-buyer__meta">{b.location.split(",").pop().trim()} focus · {b.funds} · {b.interest} interest</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mc-group-title">Request options</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="co-field"><label>Location granularity</label>
                    <select value={granularity} onChange={e => setGranularity(e.target.value)}><option>Metro area</option><option>Region + density</option><option>State only</option></select>
                  </div>
                  <div className="co-field"><label>Response deadline</label><select value={deadline} onChange={e => setDeadline(e.target.value)}><option>7 days</option><option>14 days</option><option>30 days</option></select></div>
                </div>
                {granularity === "Metro area" && (
                  <div className="co-benefits-bar" style={{ background: "#FEF3C7", borderColor: "#FCD34D" }}>
                    <div className="co-benefits-bar__check" style={{ background: "#B45309" }}><Icon name="info" /></div>
                    <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>Sharing <b>metro-level geography</b> with a niche service mix could make your practice identifiable in a small market. Consider "Region + density".</div>
                  </div>
                )}
                <div className="co-field" style={{ marginTop: 4 }}><label>Cover note to buyers (optional, anonymized)</label><textarea value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Add context for buyers — avoid identifying details." /></div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, font: "500 14px/1 Inter", cursor: "pointer" }}>
                  <input type="checkbox" checked={showProv} onChange={e => setShowProv(e.target.checked)} /> Show data provenance (verified vs self-reported) to buyers
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <div className="co-card__head"><h3 className="co-card__title">Review &amp; send</h3></div>
                <div className="co-deals" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  <div><div className="co-deal__label">Metrics</div><div className="co-deal__value">{selectedMetrics.length} shared</div><div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>{verifiedCount} verified · {selfCount} self-reported</div></div>
                  <div><div className="co-deal__label">Buyers</div><div className="co-deal__value">{buyerMode === "auto" ? "CareOwner curated" : buyerSel.length + " selected"}</div></div>
                  <div><div className="co-deal__label">Deadline</div><div className="co-deal__value">{deadline}</div></div>
                </div>
                <div style={{ borderTop: "1px solid var(--stone-100)", margin: "16px 0" }} />
                <div className="co-deals" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
                  <div><div className="co-deal__label">Snapshot</div><div className="co-deal__value">{snapshotMode === "current" ? "Current snapshot" : "Continuous data feed"}</div></div>
                  <div><div className="co-deal__label">Location granularity</div><div className="co-deal__value">{granularity}</div></div>
                </div>
                <div style={{ borderTop: "1px solid var(--stone-100)", margin: "16px 0" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>
                  <Icon name="lock" size={16} style={{ color: "var(--teal-brand)", flexShrink: 0, marginTop: 2 }} /> Your identity stays confidential. Buyers see only the anonymized snapshot.
                </div>
                {selfCount > 0 && (
                  <div className="co-benefits-bar" style={{ background: "#FEF3C7", borderColor: "#FCD34D", marginTop: 16, marginBottom: 0 }}>
                    <div className="co-benefits-bar__check" style={{ background: "#B45309" }}><Icon name="info" /></div>
                    <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>This snapshot includes <b>{selfCount} self-reported {selfCount === 1 ? "metric" : "metrics"}</b>. Connect QuickBooks &amp; PIMS for verified data and stronger responses. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo("/practice/financials"); }} style={{ color: "var(--teal-brand)", fontWeight: 500 }}>Connect accounts</a></div>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button className="co-btn co-btn--ghost" onClick={back}>{step === 1 ? "Cancel" : "Back"}</button>
            {step < 3
              ? <button className="co-btn co-btn--primary" onClick={next} disabled={step === 2 && buyerMode === "manual" && buyerSel.length === 0}>Continue <Icon name="chevronRight" size={14} /></button>
              : <button className="co-btn co-btn--primary" onClick={send}><Icon name="send" size={14} /> {buyerMode === "auto" ? "Send to curated buyers" : `Send to ${buyerSel.length} buyers`}</button>}
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { MarketCheckView });
