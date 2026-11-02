# 🛡️ Relatório de Auditoria de Segurança de Aplicação (AppSec)
**Projeto:** Garimpo Dev (v2.5 Full)  
**Repositório:** `jonasferreira-silva1/garimpo-dev`  
**Stack Tecnológica:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Zod (100% Client-Side SPA)  
**Ambientes de Deploy:** Vercel (Edge CDN) & Imagem Docker (Nginx Alpine)  
**Pipeline CI/CD:** GitHub Actions (`ci.yml`)  
**Data da Auditoria Inicial:** 02 de Novembro de 2026  
**Auditor / Engenheiro de AppSec:** Antigravity Senior AppSec Engineer  
**Status do Processo:** Sprint 0 Concluída — Baseline e Mapeamento Concluídos  

---

## 1. Sumário Executivo & Governança

O **Garimpo Dev** é um radar de oportunidades tech e hub de eventos do Porto Digital e ecossistema de Recife (PE). Trata-se de uma Single Page Application (SPA) 100% client-side (arquitetura *zero-backend*), que consome diretamente o API Gateway público da plataforma Sólides via Axios aproveitando cabeçalhos CORS abertos, persiste candidaturas, favoritos e histórico de mercado em `localStorage`, e oferece exportação em PDF via `@media print`.

Embora a arquitetura *zero-backend* elimine superfícies tradicionais de ataque de servidores (como injeção SQL em banco próprio, RCE em servidores de aplicação ou quebra de autenticação por sessão em backend), a auditoria de baseline identificou **13 vulnerabilidades exploráveis**, distribuídas entre injeção de HTML/XSS vindo de dados de API externa, fragilidades na integridade e deserialização de dados do `localStorage`, ausência de cabeçalhos de defesa HTTP (CSP, HSTS, frame protection), execução com privilégios de root no Docker e componentes desatualizados com CVEs conhecidas.

---

## 2. Threat Model (STRIDE) Simplificado

A modelagem de ameaças adotou a metodologia **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) considerando as fronteiras de confiança do frontend client-side:

```
[ Usuário / Navegador Local ]
         │
         ├─── (Aba / Query String: ?aba=) ──────────────────────────┐
         │                                                         │
         ├─── (Entradas Livres: Busca, Filtros, Notas Candidatura) ───┤
         │                                                         ▼
         ├─── (Armazenamento Local) ───► [ LocalStorage (Não Confiável) ]
         │                                       │
         ▼                                       ▼
  [ Garimpo Dev SPA (React 19 / DOM) ] ◄─────────┘
         │               ▲
         │ (HTTP GET)    │ (Payloads JSON com HTML bruto)
         ▼               │
  [ Gateway API Sólides (Terceiro Não Confiável) ]
         │
         ▼
  [ Links Externos / Redirecionamentos: vagas.solides, mapas, redes sociais ]
```

| Ameaça (STRIDE) | Componente Afetado | Vetor / Cenário de Ataque | Severidade | Mitigação no Garimpo Dev |
|---|---|---|---|---|
| **Spoofing** (Falsificação) | `buildVagaUrl()` | Slugs adulterados na resposta da API direcionando para domínios de phishing com fragmentos ou query strings maliciosas. | Média | Allowlist regex estrita para slug (`^[a-zA-Z0-9_-]+$`) e garantia de host `.vagas.solides.com.br` com protocolo `https:`. |
| **Tampering** (Adulteração) | `localStorage` (cache, candidaturas, favoritos, histórico) | Manipulação direta do storage por scripts, extensões maliciosas ou XSS local injetando tipos inválidos ou poluição de protótipo. | Média / Alta | Validação runtime completa com schemas Zod na LEITURA do `localStorage` com descarte gracioso em caso de divergência. |
| **Repudiation** (Repúdio) | Tracker de Candidaturas | Falhas silenciosas de gravação ou limpeza acidental de dados sem feedback ao usuário. | Baixa | Tratamento defensivo de exceções de cota do `localStorage` (QuotaExceededError). |
| **Information Disclosure** (Vazamento) | Logs de console (`console.error`, `console.warn`) & Nginx | Detalhes internos de requisições Axios e cabeçalhos de servidor vazando versão do Nginx (`server_tokens on`). | Baixa | Remoção de logs em produção (`import.meta.env.DEV`), `server_tokens off` no Nginx e cabeçalho `Referrer-Policy: strict-origin-when-cross-origin`. |
| **Denial of Service** (Negação de Serviço) | `useVagas` (Polling/Timer), `mercadoAnalytics` (Regex) | Polling em loop infinito por acúmulo de efeitos colaterais sem `AbortController`; regex complexos em payloads massivos de texto. | Média | Polling desacoplado com cleanup confiável, `AbortController` com timeout de 10s no Axios, e limites de tamanho em campos textuais. |
| **Elevation of Privilege** (Elevação de Privilégio) / Injection | `VagaDetalhesModal.tsx` (`dangerouslySetInnerHTML`) | Injeção de scripts (XSS Stored/Reflected) através do campo `description` vindo da API externa. | Crítica | Sanitização profunda com `DOMPurify` (allowlist estrita de tags e atributos seguros, bloqueio de handlers `on*` e protocolos `javascript:`/`data:`). |

---

## 3. Mapeamento de Superfície de Ataque

### 3.1 Entradas (Input Vectors)
1. **API Gateway Sólides (`https://apigw.solides.com.br/jobs/v3/home/vacancy`):**  
   - Campos: `description` (HTML rico), `title`, `companyName`, `companyLogo`, `slug`, `redirectLink`, `salary`, `city`, `state`, `benefits`.
   - Fronteira: Terceiro não autenticado, sujeito a manipulação de dados ou respostas maliciosas.
2. **Parâmetros de URL (Query String):**  
   - Parâmetro `?aba=` em `App.tsx:44`.
3. **Persistência Local (`localStorage`):**  
   - Chaves: `garimpo_dev_candidaturas`, `garimpo_dev_favoritos`, `garimpo_dev_cache_vagas`, `garimpo_dev_historico_mercado`.
4. **Campos Livres do Usuário:**  
   - Input de anotações da candidatura em `StatusSelector.tsx` (`tempObs`).
   - Inputs de busca em `FiltroBar.tsx` e `FiltroEventos.tsx` (`filtros.busca`).

### 3.2 Saídas (Output Vectors)
1. **Renderização no DOM:**  
   - Inserção direta de HTML em `VagaDetalhesModal.tsx:155` via `dangerouslySetInnerHTML`.
   - Tags de imagem (`<img src={vaga.companyLogo}>`).
2. **Navegação Externa:**  
   - Links com `target="_blank"` em `VagaCard.tsx`, `VagaDetalhesModal.tsx`, `EventoCard.tsx`, `EventoDetalhesModal.tsx`, `RadarOutrasFontes.tsx`, `SobreModal.tsx` e `App.tsx`.
3. **Exportação & Clipboard:**  
   - Geração de texto para postagem no LinkedIn/WhatsApp (`relatorioFormatter.ts`).
   - Folhas de estilo de impressão (`@media print` no `RelatorioModal.tsx` e `RelatorioView.tsx`) via `window.print()`.

---

## 4. Baseline de Métricas de Segurança (Sprint 0)

| Métrica / Ferramenta | Estado Inicial (Sprint 0) | Meta de Blindagem (Sprint 8) | Status Atual |
|---|---|---|---|
| **npm audit** | 8 vulnerabilidades (5 High, 3 Moderate) | 0 vulnerabilidades (Crítica/Alta/Média) | ⚠️ Falhando |
| **npm outdated** | Dependências principais com minor/patch atrasados (`zod`, `vite`, `axios`) | Dependências críticas atualizadas sem CVEs | ⚠️ Desatualizado |
| **npm run lint (Oxlint)** | 0 erros, 2 avisos (purity e setState in effect) | 0 erros, 0 avisos com regras de segurança ativas | ⚠️ 2 Warnings |
| **npm run test (Vitest)** | 19 arquivos, 66 testes passando | 100% testes passando + novos testes de regressão de segurança | ✅ 66 Passando |
| **npm run build (Vite)** | Build OK (0.47 kB HTML, 56.29 kB CSS, 494.71 kB JS) | Build com tipos estritos e bundle otimizado | ✅ Build OK |
| **Secrets no Histórico Git** | 0 chaves, senhas ou tokens encontrados nos commits | 0 segredos + CI com verificação automática (Gitleaks) | ✅ Limpo |
| **Content Security Policy (CSP)** | Inexistente (sem vercel.json nem nginx.conf seguro) | CSP Estrito nota A/A+ no SecurityHeaders | ❌ Inexistente |
| **Permissões no GitHub Actions** | Permissões padrão do repositório (sem restrição explícita) | `permissions: contents: read` + actions fixadas por SHA | ⚠️ Sem restrição |
| **Container Docker** | Roda como `root` (UID 0), imagem sem digest | Usuário `nginx-unprivileged` (UID 101), imagem com digest | ⚠️ Inseguro |

---

## 5. Tabela Consolidada de Achados Preliminares

| ID | Título | Severidade (CVSS 3.1) | Categoria OWASP / CWE | Localização | Status |
|---|---|---|---|---|---|
| **VULN-001** | Cross-Site Scripting (XSS) via Descrição HTML Não Sanitizada | **Crítica (9.3)** | OWASP A03 / CWE-79 | `src/components/VagaDetalhesModal.tsx:155` | Aberta |
| **VULN-002** | Open Redirect e Spoofing de Domínio em `buildVagaUrl` | **Média (6.1)** | OWASP A01 / CWE-601 | `src/utils/formatters.ts:82-85` | Aberta |
| **VULN-003** | Ausência de Validação de Schema (Zod) na Deserialização de `localStorage` | **Média (6.5)** | OWASP A08 / CWE-502 | `src/hooks/useCandidaturas.ts:18`, `useFavoritos.ts:17`, `useVagas.ts:55`, `mercadoAnalytics.ts:213,240` | Aberta |
| **VULN-004** | Bypass de Validação Zod em Modo Agregado (`fetchVagasMultiplosSlugs`) | **Média (5.3)** | OWASP A08 / CWE-20 | `src/services/solides.ts:48-50,91-98` | Aberta |
| **VULN-005** | Possível Poluição de Protótipo em Merge de Histórico de Mercado | **Média (5.3)** | OWASP A03 / CWE-1321 | `src/utils/mercadoAnalytics.ts:217` | Aberta |
| **VULN-006** | Ausência de CSP e Cabeçalhos de Segurança HTTP (Vercel & Docker Nginx) | **Alta (8.2)** | OWASP A05 / CWE-1021, CWE-693 | `Dockerfile`, ausência de `nginx.conf` e `vercel.json` | Aberta |
| **VULN-007** | Execução de Container Docker com Privilégios de Root e Imagens Sem Digest | **Média (5.9)** | OWASP A05 / CWE-250 | `Dockerfile:4,23`, `.dockerignore` | Aberta |
| **VULN-008** | Dependências com Vulnerabilidades de Severidade Alta/Moderada | **Alta (8.6)** | OWASP A06 / CWE-1395 | `package.json`, `package-lock.json` | Aberta |
| **VULN-009** | Workflow de CI com Permissões Excessivas e Actions Sem Pinning por SHA | **Média (7.5)** | OWASP A08 / CWE-829 | `.github/workflows/ci.yml:1-35` | Aberta |
| **VULN-010** | Polling de 5min sem `AbortController` e Efeitos Colaterais com Timer | **Média (5.3)** | OWASP A04 / CWE-400 | `src/hooks/useVagas.ts:87-151,161-174` | Aberta |
| **VULN-011** | Ausência de Validação de Protocolo em URLs Externas e Logos (`javascript:`) | **Baixa (4.3)** | OWASP A03 / CWE-20, CWE-79 | `src/components/VagaDetalhesModal.tsx:69`, `EventoCard.tsx:123`, `EventoDetalhesModal.tsx:113,171` | Aberta |
| **VULN-012** | Ausência de Error Boundary Global (Risco de DoS e Vazamento de Trace) | **Baixa (4.3)** | OWASP A04 / CWE-209 | `src/main.tsx:1-13` | Aberta |
| **VULN-013** | Exposição de Objetos Internos de Erro da API em Logs de Console | **Baixa (3.1)** | OWASP A09 / CWE-532 | `src/services/solides.ts:46,56,120` | Aberta |

---

## 6. Detalhamento Técnico das Vulnerabilidades Identificadas

### VULN-001: Cross-Site Scripting (XSS) via Descrição HTML Não Sanitizada
- **Severidade:** Crítica — CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N (Score: 9.3)
- **Categoria:** OWASP A03:2021 (Injection) / CWE-79
- **Local:** [`src/components/VagaDetalhesModal.tsx:155`](file:///c:/DEV/garimpo-dev/src/components/VagaDetalhesModal.tsx#L155)
- **Como Explorar (PoC Local):**
  1. No console do desenvolvedor em `http://localhost:5173`, simular uma resposta injetada no cache offline:
     ```javascript
     const cache = JSON.parse(localStorage.getItem('garimpo_dev_cache_vagas') || '{"vagas":[], "timestamp": Date.now()}');
     cache.vagas = [{
       id: 999999,
       title: "Vaga XSS PoC",
       slug: "portodigital",
       description: "<p>Parabéns!</p><img src=x onerror=\"alert('XSS Executado! Domínio: ' + document.domain)\">",
       createdAt: new Date().toISOString(),
       salary: { showRangeToApplicant: false, finalRange: 0 }
     }];
     localStorage.setItem('garimpo_dev_cache_vagas', JSON.stringify(cache));
     location.reload();
     ```
  2. Clique no card "Vaga XSS PoC" para abrir o modal de detalhes.
  3. O navegador renderiza o HTML e executa imediatamente o manipulador `onerror`, disparando o alerta com o domínio da aplicação.
- **Impacto:** Execução de scripts arbitrários no contexto de segurança da origem da vítima, extração de dados do `localStorage` (candidaturas, anotações de currículo, favoritos), defacement de interface e falsificação de ações em nome do usuário.
- **Correção Proposta:** Adicionar biblioteca `DOMPurify` com bundle enxuto; sanitizar `vaga.description` antes de atribuir a `dangerouslySetInnerHTML`, limitando tags a uma allowlist estrita (`p`, `strong`, `em`, `ul`, `ol`, `li`, `br`) e atributos permitidos nulos.
- **Teste de Regressão:** Suíte de testes em Vitest injetando múltiplos vetores (`<script>`, `<img onerror>`, `<svg onload>`, `<iframe src>`, `<a href="javascript:...">`) e confirmando a eliminação de payloads executáveis.
- **Status:** Aberta (Agendada para Sprint 1)

---

### VULN-002: Open Redirect e Spoofing de Domínio em `buildVagaUrl`
- **Severidade:** Média — CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N (Score: 6.1)
- **Categoria:** OWASP A01:2021 (Broken Access Control) / CWE-601
- **Local:** [`src/utils/formatters.ts:82-85`](file:///c:/DEV/garimpo-dev/src/utils/formatters.ts#L82-L85)
- **Como Explorar (PoC Local):**
  1. A API externa retorna uma vaga com campo `slug: "malicious-phishing.com#"`.
  2. A função executa: `https://${slug}.vagas.solides.com.br/vaga/${id}`.
  3. A URL resultante é: `https://malicious-phishing.com#.vagas.solides.com.br/vaga/123`.
  4. Ao clicar no link do card ou no botão de candidatura, o navegador interpreta `#` como delimitador de fragmento de URI e navega diretamente para `https://malicious-phishing.com/`, evadindo o host pretendido.
- **Impacto:** Redirecionamento aberto do usuário para portais de phishing fraudulentos imitando a interface de candidatura da Sólides/Porto Digital para roubo de dados cadastrais.
- **Correção Proposta:** Validar o `slug` com regex estrita alfanumérica (`/^[a-zA-Z0-9_-]+$/`). Caso inválido, fazer fallback seguro para `portodigital`. Validar que `id` seja inteiro positivo.
- **Teste de Regressão:** Teste em `formatters.test.ts` passando caracteres especiais, fragmentos, query strings e quebras de caminho para `buildVagaUrl`.
- **Status:** Aberta (Agendada para Sprint 2)

---

### VULN-003: Ausência de Validação de Schema (Zod) na Deserialização de `localStorage`
- **Severidade:** Média — CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:H (Score: 6.5)
- **Categoria:** OWASP A08:2021 (Software and Data Integrity Failures) / CWE-502
- **Local:** [`src/hooks/useCandidaturas.ts:18`](file:///c:/DEV/garimpo-dev/src/hooks/useCandidaturas.ts#L18), [`src/hooks/useFavoritos.ts:17`](file:///c:/DEV/garimpo-dev/src/hooks/useFavoritos.ts#L17), [`src/hooks/useVagas.ts:55`](file:///c:/DEV/garimpo-dev/src/hooks/useVagas.ts#L55), [`src/utils/mercadoAnalytics.ts:213,240`](file:///c:/DEV/garimpo-dev/src/utils/mercadoAnalytics.ts#L213)
- **Como Explorar (PoC Local):**
  1. Injetar objeto inválido no console: `localStorage.setItem('garimpo_dev_candidaturas', '{"abc": "nao_sou_objeto"}')`.
  2. Acessar a aba "Minhas Candidaturas".
  3. A aplicação falha ao tentar invocar métodos de array ou propriedades de status inexistentes, travando a renderização do componente.
- **Impacto:** Corrupção persistente do estado local, negação de serviço da aplicação para o usuário exigindo limpeza manual de dados de navegação.
- **Correção Proposta:** Criar schemas Zod dedicados para dados lidos de `localStorage`. Se a validação falhar, descartar e resetar para o estado inicial seguro.
- **Teste de Regressão:** Testes automatizados em Vitest nos hooks verificando recuperação automática e descarte de dados corrompidos.
- **Status:** Aberta (Agendada para Sprint 2)

---

### VULN-006: Ausência de Content-Security-Policy (CSP) e Cabeçalhos de Segurança HTTP
- **Severidade:** Alta — CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N (Score: 8.2)
- **Categoria:** OWASP A05:2021 (Security Misconfiguration) / CWE-1021, CWE-693
- **Local:** [`Dockerfile`](file:///c:/DEV/garimpo-dev/Dockerfile), ausência de `nginx.conf`, ausência de `vercel.json`
- **Como Explorar (PoC Local):**
  1. Fazer requisição HTTP para o Nginx ou inspecionar cabeçalhos de resposta na Vercel:
     `curl -i http://localhost:8080/`
  2. Verificar ausência total de `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`.
  3. Criar uma página HTML local com `<iframe src="http://localhost:8080/"></iframe>`. O Garimpo Dev é carregado dentro do iframe sem restrições.
- **Impacto:** Permite ataques de Clickjacking, incorporação indevida da plataforma em sites terceiros, e ausência de segunda camada de defesa (defense-in-depth) contra injeções XSS.
- **Correção Proposta:** Criar arquivo `vercel.json` com bloco de headers e criar configuração personalizada do Nginx (`nginx.conf`) com CSP estrito, bloqueio de iframes (`frame-ancestors 'none'`), `X-Content-Type-Options: nosniff` e `server_tokens off`.
- **Teste de Regressão:** Script automatizado de validação de cabeçalhos HTTP que valida presença e sintaxe de cada header obrigatório.
- **Status:** Aberta (Agendada para Sprint 4)

---

### VULN-008: Dependências com Vulnerabilidades de Severidade Alta/Moderada
- **Severidade:** Alta — CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:H (Score: 8.6)
- **Categoria:** OWASP A06:2021 (Vulnerable and Outdated Components) / CWE-1395
- **Local:** [`package.json`](file:///c:/DEV/garimpo-dev/package.json), [`package-lock.json`](file:///c:/DEV/garimpo-dev/package-lock.json)
- **Como Explorar (PoC Local):**
  1. Executar `npm audit`.
  2. 8 vulnerabilidades detectadas (GHSA-mrhx-c7xc-m3w5 no Zod permitindo DoS de exaustão de memória; GHSA-698v-4r3x-3vcv no Vite permitindo execução de código e bypass em ambiente Windows; vulnerabilidades no Undici e follow-redirects).
- **Impacto:** Suscetibilidade a travamentos de memória por coleções superdimensionadas (DoS) e exploração de falhas em ambiente de desenvolvimento e build.
- **Correção Proposta:** Atualizar `zod` para `>=4.6.7`, `vite` para `>=8.3.5`, e resolver vulnerabilidades transitivas com `npm audit fix` mantendo o lockfile íntegro.
- **Teste de Regressão:** `npm audit --audit-level=high` com 0 vulnerabilidades.
- **Status:** Aberta (Agendada para Sprint 5)

---

## 7. Próximos Passos & Planejamento das Sprints

- **Sprint 1 (Prioridade Máxima):** Sanitização de HTML com DOMPurify em `VagaDetalhesModal.tsx`, neutralização de payloads XSS e testes de injeção.
- **Sprint 2:** Integridade de dados no `localStorage` via Zod, proteção contra Prototype Pollution, limites de tamanho e validação segura de `buildVagaUrl`.
- **Sprint 3:** Blindagem de links externos (`rel="noopener noreferrer"`), allowlist de esquemas (`https:`), auditoria de impressão `@media print` e compartilhamento.
- **Sprint 4:** Cabeçalhos de segurança HTTP (CSP estrito, HSTS, X-Frame-Options) via `vercel.json` e `nginx.conf` hardening.
- **Sprint 5:** Hardening do container Docker (usuário não-root `nginx-unprivileged`, digests SHA256) e atualização de dependências com `npm audit` zerado.
- **Sprint 6:** Hardening de CI/CD (GitHub Actions com `permissions: contents: read`, pinning por SHA, CodeQL e Dependabot).
- **Sprint 7:** Resiliência e mitigação de abuso no polling de 5 minutos (`AbortController`, timeout de 10s, limites de requisição) e Error Boundary global.
- **Sprint 8:** Verificação final, re-execução de toda a suíte de testes e atualização dos ADRs no `diarioTecnico.ts` e README.
