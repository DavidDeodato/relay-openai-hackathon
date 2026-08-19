# Relay — roteiro da demonstração em vídeo

## Objetivo

Em 60–75 segundos, provar um único fluxo: três fontes dispersas viram memória operacional rastreável, um conflito visível, uma ação aprovada e um handoff utilizável. O chat não conduz a demonstração; aparece apenas como fonte adicional opcional, se houver tempo.

## Roteiro principal — 70 segundos

| Tempo | Tela e cliques | Fala |
|---|---|---|
| 00:00–00:05 | Abrir o workspace `Lançamento Atlas` na visão **Fontes**. Deixar Slack, GitHub e Documento visíveis na mesma tela. | “Uma empresa pequena toma decisões rápido, mas o contexto fica espalhado entre ferramentas e pessoas.” |
| 00:05–00:13 | Clicar em **Slack** e destacar a mensagem: “Lançamento completo adiado para sexta; manter apenas o piloto na quarta.” | “No Slack, o time decidiu adiar o lançamento completo e manter só o piloto.” |
| 00:13–00:20 | Clicar em **GitHub** e abrir a atividade da pull request marcada como pronta para produção. | “No GitHub, porém, a implementação aparece pronta para produção.” |
| 00:20–00:26 | Clicar em **Documento** e destacar a nota do cliente pedindo acesso ao piloto na quarta-feira. | “E neste documento, o cliente ainda espera acessar o piloto na quarta.” |
| 00:26–00:35 | Clicar em **Atualizar memória**. Mostrar a transição das três fontes para os itens tipados: decisão, avanço, risco e ação. | “Relay conecta essas fontes, preserva a origem e transforma o material disperso em memória operacional.” |
| 00:35–00:44 | Abrir **Estado atual**. Destacar a decisão da sexta-feira, o piloto de quarta e os links de fonte ao lado de cada item. | “Agora a equipe vê o estado real: o lançamento mudou, o piloto continua e cada afirmação aponta para sua fonte.” |
| 00:44–00:52 | Abrir o cartão **Conflito encontrado**. Exibir lado a lado Slack e GitHub: escopo reduzido versus release pronta. | “Relay também encontrou um conflito: o código está pronto para um escopo que já foi reduzido no Slack.” |
| 00:52–01:00 | No cartão de ação sugerida, clicar em **Aprovar ação**: “Alinhar a release ao piloto e avisar o cliente até 15h”, responsável `Carlos`. Mostrar confirmação. | “Em vez de só responder uma pergunta, ele propõe o próximo passo. Carlos revisa e aprova a ação.” |
| 01:00–01:08 | Clicar em **Gerar handoff**. Mostrar o resumo com contexto, decisões, conflito, ação, responsável e fontes. | “E quem entrar no projeto recebe um handoff com o que mudou, por quê, o risco atual e o que acontece depois.” |
| 01:08–01:12 | Voltar à visão geral com logo Relay e os três blocos: memória, conflito e ação aprovada. | “Relay: contexto disperso vira clareza e ação, sem perder a fonte.” |

## Inserção opcional de chat — máximo de 4 segundos

Usar somente se o vídeo principal estiver abaixo de 68 segundos e o recurso estiver estável.

- Após mostrar as três fontes, deixar `Chat — cápsula revisada` aparecer discretamente em **Outras fontes**.
- Não abrir uma conversa nem usar uma caixa de pergunta.
- Fala opcional: “Até uma conversa pode entrar como cápsula revisada — mas é só mais uma fonte.”

Se a inserção comprometer o ritmo, remover. Slack, GitHub e documento já demonstram a tese central.

## Dados que precisam estar preparados

### Slack

> Decisão: lançamento completo adiado para sexta. Na quarta, manter somente o piloto com o cliente Aurora.

### GitHub

- Pull request: `Preparar release completa do Atlas`
- Estado: pronta para produção
- Evidência visual: título, estado e data legíveis

### Documento

> Cliente Aurora confirmou disponibilidade para testar o piloto na quarta-feira e precisa receber o acesso até 15h.

### Conflito esperado

> A release do GitHub ainda representa o lançamento completo, mas a decisão mais recente no Slack reduziu o escopo de quarta-feira para um piloto.

### Ação esperada

> Alinhar a release ao escopo do piloto e enviar o acesso ao cliente Aurora até 15h.

- Responsável: Carlos
- Estado inicial: aguardando aprovação
- Estado após clique: aprovada

### Handoff esperado

O handoff deve mostrar, sem texto excessivo:

- objetivo do projeto;
- mudança de escopo;
- decisão e respectiva fonte;
- avanço técnico;
- conflito atual;
- ação aprovada, responsável e prazo;
- links para Slack, GitHub e documento.

## Direção de gravação

- Gravar em desktop, com zoom suficiente para leitura dos cartões.
- Manter o cursor parado enquanto houver fala; mover apenas para o próximo clique.
- Fazer cortes secos entre esperas de processamento. Não mostrar loading longo.
- Usar uma única tomada de voz, natural e ligeiramente enérgica.
- Não acelerar a voz para encaixar conteúdo; cortar palavras ou telas antes de perder clareza.
- Não chamar Relay de chatbot, assistente que sabe tudo ou fonte única da verdade.
- Não afirmar integração nativa quando a fonte estiver simulada/importada.
- Não mostrar dashboard de métricas, configurações, login ou arquitetura.
- Manter as referências de origem visíveis sempre que uma decisão ou conflito aparecer.

## Checklist antes de gravar

- [ ] Ambiente de demonstração aberto e autenticado.
- [ ] Workspace `Lançamento Atlas` restaurado no estado inicial.
- [ ] Slack, GitHub e documento carregam sem erro.
- [ ] Conteúdo das três fontes está legível e coerente nas datas.
- [ ] GitHub utilizado na demo corresponde à fonte real declarada.
- [ ] Botão **Atualizar memória** gera decisão, avanço, risco e ação esperados.
- [ ] Estado atual mostra fontes clicáveis ou referências identificáveis.
- [ ] Conflito aparece entre a decisão do Slack e a release do GitHub.
- [ ] A ação começa pendente e muda visualmente para aprovada.
- [ ] Responsável e prazo aparecem após a aprovação.
- [ ] Handoff inclui contexto, decisão, conflito, ação e fontes.
- [ ] Nenhum dado pessoal, token, chave ou ambiente interno aparece.
- [ ] Notificações do sistema e do navegador estão desativadas.
- [ ] Cursor, zoom, microfone e resolução foram testados.
- [ ] Uma gravação reserva foi feita sem a inserção opcional de chat.
- [ ] Duração final está entre 60 e 75 segundos.
- [ ] O vídeo final mostra apenas funcionalidades efetivamente demonstradas.
