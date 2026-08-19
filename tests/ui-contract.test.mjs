import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("preserva o fluxo central da demo", async () => {
  const source = await readFile(new URL("../app/relay-app.tsx", import.meta.url), "utf8");
  for (const expected of ["3 fontes, um estado operacional", "Aprovar e registrar", "Gerar handoff", "Pergunte à Relay", "SRC-01", "SRC-02", "SRC-03"]) assert.match(source, new RegExp(expected));
  assert.doesNotMatch(source, /SkeletonPreview|codex-preview/);
});
