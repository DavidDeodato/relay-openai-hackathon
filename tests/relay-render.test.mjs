import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://relay.test/", { headers: { accept: "text/html", host: "relay.test", "x-forwarded-proto": "https" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renderiza a visão operacional Relay", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Relay — contexto que vira ação/i);
  assert.match(html, /Visão operacional/i);
  assert.match(html, /3 fontes, um estado operacional/i);
  assert.match(html, /Aprovar e registrar/i);
  assert.match(html, /Gerar handoff/i);
  assert.match(html, /https:\/\/relay\.test\/og\.png/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});
