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

window.PRACTICE = PRACTICE;
window.BUYERS = BUYERS;
window.INQUIRIES = INQUIRIES;
window.OFFERS = OFFERS;
window.THREADS = THREADS;
window.MEETINGS = MEETINGS;
window.ACTIVITY = ACTIVITY;
