/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";

type Source = {
  id: string;
  kind: "Slack" | "GitHub" | "Documento";
  title: string;
  meta: string;
  excerpt: string;
  tone: "green" | "blue" | "violet";
};

const sources: Source[] = [
  {
    id: "SRC-01",
    kind: "Slack",
    title: "#projeto-atlas",
    meta: "Hoje, 10:12 · liderança de produto",
    excerpt:
      "Vamos liberar busca e respostas com fonte. A importação por CSV fica fora desta primeira versão.",
    tone: "green",
  },
  {
    id: "SRC-02",
    kind: "GitHub",
    title: "lume/atlas-demo · 8f31c2a",
    meta: "Hoje, 11:04 · branch main",
    excerpt:
      "fix(sync): impedir processamento duplicado de eventos com chave de idempotência.",
    tone: "blue",
  },
  {
    id: "SRC-03",
    kind: "Documento",
    title: "Escopo do piloto Atlas — v3",
    meta: "Ontem, 17:40 · documento vigente",
    excerpt:
      "O piloto será considerado pronto quando permitir busca, respostas e importação em lote por CSV.",
    tone: "violet",
  },
];

const memories = [
  {
    type: "Decisão",
    text: "O piloto será lançado sem importação em lote por CSV.",
    source: "SRC-01",
    status: "Confirmado",
  },
  {
    type: "Risco",
    text: "O documento vigente ainda exige CSV como critério de aceite.",
    source: "SRC-01 + SRC-03",
    status: "Conflito",
  },
  {
    type: "Mudança técnica",
    text: "Reenvios agora usam idempotência; falta o smoke ponta a ponta.",
    source: "SRC-02",
    status: "Confirmado",
  },
  {
    type: "Pendência",
    text: "Falta o schema de dados de uma empresa parceira.",
    source: "SRC-01",
    status: "Pendente",
  },
];

export default function RelayApp() {
  const [selectedSource, setSelectedSource] = useState<Source>(sources[0]);
  const [actionState, setActionState] = useState<"proposta" | "aprovada">(
    "proposta",
  );
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [askDraft, setAskDraft] = useState("CSV ainda faz parte do piloto?");
  const [lastQuestion, setLastQuestion] = useState(
    "CSV ainda faz parte do piloto?",
  );
  const [askAnswer, setAskAnswer] = useState(
    "Não. A decisão mais recente retirou a importação por CSV desta versão. O documento vigente ainda está desatualizado, então existe um conflito aberto.",
  );
  const [askLoading, setAskLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState("há 2 min");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (window.localStorage.getItem("relay-action") === "aprovada")
        setActionState("aprovada");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const statusLabel = useMemo(
    () =>
      actionState === "aprovada"
        ? "Ação aprovada e registrada"
        : "1 ação aguardando aprovação",
    [actionState],
  );
  function approveAction() {
    setActionState("aprovada");
    window.localStorage.setItem("relay-action", "aprovada");
  }
  function syncContext() {
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      setSyncedAt("agora");
    }, 900);
  }

  async function askRelay() {
    const question = askDraft.trim();
    if (!question || askLoading) return;
    setAskLoading(true);
    setLastQuestion(question);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = (await response.json()) as { answer?: string };
      setAskAnswer(
        payload.answer || "Ainda não há contexto suficiente para responder.",
      );
    } catch {
      setAskAnswer(
        "A consulta falhou, mas as fontes continuam disponíveis no workspace.",
      );
    } finally {
      setAskLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegação do workspace">
        <div className="brand-lockup">
          <img src="/brand/relay-icon.svg" alt="" />
          <span>relay</span>
        </div>
        <div className="workspace-switch">
          <span className="workspace-avatar">L</span>
          <span>
            <strong>Lume</strong>
            <small>Workspace de demo</small>
          </span>
          <span aria-hidden="true">⌄</span>
        </div>
        <nav>
          <button className="nav-item active">
            <span>⌂</span>Visão operacional
          </button>
          <button className="nav-item">
            <span>◎</span>Fontes <b>3</b>
          </button>
          <button className="nav-item">
            <span>◇</span>Memória <b>5</b>
          </button>
          <button className="nav-item">
            <span>✓</span>Ações <b>1</b>
          </button>
        </nav>
        <div className="sidebar-project">
          <small>PROJETO ATIVO</small>
          <strong>
            <span className="live-dot" />
            Piloto Atlas
          </strong>
          <p>Sexta-feira · 3 empresas</p>
        </div>
        <button className="ask-button" onClick={() => setAskOpen(true)}>
          <span>✦</span>Pergunte à Relay
        </button>
        <div className="user-row">
          <span className="user-avatar">DD</span>
          <span>
            <strong>David Deodato</strong>
            <small>Administrador</small>
          </span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Lume / Projetos / <strong>Atlas</strong>
            </p>
            <h1>Visão operacional</h1>
          </div>
          <div className="topbar-actions">
            <span className="sync-status">
              <i />
              Sincronizado {syncedAt}
            </span>
            <button
              className="secondary-button"
              onClick={syncContext}
              disabled={syncing}
            >
              {syncing ? "Conectando…" : "Sincronizar contexto"}
            </button>
            <button
              className="primary-button"
              onClick={() => setHandoffOpen(true)}
            >
              Gerar handoff
            </button>
          </div>
        </header>
        <div className="content-grid">
          <section className="main-column">
            <article className="briefing-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">BRIEFING ATUAL</span>
                  <h2>O que importa agora</h2>
                </div>
                <span className="updated-pill">Atualizado {syncedAt}</span>
              </div>
              <p>
                O piloto continua previsto para sexta-feira com busca e
                respostas apoiadas por fontes. A importação por CSV saiu da
                primeira versão, mas o documento de escopo ainda não reflete a
                decisão.
              </p>
              <div className="briefing-bottom">
                <span className="conflict-badge">
                  <b>!</b>1 conflito precisa de revisão
                </span>
                <button
                  className="text-button"
                  onClick={() => setSelectedSource(sources[2])}
                >
                  Ver conflito <span>→</span>
                </button>
              </div>
            </article>
            <section className="sources-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">CONTEXTO CONECTADO</span>
                  <h2>3 fontes, um estado operacional</h2>
                </div>
                <button className="ghost-button">+ Adicionar fonte</button>
              </div>
              <div className="source-grid">
                {sources.map((source) => (
                  <button
                    key={source.id}
                    className={`source-card ${source.tone} ${selectedSource.id === source.id ? "selected" : ""}`}
                    onClick={() => setSelectedSource(source)}
                  >
                    <div className="source-card-top">
                      <span className="source-icon">
                        {source.kind === "Slack"
                          ? "#"
                          : source.kind === "GitHub"
                            ? "⌘"
                            : "▤"}
                      </span>
                      <span className="source-kind">{source.kind}</span>
                      <span className="source-ok">✓</span>
                    </div>
                    <strong>{source.title}</strong>
                    <small>{source.meta}</small>
                    <p>{source.excerpt}</p>
                    <span className="source-id">{source.id}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="memory-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">MEMÓRIA OPERACIONAL</span>
                  <h2>O que a empresa sabe</h2>
                </div>
                <span className="filter-label">Últimas 24h ⌄</span>
              </div>
              <div className="memory-list">
                {memories.map((memory, index) => (
                  <button
                    key={memory.type}
                    className="memory-row"
                    onClick={() =>
                      setSelectedSource(
                        sources[index === 1 ? 2 : index === 2 ? 1 : 0],
                      )
                    }
                  >
                    <span
                      className={`memory-dot status-${memory.status.toLowerCase()}`}
                    />
                    <span className="memory-copy">
                      <small>{memory.type}</small>
                      <strong>{memory.text}</strong>
                    </span>
                    <span className="memory-meta">
                      <b>{memory.status}</b>
                      <small>{memory.source}</small>
                    </span>
                    <span className="chevron">›</span>
                  </button>
                ))}
              </div>
            </section>
          </section>
          <aside className="inspector" aria-label="Inspetor de contexto">
            <section className="inspector-card source-inspector">
              <div className="inspector-title">
                <div>
                  <span className="eyebrow">FONTE SELECIONADA</span>
                  <h3>{selectedSource.kind}</h3>
                </div>
                <span className={`source-icon ${selectedSource.tone}`}>
                  {selectedSource.kind === "Slack"
                    ? "#"
                    : selectedSource.kind === "GitHub"
                      ? "⌘"
                      : "▤"}
                </span>
              </div>
              <strong>{selectedSource.title}</strong>
              <small>{selectedSource.meta}</small>
              <blockquote>“{selectedSource.excerpt}”</blockquote>
              <div className="source-footer">
                <span>{selectedSource.id}</span>
                <button>Abrir origem ↗</button>
              </div>
            </section>
            <section className={`inspector-card action-card ${actionState}`}>
              <div className="action-label">
                <span>PRÓXIMO PASSO</span>
                <b>
                  {actionState === "aprovada" ? "✓ Aprovada" : "Revisão humana"}
                </b>
              </div>
              <h3>Atualizar o escopo do piloto</h3>
              <p>
                Remover CSV dos critérios de aceite e comunicar a mudança no
                canal do projeto.
              </p>
              <div className="evidence-row">
                <span className="evidence-stack">
                  <i>1</i>
                  <i>3</i>
                </span>
                <span>
                  <small>Evidências</small>
                  <strong>SRC-01 + SRC-03</strong>
                </span>
              </div>
              {actionState === "proposta" ? (
                <button className="approve-button" onClick={approveAction}>
                  Aprovar e registrar
                </button>
              ) : (
                <button
                  className="approved-button"
                  onClick={() => setHandoffOpen(true)}
                >
                  Ver no handoff <span>→</span>
                </button>
              )}
              <small className="action-note">
                Nada é executado sem aprovação humana.
              </small>
            </section>
            <div className="status-strip">
              <span className="live-dot" />
              <span>
                <small>Estado do projeto</small>
                <strong>{statusLabel}</strong>
              </span>
            </div>
          </aside>
        </div>
      </section>

      {handoffOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setHandoffOpen(false)}
        >
          <section
            className="handoff-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="handoff-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              aria-label="Fechar"
              onClick={() => setHandoffOpen(false)}
            >
              ×
            </button>
            <span className="eyebrow">HANDOFF GERADO</span>
            <h2 id="handoff-title">Entre no Atlas sem começar do zero.</h2>
            <p className="handoff-lead">
              Resumo verificável para quem assumir o projeto agora.
            </p>
            <div className="handoff-list">
              <div>
                <small>OBJETIVO</small>
                <p>
                  Realizar o piloto de sexta com busca e respostas apoiadas por
                  fontes.
                </p>
              </div>
              <div>
                <small>DECISÃO VIGENTE</small>
                <p>CSV não faz parte desta primeira versão.</p>
              </div>
              <div>
                <small>RISCO</small>
                <p>Confirmar em smoke que reenvios não duplicam eventos.</p>
              </div>
              <div>
                <small>PENDÊNCIA</small>
                <p>Obter o schema da terceira empresa parceira.</p>
              </div>
              <div>
                <small>PRÓXIMO PASSO</small>
                <p>Atualizar o documento e comunicar a mudança.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  navigator.clipboard?.writeText(
                    "Handoff Atlas: CSV fora do piloto; atualizar escopo; validar idempotência; obter schema pendente.",
                  )
                }
              >
                Copiar resumo
              </button>
              <button
                className="primary-button"
                onClick={() => setHandoffOpen(false)}
              >
                Concluir
              </button>
            </div>
          </section>
        </div>
      )}
      {askOpen && (
        <div
          className="ask-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Pergunte à Relay"
        >
          <div className="ask-header">
            <div>
              <span className="ask-spark">✦</span>
              <span>
                <strong>Pergunte à Relay</strong>
                <small>Respostas com fonte</small>
              </span>
            </div>
            <button aria-label="Fechar" onClick={() => setAskOpen(false)}>
              ×
            </button>
          </div>
          <div className="ask-body">
            <div className="question">{lastQuestion}</div>
            <div className="answer">
              <p>
                {askLoading ? "Consultando a memória operacional…" : askAnswer}
              </p>
              <button
                onClick={() => {
                  setSelectedSource(sources[0]);
                  setAskOpen(false);
                }}
              >
                <b>SRC-01</b> · #projeto-atlas
              </button>
              <button
                onClick={() => {
                  setSelectedSource(sources[2]);
                  setAskOpen(false);
                }}
              >
                <b>SRC-03</b> · Escopo v3
              </button>
            </div>
          </div>
          <div className="ask-input">
            <input
              aria-label="Faça uma pergunta"
              placeholder="Pergunte sobre o projeto…"
              value={askDraft}
              onChange={(event) => setAskDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void askRelay();
              }}
            />
            <button
              aria-label="Enviar"
              onClick={() => void askRelay()}
              disabled={askLoading}
            >
              {askLoading ? "…" : "↑"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
