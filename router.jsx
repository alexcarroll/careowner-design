// Client-side router — History API. The URL is the source of truth for area/section/sub/tab.
//
// URL scheme:
//   /home /buyers /inquiries /offers /messages /meetings   → top-level areas
//   /practice                                              → practice workspace (Overview)
//   /practice/:section                                     → left-rail section (e.g. /practice/services)
//   /practice/:section#:tab                                → in-page tab (e.g. /practice/services#pricing)
//   /practice/market-check#:tab                            → Market Check tab
//   /practice/market-check/new                             → New Request flow
//   /practice/promotions[/ads|/share]                      → Promote Your Practice
//   /l/:listingId  ·  /l/s/:token                          → public landing pages (no app shell)
//
// Note: deep-link refresh of /practice/... requires the static host to serve index.html
// for unknown paths (SPA fallback). In-app navigation (pushState) works regardless.

// "inquiries" is kept as a legacy alias for "requests" so older deep links resolve.
const ROUTE_AREAS = ["home", "marketplace", "practice", "buyers", "providers", "requests", "inquiries", "offers", "messages", "meetings", "l"];
const DEFAULT_AREA = "practice";
const DEFAULT_SECTION = "overview";

// Base path the app is mounted under ("/careowner-design" on GitHub Pages, "" locally).
// Set by the inline script in index.html before this file loads.
const APP_BASE = (typeof window !== "undefined" && window.__APP_BASE__) || "";

function parseLocation() {
  let path = window.location.pathname || "/";
  if (APP_BASE && path.indexOf(APP_BASE) === 0) path = path.slice(APP_BASE.length) || "/";
  path = path.replace(/\/index\.html$/, "/");
  const hash = (window.location.hash || "").replace(/^#/, "");
  const segs = path.split("/").filter(Boolean); // ["practice","market-check","new"]

  let area = segs[0] || DEFAULT_AREA;
  if (!ROUTE_AREAS.includes(area)) area = DEFAULT_AREA;

  const section = area === "practice" ? (segs[1] || DEFAULT_SECTION) : area === "l" ? (segs[1] || null) : null;
  const sub = (area === "practice" || area === "l") ? (segs[2] || null) : null;
  const tab = hash || null;

  return { area, section, sub, tab, path, hash };
}

function buildPath({ area, section, sub, tab }) {
  let p = "/" + (area || DEFAULT_AREA);
  if (area === "practice" && section) {
    p += "/" + section;
    if (sub) p += "/" + sub;
  }
  if (tab) p += "#" + tab;
  return p;
}

function navigateTo(path, opts) {
  const replace = opts && opts.replace;
  const full = APP_BASE + path; // prepend the mount base (no-op when APP_BASE is "")
  const current = window.location.pathname + window.location.hash;
  if (full === current) return;
  path = full;
  try {
    if (replace) window.history.replaceState({}, "", path);
    else window.history.pushState({}, "", path);
  } catch (e) {
    // Some contexts (e.g. file://) block History API for cross-path navigation —
    // fall back to a hash so the app still re-renders.
    window.location.hash = path;
  }
  window.dispatchEvent(new Event("co:navigate"));
  // keep the window scrolled to top on real page changes (not just hash/tab swaps)
  if (!path.includes("#")) window.scrollTo(0, 0);
}

function useRoute() {
  const [loc, setLoc] = React.useState(() => parseLocation());
  React.useEffect(() => {
    const onChange = () => setLoc(parseLocation());
    window.addEventListener("popstate", onChange);
    window.addEventListener("co:navigate", onChange);
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("co:navigate", onChange);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);
  return loc;
}

Object.assign(window, { parseLocation, buildPath, navigateTo, useRoute });
