# Uso do mascote Relay

## Ativo canônico

O personagem é o **Laço Vivo**, uma criatura-nó 2D que representa a passagem de fontes dispersas para contexto rastreável e ação. Ele não é um robô, não personifica uma IA onisciente e não deve substituir a marca.

| Arquivo                                     |      Dimensões | Uso recomendado                                                        |
| ------------------------------------------- | -------------: | ---------------------------------------------------------------------- |
| `public/brand/relay-mascot-ui-512.png`      |   512 × 388 px | Empty states, onboarding, assimilação de documentos e painel de ajuda  |
| `public/brand/relay-mascot-ui-256.png`      |   256 × 194 px | Cards compactos, confirmação de integração e feedback de processamento |
| `public/brand/relay-mascot-avatar-192.png`  |   192 × 192 px | Avatar do assistente e botão de entrada do chat                        |
| `public/brand/relay-mascot-transparent.png` | 1254 × 1254 px | Arquivo-fonte em alta resolução; não usar direto na UI                 |
| `public/brand/relay-mascot-states.png`      | 1254 × 1254 px | Prancha de referência; não usar como sprite na UI                      |
| `public/brand/relay-mascot-chroma.png`      | 1254 × 1254 px | Recorte e composição de vídeo; nunca usar no produto                   |

As três versões `ui` e `avatar` preservam transparência real. As versões de interface foram recortadas para eliminar a área vazia do original e reduzir custo visual e de transferência.

## Posições prioritárias na plataforma

1. **Página inicial / visão geral:** à direita da mensagem “Bom dia”, com 112–144 px de largura. Uma fala curta pode explicar que o contexto foi atualizado a partir das fontes conectadas.
2. **Assistente:** usar `relay-mascot-avatar-192.png` em 36–44 px no cabeçalho e nas mensagens da Relay. A conversa do usuário permanece sem mascote.
3. **Documentos:** mostrar `relay-mascot-ui-256.png` em 88–112 px durante a assimilação e no estado concluído, junto da contagem de memórias, decisões, riscos e ações extraídas.
4. **Integrações:** mostrar em 72–96 px somente após uma fonte ser conectada ou sincronizada. O personagem acompanha o resultado; não substitui o estado técnico da integração.
5. **Empty state:** usar `relay-mascot-ui-512.png` em 160–220 px quando ainda não há memória, conversa ou integração. Sempre oferecer uma ação concreta ao lado.

## Estados e comportamento

- **Atento:** entrada do assistente, visão geral e empty state.
- **Conectando:** sincronização de integração ou assimilação de arquivo; animação opcional de 600–900 ms apenas durante trabalho real.
- **Conflito encontrado:** acompanhar alerta de versões incompatíveis, sem transformar o risco em algo cômico.
- **Fonte ausente:** explicar que a resposta não possui lastro suficiente e oferecer adicionar fonte.
- **Ação registrada:** confirmação curta após aprovação humana.

No MVP, o ativo neutro recortado cobre atento, assimilação e confirmação. A prancha de estados serve apenas como direção para futuras exportações individuais.

## Regras de composição

- Usar sobre branco, `#F7F9F6` ou um chip claro quando a superfície for `#0D3B2E`; o contorno verde-escuro perde leitura diretamente sobre o Forest.
- Não aplicar círculo colorido atrás da versão horizontal. O avatar quadrado aceita um container branco ou Warm Canvas.
- Não usar sombra pesada, glow, rotação contínua ou movimento flutuante.
- Manter largura mínima de 56 px para o personagem completo e 32 px para o avatar.
- Não cortar rosto, três entradas laterais, saída direita ou pés: a silhueta completa comunica a metáfora do produto.
- Não mostrar o personagem em todos os cards. Ele aparece quando orienta, explica uma mudança de estado ou marca uma interação conversacional.

## Copy curta associada

- “Contexto atualizado a partir de 3 fontes.”
- “Encontrei duas versões desta decisão.”
- “Ainda falta uma fonte para confirmar isso.”
- “Documento assimilado. Criei 4 memórias e 2 ações.”
- “Ação registrada com sua aprovação.”
