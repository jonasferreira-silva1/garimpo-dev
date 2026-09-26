# ⛏️ Garimpo Dev — Radar de Vagas Tech em Recife

> **Plataforma Web de Monitoramento de Vagas Tech em Tempo Real**  
> *Recife & Ecossistema Porto Digital*  
> *"Garimpar as melhores oportunidades tech de Pernambuco, em tempo real, direto da fonte."*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-66_Passed-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Zod Schema](https://img.shields.io/badge/Zod-Runtime_Validated-3E67B1?style=flat-square&logo=zod)](https://zod.dev/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![CI/CD Pipeline](https://github.com/jonasferreira-silva1/garimpo-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/jonasferreira-silva1/garimpo-dev/actions)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[🚀 Demo ao Vivo — garimpo-dev.vercel.app](https://garimpo-dev.vercel.app) · [📖 Artigo Técnico de Bastidores (Dev.to / LinkedIn)](doc/diario-tecnico-artigo.md) · [🐛 Reportar Bug](https://github.com/jonasferreira-silva1/garimpo-dev/issues)

---

## 📖 A História do Projeto & Metodologia de Engenharia

O **Porto Digital** (Recife/PE) é um dos maiores parques tecnológicos e polos de inovação da América Latina, abrigando centenas de empresas de tecnologia, startups e centros de P&D.

Entretanto, acompanhar as novas oportunidades de trabalho de forma centralizada costumava ser difícil devido à pulverização de anúncios e sistemas legados de RH. O **Garimpo Dev** nasceu como um projeto pessoal para resolver essa dor real, agregando vagas tech diretamente da API pública da Sólides em uma interface responsiva, ultrarrápida e sem custo de servidores.

### 🤖 Bastidores de Engenharia: Pair-Programming com AI Agentic
O projeto foi construído utilizando metodologia de **Engenharia Pair-Programming com Assistente de IA Agentic**, em ciclos iterativos de desenvolvimento. Enquanto o desenvolvedor liderava o direcionamento de produto, visão de negócios, decisões de arquitetura e revisão rigorosa de código, a IA auxiliava na aceleração da escrita de componentes React, schemas Zod, algoritmos estatísticos e suítes de testes automatizados no Vitest.

---

## ⚠️ Limitações Conhecidas & Transparência de Escopo

Em respeito à transparência de engenharia que norteia este projeto, destacamos as limitações pragmáticas da solução:

1. **Dependência de Fonte Única:** O radar de vagas consome prioritariamente o API Gateway público da plataforma Sólides (empresas do Porto Digital e parceiras). O app não possui robôs de *web scraping* não autorizados em redes fechadas.
2. **Curadoria Manual de Eventos:** O hub de eventos tech possui atualização periódica com data de verificação explícita na interface (`DATA_ULTIMA_CURADORIA_EVENTOS`), garantindo procedência sem exibir informações desatualizadas.
3. **Arquitetura 100% Client-Side:** Para manter custo R$ 0,00 de infraestrutura, o Garimpo Dev não utiliza banco de dados próprio backend. As candidaturas e vagas favoritadas são persistidas localmente no `localStorage` do navegador do usuário.
4. **Foco e Alcance Regional:** A ferramenta foi desenhada especificamente para o ecossistema de TI de Pernambuco (Recife e região metropolitana).

---

## ✨ Funcionalidades Entregues

### 🎯 Core do Produto (Vagas & Tracker)
- 🔍 **Monitoramento em Tempo Real:** Conexão direta com a API pública da Sólides sem necessidade de proxies.
- ⏱️ **Auto-Polling Reativo (5 min):** Atualização automática sem necessidade de recarregar a página.
- 📋 **Tracker de Candidaturas (Mini-Kanban):** Gerenciador de processos seletivos (Candidatado, Em Análise, Entrevista, Aprovado, Recusado) salvo via `localStorage`.
- 🏷️ **Filtros por Modalidade & Palavra-chave:** Busca por cargo/stack e filtragem por Remoto, Híbrido ou Presencial.
- ✨ **Badge "NOVA" Dinâmico:** Destaque visual automático para vagas criadas há menos de 48 horas.
- 💵 **Tratamento Inteligente de Salários:** Normalização de valores em Reais (R$) e rótulo "A combinar" para salários negociáveis.

### 📊 Inteligência de Mercado & Relatórios
- 📊 **Radar de Mercado Tech:** Dashboard `MercadoInsights.tsx` com amostragem estatística em tempo real de tecnologias mais pedidas (parser de 15+ stacks por regex estrito `\b`), distribuição por senioridade e cálculo de mediana salarial.
- 📄 **Relatório Institucional & PDF (`@media print`):** Visão formatada em A4 pronta para impressão/PDF nativa sem dependências pesadas, e gerador de resumo para o LinkedIn com deep link (`?aba=mercado`).
- 📅 **Hub de Eventos Tech:** Agenda curada com badge de procedência oficial (Sympla, Porto Digital, CESAR, PUG-PE) e mapa direto via Google Maps.

### 🛡️ Engenharia, Resiliência & Bastidores
- 🛡️ **Validação de Schema Runtime com Zod:** Schema defensivo (`solidesSchema.ts`) que valida a estrutura HTTP da API no client sem quebrar a aplicação em caso de mudanças de contrato.
- 🛡️ **Resiliência Offline (Stale-While-Revalidate):** Fallback automático para `localStorage` com validade de 24h em caso de queda de conexão (`CacheBanner`).
- 📓 **Diário Técnico & Central de ADRs:** Modal interativo (`DiarioTecnicoModal.tsx`) contendo 6 Architecture Decision Records (ADRs) reais do projeto e telemetria viva (`ArquiteturaDiagrama.tsx`).

---

## 🏗️ Arquitetura

```ascii
┌─────────────────────────────────────────────────────────────────┐
│                    Navegador / Client Mobile                     │
│                (React 19 + TypeScript + Vite)                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ fetch direto (CORS aberto!)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API SÓLIDES (Externa)                        │
│          https://apigw.solides.com.br/jobs/v3/home/vacancy        │
│          · Sem autenticação necessária                          │
│          · Sem headers proprietários                            │
└─────────────────────────────────────────────────────────────────┘
```

### Decisões de Arquitetura & Tratamento de Edge Cases (ADRs)

| Desafio Técnico | Diagnóstico da API / Portal | Solução de Engenharia Implementada (ADR) |
| :--- | :--- | :--- |
| **`redirectLink` Truncado (404)** | API retorna domínio incompleto e a rota legada `/vacancies/` | Função utilitária `buildVagaUrl()` constrói a URL válida `https://${slug}.vagas.solides.com.br/vaga/${id}` |
| **Arquitetura Zero-Backend** | Desejo de eliminar custos de servidores intermediários | Identificação do header HTTP `Access-Control-Allow-Origin: *` na API Sólides, permitindo chamadas diretas via browser |
| **Parser de Stacks por Texto** | Buscas simples por string geravam falsos positivos em "Go", "R", "C" | Expressões regulares estritas com delimitadores de palavra `\b` (word boundaries) em `mercadoAnalytics.ts` |
| **Outliers Salariais** | Vagas de especialistas (R$ 20k+) distorciam a média em +30% | Adota a **Mediana Salarial** como métrica primária e mais honesta do mercado local |
| **Exportação em PDF** | Necessidade de PDF sem inchar o bundle em +350 KB | Estilização utilitária `@media print` acionando o `window.print()` nativo do navegador |
| **Divergência de Schema HTTP** | Alterações não avisadas na API externa | Validação de schema runtime com Zod (`solidesResponseSchema.safeParse()`) ativando o fallback de cache offline |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Interface reativa, tipagem estática rigorosa e desacoplamento |
| **Validation** | Zod | Validação de schema em runtime para respostas HTTP da API externa |
| **Build Tool** | Vite 8 | Fast HMR, compilação ultrarrápida e bundle otimizado |
| **Estilização** | Tailwind CSS v4 | Design system utilitário, temas escuros e alta performance |
| **Container** | Docker + Nginx Alpine | Multi-stage build leve para ambiente de produção reprodutível |
| **Testes & Coverage** | Vitest + Testing Library + V8 | Suíte de 66 testes automatizados com relatório de cobertura |
| **Linter** | Oxlint | Linter em Rust ultrarrápido para garantia de código limpo |
| **Deploy** | Vercel | Hospedagem de produção com deploy contínuo integrado ao GitHub |

---

## 🚀 Rodando Localmente & Docker Container 🐳

### Pré-requisitos
- **Node.js:** `v20.x` ou superior
- **Docker Desktop:** `v24+` *(opcional, para execução via container)*

### Execução com Node.js

```bash
# 1. Clonar o repositório
git clone https://github.com/jonasferreira-silva1/garimpo-dev.git
cd garimpo-dev

# 2. Instalar as dependências
npm install

# 3. Executar o servidor de desenvolvimento
npm run dev

# 4. Acessar no navegador: http://localhost:5173
```

### Execução com Docker (Multi-stage Build + Nginx) 🐳

```bash
# 1. Construir a imagem Docker de produção
docker build -t garimpo-dev .

# 2. Executar o container na porta 8080
docker run -d -p 8080:80 --name garimpo-app garimpo-dev

# 3. Acessar no navegador: http://localhost:8080

# 4. Para parar o container:
docker stop garimpo-app
```

---

## 🌐 Deploy em Produção na Vercel

O Garimpo Dev está configurado para deploy contínuo automático na Vercel:

1. Acesse [vercel.com](https://vercel.com) e faça login com a conta do GitHub.
2. Importe o repositório `jonasferreira-silva1/garimpo-dev`.
3. O Vercel detectará automaticamente as configurações do Vite (`Framework Preset: Vite`).
4. Clique em **Deploy**. A aplicação estará disponível na URL oficial `https://garimpo-dev.vercel.app`!

---

## 📁 Estrutura do Repositório

```text
garimpo-dev/
├── doc/
│   ├── diario-tecnico-artigo.md  # Artigo técnico narrativo em 1ª pessoa (Dev.to / LinkedIn)
│   └── garimpo-dev-docs.pdf      # Especificação completa do projeto
├── public/                       # Favicon e imagens estáticas
├── src/
│   ├── components/               # Componentes de UI modulares
│   │   ├── ArquiteturaDiagrama.tsx # Visualizador de arquitetura reativa & telemetria ao vivo
│   │   ├── Badge.tsx             # Rótulos para vagas e modalidades
│   │   ├── CandidaturasView.tsx  # Mini-Kanban do Tracker de Candidaturas
│   │   ├── DiarioTecnicoModal.tsx# Modal interativo de ADRs e exportação do artigo
│   │   ├── EmptyState.tsx        # Estado de lista vazia ou erro
│   │   ├── EventoCard.tsx        # Card individual de evento tech
│   │   ├── FiltroBar.tsx         # Barra de busca e filtros de vagas
│   │   ├── FiltroEventos.tsx     # Barra de filtros para eventos tech (com data de curadoria)
│   │   ├── Header.tsx            # Cabeçalho com abas e botão "Bastidores & ADRs"
│   │   ├── MercadoInsights.tsx   # Dashboard de inteligência e analytics de mercado
│   │   ├── Paginacao.tsx         # Navegação por páginas
│   │   ├── RadarOutrasFontes.tsx # Conectores tech (LinkedIn Recife, GeekHunter, Remotar)
│   │   ├── RelatorioModal.tsx    # Modal interativo de exportação do relatório
│   │   ├── RelatorioView.tsx     # Visão institucional de impressão/PDF do relatório
│   │   ├── SobreModal.tsx        # Modal institucional do projeto
│   │   ├── StatsBar.tsx          # Painel de estatísticas de vagas
│   │   ├── StatusSelector.tsx    # Seletor visual de status da candidatura + notas
│   │   ├── VagaCard.tsx          # Card individual de exibição da vaga
│   │   ├── VagaDetalhesModal.tsx # Modal de descrição da vaga em HTML
│   │   └── VagaSkeleton.tsx      # Skeleton screen animado (shimmer)
│   ├── data/
│   │   ├── diarioTecnico.ts      # Base de dados dos 6 ADRs do projeto e gerador do artigo
│   │   ├── eventos.ts            # Base de dados curada de eventos tech em Recife
│   │   └── fontesTech.ts         # Cadastro de fontes tech verificadas do ecossistema
│   ├── hooks/
│   │   ├── useCandidaturas.ts   # Custom Hook com localStorage para candidaturas
│   │   ├── useFavoritos.ts      # Custom Hook com localStorage para favoritos
│   │   └── useVagas.ts           # Custom Hook com Auto-Polling (5 min) e Multi-slug
│   ├── schemas/
│   │   └── solidesSchema.ts      # Schemas de validação runtime Zod para resposta da API
│   ├── services/
│   │   └── solides.ts            # Serviço de integração HTTP Axios com Zod safeParse
│   ├── types/
│   │   ├── candidatura.ts        # Interfaces e estilos do Tracker de Candidaturas
│   │   ├── diario.ts             # Interfaces TypeScript para ADRs e Telemetria
│   │   ├── evento.ts             # Interfaces TypeScript de Eventos Tech
│   │   ├── mercado.ts            # Interfaces TypeScript de Analytics de Mercado
│   │   └── vaga.ts               # Interfaces TypeScript da API Sólides
│   ├── utils/
│   │   ├── formatters.ts         # Regras de negócio, formatadores e isEstaSemana
│   │   ├── mercadoAnalytics.ts   # Motor de analytics, regex de stacks e medianas
│   │   └── relatorioFormatter.ts # Gerador de texto resiliente para LinkedIn e exportação
│   ├── App.tsx                   # Aplicação React principal com rotas por aba
│   ├── index.css                 # Estilos globais Tailwind v4
│   └── main.tsx                  # Ponto de entrada React DOM
├── Dockerfile                    # Multi-stage build (Node 20 Alpine -> Nginx Alpine)
├── vite.config.ts                # Configuração do Vite com Tailwind
└── package.json                  # Dependências e scripts do projeto
```

---

## 🧪 Testes Automatizados e Qualidade de Código

O projeto possui uma suíte de **66 testes automatizados** (unitários, integração e componentes com Vitest + Testing Library) e pipeline de CI/CD configurada no GitHub Actions.

```bash
# Executar a suíte completa de testes automatizados (Vitest)
npm run test

# Gerar o relatório de cobertura de código (Vitest + V8 Coverage)
npm run test:coverage

# Executar a verificação estática de código com Oxlint
npm run lint

# Validar a compilação do TypeScript e gerar bundle de produção
npm run build
```

---

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<p align="center">
  Desenvolvido em Pernambuco, Brasil 🇧🇷<br/>
  <strong>Jonas Ferreira Silva</strong><br/>
</p>
