# 🛡️ Relatório de Auditoria de Segurança de Aplicação (AppSec)
**Projeto:** Garimpo Dev (v2.5 Full)  
**Repositório:** `jonasferreira-silva1/garimpo-dev`  
**Stack Tecnológica:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Zod (100% Client-Side SPA)  
**Ambientes de Deploy:** Vercel (Edge CDN) & Imagem Docker (Nginx Alpine)  
**Pipeline CI/CD:** GitHub Actions (`ci.yml`)  
**Data da Auditoria Inicial:** 02 de Novembro de 2026  
**Status do Processo:** Sprint 0 — Baseline Consolidada & Calibrada pós-Revisão Técnica  

---

## 1. Sumário Executivo & Governança

O **Garimpo Dev** é uma Single Page Application (SPA) 100% client-side (*zero-backend*) desenvolvida em React 19, TypeScript e Tailwind CSS. A aplicação atua como radar de vagas de tecnologia e hub de eventos do Porto Digital e do ecossistema de Recife (PE). Toda a integração com o mercado é realizada consumindo diretamente o API Gateway público da plataforma Sólides via Axios (beneficiando-se de cabeçalhos CORS abertos), persistindo preferências, notas e candidaturas em `localStorage`, e gerando relatórios executivos em PDF nativo via `@media print`.

### 1.1 Modelo Arquitetural Zero-Backend e Superfície Real de Risco
Diferente de aplicações corporativas com servidores próprios, a arquitetura *zero-backend* do Garimpo Dev elimina por definição classes inteiras de ataques tradicionais:
- **Sem Servidor de Aplicação Próprio:** Inexistência de ataques de SQL Injection em banco próprio, Server-Side Request Forgery (SSRF) em serviços internos ou Remote Code Execution (RCE) em runtime Node/Java/Python no backend.
- **Sem Sessão de Autenticação Centralizada:** A SPA não armazena cookies de sessão `HttpOnly`, tokens de acesso corporativo JWT, senhas de banco ou dados bancários de usuários.
- **Superfície Exposta no Navegador:** O que está em risco no contexto client-side são:
  1. A integridade e privacidade dos dados salvos no `localStorage` da máquina do usuário (candidaturas, status no funil, notas livres de entrevista e vagas favoritadas);
  2. A integridade visual da interface contra defacement ou engenharia social (phishing);
  3. A confiabilidade do redirecionamento para o formulário de candidatura legítimo da empresa.

### 1.2 Calibragem Metodológica dos Apontamentos
Para evitar inflar métricas de segurança e manter a transparência exigida por padrões de engenharia sênior (OWASP ASVS e CVSS 3.1 oficial do FIRST), esta auditoria separa formalmente os **13 apontamentos identificados** em quatro categorias claras:
- **Vulnerabilidades de Segurança Reais / Exploráveis (2 achados):** Falhas em que um agente externo malicioso pode induzir a execução de scripts ou desviar o tráfego do usuário (`VULN-001`, `VULN-002`).
- **Defesa em Profundidade & Hardening de Infra/CI/URLs (4 achados):** Controles defensivos ausentes que mitigam o raio de explosão de ataques secundários e bloqueiam esquemas inseguros de URL (`VULN-006`, `VULN-007`, `VULN-009`, `VULN-011`).
- **Robustez de Software & Integridade de Dados (3 achados):** Validação de tipos em runtime e tratamento contra dados malformados de APIs ou storage local (`VULN-003`, `VULN-004`, `VULN-005` — este último reclassificado como falso positivo mitigado por design).
- **Resiliência de Interface & Higiene Operacional (4 achados):** Prevenção de degradação de performance, controle de ciclo de vida de timers, mitigação de vulnerabilidades em dependências e limpeza de logs (`VULN-008`, `VULN-010`, `VULN-012`, `VULN-013`).

---

## 2. Threat Model (STRIDE) Calibrado & Limites de Confiança

A modelagem de ameaças adotou a metodologia **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) considerando as fronteiras de confiança do frontend:

```
[ Usuário / Navegador Local ]
         │
         ├─── (Query String: ?aba=) ───────────────────────────────┐
         │                                                         │
         ├─── (Entradas Livres: Busca, Filtros, Notas Candidatura) ───┤
         │                                                         ▼
         ├─── (Armazenamento Local) ───► [ LocalStorage (Não Confiável) ]
         │                                       │
         ▼                                       ▼
  [ Garimpo Dev SPA (React 19 / DOM) ] ◄─────────┘
         │               ▲
         │ (HTTP GET)    │ (Payloads JSON com HTML bruto de terceiros)
         ▼               │
  [ Gateway API Sólides (Terceiro Não Confiável) ]
         │
         ▼
  [ Links Externos / Redirecionamentos: *.vagas.solides.com.br, mapas, eventos ]
```

### 2.1 Matriz de Ameaças STRIDE Calibrada

| Ameaça (STRIDE) | Componente Afetado | Vetor / Cenário Real de Ataque | Categoria | Severidade Real | Mitigação no Garimpo Dev |
|---|---|---|---|---|---|
| **Elevation of Privilege** (Injeção / XSS) | `VagaDetalhesModal.tsx` (`dangerouslySetInnerHTML`) | Empresa maliciosa publica vaga com descrição HTML adulterada na plataforma Sólides (ou falha de sanitização no gateway). Ao abrir o modal, scripts injetados executam na origem da vítima. | Vulnerabilidade | **Média/Alta (CVSS 6.1 a 7.1)** | Sanitização estrita com `DOMPurify` aceitando tags estruturais reais (`h1-h6`, `p`, `b`, `i`, `strong`, `em`, `ul`, `ol`, `li`, `br`, `div`, `span`, `blockquote`, `code`, `pre`, `a`). Atributos permitidos SOMENTE `href`, `target`, `rel`. Proibição explícita de `class` (evitando phishing via Tailwind com `fixed inset-0 z-50 bg-white`) e `style`. |
| **Spoofing** (Falsificação de Destino) | `buildVagaUrl` em `formatters.ts` | Campo `slug` contendo caracteres de fragmento (`#`) ou autenticação em URL (`@`) desviando o host `.vagas.solides.com.br` para portal de phishing externo. | Vulnerabilidade | **Média (CVSS 5.4)** | Validação estrita de `slug` por regex (`/^[a-zA-Z0-9_-]+$/`) e `id` inteiro positivo (> 0). Caso inválido, não renderizar o link (evitando fallback que envie para vaga arbitrária). |
| **Information Disclosure / Hardening** (Esquema de URL) | Links Externos e `VagaDetalhesModal.tsx` | URLs com protocolos arbitrários (`javascript:`, `data:`). Grep confirma que nenhum `<a href>` recebe URLs dinâmicas cruas da API (links de vaga usam `buildVagaUrl` e eventos são estáticos). | Hardening / Defesa em Profundidade | **Média (CVSS 4.3)** | Validação defensiva de protocolo em `<a>` (apenas `https:` e `mailto:`), `referrerpolicy="no-referrer"` em imagens e cabeçalhos de segurança. |
| **Tampering** (Adulteração de Estado) | `localStorage` (cache, candidaturas, favoritos, histórico) | Manipulação direta do storage por extensões do navegador ou XSS local injetando tipos incompatíveis. | Robustez de Dados | **Média (CVSS 4.4)** | Schemas Zod em runtime na leitura do `localStorage` com recuperação graciosa e descarte defensivo. |
| **Denial of Service** (Esgotamento de Recursos) | `useVagas` (Polling de 5min) | Requisições concorrentes acumuladas em conexões instáveis sem cancelamento. | Resiliência | **Informativa / Baixa (CVSS 2.9)** | Integração de `AbortController` com timeout de 10s no Axios e cancelamento ativo no cleanup do `useEffect`. |
| **Information Disclosure** (Vazamento Operacional) | Logs de console em `solides.ts` | `console.error` expondo stack traces de requisições de rede. | Higiene | **Baixa (CVSS 4.0)** | Supressão de logs em produção (`if (import.meta.env.DEV)`). |

### 2.2 Controles Verificados e Seguros (Negative Security Testing)
A auditoria inspecionou diretamente os arquivos e linhas do código-fonte onde salvaguardas nativas da arquitetura estão ativas:
1. **Parâmetro de Navegação `?aba=` ([`src/App.tsx:41-50`](file:///c:/DEV/garimpo-dev/src/App.tsx#L41-L50)):**
   - *Verificação no Código:* O valor lido de `URLSearchParams` é testado explicitamente contra a allowlist `'mercado' | 'eventos' | 'candidaturas' | 'vagas'` (linha 45). Se o parâmetro for nulo, inválido ou adulterado, o fallback seguro para a aba padrão `'vagas'` é retornado na linha 49. Sem injeção dinâmica de componentes nem avaliação insegura (`eval`).
2. **Inputs Livres do Usuário (Busca, Filtros e Anotações de Candidatura):**
   - *Verificação no Código:* O campo de busca em [`src/components/FiltroBar.tsx:51-57`](file:///c:/DEV/garimpo-dev/src/components/FiltroBar.tsx#L51-L57) opera como input controlado via React (`value={filtros.busca}`). As anotações livres em [`src/components/StatusSelector.tsx:28, 86, 114`](file:///c:/DEV/garimpo-dev/src/components/StatusSelector.tsx#L28) e [`src/components/CandidaturasView.tsx:142`](file:///c:/DEV/garimpo-dev/src/components/CandidaturasView.tsx#L142) são inseridas no DOM estritamente como nós de texto em interpolações JSX (`{candidatura.observacoes}` / `{item.observacoes}`), acionando o escaping nativo de entidades HTML do React 19 contra injeção de tags.
3. **Inspeção de ReDoS em [`src/utils/mercadoAnalytics.ts:20-36`](file:///c:/DEV/garimpo-dev/src/utils/mercadoAnalytics.ts#L20-L36) (`DEFINICOES_STACKS`):**
   - *Verificação no Código:* Todas as 15 expressões regulares foram inspecionadas no arquivo-fonte. Nenhum quantificador aninhado foi encontrado na inspeção estática (ausência de construções como `(a+)+` ou repetições sobrepostas suscetíveis a backtracking catastrófico). O único quantificador repetitivo presente é `\s*` em `\bio\s*s\b` (linha 34), o qual opera delimitado por fronteiras de palavra (`\b`) com complexidade estritamente linear.

---

## 3. Mapeamento de Superfície de Ataque

### 3.1 Entradas (Input Vectors)
1. **API Gateway Sólides (`https://apigw.solides.com.br/jobs/v3/home/vacancy`):**
   - *Campos:* `description` (HTML rico vindo de editor de terceiros), `title`, `companyName`, `companyLogo`, `slug`, `redirectLink`, `salary`, `city`, `state`, `benefits`.
   - *Fronteira:* Terceiro não autenticado. Campo `description` constitui o vetor mais crítico por ser renderizado diretamente no DOM.
2. **Parâmetros de URL (Query String):**
   - Parâmetro `?aba=` lido na inicialização e sincronizado com o histórico do navegador.
3. **Persistência Local (`localStorage`):**
   - Chaves: `garimpo_dev_candidaturas`, `garimpo_dev_favoritos`, `garimpo_dev_cache_vagas`, `garimpo_dev_historico_mercado`.
   - *Fronteira:* Armazenamento em texto plano sob controle do cliente local.
4. **Campos Livres do Usuário:**
   - Input de anotações da candidatura em `StatusSelector.tsx` (`tempObs`).
   - Inputs de busca em `FiltroBar.tsx` e `FiltroEventos.tsx`.

### 3.2 Saídas (Output Vectors) & Riscos Colaterais
1. **Renderização no DOM:**
   - Inserção direta de HTML em `VagaDetalhesModal.tsx:155` via `dangerouslySetInnerHTML`.
   - Tags de imagem (`<img src={vaga.companyLogo}>`): risco de rastreamento de IP/Referrer por terceiros.
2. **Navegação Externa:**
   - Links com `target="_blank"` em cards de vagas e eventos. Necessidade estrita de `rel="noopener noreferrer"`.
3. **Exportação & Impressão:**
   - Visualização de impressão `@media print` (`RelatorioModal.tsx` e `RelatorioView.tsx`) acionada via `window.print()`.

---

## 4. Baseline de Métricas de Segurança (Sprint 0)

| Métrica / Ferramenta | Estado Inicial (Sprint 0) | Meta de Blindagem (Sprint 8) | Status Atual |
|---|---|---|---|
| **npm audit** | 8 vulnerabilidades (3 Moderate, 5 High) | 0 vulnerabilidades em dependências de produção | ⚠️ 8 Avisos |
| **npm outdated** | Minor/patch desatualizados (`zod`, `vite`, `axios`) | Dependências críticas atualizadas sem breaking changes | ⚠️ Desatualizado |
| **npm run lint (Oxlint)** | 0 erros, 2 avisos (`purity` em `CacheBanner` e `setState` em `useVagas`) | 0 erros, 0 avisos em toda a base | ⚠️ 2 Avisos |
| **npm run test (Vitest)** | 19 arquivos, 66 testes passando | 100% testes passando + suíte de regressão de segurança | ✅ 66 Passando |
| **npm run build (Vite)** | Build OK (0.47 kB HTML, 56.32 kB CSS, 494.71 kB JS) | Build com tipos estritos e bundle otimizado | ✅ Build OK |
| **Secrets no Histórico Git** | 0 chaves, senhas ou tokens encontrados nos commits | 0 segredos + CI com verificação automática | ✅ Limpo |
| **Content Security Policy (CSP)** | Inexistente (sem `vercel.json` nem `nginx.conf` seguro) | CSP Estrito em `Report-Only` migrado para `Enforce` | ❌ Inexistente |
| **Permissões no GitHub Actions** | Permissões padrão do repositório (sem restrição explícita) | `permissions: contents: read` + actions fixadas por SHA | ⚠️ Sem restrição |
| **Container Docker** | Roda como `root` (UID 0), porta 80 | Usuário `nginx-unprivileged` (UID 101), porta 8080 | ⚠️ Root (Porta 80) |

---

## 5. Tabela Consolidada de Achados (Categorizada & Calibrada FIRST CVSS 3.1)

> **Nota Metodológica de Calibração:** Todos os vetores e pontuações foram gerados e verificados de acordo com a calculadora oficial **FIRST CVSS v3.1** (`first.org/cvss/calculator/3.1`), refletindo a ausência de autenticação centralizada e a natureza client-side da SPA.

### Grupo A: Vulnerabilidades de Segurança Exploráveis
| ID | Título | Severidade Real (CVSS 3.1) | Vetor Oficial FIRST CVSS 3.1 | CWE | Localização | Status |
|---|---|---|---|---|---|---|
| **VULN-001** | Cross-Site Scripting (XSS) via Descrição HTML Não Sanitizada | **Média/Alta (6.1)** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N` | CWE-79 | `src/components/VagaDetalhesModal.tsx:155` | Aberta |
| **VULN-002** | Open Redirect e Spoofing de Domínio em `buildVagaUrl` | **Média (5.4)** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N` | CWE-601 | `src/utils/formatters.ts:82-85` | Aberta |

### Grupo B: Defesa em Profundidade & Hardening de Infra/CI/URLs
| ID | Título | Severidade Real (CVSS 3.1) | Vetor Oficial FIRST CVSS 3.1 | CWE | Localização | Status |
|---|---|---|---|---|---|---|
| **VULN-006** | Ausência de CSP e Cabeçalhos de Segurança HTTP (Vercel & Nginx) | **Média (4.2)** | `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N` | CWE-1021, CWE-693 | `Dockerfile`, ausência de `nginx.conf` e `vercel.json` | Aberta |
| **VULN-007** | Execução de Container Docker como Root (Porta 80 vs 8080) | **Média (4.5)** | `CVSS:3.1/AV:L/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:L` | CWE-250 | `Dockerfile:4,23`, `.dockerignore` | Aberta |
| **VULN-009** | Workflow de CI com Permissões Excessivas e Actions Sem SHA Pinning | **Média (4.2)** | `CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:N` | CWE-829 | `.github/workflows/ci.yml:1-35` | Aberta |
| **VULN-011** | Ausência de Validação de Protocolo em URLs Externas (`javascript:`) | **Média (4.3)** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N` | CWE-20, CWE-79 | `src/components/VagaDetalhesModal.tsx:182`, `EventoCard.tsx:123` | Aberta |

### Grupo C: Robustez de Software & Integridade de Dados
| ID | Título | Severidade Real (CVSS 3.1) | Vetor Oficial FIRST CVSS 3.1 | CWE | Localização | Status |
|---|---|---|---|---|---|---|
| **VULN-003** | Ausência de Schema Zod na Deserialização de `localStorage` | **Média (4.4)** | `CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:L` | CWE-20, CWE-1284 | `useCandidaturas.ts:18`, `useFavoritos.ts:17`, `useVagas.ts:55` | Aberta |
| **VULN-004** | Bypass de Validação Zod em Modo Agregado (`fetchVagasMultiplosSlugs`) | **Baixa (3.7)** | `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L` | CWE-20 | `src/services/solides.ts:48-50,91-98` | Aberta |
| **VULN-005** | Avaliação de Risco de Poluição de Protótipo em Histórico de Mercado | **Informativa (0.0)** | `N/A (Falso Positivo Mitigado por Design)` | CWE-1321 | `src/utils/mercadoAnalytics.ts:217` | Mitigada |

### Grupo D: Resiliência, UX e Higiene Operacional
| ID | Título | Severidade Real (CVSS 3.1) | Vetor Oficial FIRST CVSS 3.1 | CWE | Localização | Status |
|---|---|---|---|---|---|---|
| **VULN-008** | Dependências com Vulnerabilidades em Dev/Runtime (npm audit) | **Alta (7.5)** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H` *(Runtime Zod)* | CWE-1395 | `package.json`, `package-lock.json` | Aberta |
| **VULN-010** | Polling de 5min sem AbortController e Acúmulo de Requisições | **Informativa / Baixa (2.9)** | `CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L` | CWE-400 | `src/hooks/useVagas.ts:87-151,161-174` | Aberta |
| **VULN-012** | Ausência de Error Boundary Global (Tela Branca / Degradation) | **Informativa (2.9)** | `CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L` | CWE-209 | `src/main.tsx:1-13` | Aberta |
| **VULN-013** | Exposição de Objetos de Erro de Rede em Logs de Console | **Baixa (4.0)** | `CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N` | CWE-532 | `src/services/solides.ts:46,56,120` | Aberta |

---

## 6. Detalhamento Técnico Completo dos 13 Achados

### VULN-001: Cross-Site Scripting (XSS) via Descrição HTML Não Sanitizada
- **Classificação:** Vulnerabilidade de Segurança Explorável
- **Severidade Calibrada:** Média/Alta — `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N` (Score: **6.1**, ou **7.1** em cenário de phishing com adulteração visual ostensiva).
- **CWE / OWASP:** CWE-79 / OWASP A03:2021 (Injection)
- **Local:** [`src/components/VagaDetalhesModal.tsx:155`](file:///c:/DEV/garimpo-dev/src/components/VagaDetalhesModal.tsx#L155)
- **Vetor Real de Ataque:**  
  O vetor primário **não é a gravação direta no localStorage pelo próprio usuário** (o que constitui Self-XSS e não atinge vítimas terceiras). O vetor real é: Uma empresa anunciante ou agente malicioso cadastra uma oportunidade de emprego através do portal da Sólides inserindo tags HTML maliciosas ou manipuladores de eventos (`<img src=x onerror=...>`, `<svg onload=...>`, `<iframe src=...>`) no editor da descrição da vaga. Caso a API da Sólides falhe em sanitizar esse conteúdo em seu backend, ao carregar a vaga no Garimpo Dev a descrição em HTML cru é atribuída diretamente a `dangerouslySetInnerHTML`.
- **Como Reproduzir (Simulação Local via Storage Mock):**
  1. Abrir o DevTools em `http://localhost:5173` e simular uma vaga maliciosa retornada pela API e gravada em cache:
     ```javascript
     const cache = {
       timestamp: Date.now(),
       vagas: [{
         id: 999999,
         title: "Vaga XSS Demonstrativa",
         slug: "portodigital",
         description: "<p>Vaga Tech</p><img src=x onerror=\"alert('XSS Executado via Origin: ' + window.location.origin)\">",
         createdAt: new Date().toISOString(),
         salary: { showRangeToApplicant: false, finalRange: 0 }
       }]
     };
     localStorage.setItem('garimpo_dev_cache_vagas', JSON.stringify(cache));
     location.reload();
     ```
  2. Clicar no card da vaga para abrir o modal de detalhes.
  3. O manipulador `onerror` executa no contexto de segurança da origem da aplicação.
- **Impacto Real:** Execução de scripts sob o domínio da SPA, leitura e exfiltração do `localStorage` (candidaturas, anotações de entrevistas e vagas salvas), e adulteração visual dos cards (defacement).
- **Correção Proposta:**
  - Instalar `dompurify` (e `@types/dompurify`).
  - Configurar allowlist abrangente e realista que suporte as formatações legítimas de vagas:
    - *Tags Permitidas:* `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `b`, `i`, `strong`, `em`, `ul`, `ol`, `li`, `br`, `div`, `span`, `blockquote`, `code`, `pre`, `a`.
    - *Atributos Permitidos:* SOMENTE `href`, `target`, `rel`. Proibição estrita de `class`, `style`, `id` e `data-*` (impedindo ataques de phishing e defacement visual via Tailwind CSS, como a injeção de classes `fixed inset-0 z-50 bg-white` que cobrem a tela com um falso formulário sem precisar de JavaScript).
    - *Hook Obrigatório:* Sanitizar tags `<a>` mantendo `href` apenas se iniciar por `https://` (ou `mailto:`), descartando o atributo em caso contrário; forçar `target="_blank"` e `rel="noopener noreferrer"`.
- **Teste de Regressão:** Suíte Vitest com bateria de vetores maliciosos (`<script>`, `<img onerror>`, `<svg onload>`, `<a href="javascript:alert(1)">`, `<div class="fixed inset-0 ...">`, `<div style="...">`) garantindo que nenhum manipulador, estilo ou classe maliciosa sobreviva.
- **Status:** Aberta (Agendada para Sprint 1)

---

### VULN-002: Open Redirect e Spoofing de Domínio em `buildVagaUrl`
- **Classificação:** Vulnerabilidade de Segurança Explorável
- **Severidade Calibrada:** Média — `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N` (Score: **5.4**)
- **CWE / OWASP:** CWE-601 / OWASP A01:2021 (Broken Access Control)
- **Local:** [`src/utils/formatters.ts:82-85`](file:///c:/DEV/garimpo-dev/src/utils/formatters.ts#L82-L85)
- **Vetor de Ataque:**  
  A função `buildVagaUrl(slug, id)` concatena cegamente o `slug` no modelo `https://${slug}.vagas.solides.com.br/vaga/${id}`. Se um slug vier adulterado da API externa contendo um fragmento (`malicious.com#`), o navegador interpreta o caractere `#` como início do hash da URI e navega diretamente para `https://malicious.com/`, rompendo a restrição de domínio pretendida.
- **Como Reproduzir (PoC Local):**
  ```typescript
  import { buildVagaUrl } from '../utils/formatters';
  // Simula payload com caractere de hash quebrando o host
  const url = buildVagaUrl('phishing-login.com#', 12345);
  // Retorna: "https://phishing-login.com#.vagas.solides.com.br/vaga/12345"
  // Ao clicar, o navegador resolve o host como "phishing-login.com"
  ```
- **Impacto:** Conduzir candidatos para páginas falsas de login ou formulários fraudulentos de captura de documentos.
- **Correção Proposta:**
  - Validar estritamente o `slug` com regex alfanumérica: `/^[a-zA-Z0-9_-]+$/`.
  - Validar que o `id` seja um número inteiro positivo (`Number.isInteger(id) && id > 0`).
  - **Ajuste Crítico de Negócio:** **Não fazer fallback cego para `portodigital`** quando os parâmetros forem inválidos, pois isso direciona o usuário a uma vaga inexistente ou errada. Caso a validação falhe, retornar `null` (ou string vazia) e ocultar ou desabilitar o link de candidatura na interface.
- **Teste de Regressão:** Teste unitário em `formatters.test.ts` cobrindo entradas patológicas (`phishing.com#`, `evil.com@`, `../`, slugs com espaços e IDs negativos/decimais).
- **Status:** Aberta (Agendada para Sprint 4)

---

### VULN-003: Ausência de Schema Zod na Deserialização de `localStorage`
- **Classificação:** Robustez de Software & Integridade de Dados (Não é RCE)
- **Severidade Calibrada:** Média — `CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:L` (Score: **4.4**)
- **CWE / OWASP:** CWE-20, CWE-1284 (Improper Input Validation) / OWASP A08:2021
- **Local:** [`src/hooks/useCandidaturas.ts:18`](file:///c:/DEV/garimpo-dev/src/hooks/useCandidaturas.ts#L18), [`src/hooks/useFavoritos.ts:17`](file:///c:/DEV/garimpo-dev/src/hooks/useFavoritos.ts#L17), [`src/hooks/useVagas.ts:55`](file:///c:/DEV/garimpo-dev/src/hooks/useVagas.ts#L55)
- **Análise Técnica sobre Desserialização:**  
  *Nota sobre CWE-502:* CWE-502 refere-se à desserialização insegura onde o deserializador instancia classes ou executa código (ex: Java `readObject`, Python `pickle`, PHP `unserialize`). No JavaScript, `JSON.parse` cria estruturas primitivas planas em memória e não instancia funções. O risco real é a **adulteração de formato** (Self-DoS de interface), que quebra a aplicação caso os dados não sigam o schema esperado.
- **Como Reproduzir:**
  ```javascript
  localStorage.setItem('garimpo_dev_candidaturas', JSON.stringify({ corrompido: true }));
  location.reload();
  // A aba 'Minhas Candidaturas' quebra ao tentar executar métodos de array (.filter, .map)
  ```
- **Impacto:** Negação de serviço local ao usuário, exigindo limpeza manual do storage do navegador.
- **Correção Proposta:** Criar schemas Zod estritos para `candidaturas`, `favoritos` e `cache_vagas`. Se o parse falhar, registrar aviso defensivo no console de desenvolvimento, descartar os dados malformados e inicializar o estado com array/objeto vazio seguro.
- **Status:** Aberta (Agendada para Sprint 5)

---

### VULN-004: Bypass de Validação Zod em Modo Agregado (`fetchVagasMultiplosSlugs`)
- **Classificação:** Robustez de Software & Integridade de Integração
- **Severidade Calibrada:** Baixa — `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L` (Score: **3.7**)
- **CWE / OWASP:** CWE-20 / OWASP A08:2021
- **Local:** [`src/services/solides.ts:48-50, 91-98`](file:///c:/DEV/garimpo-dev/src/services/solides.ts#L48-L50)
- **Análise Técnica:**  
  Enquanto a função `fetchVagasSolides` aplica `solidesResponseSchema.safeParse`, a função agregada `fetchVagasMultiplosSlugs` (responsável por consultar múltiplos slugs em paralelo com `Promise.allSettled`) consome diretamente `res.value.data.data.data` sem submeter as respostas individuais ao schema Zod. Se uma empresa retornar propriedades ausentes ou em tipos incompatíveis, erros de runtime podem ocorrer silenciosamente durante a renderização.
- **Correção Proposta:** Aplicar validação de schema Zod em cada resultado resolvido de `Promise.allSettled` antes de extrair e concatenar as vagas no array final.
- **Status:** Aberta (Agendada para Sprint 4)

---

### VULN-005: Avaliação de Risco de Poluição de Protótipo em Histórico de Mercado
- **Classificação:** Falso Positivo Mitigado por Design (Higiene Defensiva)
- **Severidade Calibrada:** Informativa — Score: **0.0**
- **CWE / OWASP:** CWE-1321 (Prototype Pollution)
- **Local:** [`src/utils/mercadoAnalytics.ts:217`](file:///c:/DEV/garimpo-dev/src/utils/mercadoAnalytics.ts#L217)
- **Análise Técnica Detalhada:**  
  A linha 217 de `src/utils/mercadoAnalytics.ts` executa `mapa[snapshot.data] = snapshot`. Uma análise preliminar levantou suspeita de Prototype Pollution. No entanto, avaliando o fluxo real de execução:
  1. O histórico é lido de `localStorage.getItem(HISTORICO_CACHE_KEY)` (linha 209-213) e desserializado com `JSON.parse`. Como o storage local é controlável pelo usuário no navegador via DevTools, a entrada não é inviolável;
  2. Contudo, em JavaScript moderno, a atribuição `mapa['__proto__'] = snapshot` em um objeto literal comum (`mapa = {}`) apenas sobrescreve o protótipo daquela instância específica ou cria uma propriedade própria, **não poluindo o `Object.prototype` global** do runtime;
  3. Não ocorrem operações de mesclagem recursiva profunda (`deepmerge`) nem cópias de chaves sem sanitização.
  Portanto, **não há poluição global de protótipo ativa**.
- **Ação Recomendada (Higiene Defensiva):** Utilizar `Map` tipado ou objeto sem protótipo (`Object.create(null)`), ou validar previamente se `snapshot.data` não coincide com propriedades reservadas (`__proto__`, `constructor`, `prototype`) antes da atribuição.
- **Status:** Mitigada / Falso Positivo Documentado (Sprint 5)

---

### VULN-006: Ausência de CSP e Cabeçalhos de Segurança HTTP (Vercel & Docker Nginx)
- **Classificação:** Defesa em Profundidade & Hardening de Infraestrutura
- **Severidade Calibrada:** Média — `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N` (Score: **4.2**)
- **CWE / OWASP:** CWE-1021, CWE-693 / OWASP A05:2021 (Security Misconfiguration)
- **Local:** [`Dockerfile`](file:///c:/DEV/garimpo-dev/Dockerfile), ausência de `nginx.conf`, ausência de `vercel.json`
- **Análise Técnica & Ajustes Práticos:**  
  A ausência de cabeçalhos não é uma vulnerabilidade explorável por si só, mas retira a segunda linha de defesa (defense-in-depth) contra XSS e incorporação em iframes (clickjacking). Para uma SPA client-side integrada com APIs externas, a CSP precisa ser desenhada com atenção para não quebrar a aplicação:
  - `img-src`: Deve autorizar `'self'`, `data:`, `blob:` e os domínios de logos reais das empresas (`https://*.solides.com.br`, `https://*.solides.com`, `https://apigw.solides.com.br`);
  - `connect-src`: Restrito a `'self'` e `https://apigw.solides.com.br`;
  - `style-src`: Necessita de `'unsafe-inline'` para acomodar estilos dinâmicos do Tailwind v4 e React (`style={{ display: 'none' }}`);
  - `frame-ancestors`: `'none'` (substituindo o obsoleto `X-Frame-Options: DENY`);
  - *HSTS:* Ambientes Vercel já gerenciam `Strict-Transport-Security` automaticamente no Edge; verificar via `curl -I` para evitar cabeçalhos duplicados conflitantes.
- **Estratégia de Implementação:** Iniciar em modo `Content-Security-Policy-Report-Only` para homologação em staging e, após validação sem falsos bloqueios, comutar para bloqueio estrito (`enforce`).
- **Status:** Aberta (Agendada para Sprint 3)

---

### VULN-007: Execução de Container Docker como Root (Porta 80 vs 8080)
- **Classificação:** Hardening de Infraestrutura & Supply Chain
- **Severidade Calibrada:** Média — `CVSS:3.1/AV:L/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:L` (Score: **4.5**)
- **CWE / OWASP:** CWE-250 / OWASP A05:2021
- **Local:** [`Dockerfile:4,23`](file:///c:/DEV/garimpo-dev/Dockerfile#L4), `.dockerignore`
- **Ponto Crítico de Configuração:**  
  Ao migrar da imagem padrão `nginx:alpine` (que roda como `root` e escuta na porta 80) para a imagem endurecida `nginxinc/nginx-unprivileged:alpine` (que executa sob o usuário `nginx` não-privilegiado UID 101), **a porta padrão de escuta muda obrigatoriamente para a 8080** (uma vez que processos não-root no Linux não podem se vincular a portas inferiores a 1024).
- **Correção Proposta:**
  - Atualizar imagem base no Dockerfile para `nginxinc/nginx-unprivileged:1.27-alpine`;
  - Modificar `EXPOSE 80` para `EXPOSE 8080`;
  - Criar `nginx.conf` configurado com `listen 8080;` e `server_tokens off;`;
  - Atualizar o `README.md` e comandos operacionais para `docker run -p 8080:8080 garimpo-dev`.
- **Status:** Aberta (Agendada para Sprint 6)

---

### VULN-008: Dependências com Vulnerabilidades em Dev/Runtime (npm audit)
- **Classificação:** Supply Chain & Higiene de Dependências
- **Severidade Calibrada:** Alta (Runtime Zod) — `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H` (Score: **7.5**, advisory `GHSA-mrhx-c7xc-m3w5`)
- **CWE / OWASP:** CWE-1395 / OWASP A06:2021
- **Local:** [`package.json`](file:///c:/DEV/garimpo-dev/package.json), [`package-lock.json`](file:///c:/DEV/garimpo-dev/package-lock.json)
- **Classificação por Escopo Real de Execução:**  
  O comando `npm audit` reporta 8 advisories. É fundamental segregar com rigor técnico o escopo que atinge o cliente final daquele restrito a ferramentas de desenvolvimento/CI:
  1. **Dependência de Produção / Runtime no Navegador (Score 7.5):**
     - `zod` (<4.6.6): Advisory `GHSA-mrhx-c7xc-m3w5` (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H` — Score **7.5**). Exaustão de memória ao validar coleções não limitadas. Afeta o runtime client-side. Corrigível com upgrade para `>=4.6.7` via `npm audit fix`.
  2. **Dependência Transitiva de Node.js (Não Empacotada no Navegador):**
     - `follow-redirects` (`GHSA-q3jh-wrc6-jgq8`, `GHSA-8r9p-f939-6h3c`): Dependência de Node.js do Axios. Em compilações Vite para browser, o Axios utiliza adapters nativos do navegador (`fetch`/`XMLHttpRequest`), não inserindo `follow-redirects` no bundle final.
  3. **Ferramentas de Desenvolvimento, Teste e Build (Escopo Dev/CI — Não Presentes em Produção):**
     - `vite` (`GHSA-698v-4r3x-3vcv`, `GHSA-587h-7wmj-h5pm`): Dev server local no Windows e bypass de middleware em dev (Scores 5.3 a 7.5 restritos ao ambiente de dev);
     - `@vitest/mocker` / `vitest` (`GHSA-qxg6-89mg-rqv8`, `GHSA-xp26-3454-mjgp`): Injeção em mocks manuais em ambiente de teste;
     - `undici` (`GHSA-4qv8-2p9j-2685`): Dependência de rede do ambiente JSDOM em testes;
     - `source-map-js` (`GHSA-68fv-2mgg-jv7q`): Dependência de build de CSS.
- **Procedimento Seguro de Correção:** Executar `npm audit fix` **sem a flag `--force`**, validando em seguida com `npm run lint && npm run test && npm run build` para garantir que atualizações do Zod e Vite não introduzam breaking changes.
- **Status:** Aberta (Agendada para Sprint 2 — antecipada para estabilizar a base)

---

### VULN-009: Workflow de CI com Permissões Excessivas e Actions Sem SHA Pinning
- **Classificação:** Hardening de Supply Chain & CI/CD
- **Severidade Calibrada:** Média — `CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:N` (Score: **4.2**)
- **CWE / OWASP:** CWE-829 / OWASP A08:2021
- **Local:** [`.github/workflows/ci.yml:1-35`](file:///c:/DEV/garimpo-dev/.github/workflows/ci.yml)
- **Análise Técnica:**  
  Embora o token padrão (`GITHUB_TOKEN`) em repositórios recentes possua permissões restritas de leitura, declarar explicitamente `permissions: contents: read` no topo do workflow impede elevação acidental de privilégios. Além disso, fixar GitHub Actions por hash de commit SHA-256 (em vez de tags mutáveis como `@v4`) protege a pipeline contra ataques de sequestro de repositório de terceiros (supply chain injection).
- **Correção Proposta:** Adicionar bloco de permissões explícito e fixar `actions/checkout` e `actions/setup-node` por commit SHA com comentários indicando a versão correspondente.
- **Status:** Aberta (Agendada para Sprint 6)

---

### VULN-010: Polling de 5min sem AbortController e Acúmulo de Requisições
- **Classificação:** Resiliência & Qualidade de Software
- **Severidade Calibrada:** Informativa / Baixa — `CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L` (Score: **2.9**)
- **CWE / OWASP:** CWE-400 (Uncontrolled Resource Consumption) / OWASP A04:2021
- **Local:** [`src/hooks/useVagas.ts:87-151, 161-174`](file:///c:/DEV/garimpo-dev/src/hooks/useVagas.ts#L87-L151)
- **Análise Técnica:**  
  O hook `useVagas` implementa polling periódico a cada 5 minutos. Se o usuário estiver em uma conexão de alta latência ou instável, requisições lentas podem se sobrepor sem cancelamento, causando desperdício de dados móveis e potenciais condições de corrida (race conditions) no estado React.
- **Correção Proposta:** Integrar `AbortController` nativo com timeout de 10s no Axios e garantir que a função de cleanup do `useEffect` aborte requisições em trânsito ao desmontar o componente.
- **Status:** Aberta (Agendada para Sprint 7)

---

### VULN-011: Ausência de Validação de Protocolo em URLs Externas (`javascript:`)
- **Classificação:** Defesa em Profundidade & Hardening de URLs
- **Severidade Calibrada:** Média — `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N` (Score: **4.3**)
- **CWE / OWASP:** CWE-20, CWE-79 / OWASP A03:2021
- **Local:** [`src/components/VagaDetalhesModal.tsx:182`](file:///c:/DEV/garimpo-dev/src/components/VagaDetalhesModal.tsx#L182), [`src/components/VagaCard.tsx:142`](file:///c:/DEV/garimpo-dev/src/components/VagaCard.tsx#L142), [`src/components/EventoCard.tsx:123`](file:///c:/DEV/garimpo-dev/src/components/EventoCard.tsx#L123), [`src/components/EventoDetalhesModal.tsx:113, 171`](file:///c:/DEV/garimpo-dev/src/components/EventoDetalhesModal.tsx#L113)
- **Análise Técnica:**  
  Uma busca completa (`grep`) por `href={` em todo o código-fonte confirma que nenhum elemento `<a href>` recebe strings dinâmicas cruas vindas da API externa. Os links de vagas passam obrigatoriamente pela função `buildVagaUrl(vaga.slug, vaga.id)` (linhas 182 de `VagaDetalhesModal.tsx` e 142 de `VagaCard.tsx`), enquanto links de eventos (`evento.linkInscricao`, `evento.mapaUrl`) provêm de dados estáticos auditados em `src/data/eventos.ts`. Além disso, especificações de navegadores modernos não executam scripts via protocolo `javascript:` em tags `<img src>`. Dessa forma, o achado não constitui vulnerabilidade explorável em produção, mas sim uma medida de **Hardening defensivo** para garantir que qualquer expansão futura de links valide estritamente o esquema `https:` (ou `mailto:`).
- **Correção Proposta:** Criar função utilitária `sanitizarUrlExterna(url)` que autorize unicamente URLs iniciando com `https://` (ou `mailto:`), descartando qualquer outro esquema.
- **Status:** Aberta (Agendada para Sprint 4)

---

### VULN-012: Ausência de Error Boundary Global (Tela Branca / Degradation)
- **Classificação:** Resiliência & Experiência do Usuário (UX)
- **Severidade Calibrada:** Informativa — `CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L` (Score: **2.9**)
- **CWE / OWASP:** CWE-209 / OWASP A04:2021
- **Local:** [`src/main.tsx:1-13`](file:///c:/DEV/garimpo-dev/src/main.tsx#L1-L13)
- **Análise Técnica:**  
  Em builds de produção do React 19, erros não tratados no ciclo de renderização não expõem stack traces na tela; em vez disso, o componente quebra por completo, resultando em tela branca (*White Screen of Death*). A ausência de um `ErrorBoundary` global impede a degradação graciosa da aplicação.
- **Correção Proposta:** Implementar componente de classe `GlobalErrorBoundary` envolvendo a árvore principal no `main.tsx`, exibindo tela amigável com opção de recarregar a aplicação e limpar o cache local.
- **Status:** Aberta (Agendada para Sprint 7)

---

### VULN-013: Exposição de Objetos de Erro de Rede em Logs de Console
- **Classificação:** Higiene Operacional & Qualidade de Código
- **Severidade Calibrada:** Baixa — `CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N` (Score: **4.0**)
- **CWE / OWASP:** CWE-532 / OWASP A09:2021
- **Local:** [`src/services/solides.ts:46, 56, 120`](file:///c:/DEV/garimpo-dev/src/services/solides.ts#L46)
- **Análise Técnica:**  
  O console do navegador pertence ao próprio usuário local, e as URLs e parâmetros do Gateway da Sólides já são públicos e visíveis na aba *Network* do DevTools. Manter chamadas `console.error` ativas em produção é uma questão de limpeza e profissionalismo, não um vetor de vazamento de credenciais privadas.
- **Correção Proposta:** Envolver logs de depuração em condicionais `if (import.meta.env.DEV)` ou utilitário desacoplado de logging.
- **Status:** Aberta (Agendada para Sprint 7)

---

## 7. Próximos Passos & Cronograma Estratégico das Sprints (1 a 8)

O cronograma de implementação foi reestruturado de forma lógica para priorizar a maior vulnerabilidade real logo na largada e estabilizar as dependências antes da suíte de validação:

```
Sprint 1: XSS (VULN-001) com DOMPurify + Testes de Injeção
    │
Sprint 2: Supply Chain (VULN-008) — Atualização de Zod, Vite e dependências
    │
Sprint 3: Hardening HTTP (VULN-006) — CSP em Report-Only e cabeçalhos defensivos
    │
Sprint 4: URLs & Validação de API (VULN-002, VULN-004, VULN-011) — buildVagaUrl estrito e protocolos
    │
Sprint 5: Robustez de Storage (VULN-003, VULN-005) — Schemas Zod na leitura do localStorage
    │
Sprint 6: Infraestrutura & CI (VULN-007, VULN-009) — Docker Nginx Unprivileged na porta 8080 e CI SHA
    │
Sprint 7: Resiliência & UX (VULN-010, VULN-012, VULN-013) — AbortController, ErrorBoundary e logs limpos
    │
Sprint 8: Auditoria Final & Fechamento — Validação de conformidade, métricas pós-hardening e documentação
```

- **Sprint 1 (Prioridade Máxima — Vulnerabilidade Real):**  
  Sanitização de HTML com `DOMPurify` em `VagaDetalhesModal.tsx` com allowlist estrita para descrições reais de vagas e bateria de testes de injeção em Vitest.
- **Sprint 2 (Estabilização da Base e Ferramental):**  
  Execução de `npm audit fix` (sem quebras), upgrade seguro do `zod` e `vite`, garantindo que testes futuros rodem sobre base limpa.
- **Sprint 3 (Defesa em Profundidade HTTP):**  
  Configuração de CSP inicial em modo `Content-Security-Policy-Report-Only` no `vercel.json` e no `nginx.conf` para auditoria de tráfego antes do bloqueio estrito.
- **Sprint 4 (Sanitização de Redirecionamento e Contrato de APIs):**  
  Endurecimento de `buildVagaUrl` sem fallback para `portodigital`, validação Zod no modo agregado de vagas e filtro de protocolos em links externos.
- **Sprint 5 (Robustez de Dados Locais):**  
  Implementação de schemas Zod na leitura de `localStorage` para candidaturas e favoritos com fallback resiliente, e registro formal da mitigação de Prototype Pollution.
- **Sprint 6 (Hardening de Container e Pipeline CI/CD):**  
  Migração do Docker para `nginxinc/nginx-unprivileged:alpine` com escuta na porta **8080**, atualização das instruções no README e restrição de permissões no GitHub Actions.
- **Sprint 7 (Resiliência, Disponibilidade e Limpeza):**  
  Cancelamento de requisições de polling com `AbortController`, Error Boundary global contra tela branca e remoção de logs de console em produção.
- **Sprint 8 (Verificação Final e Conclusão):**  
  Execução completa da suíte de testes de regressão de segurança, verificação no SecurityHeaders e documentação final dos registros de decisão de arquitetura (ADRs) de AppSec.
