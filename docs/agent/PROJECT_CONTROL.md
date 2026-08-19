# Project Control

## Estado

`BRANDING V1 FECHADO — PRONTO PARA IMPLEMENTAÇÃO` — 2026-08-19.

## Missão

Entregar até 16h uma aplicação pública e demonstrável que centraliza contexto desestruturado de múltiplas fontes da empresa e o transforma em memória operacional, clareza e ações rastreáveis.

## Usuários

- Primário: fundador ou líder que precisa entender o estado real da empresa e agir.
- Secundário: colaborador que precisa consultar, contribuir ou transferir contexto.
- Operador da demo: um integrante da equipe usando um workspace previamente preparado.

## KPIs do ciclo

| KPI | Alvo | Como medir | Estado |
|---|---:|---|---|
| Fluxo funcional | três fontes até briefing, ação e handoff | browser smoke em produção | pendente |
| Tempo do fluxo | até 2 minutos | cronômetro em teste manual | pendente |
| Proveniência | 100% das respostas de contexto com referência | cenário de demo | pendente |
| Cobertura | ao menos três tipos de fonte centralizados | cenário de demo | pendente |
| Acionabilidade | ao menos uma ação proposta e aprovada | cenário de demo | pendente |
| Vídeo | cerca de 60 segundos, link público | abertura anônima do link | pendente |
| Submissão | repo, vídeo e membros válidos antes de 16h | formulário final | pendente |

## Escopo

| Must | Should | Later | Out |
|---|---|---|---|
| três fontes | protocolo de chat copiável | mais conectores | recrutamento por IA |
| extração estruturada | conflito simples | permissões avançadas | dashboard como núcleo |
| memória operacional | filtros | agentes executores | ingestão automática de chats privados |
| briefing do estado | exportação Markdown | analytics | billing/white-label |
| resposta citada | Slack nativo | | ações externas automáticas |
| ação aprovável | | | |
| onboarding | | | |

## Produto e design

- Arquétipo: AI operations workbench com fontes, memória, artefatos e ações, não dashboard analítico.
- Nome: Relay, definido pelo usuário em 2026-08-19.
- Direção visual: sistema v1 documentado em `docs/BRAND_BOOK.md` e ativos em `public/brand/`.
- Mascote 3D modular gerado em 2026-08-19: rejeitado e proibido como referência estética positiva.
- Mascote final: Laço Vivo 2D; três entradas, laço aberto e uma saída; uso mínimo de 96 px.
- Prioridade: desktop para demo, responsividade móvel sem quebra crítica.

## Integrações e ambiente

| Capacidade | Escolha | Estado |
|---|---|---|
| Frontend/backend | Next.js | assumido |
| IA | OpenAI Responses API com saída estruturada | pendente de variável |
| Banco | Neon Postgres | pendente de variável |
| Deploy | Vercel | integração informada pelo usuário, não verificada |
| Auth | fora do caminho crítico; workspace de demo | decisão recomendada |
| Fonte real | GitHub público/API | decisão recomendada |
| Outras fontes | importação estruturada/manual | decisão recomendada |

Não registrar valores de segredo em documentação ou Git.

## Stop gates

- Não avançar OAuth, filtros ou polish enquanto o caminho fontes → memória → briefing → ação → handoff não passar.
- Não declarar pronto sem build, smoke em browser, console limpo no fluxo e URL pública aberta.
- Se a OpenAI falhar durante a demo, permitir cápsula de exemplo já processada, claramente identificada; isso é contingência, não substitui o teste real.
- Reservar no mínimo 15 minutos para submissão.

## Restrições do hackathon

- Repositório novo e público.
- Vídeo e demo devem destacar apenas o que foi desenvolvido no evento.
- Código histórico não será copiado nem apresentado como novo.
- Sem triagem de candidatos, RAG básico, Streamlit ou dashboard como função principal.

## Evidência esperada

- logs de build/test;
- screenshots desktop e mobile;
- registro do smoke end-to-end;
- URL Vercel;
- URL GitHub público;
- URL do vídeo aberta sem autenticação;
- diff/commits do período do evento.
