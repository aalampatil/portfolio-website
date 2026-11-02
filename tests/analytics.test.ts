import test from "node:test";
import assert from "node:assert/strict";
import { getVisitAttribution } from "@/lib/analytics";
import { analyticsAuthResponse, isAnalyticsAuthorized } from "@/lib/analytics-auth";
import { GET } from "@/app/api/admin/analytics/route";

test("sources prioritize campaign tags and store only the referring hostname", () => {
  const headers = new Headers({ origin: "https://portfolio.example" });
  assert.equal(getVisitAttribution({ utmSource: "LinkedIn", referrer: "https://google.com/search?private=secret" }, headers).source, "Campaign: linkedin");
  assert.equal(getVisitAttribution({ referrer: "https://www.github.com/someone?token=secret" }, headers).source, "github.com");
  for (const referrer of ["", "invalid", "javascript:alert(1)", "https://portfolio.example/about"]) {
    assert.equal(getVisitAttribution({ referrer }, headers).source, "Direct / Unknown");
  }
  assert.equal(getVisitAttribution({ utmSource: "x".repeat(81) }, headers).source, "Direct / Unknown");
});

test("location is accepted only from Vercel headers, never supplied JSON", () => {
  const headers = new Headers({ "x-vercel-ip-country": "IN", "x-vercel-ip-city": "Pune%20City" });
  const body = { country: "US", city: "Spoofed" };
  assert.deepEqual(getVisitAttribution(body, headers, true), { source: "Direct / Unknown", country: "IN", city: "Pune City" });
  assert.deepEqual(getVisitAttribution(body, headers, false), { source: "Direct / Unknown", country: null, city: null });
  assert.equal(getVisitAttribution({}, new Headers({ "x-vercel-ip-country": "IN", "x-vercel-ip-city": "%invalid" }), true).city, null);
  assert.equal(getVisitAttribution({}, new Headers({ "x-vercel-ip-country": "invalid" }), true).country, null);
});

test("private analytics fails closed and the API authenticates before database access", async () => {
  const password = process.env.ANALYTICS_ADMIN_PASSWORD;
  const username = process.env.ANALYTICS_ADMIN_USERNAME;
  const makeHeaders = (credentials: string) => new Headers({ authorization: `Basic ${btoa(credentials)}` });
  try {
    delete process.env.ANALYTICS_ADMIN_PASSWORD;
    assert.equal(await isAnalyticsAuthorized(makeHeaders("owner:anything")), false);
    assert.equal(analyticsAuthResponse().status, 503);
    process.env.ANALYTICS_ADMIN_PASSWORD = "too-short";
    assert.equal(await isAnalyticsAuthorized(makeHeaders("owner:too-short")), false);
    process.env.ANALYTICS_ADMIN_USERNAME = "owner";
    process.env.ANALYTICS_ADMIN_PASSWORD = "test-only-strong-password-123456789";
    assert.equal(await isAnalyticsAuthorized(makeHeaders("owner:test-only-strong-password-123456789")), true);
    for (const credentials of ["owner:wrong", "other:test-only-strong-password-123456789", ""]) {
      assert.equal(await isAnalyticsAuthorized(makeHeaders(credentials)), false);
    }
    assert.equal(await isAnalyticsAuthorized(new Headers({ authorization: "Basic !!!" })), false);
    const response = await GET(new Request("https://portfolio.example/api/admin/analytics"));
    assert.equal(response.status, 401);
    assert.match(response.headers.get("www-authenticate") || "", /^Basic /);
    assert.match(response.headers.get("cache-control") || "", /no-store/);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
    assert.equal(await response.text(), "Authentication required.");
  } finally {
    if (password === undefined) delete process.env.ANALYTICS_ADMIN_PASSWORD;
    else process.env.ANALYTICS_ADMIN_PASSWORD = password;
    if (username === undefined) delete process.env.ANALYTICS_ADMIN_USERNAME;
    else process.env.ANALYTICS_ADMIN_USERNAME = username;
  }
});
