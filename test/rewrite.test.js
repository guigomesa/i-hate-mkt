const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({ URL });
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "src", "rewrite.js"), "utf8") + "\nthis.api = { ihmRewrite, IHM_POOLS };", context);
const { ihmRewrite, IHM_POOLS } = context.api;
const first = (list) => list[0];

test("returns null when there is no query string", () => {
  assert.equal(ihmRewrite("https://example.com/page", first), null);
});

test("returns null when no tracking parameter is present", () => {
  assert.equal(ihmRewrite("https://example.com/?q=shoes&page=2", first), null);
});

test("replaces utm values and keeps other parameters untouched", () => {
  const out = new URL(ihmRewrite("https://example.com/p?q=a%20b&utm_source=google&utm_medium=cpc&utm_campaign=bf&x=1#top", first));
  assert.equal(out.searchParams.get("utm_source"), IHM_POOLS.source[0]);
  assert.equal(out.searchParams.get("utm_medium"), IHM_POOLS.medium[0]);
  assert.equal(out.searchParams.get("utm_campaign"), IHM_POOLS.campaign[0]);
  assert.equal(out.searchParams.get("q"), "a b");
  assert.equal(out.searchParams.get("x"), "1");
  assert.equal(out.hash, "#top");
  assert.match(out.search, /^\?q=a%20b&/);
});

test("removes click ids", () => {
  const out = ihmRewrite("https://example.com/?gclid=abc&fbclid=def&hsa_cam=1&keep=1", first);
  assert.equal(out, "https://example.com/?keep=1");
});

test("drops the question mark when only click ids were present", () => {
  assert.equal(ihmRewrite("https://example.com/?gclid=abc", first), "https://example.com/");
});

test("matches keys case-insensitively and keeps the original key spelling", () => {
  const out = ihmRewrite("https://example.com/?UTM_SOURCE=x&ScCid=1", first);
  assert.equal(out, "https://example.com/?UTM_SOURCE=" + encodeURIComponent(IHM_POOLS.source[0]));
});

test("does not add parameters that were not in the url", () => {
  const out = new URL(ihmRewrite("https://example.com/?utm_source=x", first));
  assert.deepEqual([...out.searchParams.keys()], ["utm_source"]);
});

test("covers matomo parameters", () => {
  const out = new URL(ihmRewrite("https://example.com/?mtm_campaign=a&pk_kwd=b", first));
  assert.equal(out.searchParams.get("mtm_campaign"), IHM_POOLS.campaign[0]);
  assert.equal(out.searchParams.get("pk_kwd"), IHM_POOLS.term[0]);
});

test("ignores malformed keys instead of throwing", () => {
  assert.equal(ihmRewrite("https://example.com/?%E0%A4%A=1&utm_source=x", first), "https://example.com/?%E0%A4%A=1&utm_source=" + encodeURIComponent(IHM_POOLS.source[0]));
});

test("is idempotent in shape when run twice", () => {
  const once = ihmRewrite("https://example.com/?utm_source=x&gclid=1", first);
  assert.equal(ihmRewrite(once, first), once);
});
