// Team section — Owners | Doctors | Staff | Consultants | Payroll | Benefits

// ─── Seed data ───────────────────────────────────────────────────────────────

const TEAM_BENEFITS_SEED = {
  insurance: [
    { key: "health",     name: "Health Insurance",     provider: "Blue Cross Blue Shield", plan: "PPO, HMO",          enrolled: 14, ownerCovered: true,
      company:  { amount: "450", cadence: "month",  unit: "dollar" },
      employee: { amount: "150", cadence: "month",  unit: "dollar" } },
    { key: "dental",     name: "Dental Insurance",     provider: "Delta Dental",           plan: "Standard",           enrolled: 12,
      company:  { amount: "70",  cadence: "month",  unit: "dollar" },
      employee: { amount: "20",  cadence: "month",  unit: "dollar" } },
    { key: "vision",     name: "Vision Insurance",     provider: "VSP",                    plan: "Standard",           enrolled: 10,
      company:  { amount: "35",  cadence: "month",  unit: "dollar" },
      employee: { amount: "10",  cadence: "month",  unit: "dollar" } },
    { key: "disability", name: "Disability Insurance", provider: "Guardian",               plan: "Short & Long-term",  enrolled: 8,
      company:  { amount: "50",  cadence: "month",  unit: "dollar" },
      employee: { amount: "15",  cadence: "month",  unit: "dollar" } },
    { key: "life",       name: "Life Insurance",       provider: "MetLife",                plan: "2× annual salary",   enrolled: 15,
      company:  { amount: "25",  cadence: "month",  unit: "dollar" },
      employee: null },
  ],
  other: [
    { key: "retirement", name: "401(k) Plan",          provider: "Fidelity",
      company:  { amount: "3",    cadence: "salary", unit: "percent" },
      employee: { amount: "6",    cadence: "salary", unit: "percent" } },
    { key: "ce",         name: "Continuing Education", provider: null,
      company:  { amount: "500",  cadence: "year",   unit: "dollar"  },
      employee: null },
    { key: "pto",        name: "Paid Time Off",        provider: null,
      company:  { amount: "80",   cadence: "year",   unit: "hours"   },
      employee: null },
    { key: "bonus",      name: "Annual Bonus",         provider: null,
      company:  { amount: "1000", cadence: "year",   unit: "dollar"  },
      employee: null },
  ],
};

const DOCTORS_SEED = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    role: "Lead Veterinarian & Practice Owner",
    age: "42",
    yearsExperience: "18",
    employment: "part",
    compensation: "180000",
    specialty: "Small Animals, General Practice",
    license: "#TX-VET-8472",
    licenseState: "Texas",
    complaints: "None",
    education: [
      { degree: "Doctor of Veterinary Medicine (DVM)", institution: "Cornell University College of Veterinary Medicine", year: "2006" },
      { degree: "Bachelor of Science, Animal Biology", institution: "University of California, Davis", year: "2002" },
      { degree: "Advanced Certification, Small Animal Emergency & Critical Care", institution: "VECCS", year: "2010" },
    ],
    experience: [
      { employer: "Sunny Paws Veterinary Clinic", role: "Founder & Owner", startYear: "2015", endYear: "Present", bullets: ["Founded the practice; built it to 18 years of veterinary experience.", "Specializes in emergency medicine, small animal surgery, and practice management.", "Mentored 20+ veterinary students; presents nationally on emergency procedures."] },
      { employer: "Metropolitan Animal Hospital, Dallas", role: "Chief of Surgery", startYear: "2010", endYear: "2015", bullets: ["Developed innovative trauma care protocols and emergency surgical techniques.", "Managed thousands of emergency procedures."] },
    ],
    bio: "Active member of the American Veterinary Medical Association (AVMA) and the Veterinary Emergency and Critical Care Society (VECCS).",
  },
  {
    id: 2,
    name: "Dr. James Chen",
    role: "Associate Veterinarian — Internal Medicine",
    age: "35",
    yearsExperience: "9",
    employment: "part",
    compensation: "130000",
    specialty: "Small Animals, General Practice",
    license: "#TX-VET-9283",
    licenseState: "Texas",
    complaints: "None",
    education: [
      { degree: "Doctor of Veterinary Medicine (DVM)", institution: "University of Pennsylvania School of Veterinary Medicine", year: "2015" },
      { degree: "Bachelor of Science, Animal Science", institution: "Penn State University", year: "2011" },
      { degree: "Board Certification, Small Animal Internal Medicine (ACVIM)", institution: "American College of Veterinary Internal Medicine", year: "2019" },
    ],
    experience: [
      { employer: "Sunny Paws Veterinary Clinic", role: "Associate Veterinarian", startYear: "2018", endYear: "Present", bullets: ["Premier specialist for complex medical cases at the practice.", "Particular passion for feline medicine; published peer-reviewed research on feline diabetes management.", "Areas of expertise: endocrine disorders, GI disease, immune-mediated conditions, chronic disease management."] },
      { employer: "University of Georgia Veterinary Teaching Hospital", role: "Internal Medicine Residency", startYear: "2016", endYear: "2018", bullets: ["Focused on endocrinology and gastroenterology."] },
      { employer: "North Carolina State University College of Veterinary Medicine", role: "Small Animal Internship", startYear: "2015", endYear: "2016", bullets: [] },
    ],
    bio: "Serves on the Internal Medicine Committee of the Texas Veterinary Medical Association. Known for a methodical diagnostic approach and exceptional client communication.",
  },
];

const STAFF_SEED = [
  { id: 1,  name: "Ashley Williams",   role: "Veterinary Technician",        startDate: "2020-09-13", type: "full", salaryType: "annual", salary: "47000", hours: "40" },
  { id: 2,  name: "Brian O'Connor",    role: "Kennel Supervisor",            startDate: "2019-06-30", type: "full", salaryType: "annual", salary: "44000", hours: "40" },
  { id: 3,  name: "David Kim",         role: "Client Services Coordinator",  startDate: "2021-01-31", type: "full", salaryType: "annual", salary: "42000", hours: "40" },
  { id: 4,  name: "Jennifer Martinez", role: "Practice Manager",             startDate: "2019-03-14", type: "full", salaryType: "annual", salary: "72000", hours: "40" },
  { id: 5,  name: "Kevin Zhang",       role: "Inventory & Supply Manager",   startDate: "2020-06-17", type: "part", salaryType: "annual", salary: "48000", hours: "35" },
  { id: 6,  name: "Lisa Anderson",     role: "Veterinary Assistant",         startDate: "2022-05-09", type: "part", salaryType: "annual", salary: "38000", hours: "35" },
  { id: 7,  name: "Marcus Johnson",    role: "Veterinary Assistant",         startDate: "2021-08-14", type: "part", salaryType: "annual", salary: "36000", hours: "32" },
  { id: 8,  name: "Michael Thompson",  role: "Lead Veterinary Technician",   startDate: "2018-05-31", type: "full", salaryType: "annual", salary: "54000", hours: "40" },
  { id: 9,  name: "Natalie Cruz",      role: "Veterinary Assistant",         startDate: "2023-03-11", type: "part", salaryType: "annual", salary: "35000", hours: "30" },
  { id: 10, name: "Rachel Foster",     role: "Veterinary Technician",        startDate: "2020-11-19", type: "full", salaryType: "annual", salary: "46000", hours: "40" },
  { id: 11, name: "Sofia Patel",       role: "Receptionist",                 startDate: "2022-01-09", type: "full", salaryType: "annual", salary: "40000", hours: "40" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cadenceOpts = (unit) =>
  unit === "percent" ? [{ value: "salary", label: "% of salary" }, { value: "monthly-salary", label: "% of monthly" }]
  : unit === "hours"  ? [{ value: "year", label: "hrs / year" }, { value: "month", label: "hrs / month" }]
  : [
      { value: "month",    label: "/ month" },
      { value: "paycheck", label: "/ paycheck" },
      { value: "biweekly", label: "/ biweekly" },
      { value: "year",     label: "/ year" },
      { value: "quarter",  label: "/ quarter" },
    ];

const fmtContrib = (c) => {
  if (!c) return null;
  if (c.unit === "percent") return `${c.amount}% of salary`;
  if (c.unit === "hours") return `${c.amount} hrs/${c.cadence}`;
  const cadLabel = { month: "/mo", year: "/yr", paycheck: "/paycheck", biweekly: "/biweekly", quarter: "/qtr" };
  return `$${c.amount}${cadLabel[c.cadence] || `/${c.cadence}`}`;
};

const fmtPay = (member) => {
  if (!member.salary) return "—";
  const n = parseFloat(member.salary.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return "—";
  return member.salaryType === "hourly" ? `$${n.toFixed(2)}/hr` : `$${n.toLocaleString()}/yr`;
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ─── Shared contrib editor row ────────────────────────────────────────────────

const ContribEditor = ({ label, contrib, onChange }) => {
  const opts = cadenceOpts(contrib.unit);
  const isHours = contrib.unit === "hours";
  const isPercent = contrib.unit === "percent";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
      <span style={{ font: "400 12px/1 Inter", color: "var(--stone-500)", width: 120, flexShrink: 0 }}>{label}</span>
      {!isHours && (
        <select
          className="co-tbl-select"
          style={{ width: 46, flexShrink: 0, paddingLeft: 6 }}
          value={contrib.unit}
          onChange={e => {
            const u = e.target.value;
            onChange({ ...contrib, unit: u, cadence: u === "percent" ? "salary" : "month" });
          }}
        >
          <option value="dollar">$</option>
          <option value="percent">%</option>
        </select>
      )}
      <input
        className="co-tbl-input"
        style={{ width: 72, flexShrink: 0 }}
        value={contrib.amount}
        onChange={e => onChange({ ...contrib, amount: e.target.value })}
      />
      {isHours && <span style={{ font: "400 13px/1 Inter", color: "var(--stone-500)", flexShrink: 0 }}>hrs</span>}
      <select
        className="co-tbl-select"
        style={{ width: 120, flexShrink: 0 }}
        value={contrib.cadence}
        onChange={e => onChange({ ...contrib, cadence: e.target.value })}
      >
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
};

// ─── Benefits Edit Modal ──────────────────────────────────────────────────────

const BenefitsEditModal = ({ benefits, onClose }) => {
  const allBenefits = [...benefits.insurance, ...benefits.other];
  const init = () => {
    const s = {};
    allBenefits.forEach(b => {
      s[b.key] = {
        provider: b.provider || "",
        company: { ...b.company },
        employee: b.employee ? { ...b.employee } : null,
      };
    });
    return s;
  };
  const [state, setState] = React.useState(init);

  const setField = (key, field, val) =>
    setState(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));

  const BenefitBlock = ({ b, isLast }) => {
    const s = state[b.key];
    return (
      <div style={{ padding: "16px 0", borderBottom: isLast ? "none" : "1px solid var(--stone-100)" }}>
        <div style={{ font: "600 14px/1 Inter", marginBottom: 10, color: "var(--stone-900)" }}>{b.name}</div>
        {b.provider != null && (
          <div className="co-field" style={{ margin: "0 0 8px" }}>
            <label>Provider</label>
            <input value={s.provider} onChange={e => setField(b.key, "provider", e.target.value)} />
          </div>
        )}
        <ContribEditor
          label="Company"
          contrib={s.company}
          onChange={v => setField(b.key, "company", v)}
        />
        {s.employee && (
          <ContribEditor
            label="Employee"
            contrib={s.employee}
            onChange={v => setField(b.key, "employee", v)}
          />
        )}
      </div>
    );
  };

  return (
    <Modal title="Edit Practice Benefits" onClose={onClose} footer={<>
      <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
      <button className="co-btn co-btn--primary" onClick={onClose}>Save Benefits</button>
    </>}>
      <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 16px" }}>
        Practice-wide defaults. Override per staff member via the Details panel.
      </p>
      <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 4 }}>Insurance</div>
      {benefits.insurance.map((b, i) => (
        <BenefitBlock key={b.key} b={b} isLast={i === benefits.insurance.length - 1} />
      ))}
      <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", margin: "16px 0 4px" }}>Retirement & Other</div>
      {benefits.other.map((b, i) => (
        <BenefitBlock key={b.key} b={b} isLast={i === benefits.other.length - 1} />
      ))}
    </Modal>
  );
};

// ─── Staff Details Slideout ───────────────────────────────────────────────────

const StaffDetailsSlideout = ({ member, benefits, overrides, onSave, onRemove, onClose }) => {
  const [disabled, setDisabled] = React.useState(new Set(overrides?.disabled || []));
  const [notes, setNotes] = React.useState(overrides?.notes || "");

  const initOverrides = () => {
    const saved = overrides?.benefitOverrides || {};
    const result = {};
    [...benefits.insurance, ...benefits.other].forEach(b => {
      result[b.key] = saved[b.key] || {
        company: { ...b.company },
        employee: b.employee ? { ...b.employee } : null,
      };
    });
    return result;
  };
  const [benefitOverrides, setBenefitOverrides] = React.useState(initOverrides);

  const toggle = (key) => setDisabled(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  const setOv = (key, field, val) =>
    setBenefitOverrides(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));

  const handleSave = () => {
    onSave({ disabled: [...disabled], notes, benefitOverrides });
    onClose();
  };

  const labelStyle = { font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 5 };
  const valueStyle = { font: "500 14px/1.2 Inter", color: "var(--stone-900)" };

  const BenefitRow = ({ b }) => {
    const isDisabled = disabled.has(b.key);
    const ov = benefitOverrides[b.key] || {};

    return (
      <div className="co-benefit-row" style={{ opacity: isDisabled ? 0.45 : 1, alignItems: "flex-start" }}>
        <input type="checkbox" className="co-benefit-row__check" style={{ marginTop: 3 }} checked={!isDisabled} onChange={() => toggle(b.key)} />
        <div className="co-benefit-row__info" style={{ flex: 1 }}>
          <div className="co-benefit-row__name">
            {b.name}
            {b.ownerCovered && (
              <span className="co-badge co-badge--green" style={{ marginLeft: 8, fontSize: 11, verticalAlign: "middle" }}>Owner covered</span>
            )}
          </div>
          {b.provider && (
            <div style={{ font: "400 12px/1 Inter", color: "var(--stone-500)", marginTop: 3 }}>{b.provider}</div>
          )}
          {!isDisabled && ov.company && (
            <ContribEditor
              label="Company"
              contrib={ov.company}
              onChange={v => setOv(b.key, "company", v)}
            />
          )}
          {!isDisabled && ov.employee && (
            <ContribEditor
              label="Employee"
              contrib={ov.employee}
              onChange={v => setOv(b.key, "employee", v)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout">
        <div className="co-slideout__header">
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Support Staff</div>
            <h2 style={{ margin: "0 0 4px" }}>{member.name || "New Staff Member"}</h2>
            <div style={{ font: "400 14px/1 Inter", color: "var(--stone-500)" }}>{member.role || "—"}</div>
          </div>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="co-slideout__body">
          <div style={{ background: "var(--stone-50)", border: "1px solid var(--stone-200)", borderRadius: 10, padding: "16px 18px", marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 16px" }}>
            <div>
              <div style={labelStyle}>Employment</div>
              <div style={valueStyle}>{member.type === "full" ? "Full-time" : "Part-time"}</div>
            </div>
            <div>
              <div style={labelStyle}>Start Date</div>
              <div style={valueStyle}>{fmtDate(member.startDate)}</div>
            </div>
            <div>
              <div style={labelStyle}>Pay</div>
              <div style={valueStyle}>{fmtPay(member)}</div>
            </div>
            <div>
              <div style={labelStyle}>Hrs / Week</div>
              <div style={valueStyle}>{member.hours || "—"}</div>
            </div>
            <div style={{ gridColumn: "2 / -1" }}>
              <div style={labelStyle}>Role</div>
              <div style={valueStyle}>{member.role || "—"}</div>
            </div>
          </div>

          <div style={{ font: "400 13px/1.5 Inter", color: "var(--stone-500)", marginBottom: 20, padding: "11px 13px", background: "var(--stone-50)", borderRadius: 8, border: "1px solid var(--stone-200)" }}>
            Benefits are pre-filled from practice defaults. Uncheck any that don't apply, or adjust amounts for this staff member.
          </div>

          <div style={{ font: "600 14px/1 Inter", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="checkCircle" size={15} style={{ color: "var(--teal-brand)" }} /> Insurance
          </div>
          {benefits.insurance.map(b => <BenefitRow key={b.key} b={b} />)}

          <div style={{ font: "600 14px/1 Inter", margin: "20px 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="dollarSign" size={15} style={{ color: "var(--teal-brand)" }} /> Retirement & Other Benefits
          </div>
          {benefits.other.map(b => <BenefitRow key={b.key} b={b} />)}

          <div style={{ marginTop: 24 }}>
            <div style={{ font: "600 14px/1 Inter", marginBottom: 8 }}>Notes</div>
            <textarea
              style={{ width: "100%", border: "1px solid var(--stone-200)", borderRadius: 8, padding: "10px 12px", font: "400 14px/1.5 Inter", minHeight: 72, resize: "vertical", background: "#fff", outline: "none" }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes specific to this staff member's benefits…"
            />
          </div>
        </div>

        <div className="co-slideout__footer">
          <button
            onClick={() => { onRemove(); onClose(); }}
            style={{ background: "none", border: 0, cursor: "pointer", font: "500 14px/1 Inter", color: "#BE123C", padding: "0 4px", marginRight: "auto" }}
          >
            Remove Staff Member
          </button>
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={handleSave}>Save Details</button>
        </div>
      </div>
    </>
  );
};

// ─── Add Staff Slideout ───────────────────────────────────────────────────────

const AddStaffSlideout = ({ onAdd, onClose, nextId }) => {
  const [form, setForm] = React.useState({
    name: "", role: "", startDate: "", type: "full", salaryType: "annual", salary: "", hours: "40",
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleAdd = () => {
    onAdd({ ...form, id: nextId });
    onClose();
  };

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout">
        <div className="co-slideout__header">
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Support Staff</div>
            <h2 style={{ margin: 0 }}>Add Staff Member</h2>
          </div>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="co-slideout__body">
          <div className="co-field">
            <label>Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" />
          </div>
          <div className="co-field">
            <label>Role / Title</label>
            <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Veterinary Technician" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="co-field" style={{ margin: 0 }}>
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
            </div>
            <div className="co-field" style={{ margin: 0 }}>
              <label>Employment</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="full">Full-time</option>
                <option value="part">Part-time</option>
              </select>
            </div>
          </div>
          <div className="co-field">
            <label>Pay</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={form.salaryType} onChange={e => set("salaryType", e.target.value)} style={{ width: 110, flexShrink: 0, height: 36, border: "1px solid var(--stone-200)", borderRadius: 6, font: "400 14px/1 Inter", background: "#fff", cursor: "pointer" }}>
                <option value="annual">Annual $</option>
                <option value="hourly">Hourly $</option>
              </select>
              <input className="co-field__input" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder={form.salaryType === "hourly" ? "0.00" : "0"} style={{ flex: 1 }} />
            </div>
          </div>
          <div className="co-field">
            <label>Hours / Week</label>
            <input value={form.hours} onChange={e => set("hours", e.target.value)} placeholder="40" style={{ width: 80 }} />
          </div>
        </div>
        <div className="co-slideout__footer">
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={handleAdd}>Add Staff Member</button>
        </div>
      </div>
    </>
  );
};

// ─── Staff Table Row ──────────────────────────────────────────────────────────

const StaffTableRow = ({ member, detailSaved, onChange, onDetails }) => (
  <tr>
    <td style={{ minWidth: 180 }}>
      <input
        className="co-tbl-input"
        value={member.name}
        onChange={e => onChange({ ...member, name: e.target.value })}
        placeholder="Full name"
      />
    </td>
    <td style={{ minWidth: 200 }}>
      <input
        className="co-tbl-input"
        value={member.role}
        onChange={e => onChange({ ...member, role: e.target.value })}
        placeholder="Role / Title"
      />
    </td>
    <td>
      <input
        className="co-tbl-input"
        type="date"
        style={{ width: 124 }}
        value={member.startDate}
        onChange={e => onChange({ ...member, startDate: e.target.value })}
      />
    </td>
    <td>
      <select className="co-tbl-select" value={member.type} onChange={e => onChange({ ...member, type: e.target.value })}>
        <option value="full">Full-time</option>
        <option value="part">Part-time</option>
      </select>
    </td>
    <td>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <select className="co-tbl-select" style={{ width: 95, flexShrink: 0 }} value={member.salaryType} onChange={e => onChange({ ...member, salaryType: e.target.value })}>
          <option value="annual">Annual $</option>
          <option value="hourly">Hourly $</option>
        </select>
        <input
          className="co-tbl-input"
          style={{ width: 88 }}
          value={member.salary}
          onChange={e => onChange({ ...member, salary: e.target.value })}
          placeholder={member.salaryType === "hourly" ? "0.00" : "0"}
        />
      </div>
    </td>
    <td>
      <input
        className="co-tbl-input"
        style={{ width: 52, textAlign: "center" }}
        value={member.hours}
        onChange={e => onChange({ ...member, hours: e.target.value })}
        placeholder="40"
      />
    </td>
    <td className="co-sticky-col">
      <button className="co-more-details" onClick={onDetails}>
        Details
        {detailSaved && <span style={{ font: "400 11px/1 Inter", color: "var(--stone-400)", marginLeft: 2 }}>· saved</span>}
        <Icon name="chevronRight" size={13} />
      </button>
    </td>
  </tr>
);

// ─── Doctor helpers ───────────────────────────────────────────────────────────

const fmtMoney = (s) => {
  if (!s) return "—";
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return "—";
  return `$${n.toLocaleString()}`;
};

const yearRange = (a, b) => {
  if (!a && !b) return "";
  if (a && b) return `${a} – ${b}`;
  return a || b;
};

// ─── Doctor Profile Card ──────────────────────────────────────────────────────

const DoctorProfileCard = ({ doctor, onEdit }) => {
  const lblStyle = { font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 8 };
  const factStyle = { display: "inline-flex", alignItems: "center", gap: 6, font: "500 14px/1 Inter", color: "var(--stone-700)" };
  const sectionTitle = { font: "600 14px/1 Inter", color: "var(--stone-900)", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 };

  return (
    <div className="co-card" style={{ padding: 24, position: "relative", marginBottom: 16 }}>
      <button
        onClick={onEdit}
        title="Edit doctor"
        style={{ position: "absolute", top: 16, right: 16, background: "none", border: 0, cursor: "pointer", padding: 6, borderRadius: 6, color: "var(--stone-500)", display: "grid", placeItems: "center" }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--stone-100)"; e.currentTarget.style.color = "var(--stone-900)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--stone-500)"; }}
      >
        <Icon name="edit" size={16} />
      </button>

      {/* Header */}
      <div style={{ marginBottom: 18, paddingRight: 36 }}>
        <h3 style={{ font: "700 20px/1.2 Inter", margin: "0 0 4px", color: "var(--stone-900)" }}>{doctor.name}</h3>
        <div style={{ font: "500 14px/1.2 Inter", color: "var(--teal-brand)" }}>{doctor.role}</div>
      </div>

      {/* Quick facts strip */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid var(--stone-100)" }}>
        <span style={factStyle}><Icon name="users" size={14} style={{ color: "var(--stone-500)" }} /> Age {doctor.age || "—"}</span>
        <span style={factStyle}><Icon name="briefcase" size={14} style={{ color: "var(--stone-500)" }} /> {doctor.yearsExperience || "—"} years experience</span>
        <span style={factStyle}><Icon name="clock" size={14} style={{ color: "var(--stone-500)" }} /> {doctor.employment === "full" ? "Full-time" : "Part-time"}</span>
        <span style={factStyle}><Icon name="dollarSign" size={14} style={{ color: "var(--stone-500)" }} /> {fmtMoney(doctor.compensation)}</span>
      </div>

      {/* Two-column meta grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px", marginBottom: 22 }}>
        <div>
          <div style={lblStyle}><Icon name="award" size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} />Specialty</div>
          <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-900)" }}>{doctor.specialty || "—"}</div>
        </div>
        <div>
          <div style={lblStyle}><Icon name="checkCircle" size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} />License</div>
          <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-900)" }}>
            {doctor.license || "—"}{doctor.licenseState ? ` (${doctor.licenseState})` : ""}
          </div>
        </div>
        <div>
          <div style={lblStyle}><Icon name="info" size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} />Complaints</div>
          <div style={{ font: "400 14px/1.4 Inter", color: doctor.complaints && doctor.complaints.toLowerCase() !== "none" ? "#BE123C" : "var(--stone-900)" }}>
            {doctor.complaints || "None"}
          </div>
        </div>
      </div>

      {/* Education — resume style */}
      <div style={{ marginBottom: 22 }}>
        <div style={sectionTitle}>
          <Icon name="award" size={15} style={{ color: "var(--teal-brand)" }} /> Education
        </div>
        {doctor.education && doctor.education.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {doctor.education.map((ed, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "baseline" }}>
                <div>
                  <div style={{ font: "600 14px/1.4 Inter", color: "var(--stone-900)" }}>{ed.degree}</div>
                  <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>{ed.institution}</div>
                </div>
                <div style={{ font: "500 14px/1.4 Inter", color: "var(--stone-500)", whiteSpace: "nowrap" }}>{ed.year}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>No education added.</div>
        )}
      </div>

      {/* Experience — resume style */}
      <div style={{ marginBottom: doctor.bio ? 22 : 0 }}>
        <div style={sectionTitle}>
          <Icon name="briefcase" size={15} style={{ color: "var(--teal-brand)" }} /> Professional Experience
        </div>
        {doctor.experience && doctor.experience.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {doctor.experience.map((ex, i) => (
              <div key={i}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "baseline" }}>
                  <div>
                    <div style={{ font: "600 14px/1.4 Inter", color: "var(--stone-900)" }}>{ex.role}</div>
                    <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>{ex.employer}</div>
                  </div>
                  <div style={{ font: "500 14px/1.4 Inter", color: "var(--stone-500)", whiteSpace: "nowrap" }}>{yearRange(ex.startYear, ex.endYear)}</div>
                </div>
                {ex.bullets && ex.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: "6px 0 0", paddingLeft: 20, font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>
                    {ex.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginTop: j === 0 ? 0 : 4 }}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>No experience added.</div>
        )}
      </div>

      {/* Bio / Notes */}
      {doctor.bio && (
        <div>
          <div style={sectionTitle}>
            <Icon name="fileText" size={15} style={{ color: "var(--teal-brand)" }} /> Bio / Notes
          </div>
          <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>{doctor.bio}</div>
        </div>
      )}
    </div>
  );
};

// ─── Doctor Edit / Add Slideout ───────────────────────────────────────────────

const blankDoctor = () => ({
  name: "", role: "", age: "", yearsExperience: "", employment: "full", compensation: "",
  specialty: "", license: "", licenseState: "", complaints: "None",
  education: [], experience: [], bio: "",
});

const DoctorSlideout = ({ doctor, isNew, onSave, onRemove, onClose }) => {
  const [form, setForm] = React.useState(() => ({
    ...blankDoctor(),
    ...(doctor || {}),
    education: (doctor?.education ? doctor.education.map(e => ({ ...e })) : []),
    experience: (doctor?.experience ? doctor.experience.map(e => ({ ...e, bullets: [...(e.bullets || [])] })) : []),
  }));

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const updateEd = (i, patch) => setForm(prev => ({ ...prev, education: prev.education.map((ed, idx) => idx === i ? { ...ed, ...patch } : ed) }));
  const addEd = () => setForm(prev => ({ ...prev, education: [...prev.education, { degree: "", institution: "", year: "" }] }));
  const removeEd = (i) => setForm(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  const updateEx = (i, patch) => setForm(prev => ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, ...patch } : ex) }));
  const addEx = () => setForm(prev => ({ ...prev, experience: [...prev.experience, { employer: "", role: "", startYear: "", endYear: "", bullets: [""] }] }));
  const removeEx = (i) => setForm(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));

  const updateBullet = (exIdx, bIdx, val) => setForm(prev => ({
    ...prev,
    experience: prev.experience.map((ex, idx) => idx === exIdx ? { ...ex, bullets: ex.bullets.map((b, j) => j === bIdx ? val : b) } : ex),
  }));
  const addBullet = (exIdx) => setForm(prev => ({
    ...prev,
    experience: prev.experience.map((ex, idx) => idx === exIdx ? { ...ex, bullets: [...(ex.bullets || []), ""] } : ex),
  }));
  const removeBullet = (exIdx, bIdx) => setForm(prev => ({
    ...prev,
    experience: prev.experience.map((ex, idx) => idx === exIdx ? { ...ex, bullets: ex.bullets.filter((_, j) => j !== bIdx) } : ex),
  }));

  const handleSave = () => {
    onSave({
      ...form,
      experience: form.experience.map(ex => ({ ...ex, bullets: (ex.bullets || []).filter(b => b && b.trim()) })),
    });
    onClose();
  };

  const sectionLabel = { font: "600 14px/1 Inter", color: "var(--stone-900)", marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 };
  const subCard = { background: "var(--stone-50)", border: "1px solid var(--stone-200)", borderRadius: 8, padding: "14px 14px 4px", marginBottom: 12 };

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout" style={{ width: 560 }}>
        <div className="co-slideout__header">
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Doctor</div>
            <h2 style={{ margin: 0 }}>{isNew ? "Add Doctor" : (form.name || "Edit Doctor")}</h2>
          </div>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="co-slideout__body">
          {/* Identity */}
          <div className="co-field">
            <label>Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Dr. Jane Doe" />
          </div>
          <div className="co-field">
            <label>Title / Role</label>
            <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Associate Veterinarian — Internal Medicine" />
          </div>

          {/* Quick facts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="co-field" style={{ margin: 0 }}>
              <label>Age</label>
              <input value={form.age} onChange={e => set("age", e.target.value)} placeholder="—" />
            </div>
            <div className="co-field" style={{ margin: 0 }}>
              <label>Years of Experience</label>
              <input value={form.yearsExperience} onChange={e => set("yearsExperience", e.target.value)} placeholder="—" />
            </div>
            <div className="co-field" style={{ margin: 0 }}>
              <label>Employment</label>
              <select value={form.employment} onChange={e => set("employment", e.target.value)}>
                <option value="full">Full-time</option>
                <option value="part">Part-time</option>
              </select>
            </div>
            <div className="co-field" style={{ margin: 0 }}>
              <label>Compensation (annual $)</label>
              <input value={form.compensation} onChange={e => set("compensation", e.target.value)} placeholder="0" />
            </div>
          </div>

          <div className="co-field" style={{ marginTop: 16 }}>
            <label>Specialty</label>
            <input value={form.specialty} onChange={e => set("specialty", e.target.value)} placeholder="e.g. Small Animals, General Practice" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div className="co-field" style={{ margin: 0 }}>
              <label>License Number</label>
              <input value={form.license} onChange={e => set("license", e.target.value)} placeholder="#TX-VET-0000" />
            </div>
            <div className="co-field" style={{ margin: 0 }}>
              <label>State</label>
              <input value={form.licenseState} onChange={e => set("licenseState", e.target.value)} placeholder="Texas" />
            </div>
          </div>

          <div className="co-field" style={{ marginTop: 16 }}>
            <label>Complaints</label>
            <input value={form.complaints} onChange={e => set("complaints", e.target.value)} placeholder="None" />
          </div>

          {/* Education */}
          <div style={sectionLabel}>
            <Icon name="award" size={15} style={{ color: "var(--teal-brand)" }} /> Education
          </div>
          {form.education.map((ed, i) => (
            <div key={i} style={subCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ font: "500 13px/1 Inter", color: "var(--stone-500)" }}>Entry {i + 1}</div>
                <button onClick={() => removeEd(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "#BE123C", font: "500 13px/1 Inter", padding: 4 }}>Remove</button>
              </div>
              <div className="co-field">
                <label>Degree / Certification</label>
                <input value={ed.degree} onChange={e => updateEd(i, { degree: e.target.value })} placeholder="Doctor of Veterinary Medicine (DVM)" />
              </div>
              <div className="co-field">
                <label>Institution</label>
                <input value={ed.institution} onChange={e => updateEd(i, { institution: e.target.value })} placeholder="Cornell University College of Veterinary Medicine" />
              </div>
              <div className="co-field">
                <label>Year</label>
                <input value={ed.year} onChange={e => updateEd(i, { year: e.target.value })} placeholder="2015" style={{ width: 120 }} />
              </div>
            </div>
          ))}
          <button className="co-add-row" onClick={addEd} style={{ marginBottom: 6 }}>
            <Icon name="plus" size={14} /> Add education
          </button>

          {/* Experience */}
          <div style={sectionLabel}>
            <Icon name="briefcase" size={15} style={{ color: "var(--teal-brand)" }} /> Professional Experience
          </div>
          {form.experience.map((ex, i) => (
            <div key={i} style={subCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ font: "500 13px/1 Inter", color: "var(--stone-500)" }}>Entry {i + 1}</div>
                <button onClick={() => removeEx(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "#BE123C", font: "500 13px/1 Inter", padding: 4 }}>Remove</button>
              </div>
              <div className="co-field">
                <label>Role / Title</label>
                <input value={ex.role} onChange={e => updateEx(i, { role: e.target.value })} placeholder="Associate Veterinarian" />
              </div>
              <div className="co-field">
                <label>Employer</label>
                <input value={ex.employer} onChange={e => updateEx(i, { employer: e.target.value })} placeholder="Sunny Paws Veterinary Clinic" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="co-field" style={{ margin: 0 }}>
                  <label>Start Year</label>
                  <input value={ex.startYear} onChange={e => updateEx(i, { startYear: e.target.value })} placeholder="2018" />
                </div>
                <div className="co-field" style={{ margin: 0 }}>
                  <label>End Year</label>
                  <input value={ex.endYear} onChange={e => updateEx(i, { endYear: e.target.value })} placeholder="Present" />
                </div>
              </div>
              <div className="co-field" style={{ marginTop: 12 }}>
                <label>Highlights</label>
                {(ex.bullets || []).map((b, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                    <span style={{ font: "400 14px/1.6 Inter", color: "var(--stone-500)", flexShrink: 0 }}>•</span>
                    <input value={b} onChange={e => updateBullet(i, j, e.target.value)} placeholder="One accomplishment, area of focus, or note…" />
                    <button onClick={() => removeBullet(i, j)} title="Remove" style={{ background: "none", border: 0, cursor: "pointer", color: "var(--stone-500)", padding: 6, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="x" size={14} /></button>
                  </div>
                ))}
                <button onClick={() => addBullet(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--teal-brand)", font: "500 13px/1 Inter", padding: "4px 0", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="plus" size={12} /> Add highlight
                </button>
              </div>
            </div>
          ))}
          <button className="co-add-row" onClick={addEx} style={{ marginBottom: 6 }}>
            <Icon name="plus" size={14} /> Add experience
          </button>

          {/* Bio / Notes */}
          <div style={sectionLabel}>
            <Icon name="fileText" size={15} style={{ color: "var(--teal-brand)" }} /> Bio / Notes
          </div>
          <textarea
            style={{ width: "100%", border: "1px solid var(--stone-200)", borderRadius: 8, padding: "10px 12px", font: "400 14px/1.5 Inter", minHeight: 100, resize: "vertical", background: "#fff", outline: "none" }}
            value={form.bio}
            onChange={e => set("bio", e.target.value)}
            placeholder="Memberships, awards, areas of interest, or any other notes about this doctor…"
          />
        </div>

        <div className="co-slideout__footer">
          {!isNew && (
            <button
              onClick={() => { onRemove(); onClose(); }}
              style={{ background: "none", border: 0, cursor: "pointer", font: "500 14px/1 Inter", color: "#BE123C", padding: "0 4px", marginRight: "auto" }}
            >
              Remove Doctor
            </button>
          )}
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={handleSave}>{isNew ? "Add Doctor" : "Save Doctor"}</button>
        </div>
      </div>
    </>
  );
};

// ─── Doctors Tab ──────────────────────────────────────────────────────────────

const DoctorsTab = ({ doctors, setDoctors }) => {
  const [editingId, setEditingId] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [nextId, setNextId] = React.useState(() => doctors.reduce((m, d) => Math.max(m, d.id), 0) + 1);

  const editing = doctors.find(d => d.id === editingId);

  const updateDoctor = (updated) => setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));
  const removeDoctor = (id) => setDoctors(prev => prev.filter(d => d.id !== id));
  const addDoctor = (doc) => {
    setDoctors(prev => [...prev, { ...doc, id: nextId }]);
    setNextId(n => n + 1);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, paddingTop: 10, paddingBottom: 10, gap: 16 }}>
        <div>
          <h2 style={{ font: "700 18px/1 Inter", margin: "0 0 6px" }}>Doctors ({doctors.length})</h2>
          <p style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", margin: 0 }}>
            Profiles for each veterinarian on staff. Click the edit icon on a profile to update fields.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="co-btn-solid" onClick={() => setShowAdd(true)}>
            <Icon name="plus" size={14} /> Add Doctor
          </button>
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="co-coming-soon">
          <div className="co-coming-soon__icon"><Icon name="user" size={22} /></div>
          <h3>No doctors yet</h3>
          <p>Click "Add Doctor" to create the first profile.</p>
        </div>
      ) : (
        doctors.map(d => (
          <DoctorProfileCard key={d.id} doctor={d} onEdit={() => setEditingId(d.id)} />
        ))
      )}

      {editing && (
        <DoctorSlideout
          doctor={editing}
          isNew={false}
          onSave={updateDoctor}
          onRemove={() => removeDoctor(editing.id)}
          onClose={() => setEditingId(null)}
        />
      )}

      {showAdd && (
        <DoctorSlideout
          doctor={null}
          isNew={true}
          onSave={addDoctor}
          onRemove={() => {}}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  );
};

// ─── Staff Tab ────────────────────────────────────────────────────────────────

const StaffTab = ({ benefits, staff, setStaff, memberDetails, setMemberDetails }) => {
  const [slideoutId, setSlideoutId] = React.useState(null);
  const [showAddSlideout, setShowAddSlideout] = React.useState(false);
  const [showBenefitsEdit, setShowBenefitsEdit] = React.useState(false);
  const [nextId, setNextId] = React.useState(20);

  const slideoutMember = staff.find(s => s.id === slideoutId);
  const updateMember = (updated) => setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
  const removeMember = (id) => setStaff(prev => prev.filter(s => s.id !== id));
  const addMemberInline = () => {
    setStaff(prev => [...prev, { id: nextId, name: "", role: "", startDate: "", type: "full", salaryType: "annual", salary: "", hours: "40" }]);
    setNextId(n => n + 1);
  };
  const addMemberFromSlideout = (member) => {
    setStaff(prev => [...prev, member]);
    setNextId(n => n + 1);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, paddingTop: 10, paddingBottom: 10, gap: 16 }}>
        <div>
          <h2 style={{ font: "700 18px/1 Inter", margin: "0 0 6px" }}>Support Staff ({staff.length})</h2>
          <p style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", margin: 0 }}>
            Add a new staff member or use the table to add multiple staff members at a time.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="co-btn-outline-green" onClick={() => {}}>
            <Icon name="upload" size={14} /> Upload
          </button>
          <button className="co-btn-solid" onClick={() => setShowAddSlideout(true)}>
            <Icon name="plus" size={14} /> Staff
          </button>
        </div>
      </div>

      <div className="co-tbl-wrap">
        <table className="co-tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role / Title</th>
              <th>Start Date</th>
              <th>Employment</th>
              <th>Pay</th>
              <th>Hrs/wk</th>
              <th style={{ position: "sticky", right: 0, background: "var(--stone-50)", boxShadow: "-1px 0 0 var(--stone-300)", zIndex: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <StaffTableRow
                key={member.id}
                member={member}
                detailSaved={!!memberDetails[member.id]}
                onChange={updateMember}
                onDetails={() => setSlideoutId(member.id)}
              />
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", font: "400 14px/1.5 Inter", color: "var(--stone-500)" }}>
            No staff members yet.
          </div>
        )}
        <div style={{ padding: "4px 16px 16px" }}>
          <button className="co-add-row" onClick={addMemberInline}>
            <Icon name="plus" size={14} /> Add another staff member
          </button>
        </div>
      </div>

      {slideoutMember && (
        <StaffDetailsSlideout
          member={slideoutMember}
          benefits={benefits}
          overrides={memberDetails[slideoutMember.id]}
          onSave={(details) => setMemberDetails(prev => ({ ...prev, [slideoutId]: details }))}
          onRemove={() => removeMember(slideoutId)}
          onClose={() => setSlideoutId(null)}
        />
      )}

      {showAddSlideout && (
        <AddStaffSlideout
          nextId={nextId}
          onAdd={addMemberFromSlideout}
          onClose={() => setShowAddSlideout(false)}
        />
      )}

      {showBenefitsEdit && (
        <BenefitsEditModal benefits={benefits} onClose={() => setShowBenefitsEdit(false)} />
      )}
    </>
  );
};

// ─── Payroll Tab ──────────────────────────────────────────────────────────────

const PayrollTabView = ({ staff }) => {
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const total = staff.reduce((sum, s) => {
    const base = parseFloat((s.salary || "").replace(/[^0-9.]/g, "")) || 0;
    return sum + (s.salaryType === "hourly" ? base * (parseFloat(s.hours) || 40) * 52 : base);
  }, 0);
  return (
    <div className="co-card">
      <h2 style={{ font: "700 18px/1 Inter", margin: "10px 0 20px", paddingTop: 10 }}>Payroll Information</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px 32px" }}>
        <div><div className="co-deal__label">Pay Frequency</div><div className="co-deal__value">Bi-weekly</div></div>
        <div><div className="co-deal__label">Payroll Provider</div><div className="co-deal__value">ADP</div></div>
        <div><div className="co-deal__label">Total Annual Payroll</div><div className="co-deal__value" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>{fmt(total)}</div></div>
        <div><div className="co-deal__label">Staff Count</div><div className="co-deal__value">{staff.length} employees</div></div>
      </div>
    </div>
  );
};

// ─── Benefits Full Tab ────────────────────────────────────────────────────────

const BenefitsTabView = ({ benefits, onEdit }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingTop: 10, paddingBottom: 10 }}>
      <h2 style={{ font: "700 18px/1 Inter", margin: 0 }}>Insurance</h2>
      <button className="co-btn co-btn--ghost" onClick={onEdit}><Icon name="edit" size={14} /> Edit Benefits</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32, alignItems: "start" }}>
      {benefits.insurance.map(b => (
        <div key={b.key} className="co-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Icon name="checkCircle" size={16} style={{ color: "var(--teal-brand)" }} />
            <div style={{ font: "600 15px/1 Inter" }}>{b.name}</div>
          </div>
          {b.ownerCovered && (
            <div style={{ font: "500 12px/1 Inter", color: "var(--teal-brand)", marginBottom: 8 }}>Owner covered under group plan</div>
          )}
          <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)", marginBottom: 12 }}>
            <div>Provider: {b.provider}</div>
            {b.plan && <div>Plans: {b.plan}</div>}
            {b.enrolled && <div>Enrolled: {b.enrolled} employees</div>}
          </div>
          <div style={{ borderTop: "1px solid var(--stone-100)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ font: "500 13px/1 Inter", color: "var(--stone-900)" }}>
              Company: <span style={{ fontWeight: 600 }}>{fmtContrib(b.company)}</span>
            </div>
            {b.employee && (
              <div style={{ font: "500 13px/1 Inter", color: "var(--stone-700)" }}>
                Employee: <span style={{ fontWeight: 600 }}>{fmtContrib(b.employee)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    <h2 style={{ font: "700 18px/1 Inter", margin: "0 0 20px" }}>Retirement & Other Benefits</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      {benefits.other.map(b => (
        <div key={b.key} className="co-card" style={{ padding: 20 }}>
          <div style={{ font: "600 15px/1 Inter", marginBottom: 10 }}>{b.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ font: "500 13px/1 Inter", color: "var(--stone-900)" }}>
              Company: <span style={{ fontWeight: 600 }}>{fmtContrib(b.company)}</span>
            </div>
            {b.employee && (
              <div style={{ font: "500 13px/1 Inter", color: "var(--stone-700)" }}>
                Employee: <span style={{ fontWeight: 600 }}>{fmtContrib(b.employee)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Team Section Root ────────────────────────────────────────────────────────

const TeamSection = () => {
  const TABS = ["Owners", "Doctors", "Staff", "Consultants", "Payroll", "Benefits"];
  const [activeTab, setActiveTab] = React.useState("staff");
  const [staff, setStaff] = React.useState(STAFF_SEED);
  const [doctors, setDoctors] = React.useState(DOCTORS_SEED);
  const [benefits] = React.useState(TEAM_BENEFITS_SEED);
  const [memberDetails, setMemberDetails] = React.useState({});
  const [showBenefitsEdit, setShowBenefitsEdit] = React.useState(false);

  return (
    <div>
      <div className="co-team-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`co-team-tab ${activeTab === t.toLowerCase() ? "is-active" : ""}`}
            onClick={() => setActiveTab(t.toLowerCase())}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "staff" && (
        <StaffTab
          benefits={benefits}
          staff={staff}
          setStaff={setStaff}
          memberDetails={memberDetails}
          setMemberDetails={setMemberDetails}
        />
      )}

      {activeTab === "doctors" && (
        <DoctorsTab doctors={doctors} setDoctors={setDoctors} />
      )}

      {(activeTab === "owners" || activeTab === "consultants") && (
        <div className="co-coming-soon">
          <div className="co-coming-soon__icon" style={{ marginTop: 10 }}><Icon name="users" size={22} /></div>
          <h3>{TABS.find(t => t.toLowerCase() === activeTab)} — coming soon</h3>
          <p>This tab will follow the same flow once the Staff tab is finalized.</p>
        </div>
      )}

      {activeTab === "payroll" && <PayrollTabView staff={staff} />}

      {activeTab === "benefits" && (
        <>
          <BenefitsTabView benefits={benefits} onEdit={() => setShowBenefitsEdit(true)} />
          {showBenefitsEdit && (
            <BenefitsEditModal benefits={benefits} onClose={() => setShowBenefitsEdit(false)} />
          )}
        </>
      )}
    </div>
  );
};

Object.assign(window, { TeamSection });
