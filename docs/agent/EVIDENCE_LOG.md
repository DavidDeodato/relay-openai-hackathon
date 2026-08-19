# Evidence Log

## EVD-001 — Fonte do pedido

- Transcrição escrita fornecida pelo usuário.
- Áudio local de 244 segundos transcrito em português.
- Fato consolidado: pequenas equipes perdem contexto em canais e chats pessoais; o usuário propôs um protocolo portátil como ponto de integração.
- Correção material do usuário: a tese principal é a centralização útil do contexto desestruturado da empresa; chat é incremento de cobertura, não produto central.

## EVD-002 — Auditoria da referência histórica

- Repositórios: `DavidDeodato/peaqle`, `DavidDeodato/peeqle-app`, `DavidDeodato/peeqle-sync-test`.
- Clone local isolado: `C:\Users\lucas\Desktop\projetos\hackathon-peaqle-reference`.
- Capacidades observadas: Next.js, Prisma/Postgres, OpenAI, Cloudinary, auth, Slack/GitHub, base de conhecimento, agentes e recrutamento.
- Limitações observadas: busca lexical com fallback irrelevante possível, tokens chamados de encrypted sem criptografia visível, ingestão de mensagens sem revisão, muitas superfícies de UI e recrutamento incompatível com o guia.

## EVD-003 — Regras do evento

- Prazo informado: 16h.
- Repo público e vídeo de aproximadamente um minuto.
- Demo deve evidenciar somente trabalho do evento.
- Proibidos: RAG básico, Streamlit, triagem de candidatos e dashboard como função principal, entre outros itens listados no guia.

## EVD-004 — Evidência de mercado

- Microsoft Work Trend Index 2023: 57% do tempo no Microsoft 365 em comunicação.
- Atlassian State of Teams 2024: 55% relatam dificuldade para localizar informação; 50% encontraram duplicidade tardia de trabalho.
- Páginas oficiais de Notion AI e Slack confirmam oferta atual de busca corporativa conectada.

## Evidências de implementação

As evidências atuais estão registradas em EVD-008 e no `QA_BANK.md`. A aplicação só foi promovida após build, lint, smoke de browser, API live, console limpo e abertura da URL pública.

## EVD-005 — Falha visual registrada

- Arquivo rejeitado: `C:\Users\lucas\.codex\generated_images\01a01ae7-89e0-7210-8c99-376e26753fff\exec-eb459725-ae70-4d86-8fb2-559b4a129ccc.png`.
- Avaliação do usuário: sem identidade, estranho, pouco fofo e 3D incompatível com a plataforma.
- Estado: descartado; não usar como mascote, referência de estilo ou evidência de qualidade.
- Próximo gate: síntese de princípios de marca, personagem 2D e sistema visual antes de nova geração.

## EVD-006 — Banca adversarial de marca e design

- Três revisões independentes: estratégia de marca, personagem 2D e sistema visual de produto.
- Convergência: lastro visível, conexão sem vigilância, ação humana, personagem como guia de rastreabilidade e interface centrada em fonte → ação.
- Nome: TEVIA e Trama bloqueados; Entrela proposto e depois rejeitado pelo usuário.
- Paleta: contrastes calculados e registrados em `docs/BRAND_DIRECTION_GATE.md`.
- Estado: banca incorporada à direção final.

## EVD-007 — Branding Relay v1

- Nome Relay definido diretamente pelo usuário.
- Mascote final transparente: `public/brand/relay-mascot-transparent.png`.
- Versão chroma: `public/brand/relay-mascot-chroma.png`.
- Estados: `public/brand/relay-mascot-states.png`.
- Hero: `public/brand/relay-hero.png`.
- Logo, marca, ícone, versão mono e tokens: `public/brand/`.
- Sistema documentado: `docs/BRAND_BOOK.md`.
- Avaliação integrada: `brand/relay-brand-board.html`.
- Regra de escala: ilustração a partir de 96 px; símbolo/ícone abaixo disso.

## EVD-008 — Plataforma Relay publicada

- Produção: `https://relay-openai-hackathon.vercel.app`.
- Repositório público: `https://github.com/DavidDeodato/relay-openai-hackathon`.
- Fluxo validado: três fontes → briefing/memória → conflito → ação aprovada → handoff.
- OpenAI Responses API validada em produção com resposta `mode=live`.
- Chat secundário validado em produção: pergunta livre, estado de carregamento e resposta citada com `SRC-01`, `SRC-02` e `SRC-03`.
- Checks: build Next.js, TypeScript, lint, teste de contrato, HTTP 200, desktop e mobile.
- Nenhum arquivo de segredo rastreado; somente `.env.example` está no Git.
