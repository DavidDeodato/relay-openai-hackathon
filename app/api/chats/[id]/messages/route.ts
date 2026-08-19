import { NextResponse } from "next/server";
import { answerWithContext } from "../../../../../lib/relay-ai";
import {
  addMessage,
  getChat,
  listContext,
} from "../../../../../lib/relay-store";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const chat = await getChat((await params).id);
  return chat
    ? NextResponse.json({ messages: chat.messages })
    : NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
}

export async function POST(request: Request, { params }: RouteContext) {
  const chatId = (await params).id;
  const { content } = (await request.json().catch(() => ({}))) as {
    content?: string;
  };
  if (!content?.trim())
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  const userMessage = await addMessage(chatId, "user", content);
  if (!userMessage)
    return NextResponse.json(
      { error: "Conversa não encontrada." },
      { status: 404 },
    );
  const chat = await getChat(chatId);
  const { sources, memories } = await listContext();
  const result = await answerWithContext(
    content,
    sources,
    memories,
    chat?.messages ?? [],
  );
  const assistantMessage = await addMessage(
    chatId,
    "assistant",
    result.answer,
    result.sourceIds,
  );
  return NextResponse.json(
    {
      userMessage,
      assistantMessage,
      mode: result.mode,
      sources: result.sourceIds,
    },
    { status: 201 },
  );
}
