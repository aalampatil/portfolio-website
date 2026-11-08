import test from "node:test";
import assert from "node:assert/strict";
import snapshot from "@/data/github.json";
import { GET } from "@/app/api/github/route";

const calendar = snapshot.contributions.map((day, index) =>
  `<td data-date="${day.date}" data-level="${day.level}" id="day-${index}"></td>` +
  `<tool-tip for="day-${index}">${day.count} contributions on a date.</tool-tip>`,
).join("");

test("fresh GitHub responses bypass CDN caching and carry the actual refresh time", async context => {
  const requests: { url: string; options?: RequestInit }[] = [];
  const previousToken = process.env.GITHUB_TOKEN;
  process.env.GITHUB_TOKEN = "test-server-token";
  context.after(() => {
    if (previousToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previousToken;
  });
  context.mock.method(globalThis, "fetch", async (url: string, options?: RequestInit) => {
    requests.push({ url, options });
    if (url.includes("api.github.com")) return Response.json([{
      name: "fresh", full_name: "aalampatil/fresh", html_url: "https://github.com/aalampatil/fresh",
      pushed_at: "2026-11-08T00:00:00Z", description: null, language: "TypeScript", stargazers_count: 2,
    }]);
    if (url.endsWith("/contributions")) return new Response(calendar);
    return new Response('<li class="js-pinned-item-list-item"><a data-target="PINNED_REPO" href="/aalampatil/fresh"><span class="repo">fresh</span></a></li>');
  });
  const start = Date.now();
  const response = await GET();
  const data = await response.json();
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(data.repositorySource, "github");
  assert.equal(data.contributionSource, "github");
  assert.equal(data.repositories[0].name, "fresh");
  assert.ok(Date.parse(data.fetchedAt) >= start);
  for (const request of requests) {
    assert.equal(request.options?.cache, "no-store");
    assert.equal(new Headers(request.options?.headers).get("Authorization"),
      request.url.includes("api.github.com") ? "Bearer test-server-token" : null);
  }
});

test("an upstream failure falls back independently without caching the stale response", async context => {
  const warnings: unknown[][] = [];
  context.mock.method(console, "warn", (...args: unknown[]) => warnings.push(args));
  context.mock.method(globalThis, "fetch", async (url: string) =>
    url.endsWith("/contributions") ? new Response(calendar) : new Response("Rate limited", { status: 403 }),
  );
  const response = await GET();
  const data = await response.json();
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(data.repositorySource, "snapshot");
  assert.equal(data.contributionSource, "github");
  assert.deepEqual(data.repositories, snapshot.repositories);
  assert.equal(warnings.length, 1);
});
