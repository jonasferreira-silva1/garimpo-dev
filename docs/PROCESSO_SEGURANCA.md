# 🛡️ Processo e Governança de Segurança de Aplicação (AppSec)
**Projeto:** Garimpo Dev  
**Responsável Técnico:** Antigravity Senior AppSec Engineer / Jonas Ferreira Silva  
**Padrão de Referência:** OWASP Top 10 (2021), OWASP ASVS Nível 1, CWE Top 25  
**Data de Criação:** Novembro de 2026  

---

## 1. Visão Geral e Filosofia de Segurança

O **Garimpo Dev** adota o princípio de **Segurança por Design (Security by Design)** e **Defesa em Profundidade (Defense-in-Depth)**. Como uma aplicação 100% client-side (SPA) com arquitetura *zero-backend*, o modelo de segurança difere das aplicações web tradicionais:

1. **O Cliente é um Ambiente Hostil:**  
   Todo código executado no navegador pode ser inspecionado ou manipulado pelo usuário ou por extensões locais. Portanto, nenhuma regra de segurança depende de ofuscação.
2. **Dados Externos são Sempre Não Confiáveis:**  
   Respostas do Gateway da Sólides, parâmetros de URL (`?aba=`) e até dados persistidos no `localStorage` são tratados como fontes não confiáveis que requerem sanitização e validação de schema rigorosa em runtime.
3. **Custo Zero e Bundle Mínimo:**  
   Nenhuma dependência pesada é adicionada sem justificativa técnica. Priorizamos recursos nativos da Web Platform e utilitários consolidados com impacto nulo na performance.

---

## 2. Ciclo de Auditoria e Hardening em Sprints

O processo de blindagem do Garimpo Dev foi estruturado em **9 etapas (Sprints 0 a 8)**:

| Sprint | Foco Principal | Entregáveis Técnicos |
|---|---|---|
| **Sprint 0** | **Reconhecimento & Baseline** | Threat Model STRIDE, mapeamento de entradas/saídas, baseline de métricas (`npm audit`, lint, tests), relatório inicial `doc/SECURITY_AUDIT.md`. |
| **Sprint 1** | **Injeção e XSS (Prioridade Máxima)** | Sanitização estrita com `DOMPurify` em `VagaDetalhesModal.tsx`, bloqueio de scripts/handlers/URIs maliciosas, testes de injeção de payloads. |
| **Sprint 2** | **Integridade de Dados & Validação** | Validação com schemas Zod na leitura de `localStorage` (candidaturas, favoritos, cache), proteção contra poluição de protótipo, sanitização de `buildVagaUrl`. |
| **Sprint 3** | **Links Externos, Navegação e Privacidade** | `rel="noopener noreferrer"` em todos os links externos, allowlist de domínios/protocolos `https:`, revisão de `@media print` e compartilhamento. |
| **Sprint 4** | **Headers HTTP, CSP e Hardening de Servidor** | CSP estrito em `vercel.json` e `nginx.conf`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `server_tokens off`. |
| **Sprint 5** | **Docker e Supply Chain** | Migração para `nginx-unprivileged:alpine` (não-root), fixação de imagens por digest SHA256, `.dockerignore` seguro, `npm audit` zerado. |
| **Sprint 6** | **CI/CD, GitHub e Repositório** | Workflows com `permissions: contents: read`, actions fixadas por SHA, integração de CodeQL, Dependabot e verificação de segredos (Gitleaks). |
| **Sprint 7** | **Resiliência, Abuso e Disponibilidade** | Polling com `AbortController` e timeout de 10s no Axios, prevenção de timers zumbis, `ErrorBoundary` global com tela de fallback limpa. |
| **Sprint 8** | **Verificação Final e Documentação** | Re-execução completa de testes e audits, matriz de risco residual, documentação dos ADRs de segurança no `diarioTecnico.ts` e tag de release. |

---

## 3. Regras de Trabalho e Rastreabilidade Git

Para garantir total auditabilidade e conformidade com os mais altos padrões de engenharia:

### 3.1 Padrão de Branches e Commits
- Cada vulnerabilidade ou grupo atômico de correções é desenvolvido em branch dedicada:  
  `security/<sprint>-<id>-<slug>` (Exemplo: `security/s1-001-xss-descricao-vaga`)
- Mensagens de commit seguem estritamente o padrão **Conventional Commits**:  
  `fix(security): sanitizar descricao de vaga com DOMPurify [VULN-001]`
- Antes de qualquer push para a branch remota:
  ```bash
  npm run lint && npm run test && npm run build
  ```
- Nenhum commit é realizado sem o devido registro no relatório `doc/SECURITY_AUDIT.md`.

---

## 4. Matriz de Classificação de Vulnerabilidades (CVSS 3.1)

Todas as vulnerabilidades encontradas são catalogadas com a seguinte estrutura padronizada:
- **ID:** Código rastreável único (`VULN-001` a `VULN-013`).
- **Título & Severidade:** Pontuação métrica pelo Common Vulnerability Scoring System (CVSS v3.1) e classificação qualitativa:
  - **Crítica:** 9.0 – 10.0
  - **Alta:** 7.0 – 8.9
  - **Média:** 4.0 – 6.9
  - **Baixa:** 0.1 – 3.9
- **Local:** Caminho do arquivo e número de linha exato (`arquivo:linha`).
- **Prova de Conceito (PoC):** Procedimento reproduzível estritamente em ambiente local.
- **Impacto:** Consequência técnica e de negócio da exploração.
- **Correção Proposta:** Abordagem de engenharia para mitigar a causa raiz.
- **Teste de Regressão:** Teste automatizado que falha com a falha presente e passa após a correção.
- **Status:** Ciclo de vida (`Aberta` → `Em Progresso` → `Corrigida` → `Validada`).

---

## 5. Política de Divulgação Responsável e Contatos

Caso identifique uma vulnerabilidade de segurança no Garimpo Dev:
1. **Não abra uma Issue pública** contendo detalhes exploráveis.
2. Encaminhe o relatório com passos de reprodução diretamente para o mantenedor através do canal de divulgação responsável do GitHub (`Security Advisories`) ou e-mail de contato informado no perfil.
3. Um patch de segurança será avaliado, desenvolvido e disponibilizado em até 72 horas úteis.
