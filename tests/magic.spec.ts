import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8888";

test("magic mode streams and completes", async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector("text=Magic Mode");
  await page.waitForFunction(() => {
    const pre = document.querySelector("pre");
    return pre && /\"cxi\":/.test(pre.textContent || "");
  }, { timeout: 10000 });
});
