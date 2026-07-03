// Seed data for the CareOwner seller app

const PRACTICE = {
  name: "AnimalCare",
  location: "Lakeside, IL",
  type: "Small Animal Practice",
  founded: 2013,
  website: "animalcareweb.net",
  rating: 4.8,
  reviewCount: 235,
  cert: ["AAHA Certified"],
  teaser: "Step into a fully operational, cash-flowing veterinary practice with an experienced owner retiring in two years.",
  listingTitle: "20+ Years with Loyal Client Base",
  askingPrice: "$836K (2025)",
  doctors: 4,
  financials: {
    ttmRevenue: "$2.45M",
    ebitda: "$612K",
    bankBalance: "$184K",
    verifiedDate: "4/3/26",
  },
  operations: {
    activeClients: "1,240",
    revenuePerVisit: "$456",
    revenuePerDoctor: "$612K",
    verifiedDate: "4/3/26",
  },
  team: {
    doctors: 3,
    partTime: 2,
    avgExperience: "13 years",
    supportStaff: 13,
    avgTenure: "6.4 years",
  },
  deal: {
    timeline: "6–9 months",
    types: ["Joint Venture"],
    type: "Joint Venture",
    stay: "2–3 years",
    buyer: "Open to Both",
    notes: "Looking for a partner who will preserve the long-tenured support team and continue community involvement (vaccine clinics, school visits). Open to earn-out structures.",
    earnOut: true,
    anonymous: true,
  },
  bio: "Dr. Lisa Thompson has been practicing veterinary medicine for over 15 years. She opened AnimalCare in 2013 with a mission to provide compassionate, high-quality care to pets and their families. Dr. Thompson specializes in small animal medicine and surgery, with particular expertise in internal medicine and emergency care.",
  owners: [
    { name: "Dr. Lisa Thompson", role: "Primary Owner", share: "70%", initials: "LT", color: "amber" },
    { name: "Thompson Family Trust", role: "Owner", share: "30%", initials: "TT", color: "violet" },
  ],
  services: ["Wellness Exams", "Laboratory Services", "Vaccinations", "Radiology", "Surgery", "Emergency Care", "Dental Care", "Rehabilitation"],
  facilities: {
    examRooms: 5,
    buildingSize: "2,300 sq ft",
    monthlyRent: "$10,000/mo",
    leaseExpires: "12/2030",
    tenure: "Leased",
    rent: "$10,000/mo · $120K/yr",
    relatedParty: "Yes — seller's LLC",
    remainingTerm: "~4.5 yrs (to 12/2030)",
    renewalOptions: "Two 5-year options",
  },
};

// Canonical buyer types — the same set surfaced on the Buyer Profile type badge
// and in the Find Buyers "Type" filter. Keep table + profile + filter in sync.
const BUYER_TYPES = ["Individual Buyer", "Acquisition Group", "Corporate Group", "Private Equity", "Regional Group"];

// Each buyer is a contact person. `company` is the organization they buy for,
// or null for an individual buyer. `practices` = practices in their network /
// that they own. `interest` may be "" when a buyer hasn't expressed interest yet.
const BUYERS = [
  { id: 1, name: "Sarah Whitman",     company: "Paws & Whiskers Group",        type: "Corporate Group",   location: "Chicago, IL",      practices: 24, funds: "$5M–$15M",   interest: "High",   lastActive: "2h ago", status: "active" },
  { id: 2, name: "Dr. Marcus Chen",   company: null,                           type: "Individual Buyer",  location: "Madison, WI",      practices: 1,  funds: "$1M–$3M",    interest: "Medium", lastActive: "1d ago", status: "active" },
  { id: 3, name: "Michael Brennan",   company: "Heartland Veterinary Partners",type: "Private Equity",    location: "Indianapolis, IN", practices: 38, funds: "$10M+",      interest: "High",   lastActive: "3h ago", status: "verified" },
  { id: 4, name: "Dr. Priya Natarajan", company: null,                         type: "Individual Buyer",  location: "Milwaukee, WI",    practices: 0,  funds: "$500K–$2M",  interest: "",       lastActive: "1w ago", status: "paused" },
  { id: 5, name: "Karen Lindqvist",   company: "Midwest Animal Holdings",      type: "Corporate Group",   location: "Minneapolis, MN",  practices: 15, funds: "$8M–$25M",   interest: "High",   lastActive: "5h ago", status: "active" },
  { id: 6, name: "Dr. James Okafor",  company: null,                           type: "Individual Buyer",  location: "Lakeside, IL",     practices: 1,  funds: "$800K–$1.5M",interest: "Medium", lastActive: "4d ago", status: "verified" },
  { id: 7, name: "Daniel Roth",       company: "Northwoods Pet Partners",      type: "Regional Group",    location: "Green Bay, WI",    practices: 9,  funds: "$3M–$8M",    interest: "",       lastActive: "6h ago", status: "active" },
  { id: 8, name: "Rachel Okafor",     company: "Harbor Ridge Capital",         type: "Acquisition Group", location: "Boston, MA",       practices: 52, funds: "$20M+",      interest: "",       lastActive: "2d ago", status: "active" },
];

const INQUIRIES = [
  { id: 1, from: "Paws & Whiskers Group", subject: "Interested in financial verification call", date: "Apr 17", status: "new", priority: "high" },
  { id: 2, from: "Dr. Marcus Chen", subject: "Questions on lease terms and equipment list", date: "Apr 16", status: "replied", priority: "medium" },
  { id: 3, from: "Heartland Veterinary Partners", subject: "Request for Q1 2026 financials", date: "Apr 15", status: "new", priority: "high" },
  { id: 4, from: "Dr. Priya Natarajan", subject: "Timing of ownership transition", date: "Apr 14", status: "replied", priority: "low" },
  { id: 5, from: "Midwest Animal Holdings", subject: "Site visit availability next week", date: "Apr 13", status: "new", priority: "high" },
  { id: 6, from: "Dr. James Okafor", subject: "Client retention statistics", date: "Apr 11", status: "closed", priority: "medium" },
];

const OFFERS = [
  { id: 1, from: "Paws & Whiskers Group", amount: "$890,000", type: "Joint Venture", submitted: "Apr 16", expires: "May 1", status: "pending" },
  { id: 2, from: "Heartland Veterinary Partners", amount: "$845,000", type: "Asset Purchase", submitted: "Apr 14", expires: "Apr 28", status: "pending" },
  { id: 3, from: "Dr. Marcus Chen", amount: "$815,000", type: "Stock Purchase", submitted: "Apr 12", expires: "Apr 26", status: "counter" },
  { id: 4, from: "Midwest Animal Holdings", amount: "$920,000", type: "Joint Venture", submitted: "Apr 10", expires: "Apr 24", status: "accepted-prelim" },
  { id: 5, from: "Northwoods Pet Partners", amount: "$760,000", type: "Asset Purchase", submitted: "Apr 4", expires: "Apr 18", status: "declined" },
];

const THREADS = [
  { id: 1, name: "Paws & Whiskers Group", initials: "PW", last: "Happy to schedule the financial verification this Thursday. Are mornings better?", time: "2h", unread: 1,
    messages: [
      { from: "them", text: "Hi Dr. Thompson — we've been reviewing the listing for AnimalCare and are very interested in moving to financial verification.", time: "Yesterday 4:12 PM" },
      { from: "me", text: "Wonderful to hear from you. I'd be glad to set up a call. What timing works on your end?", time: "Yesterday 5:28 PM" },
      { from: "them", text: "How is this Thursday looking? We'd ideally get a 90-minute window for our CFO to walk through the P&L.", time: "Today 10:04 AM" },
      { from: "them", text: "Happy to schedule the financial verification this Thursday. Are mornings better?", time: "Today 11:30 AM" },
    ] },
  { id: 2, name: "Heartland Veterinary Partners", initials: "HV", last: "Thanks — received. We'll circle back by EOD Friday.", time: "1d", unread: 0,
    messages: [
      { from: "me", text: "Attached are the Q1 2026 financials you requested.", time: "Apr 16 2:22 PM" },
      { from: "them", text: "Thanks — received. We'll circle back by EOD Friday.", time: "Apr 17 9:08 AM" },
    ] },
  { id: 3, name: "Dr. Marcus Chen", initials: "MC", last: "Could we discuss an earn-out structure?", time: "2d", unread: 2,
    messages: [
      { from: "them", text: "Could we discuss an earn-out structure?", time: "Apr 15 6:11 PM" },
    ] },
  { id: 4, name: "Midwest Animal Holdings", initials: "MA", last: "Our site visit is confirmed for Tuesday 10am.", time: "3d", unread: 0, messages: [{ from: "them", text: "Our site visit is confirmed for Tuesday 10am.", time: "Apr 14 3:00 PM" }] },
];

const MEETINGS = [
  { id: 1, title: "Financial Verification — Paws & Whiskers Group", with: "Sarah Meyer (CFO), David Pulaski (Analyst)", day: "24", month: "Apr", time: "9:00 AM CT", dur: "90 min", type: "Zoom" },
  { id: 2, title: "Site Visit — Midwest Animal Holdings", with: "Jordan Park, Amanda Reyes", day: "29", month: "Apr", time: "10:00 AM CT", dur: "2 hrs", type: "On-site" },
  { id: 3, title: "Offer Negotiation — Dr. Marcus Chen", with: "Dr. Marcus Chen, Attorney (TBC)", day: "02", month: "May", time: "2:00 PM CT", dur: "60 min", type: "Zoom" },
  { id: 4, title: "Q2 Broker Check-in", with: "Eliza Tan (CareOwner Advisor)", day: "08", month: "May", time: "11:00 AM CT", dur: "30 min", type: "Phone" },
];

const ACTIVITY = [
  { id: 1, kind: "offer", text: "<b>Paws & Whiskers Group</b> submitted an offer of $890,000", time: "2h ago", icon: "dollarSign", tint: "green" },
  { id: 2, kind: "view", text: "<b>12 new buyers</b> viewed your listing this week", time: "Today", icon: "eye", tint: "indigo" },
  { id: 3, kind: "msg",   text: "<b>Dr. Marcus Chen</b> replied to your message", time: "1d ago", icon: "message", tint: "amber" },
  { id: 4, kind: "doc",   text: "Financials verified by <b>CareOwner</b>", time: "2d ago", icon: "checkCircle", tint: "green" },
  { id: 5, kind: "mtg",   text: "Financial verification call scheduled with <b>Paws & Whiskers</b>", time: "2d ago", icon: "calendar", tint: "rose" },
  { id: 6, kind: "view",  text: "Listing appeared in <b>18 searches</b>", time: "3d ago", icon: "trend", tint: "indigo" },
];

// ─── Market Check ───────────────────────────────────────────────────────────

// The platform's modeled valuation estimate (in $M) — buyers' responses are
// compared against this to show "market vs model".
const MODELED_ESTIMATE = { low: 2.5, high: 3.5 };

// Everything that *could* go into an anonymized snapshot. provenance:
// "verified" (pulled from a connected account/doc) | "self" (manual) | "none".
const MARKET_METRICS = [
  { group: "Financials", items: [
    { id: "revenue",   label: "High-Level Revenue",      value: "$2.45M",          range: "$2M – $3M",          provenance: "verified" },
    { id: "ebitda",    label: "Adjusted EBITDA",         value: "$612K",           range: "$600K – $620K",      provenance: "verified" },
    { id: "adjMargin", label: "Adjusted EBITDA Margin",  value: "25%",             range: "20% – 25%",          provenance: "verified" },
    { id: "sales",     label: "Annual Sales + Growth",   value: "$2.45M · +8% YoY", range: "$2M – $3M · +5–10% YoY", provenance: "verified" },
  ]},
  { group: "Production", items: [
    { id: "prodByDoctor", label: "Production by Doctor",        value: "$612K avg / DVM",    range: "$500K – $750K avg / DVM", provenance: "verified" },
    { id: "dvm",          label: "DVM Concentration + # DVMs",  value: "5 DVMs · top DVM 28%", provenance: "self" },
  ]},
  { group: "Practice Attributes", items: [
    { id: "locationType", label: "Location Type",            value: "Suburban",              provenance: "verified" },
    { id: "geo",          label: "Geography + Demographics",  value: "Midwest · HH income $96K", provenance: "self" },
    { id: "pricing",      label: "Pricing",                  value: "Exam $68 · ~12% above region", provenance: "self" },
  ]},
  { group: "People", items: [
    { id: "turnover", label: "Staff Turnover", value: "14% annual", provenance: "self" },
  ]},
  { group: "Facilities", items: [
    { id: "facilities", label: "Space / Facilities", value: "2,300 sq ft · 5 exam rooms", provenance: "verified" },
  ]},
];

// Ranges are in $M (numbers) for charting. `color` drives the buyer-mix series +
// the dot in the responses table. `count` = how many buyers of this type responded.
const MARKET_CHECK_RESPONSES = [
  { id: 1, buyer: "Private Equity Group", buyerType: "Private Equity", color: "#6E84B8", count: 2, verified: true, interest: "High", low: 3.0, high: 3.5, submitted: "6/2/26",
    feedback: "Excellent EBITDA margins and growth trajectory. Strengthening financial reporting and reducing owner dependence would support a higher multiple.",
    recs: ["Hire an associate DVM to reduce owner dependence", "Implement monthly financial dashboards"] },
  { id: 2, buyer: "Specialty Group / DSO", buyerType: "Specialty Group / DSO", color: "#D9A65A", count: 1, verified: true, interest: "High", low: 2.9, high: 3.4, submitted: "6/2/26",
    feedback: "Strong specialty mix and location. Expanding recurring wellness plans and dental/surgical capacity would lift value.",
    recs: ["Launch a wellness membership program", "Grow specialty surgical & dental services"] },
  { id: 3, buyer: "Corporate Acquirer", buyerType: "Corporate Group", color: "#4E9E8E", count: 1, verified: true, interest: "High", low: 2.8, high: 3.2, submitted: "6/2/26",
    feedback: "Solid fundamentals and brand. Modernizing imaging equipment and documenting SOPs would de-risk the transition.",
    recs: ["Modernize imaging equipment", "Create comprehensive SOP documentation"] },
  { id: 4, buyer: "Regional Chain", buyerType: "Regional Group", color: "#C77E8C", count: 1, verified: false, interest: "Medium", low: 2.6, high: 3.0, submitted: "6/2/26",
    feedback: "Great market position. A longer lease term and a clearer owner-transition plan would improve confidence.",
    recs: ["Renew the facility lease for 5+ years", "Develop a 12-month transition timeline"] },
  { id: 5, buyer: "Individual Veterinarian", buyerType: "Individual Vet", color: "#A89AC9", count: 1, verified: true, interest: "Medium", low: 2.5, high: 2.9, submitted: "6/2/26",
    feedback: "Attractive practice for an owner-operator. Moving the fee schedule toward market rates would improve cash flow.",
    recs: ["Move fee schedule to market rates", "Formalize staff training and retention"] },
];

// ── Responses-tab aggregates (mirror Figma 64:1742) ──────────────────────────
// Headline numbers shown across the Responses dashboard. Kept as display strings
// so the prototype matches the design exactly.
const MC_CONSENSUS = {
  valuation: "$2.98M", delta: "6.9%", deltaVs: "vs Q4 2025",
  range: "$2.5M – $3.5M", rangeSub: "across responding buyers",
  responses: 5, sent: 6, responseRate: "75%",
  growthUpside: "+$680K", growthSub: "Estimated value increase from buyer feedback",
  highestOffer: "$3.5M", highestOfferBuyer: "Private Equity Group",
  modelMidpoint: "$3.0M",
};

// Consensus midpoint (and highest offer) trend across the last three market checks.
const MC_VALUATION_TREND = {
  periods: ["Q3 2025", "Q4 2025", "Q1 2026"],
  consensus: [2.55, 2.79, 2.98],
  highestOffer: [3.05, 3.25, 3.5],
};

// Buyer-mix scale: fixed axis + the IQR band / median that overlay every row.
const MC_BUYER_MIX = { axisMin: 2.4, axisMax: 3.6, tickStep: 0.2, bandLow: 2.8, bandHigh: 3.15, median: 3.0 };

// "Results by Snapshot Type" — two lenses on how data quality moves outcomes.
const MC_SNAPSHOT_RESULTS = {
  // Connected/verified vs self-reported.
  connected: {
    valuation: { verified: "$3.2M", verifiedDelta: "10%", self: "$2.8M" },
    responseRate: { verified: "81%", verifiedDelta: "20%", self: "64%" },
  },
  // How much of the available profile was shared, banded by completeness,
  // and split by whether that data was connected/verified or self-reported.
  amountShared: {
    verified: [
      { band: "90%+",   valuation: "$3.3M", rate: "84%" },
      { band: "75–90%", valuation: "$3.2M", rate: "80%" },
      { band: "50–75%", valuation: "$3.0M", rate: "72%" },
      { band: "0–50%",  valuation: "$2.8M", rate: "61%" },
    ],
    self: [
      { band: "90%+",   valuation: "$2.9M", rate: "70%" },
      { band: "75–90%", valuation: "$2.8M", rate: "66%" },
      { band: "50–75%", valuation: "$2.6M", rate: "58%" },
      { band: "0–50%",  valuation: "$2.4M", rate: "49%" },
    ],
  },
};

// Recommended actions (uplift in $K) — aggregated from buyer notes, ranked by uplift.
const MC_RECOMMENDED_ACTIONS = [
  { rank: 1, title: "Hire an associate DVM to reduce owner dependence", uplift: 180, flagged: 4, effort: "High" },
  { rank: 2, title: "Launch a wellness membership program",             uplift: 160, flagged: 3, effort: "Medium" },
  { rank: 3, title: "Modernize imaging equipment",                      uplift: 140, flagged: 2, effort: "Medium" },
  { rank: 4, title: "Renew the facility lease for 5+ years",            uplift: 120, flagged: 3, effort: "Low" },
  { rank: 5, title: "Move fee schedule to market rates",                uplift: 80,  flagged: 2, effort: "Low" },
];

// Valuation impact drivers (impact in $K) — positive lifts, negative drags.
const MC_IMPACT_DRIVERS = [
  { label: "Recurring wellness plans",     value: 240 },
  { label: "Specialty surgical & dental",  value: 190 },
  { label: "Staff tenure & retention",     value: 120 },
  { label: "Location & demographics",      value: 90 },
  { label: "Below-market fee schedule",    value: -70 },
  { label: "Short remaining lease term",   value: -95 },
  { label: "Owner-dependent goodwill",     value: -130 },
  { label: "Aging imaging equipment",      value: -160 },
];

// ── Buyer Response simulation ─────────────────────────────────────────────────
// Incoming market-check requests as a *buyer* would receive them: an anonymized
// snapshot grouped by category. defaultLow/High (in $M) prefill the buyer's value
// range. Each group is what the buyer scores (thumbs up / down / neutral).
const MC_INCOMING_REQUESTS = [
  {
    id: "inc-1", type: "Small Animal Practice", region: "Suburban · Midwest",
    requestedBy: "Anonymous seller · via CareOwner", received: "6/14/26", deadline: "6/28/26",
    status: "new", revenueBand: "$2M – $3M", verifiedMix: "19 verified · 4 self-reported",
    defaultLow: 2.5, defaultHigh: 3.0,
    coverNote: "Established practice with a loyal client base; owner planning a transition over the next 1–2 years.",
    groups: [
      { group: "Financials", items: [
        { label: "High-Level Revenue", value: "$2M – $3M", provenance: "verified", up: true },
        { label: "Adjusted EBITDA", value: "~$610K · ~25% margin", provenance: "verified", up: true },
        { label: "EBITDA Basis", value: "Adjusted · owner comp normalized", provenance: "verified" },
        { label: "Annual Growth", value: "+8% YoY", provenance: "verified", up: true },
      ]},
      { group: "Operations", items: [
        { label: "Active Clients", value: "~1,240", provenance: "verified" },
        { label: "Revenue / Visit", value: "$456", provenance: "verified" },
        { label: "Revenue / Doctor", value: "$612K", provenance: "verified" },
        { label: "Revenue Mix", value: "Med 42% · Sx 21% · Dental 13% · Rx 16% · Retail 8%", provenance: "verified" },
      ]},
      { group: "Production", items: [
        { label: "Production / DVM", value: "~$610K avg", provenance: "verified" },
        { label: "Owner vs Associate Production", value: "33% owner · 67% associates", provenance: "verified" },
        { label: "# of DVMs", value: "5 DVMs", provenance: "self" },
      ]},
      { group: "Owner", items: [
        { label: "Owner Intentions", value: "Stay through 2–3 yr transition", provenance: "self" },
        { label: "Dependency Score", value: "38 / 100 · Moderate", provenance: "verified" },
        { label: "Production at risk if owner exits", value: "~$475K (23%)", provenance: "verified" },
      ]},
      { group: "Practice Attributes", items: [
        { label: "Location", value: "Suburban · Midwest", provenance: "verified" },
        { label: "Pricing", value: "~12% above regional median", provenance: "self" },
      ]},
      { group: "People", items: [
        { label: "Staff Turnover", value: "14% / yr", provenance: "self" },
        { label: "Avg Tenure", value: "~5 yrs", provenance: "verified" },
      ]},
      { group: "Facilities", items: [
        { label: "Space", value: "~2,300 sq ft · 5 exam rooms", provenance: "verified" },
        { label: "Occupancy", value: "Leased · related party (seller's LLC)", provenance: "verified" },
        { label: "Actual Rent", value: "~$10K/mo · ~$120K/yr", provenance: "verified" },
        { label: "Remaining Term", value: "~4.5 yrs · through 2030", provenance: "verified" },
        { label: "Renewal Options", value: "Two 5-yr options", provenance: "verified" },
      ]},
    ],
  },
  {
    id: "inc-2", type: "Multi-Doctor Practice", region: "Urban · Mountain West",
    requestedBy: "Anonymous seller · via CareOwner", received: "6/12/26", deadline: "6/26/26",
    status: "new", revenueBand: "$3M – $4M", verifiedMix: "14 verified · 2 self-reported",
    defaultLow: 3.2, defaultHigh: 3.9,
    coverNote: "High-growth, multi-doctor practice in a dense metro; modern facility and strong specialty mix.",
    groups: [
      { group: "Financials", items: [
        { label: "High-Level Revenue", value: "$3M – $4M", provenance: "verified", up: true },
        { label: "Adjusted EBITDA", value: "~$840K · ~24% margin", provenance: "verified", up: true },
        { label: "EBITDA Basis", value: "Adjusted · owner comp normalized", provenance: "verified" },
        { label: "Annual Growth", value: "+12% YoY", provenance: "verified", up: true },
      ]},
      { group: "Production", items: [
        { label: "Production / DVM", value: "~$680K avg", provenance: "verified" },
        { label: "Owner vs Associate Production", value: "18% owner · 82% associates", provenance: "verified" },
        { label: "# of DVMs", value: "7 DVMs", provenance: "verified" },
      ]},
      { group: "Owner", items: [
        { label: "Owner Intentions", value: "Exit at close · 12-mo handover", provenance: "self" },
        { label: "Dependency Score", value: "22 / 100 · Low", provenance: "verified" },
        { label: "Production at risk if owner exits", value: "~$180K (5%)", provenance: "verified" },
      ]},
      { group: "Practice Attributes", items: [
        { label: "Location", value: "Urban · Mountain West", provenance: "verified" },
        { label: "Pricing", value: "~at regional median", provenance: "self" },
      ]},
      { group: "People", items: [
        { label: "Staff Turnover", value: "9% / yr", provenance: "verified" },
        { label: "Avg Tenure", value: "~7 yrs", provenance: "verified" },
      ]},
      { group: "Facilities", items: [
        { label: "Space", value: "~3,600 sq ft · 7 exam rooms", provenance: "verified" },
        { label: "Lease", value: "Through 2032", provenance: "verified" },
      ]},
    ],
  },
  {
    id: "inc-3", type: "Mixed-Animal Practice", region: "Rural · Pacific NW",
    requestedBy: "Anonymous seller · via CareOwner", received: "6/9/26", deadline: "6/23/26",
    status: "viewed", revenueBand: "$1M – $2M", verifiedMix: "16 self-reported",
    defaultLow: 1.2, defaultHigh: 1.8,
    coverNote: "Community mixed-animal practice with room to modernize; sole owner exploring options.",
    groups: [
      { group: "Financials", items: [
        { label: "High-Level Revenue", value: "$1M – $2M", provenance: "self", up: true },
        { label: "Adjusted EBITDA", value: "~$240K · ~16% margin", provenance: "self" },
        { label: "EBITDA Basis", value: "Owner-reported · SDE basis", provenance: "self" },
        { label: "Annual Growth", value: "+5% YoY", provenance: "self", up: true },
      ]},
      { group: "Production", items: [
        { label: "Production / DVM", value: "~$520K avg", provenance: "self" },
        { label: "Owner vs Associate Production", value: "61% owner · 39% associates", provenance: "self" },
        { label: "# of DVMs", value: "3 DVMs", provenance: "self" },
      ]},
      { group: "Owner", items: [
        { label: "Owner Intentions", value: "Undecided · short handover", provenance: "self" },
        { label: "Dependency Score", value: "74 / 100 · High", provenance: "self" },
        { label: "Production at risk if owner exits", value: "~$430K (40%)", provenance: "self" },
      ]},
      { group: "Practice Attributes", items: [
        { label: "Location", value: "Rural · Pacific NW", provenance: "self" },
        { label: "Pricing", value: "~8% below regional median", provenance: "self" },
      ]},
      { group: "People", items: [
        { label: "Staff Turnover", value: "18% / yr", provenance: "self" },
        { label: "Avg Tenure", value: "~4 yrs", provenance: "self" },
      ]},
      { group: "Facilities", items: [
        { label: "Space", value: "~1,900 sq ft · 4 exam rooms", provenance: "self" },
        { label: "Lease", value: "Through 2028", provenance: "self" },
      ]},
    ],
  },
];

const MARKET_CHECK_REQUESTS = [
  { id: 1, name: "Full Practice Snapshot", sent: "Apr 8, 2026", status: "collecting", metrics: 8, verifiedMix: "6 verified · 2 self-reported", buyersSent: 6, responded: 4, deadline: "Apr 22, 2026" },
  { id: 2, name: "Financials-Only Teaser", sent: "Mar 24, 2026", status: "closed", metrics: 4, verifiedMix: "4 verified", buyersSent: 5, responded: 5, deadline: "Apr 7, 2026" },
  { id: 3, name: "Quick Manual Check", sent: null, status: "draft", metrics: 5, verifiedMix: "5 self-reported", buyersSent: 0, responded: 0, deadline: null },
];

// Market Profile — full staffing breakdown (mirrors the client's "Vet Staffing" reference).
// Doctors are populated from the producing vets; comp shown as LTM with a YTD figure,
// production split TTM-YTD vs full-year 2025. "—" marks data not yet provided.
const MARKET_PROFILE_STAFF = {
  doctors: {
    count: 5, fullTime: 3, partTime: 2, avgTenure: "4.6 years",
    comp: { ttm: "$333.4K", y2025: "$348.5K" },
    production: { ttm: "$2.04M", y2025: "$2.05M" },
    // Owner-vs-associate production split (drives buyer key-person risk).
    split: {
      owner: "$679K", ownerPct: 33,
      associates: "$1.36M", associatesPct: 67,
      atRisk: "$475K", atRiskPct: 23,
      note: "≈70% of the owner's personal production is relationship-bonded. A managed 2–3 yr transition is expected to retain the rest.",
    },
    members: [
      { name: "Maya Hollis", owner: true, hrwk: "40", tenure: "6.4", comp: "$106.8K", compYtd: "$44.5K", prod2025: "$662.6K", prodTtm: "$679.0K" },
      { name: "Trevor Quinn",     hrwk: "35", tenure: "6.8", comp: "$101.7K", compYtd: "$42.4K", prod2025: "$593.6K", prodTtm: "$568.5K" },
      { name: "Elena Vance",  hrwk: "40", tenure: "5.2", comp: "$125.0K", compYtd: "$52.1K", prod2025: "$785.6K", prodTtm: "$774.8K" },
      { name: "Damon Pruitt",    hrwk: "10", tenure: "0.1", comp: "—",       compYtd: null,     prod2025: "$3.1K",   prodTtm: "$12.8K" },
      { name: "Rosa Whitfield",       hrwk: "—",  tenure: "—",   comp: "—",       compYtd: null,     prod2025: "$3.1K",   prodTtm: "—" },
    ],
  },
  support: {
    count: 13, fullTime: 7, partTime: 6, avgTenure: "3.9 years",
    comp: { ttm: "$523.4K", y2025: "$541.0K" },
    production: { ttm: "$400.8K", y2025: "$406.4K" },
    members: [
      { name: "Bianca Cortez",   hrwk: "40", tenure: "8.2", comp: "$78.0K", compYtd: "$32.5K", prod2025: "—",      prodTtm: "—" },
      { name: "Felix Romano",    hrwk: "40", tenure: "6.5", comp: "$62.4K", compYtd: "$26.0K", prod2025: "$96.2K", prodTtm: "$92.4K" },
      { name: "Naomi Stein",    hrwk: "40", tenure: "5.1", comp: "$54.0K", compYtd: "$22.5K", prod2025: "$71.8K", prodTtm: "$70.1K" },
      { name: "Gavin Lowe",    hrwk: "36", tenure: "4.3", comp: "$49.5K", compYtd: "$20.6K", prod2025: "$64.3K", prodTtm: "$61.0K" },
      { name: "Tessa Bright",    hrwk: "32", tenure: "3.8", comp: "$44.2K", compYtd: "$18.4K", prod2025: "$52.7K", prodTtm: "$55.9K" },
      { name: "Caleb Fuentes",     hrwk: "40", tenure: "2.6", comp: "$46.8K", compYtd: "$19.5K", prod2025: "$58.1K", prodTtm: "$60.4K" },
      { name: "Dana Whitmore",    hrwk: "38", tenure: "3.2", comp: "$38.0K", compYtd: "$15.8K", prod2025: "—",      prodTtm: "—" },
      { name: "Andre Bellamy",   hrwk: "30", tenure: "1.9", comp: "$24.5K", compYtd: "$10.2K", prod2025: "—",      prodTtm: "—" },
      { name: "Mei Sato",      hrwk: "40", tenure: "4.7", comp: "$36.4K", compYtd: "$15.2K", prod2025: "—",      prodTtm: "—" },
      { name: "Lena Vasquez",  hrwk: "28", tenure: "2.1", comp: "$22.0K", compYtd: "$9.2K",  prod2025: "—",      prodTtm: "—" },
      { name: "Hugo Salazar",  hrwk: "32", tenure: "1.4", comp: "$26.8K", compYtd: "$11.2K", prod2025: "—",      prodTtm: "—" },
      { name: "Zoya Iqbal",     hrwk: "24", tenure: "2.8", comp: "$21.6K", compYtd: "$9.0K",  prod2025: "$38.4K", prodTtm: "$34.7K" },
      { name: "Wes Carver",     hrwk: "20", tenure: "3.5", comp: "$19.2K", compYtd: "$8.0K",  prod2025: "$24.9K", prodTtm: "$26.3K" },
    ],
  },
};

// Market Profile — Financials detail. Adjusted EBITDA is the headline metric
// buyers price against. The bridge itemizes the math both ways: Net Income →
// EBITDA (interest, taxes, D&A) and EBITDA → Adjusted EBITDA (add-backs).
const MARKET_PROFILE_FINANCIALS = {
  revenue: { value: "$2.45M", basis: "TTM", up: true, deltaPct: "8%", deltaLabel: "8% vs 2025" },
  ebitda: {
    value: "$612K", margin: "25%", basis: "Adjusted", up: true, deltaPct: "11%", deltaLabel: "11% vs 2025",
    reported: "$490K", reportedMargin: "20%", addBacks: "$122K",
  },
  // Net Income → EBITDA → Adjusted EBITDA. itda lines sum with net income to
  // reported EBITDA ($385+28+42+24+11 = $490K); add-backs sum to +$122K.
  // `n` values (in $K) drive the hero build-bar segment widths.
  bridge: {
    start: { label: "Net Income", value: "$385K", n: 385 },
    itda: [
      { label: "Interest", value: "$28K" },
      { label: "Taxes", value: "$42K" },
      { label: "Depreciation", value: "$24K" },
      { label: "Amortization", value: "$11K" },
    ],
    itdaTotal: { value: "$105K", n: 105 },
    ebitda: { label: "EBITDA", value: "$490K", n: 490 },
    addBacks: [
      { label: "Owner salary normalized", note: "to a $165K market rate", value: "$57K" },
      { label: "Owner's son on payroll", note: "non-operational role", value: "$38K" },
      { label: "One-time legal settlement", note: "non-recurring expense", value: "$27K" },
    ],
    addBackTotal: { value: "$122K", n: 122 },
    adjusted: { label: "Adjusted EBITDA", value: "$612K", n: 612 },
  },
  // Revenue/EBITDA by year, values in $M. Forecast rows are retained in data
  // but the Financials card charts actual years only.
  series: [
    { year: "2024", revenue: 2.08, ebitda: 0.50, forecast: false },
    { year: "2025", revenue: 2.26, ebitda: 0.55, forecast: false },
    { year: "2026", revenue: 2.45, ebitda: 0.61, forecast: false, ytd: { revenue: 1.42, ebitda: 0.35 } },
    { year: "2027", revenue: 2.69, ebitda: 0.69, forecast: true },
    { year: "2028", revenue: 2.95, ebitda: 0.77, forecast: true },
    { year: "2029", revenue: 3.23, ebitda: 0.85, forecast: true },
  ],
};

// Operations — revenue mix by service line (sums to 100%). Drives the horizontal
// stacked bar on the Operations card.
const OPERATIONS_REVENUE_MIX = [
  { label: "Medical",  pct: 42, value: "$1.03M", color: "#1B6970" },
  { label: "Surgery",  pct: 21, value: "$515K",  color: "#6E84B8" },
  { label: "Dental",   pct: 13, value: "$319K",  color: "#D9A65A" },
  { label: "Pharmacy", pct: 16, value: "$392K",  color: "#4E9E8E" },
  { label: "Retail",   pct: 8,  value: "$196K",  color: "#C77E8C" },
];

// Market Profile — Owner card. Intentions (stay vs go, for how long) plus a
// key-person Dependency Score out of 100 (higher = worse) derived from the share
// of clinical production the owner personally drives vs the associates.
const MARKET_PROFILE_OWNER = {
  intentions: {
    status: "Staying through transition",
    timeline: "2–3 years",
    detail: "Open to staying clinically active part-time for 2–3 years to transfer key client relationships and mentor associates before fully exiting.",
  },
  dependency: {
    score: 38, band: "Moderate", ownerPct: 33,
    note: "Owner personally drives ~33% of clinical production. A structured 2–3 yr transition keeps most of it with the practice; an abrupt exit puts ~$475K of production at risk.",
  },
};

window.MARKET_PROFILE_FINANCIALS = MARKET_PROFILE_FINANCIALS;
window.MARKET_PROFILE_OWNER = MARKET_PROFILE_OWNER;
window.OPERATIONS_REVENUE_MIX = OPERATIONS_REVENUE_MIX;
window.PRACTICE = PRACTICE;
window.BUYERS = BUYERS;
window.BUYER_TYPES = BUYER_TYPES;
window.MODELED_ESTIMATE = MODELED_ESTIMATE;
window.MARKET_METRICS = MARKET_METRICS;
window.MARKET_CHECK_RESPONSES = MARKET_CHECK_RESPONSES;
window.MARKET_CHECK_REQUESTS = MARKET_CHECK_REQUESTS;
window.MC_CONSENSUS = MC_CONSENSUS;
window.MC_VALUATION_TREND = MC_VALUATION_TREND;
window.MC_BUYER_MIX = MC_BUYER_MIX;
window.MC_SNAPSHOT_RESULTS = MC_SNAPSHOT_RESULTS;
window.MC_RECOMMENDED_ACTIONS = MC_RECOMMENDED_ACTIONS;
window.MC_IMPACT_DRIVERS = MC_IMPACT_DRIVERS;
window.MC_INCOMING_REQUESTS = MC_INCOMING_REQUESTS;
window.MARKET_PROFILE_STAFF = MARKET_PROFILE_STAFF;
window.INQUIRIES = INQUIRIES;
window.OFFERS = OFFERS;
window.THREADS = THREADS;
window.MEETINGS = MEETINGS;
window.ACTIVITY = ACTIVITY;
