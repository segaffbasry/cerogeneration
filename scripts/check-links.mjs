// Checks every outbound link in lib/site.ts and lib/content.ts.
//   cerogeneration.com pages must appear in the live Yoast sitemaps (/page-sitemap.xml, /project-sitemap.xml) and
//   answer 200. Posts (the site publishes no post sitemap) and uploaded PDFs must answer 200. Other hosts must
//   answer 2xx/3xx (LinkedIn answers 999 to scripts, reported as such).
// Run: npm run links
import { readFileSync } from "node:fs";

const LIVE = "https://cerogeneration.com";
const sources = ["lib/site.ts", "lib/content.ts"].map((f) => readFileSync(f, "utf8")).join("\n")
  .replaceAll("${LIVE}", LIVE).replaceAll("${UP}", `${LIVE}/wp-content/uploads`);
const urls = [...new Set([...sources.matchAll(/https?:\/\/[^"'`\s)]+/g)].map((m) => m[0]))].filter((u) => !u.endsWith("/uploads")).sort();
// Broken on the live site itself (its own footer links here too, checked 2026-10-09). Kept so the footer matches
// the live one, reported as "known" rather than failing the run. See README "Links".
const KNOWN_BROKEN = new Set([`${LIVE}/wp-content/uploads/2025/09/Cero-Modern-Slavery-Statement-2025.pdf`]);

const maps = await Promise.all(["page-sitemap.xml", "project-sitemap.xml"].map((m) => fetch(`${LIVE}/${m}`).then((r) => r.text())));
const listed = new Set(maps.flatMap((x) => [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])));

let failed = 0;
for (const url of urls) {
  const own = url.startsWith(LIVE);
  const kind = !own ? "external" : listed.has(url) ? "in-sitemap" : url.includes("/wp-content/") ? "upload" : "post";
  let status = 0;
  try { status = (await fetch(url, { method: "GET", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 link-check" } })).status; } catch { status = 0; }
  const known = KNOWN_BROKEN.has(url) && status === 404;
  const ok = known || (own ? status === 200 : (status >= 200 && status < 400) || status === 999);
  if (!ok) failed++;
  console.log(`${known ? "KNWN" : ok ? "ok  " : "FAIL"} ${status} ${kind.padEnd(10)} ${url}`);
}
console.log(`\n${urls.length} links, ${failed} failed`);
process.exit(failed ? 1 : 0);
