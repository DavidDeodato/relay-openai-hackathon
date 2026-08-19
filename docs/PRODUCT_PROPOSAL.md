# Proposta de produto — mente operacional para pequenas empresas

## Decisão corrigida

Construir uma **mente coletiva operacional da empresa**: uma camada que reúne o contexto desestruturado espalhado entre canais, ferramentas e pessoas, organiza esse contexto e o transforma em decisões, estado atual, riscos, responsáveis e próximos passos acionáveis.

**Frase de uma linha:** toda a empresa passa a saber o que a empresa sabe — e o que precisa acontecer depois.

O protocolo de chats pessoais com IA é uma nova fonte de contexto. Ele amplia a cobertura da mente coletiva, mas não define o produto.

## Tese

Startups e pequenos negócios avançam mais rápido do que conseguem documentar. Um deploy aparece no GitHub, uma decisão no Slack, o racional numa conversa com IA, uma objeção no WhatsApp e o conhecimento crítico permanece na cabeça de alguém.

Ferramentas tradicionais guardam mensagens e arquivos. A proposta é manter uma **representação viva do estado da empresa**, ligando:

`fonte → fato → decisão → racional → projeto → pessoa → risco → ação`

A centralização só tem valor quando gera uma saída operacional: um briefing do estado atual, uma resposta com fonte, um alerta de conflito, uma lista de próximos passos ou um pacote de contexto para quem está entrando.

## Problema

- O conhecimento nasce em lugares diferentes e não chega inteiro ao sistema oficial.
- O resultado costuma ser registrado; o racional e as alternativas descartadas, não.
- Gestores precisam perguntar a várias pessoas para descobrir o estado real.
- Novos colaboradores recebem documentos genéricos, não o contexto vivo do trabalho.
- Pessoas passam a executar responsabilidades que não aparecem no cargo ou processo formal.
- Quando alguém sai, uma parte da memória operacional desaparece.

Há lastro para a dor geral:

- O Work Trend Index da Microsoft registrou que, dentro do Microsoft 365, o trabalhador médio gastava 57% do tempo em comunicação e 43% em criação. Fonte: [Microsoft Work Trend Index 2023](https://www.microsoft.com/en-us/worklab/work-trend-index/will-ai-fix-work/).
- No State of Teams 2024, a Atlassian reportou que 55% dos profissionais tinham dificuldade para localizar informação e 50% já haviam trabalhado em algo para depois descobrir que outra equipe fazia o mesmo. Fonte: [Atlassian State of Teams 2024](https://www.atlassian.com/blog/state-of-teams-2024).
- [Notion AI](https://www.notion.com/en-gb/product/enterprise-search) e [Slack Enterprise Search](https://slack.com/features/enterprise-search) confirmam que existe demanda por conhecimento conectado. A diferença proposta é focar pequenas empresas e transformar contexto em memória operacional acionável, inclusive quando a fonte não possui integração nativa.

Esses dados sustentam a fragmentação como problema; não comprovam ainda a demanda comercial específica pela solução.

## O produto

### 1. Fontes de contexto

- canais corporativos, começando por Slack;
- atividade de trabalho, começando por GitHub;
- documentos e notas;
- contribuições manuais;
- cápsulas opcionais de chats com IA ou mensageria.

Cada fonte mantém origem, data, autoria da contribuição e permissão.

### 2. Compilador de contexto

A IA converte entradas heterogêneas em itens tipados:

- avanço;
- decisão e racional;
- tarefa e responsável;
- risco ou bloqueio;
- processo;
- aprendizado;
- artefato;
- pergunta aberta.

Itens sem lastro permanecem como inferência ou pendência, nunca como fato confirmado.

### 3. Mapa operacional vivo

Os itens são conectados a projeto, pessoa, tema e período. A interface responde:

- o que mudou;
- o que está bloqueado;
- o que foi decidido e por quê;
- quem está envolvido;
- qual é o próximo movimento;
- qual fonte sustenta cada afirmação.

### 4. Saídas acionáveis

- **Briefing operacional:** estado atual da empresa ou de um projeto.
- **Central de ações:** próximos passos propostos, com responsável e fonte, sujeitos a aprovação humana.
- **Pergunte à empresa:** respostas com proveniência, não respostas genéricas.
- **Pacote de onboarding:** contexto real de um projeto, decisões, pessoas, riscos e primeiros passos.
- **Memória de função:** o que uma pessoa realmente executa, útil para handoff e redistribuição de trabalho, sem pontuar candidatos.

## Onde entra o chat

Boa parte do discovery e do raciocínio atual acontece em conversas pessoais com ChatGPT, Claude, Gemini, WhatsApp ou Discord. Nem toda fonte permite integração nativa e nem todo conteúdo deve ser enviado à empresa.

Por isso existe o **protocolo de cápsula**:

1. a pessoa escolhe uma conversa;
2. usa um prompt portátil para gerar uma cápsula estruturada;
3. revisa e remove o que não deseja compartilhar;
4. envia os itens aprovados para a mente operacional.

Isso é um conector universal, voluntário e controlado. É incremento de cobertura, não a tese central.

## Demonstração vencedora

### História

Uma pequena startup está preparando um lançamento. O contexto está dividido:

- GitHub mostra uma PR e um problema técnico;
- Slack contém uma decisão de adiar parte do lançamento;
- uma cápsula de chat contém o racional e uma alternativa discutida;
- uma nota manual registra feedback de cliente.

### Demo em aproximadamente um minuto

1. Mostrar as quatro fontes sendo centralizadas.
2. A mente operacional compila decisões, avanços, risco e tarefas.
3. Gerar “Estado do lançamento agora”.
4. Exibir um conflito ou bloqueio com as fontes que o sustentam.
5. Aprovar um próximo passo proposto.
6. Gerar um pacote de contexto para uma pessoa que acabou de entrar no projeto.

A banca deve enxergar: múltiplas fontes → contexto unificado → ação concreta.

## Por que não é RAG básico nem dashboard

RAG básico termina numa resposta. Este produto mantém um modelo operacional tipado, temporal e revisável da empresa.

`fontes heterogêneas → normalização → conexão → estado operacional → ação aprovada`

A interface pode ter visão geral, mas gráficos não são a função principal. A função é produzir e atualizar contexto operacional utilizável.

## Escopo do MVP do hackathon

### Obrigatório

- ingerir pelo menos três tipos de fonte;
- uma fonte real conectada ou consultada, preferencialmente GitHub público;
- entrada manual para Slack/documento no cenário de demonstração;
- cápsula de chat como conector portátil;
- extração estruturada via OpenAI;
- persistência dos itens com fonte, tempo e estado;
- briefing operacional do projeto;
- pergunta respondida com fontes;
- próximos passos acionáveis com aprovação humana;
- pacote de onboarding;
- fluxo completo funcionando em produção.

### Se o núcleo estiver estável

- sincronização real com Slack;
- detecção simples de conflito entre decisões;
- filtros por projeto, pessoa, fonte e período;
- exportação do onboarding em Markdown.

### Fora do MVP

- ingestão automática de chats privados;
- conectores para todas as ferramentas;
- agentes executando ações externas;
- billing, marketplace, comunidade e white-label;
- triagem, pontuação ou recomendação de candidatos;
- analytics como produto principal.

## Sessão adversarial corrigida

| Objeção | Resposta de produto |
|---|---|
| “É só busca corporativa.” | Busca é uma saída. O núcleo organiza estado, decisões, riscos, relações e ações ao longo do tempo. |
| “É só um RAG com várias fontes.” | A saída persiste como modelo operacional tipado, passa por estados e gera ações aprováveis. |
| “É amplo demais.” | A tese é ampla, mas a demo usa um único projeto e quatro fontes com três saídas: briefing, ação e onboarding. |
| “Isso vigia colaboradores.” | Fontes corporativas respeitam escopo; chats pessoais entram somente por cápsula voluntária e revisada. |
| “A IA pode inventar o estado da empresa.” | Cada item possui fonte e status; inferências são separadas de fatos e ações exigem aprovação. |
| “Notion, Slack e Glean já fazem isso.” | Eles validam busca conectada. O wedge é uma memória operacional leve para pequenas equipes, com conector portátil e transformação explícita em ação. |
| “Parece a PEQK.” | A tese histórica foi aproveitada, mas todo código, identidade e funcionalidade demonstrada precisam ser criados no evento e claramente documentados. |

## Veredito

**GO:** a tese correta é a mente operacional coletiva. O protocolo de chat permanece como diferencial de ingestão, mas a demonstração precisa começar na fragmentação da empresa e terminar em estado compartilhado e ação — não começar nem terminar no chat.

