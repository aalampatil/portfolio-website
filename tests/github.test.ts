import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeRepositories, parseContributions, parsePinnedRepositories } from "@/lib/github";

test("repository import shows only pins in profile order, including explicitly pinned forks", () => {
  const base = { name: "new-project", full_name: "aalampatil/new-project", pushed_at: "2026-11-01", html_url: "https://github.com/aalampatil/new-project", description: null, language: "TypeScript", stargazers_count: 0 };
  const result = normalizeRepositories([
    base, { ...base, name: "fork", full_name: "aalampatil/fork", fork: true },
    { ...base, name: "private", full_name: "aalampatil/private", private: true },
    { ...base, name: "unpinned", full_name: "aalampatil/unpinned" },
  ], ["aalampatil/fork", "aalampatil/new-project"]);
  assert.deepEqual(result.map(repo => repo.name), ["fork", "new-project"]);
  assert.equal(result[1].url, base.html_url);
  // @ts-expect-error A GitHub error response must be rejected at runtime.
  assert.throws(() => normalizeRepositories({ message: "rate limited" }, []));
  assert.throws(() => normalizeRepositories([base], ["aalampatil/missing"]));
  assert.deepEqual(normalizeRepositories([base], []), []);
});

test("profile parsing distinguishes pinned repositories from popular repositories", () => {
  const item = (name: string, target: string) => `<li class="js-pinned-item-list-item"><a data-target="${target}" href="/aalampatil/${name}"><span class="repo">${name}</span></a></li>`;
  assert.deepEqual(parsePinnedRepositories(item("second", "PINNED_REPO") + item("first", "PINNED_REPO")), ["aalampatil/second", "aalampatil/first"]);
  assert.deepEqual(parsePinnedRepositories("Popular repositories" + item("popular", "POPULAR_REPO")), []);
  assert.throws(() => parsePinnedRepositories("<html>Sign in</html>"));
});

test("calendar parsing associates tooltip counts by ID and sorts row-major GitHub dates", () => {
  const cells = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(Date.UTC(2025, 10, 2 + index)).toISOString().slice(0, 10);
    return `<td data-level="${index ? 0 : 4}" id="day-${index}" data-date="${date}"></td>`;
  }).reverse().join("");
  const tips = Array.from({ length: 365 }, (_, index) => `<tool-tip for="day-${index}">${index ? "No contributions" : "1,234 contributions"} on a date.</tool-tip>`).join("");
  const days = parseContributions(cells + tips);
  assert.equal(days.length, 365);
  assert.deepEqual(days[0], { date: "2025-11-02", count: 1234, level: 4 });
  assert.equal(days.at(-1)?.date, "2026-11-01");
  assert.equal(days[1].count, 0);
});

test("changed or incomplete calendar responses are rejected instead of displaying invented zeros", () => {
  assert.throws(() => parseContributions("<html>Rate limited</html>"));
  assert.throws(() => parseContributions('<td data-date="2026-11-01" id="day-1" data-level="4"></td>'));
});

test("checked-in fallback has a complete, chronological calendar with valid activity levels", async () => {
  const data = JSON.parse(await readFile(new URL("../src/data/github.json", import.meta.url), "utf8"));
  assert.ok(data.repositories.length > 5);
  assert.ok(data.contributions.length >= 365);
  assert.ok(!Number.isNaN(Date.parse(data.fetchedAt)));
  for (const [index, day] of data.contributions.entries()) {
    assert.ok(Number.isInteger(day.count) && day.count >= 0);
    assert.ok(Number.isInteger(day.level) && day.level >= 0 && day.level <= 4);
    if (index) assert.equal(Date.parse(day.date) - Date.parse(data.contributions[index - 1].date), 86400000);
  }
});
