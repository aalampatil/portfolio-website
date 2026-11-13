import { test, expect } from "@playwright/test";
import snapshot from "@/data/github.json" with { type: "json" };
import type { GitHubData } from "@/types/portfolio";
import { getProjectWebsite } from "@/lib/project-links";

let currentData: GitHubData;
let visitors: Set<string>;

test.beforeEach(async ({ page }) => {
  currentData = { ...snapshot, repositorySource: "github", contributionSource: "github" };
  visitors = new Set();
  await page.clock.install();
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("**/api/github", route => route.fulfill({ json: currentData }));
  await page.route("**/api/visitors", route => {
    if (route.request().method() === "POST") visitors.add(route.request().postDataJSON().visitorId);
    return route.fulfill({ json: { count: 100 + visitors.size } });
  });
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

test("visitor count is displayed without counting refreshes as new visitors", async ({ page }) => {
  await expect(page.getByRole("status", { name: "Visitor count" })).toHaveText("101visitors");
  expect(visitors.size).toBe(1);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status", { name: "Visitor count" })).toHaveText("101visitors");
  expect(visitors.size).toBe(1);
});

test("visitor count shows an unavailable state during a database outage", async ({ page }) => {
  await page.route("**/api/visitors", route => route.fulfill({ status: 503, json: { error: "Unavailable" } }));
  await page.reload({ waitUntil: "domcontentloaded" });
  const counter = page.getByRole("status", { name: "Visitor count" });
  await expect(counter).toHaveText("—visitors");
  await expect(counter).toHaveAttribute("title", "Visitor count temporarily unavailable");
});

test("only pinned repositories appear, and a changed pin list updates after five minutes", async ({ page }) => {
  await expect(page.locator(".github-repo")).toHaveCount(snapshot.repositories.length);
  await expect(page.locator(".featured-project, .small-project, .github-expand")).toHaveCount(0);
  const first = snapshot.repositories[0];
  currentData = { ...currentData, repositories: [{ ...first, name: "newly-pinned-project" }] };
  await page.clock.fastForward(5 * 60 * 1000);
  await expect(page.locator(".github-repo")).toHaveCount(1);
  await expect(page.locator(".github-repo h3")).toHaveText("newly-pinned-project");
});

test("project titles open their websites and source links remain separate", async ({ page }) => {
  for (const repo of snapshot.repositories) {
    const card = page.locator(".github-repo").filter({ has: page.getByRole("heading", { name: repo.name, exact: true }) });
    const website = getProjectWebsite(repo);
    if (website) {
      await expect(card.locator("h3 a")).toHaveAttribute("href", website);
      await expect(card.getByRole("link", { name: /Visit project/ })).toHaveAttribute("href", website);
    } else {
      await expect(card.locator("h3 a")).toHaveCount(0);
      await expect(card.getByText("Live site not listed")).toBeVisible();
    }
    await expect(card.getByRole("link", { name: /View source/ })).toHaveAttribute("href", repo.url);
  }
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
  await expect(page.locator(".landscape-moon")).toHaveCSS("animation-play-state", "paused");
  await expect(page.locator(".japanese-character").first()).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Resume animation" }).click();
  await expect(artwork).toHaveAttribute("data-motion", "active");
  await expect(page.locator(".landscape-moon")).toHaveCSS("animation-name", "moon-drift");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(artwork).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".code-cube")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".landscape-moon")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".japanese-character").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator(".artwork-motion .samurai-image")).toHaveCSS("transform", "none");
  await page.screenshot({ path: testInfo.outputPath("ink-dark.png"), fullPage: true });
  await page.getByRole("switch", { name: "Dark mode" }).click();
  await page.screenshot({ path: testInfo.outputPath("ink-light.png"), fullPage: true });
});

test("weather offers only Snow and Sakura, remembers preferences, and turns completely off", async ({ page }, testInfo) => {
  const toggle = page.getByRole("switch", { name: "Season effects" });
  const options = page.getByRole("button", { name: "Choose effect" });
  await expect(toggle).toBeChecked();
  await options.click();
  await expect(page.getByRole("radio")).toHaveCount(2);
  for (const [name, season] of [["Snow", "winter"], ["Sakura", "spring"]]) {
    await page.getByRole("radio", { name, exact: true }).check();
    await expect(page.locator("[data-weather-scene]")).toHaveAttribute("data-weather-scene", season);
    await page.clock.runFor(150);
    await page.screenshot({ path: testInfo.outputPath(`${season}.png`) });
  }
  await expect(toggle).toContainText("Sakura");
  const petals = await page.locator(".weather-canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL());
  await page.clock.runFor(1000);
  expect(await page.locator(".weather-canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL())).not.toBe(petals);
  await page.keyboard.press("Escape");
  await expect(options).toBeFocused();
  await expect(options).toHaveAttribute("aria-expanded", "false");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-weather-scene]")).toHaveAttribute("data-weather-scene", "spring");
  await toggle.click();
  await expect(page.locator("[data-weather-scene]")).toHaveCount(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(toggle).not.toBeChecked();
  await expect(page.locator(".weather-canvas")).toHaveCount(0);
});

test("saved effects that are no longer offered fall back to Snow", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("portfolio-weather-v1", JSON.stringify({ enabled: false, season: "monsoon" })));
  await page.reload({ waitUntil: "domcontentloaded" });
  const toggle = page.getByRole("switch", { name: "Season effects" });
  await expect(toggle).toBeEnabled();
  await expect(toggle).not.toBeChecked();
  await expect(toggle).toContainText("Snow");
  await toggle.click();
  await expect(page.locator("[data-weather-scene]")).toHaveAttribute("data-weather-scene", "winter");
});

test("weather options fit mobile screens and respect reduced motion", async ({ page }) => {
  const options = page.getByRole("button", { name: "Choose effect" });
  for (const width of [1440, 1024, 768, 760, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await options.click();
    const bounds = await page.locator(".weather-popover").boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.keyboard.press("Escape");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "domcontentloaded" });
  const toggle = page.getByRole("switch", { name: "Season effects" });
  await expect(toggle).toBeEnabled();
  await expect(toggle).not.toBeChecked();
  await options.click();
  await page.getByRole("radio", { name: "Sakura", exact: true }).check();
  await page.keyboard.press("Escape");
  await expect(page.locator(".weather-canvas")).toHaveCount(0);
  await toggle.click();
  await expect(page.locator("[data-weather-scene]")).toHaveAttribute("data-weather-scene", "spring");
  await expect(page.locator("[data-weather-scene]")).toHaveAttribute("data-motion", "still");
  await page.clock.runFor(100);
  const still = await page.locator(".weather-canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL());
  await page.clock.runFor(1000);
  expect(await page.locator(".weather-canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL())).toBe(still);
});

test("winter snow builds on real buttons and brushes away on hover", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: "Choose effect" }).click();
  await page.getByRole("radio", { name: "Snow", exact: true }).check();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-weather-scene]")).toHaveAttribute("data-weather-scene", "winter");
  const button = page.getByRole("link", { name: "View selected work" });
  const bounds = (await button.boundingBox())!;
  // Read only the white snow pixels above the button, excluding atmospheric haze.
  async function snowPixels() {
    return page.locator(".weather-canvas").evaluate((element, rect) => {
      const canvas = element as HTMLCanvasElement;
      const scale = canvas.width / window.innerWidth;
      const pixels = canvas.getContext("2d")!.getImageData(
        Math.round((rect.x + 5) * scale), Math.round((rect.y - 16) * scale),
        Math.round((rect.width - 10) * scale), Math.round(15 * scale),
      ).data;
      let count = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] > 180 && pixels[i + 1] > 180 && pixels[i + 2] > 180 && pixels[i + 3] > 180) count++;
      }
      return count;
    }, bounds);
  }
  await page.clock.runFor(100);
  const initial = await snowPixels();
  await page.clock.runFor(25000);
  const accumulated = await snowPixels();
  expect(accumulated).toBeGreaterThan(initial + 100);
  await page.screenshot({ path: testInfo.outputPath("winter-snow.png") });
  await button.hover();
  await page.clock.runFor(1500);
  expect(await snowPixels()).toBeLessThan(accumulated * 0.6);
  // The original link remains usable beneath the decorative canvas.
  await button.click();
  await expect(page).toHaveURL(/#projects$/);
});
