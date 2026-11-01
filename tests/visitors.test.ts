import test from "node:test";
import assert from "node:assert/strict";
import { isVisitorId } from "../app/lib/visitors";
import { GET, POST } from "../app/api/visitors/route";

test("visitor IDs accept anonymous UUIDs and reject malformed input", () => {
  assert.ok(isVisitorId("f463a231-5ccd-49ec-9cde-b399bcdb009c"));
  for (const value of [null, 42, {}, "", "visitor", "<script>", "a".repeat(10000)]) assert.equal(isVisitorId(value), false);
});

test("invalid visitor requests are rejected before accessing the database", async () => {
  for (const body of ["not-json", JSON.stringify({ visitorId: "invalid" }), JSON.stringify({})]) {
    const response = await POST(new Request("http://localhost/api/visitors", { method: "POST", body }));
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("an unconfigured database returns an unavailable response instead of a fake count", async () => {
  const original = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;
  try {
    const responses = [await GET(), await POST(new Request("http://localhost/api/visitors", {
      method: "POST", body: JSON.stringify({ visitorId: "f463a231-5ccd-49ec-9cde-b399bcdb009c" }),
    }))];
    for (const response of responses) {
      assert.equal(response.status, 503);
      assert.equal("count" in await response.json(), false);
    }
  } finally {
    if (original === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = original;
  }
});
