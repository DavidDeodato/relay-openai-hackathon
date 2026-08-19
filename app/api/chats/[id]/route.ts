import { NextResponse } from "next/server";
import { deleteChat, getChat, updateChat } from "../../../../lib/relay-store";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const chat = await getChat((await params).id);
  return chat
    ? NextResponse.json({ chat })
    : NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { title } = (await request.json().catch(() => ({}))) as {
    title?: string;
  };
  if (!title?.trim())
    return NextResponse.json({ error: "Título vazio." }, { status: 400 });
  const chat = await updateChat((await params).id, title);
  return chat
    ? NextResponse.json({ chat })
    : NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return (await deleteChat((await params).id))
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
}
