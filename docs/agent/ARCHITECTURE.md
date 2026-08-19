# Architecture

## Forma do sistema

Aplicação Next.js orientada a uma memória operacional multi-fonte:

`source adapters → context compiler → operational memory → briefing/query/action/onboarding`

## Adaptadores de fonte do MVP

- GitHub público: atividade verificável de repositório.
- Atualização de canal: texto/arquivo importado como Slack ou comunicação corporativa.
- Cápsula de chat: arquivo estruturado, opcional e revisado pela pessoa.
- Nota/documento manual: fallback para outros contextos.

Os adaptadores convertem formatos diferentes para um envelope comum; o compilador da OpenAI tipa o conteúdo.

## Entidades mínimas

### SourceRecord

- id
- workspaceId
- sourceType: github, slack, document, chat_capsule ou manual
- sourceLabel
- externalUrl opcional
- contributor
- capturedAt
- rawContent ou referência temporária

### ContextItem

- id
- sourceRecordId
- project
- people
- type: progress, decision, rationale, task, risk, process, learning, artifact ou open_question
- statement
- sourceExcerpt
- eventTime
- epistemicStatus: confirmed, inferred ou pending
- owner opcional
- dueDate opcional
- confidence
- approvedAt

### ProposedAction

- id
- contextItemIds
- title
- rationale
- owner opcional
- state: proposed, approved, dismissed ou done

### ContextPackage

- id
- project
- targetRole
- contextItemIds
- generatedContent
- createdAt

## IA

- Entrada tratada como conteúdo não confiável.
- Saída estruturada validada por schema.
- Item factual exige trecho-fonte.
- O modelo separa confirmado, inferido e pendente.
- Ação nunca é executada automaticamente; fica proposta para aprovação.
- Briefings e respostas citam IDs e fontes.

## Memória operacional

O MVP não precisa de um grafo visual completo. Relações por projeto, pessoa, tipo, fonte e tempo são suficientes para provar a tese. Busca textual e filtros sobre itens aprovados reduzem complexidade; embeddings podem vir depois.

## Privacidade

- Fontes corporativas usam escopo explícito.
- Chat pessoal só entra por cápsula voluntária.
- Prévia e minimização antes de persistir conteúdo sensível.
- O texto bruto pode ser descartado após compilação; trechos aprovados preservam proveniência.

## Tradeoffs

- Um conector real e múltiplos adaptadores controlados vencem muitos OAuth frágeis.
- Action center simples vence agentes autônomos.
- Briefing operacional vence dashboard de métricas.
- Novo código e nova identidade preservam a elegibilidade do hackathon.

