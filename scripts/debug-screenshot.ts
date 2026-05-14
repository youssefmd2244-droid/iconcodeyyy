import { chromium } from "playwright";
import { spawn, type ChildProcess } from "node:child_process";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const PORT = 4173;
const URL = `http://localhost:${PORT}`;

async function waitForServer(url: string): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < 30000) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 304) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  // Start preview server
  const server = spawn("bun", ["run", "preview"], {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });
  server.stdout?.on("data", () => {});
  server.stderr?.on("data", () => {});

  try {
    console.log("Waiting for server...");
    const ready = await waitForServer(URL);
    if (!ready) { console.error("Server didn't start"); process.exit(1); }

    console.log("Launching browser...");
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // Collect ALL console messages
    page.on("console", msg => {
      console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
    });
    page.on("pageerror", err => {
      console.log(`[PAGE ERROR] ${err.message}`);
    });

    console.log(`Navigating to ${URL}/ ...`);
    await page.goto(`${URL}/`, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(3000);

    console.log(`Page title: ${await page.title()}`);
    console.log(`Page URL: ${page.url()}`);
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML.slice(0, 2000));
    console.log(`Body HTML (first 2000): ${bodyHTML}`);

    const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    console.log(`Body background-color: ${bgColor}`);

    await page.screenshot({ path: join(projectRoot, "tmp", "debug-landing.png"), fullPage: false });
    console.log("Screenshot saved to tmp/debug-landing.png");

    await browser.close();
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
