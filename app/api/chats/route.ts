import { NextResponse } from "next/server";
import { createChat, listChats, storageMode } from "../../../lib/relay-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ chats: await listChats(), storageMode });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { title?: string };
  return NextResponse.json(
    { chat: await createChat(body.title), storageMode },
    { status: 201 },
  );
}
