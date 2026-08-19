import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  Chat,
  ContextSource,
  Memory,
  Message,
  RelayStore,
  SourceKind,
} from "./relay-types";

const emptyStore = (): RelayStore => ({
  version: 1,
  chats: [],
  messages: [],
  sources: [],
  memories: [],
});
const globalRelay = globalThis as typeof globalThis & {
  __relayStore?: RelayStore;
  __relayQueue?: Promise<void>;
};
const localStorePath =
  process.env.RELAY_STORE_PATH || path.resolve(".relay-data", "store.json");

export const storageMode = process.env.VERCEL ? "memory" : "json-file";

async function readStore(): Promise<RelayStore> {
  if (storageMode === "memory")
    return (
      globalRelay.__relayStore ?? (globalRelay.__relayStore = emptyStore())
    );
  try {
    const parsed = JSON.parse(
      await readFile(localStorePath, "utf8"),
    ) as Partial<RelayStore>;
    return {
      version: 1,
      chats: parsed.chats ?? [],
      messages: parsed.messages ?? [],
      sources: parsed.sources ?? [],
      memories: parsed.memories ?? [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return emptyStore();
  }
}

async function writeStore(store: RelayStore) {
  globalRelay.__relayStore = store;
  if (storageMode === "memory") return;
  await mkdir(path.dirname(localStorePath), { recursive: true });
  const temporary = `${localStorePath}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(store, null, 2), "utf8");
  await rename(temporary, localStorePath);
}

async function mutate<T>(
  operation: (store: RelayStore) => T | Promise<T>,
): Promise<T> {
  let result!: T;
  const previous = globalRelay.__relayQueue ?? Promise.resolve();
  globalRelay.__relayQueue = previous.then(async () => {
    const store = await readStore();
    result = await operation(store);
    await writeStore(store);
  });
  await globalRelay.__relayQueue;
  return result;
}

export async function listChats() {
  const store = await readStore();
  return [...store.chats]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((chat) => ({
      ...chat,
      messageCount: store.messages.filter(
        (message) => message.chatId === chat.id,
      ).length,
    }));
}

export async function createChat(title = "Nova conversa") {
  return mutate((store) => {
    const now = new Date().toISOString();
    const chat: Chat = {
      id: randomUUID(),
      title: title.trim() || "Nova conversa",
      createdAt: now,
      updatedAt: now,
    };
    store.chats.push(chat);
    return chat;
  });
}

export async function getChat(id: string) {
  const store = await readStore();
  const chat = store.chats.find((item) => item.id === id);
  if (!chat) return null;
  return {
    ...chat,
    messages: store.messages
      .filter((message) => message.chatId === id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

export async function updateChat(id: string, title: string) {
  return mutate((store) => {
    const chat = store.chats.find((item) => item.id === id);
    if (!chat) return null;
    chat.title = title.trim() || chat.title;
    chat.updatedAt = new Date().toISOString();
    return chat;
  });
}

export async function deleteChat(id: string) {
  return mutate((store) => {
    const index = store.chats.findIndex((item) => item.id === id);
    if (index < 0) return false;
    store.chats.splice(index, 1);
    store.messages = store.messages.filter((message) => message.chatId !== id);
    return true;
  });
}

export async function addMessage(
  chatId: string,
  role: Message["role"],
  content: string,
  sourceIds?: string[],
) {
  return mutate((store) => {
    const chat = store.chats.find((item) => item.id === chatId);
    if (!chat) return null;
    const createdAt = new Date().toISOString();
    const message: Message = {
      id: randomUUID(),
      chatId,
      role,
      content: content.trim(),
      createdAt,
      ...(sourceIds?.length ? { sourceIds } : {}),
    };
    store.messages.push(message);
    chat.updatedAt = createdAt;
    if (chat.title === "Nova conversa" && role === "user")
      chat.title = content.trim().slice(0, 52) || chat.title;
    return message;
  });
}

export async function listContext() {
  const store = await readStore();
  return {
    sources: [...store.sources].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    ),
    memories: [...store.memories].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
  };
}

export async function ingestContext(
  input: {
    kind: SourceKind;
    name: string;
    content: string;
    synthetic?: boolean;
  },
  memories: Omit<Memory, "id" | "sourceId" | "createdAt">[],
) {
  return mutate((store) => {
    const now = new Date().toISOString();
    const source: ContextSource = {
      id: `SRC-${randomUUID().slice(0, 8).toUpperCase()}`,
      kind: input.kind,
      name: input.name.trim(),
      content: input.content.trim(),
      synthetic: input.synthetic !== false,
      createdAt: now,
      updatedAt: now,
    };
    const storedMemories: Memory[] = memories.map((memory) => ({
      ...memory,
      id: `MEM-${randomUUID().slice(0, 8).toUpperCase()}`,
      sourceId: source.id,
      createdAt: now,
    }));
    store.sources.push(source);
    store.memories.push(...storedMemories);
    return { source, memories: storedMemories };
  });
}
