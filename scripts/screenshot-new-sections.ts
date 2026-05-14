import { runTest } from "./auth";

runTest("Screenshot New Sections", async (helper) => {
  const { page } = helper;

  // Go to landing page
  await helper.goto("/");
  await page.waitForTimeout(2000);

  // Screenshot the Viral Machine section
  const viralSection = page.locator('#viral-machine');
  if (await viralSection.isVisible()) {
    await viralSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "/work/temp/viral-machine-section.png", fullPage: false });
    console.log("✅ Viral Machine screenshot taken");
  } else {
    console.log("⚠️ Viral Machine section not visible, taking full page");
    await page.screenshot({ path: "/work/temp/landing-full.png", fullPage: true });
  }

  // Screenshot the Visual Quality section
  const visualSection = page.locator('#visual-quality');
  if (await visualSection.isVisible()) {
    await visualSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "/work/temp/visual-quality-section.png", fullPage: false });
    console.log("✅ Visual Quality screenshot taken");
  }

  // Now go to dashboard and screenshot the Viral Machine tab
  await helper.goto("/dashboard");
  await page.waitForTimeout(2000);

  // Click the Viral Machine tab
  const viralTab = page.getByText("Viral Machine");
  if (await viralTab.first().isVisible()) {
    await viralTab.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "/work/temp/dashboard-viral-tab.png", fullPage: false });
    console.log("✅ Dashboard Viral tab screenshot taken");
  } else {
    console.log("⚠️ Viral Machine tab not found in dashboard");
    await page.screenshot({ path: "/work/temp/dashboard-viral-tab.png", fullPage: false });
  }

  console.log("All screenshots done!");
}).catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
