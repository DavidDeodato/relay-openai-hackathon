export type SourceKind =
  | "slack"
  | "github"
  | "document"
  | "protocol"
  | "chat"
  | "other";

export type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  sourceIds?: string[];
};

export type ContextSource = {
  id: string;
  kind: SourceKind;
  name: string;
  content: string;
  synthetic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MemoryKind =
  | "fact"
  | "decision"
  | "risk"
  | "action"
  | "conflict"
  | "insight";

export type Memory = {
  id: string;
  sourceId: string;
  kind: MemoryKind;
  title: string;
  summary: string;
  confidence: number;
  createdAt: string;
};

export type RelayStore = {
  version: 1;
  chats: Chat[];
  messages: Message[];
  sources: ContextSource[];
  memories: Memory[];
};
