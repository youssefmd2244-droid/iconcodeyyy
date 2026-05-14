import { runTest } from "./auth";

runTest("Screenshot All Tabs", async (helper) => {
  const { page } = helper;
  
  // Use a wide viewport for better screenshots
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Dashboard - Overview tab
  await helper.goto("/dashboard");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "screenshots/dashboard-overview.png", fullPage: false });
  console.log("Dashboard overview screenshot taken");
  
  // Generate tab
  await page.click('button:has-text("Generate")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "screenshots/dashboard-generate.png", fullPage: true });
  console.log("Generate tab screenshot taken");
  
  // Social tab
  await page.click('button:has-text("Social")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "screenshots/dashboard-social.png", fullPage: true });
  console.log("Social tab screenshot taken");
  
  // Viral Machine tab
  await page.click('button:has-text("Viral Machine")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "screenshots/dashboard-viral.png", fullPage: true });
  console.log("Viral Machine tab screenshot taken");
  
  // Landing page
  await helper.goto("/");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "screenshots/landing-hero.png", fullPage: false });
  console.log("Landing hero screenshot taken");
  
  helper.printConsoleLogs();
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
