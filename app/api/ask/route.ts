import { NextResponse } from "next/server";

const companyContext = `
SRC-01 Slack: o piloto de sexta terá busca e respostas com fonte; CSV saiu da primeira versão; falta um schema de parceiro.
SRC-02 GitHub: commit 8f31c2a adicionou idempotência contra eventos duplicados; smoke ponta a ponta ainda está pendente.
SRC-03 Documento: o escopo v3 ainda exige CSV e três empresas parceiras.
Decisão: lançar sem CSV. Conflito: documento desatualizado. Ação aprovada: atualizar o escopo e comunicar o time.
`;

export async function POST(request: Request) {
  const { question } = await request.json() as { question?: string };
  if (!question?.trim()) return NextResponse.json({ error: "Pergunta vazia." }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ answer: "A decisão vigente retira CSV do piloto. O documento v3 ainda está desatualizado.", sources: ["SRC-01", "SRC-03"], mode: "demo" });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: "Responda em português, em até 70 palavras. Seja factual, explicite incerteza e termine com as fontes relevantes no formato [SRC-XX]. Não invente informações.",
      input: `Contexto operacional:\n${companyContext}\nPergunta: ${question}`,
    }),
  });
  if (!response.ok) return NextResponse.json({ answer: "Não consegui consultar o modelo agora. A memória operacional continua disponível nas fontes.", sources: [], mode: "fallback" });
  const payload = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const answer = payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
  return NextResponse.json({ answer: answer || "Resposta indisponível.", sources: ["SRC-01", "SRC-02", "SRC-03"], mode: "live" });
}
