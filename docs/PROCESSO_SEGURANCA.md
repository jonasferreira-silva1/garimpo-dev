# 🛡️ Processo e Governança de Segurança de Aplicação (AppSec)
**Projeto:** Garimpo Dev  
**Responsável Técnico:** Antigravity Senior AppSec Engineer / Jonas Ferreira Silva  
**Padrão de Referência:** OWASP Top 10 (2021), OWASP ASVS Nível 1, CWE Top 25, FIRST CVSS v3.1  
**Data de Atualização:** Novembro de 2026 (Versão Calibrada pós-Revisão Técnica)  

---

## 1. Visão Geral e Filosofia de Segurança

O **Garimpo Dev** adota o princípio de **Segurança por Design (Security by Design)** e **Defesa em Profundidade (Defense-in-Depth)**. Como uma aplicação 100% client-side (SPA) com arquitetura *zero-backend*, o modelo de segurança difere substancialmente das aplicações web corporativas tradicionais:

1. **O Cliente é um Ambiente Hostil:**  
   Todo código executado no navegador pode ser inspecionado ou manipulado pelo usuário ou por extensões locais. Portanto, nenhuma regra de segurança depende de ofuscação.
2. **Dados Externos são Sempre Não Confiáveis:**  
   Respostas do Gateway da Sólides, parâmetros de URL (`?aba=`) e até dados persistidos no `localStorage` são tratados como fontes não confiáveis que requerem sanitização e validação de schema rigorosa em runtime.
3. **Calibragem Honesta de Risco:**  
   Distinguimos com clareza **vulnerabilidades exploráveis** de **melhorias de robustez, resiliência e hardening**. Não inflamos métricas; classificamos cada achado com vetores calculados na especificação oficial do FIRST CVSS 3.1.
4. **Custo Zero e Bundle Mínimo:**  
   Nenhuma dependência pesada é adicionada sem justificativa técnica comprovada. Priorizamos recursos nativos da Web Platform e utilitários consolidados com impacto nulo na performance e no tempo de carregamento.

---

## 2. Ciclo Estratégico de Hardening em Sprints

O cronograma de implementação foi ordenado de forma lógica, priorizando a vulnerabilidade de maior impacto real logo na largada e estabilizando dependências no início do ciclo para evitar retrabalho de testes:

| Sprint | Foco Principal | Entregáveis Técnicos |
|---|---|---|
| **Sprint 0** | **Reconhecimento, STRIDE & Baseline Calibrado** | Threat Model STRIDE calibrado, negative testing (?aba=, inputs livres), análise de ReDoS, baseline de métricas (`npm audit`, lint, tests), relatório `docs/SECURITY_AUDIT.md`. |
| **Sprint 1** | **Injeção e XSS (Prioridade Máxima — VULN-001)** | Sanitização estrita com `DOMPurify` em `VagaDetalhesModal.tsx` com allowlist para descrições reais, bloqueio de scripts/handlers e bateria de testes de injeção em Vitest. |
| **Sprint 2** | **Supply Chain & Estabilização de Base (VULN-008)** | Resolução de dependências via `npm audit fix` (sem quebras), upgrade de segurança do `zod` e `vite`, garantindo base estável para as sprints seguintes. |
| **Sprint 3** | **Defesa em Profundidade & Headers HTTP (VULN-006)** | Configuração de CSP inicial em modo `Content-Security-Policy-Report-Only` no `vercel.json` e `nginx.conf`, `frame-ancestors 'none'`, e auditoria de HSTS. |
| **Sprint 4** | **Sanitização de URLs e Contrato de APIs (VULN-002, 004, 011)** | `buildVagaUrl` estrito por regex sem fallback cego para `portodigital`, validação Zod no agregador `fetchVagasMultiplosSlugs` e filtro de protocolos em links externos. |
| **Sprint 5** | **Integridade e Robustez de Dados Locais (VULN-003, 005)** | Schemas Zod na leitura de `localStorage` para candidaturas e favoritos com fallback resiliente, e registro formal da mitigação de Prototype Pollution. |
| **Sprint 6** | **Infraestrutura Docker & CI/CD (VULN-007, 009)** | Migração para `nginxinc/nginx-unprivileged:alpine` com escuta na porta **8080**, instruções atualizadas no README e restrição de permissões (`contents: read`) no GitHub Actions com pinning SHA. |
| **Sprint 7** | **Resiliência, Abuso e UX (VULN-010, 012, 013)** | Polling periódico com `AbortController` e timeout de 10s no Axios, componente `GlobalErrorBoundary` contra tela branca e remoção de logs de console em produção. |
| **Sprint 8** | **Verificação Final, Matriz de Risco e Conclusão** | Re-execução completa de testes de regressão de segurança, verificação no SecurityHeaders, matriz de risco residual e documentação dos ADRs no `diarioTecnico.ts`. |

---

## 3. Regras de Trabalho e Rastreabilidade Git

Para garantir total auditabilidade e conformidade com padrões de engenharia de software de alta maturidade:

### 3.1 Padrão de Branches e Commits
- Cada vulnerabilidade ou grupo atômico de correções é desenvolvido em branch dedicada:  
  `security/<sprint>-<id>-<slug>` (Exemplo: `security/s1-001-xss-descricao-vaga`)
- Mensagens de commit seguem estritamente o padrão **Conventional Commits**:  
  `fix(security): sanitizar descricao de vaga com DOMPurify [VULN-001]`
- Antes de qualquer push para a branch remota:
  ```bash
  npm run lint && npm run test && npm run build
  ```
- Nenhum commit é realizado sem o devido registro no relatório `docs/SECURITY_AUDIT.md`.

---

## 4. Matriz de Classificação de Achados (FIRST CVSS 3.1)

Todas as questões identificadas são catalogadas sob quatro grupos padronizados:
- **Grupo A: Vulnerabilidades de Segurança Exploráveis:** Falhas que permitem a um atacante externo interferir diretamente no usuário (`VULN-001`, `VULN-002`, `VULN-011`).
- **Grupo B: Defesa em Profundidade & Hardening de Infra/CI:** Configurações defensivas que reduzem a superfície de ataque e o raio de explosão (`VULN-006`, `VULN-007`, `VULN-009`).
- **Grupo C: Robustez de Software & Integridade de Dados:** Validações de runtime que protegem a aplicação contra estados inconsistentes (`VULN-003`, `VULN-004`, `VULN-005`).
- **Grupo D: Resiliência, UX e Higiene Operacional:** Prevenção de desperdício de recursos, falhas de interface e logs ruidosos (`VULN-008`, `VULN-010`, `VULN-012`, `VULN-013`).

### 4.1 Estrutura de Documentação por Achado
- **ID:** Código rastreável único (`VULN-001` a `VULN-013`).
- **Título & Classificação:** Rótulo honesto do tipo de achado (Vulnerabilidade, Hardening, Robustez ou Resiliência).
- **Vetor & Pontuação CVSS v3.1:** Cálculo na calculadora oficial do FIRST (`first.org/cvss/calculator/3.1`).
- **Local:** Caminho do arquivo e intervalo de linhas exato (`arquivo:linha`).
- **Vetor Real vs Simulação Local (PoC):** Cenário de ameaça real e passos reproduzíveis em ambiente local.
- **Impacto Real:** Avaliação honesta do dano técnico e funcional.
- **Correção Proposta:** Abordagem de engenharia para mitigar a causa raiz sem quebrar a experiência de uso.
- **Teste de Regressão:** Teste automatizado que falha com o código vulnerável e passa com a correção aplicada.
- **Status:** Ciclo de vida (`Aberta` → `Em Progresso` → `Corrigida` → `Validada`).

---

## 5. Política de Divulgação Responsável e Contatos

Caso identifique uma vulnerabilidade de segurança no Garimpo Dev:
1. **Não abra uma Issue pública** contendo detalhes exploráveis.
2. Encaminhe o relatório com passos de reprodução diretamente para o mantenedor através do canal de divulgação responsável do GitHub (`Security Advisories`) ou e-mail de contato informado no perfil.
3. Um patch de segurança será avaliado, desenvolvido e disponibilizado em até 72 horas úteis.
