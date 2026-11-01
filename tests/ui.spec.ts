import { test, expect } from "@playwright/test";
import snapshot from "../app/data/github.json" with { type: "json" };
import type { GitHubData } from "../app/types";

let currentData: GitHubData;

test.beforeEach(async ({ page }) => {
  currentData = { ...snapshot, repositorySource: "github", contributionSource: "github" };
  await page.clock.install();
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("**/api/github", route => route.fulfill({ json: currentData }));
  const hydrated = page.waitForResponse(response => response.url().endsWith("/api/github"));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await hydrated;
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
});

test("Ink has only light and dark modes and remembers the selection", async ({ page }) => {
  const toggle = page.getByRole("switch", { name: "Dark mode" });
  await expect(page.locator("select")).toHaveCount(0);
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("software.");
});

test("only pinned repositories appear, and a changed pin list updates after an hour", async ({ page }) => {
  await expect(page.locator(".github-repo")).toHaveCount(snapshot.repositories.length);
  await expect(page.locator(".featured-project, .small-project, .github-expand")).toHaveCount(0);
  const first = snapshot.repositories[0];
  currentData = { ...currentData, repositories: [{ ...first, name: "newly-pinned-project" }] };
  await page.clock.fastForward(60 * 60 * 1000);
  await expect(page.locator(".github-repo")).toHaveCount(1);
  await expect(page.locator(".github-repo h3")).toHaveText("newly-pinned-project");
});

test("Japanese translations work with hover, keyboard, and touch", async ({ page }) => {
  const symbol = page.locator("#projects .section-symbol");
  await symbol.hover();
  await expect(page.getByRole("tooltip")).toContainText("Works");
  await page.getByRole("tooltip").hover();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await symbol.focus();
  await expect(page.getByRole("tooltip")).toContainText("Works");
  await page.keyboard.press("Escape");
  await symbol.evaluate(element => (element as HTMLElement).blur());
  await page.setViewportSize({ width: 320, height: 844 });
  await page.locator(".site-header .japanese-text").tap();
  await expect(page.getByRole("tooltip")).toContainText("Create");
  const bounds = await page.getByRole("tooltip").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  await page.locator("h1").tap();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("the layout stays within mobile screens and the calendar supports keyboard navigation", async ({ page }) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  const day = page.locator("button.contribution-cell").last();
  await day.focus();
  await page.keyboard.press("Home");
  await expect(page.locator("button.contribution-cell").first()).toHaveAttribute("aria-pressed", "true");
});

test("artwork responds to the pointer, pauses, and respects reduced motion", async ({ page }, testInfo) => {
  const artwork = page.locator(".artwork-motion");
  const bounds = await artwork.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * .8, bounds!.y + bounds!.height * .3);
  await expect.poll(() => artwork.evaluate(element => element.style.getPropertyValue("--art-x"))).not.toBe("");
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(artwork).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".code-cube")).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Resume animation" }).click();
  await expect(artwork).toHaveAttribute("data-motion", "active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(artwork).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".code-cube")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".artwork-motion .samurai-image")).toHaveCSS("transform", "none");
  await page.screenshot({ path: testInfo.outputPath("ink-dark.png"), fullPage: true });
  await page.getByRole("switch", { name: "Dark mode" }).click();
  await page.screenshot({ path: testInfo.outputPath("ink-light.png"), fullPage: true });
});
