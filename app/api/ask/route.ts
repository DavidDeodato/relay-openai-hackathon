import { NextResponse } from "next/server";
import { answerWithContext } from "../../../lib/relay-ai";
import {
  addMessage,
  createChat,
  getChat,
  listContext,
} from "../../../lib/relay-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { question, chatId: requestedChatId } = (await request.json()) as {
    question?: string;
    chatId?: string;
  };
  if (!question?.trim())
    return NextResponse.json({ error: "Pergunta vazia." }, { status: 400 });
  let chatId = requestedChatId;
  if (!chatId || !(await getChat(chatId))) chatId = (await createChat()).id;
  const userMessage = await addMessage(chatId, "user", question);
  const chat = await getChat(chatId);
  const { sources, memories } = await listContext();
  const result = await answerWithContext(
    question,
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
  return NextResponse.json({
    answer: result.answer,
    sources: result.sourceIds,
    mode: result.mode,
    chatId,
    userMessage,
    assistantMessage,
  });
}
