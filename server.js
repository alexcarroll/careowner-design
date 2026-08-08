// Minimal static server with SPA fallback for the CareOwner prototype.
//
// The app uses History-API routing (/practice/market-check, /practice/services, …),
// so two things must hold no matter how deep the URL is:
//   1. Real files (icons.jsx, views/*.jsx, vetvet-ds.css, assets/*) must resolve even
//      when requested relative to a deep route (e.g. /practice/views/marketcheck.jsx).
//   2. Page routes with no matching file fall back to index.html.
// This avoids needing <base href> in index.html, which breaks file-based previews.
//
// Usage: node server.js [port]
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.argv[2] || process.env.PORT || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

function send(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    // No-cache: the in-browser Babel setup re-fetches .jsx on every load, so
    // without this the browser can serve a stale transpile after an edit.
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store, must-revalidate",
    });
    res.end(data);
  });
}

// Resolve a request to a real file by trying the path, then progressively
// dropping leading route segments (/practice/views/x.jsx → views/x.jsx → x.jsx).
function resolveFile(urlPath) {
  const segs = urlPath.split("/").filter(Boolean);
  for (let i = 0; i < segs.length; i++) {
    const candidate = path.join(ROOT, ...segs.slice(i));
    if (candidate.startsWith(ROOT) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
  const file = resolveFile(urlPath);
  if (file) return send(res, file);
  // A request for an asset that doesn't exist → 404; anything else is a page route → SPA fallback.
  if (/\.[a-z0-9]+$/i.test(urlPath)) { res.writeHead(404); return res.end("Not found"); }
  send(res, path.join(ROOT, "index.html"));
}).listen(PORT, () => console.log("CareOwner prototype on http://localhost:" + PORT));
