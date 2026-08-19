import { NextResponse } from "next/server";
import { assimilate } from "../../../lib/relay-ai";
import { ingestContext, storageMode } from "../../../lib/relay-store";
import type { SourceKind } from "../../../lib/relay-types";

export const runtime = "nodejs";
const kinds = new Set<SourceKind>([
  "slack",
  "github",
  "document",
  "protocol",
  "chat",
  "other",
]);

async function parseInput(request: Request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const content =
      file instanceof File
        ? await file.text()
        : String(form.get("content") || "");
    return {
      name: String(
        form.get("name") ||
          (file instanceof File ? file.name : "Contexto enviado"),
      ),
      kind: String(form.get("kind") || "document"),
      content,
      synthetic: String(form.get("synthetic") ?? "true") !== "false",
    };
  }
  return (await request.json()) as {
    name?: string;
    kind?: string;
    content?: string;
    synthetic?: boolean;
  };
}

export async function POST(request: Request) {
  const input = await parseInput(request).catch(() => null);
  if (!input?.content?.trim())
    return NextResponse.json({ error: "Conteúdo vazio." }, { status: 400 });
  if (input.content.length > 100_000)
    return NextResponse.json(
      { error: "Conteúdo excede 100 mil caracteres." },
      { status: 413 },
    );
  const kind = kinds.has(input.kind as SourceKind)
    ? (input.kind as SourceKind)
    : "other";
  const assimilation = await assimilate(input.content);
  const result = await ingestContext(
    {
      kind,
      name: input.name || "Contexto enviado",
      content: input.content,
      synthetic: input.synthetic,
    },
    assimilation.memories,
  );
  return NextResponse.json(
    { ...result, assimilationMode: assimilation.mode, storageMode },
    { status: 201 },
  );
}
