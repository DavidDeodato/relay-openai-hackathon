/* eslint-disable @next/next/no-img-element, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

type View = "overview" | "sources" | "memory" | "actions" | "integrations";
type Source = {
  id: string;
  kind: string;
  name: string;
  content: string;
  synthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
type Memory = {
  id: string;
  type: string;
  text: string;
  sourceId: string;
  status: string;
  createdAt?: string;
};
type Message = {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sourceIds?: string[];
};
type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
};

const seedSources: Source[] = [
  {
    id: "SRC-01",
    kind: "slack",
    name: "#projeto-atlas",
    content:
      "Vamos liberar busca e respostas com fonte. A importação por CSV fica fora desta primeira versão.",
    synthetic: true,
  },
  {
    id: "SRC-02",
    kind: "github",
    name: "relay-openai-hackathon · 4915e23",
    content:
      "feat: connect secondary chat to OpenAI. Idempotência impede o processamento duplicado de eventos; falta o smoke ponta a ponta.",
    synthetic: false,
  },
  {
    id: "SRC-03",
    kind: "document",
    name: "Escopo do piloto Atlas — v3",
    content:
      "O piloto será considerado pronto quando permitir busca, respostas e importação em lote por CSV.",
    synthetic: true,
  },
];
const seedMemories: Memory[] = [
  {
    id: "MEM-01",
    type: "decision",
    text: "O piloto será lançado sem importação em lote por CSV.",
    sourceId: "SRC-01",
    status: "confirmed",
  },
  {
    id: "MEM-02",
    type: "risk",
    text: "O documento vigente ainda exige CSV como critério de aceite.",
    sourceId: "SRC-01 + SRC-03",
    status: "conflict",
  },
  {
    id: "MEM-03",
    type: "change",
    text: "Reenvios usam idempotência; falta o smoke ponta a ponta.",
    sourceId: "SRC-02",
    status: "confirmed",
  },
  {
    id: "MEM-04",
    type: "pending",
    text: "Falta o schema de uma empresa parceira.",
    sourceId: "SRC-01",
    status: "pending",
  },
];
const labels: Record<string, string> = {
  slack: "Slack",
  github: "GitHub",
  document: "Documento",
  protocol: "Protocolo",
  chat: "Chat",
  decision: "Decisão",
  risk: "Risco",
  change: "Mudança",
  pending: "Pendência",
  task: "Ação",
  confirmed: "Confirmado",
  conflict: "Conflito",
};

export default function RelayAppV2() {
  const [view, setView] = useState<View>("overview");
  const [sources, setSources] = useState<Source[]>(seedSources);
  const [memories, setMemories] = useState<Memory[]>(seedMemories);
  const [selected, setSelected] = useState<Source>(seedSources[0]);
  const [approved, setApproved] = useState(() =>
    typeof window === "undefined"
      ? false
      : localStorage.getItem("relay-action") === "approved",
  );
  const [handoff, setHandoff] = useState(false);
  const [ingestOpen, setIngestOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [syncLabel, setSyncLabel] = useState("há 2 min");
  const [kind, setKind] = useState("protocol");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [ingestStatus, setIngestStatus] = useState("");
  const [toast, setToast] = useState("");
  const title = {
    overview: "Visão operacional",
    sources: "Fontes",
    memory: "Memória operacional",
    actions: "Ações",
    integrations: "Integrações",
  }[view];
  const activeChat = chats.find((chat) => chat.id === chatId);

  useEffect(() => {
    void refreshContext();
    void refreshChats();
  }, []);
  useEffect(() => {
    if (chatId) void loadMessages(chatId);
  }, [chatId]);
  useEffect(() => {
    if (chats.length)
      localStorage.setItem("relay-chats-v2", JSON.stringify(chats));
  }, [chats]);
  useEffect(() => {
    if (chatId && messages.length)
      localStorage.setItem(
        `relay-messages-v2:${chatId}`,
        JSON.stringify(messages),
      );
  }, [chatId, messages]);
  async function refreshContext() {
    try {
      const data = await fetch("/api/context", { cache: "no-store" }).then(
        (r) => r.json(),
      );
      if (data.sources?.length) {
        setSources(data.sources);
        setSelected(data.sources[0]);
      }
      if (data.memories?.length) setMemories(data.memories);
    } catch {
      /* seed is visible contingency */
    }
  }
  async function refreshChats() {
    const data = await fetch("/api/chats", { cache: "no-store" }).then((r) =>
      r.json(),
    );
    const cached = JSON.parse(
      localStorage.getItem("relay-chats-v2") || "[]",
    ) as Chat[];
    const next = data.chats?.length ? data.chats : cached;
    setChats(next);
    if (next.length) setChatId((id) => id || next[0].id);
  }
  async function loadMessages(id: string) {
    const data = await fetch(`/api/chats/${id}/messages`, {
      cache: "no-store",
    }).then((r) => r.json());
    const cached = JSON.parse(
      localStorage.getItem(`relay-messages-v2:${id}`) || "[]",
    ) as Message[];
    setMessages(data.messages?.length ? data.messages : cached);
  }
  async function newChat() {
    const data = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Nova conversa" }),
    }).then((r) => r.json());
    setChats((current) => [data.chat, ...current]);
    setChatId(data.chat.id);
    setMessages([]);
    setChatOpen(true);
  }
  async function send() {
    if (!draft.trim() || busy) return;
    let id = chatId;
    if (!id) {
      const created = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }).then((r) => r.json());
      id = created.chat.id;
      setChatId(id);
    }
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      chatId: id,
      role: "user",
      content: draft.trim(),
      createdAt: new Date().toISOString(),
    };
    const question = draft.trim();
    setDraft("");
    setMessages((current) => [...current, optimistic]);
    setBusy(true);
    try {
      const data = await fetch(`/api/chats/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: question }),
      }).then((r) => r.json());
      setMessages((current) =>
        [
          ...current.filter((m) => m.id !== optimistic.id),
          data.userMessage,
          data.assistantMessage,
        ].filter(Boolean),
      );
      await refreshChats();
    } finally {
      setBusy(false);
    }
  }
  async function ingest() {
    if (!content.trim()) {
      setIngestStatus("Cole um contexto ou selecione um arquivo.");
      return;
    }
    setBusy(true);
    setIngestStatus("Assimilando e extraindo memória…");
    try {
      const data = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: name || "Contexto recebido",
          content,
          synthetic: kind !== "github",
        }),
      }).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      });
      setSources((current) => [data.source, ...current]);
      setMemories((current) => [...data.memories, ...current]);
      setSelected(data.source);
      setSyncLabel("agora");
      setIngestStatus(
        `${data.memories.length} memórias extraídas · ${data.assimilationMode === "live" ? "OpenAI live" : "extração local"}`,
      );
      setToast("Contexto assimilado com proveniência");
    } catch {
      setIngestStatus("Falha: nada foi promovido à memória.");
    } finally {
      setBusy(false);
    }
  }
  async function sync() {
    setBusy(true);
    try {
      const latest = await fetch(
        "https://api.github.com/repos/DavidDeodato/relay-openai-hackathon/commits?per_page=1",
      ).then((response) => response.json());
      const commit = latest[0] as {
        sha: string;
        html_url: string;
        commit: { message: string; author: { date: string } };
      };
      const inputs = [
        {
          kind: "github",
          name: `DavidDeodato/relay-openai-hackathon · ${commit.sha.slice(0, 7)}`,
          synthetic: false,
          content: `Commit público real em ${commit.commit.author.date}: ${commit.commit.message}. Origem: ${commit.html_url}`,
        },
        {
          kind: "slack",
          name: "#projeto-atlas · lote de demonstração",
          synthetic: true,
          content:
            "Evento sintético recebido do Slack: o piloto segue na sexta; CSV está fora e o schema do parceiro segue pendente.",
        },
      ];
      const assimilated = await Promise.all(
        inputs.map((input) =>
          fetch("/api/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }).then((response) => response.json()),
        ),
      );
      setSources((current) => [
        ...assimilated.map((item) => item.source),
        ...current,
      ]);
      setMemories((current) => [
        ...assimilated.flatMap((item) => item.memories || []),
        ...current,
      ]);
      setSelected(assimilated[0].source);
      setSyncLabel("agora");
      setToast("GitHub público + Slack demo assimilados");
    } catch {
      setToast("Sincronização falhou; nenhuma fonte foi promovida");
    } finally {
      setBusy(false);
    }
  }
  function approve() {
    setApproved(true);
    localStorage.setItem("relay-action", "approved");
    setToast("Ação registrada no handoff");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <img src="/brand/relay-icon.svg" alt="" />
          <span>relay</span>
        </div>
        <div className="workspace-switch">
          <span className="workspace-avatar">L</span>
          <span>
            <strong>Lume</strong>
            <small>Workspace de demonstração</small>
          </span>
        </div>
        <nav>
          {(
            [
              ["overview", "⌂", "Visão operacional", ""],
              ["sources", "◎", "Fontes", sources.length],
              ["memory", "◇", "Memória", memories.length],
              ["actions", "✓", "Ações", 1],
              ["integrations", "⇄", "Integrações", 4],
            ] as const
          ).map(([id, icon, label, count]) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() => setView(id)}
            >
              <span>{icon}</span>
              {label}
              {count !== "" && <b>{count}</b>}
            </button>
          ))}
        </nav>
        <div className="mascot-guide">
          <img
            src="/brand/relay-mascot-ui-256.png"
            alt="Laço Vivo conectando o contexto"
          />
          <div>
            <strong>Contexto conectado</strong>
            <small>
              {sources.length} fontes · {memories.length} memórias
            </small>
          </div>
        </div>
        <button className="ask-button" onClick={() => setChatOpen(true)}>
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
              Lume / Atlas / <strong>{title}</strong>
            </p>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions">
            <span className="sync-status">
              <i />
              Sincronizado {syncLabel}
            </span>
            <button className="secondary-button" disabled={busy} onClick={sync}>
              {busy ? "Processando…" : "Sincronizar contexto"}
            </button>
            <button className="primary-button" onClick={() => setHandoff(true)}>
              Gerar handoff
            </button>
          </div>
        </header>
        {view === "overview" && (
          <Overview
            sources={sources}
            memories={memories}
            selected={selected}
            choose={setSelected}
            add={() => setIngestOpen(true)}
            approved={approved}
            approve={approve}
            handoff={() => setHandoff(true)}
            syncLabel={syncLabel}
          />
        )}
        {view === "sources" && (
          <Sources
            sources={sources}
            selected={selected}
            choose={setSelected}
            add={() => setIngestOpen(true)}
          />
        )}
        {view === "memory" && (
          <MemoryView
            memories={memories}
            sources={sources}
            choose={(source) => {
              setSelected(source);
              setView("sources");
            }}
          />
        )}
        {view === "actions" && (
          <Actions
            approved={approved}
            approve={approve}
            handoff={() => setHandoff(true)}
          />
        )}
        {view === "integrations" && (
          <Integrations
            busy={busy}
            sync={sync}
            protocol={() => {
              setKind("protocol");
              setIngestOpen(true);
            }}
          />
        )}
      </section>
      {ingestOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setIngestOpen(false)}
        >
          <section
            className="context-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Adicionar contexto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              aria-label="Fechar"
              onClick={() => setIngestOpen(false)}
            >
              ×
            </button>
            <div className="modal-mascot">
              <img
                src="/brand/relay-mascot-ui-256.png"
                alt="Laço Vivo assimilando contexto"
              />
              <div>
                <span className="eyebrow">ENTRADA DE CONTEXTO</span>
                <h2>Assimilar um novo contexto</h2>
                <p>
                  A origem é preservada antes da extração de decisões, riscos e
                  pendências.
                </p>
              </div>
            </div>
            <label>
              Origem
              <select value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="protocol">Protocolo Relay</option>
                <option value="document">Documento</option>
                <option value="slack">Slack</option>
                <option value="github">GitHub</option>
                <option value="chat">Chat externo</option>
              </select>
            </label>
            <label>
              Título
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: conversa com liderança"
              />
            </label>
            <label>
              Conteúdo
              <textarea
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Cole uma conversa, protocolo ou texto…"
              />
            </label>
            <label className="file-input">
              Subir documento (.txt, .md, .json)
              <input
                type="file"
                accept=".txt,.md,.json,text/plain,text/markdown,application/json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setName(file.name);
                    setKind("document");
                    setContent(await file.text());
                  }
                }}
              />
            </label>
            {ingestStatus && (
              <div className="process-status">{ingestStatus}</div>
            )}
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setIngestOpen(false)}
              >
                Fechar
              </button>
              <button
                className="primary-button"
                disabled={busy}
                onClick={ingest}
              >
                {busy ? "Assimilando…" : "Assimilar contexto"}
              </button>
            </div>
          </section>
        </div>
      )}
      {handoff && (
        <Handoff
          approved={approved}
          close={() => setHandoff(false)}
          copied={() => setToast("Handoff copiado")}
        />
      )}
      {chatOpen && (
        <Chat
          chats={chats}
          chatId={chatId}
          setChatId={setChatId}
          active={activeChat}
          messages={messages}
          close={() => setChatOpen(false)}
          newChat={newChat}
          draft={draft}
          setDraft={setDraft}
          send={send}
          busy={busy}
        />
      )}
      {toast && (
        <button className="toast" onClick={() => setToast("")}>
          {toast} <b>×</b>
        </button>
      )}
    </main>
  );
}

function Overview({
  sources,
  memories,
  selected,
  choose,
  add,
  approved,
  approve,
  handoff,
  syncLabel,
}: {
  sources: Source[];
  memories: Memory[];
  selected: Source;
  choose: (s: Source) => void;
  add: () => void;
  approved: boolean;
  approve: () => void;
  handoff: () => void;
  syncLabel: string;
}) {
  return (
    <div className="content-grid">
      <section className="main-column">
        <article className="briefing-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BRIEFING ATUAL</span>
              <h2>O que importa agora</h2>
            </div>
            <span className="updated-pill">Atualizado {syncLabel}</span>
          </div>
          <p>
            O piloto segue previsto para sexta com respostas apoiadas por
            fontes. CSV saiu da versão, mas o documento de escopo ainda
            contradiz a decisão.
          </p>
          <div className="briefing-bottom">
            <span className="conflict-badge">
              <b>!</b>1 conflito precisa de revisão
            </span>
            <button
              className="text-button"
              onClick={() =>
                choose(sources.find((s) => s.id === "SRC-03") || sources[0])
              }
            >
              Comparar evidências →
            </button>
          </div>
        </article>
        <section className="sources-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CONTEXTO CONECTADO</span>
              <h2>{sources.length} fontes, um estado operacional</h2>
            </div>
            <button className="ghost-button" onClick={add}>
              + Adicionar contexto
            </button>
          </div>
          <div className="source-grid">
            {sources.slice(0, 3).map((s) => (
              <SourceCard
                key={s.id}
                source={s}
                active={selected.id === s.id}
                click={() => choose(s)}
              />
            ))}
          </div>
        </section>
        <section className="memory-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MEMÓRIA OPERACIONAL</span>
              <h2>O que a empresa sabe</h2>
            </div>
            <span className="filter-label">Ordenado por captura</span>
          </div>
          <div className="memory-list">
            {memories.slice(0, 6).map((m) => (
              <div className="memory-row" key={m.id}>
                <span className={`memory-dot state-${m.status}`} />
                <span className="memory-copy">
                  <small>{labels[m.type] || m.type}</small>
                  <strong>{m.text}</strong>
                </span>
                <span className="memory-meta">
                  <b>{labels[m.status] || m.status}</b>
                  <small>{m.sourceId}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
      </section>
      <aside className="inspector">
        <section className="inspector-card source-inspector">
          <div className="inspector-title">
            <div>
              <span className="eyebrow">REGISTRO ORIGINAL</span>
              <h3>{labels[selected.kind] || selected.kind}</h3>
            </div>
            <span className="source-icon">
              {selected.kind === "slack"
                ? "#"
                : selected.kind === "github"
                  ? "⌘"
                  : "▤"}
            </span>
          </div>
          <strong>{selected.name}</strong>
          <small>
            {selected.synthetic
              ? "Dado sintético recebido"
              : "Fonte pública real"}
          </small>
          <blockquote>“{selected.content}”</blockquote>
          <div className="source-footer">
            <code>{selected.id}</code>
            <b>Origem preservada</b>
          </div>
        </section>
        <section
          className={`inspector-card action-card ${approved ? "aprovada" : ""}`}
        >
          <div className="action-label">
            <span>PRÓXIMO PASSO</span>
            <b>{approved ? "✓ Aprovada" : "Revisão humana"}</b>
          </div>
          <h3>Atualizar o escopo do piloto</h3>
          <p>
            Remover CSV dos critérios de aceite e comunicar a mudança no canal
            do projeto.
          </p>
          <div className="evidence-row">
            <strong>SRC-01 + SRC-03</strong>
          </div>
          <button
            className={approved ? "approved-button" : "approve-button"}
            onClick={approved ? handoff : approve}
          >
            {approved ? "Ver no handoff →" : "Aprovar e registrar"}
          </button>
          <small className="action-note">
            A decisão gera um evento auditável.
          </small>
        </section>
      </aside>
    </div>
  );
}
function SourceCard({
  source,
  active,
  click,
}: {
  source: Source;
  active: boolean;
  click: () => void;
}) {
  return (
    <button
      className={`source-card ${active ? "selected" : ""}`}
      onClick={click}
    >
      <div className="source-card-top">
        <span className="source-icon">
          {source.kind === "slack" ? "#" : source.kind === "github" ? "⌘" : "▤"}
        </span>
        <span className="source-kind">
          {labels[source.kind] || source.kind}
        </span>
        <span className="source-ok">✓</span>
      </div>
      <strong>{source.name}</strong>
      <small>
        {source.synthetic
          ? "Sintético · entrada do conector"
          : "Público · fonte real"}
      </small>
      <p>{source.content}</p>
      <code>{source.id}</code>
    </button>
  );
}
function Sources({
  sources,
  selected,
  choose,
  add,
}: {
  sources: Source[];
  selected: Source;
  choose: (s: Source) => void;
  add: () => void;
}) {
  return (
    <div className="page-surface sources-page">
      <div className="page-intro">
        <div>
          <span className="eyebrow">PROVENIÊNCIA</span>
          <h2>Fontes recebidas</h2>
          <p>
            Os conectores entregam dados; a Relay processa, relaciona e preserva
            o registro original.
          </p>
        </div>
        <button className="primary-button" onClick={add}>
          Adicionar contexto
        </button>
      </div>
      <div className="source-kpis">
        <div>
          <strong>{sources.length}</strong>
          <span>fontes assimiladas</span>
        </div>
        <div>
          <strong>
            {sources.filter((source) => !source.synthetic).length}
          </strong>
          <span>fontes públicas reais</span>
        </div>
        <div>
          <strong>{sources.filter((source) => source.synthetic).length}</strong>
          <span>entradas sintéticas</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>com Trace ID</span>
        </div>
      </div>
      <div className="split-view">
        <div className="data-table">
          <div className="table-head">
            <span>Fonte</span>
            <span>Origem</span>
            <span>Tipo</span>
            <span>Trace ID</span>
          </div>
          {sources.map((s) => (
            <button
              className={selected.id === s.id ? "selected" : ""}
              key={s.id}
              onClick={() => choose(s)}
            >
              <span>
                <b>{labels[s.kind] || s.kind}</b>
                <small>
                  {s.synthetic ? "Dados sintéticos" : "Fonte pública"}
                </small>
              </span>
              <span>{s.name}</span>
              <span className="state state-confirmed">Assimilada</span>
              <code>{s.id}</code>
            </button>
          ))}
        </div>
        <aside className="detail-pane">
          <span className="eyebrow">REGISTRO ORIGINAL</span>
          <h3>{selected.name}</h3>
          <p>{selected.content}</p>
          <dl>
            <dt>Origem</dt>
            <dd>{labels[selected.kind] || selected.kind}</dd>
            <dt>Natureza</dt>
            <dd>
              {selected.synthetic
                ? "Sintética para demonstração"
                : "Pública real"}
            </dd>
            <dt>Transformação</dt>
            <dd>Extração operacional com OpenAI</dd>
            <dt>Trace ID</dt>
            <dd>{selected.id}</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}
function MemoryView({
  memories,
  sources,
  choose,
}: {
  memories: Memory[];
  sources: Source[];
  choose: (s: Source) => void;
}) {
  return (
    <div className="page-surface">
      <div className="page-intro">
        <div>
          <span className="eyebrow">MEMÓRIA VIVA</span>
          <h2>Conhecimento consolidado</h2>
          <p>Informações derivadas com estado, fonte e horário de captura.</p>
        </div>
      </div>
      <div className="memory-board">
        {memories.map((m) => (
          <article key={m.id}>
            <div>
              <span className="eyebrow">{labels[m.type] || m.type}</span>
              <span className={`state state-${m.status}`}>
                {labels[m.status] || m.status}
              </span>
            </div>
            <h3>{m.text}</h3>
            <footer>
              <code>{m.id}</code>
              <button
                onClick={() => {
                  const s = sources.find((x) => m.sourceId.includes(x.id));
                  if (s) choose(s);
                }}
              >
                Abrir {m.sourceId} →
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
function Actions({
  approved,
  approve,
  handoff,
}: {
  approved: boolean;
  approve: () => void;
  handoff: () => void;
}) {
  return (
    <div className="page-surface">
      <div className="page-intro">
        <div>
          <span className="eyebrow">FILA DE DECISÃO</span>
          <h2>Ações acionáveis</h2>
          <p>Uma recomendação, uma consequência e evidência explícita.</p>
        </div>
      </div>
      <div className="action-table">
        <div>
          <span className={`state state-${approved ? "confirmed" : "pending"}`}>
            {approved ? "Aprovada" : "Aguardando revisão"}
          </span>
          <h3>Atualizar o escopo do piloto Atlas</h3>
          <p>
            Alinhar o documento vigente à decisão mais recente da liderança.
          </p>
          <dl>
            <dt>Destino</dt>
            <dd>Documento de escopo v3</dd>
            <dt>Responsável</dt>
            <dd>Liderança de produto</dd>
            <dt>Evidências</dt>
            <dd>SRC-01 + SRC-03</dd>
            <dt>Reversível</dt>
            <dd>Sim, por nova versão</dd>
          </dl>
          <button
            className="primary-button"
            onClick={approved ? handoff : approve}
          >
            {approved ? "Abrir handoff" : "Aprovar e registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
function Integrations({
  busy,
  sync,
  protocol,
}: {
  busy: boolean;
  sync: () => void;
  protocol: () => void;
}) {
  const items = [
    ["#", "Slack", "Mensagens e threads", "Demo · dados sintéticos"],
    ["⌘", "GitHub", "Commits, PRs e issues", "Público · repo real"],
    ["▤", "Documentos", "Arquivos e versões", "Upload manual"],
    ["↗", "Protocolo Relay", "Chats externos", "Entrada portátil"],
  ];
  return (
    <div className="page-surface">
      <div className="page-intro">
        <div>
          <span className="eyebrow">ENTRADAS DE CONTEXTO</span>
          <h2>Integrações</h2>
          <p>
            GitHub consulta o repositório público em tempo real. Slack entrega
            eventos sintéticos realistas. Toda assimilação posterior é executada
            pela Relay.
          </p>
        </div>
        <button className="primary-button" disabled={busy} onClick={sync}>
          {busy ? "Assimilando…" : "Sincronizar agora"}
        </button>
      </div>
      <div className="integration-grid">
        {items.map(([icon, name, desc, state]) => (
          <article key={name}>
            <span className="integration-icon">{icon}</span>
            <div>
              <h3>{name}</h3>
              <p>{desc}</p>
              <small>{state}</small>
            </div>
            <span className="state state-confirmed">Disponível</span>
            {name === "Protocolo Relay" && (
              <button onClick={protocol}>Enviar contexto →</button>
            )}
          </article>
        ))}
      </div>
      <div className="pipeline-strip">
        <b>Pipeline real</b>
        <span>Evento recebido</span>
        <i>→</i>
        <span>Origem preservada</span>
        <i>→</i>
        <span>Memória extraída</span>
        <i>→</i>
        <span>Conflito detectado</span>
        <i>→</i>
        <span>Ação revisável</span>
      </div>
    </div>
  );
}
function Handoff({
  approved,
  close,
  copied,
}: {
  approved: boolean;
  close: () => void;
  copied: () => void;
}) {
  const text = `Handoff Atlas\nDecisão: CSV fora da versão.\nRisco: escopo v3 desatualizado.\nPendência: schema do parceiro.\nAção: ${approved ? "aprovada" : "pendente"}.`;
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <section
        className="handoff-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Handoff Atlas"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="close-button" aria-label="Fechar" onClick={close}>
          ×
        </button>
        <span className="eyebrow">HANDOFF GERADO</span>
        <h2>Entre no Atlas sem começar do zero.</h2>
        <div className="handoff-list">
          <div>
            <small>OBJETIVO</small>
            <p>Piloto com respostas apoiadas por fontes.</p>
          </div>
          <div>
            <small>DECISÃO</small>
            <p>CSV não faz parte desta versão.</p>
          </div>
          <div>
            <small>RISCO</small>
            <p>Documento vigente contradiz a decisão.</p>
          </div>
          <div>
            <small>PENDÊNCIA</small>
            <p>Obter o schema da terceira empresa.</p>
          </div>
          <div>
            <small>PRÓXIMO PASSO</small>
            <p>Atualizar o escopo e comunicar a equipe.</p>
          </div>
        </div>
        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={() => {
              void navigator.clipboard.writeText(text);
              copied();
            }}
          >
            Copiar resumo
          </button>
          <button className="primary-button" onClick={close}>
            Concluir
          </button>
        </div>
      </section>
    </div>
  );
}
function Chat({
  chats,
  chatId,
  setChatId,
  active,
  messages,
  close,
  newChat,
  draft,
  setDraft,
  send,
  busy,
}: {
  chats: Chat[];
  chatId: string;
  setChatId: (s: string) => void;
  active?: Chat;
  messages: Message[];
  close: () => void;
  newChat: () => void;
  draft: string;
  setDraft: (s: string) => void;
  send: () => void;
  busy: boolean;
}) {
  return (
    <div
      className="chat-shell"
      role="dialog"
      aria-modal="true"
      aria-label="Relay AI"
    >
      <aside className="chat-history">
        <div>
          <strong>Conversas</strong>
          <button onClick={newChat}>＋ Nova</button>
        </div>
        {chats.map((c) => (
          <button
            className={c.id === chatId ? "active" : ""}
            key={c.id}
            onClick={() => setChatId(c.id)}
          >
            <span>{c.title}</span>
            <small>{c.messageCount || 0} mensagens</small>
          </button>
        ))}
      </aside>
      <section className="chat-main">
        <header>
          <div>
            <img src="/brand/relay-mascot-avatar-192.png" alt="Laço Vivo" />
            <span>
              <strong>{active?.title || "Nova conversa"}</strong>
              <small>Relay · analista do contexto conectado</small>
            </span>
          </div>
          <button aria-label="Fechar" onClick={close}>
            ×
          </button>
        </header>
        <div className="messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <img
                src="/brand/relay-mascot-ui-256.png"
                alt="Laço Vivo aguardando uma pergunta"
              />
              <h3>O contexto está pronto.</h3>
              <p>Pergunte sobre decisões, riscos, fontes ou próximos passos.</p>
            </div>
          )}
          {messages.map((m) => (
            <article className={m.role} key={m.id}>
              <small>
                {m.role === "user" ? "Você" : "Relay"} ·{" "}
                {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
              <p>{m.content}</p>
              {m.sourceIds?.length ? (
                <div>
                  {m.sourceIds.map((id) => (
                    <code key={id}>{id}</code>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
          {busy && (
            <article className="assistant loading-message">
              <small>Relay</small>
              <p>Consultando fontes e histórico…</p>
            </article>
          )}
        </div>
        <div className="suggestions">
          <button onClick={() => setDraft("Quais decisões mudaram hoje?")}>
            Decisões de hoje
          </button>
          <button
            onClick={() => setDraft("Quais conflitos bloqueiam o piloto?")}
          >
            Conflitos abertos
          </button>
        </div>
        <footer>
          <textarea
            aria-label="Mensagem para Relay"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Pergunte sobre o contexto conectado…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            aria-label="Enviar"
            disabled={busy || !draft.trim()}
            onClick={send}
          >
            ↑
          </button>
        </footer>
      </section>
    </div>
  );
}
