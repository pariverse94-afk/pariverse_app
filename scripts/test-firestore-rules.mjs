#!/usr/bin/env node
/**
 * Firestore rules tests, run against Google's Rules evaluation API.
 *
 * No emulator and no JDK required — this posts the ruleset plus a set of
 * simulated requests to firebaserules.googleapis.com and asks what the rules
 * would decide. Nothing is written to the database and no rules are deployed.
 *
 *   node scripts/test-firestore-rules.mjs
 *
 * Auth comes from the Firebase CLI's stored credentials, so run
 * `npx firebase-tools login` once first.
 *
 * With no server tier, these rules are the entire access-control layer for the
 * app. A mistake here exposes every user at once, which is why this exists.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = "pariverse-prod";

// Public client id/secret embedded in the open-source firebase-tools CLI.
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

function request(host, path, { method = "GET", body, token, json } = {}) {
  return new Promise((resolvePromise, reject) => {
    const payload = body ? (json ? JSON.stringify(body) : new URLSearchParams(body).toString()) : null;
    const headers = {};
    if (payload) {
      headers["Content-Type"] = json ? "application/json" : "application/x-www-form-urlencoded";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }
    if (token) headers.Authorization = `Bearer ${token}`;
    const req = https.request({ host, path, method, headers }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolvePromise(data));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function accessToken() {
  const configPath = join(homedir(), ".config", "configstore", "firebase-tools.json");
  let refreshToken;
  try {
    refreshToken = JSON.parse(readFileSync(configPath, "utf8")).tokens.refresh_token;
  } catch {
    throw new Error("No Firebase CLI credentials. Run: npx firebase-tools login");
  }
  const res = JSON.parse(
    await request("oauth2.googleapis.com", "/token", {
      method: "POST",
      body: { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: refreshToken, grant_type: "refresh_token" },
    }),
  );
  if (!res.access_token) throw new Error("Could not refresh access token — try `npx firebase-tools login` again");
  return res.access_token;
}

const DB = "/databases/(default)/documents";

/** One simulated request. `data` is the incoming document for writes. */
function testCase(name, expectation, { uid, email, path, method, data, existing }) {
  return {
    __name: name,
    expressionReportLevel: "NONE",
    expectation,
    request: {
      auth: uid ? { uid, token: { email: email ?? `${uid}@example.com` } } : null,
      path: DB + path,
      method,
      time: new Date().toISOString(),
      ...(data ? { resource: { data } } : {}),
    },
    ...(existing ? { resource: { data: existing } } : {}),
  };
}

const post = (over = {}) => ({
  authorId: "alice",
  authorName: "Alice",
  authorColor: "#E07B39",
  content: "hello",
  category: "general",
  likeCount: 0,
  createdAt: new Date().toISOString(),
  ...over,
});

const CASES = [
  // ── Per-user isolation: the core promise of the whole model ──────────────
  testCase("own profile: read", "ALLOW", { uid: "alice", path: "/users/alice", method: "get" }),
  testCase("other's profile: read is denied", "DENY", { uid: "alice", path: "/users/bob", method: "get" }),
  testCase("own profile: write", "ALLOW", { uid: "alice", path: "/users/alice", method: "create", data: { name: "A" } }),
  testCase("other's profile: write is denied", "DENY", { uid: "alice", path: "/users/bob", method: "create", data: { name: "A" } }),
  testCase("own app data", "ALLOW", { uid: "alice", path: "/users/alice/data/family", method: "create", data: { x: 1 } }),
  testCase("other's app data is denied", "DENY", { uid: "alice", path: "/users/bob/data/family", method: "get" }),
  testCase("signed out reads nothing", "DENY", { path: "/users/alice", method: "get" }),

  // ── emailIndex: lookup yes, enumeration no ───────────────────────────────
  testCase("email lookup by exact address", "ALLOW", { uid: "alice", path: "/emailIndex/bob@example.com", method: "get" }),
  testCase("listing all registered emails is denied", "DENY", { uid: "alice", path: "/emailIndex/bob@example.com", method: "list" }),

  // ── Community posts ──────────────────────────────────────────────────────
  testCase("signed-in user reads the feed", "ALLOW", { uid: "alice", path: "/communityPosts/p1", method: "get" }),
  testCase("signed-out user cannot read the feed", "DENY", { path: "/communityPosts/p1", method: "get" }),
  testCase("post as yourself", "ALLOW", { uid: "alice", path: "/communityPosts/p1", method: "create", data: post() }),
  testCase("post attributed to someone else is denied", "DENY", { uid: "alice", path: "/communityPosts/p1", method: "create", data: post({ authorId: "bob" }) }),
  testCase("empty post is denied", "DENY", { uid: "alice", path: "/communityPosts/p1", method: "create", data: post({ content: "" }) }),
  testCase("post over 2000 chars is denied", "DENY", { uid: "alice", path: "/communityPosts/p1", method: "create", data: post({ content: "x".repeat(2001) }) }),
  testCase("post pre-loaded with likes is denied", "DENY", { uid: "alice", path: "/communityPosts/p1", method: "create", data: post({ likeCount: 99 }) }),
  testCase("delete your own post", "ALLOW", { uid: "alice", path: "/communityPosts/p1", method: "delete", existing: post() }),
  testCase("delete someone else's post is denied", "DENY", { uid: "bob", path: "/communityPosts/p1", method: "delete", existing: post() }),

  // ── Likes: one per user per post, keyed by uid ───────────────────────────
  testCase("like as yourself", "ALLOW", { uid: "alice", path: "/communityPosts/p1/likes/alice", method: "create", data: { uid: "alice", createdAt: "t" } }),
  testCase("liking on someone else's behalf is denied", "DENY", { uid: "alice", path: "/communityPosts/p1/likes/bob", method: "create", data: { uid: "bob", createdAt: "t" } }),
  testCase("like doc claiming another uid is denied", "DENY", { uid: "alice", path: "/communityPosts/p1/likes/alice", method: "create", data: { uid: "bob", createdAt: "t" } }),
  testCase("unlike your own like", "ALLOW", { uid: "alice", path: "/communityPosts/p1/likes/alice", method: "delete" }),
  testCase("removing someone else's like is denied", "DENY", { uid: "alice", path: "/communityPosts/p1/likes/bob", method: "delete" }),

  // ── Moderation state is server-only ──────────────────────────────────────
  // Written solely by the onReportCreated function via the Admin SDK, which
  // bypasses rules. If any of these start passing as ALLOW, a user can
  // un-hide their own moderated post.
  testCase("author cannot un-hide their own post", "DENY", {
    uid: "alice", path: "/communityPosts/p1", method: "update",
    existing: post({ hidden: true }), data: post({ hidden: false }),
  }),
  testCase("author cannot reset their report count", "DENY", {
    uid: "alice", path: "/communityPosts/p1", method: "update",
    existing: post({ reportCount: 5 }), data: post({ reportCount: 0 }),
  }),
  testCase("a stranger cannot hide someone else's post", "DENY", {
    uid: "bob", path: "/communityPosts/p1", method: "update",
    existing: post(), data: post({ hidden: true }),
  }),
  testCase("author editing their own content still works", "ALLOW", {
    uid: "alice", path: "/communityPosts/p1", method: "update",
    existing: post(), data: post({ content: "edited" }),
  }),
  testCase("liking still works alongside the new restriction", "ALLOW", {
    uid: "bob", path: "/communityPosts/p1", method: "update",
    existing: post({ likeCount: 0 }), data: post({ likeCount: 1 }),
  }),

  // ── Reports: file yes, read never ────────────────────────────────────────
  testCase("file a report as yourself", "ALLOW", { uid: "alice", path: "/reports/r1", method: "create", data: { reportedBy: "alice", postId: "p1" } }),
  testCase("filing a report as someone else is denied", "DENY", { uid: "alice", path: "/reports/r1", method: "create", data: { reportedBy: "bob", postId: "p1" } }),
  testCase("clients cannot read reports", "DENY", { uid: "alice", path: "/reports/r1", method: "get" }),
];

const token = await accessToken();
const source = { files: [{ name: "firestore.rules", content: readFileSync(join(ROOT, "firestore.rules"), "utf8") }] };
const testSuite = { testCases: CASES.map(({ __name, ...c }) => c) };

const raw = await request("firebaserules.googleapis.com", `/v1/projects/${PROJECT}:test`, {
  method: "POST",
  json: true,
  token,
  body: { source, testSuite },
});

const parsed = JSON.parse(raw);
if (parsed.error) {
  console.error(`Rules API error: ${parsed.error.message}`);
  process.exit(1);
}

let failed = 0;
(parsed.testResults ?? []).forEach((result, i) => {
  const ok = result.state === "SUCCESS";
  if (!ok) failed++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${CASES[i].__name}`);
});

console.log(`\n${CASES.length - failed}/${CASES.length} passed`);
if (failed) {
  console.error("\nRules tests failed. These rules are the entire access-control layer — do not deploy.");
  process.exit(1);
}
