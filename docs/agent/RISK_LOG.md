# Risk Log

| ID | Risco | Severidade | Gatilho | Mitigação | Estado |
|---|---|---|---|---|---|
| RISK-001 | desclassificação por trabalho anterior | crítica | código/UI/feature PEQK reaparece como novo | novo repo e implementação; README e demo transparentes | aberto |
| RISK-002 | enquadramento como RAG básico/dashboard | alta | demo começa em busca ou analytics | começar na captura, revisão e publicação | aberto |
| RISK-003 | percepção de vigilância | alta | ingestão automática ou sem prévia | opt-in, revisão granular, minimização de dados | mitigado no desenho |
| RISK-004 | alucinação de decisão | alta | item sem fonte | schema + trecho obrigatório + aprovação humana | mitigado no desenho |
| RISK-005 | API/rede falha na demo | alta | timeout ou rate limit | cápsula previamente processada e retry; ensaio em produção | aberto |
| RISK-006 | prazo de 16h | crítica | núcleo não fecha até cerca de 15h | cortar extras imediatamente e reservar buffer | aberto |
| RISK-007 | credenciais expostas | crítica | copiar `.env` ou imprimir valores | auditoria só de nomes; `.gitignore`; diff antes de publicar | aberto |
| RISK-008 | produto ser reduzido ao conector de chat | alta | narrativa ou demo começa e termina numa conversa | demonstrar múltiplas fontes, memória unificada e ação | mitigado no desenho corrigido |
| RISK-009 | estética genérica ou incoerente | alta | geração começa antes de princípios, personagem e interface estarem conectados | sistema visual único, brand book e board renderizado | mitigado no branding v1 |
| RISK-010 | mascote infantilizar o produto | média | personagem parece brinquedo/robô genérico ou ocupa superfícies operacionais densas | uso a partir de 96 px e apenas em estados funcionais; símbolo assume escala pequena | mitigado no branding v1 |
| RISK-011 | colisão jurídica do nome Relay | média | publicação comercial ou registro da marca | tratar como nome do hackathon; fazer clearance e domínio antes de investimento comercial | aberto, fora da etapa |
