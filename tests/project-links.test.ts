import test from "node:test";
import assert from "node:assert/strict";
import { getProjectWebsite } from "../app/lib/project-links";

test("published websites are used and reflect GitHub Website field changes", () => {
  const repo = { url: "https://github.com/aalampatil/new-app", homepage: "https://my-app.example" };
  assert.equal(getProjectWebsite(repo), "https://my-app.example/");
  assert.equal(getProjectWebsite({ ...repo, homepage: "https://new-app.example" }), "https://new-app.example/");
});

test("known project domains cover missing GitHub Website fields", () => {
  assert.equal(getProjectWebsite({ url: "https://github.com/aalampatil/deadlink-ap", homepage: null }), "http://deadlink.sbs/");
  assert.equal(getProjectWebsite({ url: "https://github.com/aalampatil/talaash-ap", homepage: "" }), "http://talaash-ap.space/");
});

test("portfolio.ts URLs take priority over GitHub metadata", () => {
  assert.equal(getProjectWebsite({ url: "https://github.com/aalampatil/oidc-ap", homepage: "https://old-deployment.example/" }), "https://oidc-ap.aalampatil.online/");
  assert.equal(getProjectWebsite({ url: "https://github.com/someone-else/oidc-ap", homepage: "https://other-project.example/" }), "https://other-project.example/");
});

test("missing live URLs never send project visitors to the source repository", () => {
  const repo = { url: "https://github.com/aalampatil/unknown-app", homepage: null };
  assert.equal(getProjectWebsite(repo), null);
  for (const homepage of ["javascript:alert(1)", "not a URL", "https://github.com/aalampatil/unknown-app"]) {
    assert.equal(getProjectWebsite({ ...repo, homepage }), null);
  }
});
