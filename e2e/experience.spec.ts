import { test, expect } from "@playwright/test";

test.describe("Experience page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/experience");
  });

  test("renders experience cards", async ({ page }) => {
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
  });

  test("show details button expands and collapses card", async ({ page }) => {
    // Cards start at opacity:0 via GSAP and animate in once they enter the viewport.
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForFunction(() => {
      const card = document.querySelector("article");
      return card !== null && parseFloat(getComputedStyle(card).opacity) >= 0.99;
    });

    // The button sits inside an overflow-hidden carousel with a fill <Image> layered
    // on top, so Playwright's coordinate-based click hits the image instead. Calling
    // .click() directly on the DOM element bypasses hit-testing and fires the handler.
    // We target by text content to avoid matching the navbar's own aria-expanded button.
    // Use attribute value to find the right button, scoped to article elements
    // so the navbar's own aria-expanded button is excluded.
    const clickByExpanded = (value: "true" | "false") =>
      page.evaluate((val) => {
        const btn = document.querySelector<HTMLButtonElement>(
          `article button[aria-expanded="${val}"]`
        );
        btn?.click();
      }, value);

    // The first two entries are IncomingExperienceCards (no details button), so
    // target the first button[aria-expanded] inside ANY article, not the first article.
    const btn = page.locator("article button[aria-expanded]").first();

    await clickByExpanded("false");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.locator("article button", { hasText: /hide details/i }).first()
    ).toBeVisible();

    await clickByExpanded("true");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("timeline rail is visible on desktop", async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    // The accent fill and high-water rails are desktop-only (hidden on mobile via md: prefix).
    const rails = page.locator(".absolute.left-6.top-6.w-px");
    await expect(rails.first()).toBeAttached();
  });

  test("carousel arrows navigate images", async ({ page, isMobile }) => {
    // Arrows are always visible on mobile, hover-revealed on desktop.
    const nextBtn = page.getByRole("button", { name: /next image/i }).first();
    const prevBtn = page.getByRole("button", { name: /previous image/i }).first();
    await expect(nextBtn).toBeAttached();
    await expect(prevBtn).toBeAttached();
    await nextBtn.click();
    await prevBtn.click();
  });

  test("screenshot — desktop", async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    await page.waitForLoadState("networkidle");
    // The carousel auto-scrolls, so allow a small pixel diff between snapshots.
    await expect(page).toHaveScreenshot("experience-desktop.png", {
      fullPage: true,
      maxDiffPixels: 5000,
      timeout: 15000,
    });
  });

  test("screenshot — mobile", async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("experience-mobile.png", {
      fullPage: true,
      maxDiffPixels: 5000,
      timeout: 15000,
    });
  });
});
