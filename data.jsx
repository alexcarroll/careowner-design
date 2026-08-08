// Seed data for the CareOwner seller app

const PRACTICE = {
  name: "AnimalCare",
  location: "Lakeside, IL",
  address: "412 Lakeview Ave, Lakeside, IL 60045",
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
  // Named provider for each provider type. `value` may be one of `options` or a
  // free-text custom name ("Other"). Order is meaningful — cards render in this order.
  providers: [
    { id: "inhouse",     type: "In-house Lab",   icon: "activity",    desc: "In-house laboratory equipment provider",          value: "Idexx",  options: ["Antech", "Idexx"] },
    { id: "distributor", type: "Main Distributor", icon: "store",     desc: "Primary product distributor for the practice",     value: "MWI",    options: ["Covetrus", "MWI", "Patterson"] },
    { id: "reference",   type: "Reference Lab",  icon: "searchCheck", desc: "External reference laboratory for specialized testing", value: "Antech", options: ["Antech", "Idexx"] },
  ],
  // Service pricing, grouped into categories. `updated` is an ISO "YYYY-MM" of the
  // last price change; `prev` is the prior price. % change is derived, never stored.
  pricing: [
    { id: "cat-office", name: "Office Visit", items: [
      { id: "p1", name: "Routine Exam",      price: "$75",  prev: "$71",  updated: "2026-01" },
      { id: "p2", name: "Sick Visit",        price: "$95",  prev: "$90",  updated: "2026-01" },
      { id: "p3", name: "Emergency Consult", price: "$150", prev: "$140", updated: "2026-03" },
    ]},
    { id: "cat-vax", name: "Vaccinations", items: [
      { id: "p4", name: "Rabies",      price: "$25", prev: "$24", updated: "2025-06" },
      { id: "p5", name: "DHPP (Dogs)", price: "$35", prev: "$33", updated: "2025-06" },
      { id: "p6", name: "FVRCP (Cats)", price: "$32", prev: "$30", updated: "2025-06" },
    ]},
    { id: "cat-dental", name: "Dental Services", items: [
      { id: "p7", name: "Dental Cleaning",  price: "$350–$500", prev: "$325–$465", updated: "2026-02" },
      { id: "p8", name: "Tooth Extraction", price: "$75–$150",  prev: "$70–$140",  updated: "2026-02" },
      { id: "p9", name: "Dental X-Rays",    price: "$150",      prev: "$135",      updated: "2026-02" },
    ]},
    { id: "cat-surgery", name: "Surgery", items: [
      { id: "p10", name: "Spay (Cat)",  price: "$250–$350", prev: "$238–$333", updated: "2026-01" },
      { id: "p11", name: "Spay (Dog)",  price: "$350–$550", prev: "$330–$519", updated: "2026-01" },
      { id: "p12", name: "Neuter (Cat)", price: "$150–$250", prev: "$144–$239", updated: "2026-01" },
    ]},
  ],
  // Rewards / loyalty / membership / partnership programs surfaced on the Services page.
  // runBy: "self" | "third-party" | "unsure". joinFee/adminCost: { amount, cadence }.
  specialtyPrograms: [
    {
      id: "sp1",
      name: "Paws Rewards Program",
      type: "Client Loyalty / Rewards Program",
      description: "Our Paws Rewards program helps build client loyalty and encourages repeat visits. Members earn points on every purchase that can be redeemed for services and products.",
      runBy: "third-party",
      runTool: "PetDesk Loyalty",
      joinFee: { amount: "", cadence: "free" },
      members: "1,240",
      renewalRate: "86",
      started: "2019",
      adminCost: { amount: "199", cadence: "monthly" },
      perks: ["Points on every purchase", "Birthday rewards", "Exclusive discounts", "Priority booking", "Referral bonuses", "Early access to new services"],
    },
    {
      id: "sp2",
      name: "Wellness Plan Membership",
      type: "Membership Subscription",
      description: "A monthly wellness membership that bundles routine preventive care — exams, core vaccines, and dental cleanings — into one predictable monthly payment for pet owners.",
      runBy: "self",
      runTool: "",
      joinFee: { amount: "39", cadence: "monthly" },
      members: "310",
      renewalRate: "74",
      started: "2022",
      adminCost: { amount: "", cadence: "none" },
      perks: ["Two wellness exams per year", "Core vaccines included", "10% off additional services", "Complimentary nail trims"],
    },
  ],
};

// Master checklist of common veterinary services surfaced in the Services editor.
// PRACTICE.services holds the subset a practice actually offers (plus any customs).
const SERVICE_OPTIONS = [
  "Wellness Exams", "Vaccinations", "Surgery", "Dental Care",
  "Laboratory Services", "Radiology", "Emergency Care", "Rehabilitation",
  "Ultrasound", "Digital X-Ray", "After Hours / On-Call", "Boarding",
  "Grooming", "Microchipping", "Pharmacy", "Euthanasia",
  "Mobile Services", "Specialty Services",
];

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

// Requests — every inbound connection request, from any counterparty type:
//   "buyer"      → a potential buyer or buying group on the marketplace
//   "specialist" → a Talent Acquisition Specialist (see TA_SPECIALISTS)
//   "partner"    → a vetted third-party partner (lenders, brokers, valuation firms)
// `org` is the company behind the person, when there is one.
const REQUEST_TYPE_LABELS = { buyer: "Buyer", specialist: "Talent Specialist", partner: "Partner" };

const REQUESTS = [
  { id: 1, from: "Paws & Whiskers Group", org: "Corporate Group", type: "buyer",
    subject: "Interested in financial verification call", date: "Apr 17", status: "new", priority: "high" },
  { id: 2, from: "Jordan Beckett", org: "VetTalent Partners", type: "specialist",
    subject: "Has two DVMs exploring ownership near Lakeside", date: "Apr 17", status: "new", priority: "high" },
  { id: 3, from: "Dr. Marcus Chen", org: "Individual Buyer", type: "buyer",
    subject: "Questions on lease terms and equipment list", date: "Apr 16", status: "replied", priority: "medium" },
  { id: 4, from: "Heartland Veterinary Partners", org: "Private Equity", type: "buyer",
    subject: "Request for Q1 2026 financials", date: "Apr 15", status: "new", priority: "high" },
  { id: 5, from: "Corrine Ashby", org: "Lakeshore Practice Lending", type: "partner",
    subject: "Buyer financing pre-qualification for your listing", date: "Apr 15", status: "new", priority: "medium" },
  { id: 6, from: "Dr. Priya Natarajan", org: "Individual Buyer", type: "buyer",
    subject: "Timing of ownership transition", date: "Apr 14", status: "replied", priority: "low" },
  { id: 7, from: "Maria Santos", org: "Heartland Vet Recruiting", type: "specialist",
    subject: "Relief DVM in her network is ready to buy", date: "Apr 14", status: "replied", priority: "medium" },
  { id: 8, from: "Midwest Animal Holdings", org: "Corporate Group", type: "buyer",
    subject: "Site visit availability next week", date: "Apr 13", status: "new", priority: "high" },
  { id: 9, from: "Nathan Pierce", org: "Sterling Valuation Group", type: "partner",
    subject: "Third-party valuation ahead of diligence", date: "Apr 12", status: "closed", priority: "low" },
  { id: 10, from: "Dr. James Okafor", org: "Individual Buyer", type: "buyer",
    subject: "Client retention statistics", date: "Apr 11", status: "closed", priority: "medium" },
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
window.SERVICE_OPTIONS = SERVICE_OPTIONS;
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
// ── Marketplace listings ──────────────────────────────────────────────
// Public practice listings shown as thumbnail cards on the Marketplace page.
// `revenue` is last-year revenue in dollars (used by the Revenue Range filter);
// `dvms` is the FTE doctor count (used by the # of DVMs filter). `status`
// drives the badge dot color (see marketplace.jsx STATUS_META).
const LISTING_PRACTICE_TYPES = ["Small Animal", "Mixed Animal", "Equine", "Feline", "Specialty & Referral", "Rehab & Sports Med", "Mobile"];
const LISTING_LOCATION_TYPES = ["Urban", "Suburban", "Rural"];
const LISTING_STATUSES = ["Active", "Coming Soon", "Offer Pending", "Under Contract"];

const LISTINGS = [
  {
    id: "sc-coastal",
    title: "Loyal Client Base in Prime Coastal Market",
    state: "SC", locationType: "Suburban", practiceType: "Small Animal",
    dvms: 4, pt: 1, revenue: 2100000, lastYear: "$2.1M", ytd: "$1.15M", yoy: "+8%",
    status: "Active", featured: true,
    image: assetUrl("assets/listings-images/image 2_3_img.png"),
    description: "Multi-doctor GP with decades of community reputation. Retiring owner offers an 18-month hands-on transition.",
  },
  {
    id: "tx-mixed",
    title: "Diverse Service Mix in a Growing Community",
    state: "TX", locationType: "Rural", practiceType: "Mixed Animal",
    dvms: 3, pt: 1, revenue: 1400000, lastYear: "$1.4M", ytd: "$780K", yoy: "+12%",
    status: "Coming Soon",
    image: assetUrl("assets/listings-images/image 11_1_img.png"),
    description: "Small animal, equine, and cattle revenue streams provide durability. Owner ready to mentor a successor.",
  },
  {
    id: "ca-referral",
    title: "Multi-Specialty Referral with Strong GP Network",
    state: "CA", locationType: "Urban", practiceType: "Specialty & Referral",
    dvms: 11, pt: 2, revenue: 8600000, lastYear: "$8.6M", ytd: "$4.7M", yoy: "+6%",
    status: "Offer Pending",
    image: assetUrl("assets/listings-images/image 18_8_img.png"),
    description: "Established referral hospital with high margins and full multi-doctor coverage. Real estate available.",
  },
  {
    id: "ma-downtown",
    title: "Multigenerational Client Base in a Walkable Downtown",
    state: "MA", locationType: "Urban", practiceType: "Small Animal",
    dvms: 2, pt: 0, revenue: 1050000, lastYear: "$1.05M", ytd: "$560K", yoy: "+4%",
    status: "Active",
    image: assetUrl("assets/listings-images/image 35_5_img.png"),
    description: "Character-filled facility with deep community roots. Owner open to a real estate lease-back.",
  },
  {
    id: "az-subscription",
    title: "Subscription Wellness Model Driving Recurring Revenue",
    state: "AZ", locationType: "Suburban", practiceType: "Mobile",
    dvms: 2, pt: 1, revenue: 895000, lastYear: "$895K", ytd: "$520K", yoy: "+22%",
    status: "Active",
    image: assetUrl("assets/listings-images/image 288_7_img.png"),
    description: "Multi-vehicle mobile practice with a subscription plan powering ~40% of revenue and room to expand.",
  },
  {
    id: "fl-cats",
    title: "Cats-Only Boutique with a Multi-Month Waitlist",
    state: "FL", locationType: "Urban", practiceType: "Feline",
    dvms: 3, pt: 2, revenue: 1300000, lastYear: "$1.3M", ytd: "$720K", yoy: "+11%",
    status: "Under Contract",
    image: assetUrl("assets/listings-images/image 13_1_img.png"),
    description: "Feline-focused practice with premium reputation and consistent new-patient demand. Owner relocating.",
  },
  {
    id: "pa-renovated",
    title: "Recently Renovated Facility Ready to Scale",
    state: "PA", locationType: "Suburban", practiceType: "Small Animal",
    dvms: 9, pt: 3, revenue: 6200000, lastYear: "$6.2M", ytd: "$3.4M", yoy: "+15%",
    status: "Active",
    image: assetUrl("assets/listings-images/image 9_2_img.png"),
    description: "Multi-doctor emergency-capable hospital with recent capex complete. Owner staying for a 3-year post-close role.",
  },
  {
    id: "ky-farm",
    title: "Long-Term Farm Accounts with High-Margin Contracts",
    state: "KY", locationType: "Rural", practiceType: "Equine",
    dvms: 4, pt: 0, revenue: 3400000, lastYear: "$3.4M", ytd: "$1.7M", yoy: "+3%",
    status: "Coming Soon",
    image: assetUrl("assets/listings-images/image 6_3_img.png"),
    description: "Equine sports medicine and imaging practice with durable farm relationships and recurring revenue.",
  },
  {
    id: "or-niche",
    title: "High-Demand Niche Practice with Extended Waitlist",
    state: "OR", locationType: "Suburban", practiceType: "Specialty & Referral",
    dvms: 2, pt: 1, revenue: 780000, lastYear: "$780K", ytd: "$470K", yoy: "+18%",
    status: "Active",
    image: assetUrl("assets/listings-images/image 37_4_img.png"),
    description: "Specialty-focused practice with steady GP referral pipeline and a modern facility.",
  },
  {
    id: "co-rehab",
    title: "Fast-Growing Companion Animal Practice with Rehab Suite",
    state: "CO", locationType: "Suburban", practiceType: "Rehab & Sports Med",
    dvms: 2, pt: 1, revenue: 920000, lastYear: "$920K", ytd: "$580K", yoy: "+25%",
    status: "Offer Pending",
    image: assetUrl("assets/listings-images/image 32_6_img.png"),
    description: "Small animal hospital growing 25% a year, with an in-house canine rehab suite — underwater treadmill, therapeutic laser, and shockwave — driving loyal repeat clients.",
  },
];

// ── The seller's own listing (editable via the Listing Editor slideout) ──
// Recommended watercolor images the seller can pick from (they can't upload their
// own) — 5 curated for AnimalCare's profile (Suburban IL small-animal GP). The
// AI-generation flow draws "generated" results from the larger full-library pool.
const MY_LISTING_RECOMMENDED_IMAGES = [
  assetUrl("assets/listings-images/image 9_2_img.png"),
  assetUrl("assets/listings-images/image 11_1_img.png"),
  assetUrl("assets/listings-images/image 6_3_img.png"),
  assetUrl("assets/listings-images/image 37_4_img.png"),
  assetUrl("assets/listings-images/image 7_4_img.png"),
];
const LISTING_IMAGE_LIBRARY = [
  assetUrl("assets/listings-images/image 9_2_img.png"),
  assetUrl("assets/listings-images/image 11_1_img.png"),
  assetUrl("assets/listings-images/image 6_3_img.png"),
  assetUrl("assets/listings-images/image 2_3_img.png"),
  assetUrl("assets/listings-images/image 32_6_img.png"),
  assetUrl("assets/listings-images/image 37_4_img.png"),
  assetUrl("assets/listings-images/image 7_4_img.png"),
  assetUrl("assets/listings-images/image 5_2_img.png"),
  assetUrl("assets/listings-images/image 8_5_img.png"),
  assetUrl("assets/listings-images/image 13_1_img.png"),
  assetUrl("assets/listings-images/image 35_5_img.png"),
  assetUrl("assets/listings-images/image 28_9_img.png"),
];

// AI title/description suggestions (simulated) — tuned to AnimalCare's profile.
const AI_TITLE_SUGGESTIONS = [
  "Established Small Animal Practice with a Loyal Following",
  "Turnkey Veterinary Clinic with a Two-Year Transition",
  "Cash-Flowing Companion Animal Hospital in Lakeside",
  "Profitable Small Animal Practice with a Retiring Owner",
  "Well-Staffed Clinic with Two Decades of Community Goodwill",
];
const AI_DESCRIPTION_SUGGESTIONS = [
  "A well-established small animal practice with a loyal client base and a retiring owner offering a smooth, hands-on transition.",
  "Fully operational GP hospital with strong cash flow, a tenured support team, and two decades of community trust behind it.",
  "Turnkey small animal hospital in a stable suburban market, with an experienced owner ready to support a two-year handoff.",
  "Profitable, well-staffed veterinary practice with consistent revenue growth and a reputation built over more than 20 years.",
];

const AI_IMAGE_LIMIT = 3;

// Mutable store for the seller's listing. Mirrors the router's event pattern so
// the Preview card and the editor slideout stay in sync without prop threading.
const MY_LISTING = {
  id: "vv-2481",               // public listing id — used in the anonymous landing URL /l/vv-2481
  status: "live",              // "draft" | "live" — the Promotions hub unlocks only when live
  featured: null,              // FeaturedPromotion | null — set by the Featured Listing flow
  title: PRACTICE.listingTitle,
  description: PRACTICE.teaser,
  image: assetUrl("assets/listings-images/image 9_2_img.png"),
  titlePending: false,         // a manual title edit awaiting CareOwner approval
  pendingTitle: null,
  descriptionPending: false,   // a manual description edit awaiting CareOwner approval
  pendingDescription: null,
  aiUses: 0,                   // AI image generations consumed (max AI_IMAGE_LIMIT)
};
function updateMyListing(patch) {
  Object.assign(MY_LISTING, patch);
  window.dispatchEvent(new Event("co:listing"));
}
function useMyListing() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const h = () => force(n => n + 1);
    window.addEventListener("co:listing", h);
    return () => window.removeEventListener("co:listing", h);
  }, []);
  return MY_LISTING;
}
window.MY_LISTING_RECOMMENDED_IMAGES = MY_LISTING_RECOMMENDED_IMAGES;
window.LISTING_IMAGE_LIBRARY = LISTING_IMAGE_LIBRARY;
window.AI_TITLE_SUGGESTIONS = AI_TITLE_SUGGESTIONS;
window.AI_DESCRIPTION_SUGGESTIONS = AI_DESCRIPTION_SUGGESTIONS;
window.AI_IMAGE_LIMIT = AI_IMAGE_LIMIT;
window.MY_LISTING = MY_LISTING;
window.updateMyListing = updateMyListing;
window.useMyListing = useMyListing;

window.LISTINGS = LISTINGS;
window.LISTING_PRACTICE_TYPES = LISTING_PRACTICE_TYPES;
window.LISTING_LOCATION_TYPES = LISTING_LOCATION_TYPES;
window.LISTING_STATUSES = LISTING_STATUSES;

window.MARKET_PROFILE_STAFF = MARKET_PROFILE_STAFF;
window.REQUESTS = REQUESTS;
window.REQUEST_TYPE_LABELS = REQUEST_TYPE_LABELS;
window.OFFERS = OFFERS;
window.THREADS = THREADS;
window.MEETINGS = MEETINGS;
window.ACTIVITY = ACTIVITY;

// ─── Promote Your Practice (spec v1.2) ────────────────────────────────────────
// Data shapes (plain JS mirror of the product spec's types):
//   PromoAudience  = "aspiring" | "expanding" (buyer ad sets; the creative pool
//                     also keeps "corporate" | "other" angles for reuse)
//   AnonymityMode  = "anonymous" | "named" | "semi_anonymous"
//   PromoChannel   = "meta_ads" | "share_link" | "featured" | "local_pubs" | "pr"
//   ChannelMetrics  { impressions, clicks, inquiries }
//   CreativeVariant { id, audience, headline, primaryText, cta, imageUrl, edited }
//   AdCampaign      { id, listingId, audiences, variants, anonymityMode (always
//                     "anonymous" — ads run from VetVet's Meta ad account),
//                     plan ("starter" | "standard" | "max"), planLabel, price,
//                     durationDays, status ("in_review" → CareOwner review →
//                     "awaiting_payment" → paid → "active" | "completed"),
//                     landingUrl, metrics?, createdAt }
//   FeaturedPromotion { id, listingId, tier ("featured_14" | "featured_30" | "featured_60"),
//                     startAt, endAt, status ("active" | "expired" | "cancelled"),
//                     placements { marketplaceTop, vetvetCarousel, emailBlasts,
//                     socialPosts, matchingBoost }, autoRenew, metrics? }
//   PlacementCandidate { id, outletName, type ("vma" | "business_journal" |
//                     "community_paper" | "digital" | "other"), reachEstimate,
//                     relevanceScore, relevanceReason, format, estCost, leadTimeDays,
//                     submissionPath ("self" | "concierge" | "portal") }
//   PlacementOrder  { id, listingId, candidateId, anonymityMode, creative,
//                     fulfillment ("self" | "concierge"), status ("draft" |
//                     "submitted" | "live" | "completed"), landingUrl, metrics? }
//   PressAngle      { id, title, summary }
//   PressKit        { bio, history, quotableStats[], photos[], boilerplate }
//   ReporterTarget  { id, name, outlet, beat, relevanceReason, pitchDraft,
//                     status ("suggested" | "pitched" | "opened" | "replied" | "published") }
//   PrCampaign      { id, listingId, angle, kit, targets[], landingUrl, metrics? }
//   ShareTarget     { mode, url, token? }
//   Lead            { id, listingId, channel, source?, contact, createdAt }
//
// Core principle: anonymity is per-channel. Meta ads + Featured are anonymous;
// Share Links offer both; Local Advertising is named by default with a
// semi-anonymous option; Press & PR is always named (real story, real practice).

// Feature flags — one per channel so any can be toggled off (renders the hub
// card in a disabled "Coming soon" state).
const PROMO_META_ENABLED = true;
const PROMO_SHARE_ENABLED = true;
const PROMO_FEATURED_ENABLED = true;
const PROMO_LOCALPUBS_ENABLED = true;
const PROMO_PR_ENABLED = true;
const PROMO_DVM_ENABLED = true;

// The two buyer audiences a Meta campaign can target (Figma 275:8232). Copy is
// shown verbatim on the wizard's Campaign Details step.
const PROMO_AUDIENCES = [
  { id: "aspiring", label: "Aspiring practice owners", icon: "stethoscope", hint: "Recommended",
    desc: "Veterinarians interested in acquiring an established practice and becoming an owner. VetVet uses veterinary-profession signals, buyer engagement, and similar-audience modeling to reach potential buyers." },
  { id: "expanding", label: "Expanding practice owners", icon: "building",
    desc: "Existing veterinary practice owners who may want another location in or near your market. VetVet uses its practice-owner network and Meta's audience-matching tools to help reach qualified owners." },
];

// Canned creative per audience, each written to a distinct angle (aspiring =
// "be your own boss", expanding = "bolt-on growth", corporate = "diligence-ready
// asset"). generateCreative deals the first three per audience; "Regenerate"
// cycles onward. All copy is anonymized — no practice name, street, city, or
// owner name.
const PROMO_CREATIVE_POOL = {
  aspiring: [
    { headline: "Ready to be your own boss?", cta: "See the opportunity", imageUrl: assetUrl("assets/listings-images/image 9_2_img.png"),
      primaryText: "An established suburban Midwest small-animal practice is for sale — $2M–$3M revenue, ~25% EBITDA margins, and a tenured team that stays. The retiring owner will mentor you through a hands-on transition." },
    { headline: "Own the practice you'd build yourself", cta: "Request more info", imageUrl: assetUrl("assets/listings-images/image 37_4_img.png"),
      primaryText: "Skip the startup years. Step into a cash-flowing suburban practice with 1,200+ active clients, modern workflows, and an owner committed to a 2–3 year handoff." },
    { headline: "From associate to owner — without the leap of faith", cta: "Get the details", imageUrl: assetUrl("assets/listings-images/image 7_4_img.png"),
      primaryText: "The rare listing built for a first-time owner: verified financials, a loyal client base, and flexible deal structures on the table." },
    { headline: "Your name on the door in 2026", cta: "Learn more", imageUrl: assetUrl("assets/listings-images/image 11_1_img.png"),
      primaryText: "A profitable Midwest small-animal practice with a retiring owner is quietly looking for its next owner-DVM. Confidential until you inquire." },
  ],
  expanding: [
    { headline: "Grow by acquisition — right in your backyard", cta: "Request more info", imageUrl: assetUrl("assets/listings-images/image 6_3_img.png"),
      primaryText: "A profitable small-animal practice near you is quietly for sale. $2M–$3M revenue, ~25% margins, and a full team in place — a clean bolt-on for a growing practice." },
    { headline: "Add a second location without starting from zero", cta: "See the numbers", imageUrl: assetUrl("assets/listings-images/image 2_3_img.png"),
      primaryText: "Established suburban practice with verified financials and a tenured support team. The owner is retiring and prefers a buyer who'll keep the culture intact." },
    { headline: "A bolt-on opportunity in the suburban Midwest", cta: "Get the details", imageUrl: assetUrl("assets/listings-images/image 5_2_img.png"),
      primaryText: "1,200+ active clients, 5 exam rooms, and +8% growth. Expand your footprint with a practice that already runs itself." },
    { headline: "Your next location is closer than you think", cta: "Learn more", imageUrl: assetUrl("assets/listings-images/image 8_5_img.png"),
      primaryText: "Quietly listed: a cash-flowing small-animal practice with room to consolidate services and grow. Anonymous until you request access." },
  ],
  corporate: [
    { headline: "Verified suburban performer, ready to transact", cta: "Request the snapshot", imageUrl: assetUrl("assets/listings-images/image 18_8_img.png"),
      primaryText: "$2M–$3M revenue, ~25% adjusted EBITDA margin, low staff turnover, and platform-verified financials. Owner open to a 2–3 year transition." },
    { headline: "A clean add to your Midwest platform", cta: "Request more info", imageUrl: assetUrl("assets/listings-images/image 28_9_img.png"),
      primaryText: "Established small-animal GP with durable client economics, tenured staff, and modern facilities. Diligence-ready data room on request." },
    { headline: "Suburban Midwest GP · +8% YoY", cta: "See the opportunity", imageUrl: assetUrl("assets/listings-images/image 13_1_img.png"),
      primaryText: "Multi-doctor practice with consistent growth, verified EBITDA, and an owner who'll support integration. Anonymity protected until you connect." },
    { headline: "Diligence-ready and quietly for sale", cta: "Get the details", imageUrl: assetUrl("assets/listings-images/image 35_5_img.png"),
      primaryText: "Institutional-quality records meet neighborhood goodwill: verified financials, documented operations, and a motivated, flexible seller." },
  ],
  other: [
    { headline: "A thriving veterinary practice is for sale", cta: "Request more info", imageUrl: assetUrl("assets/listings-images/image 32_6_img.png"),
      primaryText: "Established suburban Midwest small-animal practice — strong cash flow, loyal clients, and a retiring owner offering a smooth transition." },
    { headline: "Know someone ready to own a practice?", cta: "Learn more", imageUrl: assetUrl("assets/listings-images/image 9_2_img.png"),
      primaryText: "A profitable, well-staffed veterinary practice is quietly on the market. Pass it along — inquiries stay confidential." },
    { headline: "Quietly for sale: a practice with deep roots", cta: "Get the details", imageUrl: assetUrl("assets/listings-images/image 11_1_img.png"),
      primaryText: "Two decades of community trust, verified financials, and a team that stays. The right buyer gets a hands-on handoff." },
    { headline: "An owner-ready practice, minus the guesswork", cta: "See the opportunity", imageUrl: assetUrl("assets/listings-images/image 6_3_img.png"),
      primaryText: "Verified numbers, documented operations, and flexible deal structures. Confidential until you're ready to connect." },
  ],
};

// CTA choices offered in the creative editor.
const PROMO_CTA_OPTIONS = ["Request more info", "Learn more", "See the opportunity", "Get the details", "See the numbers", "Request the snapshot"];

// Pre-written captions for the Trusted Share link, one per audience. {url} is
// replaced with the tokenized link carrying that audience's ?src= tag so mock
// metrics can attribute inquiries per channel.
const PROMO_SHARE_CAPTIONS = [
  { audience: "individual_dvm", src: "dvm", label: "To an associate / DVM",
    text: "Before this goes any wider — I've decided to sell AnimalCare, and I think you'd be a phenomenal owner. Here's the full picture, shared privately: {url}" },
  { audience: "neighbor_practice", src: "neighbor", label: "To a neighboring practice",
    text: "Hi — I'm quietly exploring a sale of AnimalCare and wanted you to see the details before anyone else: {url}" },
  { audience: "corporate", src: "corp", label: "To a corporate / group buyer",
    text: "Hello — sharing the full profile of my practice, AnimalCare, ahead of any broader process. Details here: {url}" },
  { audience: "other", src: "direct", label: "To anyone you trust",
    text: "I'm selling my veterinary practice and wanted to share the details with you directly: {url}" },
];

// Terms that would de-anonymize the practice if they leak into anonymous-mode ad
// copy. The creative editor lints edited text against these.
const PROMO_IDENTIFYING_TERMS = [PRACTICE.name, "412 Lakeview", "Lakeside", PRACTICE.website, "Thompson"];
function lintAnonymity(text) {
  const t = (text || "").toLowerCase();
  return PROMO_IDENTIFYING_TERMS.filter(term => t.includes(term.toLowerCase()));
}

// ── Promo store (event pattern, same as MY_LISTING) ──
// The trusted-share token survives refresh via localStorage so an open /l/s/:token
// tab keeps working; everything else is in-memory prototype state.
const PROMO = {
  campaigns: [],       // AdCampaign[], newest first — populated when the wizard launches
  namedToken: (() => { try { return localStorage.getItem("co.promoToken"); } catch (e) { return null; } })(),
  ownAccount: null,    // { connected, pageName } after the mock Facebook OAuth
  leads: [],           // { id, name, email, note, mode, src, at } — mock lead capture
  placements: [],      // PlacementOrder[] — Local Advertising orders, newest first
  prCampaign: null,    // PrCampaign | null — the active Press & PR outreach
  assets: [],          // reusable asset library: creative + press kits generated anywhere
};
function updatePromo(patch) {
  Object.assign(PROMO, patch);
  window.dispatchEvent(new Event("co:promo"));
}
function usePromo() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const h = () => force(n => n + 1);
    window.addEventListener("co:promo", h);
    return () => window.removeEventListener("co:promo", h);
  }, []);
  return PROMO;
}
// Mint the unlisted trusted-share token on first use.
function ensureNamedToken() {
  if (!PROMO.namedToken) {
    const token = "t-" + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem("co.promoToken", token); } catch (e) {}
    updatePromo({ namedToken: token });
  }
  return PROMO.namedToken;
}
// Absolute URL for a share path (prepends the GitHub Pages mount base when set).
function promoShareUrl(path) {
  return window.location.origin + (window.__APP_BASE__ || "") + path;
}

// TODO(api): push to HubSpot/CRM — for now landing-page inquiries land here.
function addPromoLead(lead) {
  PROMO.leads = [{ id: "lead_" + Math.random().toString(36).slice(2, 8), at: "Just now", ...lead }, ...PROMO.leads];
  window.dispatchEvent(new Event("co:promo"));
}

// ── Mock services ──
const promoDelay = (ms) => new Promise(res => setTimeout(res, ms));
const promoMockId = (prefix) => prefix + "_" + Math.random().toString(36).slice(2, 10);

// TODO(api): replace with the real AI creative-generation endpoint.
// Returns three CreativeVariant drafts per selected audience — one ad set with
// three tailored ad versions, matching the pricing card's promise.
async function generateCreative(listing, audiences) {
  await promoDelay(1100 + Math.random() * 500);
  return audiences.flatMap(aud =>
    (PROMO_CREATIVE_POOL[aud] || PROMO_CREATIVE_POOL.other).slice(0, 3).map((t, i) => ({
      id: promoMockId("cr"), audience: aud, headline: t.headline, primaryText: t.primaryText,
      cta: t.cta, imageUrl: t.imageUrl, edited: false, poolIdx: i,
    }))
  );
}

// Mock "regenerate": deal the next canned variant for this audience.
async function regenerateCreative(variant) {
  await promoDelay(600 + Math.random() * 400);
  const pool = PROMO_CREATIVE_POOL[variant.audience] || PROMO_CREATIVE_POOL.other;
  const next = ((variant.poolIdx == null ? 0 : variant.poolIdx) + 1) % pool.length;
  const t = pool[next];
  return { ...variant, headline: t.headline, primaryText: t.primaryText, cta: t.cta, imageUrl: t.imageUrl, edited: false, poolIdx: next };
}

// Campaign requests go to CareOwner's ads desk, not straight to Meta: the team
// reviews the request, emails an approval + payment link, and only launches
// (manually, from VetVet's Meta ad account) once the flat rate is paid.
// TODO(api): replace mockAdService with the real request/approval/checkout backend.
const mockAdService = {
  async submitRequest(campaign) { await promoDelay(1400); return { campaignId: promoMockId("cmp") }; },
};

// ── Meta ads — one flat managed price ──
// A single prepaid price covers everything: creative, delivery from VetVet's Meta
// ad account, and hands-on management by the CareOwner ads team. Sellers never set
// budgets or see Meta invoices, and the price is shown up front on the overview so
// there's nothing to "select" mid-flow. We deliberately don't surface an included
// ad-spend figure — the gap between price and delivered spend is our management fee,
// and itemizing it just prompts "where's the rest going?" questions.
// `price` covers the first 30 days (including the one-time `setup`); each
// additional 30 days renews at `renew`.
// TODO(api): checkout happens via the emailed payment link after CareOwner approves.
const META_AD_PLAN = {
  price: 1200, days: 30, setup: 250, renew: 950,
  benefits: [
    "30-day Meta advertising campaign",
    "Ad spend + management included",
    "Up to 2 buyer audiences",
    "3 ad versions per audience",
    "Your practice name and exact address are not shown",
    "Buyer inquiries sent to your email and CareOwner inbox",
    "Meta-optimized delivery may include Facebook, Instagram, Messenger, WhatsApp, and Threads",
    "Performance report every 30 days",
  ],
};

// Past + in-pipeline promotions seeded so the hub's Created tab has history on
// first load. Live items created this session (PROMO.campaigns, MY_LISTING
// .featured, PROMO.placements, PROMO.prCampaign) render above these. Rows use
// the Created-tab display shape, not the per-channel store shapes.
// `channel` keys each row to its dashboard tab (meta_ads | dvm | featured |
// local_pubs | pr) so a tab can filter to just its own promotions.
const PROMO_HISTORY = [
  { id: "hist-1", channel: "meta_ads", icon: "facebook", name: "Meta buyer campaign — Aspiring + Expanding practice owners",
    type: "Meta Ads", status: "awaiting_payment", created: "Jul 28, 2026",
    window: "Starts after payment", amount: "$1,200", path: "/practice/promotions/ads" },
  { id: "hist-2", channel: "meta_ads", icon: "facebook", name: "Meta buyer campaign — Aspiring practice owners",
    type: "Meta Ads", status: "completed", created: "Jun 2, 2026",
    window: "Jun 5 → Jul 5", amount: "$1,200", path: "/practice/promotions/ads" },
  { id: "hist-3", channel: "featured", icon: "star", name: "Featured Listing — 14 days",
    type: "Featured Listing", status: "expired", created: "May 2, 2026",
    window: "May 2 → May 16", amount: "$99", path: "/practice/promotions/featured" },
  { id: "hist-4", channel: "local_pubs", icon: "newspaper", name: "Illinois VMA — Epitome newsletter",
    type: "Local ad", plan: "Concierge placement", status: "completed", created: "Apr 14, 2026",
    window: "Ran in the May issue", amount: "$524", path: "/practice/promotions/local-ads" },
  { id: "hist-5", channel: "dvm", icon: "users", name: "Priya Raman — NextChapter Veterinary",
    type: "DVM referral", plan: "Talent Acquisition Specialist", status: "active", created: "Jul 19, 2026",
    window: "2 DVMs introduced", amount: "No cost", path: "/practice/promotions/dvm-buyers" },
];

// Dashboard activity feed — the latest status changes and notifications across
// every channel, newest first. `tint` drives the icon chip color; `attention`
// pulls the item to the top styling-wise (something needs the owner's action).
// TODO(api): replace with the real notifications stream.
const PROMO_UPDATES = [
  { id: "up-1", icon: "dollarSign", tint: "amber", attention: true,
    text: "<b>Meta ads campaign approved</b> — pay to launch your 30-day campaign.",
    time: "2h ago", path: "/practice/promotions#meta" },
  { id: "up-2", icon: "message", tint: "teal",
    text: "<b>Priya Raman</b> replied about a DVM who's ready to buy.",
    time: "1d ago", path: "/messages" },
  { id: "up-3", icon: "eye", tint: "indigo",
    text: "Your landing page got <b>34 views</b> from ads this week.",
    time: "2d ago", path: "/practice/promotions#meta" },
  { id: "up-4", icon: "star", tint: "gray",
    text: "<b>Featured Listing</b> boost ended after 14 days.",
    time: "Jul 16", path: "/practice/promotions#featured" },
  { id: "up-5", icon: "newspaper", tint: "gray",
    text: "Your <b>Illinois VMA</b> ad ran in the May issue.",
    time: "May 3", path: "/practice/promotions#local" },
];

// Believable day-one numbers so the hub's results strip renders after a launch.
function mockCampaignMetrics() {
  const impressions = 9200 + Math.floor(Math.random() * 4800);
  const clicks = Math.round(impressions * (0.028 + Math.random() * 0.012));
  const inquiries = 3 + Math.floor(Math.random() * 5);
  return { impressions, clicks, inquiries };
}
// Smaller numbers for owned-channel / print placements.
function mockSmallMetrics() {
  const impressions = 1800 + Math.floor(Math.random() * 2600);
  const clicks = Math.round(impressions * (0.04 + Math.random() * 0.02));
  const inquiries = 1 + Math.floor(Math.random() * 3);
  return { impressions, clicks, inquiries };
}

// ── Featured Listing ──
// Benefit bundles per tier. `placements` mirrors the FeaturedPromotion interface;
// `extras` are display-only perks for higher tiers.
const FEATURED_TIERS = [
  { id: "featured_14", days: 14, price: 99, label: "14 days",
    placements: { marketplaceTop: true, vetvetCarousel: true, emailBlasts: 1, socialPosts: 1, matchingBoost: false },
    extras: [] },
  { id: "featured_30", days: 30, price: 179, label: "30 days", recommended: true,
    placements: { marketplaceTop: true, vetvetCarousel: true, emailBlasts: 2, socialPosts: 2, matchingBoost: true },
    extras: ["Enhanced listing card"] },
  { id: "featured_60", days: 60, price: 299, label: "60 days",
    placements: { marketplaceTop: true, vetvetCarousel: true, emailBlasts: 4, socialPosts: 4, matchingBoost: true },
    extras: ["Enhanced listing card", "“Just Listed” spotlight"] },
];

// Fair rotation among active featured listings: shift the order once a day so no
// listing permanently owns the top slot. TODO(api): server-side round-robin.
function rotateFeatured(list) {
  if (list.length < 2) return list;
  const shift = Math.floor(Date.now() / 86400000) % list.length;
  return list.slice(shift).concat(list.slice(0, shift));
}

// TODO(api): replace with the real billing + placement backend.
const mockFeaturedService = {
  async activate(listingId, tierId, autoRenew) {
    await promoDelay(1500);
    const tier = FEATURED_TIERS.find(t => t.id === tierId);
    const start = new Date();
    const end = new Date(start.getTime() + tier.days * 86400000);
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return {
      id: promoMockId("feat"), listingId, tier: tierId,
      startAt: fmt(start), endAt: fmt(end), endTs: end.getTime(),
      status: "active", placements: { ...tier.placements }, autoRenew: !!autoRenew,
      metrics: mockSmallMetrics(),
    };
  },
  async cancel(id) { await promoDelay(900); },
};

// ── Local Advertising (placement finder) ──
const PLACEMENT_TYPE_LABELS = { vma: "State VMA", business_journal: "Business journal", community_paper: "Community paper", digital: "Digital / niche", other: "Other" };

const PLACEMENT_CANDIDATES = [
  { id: "pc-ivma", outletName: "Illinois VMA — Epitome newsletter", type: "vma",
    reachEstimate: "4,200 member DVMs", relevanceScore: 94,
    relevanceReason: "Every reader is a licensed Illinois veterinarian — the densest buyer audience available.",
    format: "Quarter-page classified + digital edition", estCost: 425, leadTimeDays: 21, submissionPath: "concierge" },
  { id: "pc-vetdaily", outletName: "VetPractice Daily", type: "digital",
    reachEstimate: "31,000 subscribers", relevanceScore: 88,
    relevanceReason: "National practice-owner newsletter with a dedicated practices-for-sale section.",
    format: "Sponsored listing + one newsletter slot", estCost: 390, leadTimeDays: 5, submissionPath: "concierge" },
  { id: "pc-cbj", outletName: "Chicago Business Journal", type: "business_journal",
    reachEstimate: "58,000 readers", relevanceScore: 81,
    relevanceReason: "Reaches acquisition-minded owners and investors across the Chicago metro.",
    format: "Businesses-for-sale listing (print + web)", estCost: 650, leadTimeDays: 10, submissionPath: "portal" },
  { id: "pc-mwvet", outletName: "Midwest Veterinarian Quarterly", type: "vma",
    reachEstimate: "9,800 readers", relevanceScore: 74,
    relevanceReason: "Regional profession press covering IL / WI / IN with strong associate-DVM readership.",
    format: "Half-page display", estCost: 540, leadTimeDays: 30, submissionPath: "concierge" },
  { id: "pc-lakeg", outletName: "Lakeside Gazette", type: "community_paper",
    reachEstimate: "12,500 households", relevanceScore: 62,
    relevanceReason: "Hyper-local reach — good for finding a neighbor buyer, but higher identification risk in a small market.",
    format: "Eighth-page display ad", estCost: 180, leadTimeDays: 7, submissionPath: "self" },
];

// TODO(api): replace with the real placement-discovery + insertion-order backend.
const mockLocalPubsService = {
  async findPlacements(region, type, budget) {
    await promoDelay(1200 + Math.random() * 500);
    return PLACEMENT_CANDIDATES
      .filter(c => type === "all" || c.type === type)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  },
  async submit(order) { await promoDelay(1300); return { orderId: promoMockId("po") }; },
};

// Outlet-sized creative per anonymity mode. Named copy uses the real practice;
// semi-anonymous keeps region + practice type only.
function localAdCreative(candidate, mode) {
  if (mode === "named") {
    return {
      id: promoMockId("cr"), audience: "other", edited: false,
      headline: "AnimalCare — Lakeside's trusted small-animal practice — is for sale",
      primaryText: "After 12 years serving Lakeside families, Dr. Lisa Thompson is seeking the right successor for AnimalCare: $2.45M revenue, a 16-person team, and a loyal 1,240-client base. Hands-on transition offered.",
      cta: "Inquire about AnimalCare", imageUrl: assetUrl("assets/practice-hero.jpg"),
      formatNote: candidate.format,
    };
  }
  return {
    id: promoMockId("cr"), audience: "other", edited: false,
    headline: "Established small-animal practice for sale — suburban Chicago area",
    primaryText: "Profitable suburban Midwest practice with $2M–$3M revenue, ~25% EBITDA margins, and a tenured team. Retiring owner offers a 2–3 year transition. Confidential inquiries via CareOwner.",
    cta: "Request more info", imageUrl: assetUrl("assets/listings-images/image 9_2_img.png"),
    formatNote: candidate.format,
  };
}

// ── Find DVM Buyers — Talent Acquisition Specialist network ──
// Recruiters who place DVMs in practices for a living — which means they know
// which associates in their networks are quietly exploring ownership. CareOwner
// pays the specialist a referral fee when their intro leads to a sale; sellers
// pay nothing extra. All contact happens in CareOwner Messages so the thread
// (and any referral outcome) is tracked end to end.
//
// This is the platform-wide directory: every specialist is discoverable, and
// `connection` tracks where the seller stands with each one —
//   "open"      → on the platform, not messaged yet
//   "sent"      → messaged, still waiting on a first reply
//   "connected" → replied; the specialist can now see the practice profile
// `unread` counts messages waiting on the seller in that thread.
// TODO(api): replace with the vetted-recruiter directory service.
const TA_SPECIALISTS = [
  { id: "ta-1", name: "Jordan Beckett", initials: "JB", color: "teal", agency: "VetTalent Partners",
    title: "Senior DVM Recruiter", location: "Chicago, IL", regions: ["Illinois", "Wisconsin", "Indiana"],
    focus: "Small animal GP", worksWith: ["Associate DVMs", "GP practice owners", "New graduates"],
    dvmNetwork: 240, buyerReady: 7, placements: 31, avgResponse: "~3 hours", verified: true,
    connection: "connected", unread: 1,
    about: "Twelve years placing associates across Chicagoland general practices. I keep a running shortlist of DVMs who ask about ownership on every placement call — several are actively looking to buy in the suburbs." },
  { id: "ta-2", name: "Maria Santos", initials: "MS", color: "amber", agency: "Heartland Vet Recruiting",
    title: "Principal Recruiter", location: "Madison, WI", regions: ["Wisconsin", "Minnesota", "Iowa"],
    focus: "Small animal GP", worksWith: ["Associate DVMs", "Practice managers", "Relief veterinarians"],
    dvmNetwork: 185, buyerReady: 5, placements: 24, avgResponse: "~1 day", verified: true,
    connection: "connected", unread: 0,
    about: "I run the upper Midwest's largest relief-DVM network. Relief vets see dozens of practices a year — the ones ready to settle down often want to buy, and I know who they are." },
  { id: "ta-3", name: "Devon Clarke", initials: "DC", color: "indigo", agency: "Clarke & Associates",
    title: "Veterinary Search Consultant", location: "Indianapolis, IN", regions: ["Indiana", "Ohio", "Kentucky", "Illinois"],
    focus: "Emergency & specialty", worksWith: ["Specialty DVMs", "ER veterinarians", "Medical directors"],
    dvmNetwork: 150, buyerReady: 3, placements: 19, avgResponse: "~5 hours", verified: true,
    connection: "connected", unread: 0,
    about: "I place specialty and emergency clinicians across the lower Midwest, and work with several medical directors leaving corporate medicine who want to own an independent practice instead." },
  { id: "ta-4", name: "Priya Raman", initials: "PR", color: "violet", agency: "NextChapter Veterinary",
    title: "Founder & Lead Recruiter", location: "Minneapolis, MN", regions: ["Minnesota", "Wisconsin", "National (remote)"],
    focus: "Corporate-exit DVMs", worksWith: ["Corporate associates", "Regional medical directors", "Practice buyers"],
    dvmNetwork: 320, buyerReady: 11, placements: 42, avgResponse: "~2 hours", verified: true,
    connection: "sent", unread: 0,
    about: "I specialize in DVMs leaving consolidator groups — the single richest pool of ownership-minded buyers — and maintain an ownership-interest waitlist I re-verify every quarter." },
  { id: "ta-5", name: "Sam Whitaker", initials: "SW", color: "green", agency: "Prairie State Talent",
    title: "DVM Recruiter", location: "Springfield, IL", regions: ["Illinois", "Missouri"],
    focus: "Rural & mixed animal", worksWith: ["Mixed-animal DVMs", "Rural practice owners", "New graduates"],
    dvmNetwork: 95, buyerReady: 2, placements: 12, avgResponse: "~2 days", verified: false,
    connection: "open", unread: 0,
    about: "I cover downstate Illinois and Missouri farm country. Smaller network, deep roots — I know the handful of mixed-animal DVMs serious about taking over a rural practice." },
  { id: "ta-6", name: "Elaine Foster", initials: "EF", color: "rose", agency: "Foster Veterinary Search",
    title: "Executive Recruiter", location: "Columbus, OH", regions: ["Ohio", "Michigan", "Pennsylvania"],
    focus: "Multi-doctor practices", worksWith: ["Senior associates", "Practice partners", "Buying groups"],
    dvmNetwork: 210, buyerReady: 6, placements: 28, avgResponse: "~4 hours", verified: true,
    connection: "open", unread: 0,
    about: "Twenty years recruiting for multi-doctor hospitals. I work with senior associates assembling partner groups to buy larger practices — a strong match for listings above $2M revenue." },
  { id: "ta-7", name: "Marcus Webb", initials: "MW", color: "teal", agency: "Great Lakes Vet Search",
    title: "Senior Recruiter", location: "Detroit, MI", regions: ["Michigan", "Ohio", "Indiana"],
    focus: "Small animal GP", worksWith: ["Associate DVMs", "Practice managers"],
    dvmNetwork: 165, buyerReady: 4, placements: 22, avgResponse: "~6 hours", verified: true,
    connection: "sent", unread: 0,
    about: "I cover the Great Lakes corridor with a focus on associates in their first five years of practice — the group most likely to be weighing ownership for the first time." },
  { id: "ta-8", name: "Alicia Nunez", initials: "AN", color: "amber", agency: "Bright Path Veterinary",
    title: "Talent Partner", location: "St. Louis, MO", regions: ["Missouri", "Illinois", "Kansas"],
    focus: "Small animal GP", worksWith: ["Associate DVMs", "New graduates", "Relief veterinarians"],
    dvmNetwork: 140, buyerReady: 3, placements: 17, avgResponse: "~1 day", verified: true,
    connection: "sent", unread: 0,
    about: "I place new and early-career graduates across the lower Midwest and keep in touch long after placement — several of my alumni are now shopping for their first practice." },
  { id: "ta-9", name: "Grant Halloway", initials: "GH", color: "indigo", agency: "Halloway Veterinary Talent",
    title: "Managing Director", location: "Nashville, TN", regions: ["Tennessee", "Kentucky", "Georgia"],
    focus: "Multi-doctor practices", worksWith: ["Senior associates", "Medical directors", "Buying groups"],
    dvmNetwork: 230, buyerReady: 8, placements: 35, avgResponse: "~3 hours", verified: true,
    connection: "open", unread: 0,
    about: "I recruit leadership for multi-doctor hospitals across the Southeast and regularly advise medical directors who want equity rather than another salaried role." },
  { id: "ta-10", name: "Nina Petrova", initials: "NP", color: "violet", agency: "Summit Vet Recruiting",
    title: "Principal Recruiter", location: "Denver, CO", regions: ["Colorado", "Utah", "New Mexico"],
    focus: "Corporate-exit DVMs", worksWith: ["Corporate associates", "Regional medical directors"],
    dvmNetwork: 275, buyerReady: 9, placements: 38, avgResponse: "~2 hours", verified: true,
    connection: "open", unread: 0,
    about: "I built my desk on consolidator burnout — I talk with Mountain West DVMs leaving corporate groups every week, and many say ownership is the only thing that would keep them in clinical practice." },
  { id: "ta-11", name: "Terrence Boyd", initials: "TB", color: "green", agency: "Boyd & Kline Search",
    title: "Veterinary Search Consultant", location: "Columbus, OH", regions: ["Ohio", "West Virginia", "Pennsylvania"],
    focus: "Emergency & specialty", worksWith: ["ER veterinarians", "Specialty DVMs"],
    dvmNetwork: 120, buyerReady: 2, placements: 15, avgResponse: "~8 hours", verified: false,
    connection: "open", unread: 0,
    about: "Emergency and specialty desk covering the Ohio Valley. Smaller network, but ER clinicians burn out fast and a surprising number ask about buying a daytime GP practice." },
  { id: "ta-12", name: "Hannah Reyes", initials: "HR", color: "rose", agency: "Cornerstone Vet Careers",
    title: "Founder", location: "Austin, TX", regions: ["Texas", "Oklahoma", "Louisiana"],
    focus: "Small animal GP", worksWith: ["Associate DVMs", "Practice owners", "New graduates"],
    dvmNetwork: 295, buyerReady: 10, placements: 44, avgResponse: "~4 hours", verified: true,
    connection: "open", unread: 0,
    about: "I run the largest independent veterinary recruiting practice in Texas and maintain a private ownership-interest list I refresh twice a year." },
  { id: "ta-13", name: "Owen Fitzgerald", initials: "OF", color: "teal", agency: "Northlight Talent Group",
    title: "DVM Recruiter", location: "Minneapolis, MN", regions: ["Minnesota", "North Dakota", "Wisconsin"],
    focus: "Rural & mixed animal", worksWith: ["Mixed-animal DVMs", "Rural practice owners"],
    dvmNetwork: 110, buyerReady: 3, placements: 14, avgResponse: "~2 days", verified: false,
    connection: "open", unread: 0,
    about: "I specialize in hard-to-fill rural and mixed-animal roles across the northern plains, where succession is the number one reason a practice comes to market." },
  { id: "ta-14", name: "Claire Dunn", initials: "CD", color: "amber", agency: "Dunn Veterinary Partners",
    title: "Executive Recruiter", location: "Philadelphia, PA", regions: ["Pennsylvania", "New Jersey", "Delaware"],
    focus: "Multi-doctor practices", worksWith: ["Senior associates", "Practice partners"],
    dvmNetwork: 190, buyerReady: 5, placements: 26, avgResponse: "~5 hours", verified: true,
    connection: "open", unread: 0,
    about: "I place partner-track associates into multi-doctor hospitals along the eastern corridor, and often end up brokering the partnership conversation myself." },
  { id: "ta-15", name: "Rafael Ortiz", initials: "RO", color: "indigo", agency: "Pacific Vet Talent",
    title: "Senior Recruiter", location: "Portland, OR", regions: ["Oregon", "Washington", "Idaho"],
    focus: "Small animal GP", worksWith: ["Associate DVMs", "Relief veterinarians", "New graduates"],
    dvmNetwork: 205, buyerReady: 6, placements: 29, avgResponse: "~6 hours", verified: true,
    connection: "open", unread: 0,
    about: "I cover the Pacific Northwest, where high practice values push many associates to look for ownership in more affordable Midwest markets." },
  { id: "ta-16", name: "Sofia Marchetti", initials: "SM", color: "violet", agency: "Marchetti Search",
    title: "Talent Acquisition Lead", location: "Kansas City, MO", regions: ["Missouri", "Kansas", "Nebraska", "Iowa"],
    focus: "Corporate-exit DVMs", worksWith: ["Corporate associates", "Practice managers"],
    dvmNetwork: 175, buyerReady: 7, placements: 21, avgResponse: "~1 day", verified: true,
    connection: "open", unread: 0,
    about: "I focus on the heartland's consolidated markets. Most of my candidates have already worked inside a corporate group and know exactly what they'd do differently as owners." },
];

// ── Providers directory ──
// Providers-page profile extensions for TA_SPECIALISTS, keyed by specialist id:
// recruiting-team size, last-year placements per recruiter, client testimonials,
// and which referral modes each firm opted into on their own profile —
//   hires  → open to Recruiting DVM Hires (staffing the seller's practice)
//   buyers → open to Referring DVM Buyers (introducing ownership-minded DVMs)
const TA_PROVIDER_EXTRAS = {
  "ta-1": { team: 6, recruitedPerRecruiter: 14, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Jordan found us two associates in a quarter we'd spent a year trying to fill.", author: "Dr. E. Marsh, Practice Owner · Naperville, IL" },
      { quote: "The intro he made became our buyer. Professional start to finish.", author: "Retiring owner · Chicagoland (sold 2025)" },
    ] },
  "ta-2": { team: 4, recruitedPerRecruiter: 11, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Maria's relief network kept us staffed through our entire sale process.", author: "Dr. P. Okafor, Practice Owner · Madison, WI" },
    ] },
  "ta-3": { team: 3, recruitedPerRecruiter: 9, openTo: { hires: true, buyers: false },
    testimonials: [
      { quote: "Devon placed our medical director in six weeks — a search two national firms had dropped.", author: "Hospital administrator · Indianapolis, IN" },
    ] },
  "ta-4": { team: 8, recruitedPerRecruiter: 16, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Priya's ownership waitlist is real. Three serious, funded candidates in the first month.", author: "Dr. S. Whitman, Seller · Twin Cities, MN" },
      { quote: "She understood exactly what leaving corporate medicine looks like — and who's ready to buy.", author: "DVM buyer · placed 2025" },
    ] },
  "ta-5": { team: 1, recruitedPerRecruiter: 8, openTo: { hires: false, buyers: true },
    testimonials: [
      { quote: "Sam knows every mixed-animal DVM south of I-80. Our buyer came from his network.", author: "Retiring owner · Springfield, IL" },
    ] },
  "ta-6": { team: 5, recruitedPerRecruiter: 12, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Elaine assembled the three-DVM partner group that bought our hospital.", author: "Dr. R. Calloway, Seller · Columbus, OH" },
    ] },
  "ta-7": { team: 4, recruitedPerRecruiter: 10, openTo: { hires: true, buyers: false },
    testimonials: [
      { quote: "Two early-career hires in one summer, both still with us today.", author: "Practice manager · Ann Arbor, MI" },
    ] },
  "ta-8": { team: 3, recruitedPerRecruiter: 12, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Alicia stays close to her alumni — one of them became our associate-turned-buyer.", author: "Dr. L. Herrera, Practice Owner · St. Louis, MO" },
    ] },
  "ta-9": { team: 7, recruitedPerRecruiter: 13, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Grant recruits leaders, not résumés. Our new medical director wants equity — exactly as promised.", author: "Multi-doctor hospital owner · Nashville, TN" },
    ] },
  "ta-10": { team: 6, recruitedPerRecruiter: 15, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Nina introduced us to a corporate-exit DVM who closed in 90 days.", author: "Seller · Front Range, CO (sold 2026)" },
    ] },
  "ta-11": { team: 2, recruitedPerRecruiter: 7, openTo: { hires: true, buyers: false },
    testimonials: [
      { quote: "Terrence filled our overnight ER rotation when nobody else could.", author: "ER hospital administrator · Columbus, OH" },
    ] },
  "ta-12": { team: 9, recruitedPerRecruiter: 17, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Hannah's team staffed all three of our locations — and sourced the buyer for the fourth.", author: "Dr. M. Nguyen, Owner · Austin, TX" },
      { quote: "The most responsive recruiter we've worked with in twenty years of practice.", author: "Practice owner · San Antonio, TX" },
    ] },
  "ta-13": { team: 2, recruitedPerRecruiter: 6, openTo: { hires: false, buyers: true },
    testimonials: [
      { quote: "Owen found the one DVM in the region willing to take over a rural mixed practice — ours.", author: "Retiring owner · northern MN" },
    ] },
  "ta-14": { team: 5, recruitedPerRecruiter: 11, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Claire brokered our partnership conversation as deftly as the search itself.", author: "Dr. A. Feldman, Partner · Philadelphia, PA" },
    ] },
  "ta-15": { team: 4, recruitedPerRecruiter: 12, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Rafael placed two associates with us and flagged a Midwest listing to a third who wanted to own.", author: "Practice owner · Portland, OR" },
    ] },
  "ta-16": { team: 3, recruitedPerRecruiter: 13, openTo: { hires: true, buyers: true },
    testimonials: [
      { quote: "Sofia's candidates all came from corporate groups and hit the ground running.", author: "Dr. J. Adeyemi, Owner · Kansas City, MO" },
    ] },
};

// Non-recruiter providers on the Providers page — attorneys, CPAs, and financial
// advisors a seller assembles around a deal. `kind` keys the Type filter; the
// Talent Acquisition rows come from TA_SPECIALISTS (kind "ta") at render time.
const PROVIDERS = [
  { id: "pv-a1", kind: "attorney", name: "Rachel Kim", initials: "RK", color: "indigo",
    firm: "Kim & Associates Veterinary Law", title: "Partner", location: "Chicago, IL",
    regions: ["Illinois", "Wisconsin"], focus: "Practice sale & transition law",
    credentials: "JD · Illinois Bar", yearsExp: 14, clientsServed: 120, avgResponse: "~4 hours",
    verified: true, connection: "connected", unread: 0,
    about: "I handle purchase agreements, leases, and non-competes for independent veterinary practice sales across Chicagoland, with flat-fee packages for CareOwner sellers.",
    testimonials: [{ quote: "Rachel caught a lease clause that would have killed the deal at closing.", author: "Dr. T. Nowak, Seller · Chicago, IL" }] },
  { id: "pv-a2", kind: "attorney", name: "Daniel Osei", initials: "DO", color: "teal",
    firm: "Osei Legal Group", title: "Managing Attorney", location: "Milwaukee, WI",
    regions: ["Wisconsin", "Illinois"], focus: "Contracts & entity structuring",
    credentials: "JD · Wisconsin & Illinois Bar", yearsExp: 11, clientsServed: 85, avgResponse: "~1 day",
    verified: true, connection: "open", unread: 0,
    about: "I structure asset vs. stock sales and untangle multi-owner entities before a listing goes live — the cleanup that keeps diligence short.",
    testimonials: [{ quote: "Daniel restructured our two-owner S-corp in three weeks so we could list clean.", author: "Practice owner · Milwaukee, WI" }] },
  { id: "pv-a3", kind: "attorney", name: "Meredith Lawson", initials: "ML", color: "rose",
    firm: "Lawson Transition Law", title: "Founder", location: "Indianapolis, IN",
    regions: ["Indiana", "Ohio"], focus: "Succession & employment law",
    credentials: "JD · Indiana Bar", yearsExp: 18, clientsServed: 140, avgResponse: "~6 hours",
    verified: true, connection: "open", unread: 0,
    about: "Succession planning and post-sale employment agreements — including the 2–3 year owner-stay arrangements common in DVM-to-DVM sales.",
    testimonials: [{ quote: "Meredith drafted an owner-stay agreement both sides actually liked.", author: "Retiring owner · Indianapolis, IN (sold 2025)" }] },
  { id: "pv-c1", kind: "cpa", name: "Alan Pruitt", initials: "AP", color: "green",
    firm: "Pruitt & Co. CPAs", title: "Partner", location: "Naperville, IL",
    regions: ["Illinois"], focus: "Practice valuations & tax planning",
    credentials: "CPA · ABV", yearsExp: 20, clientsServed: 200, avgResponse: "~5 hours",
    verified: true, connection: "connected", unread: 0,
    about: "Valuations and pre-sale tax planning for veterinary practices. I prepare the adjusted-EBITDA story buyers and lenders actually underwrite.",
    testimonials: [{ quote: "Alan's adjusted-EBITDA workup added six figures to our valuation conversation.", author: "Dr. K. Boyle, Seller · Naperville, IL" }] },
  { id: "pv-c2", kind: "cpa", name: "Grace Lin", initials: "GL", color: "amber",
    firm: "Lin Veterinary Accounting", title: "Principal", location: "Madison, WI",
    regions: ["Wisconsin", "Minnesota"], focus: "Quality of earnings & diligence",
    credentials: "CPA", yearsExp: 12, clientsServed: 95, avgResponse: "~1 day",
    verified: true, connection: "sent", unread: 0,
    about: "Sell-side quality-of-earnings reviews that surface issues before the buyer's accountant does. I work alongside your existing bookkeeper.",
    testimonials: [{ quote: "Grace found the payroll misclassification before the buyer's QoE did. Worth every penny.", author: "Practice owner · Madison, WI" }] },
  { id: "pv-c3", kind: "cpa", name: "Victor Ramos", initials: "VR", color: "violet",
    firm: "Ramos Practice Advisors", title: "CPA · Partner", location: "St. Louis, MO",
    regions: ["Missouri", "Illinois"], focus: "Deal structuring & after-tax proceeds",
    credentials: "CPA · CVA", yearsExp: 16, clientsServed: 110, avgResponse: "~8 hours",
    verified: false, connection: "open", unread: 0,
    about: "I model what each offer actually nets after taxes — allocation, earn-outs, and installment structures compared side by side.",
    testimonials: [{ quote: "Victor showed us the after-tax difference between two offers — we picked the ‘smaller’ one and netted more.", author: "Seller · St. Louis, MO" }] },
  { id: "pv-f1", kind: "advisor", name: "Susan Hale", initials: "SH", color: "teal",
    firm: "Hale Wealth Partners", title: "Senior Advisor", location: "Oak Brook, IL",
    regions: ["Illinois"], focus: "Sale proceeds & retirement planning",
    credentials: "CFP", yearsExp: 22, clientsServed: 180, avgResponse: "~1 day",
    verified: true, connection: "sent", unread: 0,
    about: "I turn a once-in-a-lifetime practice sale into a retirement plan — sequencing, investing, and protecting the proceeds.",
    testimonials: [{ quote: "Susan turned our sale proceeds into a plan we actually understand.", author: "Dr. R. Calder, Retired owner · Oak Brook, IL" }] },
  { id: "pv-f2", kind: "advisor", name: "Marcus Bell", initials: "MB", color: "indigo",
    firm: "Bell Financial Group", title: "Founder", location: "Columbus, OH",
    regions: ["Ohio", "Michigan"], focus: "Owner exit planning",
    credentials: "CFP · CEPA", yearsExp: 15, clientsServed: 130, avgResponse: "~2 days",
    verified: true, connection: "open", unread: 0,
    about: "Exit planning that starts before the listing: readiness scoring, target-proceeds math, and coordinating your CPA and attorney around one plan.",
    testimonials: [{ quote: "Marcus had our CPA and attorney rowing in the same direction for the first time.", author: "Practice owner · Columbus, OH" }] },
  { id: "pv-f3", kind: "advisor", name: "Angela Torres", initials: "AT", color: "rose",
    firm: "Torres Private Wealth", title: "Managing Partner", location: "Denver, CO",
    regions: ["Colorado", "Utah"], focus: "Post-sale wealth management",
    credentials: "CFA", yearsExp: 17, clientsServed: 150, avgResponse: "~1 day",
    verified: false, connection: "open", unread: 0,
    about: "I manage post-sale portfolios for practice sellers, with an emphasis on income replacement in the first five years after closing.",
    testimonials: [{ quote: "Angela's income plan let us retire eighteen months earlier than we'd budgeted.", author: "Retired owners · Denver, CO" }] },
];

// ── Press & PR ──
const PR_INTERVIEW_QUESTIONS = [
  { id: "years", label: "How long have you been practicing?", placeholder: "e.g. 15 years — the last 12 of them here in Lakeside" },
  { id: "proudest", label: "What's your proudest moment at the practice?", placeholder: "e.g. Our first free vaccine clinic drew 200 families" },
  { id: "why", label: "Why are you moving on?", placeholder: "e.g. Retiring near family — and I want the practice in good hands" },
  { id: "story", label: "A patient story people remember you by", placeholder: "e.g. The great dane who visits every year on his adoption day" },
];

// TODO(api): replace with the real PR-assistant backend (LLM + media database).
const mockPrService = {
  async generateAngles(listing, interview) {
    await promoDelay(1400 + Math.random() * 500);
    return [
      { id: "angle-succession", title: "After 12 years, Lakeside's neighborhood vet searches for a successor",
        summary: "A retirement-and-succession human-interest story: Dr. Thompson isn't selling to the highest bidder — she's choosing the next caretaker for 1,240 families' pets." },
      { id: "angle-independent", title: "The vanishing independent vet: one Lakeside practice bucks the corporate trend",
        summary: "A trend piece. As corporate groups consolidate veterinary care, AnimalCare's owner wants to keep it independent — and is using a marketplace to find an owner-DVM." },
      { id: "angle-community", title: "From vaccine clinics to school visits: the practice that became a town fixture",
        summary: "A community-impact angle built on AnimalCare's free clinics, school programs, and two decades of local goodwill." },
    ];
  },
  async buildKit(listing, interview) {
    await promoDelay(1500);
    return {
      bio: "Dr. Lisa Thompson has practiced veterinary medicine for over 15 years and opened AnimalCare in 2013 with a mission to provide compassionate, high-quality care to Lakeside's pets and their families.",
      history: "Founded in 2013, AnimalCare grew from a two-person clinic into an AAHA-certified, 3-doctor practice with a 13-person support team, serving 1,240 active client families across the Lakeside area.",
      quotableStats: [
        "1,240 active client families",
        "16-person team with a 6.4-year average support-staff tenure",
        "4.8★ average across 235 public reviews",
        "AAHA-certified small-animal practice",
      ],
      photos: [assetUrl("assets/practice-hero.jpg")],
      boilerplate: "AnimalCare is an AAHA-certified small-animal veterinary practice in Lakeside, Illinois, founded in 2013 by Dr. Lisa Thompson. The practice provides wellness, surgical, dental, and emergency care to more than 1,200 client families.",
    };
  },
  async findReporters(region) {
    await promoDelay(1300);
    return [
      { id: "rep-delgado", name: "Maria Delgado", outlet: "Lakeside Gazette", beat: "Community & local business",
        relevanceReason: "Covers local institutions and ownership changes — wrote three small-business succession stories this year.",
        status: "suggested",
        pitchDraft: "Hi Maria — after 12 years caring for Lakeside's pets, Dr. Lisa Thompson is preparing to hand AnimalCare to its next owner. She's turning away corporate buyers to find a veterinarian who'll keep it independent. Happy to arrange a visit — the waiting room alone is a story." },
      { id: "rep-barrett", name: "Tom Barrett", outlet: "WLKS Radio", beat: "Morning community show",
        relevanceReason: "Runs a weekly “Main Street” segment on local business milestones and transitions.",
        status: "suggested",
        pitchDraft: "Hi Tom — a Main Street idea: Lakeside's own AnimalCare is for sale, and owner Dr. Lisa Thompson is picking her successor the old-fashioned way — by who'll take best care of the town's pets. She's a warm, funny interview." },
      { id: "rep-woo", name: "Janelle Woo", outlet: "Chicago Business Journal", beat: "Small business & M&A",
        relevanceReason: "Covers independent-practice sales and healthcare consolidation across the metro.",
        status: "suggested",
        pitchDraft: "Hi Janelle — data point for your consolidation coverage: an independent Lakeside veterinary practice ($2.45M revenue) is testing a marketplace model to sell to an individual DVM instead of a corporate group. The owner can speak to the economics candidly." },
      { id: "rep-shah", name: "Priya Shah", outlet: "Veterinary Practice News", beat: "Practice management & transitions",
        relevanceReason: "Profession press — actively commissioning succession-planning features this quarter.",
        status: "suggested",
        pitchDraft: "Hi Priya — a succession case study: AnimalCare (Lakeside, IL) is running a structured owner-to-DVM transition with a 2–3 year mentorship handoff. Dr. Thompson will share the full playbook, numbers included." },
    ];
  },
  async sendPitch(target) { await promoDelay(1100); return { ok: true }; },
};

Object.assign(window, {
  PROMO_META_ENABLED, PROMO_SHARE_ENABLED, PROMO_FEATURED_ENABLED,
  PROMO_LOCALPUBS_ENABLED, PROMO_PR_ENABLED, PROMO_DVM_ENABLED,
  PROMO_AUDIENCES, PROMO_CREATIVE_POOL, PROMO_CTA_OPTIONS,
  PROMO_SHARE_CAPTIONS, lintAnonymity, PROMO, updatePromo, usePromo,
  ensureNamedToken, promoShareUrl, addPromoLead, generateCreative,
  regenerateCreative, mockAdService, mockCampaignMetrics, mockSmallMetrics,
  META_AD_PLAN, PROMO_HISTORY, PROMO_UPDATES, TA_SPECIALISTS,
  TA_PROVIDER_EXTRAS, PROVIDERS,
  FEATURED_TIERS, rotateFeatured, mockFeaturedService,
  PLACEMENT_TYPE_LABELS, PLACEMENT_CANDIDATES, mockLocalPubsService, localAdCreative,
  PR_INTERVIEW_QUESTIONS, mockPrService,
});
