import type { ContextSource, Memory, MemoryKind, Message } from "./relay-types";

type DraftMemory = Omit<Memory, "id" | "sourceId" | "createdAt">;

function outputText(payload: unknown) {
  const response = payload as {
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  return response.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text")
    ?.text?.trim();
}

async function callOpenAI(instructions: string, input: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions,
      input,
    }),
  });
  if (!response.ok) return null;
  return outputText(await response.json());
}

function fallbackMemories(content: string): DraftMemory[] {
  const sentences = content
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
  const classify = (sentence: string): MemoryKind => {
    if (/decid|aprov|defin/i.test(sentence)) return "decision";
    if (/risco|bloque|falha|pend/i.test(sentence)) return "risk";
    if (/ação|acao|próxim|respons|fazer/i.test(sentence)) return "action";
    if (/conflit|diverg|desatual/i.test(sentence)) return "conflict";
    return "fact";
  };
  return (sentences.length ? sentences : [content.slice(0, 240)]).map(
    (summary, index) => ({
      kind: classify(summary),
      title: `Memória ${index + 1}`,
      summary: summary.slice(0, 360),
      confidence: 0.62,
    }),
  );
}

export async function assimilate(
  content: string,
): Promise<{ memories: DraftMemory[]; mode: "live" | "fallback" }> {
  const text = await callOpenAI(
    "Extraia memória operacional factual do texto. Responda SOMENTE JSON válido como array de até 6 objetos com kind (fact,decision,risk,action,conflict,insight), title, summary e confidence de 0 a 1. Não invente.",
    content,
  );
  if (text) {
    try {
      const clean = text.replace(/^```json\s*|\s*```$/g, "");
      const parsed = JSON.parse(clean) as Array<Partial<DraftMemory>>;
      const allowed = new Set<MemoryKind>([
        "fact",
        "decision",
        "risk",
        "action",
        "conflict",
        "insight",
      ]);
      const memories = parsed
        .filter((item) => item.title && item.summary)
        .slice(0, 6)
        .map((item) => ({
          kind: allowed.has(item.kind as MemoryKind)
            ? (item.kind as MemoryKind)
            : "insight",
          title: String(item.title).slice(0, 100),
          summary: String(item.summary).slice(0, 500),
          confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0.7)),
        }));
      if (memories.length) return { memories, mode: "live" };
    } catch {
      /* deterministic extraction below */
    }
  }
  return { memories: fallbackMemories(content), mode: "fallback" };
}

export async function answerWithContext(
  question: string,
  sources: ContextSource[],
  memories: Memory[],
  history: Message[],
) {
  const selectedSources = sources.slice(0, 12);
  const context = selectedSources
    .map(
      (source) =>
        `[${source.id}] ${source.kind} — ${source.name}\n${source.content}`,
    )
    .join("\n\n");
  const memoryContext = memories
    .slice(0, 20)
    .map((memory) => `[${memory.sourceId}] ${memory.kind}: ${memory.summary}`)
    .join("\n");
  const chatHistory = history
    .slice(-12)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");
  const text = await callOpenAI(
    "Você é Relay, a memória operacional da empresa. Responda em português com objetividade. Use somente o contexto fornecido, diferencie fato de inferência, cite fontes como [SRC-...], e proponha ação apenas quando sustentada.",
    `FONTES:\n${context || "Nenhuma fonte assimilada."}\n\nMEMÓRIAS:\n${memoryContext || "Nenhuma memória."}\n\nHISTÓRICO:\n${chatHistory || "Primeira mensagem."}\n\nPERGUNTA:\n${question}`,
  );
  if (text)
    return {
      answer: text,
      mode: "live" as const,
      sourceIds: selectedSources.map((source) => source.id),
    };
  const relevant = memories.slice(0, 4);
  return {
    answer: relevant.length
      ? `Com base no contexto assimilado: ${relevant.map((item) => item.summary).join(" ")}`
      : "Ainda não há contexto assimilado suficiente para responder com segurança.",
    mode: "fallback" as const,
    sourceIds: [...new Set(relevant.map((item) => item.sourceId))],
  };
}
