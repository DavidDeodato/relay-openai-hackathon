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

Os checks de produto continuam pendentes até a implementação.

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
