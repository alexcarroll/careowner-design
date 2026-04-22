// My Practice view — 4 tabs: Overview, Practice Details, Ownership, Deal Preferences

const PracticeView = ({ pub, onTogglePub, onEdit, section, onSection }) => {
  const [tab, setTab] = React.useState("overview");
  const isTeam = section === "team";

  return (
    <>
      <SubHeader
        crumbs={["Marketplace", "AnimalCare"]}
        title={isTeam ? "Team" : "Practice Overview"}
        actions={<>
          <button className="co-btn-outline" onClick={() => {
            const blob = new Blob([["field,value", "name,AnimalCare", "revenue,$2.45M", "ebitda,$612K"].join("\n")], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "animalcare.csv";
            a.click();
          }}>
            <Icon name="download" /> Export CSV
          </button>
          <button className="co-btn-solid" onClick={() => onEdit({ title: "Manage Practice", kind: "manage" })}>Manage</button>
        </>}
      />
      <div className="co-page">
        <LeftRail section={section} onSection={onSection} />
        {isTeam ? (
          <div style={{ gridColumn: "2 / -1" }}>
            <TeamSection />
          </div>
        ) : (
          <>
            <div>
              <div className="co-tabs" style={{ marginBottom: 16 }}>
                {[
                  { id: "overview", label: "Overview" },
                  { id: "details", label: "Practice Details" },
                  { id: "ownership", label: "Ownership" },
                  { id: "deal", label: "Deal Preferences" },
                ].map(t => (
                  <button key={t.id} className={tab === t.id ? "is-active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
              </div>

              {tab === "overview" && <OverviewTab pub={pub} onTogglePub={onTogglePub} onEdit={onEdit} />}
              {tab === "details" && <DetailsTab onEdit={onEdit} />}
              {tab === "ownership" && <OwnershipTab onEdit={onEdit} />}
              {tab === "deal" && <DealTab onEdit={onEdit} />}
            </div>
            <RightRail />
          </>
        )}
      </div>
    </>
  );
};

const OverviewTab = ({ pub, onTogglePub, onEdit }) => (
  <>
    <div className="co-card">
      <div className="co-identity">
        <div className="co-identity__logo" style={{ backgroundImage: "url(assets/practice-hero.jpg)" }} />
        <div>
          <h2 className="co-identity__name">
            {PRACTICE.name}
            <button className="co-edit" onClick={() => onEdit({ title: "Edit Practice Name", kind: "name" })}><Icon name="edit" /></button>
          </h2>
          <div className="co-identity__loc"><Icon name="location" size={12} style={{ marginRight: 4, marginBottom: -1 }} />{PRACTICE.location}</div>
        </div>
        <Switch on={pub} onChange={onTogglePub} label={pub ? "Public" : "Private"} />
      </div>

      <div className="co-card__head" style={{ marginTop: 4 }}>
        <h3 className="co-card__title">Financials <span className="co-card__meta"><span className="dot">●</span> Verified {PRACTICE.financials.verifiedDate}</span></h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Financials", kind: "financials" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-metrics">
        <Metric icon="dollarSign" tint="" label="TTM Revenue" value={PRACTICE.financials.ttmRevenue} />
        <Metric icon="trendUp" tint="green" label="EBITDA" value={PRACTICE.financials.ebitda} />
        <Metric icon="dollarSign" tint="amber" label="Bank Balance" value={PRACTICE.financials.bankBalance} />
      </div>
    </div>

    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Operations <span className="co-card__meta"><span className="dot">●</span> Verified {PRACTICE.operations.verifiedDate}</span></h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Operations", kind: "operations" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-metrics">
        <Metric icon="users" tint="" label="Active Clients" value={PRACTICE.operations.activeClients} />
        <Metric icon="dollarSign" tint="amber" label="Revenue / Visit" value={PRACTICE.operations.revenuePerVisit} />
        <Metric icon="activity" tint="indigo" label="Revenue / Doctor" value={PRACTICE.operations.revenuePerDoctor} />
      </div>
    </div>

    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Team</h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Team", kind: "team" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-team">
        <div className="co-team__cell">
          <div className="co-metric__icon"><Icon name="stethoscope" /></div>
          <div>
            <div className="co-metric__label">Doctors</div>
            <div className="co-metric__value">{PRACTICE.team.doctors} <small>{PRACTICE.team.partTime} Part-Time</small></div>
          </div>
        </div>
        <div className="co-team__cell">
          <div>
            <div className="co-metric__label">Avg experience</div>
            <div className="co-metric__value">{PRACTICE.team.avgExperience}</div>
          </div>
        </div>
        <div className="co-team__cell">
          <div className="co-metric__icon"><Icon name="users" /></div>
          <div>
            <div className="co-metric__label">Support staff</div>
            <div className="co-metric__value">{PRACTICE.team.supportStaff}</div>
          </div>
        </div>
        <div className="co-team__cell">
          <div>
            <div className="co-metric__label">Avg tenure</div>
            <div className="co-metric__value">{PRACTICE.team.avgTenure}</div>
          </div>
        </div>
      </div>
    </div>

    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Deal Preferences</h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Deal Preferences", kind: "deal" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-deals">
        <div><div className="co-deal__label">Sale Timeline</div><div className="co-deal__value">{PRACTICE.deal.timeline}</div></div>
        <div><div className="co-deal__label">Deal Type</div><div className="co-deal__value">{PRACTICE.deal.type}</div></div>
        <div><div className="co-deal__label">Stay Post-Deal</div><div className="co-deal__value">{PRACTICE.deal.stay}</div></div>
        <div><div className="co-deal__label">Buyer Type</div><div className="co-deal__value">{PRACTICE.deal.buyer}</div></div>
      </div>
    </div>

    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Ownership <span className="co-card__meta">{PRACTICE.owners.length} Owners</span></h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Ownership", kind: "ownership" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-owners">
        <div className="co-owner-bio">
          <h4><Icon name="user" /> From the Owner</h4>
          <p>{PRACTICE.bio}</p>
        </div>
        <div className="co-owner-list">
          {PRACTICE.owners.map((o, i) => (
            <div key={i} className="co-owner">
              <div className={`co-owner__avatar ${o.color === "violet" ? "violet" : ""}`}>{o.initials}</div>
              <div className="co-owner__text">
                <div className="co-owner__name">{o.name}</div>
                <div className="co-owner__role">{o.role} · {o.share}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const Metric = ({ icon, tint, label, value }) => (
  <div className="co-metric">
    <div className={`co-metric__icon ${tint ? "co-metric__icon--" + tint : ""}`}><Icon name={icon} /></div>
    <div>
      <div className="co-metric__label">{label}</div>
      <div className="co-metric__value">{value}</div>
    </div>
  </div>
);

const DetailsTab = ({ onEdit }) => (
  <>
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">General Information</h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit General Info", kind: "general" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-deals" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div><div className="co-deal__label">Practice Name</div><div className="co-deal__value">AnimalCare</div></div>
        <div><div className="co-deal__label">DBA</div><div className="co-deal__value">AnimalCare Veterinary Clinic</div></div>
        <div><div className="co-deal__label">Entity Type</div><div className="co-deal__value">S-Corporation</div></div>
        <div><div className="co-deal__label">State of Incorporation</div><div className="co-deal__value">Illinois</div></div>
        <div><div className="co-deal__label">Founded</div><div className="co-deal__value">2013</div></div>
        <div><div className="co-deal__label">Primary Service</div><div className="co-deal__value">Small Animal Medicine</div></div>
        <div><div className="co-deal__label">Website</div><div className="co-deal__value">animalcareweb.net</div></div>
        <div><div className="co-deal__label">Phone</div><div className="co-deal__value">(815) 555-0142</div></div>
      </div>
    </div>
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Facilities</h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Facilities", kind: "facilities" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-deals">
        <div><div className="co-deal__label">Exam Rooms</div><div className="co-deal__value">{PRACTICE.facilities.examRooms}</div></div>
        <div><div className="co-deal__label">Building Size</div><div className="co-deal__value">{PRACTICE.facilities.buildingSize}</div></div>
        <div><div className="co-deal__label">Monthly Rent</div><div className="co-deal__value">{PRACTICE.facilities.monthlyRent}</div></div>
        <div><div className="co-deal__label">Lease Expires</div><div className="co-deal__value">{PRACTICE.facilities.leaseExpires}</div></div>
      </div>
    </div>
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Services</h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Edit Services", kind: "services" })}><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-chip-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {PRACTICE.services.map(s => <div key={s} style={{ padding: "8px 0" }}>{s}</div>)}
      </div>
    </div>
  </>
);

const OwnershipTab = ({ onEdit }) => (
  <>
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Ownership Structure</h3>
        <button className="co-edit" onClick={() => onEdit({ title: "Add Owner", kind: "owner" })}><Icon name="plus" /> Add Owner</button>
      </div>
      <table className="co-table">
        <thead>
          <tr><th>Owner</th><th>Role</th><th>Equity</th><th>Since</th><th style={{ width: 80 }}></th></tr>
        </thead>
        <tbody>
          {PRACTICE.owners.map((o, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className={`co-owner__avatar ${o.color === "violet" ? "violet" : ""}`}>{o.initials}</div>
                  <div className="co-table__name">{o.name}</div>
                </div>
              </td>
              <td>{o.role}</td>
              <td><span className="co-badge co-badge--gray">{o.share}</span></td>
              <td>{i === 0 ? "2013" : "2018"}</td>
              <td><button className="co-edit" onClick={() => onEdit({ title: `Edit ${o.name}`, kind: "owner" })}><Icon name="edit" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="co-card">
      <h3 className="co-card__title" style={{ marginBottom: 12 }}>About the Owner</h3>
      <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)", margin: 0 }}>{PRACTICE.bio}</p>
    </div>
  </>
);

const DealTab = ({ onEdit }) => {
  const [form, setForm] = React.useState({
    timeline: PRACTICE.deal.timeline,
    type: PRACTICE.deal.type,
    stay: PRACTICE.deal.stay,
    buyer: PRACTICE.deal.buyer,
    askingMin: "800",
    askingMax: "900",
    earnOut: true,
    anonymous: false,
  });
  return (
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Deal Preferences</h3>
        <span className="co-card__meta">Changes save automatically</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="co-field">
          <label>Sale Timeline</label>
          <select value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})}>
            <option>Immediate</option><option>3–6 months</option><option>6–9 months</option><option>9–12 months</option><option>1–2 years</option>
          </select>
        </div>
        <div className="co-field">
          <label>Deal Type</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option>Asset Purchase</option><option>Stock Purchase</option><option>Joint Venture</option><option>Partnership</option>
          </select>
        </div>
        <div className="co-field">
          <label>Stay Post-Deal</label>
          <select value={form.stay} onChange={e => setForm({...form, stay: e.target.value})}>
            <option>Exit at closing</option><option>6 months</option><option>1 year</option><option>2–3 years</option><option>5+ years</option>
          </select>
        </div>
        <div className="co-field">
          <label>Preferred Buyer Type</label>
          <select value={form.buyer} onChange={e => setForm({...form, buyer: e.target.value})}>
            <option>Individual Vet</option><option>Regional Group</option><option>Corporate Group</option><option>PE Firm</option><option>Any</option>
          </select>
        </div>
        <div className="co-field">
          <label>Asking Price — Min ($K)</label>
          <input value={form.askingMin} onChange={e => setForm({...form, askingMin: e.target.value})} />
        </div>
        <div className="co-field">
          <label>Asking Price — Max ($K)</label>
          <input value={form.askingMax} onChange={e => setForm({...form, askingMax: e.target.value})} />
        </div>
        <div className="co-field" style={{ gridColumn: "1 / -1" }}>
          <label>Additional Notes for Buyers</label>
          <textarea placeholder="Any specific considerations about the sale…" defaultValue="Looking for a partner who will preserve the long-tenured support team and continue community involvement (vaccine clinics, school visits). Open to earn-out structures." />
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 20, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, font: "500 14px/1 Inter", cursor: "pointer" }}>
            <input type="checkbox" checked={form.earnOut} onChange={e => setForm({...form, earnOut: e.target.checked})} />
            Open to earn-out structures
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, font: "500 14px/1 Inter", cursor: "pointer" }}>
            <input type="checkbox" checked={form.anonymous} onChange={e => setForm({...form, anonymous: e.target.checked})} />
            Hide practice name from public listing
          </label>
        </div>
      </div>
    </div>
  );
};

const RightRail = () => (
  <aside className="co-aside">
    <div className="co-preview">
      <div className="co-card__head" style={{ margin: 0, marginBottom: 12 }}>
        <h3 className="co-card__title"><Icon name="eye" />Preview Listing</h3>
        <button className="co-edit"><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-preview__img" style={{ backgroundImage: "url(assets/practice-hero.jpg)" }}>
        <span className="co-preview__tag">Ready to Sell</span>
      </div>
      <h4 className="co-preview__title">{PRACTICE.listingTitle}</h4>
      <p className="co-preview__desc">{PRACTICE.teaser}</p>
      <div className="co-preview__facts">
        <span className="co-preview__fact"><Icon name="location" size={12} />IL</span>
        <span className="co-preview__fact"><Icon name="stethoscope" size={12} />{PRACTICE.doctors} DVMs</span>
        <span className="co-preview__fact"><Icon name="dollarSign" size={12} />{PRACTICE.askingPrice}</span>
      </div>
    </div>

    <div className="co-card" style={{ padding: "18px 20px" }}>
      <div className="co-card__head" style={{ marginBottom: 12 }}>
        <h3 className="co-card__title"><Icon name="list" />Details</h3>
        <button className="co-edit"><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-info__row"><span className="co-info__k">Type</span><span className="co-info__v">{PRACTICE.type}</span></div>
      <div className="co-info__row"><span className="co-info__k">Founded</span><span className="co-info__v">{PRACTICE.founded}</span></div>
      <div className="co-info__row"><span className="co-info__k">Website</span><span className="co-info__v"><a>{PRACTICE.website}</a></span></div>
      <div className="co-info__row"><span className="co-info__k">Rating</span><span className="co-info__v"><Icon name="star" size={12} style={{color:"#F59E0B", fill:"#F59E0B", marginRight:4, marginBottom:-1}} />{PRACTICE.rating} ({PRACTICE.reviewCount})</span></div>
      <div style={{ marginTop: 12 }}>
        <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--stone-500)", marginBottom: 8 }}>Certifications / Licenses</div>
        <span className="co-badge co-badge--green">{PRACTICE.cert[0]}</span>
      </div>
    </div>

    <div className="co-card" style={{ padding: "18px 20px" }}>
      <div className="co-card__head" style={{ marginBottom: 12 }}>
        <h3 className="co-card__title"><Icon name="list" />Services</h3>
        <button className="co-edit"><Icon name="edit" /> Edit</button>
      </div>
      <div className="co-chip-grid">
        {PRACTICE.services.map(s => <div key={s}>{s}</div>)}
      </div>
    </div>

    <div className="co-card" style={{ padding: "18px 20px" }}>
      <div className="co-card__head" style={{ marginBottom: 12 }}>
        <h3 className="co-card__title"><Icon name="building" />Facilities</h3>
        <button className="co-edit"><Icon name="edit" /> Edit</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <div><div className="co-deal__label">Exam Rooms</div><div className="co-deal__value" style={{fontSize:14}}>{PRACTICE.facilities.examRooms}</div></div>
        <div><div className="co-deal__label">Building Size</div><div className="co-deal__value" style={{fontSize:14}}>{PRACTICE.facilities.buildingSize}</div></div>
        <div><div className="co-deal__label">Monthly Rent</div><div className="co-deal__value" style={{fontSize:14}}>{PRACTICE.facilities.monthlyRent}</div></div>
        <div><div className="co-deal__label">Lease Expires</div><div className="co-deal__value" style={{fontSize:14}}>{PRACTICE.facilities.leaseExpires}</div></div>
      </div>
    </div>
  </aside>
);

Object.assign(window, { PracticeView });
