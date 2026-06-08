// Local web screenshotter for the Expo web build.
// Usage: node scripts/web-screenshot.mjs <url> <outfile> [waitMs]
// Drives system Chrome via playwright-core ON THIS HOST (the sandboxed
// Playwright MCP browser has no network, so it can't reach the dev server).
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:8090";
const out = process.argv[3] ?? "/root/app/screenshots/web-home.png";
const waitMs = Number(process.argv[4] ?? 30000);

const browser = await chromium.launch({
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessChecks,LocalNetworkAccessChecks,LocalNetworkAccessChecksWarn",
    "--allow-running-insecure-content",
    "--no-proxy-server",
  ],
});
const page = await browser.newPage({
  viewport: { width: 440, height: 956 },
  deviceScaleFactor: 2,
});

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

try {
  await page.goto(url, { waitUntil: "load", timeout: 180000 });
} catch (e) {
  console.log("goto warning:", e.message);
}
await page.waitForTimeout(waitMs);

const bodyText = (await page.locator("body").innerText().catch(() => "")).slice(0, 400);
await page.screenshot({ path: out, fullPage: false });
await browser.close();

console.log("SAVED:", out);
console.log("BODY_TEXT:", JSON.stringify(bodyText));
console.log("CONSOLE_ERRORS:", errors.length);
errors.slice(0, 15).forEach((e) => console.log("  -", e.slice(0, 200)));
