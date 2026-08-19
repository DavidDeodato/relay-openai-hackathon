# QA Bank

## Smoke obrigatório

- [ ] abrir a landing sem autenticação;
- [ ] importar arquivo válido;
- [ ] ingerir ao menos três tipos de fonte;
- [ ] consultar uma fonte GitHub real;
- [ ] rejeitar arquivo vazio ou tipo inválido;
- [ ] receber itens estruturados da OpenAI;
- [ ] remover e editar item na prévia;
- [ ] publicar cápsula;
- [ ] gerar briefing operacional consolidado;
- [ ] propor e aprovar uma ação;
- [ ] recarregar e comprovar persistência;
- [ ] perguntar sobre a decisão e abrir a referência;
- [ ] gerar handoff;
- [ ] mostrar erro recuperável quando API falhar;
- [ ] verificar desktop e mobile;
- [ ] verificar console e network;
- [ ] abrir URL de produção em janela anônima.

## Checks técnicos

- [ ] typecheck/build;
- [ ] lint;
- [ ] validação de schema da saída da IA;
- [ ] segregação entre rascunho e publicado;
- [ ] nenhum segredo no Git;
- [ ] README diferencia trabalho do hackathon de referências anteriores;
- [ ] vídeo mostra somente recursos implementados hoje.

## Estado atual

O caminho crítico definido para a demo está validado. Os itens do smoke original ligados a importação, edição de prévia e publicação de cápsula foram retirados do escopo do MVP quando o produto convergiu para a visão operacional centralizada; não são evidência exigida para esta entrega.

## QA de branding — 2026-08-19

- [x] nome final Relay substitui nomes descartados nos artefatos canônicos;
- [x] quatro SVGs parseiam como XML válido;
- [x] mascote principal possui alpha real e canto transparente;
- [x] versão chroma possui fundo verde contínuo e sem alpha;
- [x] hero possui proporção 16:9 aproximada e narrativa três fontes → uma ação;
- [x] folha de estados contém quatro situações funcionais;
- [x] brand board abriu em Chromium headless;
- [x] seis imagens do board carregaram sem quebra;
- [x] screenshot desktop renderizado em `brand/relay-brand-board.png`;
- [x] textos e cores principais possuem contraste documentado;
- [x] ativo completo e ícone de pequena escala estão separados;
- [x] arquivos rejeitados não foram copiados para `public/brand/`.

## QA da plataforma — 2026-08-19

- [x] `npm test`: build Next.js, TypeScript e contrato do fluxo passaram;
- [x] `npm run lint`: zero erros;
- [x] home de produção respondeu HTTP 200;
- [x] `/api/ask` respondeu em modo `live` com a OpenAI;
- [x] chat secundário enviou pergunta livre e recebeu resposta contextual citando `SRC-01`, `SRC-02` e `SRC-03`;
- [x] seleção de fonte atualiza o inspetor;
- [x] aprovação altera o estado e persiste após reload;
- [x] handoff abre com objetivo, decisão, risco, pendência e próximo passo;
- [x] browser desktop sem erro de console, página ou request;
- [x] mobile em 390 px sem overflow horizontal;
- [x] screenshots de produção em `docs/qa-production-desktop.png` e `docs/qa-production-mobile.png`;
- [x] URL pública: `https://relay-openai-hackathon.vercel.app`.
- [x] take-base de 22 segundos em MP4 validado por `ffprobe`.
