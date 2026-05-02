// Team section — Owners | Doctors | Staff | Consultants | Payroll | Benefits

// ─── Seed data ───────────────────────────────────────────────────────────────

// Benefit categories: ordered list with predefined slots.
// Categories with `customOnly: true` have no predefined slots — admin adds custom benefits only.
const BENEFIT_CATEGORIES = [
  {
    key: "insurance",
    name: "Insurance",
    icon: "checkCircle",
    hasInsuranceFields: true,
    definitions: [
      { key: "health",        name: "Health Insurance",        description: "Medical coverage for employees and dependents." },
      { key: "dental",        name: "Dental Insurance",        description: "Routine and major dental coverage." },
      { key: "vision",        name: "Vision Insurance",        description: "Eye exams, frames, lenses, contacts." },
      { key: "disability",    name: "Disability Insurance",    description: "Short- and long-term disability coverage." },
      { key: "life",          name: "Life Insurance",          description: "Term life policy for employees." },
      { key: "supplemental",  name: "Supplemental Insurance",  description: "Critical illness, hospital indemnity, or other supplemental policies." },
      { key: "accident",      name: "Accident Policy",         description: "Coverage for accidental injuries — out-of-pocket costs, ER visits, etc." },
    ],
  },
  {
    key: "retirement",
    name: "Retirement & Financial Benefits",
    icon: "dollarSign",
    definitions: [
      { key: "retirement",        name: "401(k) Plan",         description: "Employer-sponsored retirement plan with company match." },
      { key: "financialPlanning", name: "Financial Planning",  description: "Access to financial advisors, planning tools, or stipends." },
    ],
  },
  {
    key: "wellness",
    name: "Wellness & Lifestyle Benefits",
    icon: "activity",
    definitions: [
      { key: "ce",           name: "Continuing Education", description: "CE credits, conferences, courses, certifications." },
      { key: "gym",          name: "Gym & Fitness",        description: "Gym memberships, fitness stipend, or digital fitness subscription." },
      { key: "mentalHealth", name: "Mental Health",        description: "Therapy stipend or mental health app subscription (separate from health insurance)." },
    ],
  },
  {
    key: "other",
    name: "Other Benefits",
    icon: "folder",
    customOnly: true,
    definitions: [],
  },
];

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
  retirement: [
    { key: "retirement", name: "401(k) Plan",          provider: "Fidelity",
      company:  { amount: "3",    cadence: "salary", unit: "percent" },
      employee: { amount: "6",    cadence: "salary", unit: "percent" } },
  ],
  wellness: [
    { key: "ce",         name: "Continuing Education", provider: null,
      company:  { amount: "500",  cadence: "year",   unit: "dollar"  },
      employee: null },
  ],
  other: [
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
    startDate: "2015-03-02",
    employment: "full",
    compensation: "180000",
    compensationType: "annual",
    avgHoursPerWeek: "",
    scheduleDetails: "",
    worksOtherPractices: false,
    otherPracticesDetails: "",
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
    personal: {},
    notes: "",
    notesUpdatedAt: null,
    notesUpdatedBy: null,
    documents: [],
    performance: {
      ttm: {
        appointments: 1247,
        procedures: 1362,
        production: 484250,
        avgRevPerApt: 388,
        fillRate: 0.92,
        byCategory: [
          { name: "Surgery",      procedures: 164, avgCharge: 1100, totalRevenue: 180400 },
          { name: "Dental",       procedures: 98,  avgCharge: 420,  totalRevenue: 41160  },
          { name: "Lab",          procedures: 247, avgCharge: 120,  totalRevenue: 29640  },
          { name: "Exam",         procedures: 385, avgCharge: 75,   totalRevenue: 28875  },
          { name: "Boarding",     procedures: 89,  avgCharge: 180,  totalRevenue: 16020  },
          { name: "Vaccinations", procedures: 312, avgCharge: 45,   totalRevenue: 14040  },
        ],
      },
    },
  },
  {
    id: 2,
    name: "Dr. James Chen",
    role: "Associate Veterinarian — Internal Medicine",
    age: "35",
    yearsExperience: "9",
    startDate: "2018-08-13",
    employment: "part",
    compensation: "130000",
    compensationType: "annual",
    avgHoursPerWeek: "28",
    scheduleDetails: "Tue/Wed/Thu 8am–6pm; on-call rotation every other weekend.",
    worksOtherPractices: true,
    otherPracticesDetails: "Mondays at Bluebonnet Animal Specialty Group (Internal Medicine consults).",
    specialty: "Small Animals, Internal Medicine",
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
    personal: {},
    notes: "",
    notesUpdatedAt: null,
    notesUpdatedBy: null,
    documents: [],
    performance: {
      ttm: {
        appointments: 892,
        procedures: 745,
        production: 312800,
        avgRevPerApt: 350,
        fillRate: 0.86,
        byCategory: [
          { name: "Specialty Consults", procedures: 89,  avgCharge: 850, totalRevenue: 75650 },
          { name: "Lab",                procedures: 421, avgCharge: 145, totalRevenue: 61045 },
          { name: "Imaging",            procedures: 156, avgCharge: 320, totalRevenue: 49920 },
          { name: "Exam",               procedures: 280, avgCharge: 75,  totalRevenue: 21000 },
          { name: "Vaccinations",       procedures: 198, avgCharge: 45,  totalRevenue:  8910 },
          { name: "Other",              procedures: 145, avgCharge: 105, totalRevenue: 15225 },
        ],
      },
    },
  },
];

const STAFF_SEED = [
  { id: 1,  firstName: "Ashley",   lastName: "Williams",  role: "Veterinary Technician",       status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "47000",   hours: "40", licensed: true,  workLocation: "Main Clinic",  workEmail: "ashley@animalcare.example",   supervisorId: 4 },
  { id: 2,  firstName: "Brian",    lastName: "O'Connor",  role: "Kennel Supervisor",           status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "44000",   hours: "40", licensed: false, workLocation: "Main Clinic",  workEmail: "brian@animalcare.example",    supervisorId: 4 },
  { id: 3,  firstName: "David",    lastName: "Kim",       role: "Client Services Coordinator", status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "42000",   hours: "40", licensed: false, workLocation: "Main Clinic",  workEmail: "david@animalcare.example",    supervisorId: 4 },
  { id: 4,  firstName: "Jennifer", lastName: "Martinez",  role: "Practice Manager",            status: "active", type: "full", employeeClass: "exempt-salary",     salaryType: "annual", salary: "72000",   hours: "40", licensed: false, workLocation: "Main Clinic",  workEmail: "jennifer@animalcare.example", supervisorId: null },
  { id: 5,  firstName: "Kevin",    lastName: "Zhang",     role: "Inventory & Supply Manager",  status: "active", type: "part", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "48000",   hours: "35", licensed: false, workLocation: "Main Clinic",  workEmail: "kevin@animalcare.example",    supervisorId: 4 },
  { id: 6,  firstName: "Lisa",     lastName: "Anderson",  role: "Veterinary Assistant",        status: "active", type: "part", employeeClass: "non-exempt-hourly", salaryType: "hourly", salary: "22.50",   hours: "35", licensed: false, workLocation: "Main Clinic",  workEmail: "lisa@animalcare.example",     supervisorId: 8 },
  { id: 7,  firstName: "Marcus",   lastName: "Johnson",   role: "Veterinary Assistant",        status: "active", type: "part", employeeClass: "non-exempt-hourly", salaryType: "hourly", salary: "21.00",   hours: "32", licensed: false, workLocation: "Main Clinic",  workEmail: "marcus@animalcare.example",   supervisorId: 8 },
  { id: 8,  firstName: "Michael",  lastName: "Thompson",  role: "Lead Veterinary Technician",  status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "54000",   hours: "40", licensed: true,  workLocation: "Main Clinic",  workEmail: "michael@animalcare.example",  supervisorId: 4 },
  { id: 9,  firstName: "Natalie",  lastName: "Cruz",      role: "Veterinary Assistant",        status: "inactive", type: "part", employeeClass: "non-exempt-hourly", salaryType: "hourly", salary: "20.00", hours: "30", licensed: false, workLocation: "Main Clinic",  workEmail: "natalie@animalcare.example",  supervisorId: 8 },
  { id: 10, firstName: "Rachel",   lastName: "Foster",    role: "Veterinary Technician",       status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "46000",   hours: "40", licensed: true,  workLocation: "Main Clinic",  workEmail: "rachel@animalcare.example",   supervisorId: 4 },
  { id: 11, firstName: "Sofia",    lastName: "Patel",     role: "Receptionist",                status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "40000",   hours: "40", licensed: false, workLocation: "Main Clinic",  workEmail: "sofia@animalcare.example",    supervisorId: 4 },
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

// Strip everything except digits and at most one decimal, with up to 2 decimal places.
const cleanNumberInput = (s) => {
  if (s == null) return "";
  const cleaned = String(s).replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length === 1) return parts[0];
  const dec = parts.slice(1).join("").slice(0, 2);
  return parts[0] + "." + dec;
};

// Format a numeric string for display: add commas, preserve user-typed decimals.
const formatNumberDisplay = (s) => {
  if (s == null || s === "") return "";
  const cleaned = cleanNumberInput(s);
  if (cleaned === "") return "";
  const [intPart, decPart] = cleaned.split(".");
  const withCommas = (intPart || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart != null ? `${withCommas}.${decPart}` : withCommas;
};

const fullName = (m) => [m.firstName, m.lastName].filter(Boolean).join(" ") || "—";

const fmtPay = (member) => {
  if (!member.salary) return "—";
  const n = parseFloat(String(member.salary).replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return "—";
  if (member.salaryType === "hourly") return `$${formatNumberDisplay(n.toFixed(2))}/Hour`;
  return `$${formatNumberDisplay(String(n))}/Year`;
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

// ─── Single Benefit Edit / Add Modal ─────────────────────────────────────────

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `b-${Date.now()}`;

const BenefitEditModal = ({ category, definition, existing, mode, onSave, onClose }) => {
  // mode: "add" | "edit"
  // definition: predefined slot meta (or null for custom)
  // existing: existing benefit row (or null on add)
  const isCustom = !definition;
  const showInsuranceFields = category.hasInsuranceFields;

  const [name, setName] = React.useState(existing?.name || definition?.name || "");
  const [provider, setProvider] = React.useState(existing?.provider || "");
  const [plan, setPlan] = React.useState(existing?.plan || "");
  const [enrolled, setEnrolled] = React.useState(existing?.enrolled ? String(existing.enrolled) : "");
  const [ownerCovered, setOwnerCovered] = React.useState(!!existing?.ownerCovered);
  const [company, setCompany] = React.useState(existing?.company || { amount: "", cadence: "month", unit: "dollar" });
  const [hasEmployee, setHasEmployee] = React.useState(!!existing?.employee);
  const [employee, setEmployee] = React.useState(existing?.employee || { amount: "", cadence: "month", unit: "dollar" });

  const titleLabel = mode === "add" ? "Add Benefit" : "Edit Benefit";

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const key = existing?.key || definition?.key || slugify(trimmedName);
    const next = {
      key,
      name: trimmedName,
      provider: provider.trim() || null,
      company: { ...company },
      employee: hasEmployee ? { ...employee } : null,
    };
    if (showInsuranceFields) {
      if (plan.trim()) next.plan = plan.trim();
      const enrolledN = parseInt(enrolled, 10);
      if (!isNaN(enrolledN)) next.enrolled = enrolledN;
      if (ownerCovered) next.ownerCovered = true;
    }
    onSave(next);
    onClose();
  };

  return (
    <Modal title={`${titleLabel} — ${category.name}`} onClose={onClose} footer={<>
      <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
      <button className="co-btn co-btn--primary" onClick={handleSave}>{mode === "add" ? "Add Benefit" : "Save Benefit"}</button>
    </>}>
      {definition?.description && (
        <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 16px" }}>
          {definition.description}
        </p>
      )}

      <div className="co-field" style={{ margin: "0 0 12px" }}>
        <label>Benefit Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          readOnly={!isCustom}
          style={!isCustom ? { background: "var(--stone-50)", color: "var(--stone-700)" } : undefined}
          placeholder={isCustom ? "e.g. Commuter Stipend" : ""}
        />
      </div>

      <div className="co-field" style={{ margin: "0 0 12px" }}>
        <label>Provider <span style={{ color: "var(--stone-500)", fontWeight: 400 }}>(optional)</span></label>
        <input
          value={provider}
          onChange={e => setProvider(e.target.value)}
          placeholder="e.g. Blue Cross Blue Shield"
        />
      </div>

      {showInsuranceFields && (
        <>
          <div className="co-field" style={{ margin: "0 0 12px" }}>
            <label>Plans <span style={{ color: "var(--stone-500)", fontWeight: 400 }}>(optional)</span></label>
            <input value={plan} onChange={e => setPlan(e.target.value)} placeholder="e.g. PPO, HMO" />
          </div>
          <div className="co-field" style={{ margin: "0 0 12px" }}>
            <label>Enrolled <span style={{ color: "var(--stone-500)", fontWeight: 400 }}>(optional)</span></label>
            <input value={enrolled} onChange={e => setEnrolled(e.target.value)} placeholder="Number of employees" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, font: "400 14px/1.4 Inter", color: "var(--stone-700)", margin: "0 0 16px", cursor: "pointer" }}>
            <input type="checkbox" checked={ownerCovered} onChange={e => setOwnerCovered(e.target.checked)} />
            Owner covered under group plan
          </label>
        </>
      )}

      <div style={{ borderTop: "1px solid var(--stone-100)", paddingTop: 14, marginTop: 4 }}>
        <div style={{ font: "600 14px/1 Inter", marginBottom: 4, color: "var(--stone-900)" }}>Contributions</div>
        <ContribEditor
          label="Company"
          contrib={company}
          onChange={v => setCompany(v)}
        />
        {hasEmployee ? (
          <>
            <ContribEditor
              label="Employee"
              contrib={employee}
              onChange={v => setEmployee(v)}
            />
            <button
              className="co-btn co-btn--ghost"
              style={{ marginTop: 10, padding: "4px 8px", font: "400 13px/1 Inter" }}
              onClick={() => setHasEmployee(false)}
            >
              <Icon name="x" size={12} /> Remove employee contribution
            </button>
          </>
        ) : (
          <button
            className="co-btn co-btn--ghost"
            style={{ marginTop: 10, padding: "4px 8px", font: "400 13px/1 Inter" }}
            onClick={() => setHasEmployee(true)}
          >
            <Icon name="plus" size={12} /> Add employee contribution
          </button>
        )}
      </div>
    </Modal>
  );
};

// ─── Staff Details Slideout ───────────────────────────────────────────────────

const fmtRelativeOrDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
};

const formStackStyle = { display: "flex", flexDirection: "column", gap: 14 };
const fieldLabelStyle = { font: "500 13px/1 Inter", color: "var(--stone-700)", marginBottom: 6, display: "block" };
const fieldInputStyle = { width: "100%", height: 36, padding: "0 10px", border: "1px solid var(--stone-200)", borderRadius: 6, font: "400 14px/1 Inter", color: "var(--stone-900)", background: "#fff", outline: "none", boxSizing: "border-box" };

const Field = ({ label, children }) => (
  <div>
    <label style={fieldLabelStyle}>{label}</label>
    {children}
  </div>
);

const StaffDetailsSlideout = ({ member, allStaff, benefits, overrides, onUpdateMember, onSave, onRemove, onClose }) => {
  const [activeTab, setActiveTab] = React.useState("employment");
  const [disabled, setDisabled] = React.useState(new Set(overrides?.disabled || []));

  // Notes — preserved from prior overrides; show last-updated meta when set
  const [notes, setNotes] = React.useState(overrides?.notes || "");
  const [notesUpdatedAt, setNotesUpdatedAt] = React.useState(overrides?.notesUpdatedAt || null);
  const [notesUpdatedBy, setNotesUpdatedBy] = React.useState(overrides?.notesUpdatedBy || null);
  const [notesDirty, setNotesDirty] = React.useState(false);

  const allBenefitsFlat = BENEFIT_CATEGORIES.flatMap(c => benefits[c.key] || []);
  const initOverrides = () => {
    const saved = overrides?.benefitOverrides || {};
    const result = {};
    allBenefitsFlat.forEach(b => {
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

  const updateField = (field, value) =>
    onUpdateMember({ ...member, [field]: value });

  const handleSave = () => {
    let nextNotesAt = notesUpdatedAt;
    let nextNotesBy = notesUpdatedBy;
    if (notesDirty) {
      nextNotesAt = new Date().toISOString();
      nextNotesBy = "Admin";
    }
    onSave({
      disabled: [...disabled],
      notes,
      notesUpdatedAt: nextNotesAt,
      notesUpdatedBy: nextNotesBy,
      benefitOverrides,
      documents,
    });
    onClose();
  };

  const BenefitRow = ({ b }) => {
    const isDisabled = disabled.has(b.key);
    const ov = benefitOverrides[b.key] || {};

    return (
      <div className="co-benefit-row" style={{ opacity: isDisabled ? 0.45 : 1, alignItems: "flex-start" }}>
        <input type="checkbox" className="co-benefit-row__check" style={{ marginTop: 3 }} checked={!isDisabled} onChange={() => toggle(b.key)} />
        <div className="co-benefit-row__info" style={{ flex: 1 }}>
          <div className="co-benefit-row__name">{b.name}</div>
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

  const [documents, setDocuments] = React.useState(overrides?.documents || []);
  const fileInputRef = React.useRef(null);

  const DOCUMENT_TYPES = [
    "Offer Letter",
    "Employment Agreement",
    "I-9 Form",
    "W-4 Form",
    "Direct Deposit Form",
    "Background Check",
    "Non-disclosure Agreement",
    "Non-compete Agreement",
    "Emergency Contact Form",
    "Other",
  ];

  const inferDocType = (filename) => {
    const f = (filename || "").toLowerCase();
    if (f.includes("offer")) return "Offer Letter";
    if (f.includes("i-9") || f.includes("i9")) return "I-9 Form";
    if (f.includes("w-4") || f.includes("w4")) return "W-4 Form";
    if (f.includes("direct") || f.includes("deposit")) return "Direct Deposit Form";
    if (f.includes("nda") || f.includes("non-disc")) return "Non-disclosure Agreement";
    if (f.includes("noncompete") || f.includes("non-compete")) return "Non-compete Agreement";
    if (f.includes("background")) return "Background Check";
    if (f.includes("emergency")) return "Emergency Contact Form";
    return "Other";
  };

  const handleFiles = (files) => {
    const newDocs = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      type: inferDocType(file.name),
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Admin",
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const updateDocType = (id, type) =>
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, type } : d));
  const removeDoc = (id) =>
    setDocuments(prev => prev.filter(d => d.id !== id));

  const fmtFileSize = (b) => {
    if (b == null) return "";
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const notesCount = (notes || "").trim() ? 1 : 0;

  const TABS = [
    { key: "employment", label: "Employment" },
    { key: "benefits",   label: "Benefits"   },
    { key: "personal",   label: "Personal"   },
    { key: "documents",  label: documents.length > 0 ? `Documents (${documents.length})` : "Documents" },
    { key: "notes",      label: notesCount > 0 ? `Notes (${notesCount})` : "Notes" },
  ];

  const supervisorOptions = (allStaff || []).filter(s => s.id !== member.id);

  const employmentBody = (
    <div style={formStackStyle}>
      <Field label="Title / Role">
        <input style={fieldInputStyle} value={member.role || ""} onChange={e => updateField("role", e.target.value)} placeholder="e.g. Veterinary Technician" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Licensed">
          <select style={fieldInputStyle} value={member.licensed ? "yes" : "no"} onChange={e => updateField("licensed", e.target.value === "yes")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>
        <Field label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Status <span className="co-tip" data-tip="Inactive = not expected to work within 3 months" data-tip-wrap="" tabIndex={0} style={{ color: "var(--stone-400)" }}><Icon name="info" size={12} /></span></span>}>
          <div style={{ display: "flex", height: 36, alignItems: "center" }}>
            <StatusToggle status={member.status || "active"} onChange={(v) => updateField("status", v)} />
          </div>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Employee Class">
          <select style={fieldInputStyle} value={member.employeeClass || "non-exempt-hourly"} onChange={e => updateField("employeeClass", e.target.value)}>
            <option value="exempt-salary">Exempt — Salary</option>
            <option value="non-exempt-salary">Non-exempt — Salary</option>
            <option value="non-exempt-hourly">Non-exempt — Hourly</option>
          </select>
        </Field>
        <Field label="Salary / Hourly Rate">
          <PayCellEditor member={member} onChange={onUpdateMember} />
        </Field>
      </div>

      <Field label="Work Location">
        <input style={fieldInputStyle} value={member.workLocation || ""} onChange={e => updateField("workLocation", e.target.value)} placeholder="e.g. Main Clinic" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Average Hours per Week">
          <input style={fieldInputStyle} value={member.hours || ""} onChange={e => updateField("hours", e.target.value.replace(/[^\d.]/g, ""))} placeholder="40" />
        </Field>
        <Field label="Employment Type">
          <select style={fieldInputStyle} value={member.type} onChange={e => updateField("type", e.target.value)}>
            <option value="full">Full-time</option>
            <option value="part">Part-time</option>
          </select>
        </Field>
      </div>

      <Field label="Supervisor / Manager">
        <select
          style={fieldInputStyle}
          value={member.supervisorId == null ? "" : String(member.supervisorId)}
          onChange={e => updateField("supervisorId", e.target.value === "" ? null : Number(e.target.value))}
        >
          <option value="">— None —</option>
          {supervisorOptions.map(s => (
            <option key={s.id} value={s.id}>{fullName(s)}{s.role ? ` — ${s.role}` : ""}</option>
          ))}
        </select>
      </Field>

      <Field label="Work Email">
        <input type="email" style={fieldInputStyle} value={member.workEmail || ""} onChange={e => updateField("workEmail", e.target.value)} placeholder="name@practice.com" />
      </Field>
    </div>
  );

  const benefitsBody = (
    <div>
      <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", marginBottom: 20, padding: "11px 13px", background: "var(--stone-50)", borderRadius: 8, border: "1px solid var(--stone-200)" }}>
        Benefits are pre-filled from practice defaults. Uncheck any that don't apply, or adjust amounts for this staff member.
      </div>

      {BENEFIT_CATEGORIES.map((cat, idx) => {
        const rows = benefits[cat.key] || [];
        if (rows.length === 0) return null;
        return (
          <React.Fragment key={cat.key}>
            <div style={{ font: "600 14px/1 Inter", margin: idx === 0 ? "0 0 12px" : "20px 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={cat.icon} size={15} style={{ color: "var(--teal-brand)" }} /> {cat.name}
            </div>
            {rows.map(b => <BenefitRow key={b.key} b={b} />)}
          </React.Fragment>
        );
      })}
    </div>
  );

  const personal = member.personal || {};
  const setPersonal = (field, value) =>
    onUpdateMember({ ...member, personal: { ...personal, [field]: value } });

  const personalBody = (
    <div style={formStackStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="First Name">
          <input style={fieldInputStyle} value={member.firstName || ""} onChange={e => updateField("firstName", e.target.value)} placeholder="First name" />
        </Field>
        <Field label="Last Name">
          <input style={fieldInputStyle} value={member.lastName || ""} onChange={e => updateField("lastName", e.target.value)} placeholder="Last name" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Date of Birth">
          <input type="date" style={fieldInputStyle} value={personal.dob || ""} onChange={e => setPersonal("dob", e.target.value)} />
        </Field>
        <Field label="Gender">
          <select style={fieldInputStyle} value={personal.gender || ""} onChange={e => setPersonal("gender", e.target.value)}>
            <option value="">— Select —</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </Field>
      </div>

      <Field label="Home Address">
        <input style={fieldInputStyle} value={personal.address || ""} onChange={e => setPersonal("address", e.target.value)} placeholder="Street address" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
        <Field label="City">
          <input style={fieldInputStyle} value={personal.city || ""} onChange={e => setPersonal("city", e.target.value)} placeholder="City" />
        </Field>
        <Field label="State">
          <input style={fieldInputStyle} value={personal.state || ""} onChange={e => setPersonal("state", e.target.value)} placeholder="TX" />
        </Field>
        <Field label="Zip">
          <input style={fieldInputStyle} value={personal.zip || ""} onChange={e => setPersonal("zip", e.target.value)} placeholder="00000" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Phone Number">
          <input style={fieldInputStyle} value={personal.phone || ""} onChange={e => setPersonal("phone", e.target.value)} placeholder="(555) 123-4567" />
        </Field>
        <Field label="Personal Email">
          <input type="email" style={fieldInputStyle} value={personal.email || ""} onChange={e => setPersonal("email", e.target.value)} placeholder="name@example.com" />
        </Field>
      </div>
    </div>
  );

  const documentsBody = (
    <div>
      <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 16px" }}>
        Upload employment-related documents — typically required after an LOI is signed (e.g. offer letter, I-9, W-4, direct deposit, background check).
      </p>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--teal-brand)"; e.currentTarget.style.background = "var(--teal-tint)"; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.background = "var(--stone-50)"; }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "var(--stone-200)";
          e.currentTarget.style.background = "var(--stone-50)";
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          padding: "20px 24px",
          borderRadius: 10,
          border: "1.5px dashed var(--stone-200)",
          background: "var(--stone-50)",
          textAlign: "center",
          cursor: "pointer",
          transition: "background 120ms, border-color 120ms",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, font: "500 14px/1.4 Inter", color: "var(--stone-700)" }}>
          <Icon name="upload" size={16} style={{ color: "var(--teal-brand)" }} />
          Drag & drop files here, or click to browse
        </div>
        <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 6 }}>
          PDF, DOCX, JPG, PNG — up to 25MB each
        </div>
      </div>

      {documents.length === 0 ? (
        <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", padding: "8px 0" }}>
          No documents uploaded yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {documents.map(doc => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                border: "1px solid var(--stone-200)",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "var(--stone-50)",
                display: "grid", placeItems: "center", color: "var(--teal-brand)", flexShrink: 0,
              }}>
                <Icon name="fileText" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "500 14px/1.3 Inter", color: "var(--stone-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {doc.name}
                </div>
                <div style={{ font: "400 13px/1.3 Inter", color: "var(--stone-500)", marginTop: 2 }}>
                  {fmtFileSize(doc.size)} · Uploaded {fmtRelativeOrDate(doc.uploadedAt)} by {doc.uploadedBy}
                </div>
              </div>
              <select
                value={doc.type}
                onChange={(e) => updateDocType(doc.id, e.target.value)}
                style={{ height: 32, padding: "0 8px", border: "1px solid var(--stone-200)", borderRadius: 6, font: "400 14px/1 Inter", background: "#fff", cursor: "pointer", flexShrink: 0 }}
              >
                {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button
                onClick={() => removeDoc(doc.id)}
                title="Remove"
                style={{ background: "none", border: 0, cursor: "pointer", color: "var(--stone-500)", padding: 6, display: "grid", placeItems: "center", flexShrink: 0 }}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const notesBody = (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ font: "500 13px/1 Inter", color: "var(--stone-700)" }}>Staff Notes</label>
        {(notesUpdatedAt || notesUpdatedBy) && (
          <span style={{ font: "400 13px/1 Inter", color: "var(--stone-500)" }}>
            Last updated {fmtRelativeOrDate(notesUpdatedAt)}{notesUpdatedBy ? ` by ${notesUpdatedBy}` : ""}
          </span>
        )}
      </div>
      <textarea
        style={{ width: "100%", border: "1px solid var(--stone-200)", borderRadius: 8, padding: "10px 12px", font: "400 14px/1.5 Inter", minHeight: 200, resize: "vertical", background: "#fff", outline: "none", boxSizing: "border-box" }}
        value={notes}
        onChange={e => { setNotes(e.target.value); setNotesDirty(true); }}
        placeholder="Add any notes about this staff member…"
      />
      <p style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", margin: "8px 0 0" }}>
        Saved notes show the last-updated time and author when you save details.
      </p>
    </div>
  );

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout">
        <div className="co-slideout__header">
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Support Staff</div>
            <h2 style={{ margin: "0 0 4px" }}>{fullName(member) === "—" ? "New Staff Member" : fullName(member)}</h2>
            <div style={{ font: "400 14px/1 Inter", color: "var(--stone-500)" }}>{member.role || "—"}</div>
          </div>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div style={{ padding: "0 24px", background: "#fff" }}>
          <div className="co-tabs-simple">
            {TABS.map(t => (
              <button
                key={t.key}
                className={activeTab === t.key ? "is-active" : ""}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="co-slideout__body">
          {activeTab === "employment" && employmentBody}
          {activeTab === "benefits" && benefitsBody}
          {activeTab === "personal" && personalBody}
          {activeTab === "documents" && documentsBody}
          {activeTab === "notes" && notesBody}
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
    firstName: "", lastName: "", role: "", status: "active", type: "full",
    employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "", hours: "40",
    licensed: false, workLocation: "", workEmail: "", supervisorId: null,
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const canSave = (form.firstName || "").trim() || (form.lastName || "").trim();

  const save = (openDetails) => {
    if (!canSave) return;
    onAdd({ ...form, id: nextId }, openDetails);
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First Name">
              <input style={fieldInputStyle} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First name" />
            </Field>
            <Field label="Last Name">
              <input style={fieldInputStyle} value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last name" />
            </Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Role / Title">
              <input style={fieldInputStyle} value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Veterinary Technician" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <Field label="Employment Type">
              <select style={fieldInputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="full">Full-time</option>
                <option value="part">Part-time</option>
              </select>
            </Field>
            <Field label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Status <span className="co-tip" data-tip="Inactive = not expected to work within 3 months" data-tip-wrap="" tabIndex={0} style={{ color: "var(--stone-400)" }}><Icon name="info" size={12} /></span></span>}>
              <div style={{ display: "flex", height: 36, alignItems: "center" }}>
                <StatusToggle status={form.status} onChange={(v) => set("status", v)} />
              </div>
            </Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Hours / Week">
              <input style={{ ...fieldInputStyle, width: 100 }} value={form.hours} onChange={e => set("hours", e.target.value.replace(/[^\d.]/g, ""))} placeholder="40" />
            </Field>
          </div>

          <div style={{
            marginTop: 20,
            padding: "14px 16px",
            background: "var(--teal-tint)",
            border: "1px solid #B8D9DC",
            borderRadius: 10,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}>
            <div style={{ color: "var(--teal-brand)", marginTop: 1, flexShrink: 0 }}>
              <Icon name="info" size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: "500 14px/1.4 Inter", color: "var(--stone-900)", marginBottom: 4 }}>
                Add the rest now or finish later
              </div>
              <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)", margin: 0 }}>
                You can <strong>Save & Close</strong> with just these basics, or click <strong>Continue</strong> to fill out pay, benefits, personal info, and documents now. You'll always be able to edit these later from the staff member's profile.
              </p>
            </div>
          </div>
        </div>
        <div className="co-slideout__footer">
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="co-btn co-btn--ghost"
            onClick={() => save(false)}
            disabled={!canSave}
            style={{ opacity: canSave ? 1 : 0.5, cursor: canSave ? "pointer" : "not-allowed" }}
          >
            Save & Close
          </button>
          <button
            className="co-btn co-btn--primary"
            onClick={() => save(true)}
            disabled={!canSave}
            style={{ opacity: canSave ? 1 : 0.5, cursor: canSave ? "pointer" : "not-allowed" }}
          >
            Continue <Icon name="chevronRight" size={13} />
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Pay Cell Editor ──────────────────────────────────────────────────────────

const PayCellEditor = ({ member, onChange, compact = false }) => {
  const [draft, setDraft] = React.useState(formatNumberDisplay(member.salary));
  // Sync if external salary changes (e.g. switching member)
  React.useEffect(() => {
    setDraft(formatNumberDisplay(member.salary));
  }, [member.salary, member.salaryType]);

  const cellHeight = compact ? 32 : 36;
  return (
    <div style={{
      display: "flex", alignItems: "center", height: cellHeight,
      border: "1px solid var(--stone-200)", borderRadius: 6, background: "#fff",
      paddingLeft: 8, gap: 0, minWidth: compact ? 140 : 0,
    }}>
      <span style={{ font: "400 14px/1 Inter", color: "var(--stone-500)", flexShrink: 0 }}>$</span>
      <input
        style={{ border: 0, outline: 0, padding: "0 6px", font: "400 14px/1 Inter", width: compact ? 88 : "100%", minWidth: 60, background: "transparent" }}
        value={draft}
        onChange={e => {
          const cleaned = cleanNumberInput(e.target.value);
          setDraft(formatNumberDisplay(cleaned));
          onChange({ ...member, salary: cleaned });
        }}
        placeholder={member.salaryType === "hourly" ? "0.00" : "0"}
      />
      <span style={{ color: "var(--stone-500)", padding: "0 2px", flexShrink: 0 }}>/</span>
      <select
        style={{ border: 0, outline: 0, padding: "0 6px", background: "transparent", cursor: "pointer", font: "500 14px/1 Inter", color: "var(--stone-900)", flexShrink: 0 }}
        value={member.salaryType}
        onChange={e => onChange({ ...member, salaryType: e.target.value })}
      >
        <option value="annual">Year</option>
        <option value="hourly">Hour</option>
      </select>
    </div>
  );
};

// ─── Status Toggle ────────────────────────────────────────────────────────────

const StatusBadge = ({ status, onChange, compact = false }) => {
  const isActive = status !== "inactive";
  const interactive = !!onChange;
  const Component = interactive ? "button" : "span";
  return (
    <Component
      type={interactive ? "button" : undefined}
      onClick={interactive ? () => onChange(isActive ? "inactive" : "active") : undefined}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "0 10px",
        height: compact ? 26 : 30,
        border: interactive ? "1px solid var(--stone-200)" : "1px solid transparent",
        borderRadius: 999,
        background: isActive ? "#DCFCE7" : "var(--stone-100)",
        color: isActive ? "#15803D" : "var(--stone-500)",
        font: "500 13px/1 Inter",
        cursor: interactive ? "pointer" : "default",
        whiteSpace: "nowrap",
      }}
      title={interactive ? `Click to mark as ${isActive ? "Inactive" : "Active"}` : undefined}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#16A34A" : "var(--stone-500)", flexShrink: 0 }} />
      {isActive ? "Active" : "Inactive"}
    </Component>
  );
};

// Backward-compat alias (a few call sites still reference StatusToggle)
const StatusToggle = StatusBadge;

// ─── Editable Cell helper ─────────────────────────────────────────────────────

const EditCell = ({ isEditing, onStart, onExit, readView, editView, minWidth }) => (
  <td
    onClick={!isEditing ? onStart : undefined}
    style={{ minWidth }}
  >
    {isEditing ? (
      <div
        className="co-tbl-cell co-tbl-cell--editing"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) onExit();
        }}
      >
        {editView}
      </div>
    ) : (
      <div className="co-tbl-cell">
        {readView}
      </div>
    )}
  </td>
);

// ─── Staff Table Row ──────────────────────────────────────────────────────────

const READ_PLACEHOLDER = (text) => (
  <span className="co-tbl-cell--placeholder">{text}</span>
);

const StaffTableRow = ({ member, detailSaved, onChange, onDetails, editingColumn, onStartEdit, onExitEdit }) => {
  const isEditing = (col) => editingColumn === col;
  const start = (col) => onStartEdit(member.id, col);
  const exit = onExitEdit;

  const employmentLabel = member.type === "full" ? "Full-time" : "Part-time";

  return (
    <tr>
      <EditCell
        minWidth={130}
        isEditing={isEditing("firstName")}
        onStart={() => start("firstName")}
        onExit={exit}
        readView={member.firstName || READ_PLACEHOLDER("First name")}
        editView={
          <input
            className="co-tbl-input"
            autoFocus
            value={member.firstName || ""}
            onChange={e => onChange({ ...member, firstName: e.target.value })}
            placeholder="First name"
          />
        }
      />
      <EditCell
        minWidth={130}
        isEditing={isEditing("lastName")}
        onStart={() => start("lastName")}
        onExit={exit}
        readView={member.lastName || READ_PLACEHOLDER("Last name")}
        editView={
          <input
            className="co-tbl-input"
            autoFocus
            value={member.lastName || ""}
            onChange={e => onChange({ ...member, lastName: e.target.value })}
            placeholder="Last name"
          />
        }
      />
      <EditCell
        minWidth={200}
        isEditing={isEditing("role")}
        onStart={() => start("role")}
        onExit={exit}
        readView={member.role || READ_PLACEHOLDER("Role / Title")}
        editView={
          <input
            className="co-tbl-input"
            autoFocus
            value={member.role || ""}
            onChange={e => onChange({ ...member, role: e.target.value })}
            placeholder="Role / Title"
          />
        }
      />
      <EditCell
        isEditing={isEditing("status")}
        onStart={() => start("status")}
        onExit={exit}
        readView={<StatusBadge status={member.status || "active"} compact />}
        editView={
          <select
            className="co-tbl-select"
            autoFocus
            value={member.status || "active"}
            onChange={e => { onChange({ ...member, status: e.target.value }); exit(); }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        }
      />
      <EditCell
        isEditing={isEditing("type")}
        onStart={() => start("type")}
        onExit={exit}
        readView={employmentLabel}
        editView={
          <select
            className="co-tbl-select"
            autoFocus
            value={member.type}
            onChange={e => { onChange({ ...member, type: e.target.value }); exit(); }}
          >
            <option value="full">Full-time</option>
            <option value="part">Part-time</option>
          </select>
        }
      />
      <EditCell
        isEditing={isEditing("pay")}
        onStart={() => start("pay")}
        onExit={exit}
        readView={member.salary ? fmtPay(member) : READ_PLACEHOLDER("—")}
        editView={<PayCellEditor member={member} onChange={onChange} compact />}
      />
      <EditCell
        isEditing={isEditing("hours")}
        onStart={() => start("hours")}
        onExit={exit}
        readView={member.hours || READ_PLACEHOLDER("—")}
        editView={
          <input
            className="co-tbl-input"
            autoFocus
            style={{ width: 52, textAlign: "center" }}
            value={member.hours}
            onChange={e => onChange({ ...member, hours: e.target.value.replace(/[^\d.]/g, "") })}
            placeholder="40"
          />
        }
      />
      <td className="co-sticky-col">
        <div className="co-tbl-cell" style={{ padding: "0 12px", cursor: "default" }}>
          <button className="co-more-details" onClick={onDetails}>
            Details
            {detailSaved && <span style={{ font: "400 11px/1 Inter", color: "var(--stone-400)", marginLeft: 2 }}>· saved</span>}
            <Icon name="chevronRight" size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

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

const initialsOf = (name) => {
  if (!name) return "Dr";
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(/\s+/)
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const DoctorCompactCard = ({ doctor, onView }) => {
  const empLabel = doctor.employment === "part" ? "Part-time" : "Full-time";
  return (
    <button
      onClick={onView}
      className="co-card"
      style={{
        padding: 20,
        textAlign: "left",
        border: "1px solid var(--stone-200)",
        background: "#fff",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
        transition: "border-color 120ms, box-shadow 120ms, transform 120ms",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal-brand)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(20,83,90,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "var(--teal-tint)", color: "var(--teal-brand)",
          display: "grid", placeItems: "center",
          font: "600 16px/1 Inter", flexShrink: 0,
        }}>
          {initialsOf(doctor.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "600 16px/1.3 Inter", color: "var(--stone-900)" }}>{doctor.name}</div>
          <div style={{ font: "400 14px/1.3 Inter", color: "var(--stone-500)", marginTop: 3 }}>{doctor.role || "—"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", paddingTop: 12, borderTop: "1px solid var(--stone-100)" }}>
        <div>
          <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 4 }}>Employment</div>
          <div style={{ font: "500 14px/1.3 Inter", color: "var(--stone-900)" }}>{empLabel}</div>
        </div>
        <div>
          <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 4 }}>Salary</div>
          <div style={{ font: "500 14px/1.3 Inter", color: "var(--stone-900)" }}>{fmtMoney(doctor.compensation)}{doctor.compensationType === "hourly" ? "/hr" : "/yr"}</div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 4 }}>License</div>
          <div style={{ font: "500 14px/1.3 Inter", color: "var(--stone-900)" }}>{doctor.license || "—"}{doctor.licenseState ? ` · ${doctor.licenseState}` : ""}</div>
        </div>
      </div>
    </button>
  );
};

// ─── Doctor Detail Page (full-page profile with 7 tabs) ─────────────────────

const DOCTOR_TABS = [
  { key: "employment",  label: "Employment" },
  { key: "performance", label: "Performance" },
  { key: "benefits",    label: "Benefits" },
  { key: "history",     label: "History" },
  { key: "personal",    label: "Personal" },
  { key: "documents",   label: "Documents" },
  { key: "notes",       label: "Notes" },
];

// Compact subheader: title + edit/save/cancel actions
const TabHeader = ({ title, isEditing, onEdit, onSave, onCancel, hideEdit, extra }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
    <h2 style={{ font: "700 18px/1.2 Inter", margin: 0, color: "var(--stone-900)" }}>{title}</h2>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {extra}
      {!hideEdit && !isEditing && (
        <button className="co-btn co-btn--ghost" onClick={onEdit}>
          <Icon name="edit" size={13} /> Edit
        </button>
      )}
      {isEditing && (
        <>
          <button className="co-btn co-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={onSave}>Save</button>
        </>
      )}
    </div>
  </div>
);

const ReadField = ({ label, value, valueColor }) => (
  <div>
    <div style={{ font: "500 11px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 6 }}>{label}</div>
    <div style={{ font: "400 14px/1.4 Inter", color: valueColor || "var(--stone-900)" }}>{value || "—"}</div>
  </div>
);

// ─── Doctor: Employment Tab ───────────────────────────────────────────────────

const DoctorEmploymentTab = ({ doctor, onUpdate }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(doctor);
  React.useEffect(() => { if (!editing) setDraft(doctor); }, [doctor, editing]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const startEdit = () => { setDraft(doctor); setEditing(true); };
  const save = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(doctor); setEditing(false); };

  const isPart = (editing ? draft.employment : doctor.employment) === "part";
  const empLabel = doctor.employment === "part" ? "Part-time" : "Full-time";
  const compLabel = `${fmtMoney(doctor.compensation)}${doctor.compensationType === "hourly" ? " / hour" : " / year"}`;

  return (
    <div className="co-card" style={{ padding: 24 }}>
      <TabHeader title="Employment" isEditing={editing} onEdit={startEdit} onSave={save} onCancel={cancel} />

      {!editing ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
          <ReadField label="Compensation" value={compLabel} />
          <ReadField label="Employment Type" value={empLabel} />
          <ReadField label="Start Date" value={doctor.startDate ? fmtDate(doctor.startDate) : null} />
          {isPart && <ReadField label="Avg Hours / Week" value={doctor.avgHoursPerWeek} />}
          <ReadField label="Specialty" value={doctor.specialty} />
          <ReadField label="License" value={`${doctor.license || "—"}${doctor.licenseState ? ` · ${doctor.licenseState}` : ""}`} />
          <ReadField label="Years of Experience" value={doctor.yearsExperience ? `${doctor.yearsExperience} years` : null} />
          {isPart && (
            <div style={{ gridColumn: "1 / -1" }}>
              <ReadField label="Schedule Details" value={doctor.scheduleDetails} />
            </div>
          )}
          <div style={{ gridColumn: "1 / -1", paddingTop: 14, borderTop: "1px solid var(--stone-100)" }}>
            <ReadField
              label="Works at Other Practices"
              value={doctor.worksOtherPractices ? "Yes" : "No"}
              valueColor={doctor.worksOtherPractices ? "var(--stone-900)" : "var(--stone-500)"}
            />
            {doctor.worksOtherPractices && (
              <div style={{ marginTop: 12 }}>
                <ReadField label="Other Practices Details" value={doctor.otherPracticesDetails} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Compensation">
              <PayCellEditor
                member={{ salary: draft.compensation, salaryType: draft.compensationType === "hourly" ? "hourly" : "annual" }}
                onChange={(m) => setDraft(d => ({ ...d, compensation: m.salary, compensationType: m.salaryType === "hourly" ? "hourly" : "annual" }))}
              />
            </Field>
            <Field label="Employment Type">
              <select style={fieldInputStyle} value={draft.employment} onChange={e => set("employment", e.target.value)}>
                <option value="full">Full-time</option>
                <option value="part">Part-time</option>
              </select>
            </Field>
          </div>

          <Field label="Start Date">
            <input type="date" style={{ ...fieldInputStyle, width: 220 }} value={draft.startDate || ""} onChange={e => set("startDate", e.target.value)} />
          </Field>

          {isPart && (
            <>
              <Field label="Avg Hours / Week">
                <input style={{ ...fieldInputStyle, width: 140 }} value={draft.avgHoursPerWeek || ""} onChange={e => set("avgHoursPerWeek", e.target.value.replace(/[^\d.]/g, ""))} placeholder="e.g. 28" />
              </Field>
              <Field label="Schedule Details">
                <textarea
                  style={{ ...fieldInputStyle, height: "auto", minHeight: 80, padding: "10px 12px", lineHeight: 1.5, resize: "vertical" }}
                  value={draft.scheduleDetails || ""}
                  onChange={e => set("scheduleDetails", e.target.value)}
                  placeholder="e.g. Tue/Wed/Thu 8am–6pm; on-call rotation every other weekend."
                />
              </Field>
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Specialty">
              <input style={fieldInputStyle} value={draft.specialty || ""} onChange={e => set("specialty", e.target.value)} placeholder="e.g. Small Animals, Internal Medicine" />
            </Field>
            <Field label="Years of Experience">
              <input style={fieldInputStyle} value={draft.yearsExperience || ""} onChange={e => set("yearsExperience", e.target.value.replace(/[^\d]/g, ""))} placeholder="e.g. 12" />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <Field label="License Number">
              <input style={fieldInputStyle} value={draft.license || ""} onChange={e => set("license", e.target.value)} placeholder="#TX-VET-0000" />
            </Field>
            <Field label="License State">
              <input style={fieldInputStyle} value={draft.licenseState || ""} onChange={e => set("licenseState", e.target.value)} placeholder="Texas" />
            </Field>
          </div>

          <div style={{ paddingTop: 14, borderTop: "1px solid var(--stone-100)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", font: "500 14px/1.4 Inter", color: "var(--stone-900)" }}>
              <input
                type="checkbox"
                checked={!!draft.worksOtherPractices}
                onChange={e => set("worksOtherPractices", e.target.checked)}
              />
              Works at other practices
            </label>
            {draft.worksOtherPractices && (
              <div style={{ marginTop: 12 }}>
                <Field label="Other Practices — Schedule & Details">
                  <textarea
                    style={{ ...fieldInputStyle, height: "auto", minHeight: 80, padding: "10px 12px", lineHeight: 1.5, resize: "vertical" }}
                    value={draft.otherPracticesDetails || ""}
                    onChange={e => set("otherPracticesDetails", e.target.value)}
                    placeholder="e.g. Mondays at Bluebonnet Animal Specialty Group (Internal Medicine consults)."
                  />
                </Field>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Doctor: Performance Tab ──────────────────────────────────────────────────

const DATE_RANGES = [
  { key: "ttm",     label: "Trailing 12 Months" },
  { key: "ytd",     label: "Year to Date" },
  { key: "qtd",     label: "Quarter to Date" },
  { key: "mtd",     label: "Month to Date" },
  { key: "lastQ",   label: "Last Quarter" },
  { key: "lastY",   label: "Last Year" },
];

const fmtCurrency = (n) => {
  if (n == null || isNaN(n)) return "—";
  return `$${Math.round(n).toLocaleString()}`;
};
const fmtCompactCurrency = (n) => {
  if (n == null || isNaN(n)) return "—";
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};
const fmtPct = (n, digits = 0) => {
  if (n == null || isNaN(n)) return "—";
  return `${(n * 100).toFixed(digits)}%`;
};
const fmtNumber = (n) => {
  if (n == null || isNaN(n)) return "—";
  return Math.round(n).toLocaleString();
};

const KPICard = ({ label, value, comparison }) => (
  <div className="co-card" style={{ padding: 18 }}>
    <div style={{ font: "500 12px/1 Inter", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--stone-500)", marginBottom: 10 }}>{label}</div>
    <div style={{ font: "700 24px/1.1 Inter", color: "var(--stone-900)", letterSpacing: "-0.02em", marginBottom: 8 }}>{value}</div>
    {comparison && (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 13px/1 Inter", color: comparison.positive ? "#15803D" : comparison.negative ? "#BE123C" : "var(--stone-500)" }}>
        <Icon name={comparison.positive ? "trendUp" : comparison.negative ? "trendDown" : "activity"} size={12} />
        {comparison.label}
      </div>
    )}
  </div>
);

const RANGE_SCALERS = { ttm: 1.00, ytd: 0.42, qtd: 0.18, mtd: 0.07, lastQ: 0.24, lastY: 1.05 };
const PREVIOUS_PERIOD_SCALER = 0.91; // synthetic: prior period was ~9% lower

const DoctorPerformanceTab = ({ doctor, allDoctors }) => {
  const [range, setRange] = React.useState("ttm");
  const [compareEnabled, setCompareEnabled] = React.useState(true);
  const [compareType, setCompareType] = React.useState("avg"); // "avg" | "doctors" | "previous"
  const [compareDoctorIds, setCompareDoctorIds] = React.useState([]);

  const scaler = RANGE_SCALERS[range] || 1;
  const perf = doctor.performance?.ttm || {};
  const scaled = {
    appointments: Math.round((perf.appointments || 0) * scaler),
    procedures:   Math.round((perf.procedures || 0) * scaler),
    production:   Math.round((perf.production || 0) * scaler),
    avgRevPerApt: perf.avgRevPerApt || 0,
    fillRate:     perf.fillRate || 0,
  };

  const allWithPerf = allDoctors.filter(d => d.performance?.ttm);
  const otherDoctors = allWithPerf.filter(d => d.id !== doctor.id);
  const totalProduction = allWithPerf.reduce((s, d) => s + (d.performance.ttm.production || 0), 0) * scaler;
  const pctOfTotal = totalProduction ? scaled.production / totalProduction : 0;

  // Build comparison stats — depends on compareType
  const computeAvgsFor = (docList, scl) => {
    const n = Math.max(1, docList.length);
    return {
      appointments: docList.reduce((s, d) => s + (d.performance.ttm.appointments || 0), 0) / n * scl,
      procedures:   docList.reduce((s, d) => s + (d.performance.ttm.procedures || 0), 0) / n * scl,
      production:   docList.reduce((s, d) => s + (d.performance.ttm.production || 0), 0) / n * scl,
      avgRevPerApt: docList.reduce((s, d) => s + (d.performance.ttm.avgRevPerApt || 0), 0) / n,
      fillRate:     docList.reduce((s, d) => s + (d.performance.ttm.fillRate || 0), 0) / n,
    };
  };

  let compareValues = null;
  let compareLabel = "";
  if (compareEnabled) {
    if (compareType === "avg") {
      compareValues = computeAvgsFor(allWithPerf, scaler);
      compareLabel = "doctor avg";
    } else if (compareType === "previous") {
      compareValues = {
        appointments: scaled.appointments / scaler * PREVIOUS_PERIOD_SCALER * scaler,
        procedures:   scaled.procedures   / scaler * PREVIOUS_PERIOD_SCALER * scaler,
        production:   scaled.production   / scaler * PREVIOUS_PERIOD_SCALER * scaler,
        avgRevPerApt: scaled.avgRevPerApt * 0.96,
        fillRate:     scaled.fillRate * 0.97,
      };
      compareLabel = "previous period";
    } else if (compareType === "doctors") {
      const selected = otherDoctors.filter(d => compareDoctorIds.includes(d.id));
      if (selected.length > 0) {
        compareValues = computeAvgsFor(selected, scaler);
        compareLabel = selected.length === 1 ? selected[0].name.replace(/^Dr\.\s*/, "Dr. ") : `avg of ${selected.length} doctors`;
      }
    }
  }

  const cmp = (val, target) => {
    if (target == null || !target) return null;
    const pct = (val - target) / target;
    if (Math.abs(pct) < 0.005) return { label: `On par with ${compareLabel}`, positive: false, negative: false };
    return {
      label: `${pct > 0 ? "+" : ""}${(pct * 100).toFixed(0)}% vs ${compareLabel}`,
      positive: pct > 0,
      negative: pct < 0,
    };
  };

  // Service category data — scaled
  const categoryRows = (perf.byCategory || []).map(c => ({
    ...c,
    procedures: Math.round(c.procedures * scaler),
    totalRevenue: Math.round(c.totalRevenue * scaler),
  }));
  const categoryTotal = categoryRows.reduce((s, c) => s + c.totalRevenue, 0);
  const categoryRowsSorted = [...categoryRows].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const maxCategoryRev = Math.max(1, ...categoryRowsSorted.map(c => c.totalRevenue));

  // Distinct teal-leaning palette for the donut/bars
  const PALETTE = ["#14535A", "#1F8794", "#2DAFB8", "#74C9CE", "#A5DCE0", "#D4ECEE"];

  // Donut chart via conic-gradient
  const buildConic = () => {
    let cursor = 0;
    const stops = categoryRowsSorted.map((c, i) => {
      const pct = categoryTotal ? (c.totalRevenue / categoryTotal) * 360 : 0;
      const start = cursor;
      const end = cursor + pct;
      cursor = end;
      const color = PALETTE[i % PALETTE.length];
      return `${color} ${start}deg ${end}deg`;
    });
    return stops.join(", ");
  };
  const conicGradient = buildConic();

  const filterChip = (children) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", border: "1px solid var(--stone-200)", borderRadius: 999, background: "#fff", font: "500 13px/1 Inter", color: "var(--stone-700)" }}>
      {children}
    </div>
  );

  return (
    <div>
      <TabHeader title="Performance" hideEdit />

      {/* Filter row */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 20, padding: "14px 16px", border: "1px solid var(--stone-200)", borderRadius: 10, background: "#fff" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ font: "500 13px/1 Inter", color: "var(--stone-700)" }}>Time Period</span>
          <select
            style={{ height: 32, padding: "0 28px 0 10px", border: "1px solid var(--stone-200)", borderRadius: 6, font: "400 14px/1 Inter", background: "#fff", cursor: "pointer" }}
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {DATE_RANGES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </div>

        <div style={{ height: 24, width: 1, background: "var(--stone-200)" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", font: "500 13px/1 Inter", color: "var(--stone-700)" }}>
            <input
              type="checkbox"
              checked={compareEnabled}
              onChange={(e) => setCompareEnabled(e.target.checked)}
            />
            Compare to
          </label>
          <select
            disabled={!compareEnabled}
            style={{ height: 32, padding: "0 28px 0 10px", border: "1px solid var(--stone-200)", borderRadius: 6, font: "400 14px/1 Inter", background: "#fff", cursor: compareEnabled ? "pointer" : "not-allowed", opacity: compareEnabled ? 1 : 0.5 }}
            value={compareType}
            onChange={(e) => setCompareType(e.target.value)}
          >
            <option value="avg">Doctor Average</option>
            <option value="doctors">Doctors</option>
            <option value="previous">Previous Period</option>
          </select>

          {compareEnabled && compareType === "doctors" && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {otherDoctors.length === 0 && <span style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)" }}>No other doctors to compare to.</span>}
              {otherDoctors.map(d => {
                const selected = compareDoctorIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setCompareDoctorIds(prev => selected ? prev.filter(id => id !== d.id) : [...prev, d.id])}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "0 10px", height: 28,
                      border: `1px solid ${selected ? "var(--teal-brand)" : "var(--stone-200)"}`,
                      background: selected ? "var(--teal-tint)" : "#fff",
                      color: selected ? "var(--teal-brand)" : "var(--stone-700)",
                      borderRadius: 999,
                      font: "500 13px/1 Inter",
                      cursor: "pointer",
                    }}
                  >
                    <Icon name={selected ? "check" : "plus"} size={11} />
                    {d.name.replace(/^Dr\.\s*/, "")}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="co-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start", marginBottom: 24 }}>
        <KPICard
          label="# of Appointments"
          value={fmtNumber(scaled.appointments)}
          comparison={cmp(scaled.appointments, compareValues?.appointments)}
        />
        <KPICard
          label="# of Procedures"
          value={fmtNumber(scaled.procedures)}
          comparison={cmp(scaled.procedures, compareValues?.procedures)}
        />
        <KPICard
          label="Production"
          value={fmtCompactCurrency(scaled.production)}
          comparison={cmp(scaled.production, compareValues?.production)}
        />
        <KPICard
          label="Avg Revenue / Appointment"
          value={fmtCurrency(scaled.avgRevPerApt)}
          comparison={cmp(scaled.avgRevPerApt, compareValues?.avgRevPerApt)}
        />
        <KPICard
          label="Fill Rate"
          value={fmtPct(scaled.fillRate, 0)}
          comparison={cmp(scaled.fillRate, compareValues?.fillRate)}
        />
        <KPICard
          label="% of Total Production"
          value={fmtPct(pctOfTotal, 0)}
          comparison={null}
        />
      </div>

      {/* Service mix — donut + horizontal bars side by side */}
      <div className="co-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ font: "700 16px/1.2 Inter", margin: "0 0 6px", color: "var(--stone-900)" }}>Revenue by Service</h3>
        <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 20px" }}>
          Mix and ranking of {fmtCurrency(categoryTotal)} in production this period.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, alignItems: "center" }}>
          {/* Donut */}
          <div style={{ display: "grid", placeItems: "center" }}>
            <div style={{
              position: "relative",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: `conic-gradient(${conicGradient})`,
            }}>
              <div style={{
                position: "absolute",
                inset: 28,
                borderRadius: "50%",
                background: "#fff",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
              }}>
                <div>
                  <div style={{ font: "700 22px/1 Inter", color: "var(--stone-900)", letterSpacing: "-0.02em" }}>{fmtCompactCurrency(categoryTotal)}</div>
                  <div style={{ font: "500 12px/1 Inter", color: "var(--stone-500)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categoryRowsSorted.map((c, i) => {
              const pct = categoryTotal ? c.totalRevenue / categoryTotal : 0;
              const widthPct = (c.totalRevenue / maxCategoryRev) * 100;
              const color = PALETTE[i % PALETTE.length];
              return (
                <div key={c.name} style={{ display: "grid", gridTemplateColumns: "120px 1fr 100px 50px", gap: 12, alignItems: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "500 14px/1.3 Inter", color: "var(--stone-900)" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                    {c.name}
                  </div>
                  <div style={{ height: 10, background: "var(--stone-100)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${widthPct}%`, background: color, borderRadius: 999, transition: "width 200ms" }} />
                  </div>
                  <div style={{ font: "500 14px/1 Inter", color: "var(--stone-900)", textAlign: "right" }}>{fmtCurrency(c.totalRevenue)}</div>
                  <div style={{ font: "500 13px/1 Inter", color: "var(--stone-500)", textAlign: "right" }}>{fmtPct(pct, 0)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="co-card" style={{ padding: 24 }}>
        <h3 style={{ font: "700 16px/1.2 Inter", margin: "0 0 14px", color: "var(--stone-900)" }}>Service Details</h3>
        <table className="co-tbl" style={{ borderRadius: 0 }}>
          <thead>
            <tr>
              <th>Service Category</th>
              <th style={{ textAlign: "right" }}># Procedures</th>
              <th style={{ textAlign: "right" }}>Avg Charge</th>
              <th style={{ textAlign: "right" }}>Total Revenue</th>
              <th style={{ textAlign: "right" }}>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {categoryRowsSorted.map(c => (
              <tr key={c.name}>
                <td>
                  <div className="co-tbl-cell" style={{ cursor: "default" }}>{c.name}</div>
                </td>
                <td>
                  <div className="co-tbl-cell" style={{ cursor: "default", justifyContent: "flex-end" }}>{fmtNumber(c.procedures)}</div>
                </td>
                <td>
                  <div className="co-tbl-cell" style={{ cursor: "default", justifyContent: "flex-end" }}>{fmtCurrency(c.avgCharge)}</div>
                </td>
                <td>
                  <div className="co-tbl-cell" style={{ cursor: "default", justifyContent: "flex-end", fontWeight: 600 }}>{fmtCurrency(c.totalRevenue)}</div>
                </td>
                <td>
                  <div className="co-tbl-cell" style={{ cursor: "default", justifyContent: "flex-end", fontWeight: 600 }}>{categoryTotal ? fmtPct(c.totalRevenue / categoryTotal, 0) : "—"}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Doctor: Benefits Tab ─────────────────────────────────────────────────────

const DoctorBenefitsTab = ({ doctor, benefits, onUpdate }) => {
  const [editing, setEditing] = React.useState(false);
  const [disabled, setDisabled] = React.useState(new Set(doctor.benefitDisabled || []));
  React.useEffect(() => { if (!editing) setDisabled(new Set(doctor.benefitDisabled || [])); }, [doctor, editing]);

  const toggle = (key) => setDisabled(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  const startEdit = () => { setDisabled(new Set(doctor.benefitDisabled || [])); setEditing(true); };
  const save = () => { onUpdate({ ...doctor, benefitDisabled: [...disabled] }); setEditing(false); };
  const cancel = () => { setDisabled(new Set(doctor.benefitDisabled || [])); setEditing(false); };

  const renderCategory = (cat, marginTop) => {
    const rows = benefits[cat.key] || [];
    if (rows.length === 0) return null;
    return (
      <div key={cat.key} style={{ marginTop }}>
        <div style={{ font: "600 14px/1 Inter", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name={cat.icon} size={15} style={{ color: "var(--teal-brand)" }} /> {cat.name}
        </div>
        {rows.map(b => {
          const isDisabled = disabled.has(b.key);
          return (
            <div key={b.key} className="co-benefit-row" style={{ opacity: isDisabled ? 0.45 : 1, alignItems: "flex-start" }}>
              {editing && (
                <input type="checkbox" className="co-benefit-row__check" style={{ marginTop: 3 }} checked={!isDisabled} onChange={() => toggle(b.key)} />
              )}
              <div className="co-benefit-row__info" style={{ flex: 1 }}>
                <div className="co-benefit-row__name">{b.name}</div>
                {b.provider && (
                  <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 3 }}>{b.provider}</div>
                )}
                {!isDisabled && b.company && (
                  <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-700)", marginTop: 6 }}>
                    Company: <strong>{fmtContrib(b.company)}</strong>
                    {b.employee && <> · Employee: <strong>{fmtContrib(b.employee)}</strong></>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const insuranceCat = BENEFIT_CATEGORIES.find(c => c.key === "insurance");
  const otherCats = BENEFIT_CATEGORIES.filter(c => c.key !== "insurance");

  return (
    <div className="co-card" style={{ padding: 24 }}>
      <TabHeader title="Benefits" isEditing={editing} onEdit={startEdit} onSave={save} onCancel={cancel} />
      <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", marginBottom: 20, padding: "11px 13px", background: "var(--stone-50)", borderRadius: 8, border: "1px solid var(--stone-200)" }}>
        Benefits are pre-filled from practice defaults. {editing ? "Uncheck any that don't apply to this doctor." : "Manage practice-wide benefits on the Team › Benefits tab."}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          {insuranceCat && renderCategory(insuranceCat, 0)}
        </div>
        <div>
          {otherCats.map((cat, i) => renderCategory(cat, i === 0 ? 0 : 20))}
        </div>
      </div>
    </div>
  );
};

// ─── Doctor: History Tab (Education + Experience + Complaints + Bio) ─────────

const DoctorHistoryTab = ({ doctor, onUpdate }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(doctor);
  React.useEffect(() => { if (!editing) setDraft(doctor); }, [doctor, editing]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const startEdit = () => { setDraft(doctor); setEditing(true); };
  const save = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(doctor); setEditing(false); };

  const addEd = () => set("education", [...(draft.education || []), { degree: "", institution: "", year: "" }]);
  const updateEd = (i, patch) => set("education", draft.education.map((e, j) => j === i ? { ...e, ...patch } : e));
  const removeEd = (i) => set("education", draft.education.filter((_, j) => j !== i));

  const addEx = () => set("experience", [...(draft.experience || []), { role: "", employer: "", startYear: "", endYear: "", bullets: [] }]);
  const updateEx = (i, patch) => set("experience", draft.experience.map((e, j) => j === i ? { ...e, ...patch } : e));
  const removeEx = (i) => set("experience", draft.experience.filter((_, j) => j !== i));
  const addBullet = (i) => updateEx(i, { bullets: [...(draft.experience[i].bullets || []), ""] });
  const updateBullet = (i, j, val) => updateEx(i, { bullets: draft.experience[i].bullets.map((b, k) => k === j ? val : b) });
  const removeBullet = (i, j) => updateEx(i, { bullets: draft.experience[i].bullets.filter((_, k) => k !== j) });

  const sectionTitle = { font: "600 16px/1.2 Inter", color: "var(--stone-900)", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 };
  const subCard = { padding: 16, border: "1px solid var(--stone-200)", borderRadius: 8, marginBottom: 12 };
  const complaintsHasIssue = doctor.complaints && doctor.complaints.toLowerCase() !== "none";

  return (
    <div className="co-card" style={{ padding: 24 }}>
      <TabHeader title="History" isEditing={editing} onEdit={startEdit} onSave={save} onCancel={cancel} />

      {/* Education */}
      <div style={{ marginBottom: 28 }}>
        <div style={sectionTitle}>
          <Icon name="award" size={16} style={{ color: "var(--teal-brand)" }} /> Education
        </div>
        {!editing ? (
          (doctor.education || []).length === 0
            ? <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>No education added.</div>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {doctor.education.map((ed, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "baseline" }}>
                    <div>
                      <div style={{ font: "600 14px/1.4 Inter", color: "var(--stone-900)" }}>{ed.degree || "—"}</div>
                      <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>{ed.institution || "—"}</div>
                    </div>
                    <div style={{ font: "500 14px/1.4 Inter", color: "var(--stone-500)", whiteSpace: "nowrap" }}>{ed.year || ""}</div>
                  </div>
                ))}
              </div>
            )
        ) : (
          <>
            {(draft.education || []).map((ed, i) => (
              <div key={i} style={subCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ font: "500 13px/1 Inter", color: "var(--stone-500)" }}>Entry {i + 1}</div>
                  <button onClick={() => removeEd(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "#BE123C", font: "500 13px/1 Inter", padding: 4 }}>Remove</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Field label="Degree / Certification">
                    <input style={fieldInputStyle} value={ed.degree} onChange={e => updateEd(i, { degree: e.target.value })} placeholder="Doctor of Veterinary Medicine (DVM)" />
                  </Field>
                  <Field label="Institution">
                    <input style={fieldInputStyle} value={ed.institution} onChange={e => updateEd(i, { institution: e.target.value })} placeholder="Institution name" />
                  </Field>
                  <Field label="Year">
                    <input style={{ ...fieldInputStyle, width: 140 }} value={ed.year} onChange={e => updateEd(i, { year: e.target.value })} placeholder="2015" />
                  </Field>
                </div>
              </div>
            ))}
            <button className="co-add-row" onClick={addEd}>
              <Icon name="plus" size={14} /> Add education
            </button>
          </>
        )}
      </div>

      {/* Experience */}
      <div style={{ marginBottom: 28 }}>
        <div style={sectionTitle}>
          <Icon name="briefcase" size={16} style={{ color: "var(--teal-brand)" }} /> Professional Experience
        </div>
        {!editing ? (
          (doctor.experience || []).length === 0
            ? <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>No experience added.</div>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {doctor.experience.map((ex, i) => (
                  <div key={i}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "baseline" }}>
                      <div>
                        <div style={{ font: "600 14px/1.4 Inter", color: "var(--stone-900)" }}>{ex.role || "—"}</div>
                        <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>{ex.employer || "—"}</div>
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
            )
        ) : (
          <>
            {(draft.experience || []).map((ex, i) => (
              <div key={i} style={subCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ font: "500 13px/1 Inter", color: "var(--stone-500)" }}>Entry {i + 1}</div>
                  <button onClick={() => removeEx(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "#BE123C", font: "500 13px/1 Inter", padding: 4 }}>Remove</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Field label="Role / Title">
                    <input style={fieldInputStyle} value={ex.role} onChange={e => updateEx(i, { role: e.target.value })} placeholder="Associate Veterinarian" />
                  </Field>
                  <Field label="Employer">
                    <input style={fieldInputStyle} value={ex.employer} onChange={e => updateEx(i, { employer: e.target.value })} placeholder="Employer name" />
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Start Year">
                      <input style={fieldInputStyle} value={ex.startYear} onChange={e => updateEx(i, { startYear: e.target.value })} placeholder="2018" />
                    </Field>
                    <Field label="End Year">
                      <input style={fieldInputStyle} value={ex.endYear} onChange={e => updateEx(i, { endYear: e.target.value })} placeholder="Present" />
                    </Field>
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Highlights</label>
                    {(ex.bullets || []).map((b, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                        <span style={{ font: "400 14px/1 Inter", color: "var(--stone-500)", flexShrink: 0 }}>•</span>
                        <input style={fieldInputStyle} value={b} onChange={e => updateBullet(i, j, e.target.value)} placeholder="One accomplishment, area of focus, or note" />
                        <button onClick={() => removeBullet(i, j)} title="Remove" style={{ background: "none", border: 0, cursor: "pointer", color: "var(--stone-500)", padding: 6, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="x" size={14} /></button>
                      </div>
                    ))}
                    <button onClick={() => addBullet(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--teal-brand)", font: "500 13px/1 Inter", padding: "4px 0", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="plus" size={12} /> Add highlight
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="co-add-row" onClick={addEx}>
              <Icon name="plus" size={14} /> Add experience
            </button>
          </>
        )}
      </div>

      {/* Complaints */}
      <div style={{ marginBottom: 28 }}>
        <div style={sectionTitle}>
          <Icon name="info" size={16} style={{ color: complaintsHasIssue ? "#BE123C" : "var(--teal-brand)" }} /> Complaints
        </div>
        {!editing ? (
          <div style={{ font: "400 14px/1.5 Inter", color: complaintsHasIssue ? "#BE123C" : "var(--stone-700)" }}>
            {doctor.complaints || "None"}
          </div>
        ) : (
          <textarea
            style={{ ...fieldInputStyle, height: "auto", minHeight: 80, padding: "10px 12px", lineHeight: 1.5, resize: "vertical" }}
            value={draft.complaints || ""}
            onChange={e => set("complaints", e.target.value)}
            placeholder="None — or describe any past complaints, board actions, or disclosures."
          />
        )}
      </div>

      {/* Bio */}
      <div>
        <div style={sectionTitle}>
          <Icon name="fileText" size={16} style={{ color: "var(--teal-brand)" }} /> Bio
        </div>
        {!editing ? (
          <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)" }}>
            {doctor.bio || <span style={{ color: "var(--stone-500)" }}>No bio added.</span>}
          </div>
        ) : (
          <textarea
            style={{ ...fieldInputStyle, height: "auto", minHeight: 100, padding: "10px 12px", lineHeight: 1.5, resize: "vertical" }}
            value={draft.bio || ""}
            onChange={e => set("bio", e.target.value)}
            placeholder="Memberships, awards, areas of interest, or any other notes."
          />
        )}
      </div>
    </div>
  );
};

// ─── Doctor: Personal Tab ─────────────────────────────────────────────────────

// Derive first/last name from doctor.name when personal record doesn't have them
const splitDoctorName = (name) => {
  if (!name) return { first: "", last: "" };
  const cleaned = name.replace(/^Dr\.\s*/i, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
};

const DoctorPersonalTab = ({ doctor, onUpdate }) => {
  const [editing, setEditing] = React.useState(false);
  const split = splitDoctorName(doctor.name);
  // Effective personal record — prefer values stored on personal, fall back to derived from name
  const personalEffective = {
    ...(doctor.personal || {}),
    firstName: doctor.personal?.firstName || split.first,
    lastName:  doctor.personal?.lastName  || split.last,
  };
  const [draft, setDraft] = React.useState(personalEffective);
  React.useEffect(() => { if (!editing) setDraft(personalEffective); }, [doctor]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const startEdit = () => { setDraft(personalEffective); setEditing(true); };
  const save = () => { onUpdate({ ...doctor, personal: draft }); setEditing(false); };
  const cancel = () => { setDraft(personalEffective); setEditing(false); };

  const genderLabel = { female: "Female", male: "Male", "non-binary": "Non-binary", "prefer-not": "Prefer not to say" }[personalEffective.gender] || null;
  const cityState = [personalEffective.city, personalEffective.state].filter(Boolean).join(", ");
  const fullAddr = [personalEffective.address, [cityState, personalEffective.zip].filter(Boolean).join(" ")].filter(Boolean).join(" — ");

  return (
    <div className="co-card" style={{ padding: 24 }}>
      <TabHeader title="Personal" isEditing={editing} onEdit={startEdit} onSave={save} onCancel={cancel} />

      {!editing ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
          <ReadField label="First Name" value={personalEffective.firstName} />
          <ReadField label="Last Name" value={personalEffective.lastName} />
          <ReadField label="Date of Birth" value={personalEffective.dob ? fmtDate(personalEffective.dob) : null} />
          <ReadField label="Gender" value={genderLabel} />
          <div style={{ gridColumn: "1 / -1" }}>
            <ReadField label="Home Address" value={fullAddr || null} />
          </div>
          <ReadField label="Phone Number" value={personalEffective.phone} />
          <ReadField label="Personal Email" value={personalEffective.email} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First Name">
              <input style={fieldInputStyle} value={draft.firstName || ""} onChange={e => set("firstName", e.target.value)} placeholder="First name" />
            </Field>
            <Field label="Last Name">
              <input style={fieldInputStyle} value={draft.lastName || ""} onChange={e => set("lastName", e.target.value)} placeholder="Last name" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Date of Birth">
              <input type="date" style={fieldInputStyle} value={draft.dob || ""} onChange={e => set("dob", e.target.value)} />
            </Field>
            <Field label="Gender">
              <select style={fieldInputStyle} value={draft.gender || ""} onChange={e => set("gender", e.target.value)}>
                <option value="">— Select —</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </Field>
          </div>
          <Field label="Home Address">
            <input style={fieldInputStyle} value={draft.address || ""} onChange={e => set("address", e.target.value)} placeholder="Street address" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
            <Field label="City">
              <input style={fieldInputStyle} value={draft.city || ""} onChange={e => set("city", e.target.value)} placeholder="City" />
            </Field>
            <Field label="State">
              <input style={fieldInputStyle} value={draft.state || ""} onChange={e => set("state", e.target.value)} placeholder="TX" />
            </Field>
            <Field label="Zip">
              <input style={fieldInputStyle} value={draft.zip || ""} onChange={e => set("zip", e.target.value)} placeholder="00000" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Phone Number">
              <input style={fieldInputStyle} value={draft.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="(555) 123-4567" />
            </Field>
            <Field label="Personal Email">
              <input type="email" style={fieldInputStyle} value={draft.email || ""} onChange={e => set("email", e.target.value)} placeholder="name@example.com" />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Doctor: Documents Tab ────────────────────────────────────────────────────

const DOCTOR_DOC_TYPES = [
  "Offer Letter", "Employment Agreement", "License — State", "DEA Registration",
  "Malpractice Insurance", "I-9 Form", "W-4 Form", "Direct Deposit Form",
  "Background Check", "Non-disclosure Agreement", "Non-compete Agreement",
  "Continuing Education Records", "Other",
];

const DoctorDocumentsTab = ({ doctor, onUpdate }) => {
  const documents = doctor.documents || [];
  const fileInputRef = React.useRef(null);

  const inferType = (filename) => {
    const f = (filename || "").toLowerCase();
    if (f.includes("offer")) return "Offer Letter";
    if (f.includes("license")) return "License — State";
    if (f.includes("dea")) return "DEA Registration";
    if (f.includes("malpractice") || f.includes("insurance")) return "Malpractice Insurance";
    if (f.includes("i-9") || f.includes("i9")) return "I-9 Form";
    if (f.includes("w-4") || f.includes("w4")) return "W-4 Form";
    if (f.includes("direct") || f.includes("deposit")) return "Direct Deposit Form";
    if (f.includes("nda") || f.includes("non-disc")) return "Non-disclosure Agreement";
    return "Other";
  };

  const fmtSize = (b) => {
    if (b == null) return "";
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (files) => {
    const newDocs = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      type: inferType(file.name),
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Admin",
    }));
    onUpdate({ ...doctor, documents: [...documents, ...newDocs] });
  };

  const updateType = (id, type) =>
    onUpdate({ ...doctor, documents: documents.map(d => d.id === id ? { ...d, type } : d) });
  const removeDoc = (id) =>
    onUpdate({ ...doctor, documents: documents.filter(d => d.id !== id) });

  return (
    <div className="co-card" style={{ padding: 24 }}>
      <TabHeader title={`Documents${documents.length > 0 ? ` (${documents.length})` : ""}`} hideEdit />

      <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 16px" }}>
        Store credentialing and employment documents — license, DEA, malpractice, I-9, W-4, offer letter, etc.
      </p>

      <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--teal-brand)"; e.currentTarget.style.background = "var(--teal-tint)"; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.background = "var(--stone-50)"; }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "var(--stone-200)";
          e.currentTarget.style.background = "var(--stone-50)";
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          padding: "20px 24px", borderRadius: 10, border: "1.5px dashed var(--stone-200)",
          background: "var(--stone-50)", textAlign: "center", cursor: "pointer",
          transition: "background 120ms, border-color 120ms", marginBottom: 16,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, font: "500 14px/1.4 Inter", color: "var(--stone-700)" }}>
          <Icon name="upload" size={16} style={{ color: "var(--teal-brand)" }} />
          Drag & drop files here, or click to browse
        </div>
        <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 6 }}>
          PDF, DOCX, JPG, PNG — up to 25MB each
        </div>
      </div>

      {documents.length === 0 ? (
        <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", padding: "8px 0" }}>
          No documents uploaded yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {documents.map(doc => (
            <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--stone-200)", borderRadius: 8, background: "#fff" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--stone-50)", display: "grid", placeItems: "center", color: "var(--teal-brand)", flexShrink: 0 }}>
                <Icon name="fileText" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "500 14px/1.3 Inter", color: "var(--stone-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
                <div style={{ font: "400 13px/1.3 Inter", color: "var(--stone-500)", marginTop: 2 }}>
                  {fmtSize(doc.size)} · Uploaded {fmtRelativeOrDate(doc.uploadedAt)} by {doc.uploadedBy}
                </div>
              </div>
              <select
                value={doc.type}
                onChange={(e) => updateType(doc.id, e.target.value)}
                style={{ height: 32, padding: "0 8px", border: "1px solid var(--stone-200)", borderRadius: 6, font: "400 14px/1 Inter", background: "#fff", cursor: "pointer", flexShrink: 0 }}
              >
                {DOCTOR_DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => removeDoc(doc.id)} title="Remove" style={{ background: "none", border: 0, cursor: "pointer", color: "var(--stone-500)", padding: 6, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Doctor: Notes Tab ────────────────────────────────────────────────────────

const DoctorNotesTab = ({ doctor, onUpdate }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(doctor.notes || "");
  React.useEffect(() => { if (!editing) setDraft(doctor.notes || ""); }, [doctor]);

  const startEdit = () => { setDraft(doctor.notes || ""); setEditing(true); };
  const save = () => {
    const dirty = draft !== (doctor.notes || "");
    onUpdate({
      ...doctor,
      notes: draft,
      notesUpdatedAt: dirty ? new Date().toISOString() : doctor.notesUpdatedAt,
      notesUpdatedBy: dirty ? "Admin" : doctor.notesUpdatedBy,
    });
    setEditing(false);
  };
  const cancel = () => { setDraft(doctor.notes || ""); setEditing(false); };

  const updatedMeta = doctor.notesUpdatedAt
    ? `Last updated ${fmtRelativeOrDate(doctor.notesUpdatedAt)}${doctor.notesUpdatedBy ? ` by ${doctor.notesUpdatedBy}` : ""}`
    : null;

  return (
    <div className="co-card" style={{ padding: 24 }}>
      <TabHeader
        title={`Notes${(doctor.notes || "").trim() ? " (1)" : ""}`}
        isEditing={editing}
        onEdit={startEdit}
        onSave={save}
        onCancel={cancel}
        extra={updatedMeta && <span style={{ font: "400 13px/1 Inter", color: "var(--stone-500)" }}>{updatedMeta}</span>}
      />

      {!editing ? (
        <div style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)", whiteSpace: "pre-wrap" }}>
          {doctor.notes || <span style={{ color: "var(--stone-500)" }}>No notes added.</span>}
        </div>
      ) : (
        <textarea
          style={{ ...fieldInputStyle, height: "auto", minHeight: 220, padding: "10px 12px", lineHeight: 1.5, resize: "vertical" }}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add any notes about this doctor — performance discussions, accommodations, internal context."
        />
      )}
    </div>
  );
};

// ─── Doctor: Detail Page Shell ────────────────────────────────────────────────

const DoctorDetailPage = ({ doctor, allDoctors, benefits, onUpdate, onBack }) => {
  const [activeTab, setActiveTab] = React.useState("employment");

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: 0, cursor: "pointer",
          font: "500 14px/1 Inter", color: "var(--teal-brand)",
          padding: "8px 0", marginBottom: 12,
        }}
      >
        <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}>
          <Icon name="chevronRight" size={14} />
        </span>
        Back to Team
      </button>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ font: "700 28px/1.2 Inter", margin: "0 0 6px", letterSpacing: "-0.01em", color: "var(--stone-900)" }}>{doctor.name}</h1>
        <div style={{ font: "400 16px/1.3 Inter", color: "var(--stone-500)" }}>{doctor.role || "—"}</div>
      </div>

      <div className="co-team-tabs">
        {DOCTOR_TABS.map(t => (
          <button
            key={t.key}
            className={`co-team-tab ${activeTab === t.key ? "is-active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "employment"  && <DoctorEmploymentTab  doctor={doctor} onUpdate={onUpdate} />}
      {activeTab === "performance" && <DoctorPerformanceTab doctor={doctor} allDoctors={allDoctors} />}
      {activeTab === "benefits"    && <DoctorBenefitsTab    doctor={doctor} benefits={benefits} onUpdate={onUpdate} />}
      {activeTab === "history"     && <DoctorHistoryTab     doctor={doctor} onUpdate={onUpdate} />}
      {activeTab === "personal"    && <DoctorPersonalTab    doctor={doctor} onUpdate={onUpdate} />}
      {activeTab === "documents"   && <DoctorDocumentsTab   doctor={doctor} onUpdate={onUpdate} />}
      {activeTab === "notes"       && <DoctorNotesTab       doctor={doctor} onUpdate={onUpdate} />}
    </div>
  );
};

// ─── Doctor Add Slideout (kept for adding new doctors) ────────────────────────

const blankDoctor = () => ({
  name: "", role: "", age: "", yearsExperience: "", startDate: "", employment: "full", compensation: "", compensationType: "annual",
  avgHoursPerWeek: "", scheduleDetails: "", worksOtherPractices: false, otherPracticesDetails: "",
  specialty: "", license: "", licenseState: "", complaints: "None",
  education: [], experience: [], bio: "",
  personal: {}, notes: "", notesUpdatedAt: null, notesUpdatedBy: null, documents: [],
  performance: { ttm: { appointments: 0, procedures: 0, production: 0, avgRevPerApt: 0, fillRate: 0, byCategory: [] } },
});

const DoctorSlideout = ({ onSave, onClose }) => {
  const [form, setForm] = React.useState({ name: "", role: "", employment: "full" });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const canSave = form.name.trim().length > 0;

  const save = (openDetails) => {
    if (!canSave) return;
    onSave({ ...blankDoctor(), ...form }, openDetails);
    onClose();
  };

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout" style={{ width: 480 }}>
        <div className="co-slideout__header">
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 11px/1 Inter", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Doctor</div>
            <h2 style={{ margin: 0 }}>Add Doctor</h2>
          </div>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="co-slideout__body">
          <div className="co-field">
            <label>Name</label>
            <input autoFocus value={form.name} onChange={e => set("name", e.target.value)} placeholder="Dr. Jane Doe" />
          </div>
          <div className="co-field">
            <label>Title / Role</label>
            <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Associate Veterinarian — Internal Medicine" />
          </div>
          <div className="co-field">
            <label>Employment</label>
            <select value={form.employment} onChange={e => set("employment", e.target.value)}>
              <option value="full">Full-time</option>
              <option value="part">Part-time</option>
            </select>
          </div>
          <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "20px 0 0" }}>
            You can add compensation, specialty, license, education, and more after saving.
          </p>
        </div>

        <div className="co-slideout__footer">
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--ghost" onClick={() => save(false)} disabled={!canSave}>Save &amp; Close</button>
          <button className="co-btn co-btn--primary" onClick={() => save(true)} disabled={!canSave}>
            Continue Editing <Icon name="chevronRight" size={13} />
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Doctors Tab ──────────────────────────────────────────────────────────────

const DoctorsTab = ({ doctors, setDoctors, onView }) => {
  const [showAdd, setShowAdd] = React.useState(false);
  const [nextId, setNextId] = React.useState(() => doctors.reduce((m, d) => Math.max(m, d.id), 0) + 1);

  const addDoctor = (doc, openDetails) => {
    const id = nextId;
    setDoctors(prev => [...prev, { ...doc, id }]);
    setNextId(n => n + 1);
    if (openDetails) onView(id);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, paddingTop: 10, paddingBottom: 10, gap: 16 }}>
        <div>
          <h2 style={{ font: "700 18px/1 Inter", margin: "0 0 6px" }}>Doctors ({doctors.length})</h2>
          <p style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", margin: 0 }}>
            Click a doctor to view their full profile.
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
        <div className="co-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, alignItems: "start" }}>
          {doctors.map(d => (
            <DoctorCompactCard key={d.id} doctor={d} onView={() => onView(d.id)} />
          ))}
        </div>
      )}

      {showAdd && (
        <DoctorSlideout
          onSave={addDoctor}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  );
};

// ─── Staff Tab ────────────────────────────────────────────────────────────────

const STAFF_SORT_COLUMNS = {
  firstName: (m) => (m.firstName || "").toLowerCase(),
  lastName:  (m) => (m.lastName || "").toLowerCase(),
  role:      (m) => (m.role || "").toLowerCase(),
  status:    (m) => (m.status === "inactive" ? 1 : 0),
  type:      (m) => (m.type === "part" ? 1 : 0),
  pay:       (m) => {
    const n = parseFloat(String(m.salary || "").replace(/[^0-9.]/g, "")) || 0;
    return m.salaryType === "hourly" ? n * (parseFloat(m.hours) || 40) * 52 : n;
  },
  hours:     (m) => parseFloat(m.hours) || 0,
};

const SortHeader = ({ label, column, sort, setSort, extra, style }) => {
  const isActive = sort.column === column;
  const dir = isActive ? sort.direction : null;
  return (
    <th
      style={{ cursor: "pointer", userSelect: "none", ...style }}
      onClick={() => {
        setSort(prev => prev.column === column
          ? { column, direction: prev.direction === "asc" ? "desc" : "asc" }
          : { column, direction: "asc" });
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        {extra}
        <span style={{ display: "inline-flex", color: isActive ? "var(--stone-700)" : "var(--stone-300)", marginLeft: 2 }}>
          <Icon name={dir === "desc" ? "arrowDown" : "arrowUp"} size={11} />
        </span>
      </span>
    </th>
  );
};

const StaffTab = ({ benefits, staff, setStaff, memberDetails, setMemberDetails }) => {
  const [slideoutId, setSlideoutId] = React.useState(null);
  const [showAddSlideout, setShowAddSlideout] = React.useState(false);
  const [nextId, setNextId] = React.useState(20);
  const [sort, setSort] = React.useState({ column: "lastName", direction: "asc" });
  const [editingCell, setEditingCell] = React.useState(null); // { rowId, column } | null
  const startEdit = (rowId, column) => setEditingCell({ rowId, column });
  const exitEdit = () => setEditingCell(null);

  const slideoutMember = staff.find(s => s.id === slideoutId);
  const updateMember = (updated) => setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
  const removeMember = (id) => setStaff(prev => prev.filter(s => s.id !== id));
  const addMemberInline = () => {
    setStaff(prev => [...prev, { id: nextId, firstName: "", lastName: "", role: "", status: "active", type: "full", employeeClass: "non-exempt-hourly", salaryType: "annual", salary: "", hours: "40", licensed: false, workLocation: "", workEmail: "", supervisorId: null }]);
    setNextId(n => n + 1);
    // Reset sort so the new row lands at the natural bottom (highest id)
    setSort({ column: null, direction: "asc" });
  };
  const addMemberFromSlideout = (member, openDetails) => {
    setStaff(prev => [...prev, member]);
    setNextId(n => n + 1);
    if (openDetails) setSlideoutId(member.id);
  };

  const sortedStaff = React.useMemo(() => {
    const getKey = STAFF_SORT_COLUMNS[sort.column] || (() => 0);
    const copy = [...staff];
    copy.sort((a, b) => {
      const ka = getKey(a);
      const kb = getKey(b);
      if (ka < kb) return sort.direction === "asc" ? -1 : 1;
      if (ka > kb) return sort.direction === "asc" ? 1 : -1;
      return a.id - b.id;
    });
    return copy;
  }, [staff, sort]);

  const statusInfo = (
    <span
      className="co-tip"
      data-tip="Inactive = not expected to work within 3 months"
      data-tip-wrap=""
      data-tip-pos="bottom"
      tabIndex={0}
      style={{ color: "var(--stone-400)" }}
    >
      <Icon name="info" size={12} />
    </span>
  );

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
              <SortHeader label="First Name" column="firstName" sort={sort} setSort={setSort} />
              <SortHeader label="Last Name"  column="lastName"  sort={sort} setSort={setSort} />
              <SortHeader label="Role / Title" column="role" sort={sort} setSort={setSort} />
              <SortHeader label="Status" column="status" sort={sort} setSort={setSort} extra={statusInfo} />
              <SortHeader label="Employment" column="type" sort={sort} setSort={setSort} />
              <SortHeader label="Pay" column="pay" sort={sort} setSort={setSort} />
              <SortHeader label="Hrs/wk" column="hours" sort={sort} setSort={setSort} />
              <th style={{ position: "sticky", right: 0, background: "var(--stone-50)", boxShadow: "-1px 0 0 var(--stone-300)", zIndex: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedStaff.map(member => (
              <StaffTableRow
                key={member.id}
                member={member}
                detailSaved={!!memberDetails[member.id]}
                onChange={updateMember}
                onDetails={() => setSlideoutId(member.id)}
                editingColumn={editingCell?.rowId === member.id ? editingCell.column : null}
                onStartEdit={startEdit}
                onExitEdit={exitEdit}
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
          allStaff={staff}
          benefits={benefits}
          overrides={memberDetails[slideoutMember.id]}
          onUpdateMember={updateMember}
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

const BenefitCard = ({ benefit, category, onEdit }) => (
  <div className="co-card" style={{ padding: 20, position: "relative" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
      <Icon name="checkCircle" size={16} style={{ color: "var(--teal-brand)", marginTop: 2, flexShrink: 0 }} />
      <div style={{ font: "600 15px/1.3 Inter", flex: 1 }}>{benefit.name}</div>
      <button
        className="co-btn co-btn--ghost"
        onClick={onEdit}
        style={{ padding: "4px 8px", font: "400 13px/1 Inter", flexShrink: 0 }}
        title="Edit benefit"
      >
        <Icon name="edit" size={13} /> Edit
      </button>
    </div>
    {benefit.ownerCovered && (
      <div style={{ font: "500 14px/1.2 Inter", color: "var(--teal-brand)", marginBottom: 8 }}>Owner covered under group plan</div>
    )}
    {(benefit.provider || benefit.plan || benefit.enrolled) && (
      <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-700)", marginBottom: 12 }}>
        {benefit.provider && <div>Provider: {benefit.provider}</div>}
        {benefit.plan && <div>Plans: {benefit.plan}</div>}
        {benefit.enrolled && <div>Enrolled: {benefit.enrolled} employees</div>}
      </div>
    )}
    <div style={{ borderTop: "1px solid var(--stone-100)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ font: "500 14px/1.2 Inter", color: "var(--stone-900)" }}>
        Company: <span style={{ fontWeight: 600 }}>{fmtContrib(benefit.company) || "—"}</span>
      </div>
      {benefit.employee && (
        <div style={{ font: "500 14px/1.2 Inter", color: "var(--stone-700)" }}>
          Employee: <span style={{ fontWeight: 600 }}>{fmtContrib(benefit.employee)}</span>
        </div>
      )}
    </div>
  </div>
);

const EmptyBenefitCard = ({ definition, onAdd }) => (
  <div
    className="co-card"
    style={{
      padding: 20,
      borderStyle: "dashed",
      borderColor: "var(--stone-200)",
      background: "var(--stone-50)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div style={{ font: "600 15px/1.3 Inter", color: "var(--stone-700)" }}>{definition.name}</div>
    {definition.description && (
      <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", flex: 1 }}>
        {definition.description}
      </div>
    )}
    <button
      className="co-btn co-btn--ghost"
      onClick={onAdd}
      style={{ alignSelf: "flex-start", padding: "6px 10px", font: "500 14px/1 Inter" }}
    >
      <Icon name="plus" size={14} /> Add {definition.name}
    </button>
  </div>
);

const BenefitsTabView = ({ benefits, onAddPredefined, onAddCustom, onEdit }) => (
  <div>
    {BENEFIT_CATEGORIES.map((cat, idx) => {
      const rows = benefits[cat.key] || [];
      const presentKeys = new Set(rows.map(b => b.key));
      const definedKeys = new Set(cat.definitions.map(d => d.key));
      // Cards in display order: definitions in their declared order (filled or empty), then customs (rows whose key isn't in definitions)
      const customRows = rows.filter(b => !definedKeys.has(b.key));

      return (
        <div key={cat.key} style={{ marginBottom: idx === BENEFIT_CATEGORIES.length - 1 ? 0 : 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingTop: idx === 0 ? 10 : 0 }}>
            <h2 style={{ font: "700 18px/1 Inter", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={cat.icon} size={18} style={{ color: "var(--teal-brand)" }} />
              {cat.name}
            </h2>
            <button
              className="co-btn co-btn--ghost"
              onClick={() => onAddCustom(cat)}
              title={`Add a custom benefit to ${cat.name}`}
            >
              <Icon name="plus" size={14} /> Add Benefit
            </button>
          </div>

          {cat.definitions.length === 0 && customRows.length === 0 ? (
            <div
              className="co-card"
              style={{ padding: 20, borderStyle: "dashed", borderColor: "var(--stone-200)", background: "var(--stone-50)", textAlign: "center" }}
            >
              <div style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)" }}>
                No benefits added yet. Click <strong>Add Benefit</strong> to add a custom benefit.
              </div>
            </div>
          ) : (
            <div className="co-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
              {cat.definitions.map(def => {
                const filled = rows.find(b => b.key === def.key);
                return filled ? (
                  <BenefitCard
                    key={def.key}
                    benefit={filled}
                    category={cat}
                    onEdit={() => onEdit(cat, def, filled)}
                  />
                ) : (
                  <EmptyBenefitCard
                    key={def.key}
                    definition={def}
                    onAdd={() => onAddPredefined(cat, def)}
                  />
                );
              })}
              {customRows.map(b => (
                <BenefitCard
                  key={b.key}
                  benefit={b}
                  category={cat}
                  onEdit={() => onEdit(cat, null, b)}
                />
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Team Section Root ────────────────────────────────────────────────────────

const TeamSection = () => {
  const TABS = ["Owners", "Doctors", "Staff", "Consultants", "Payroll", "Benefits"];
  const [activeTab, setActiveTab] = React.useState("staff");
  const [staff, setStaff] = React.useState(STAFF_SEED);
  const [doctors, setDoctors] = React.useState(DOCTORS_SEED);
  const [benefits, setBenefits] = React.useState(TEAM_BENEFITS_SEED);
  const [memberDetails, setMemberDetails] = React.useState({});
  const [viewingDoctorId, setViewingDoctorId] = React.useState(null);
  const viewingDoctor = doctors.find(d => d.id === viewingDoctorId);
  const updateDoctor = (updated) => setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));

  // Single-benefit modal state: { category, definition, existing, mode }
  const [benefitModal, setBenefitModal] = React.useState(null);

  const openAddPredefined = (category, definition) =>
    setBenefitModal({ category, definition, existing: null, mode: "add" });
  const openAddCustom = (category) =>
    setBenefitModal({ category, definition: null, existing: null, mode: "add" });
  const openEdit = (category, definition, existing) =>
    setBenefitModal({ category, definition, existing, mode: "edit" });

  const saveBenefit = (next) => {
    if (!benefitModal) return;
    const catKey = benefitModal.category.key;
    setBenefits(prev => {
      const list = prev[catKey] || [];
      const existingIdx = list.findIndex(b => b.key === next.key);
      const nextList = existingIdx >= 0
        ? list.map((b, i) => i === existingIdx ? next : b)
        : [...list, next];
      return { ...prev, [catKey]: nextList };
    });
  };

  if (viewingDoctor) {
    return (
      <DoctorDetailPage
        doctor={viewingDoctor}
        allDoctors={doctors}
        benefits={benefits}
        onUpdate={updateDoctor}
        onBack={() => setViewingDoctorId(null)}
      />
    );
  }

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
        <DoctorsTab
          doctors={doctors}
          setDoctors={setDoctors}
          onView={setViewingDoctorId}
        />
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
          <BenefitsTabView
            benefits={benefits}
            onAddPredefined={openAddPredefined}
            onAddCustom={openAddCustom}
            onEdit={openEdit}
          />
          {benefitModal && (
            <BenefitEditModal
              category={benefitModal.category}
              definition={benefitModal.definition}
              existing={benefitModal.existing}
              mode={benefitModal.mode}
              onSave={saveBenefit}
              onClose={() => setBenefitModal(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

Object.assign(window, { TeamSection });
