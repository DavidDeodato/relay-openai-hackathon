# Fixture da demonstração

## Cenário

A equipe fictícia **Lume** prepara o piloto do projeto **Atlas**, uma central de atendimento para três empresas parceiras. O início está previsto para sexta-feira. O contexto recente ficou dividido entre uma mensagem do time, um commit e o documento de escopo.

Todos os nomes, projetos e conteúdos abaixo são fictícios.

## Fontes

### SRC-01 — Mensagem de time

**Canal:** `#projeto-atlas`  
**Registrada em:** 19 ago. 2026, 10h12 BRT  
**Autoria:** liderança de produto

> Para preservar o piloto de sexta, vamos liberar busca e respostas com fonte. A importação em lote por CSV fica fora desta primeira versão. Ainda precisamos receber o schema de dados de uma das empresas parceiras.

### SRC-02 — Commit no GitHub

**Repositório:** `lume/atlas-demo`  
**Commit:** `8f31c2a`  
**Registrado em:** 19 ago. 2026, 11h04 BRT

```text
fix(sync): impedir processamento duplicado de eventos

- adiciona chave de idempotência por evento
- registra tentativas repetidas no log
- cobre reenvio do mesmo payload em teste
```

### SRC-03 — Trecho do documento de escopo

**Documento:** `Escopo do piloto Atlas — v3`  
**Atualizado em:** 18 ago. 2026, 17h40 BRT

> O piloto será considerado pronto quando permitir busca com fontes, respostas assistidas e importação em lote por CSV. A validação ocorrerá com três empresas parceiras na sexta-feira.

## Memórias estruturadas

| ID | Tipo | Memória | Estado | Lastro |
|---|---|---|---|---|
| MEM-01 | decisão | O piloto será lançado sem importação em lote por CSV. | confirmado | SRC-01 |
| MEM-02 | risco | Reenvios podiam duplicar eventos; o commit adiciona idempotência, mas a correção ainda precisa passar pelo smoke do fluxo completo. | confirmado | SRC-02 |
| MEM-03 | pendência | Falta receber o schema de dados de uma das três empresas parceiras. | pendente | SRC-01 |
| MEM-04 | ação | Atualizar o documento de escopo para remover CSV dos critérios do piloto e registrar a mudança para a equipe. | aprovado | SRC-01 + SRC-03 |
| MEM-05 | contexto | O piloto está previsto para sexta-feira e envolve três empresas parceiras. | confirmado | SRC-03 |

## Conflito detectado

**CONFLICT-01 — Critério de aceite divergente**

- A decisão mais recente do time exclui a importação por CSV do piloto (SRC-01).
- O documento vigente ainda exige essa funcionalidade para considerar o piloto pronto (SRC-03).
- Enquanto o documento não for atualizado, a equipe pode avaliar a entrega usando critérios incompatíveis.

**Estado:** aberto, com correção aprovada em MEM-04.

## Briefing operacional

O piloto Atlas continua previsto para sexta-feira, com busca e respostas apoiadas por fontes. A importação por CSV foi retirada da primeira versão, mas o documento de escopo ainda não reflete a decisão. A sincronização recebeu proteção contra eventos duplicados e precisa de smoke end-to-end. Também permanece pendente o schema de uma das três empresas parceiras.

## Ação

**Sugerida:** atualizar `Escopo do piloto Atlas — v3`, removendo CSV dos critérios de aceite e vinculando a decisão registrada em SRC-01.

**Responsável:** liderança de produto  
**Evidências incluídas:** SRC-01 e SRC-03  
**Estado inicial:** proposta  
**Decisão humana:** aprovada  
**Registro esperado:** nova versão do documento e aviso no canal do projeto.

## Handoff

### O que uma pessoa entrando no projeto precisa saber

- **Objetivo atual:** realizar o piloto de sexta-feira com busca e respostas apoiadas por fontes.
- **Decisão vigente:** CSV não faz parte desta primeira versão.
- **Risco técnico:** confirmar em smoke que reenvios não duplicam eventos após o commit `8f31c2a`.
- **Pendência externa:** obter o schema que falta antes da validação com as três empresas.
- **Conflito em correção:** o documento v3 ainda contém o critério antigo de CSV.
- **Próximo passo aprovado:** atualizar o documento e comunicar a mudança usando SRC-01 e SRC-03 como lastro.
