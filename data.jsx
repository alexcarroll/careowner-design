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
    type: "Joint Venture",
    stay: "2–3 years",
    buyer: "Corporate Group",
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
  },
};

const BUYERS = [
  { id: 1, name: "Paws & Whiskers Group", type: "Corporate Group", location: "Chicago, IL", offers: 3, funds: "$5M–$15M", interest: "High", lastActive: "2h ago", status: "active" },
  { id: 2, name: "Dr. Marcus Chen", type: "Individual Vet", location: "Madison, WI", offers: 1, funds: "$1M–$3M", interest: "Medium", lastActive: "1d ago", status: "active" },
  { id: 3, name: "Heartland Veterinary Partners", type: "Regional PE", location: "Indianapolis, IN", offers: 0, funds: "$10M+", interest: "High", lastActive: "3h ago", status: "verified" },
  { id: 4, name: "Dr. Priya Natarajan", type: "Individual Vet", location: "Milwaukee, WI", offers: 2, funds: "$500K–$2M", interest: "Low", lastActive: "1w ago", status: "paused" },
  { id: 5, name: "Midwest Animal Holdings", type: "Corporate Group", location: "Minneapolis, MN", offers: 1, funds: "$8M–$25M", interest: "High", lastActive: "5h ago", status: "active" },
  { id: 6, name: "Dr. James Okafor", type: "Individual Vet", location: "Lakeside, IL", offers: 0, funds: "$800K–$1.5M", interest: "Medium", lastActive: "4d ago", status: "verified" },
  { id: 7, name: "Northwoods Pet Partners", type: "Regional Group", location: "Green Bay, WI", offers: 2, funds: "$3M–$8M", interest: "High", lastActive: "6h ago", status: "active" },
  { id: 8, name: "Harbor Ridge Capital", type: "PE Firm", location: "Boston, MA", offers: 0, funds: "$20M+", interest: "Medium", lastActive: "2d ago", status: "active" },
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
    { id: "revenue",   label: "High-Level Revenue",      value: "$2.45M",          provenance: "verified" },
    { id: "ebitda",    label: "EBITDA",                  value: "$612K",           provenance: "verified" },
    { id: "adjMargin", label: "Adjusted EBITDA Margin",  value: "20%",             provenance: "verified" },
    { id: "sales",     label: "Annual Sales + Growth",   value: "$2.45M · +8% YoY", provenance: "verified" },
  ]},
  { group: "Production", items: [
    { id: "prodByDoctor", label: "Production by Doctor",        value: "$612K avg / DVM",    provenance: "verified" },
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

// Ranges are in $M (numbers) for charting.
const MARKET_CHECK_RESPONSES = [
  { id: 1, buyer: "Corporate Acquirer", buyerType: "Corporate Group", verified: true, interest: "High", low: 2.8, high: 3.2,
    feedback: "Strong financial performance and location. Would recommend updating facilities to modern standards to increase value by 10–15%.",
    recs: ["Modernize waiting room and exam rooms", "Install digital X-ray system if not already in place"], submitted: "Apr 14" },
  { id: 2, buyer: "Individual Veterinarian", buyerType: "Individual Vet", verified: true, interest: "Medium", low: 2.5, high: 2.9,
    feedback: "Good practice fundamentals. Consider formalizing team training programs and documenting SOPs more thoroughly to reduce transition risk.",
    recs: ["Create comprehensive SOP documentation", "Implement formal onboarding program"], submitted: "Apr 13" },
  { id: 3, buyer: "Private Equity Group", buyerType: "PE Firm", verified: true, interest: "High", low: 3.0, high: 3.5,
    feedback: "Excellent EBITDA margins and growth trajectory. Strengthening financial reporting systems would support higher valuation multiples.",
    recs: ["Implement monthly financial dashboards", "Establish KPI tracking system"], submitted: "Apr 12" },
  { id: 4, buyer: "Regional Chain", buyerType: "Regional Group", verified: false, interest: "Medium", low: 2.6, high: 3.0,
    feedback: "Great market position. Owner transition plan could be more detailed to ensure continuity of client relationships.",
    recs: ["Document key client relationships", "Develop 12-month transition timeline"], submitted: "Apr 11" },
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
    members: [
      { name: "Clayton McQuiddy", hrwk: "40", tenure: "6.4", comp: "$106.8K", compYtd: "$44.5K", prod2025: "$662.6K", prodTtm: "$679.0K" },
      { name: "Laura Bailey",     hrwk: "35", tenure: "6.8", comp: "$101.7K", compYtd: "$42.4K", prod2025: "$593.6K", prodTtm: "$568.5K" },
      { name: "Michael Zarzosa",  hrwk: "40", tenure: "5.2", comp: "$125.0K", compYtd: "$52.1K", prod2025: "$785.6K", prodTtm: "$774.8K" },
      { name: "Debra Maxwell",    hrwk: "10", tenure: "0.1", comp: "—",       compYtd: null,     prod2025: "$3.1K",   prodTtm: "$12.8K" },
      { name: "Ross Ellis",       hrwk: "—",  tenure: "—",   comp: "—",       compYtd: null,     prod2025: "$3.1K",   prodTtm: "—" },
    ],
  },
  support: {
    count: 13, fullTime: 7, partTime: 6, avgTenure: "3.9 years",
    comp: { ttm: "$523.4K", y2025: "$541.0K" },
    production: { ttm: "$400.8K", y2025: "$406.4K" },
    members: [
      { name: "Sandra Reyes",   hrwk: "40", tenure: "8.2", comp: "$78.0K", compYtd: "$32.5K", prod2025: "—",      prodTtm: "—" },
      { name: "Tobias Lund",    hrwk: "40", tenure: "6.5", comp: "$62.4K", compYtd: "$26.0K", prod2025: "$96.2K", prodTtm: "$92.4K" },
      { name: "Priya Anand",    hrwk: "40", tenure: "5.1", comp: "$54.0K", compYtd: "$22.5K", prod2025: "$71.8K", prodTtm: "$70.1K" },
      { name: "Marcus Webb",    hrwk: "36", tenure: "4.3", comp: "$49.5K", compYtd: "$20.6K", prod2025: "$64.3K", prodTtm: "$61.0K" },
      { name: "Hannah Cole",    hrwk: "32", tenure: "3.8", comp: "$44.2K", compYtd: "$18.4K", prod2025: "$52.7K", prodTtm: "$55.9K" },
      { name: "Derek Nash",     hrwk: "40", tenure: "2.6", comp: "$46.8K", compYtd: "$19.5K", prod2025: "$58.1K", prodTtm: "$60.4K" },
      { name: "Olivia Park",    hrwk: "38", tenure: "3.2", comp: "$38.0K", compYtd: "$15.8K", prod2025: "—",      prodTtm: "—" },
      { name: "Jamal Brooks",   hrwk: "30", tenure: "1.9", comp: "$24.5K", compYtd: "$10.2K", prod2025: "—",      prodTtm: "—" },
      { name: "Grace Liu",      hrwk: "40", tenure: "4.7", comp: "$36.4K", compYtd: "$15.2K", prod2025: "—",      prodTtm: "—" },
      { name: "Emma Sorensen",  hrwk: "28", tenure: "2.1", comp: "$22.0K", compYtd: "$9.2K",  prod2025: "—",      prodTtm: "—" },
      { name: "Carlos Mendez",  hrwk: "32", tenure: "1.4", comp: "$26.8K", compYtd: "$11.2K", prod2025: "—",      prodTtm: "—" },
      { name: "Aisha Khan",     hrwk: "24", tenure: "2.8", comp: "$21.6K", compYtd: "$9.0K",  prod2025: "$38.4K", prodTtm: "$34.7K" },
      { name: "Ben Taylor",     hrwk: "20", tenure: "3.5", comp: "$19.2K", compYtd: "$8.0K",  prod2025: "$24.9K", prodTtm: "$26.3K" },
    ],
  },
};

window.PRACTICE = PRACTICE;
window.BUYERS = BUYERS;
window.MODELED_ESTIMATE = MODELED_ESTIMATE;
window.MARKET_METRICS = MARKET_METRICS;
window.MARKET_CHECK_RESPONSES = MARKET_CHECK_RESPONSES;
window.MARKET_CHECK_REQUESTS = MARKET_CHECK_REQUESTS;
window.MARKET_PROFILE_STAFF = MARKET_PROFILE_STAFF;
window.INQUIRIES = INQUIRIES;
window.OFFERS = OFFERS;
window.THREADS = THREADS;
window.MEETINGS = MEETINGS;
window.ACTIVITY = ACTIVITY;
