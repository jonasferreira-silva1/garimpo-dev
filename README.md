# ⛏️ Garimpo Dev — Radar de Vagas Tech em Recife

> **Plataforma Web de Monitoramento de Vagas Tech em Tempo Real**  
> *Recife & Ecossistema Porto Digital*  
> *"Garimpar as melhores oportunidades tech de Pernambuco, em tempo real, direto da fonte."*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-44_Passed-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![CI/CD Pipeline](https://github.com/jonasferreira-silva1/garimpo-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/jonasferreira-silva1/garimpo-dev/actions)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[🚀 Demo ao Vivo — garimpo-dev.vercel.app](https://garimpo-dev.vercel.app) · [🐛 Reportar Bug](https://github.com/jonasferreira-silva1/garimpo-dev/issues) · [💡 Sugerir Feature](https://github.com/jonasferreira-silva1/garimpo-dev/issues)

---

## 🌎 O Contexto

O **Porto Digital** (Recife/PE) é um dos principais parques tecnológicos e polos de inovação da América Latina, abrigando centenas de empresas de tecnologia, startups e centros de P&D.

Entretanto, acompanhar as novas oportunidades de trabalho de forma centralizada costuma ser difícil devido à pulverização de anúncios e sistemas legados de RH. O **Garimpo Dev** nasce como uma ferramenta web responsiva e ultrarrápida para monitorar e consolidar em tempo real as vagas tech publicadas na plataforma Sólides para o Porto Digital e empresas parceiras do ecossistema de Recife.

---

## ✨ O que esse projeto entrega

- 🔍 **Monitoramento em Tempo Real:** Conexão direta com a API pública da Sólides, trazendo vagas atualizadas instantaneamente sem necessidade de intermediários ou proxies.
- ⏱️ **Atualização Automática Periódica (Auto-Polling):** Busca automática a cada 5 minutos (300.000 ms) via `setInterval` no custom hook `useVagas`, mantendo o painel vivo sem recarregar a página.
- 📅 **Hub de Eventos & Meetups Tech:** Catálogo de eventos de tecnologia em Recife e Porto Digital com badge *"Esta Semana"* (<= 7 dias).
- 📋 **Tracker de Candidaturas (Kanban):** Gerenciador de processos seletivos com fases (Candidatado, Em Análise, Entrevista, Aprovado, Recusado) e anotações pessoais salvas no `localStorage`.
- ✨ **Badge "NOVA" Dinâmico:** Identificação visual imediata de oportunidades recém-criadas (há menos de 48 horas).
- 🏷️ **Filtros por Modalidade & Palavra-chave:** Busca por cargo/tecnologia e filtragem por trabalho Remoto, Híbrido ou Presencial.
- 🔗 **Correção do Link de Inscrição:** Normalização automática de URLs da Sólides que contêm o bug de domínio incompleto (`redirectLink`).
- 💵 **Tratamento Inteligente de Salários:** Formatação automática de faixas salariais em Real (R$) e rótulo "A combinar" para salários ocultos/negociáveis.
- 🛡️ **Resiliência Offline & Fallback Cache (Stale-While-Revalidate):** Armazena automaticamente a resposta mais recente no `localStorage` com janela de validade de 24h. Em caso de instabilidade na API externa da Sólides, ativa o modo offline apresentando o banner informativo `CacheBanner` e permitindo reconexões limpas.
- 🏛️ **Detalhes & Procedência Oficial de Eventos:** Modal dedicado `EventoDetalhesModal` com visualização de fontes verificadas (Sympla, Porto Digital, CESAR, PUG-PE) e mapa direto via Google Maps.
- 📱 **Interface Responsiva & Glassmorphism:** Design limpo, acessível e otimizado para celulares, tablets e desktops.

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

### Fluxo de Dados em Tempo Real

```text
[Usuário Acessa/Filtra] ──► [useVagas Hook] ──► [solides.ts (Axios)]
                                                         │
[Renderiza Vagas Cards] ◄── [formatters.ts] ◄── [Resposta JSON API]
 (Trata URL, Salário e Nova)
```

> [!NOTE]
> **Arquitetura Zero-Backend:** Testes de rede confirmaram que a API Gateway da Sólides permite chamadas diretas via CORS a partir do navegador. Essa decisão de arquitetura elimina custos de infraestrutura backend, simplifica a manutenção e garante hospedagem 100% gratuita na Vercel/Netlify.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Interface reativa, tipagem estática rigorosa e desacoplamento |
| **Build Tool** | Vite 8 | Fast HMR, compilação ultrarrápida e bundle otimizado |
| **Estilização** | Tailwind CSS v4 | Design system utilitário, temas escuros e alta performance |
| **Ícones** | Lucide React | Biblioteca de ícones vetoriais leve e consistente |
| **HTTP Client** | Axios | Cliente HTTP robusto com tratamento de erros |
| **Container** | Docker + Nginx Alpine | Imagem multi-stage leve para ambiente reprodutível e produção |
| **Linter** | Oxlint | Linter em Rust ultrarrápido para garantia de código limpo |
| **Deploy** | Vercel / Netlify | Deploy contínuo automático integrado ao repositório GitHub |

---

## 📡 Documentação da API Sólides (Schema Real)

### Endpoint
`GET https://apigw.solides.com.br/jobs/v3/home/vacancy`

### Parâmetros Suportados

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `slug` | `string` | **Sim** | Identificador do hub ou empresa (ex: `portodigital`) |
| `take` | `number` | **Sim** | Quantidade de vagas por página (ex: `12`) |
| `page` | `number` | **Sim** | Número da página atual (começa em `1`) |
| `title` | `string` | Não | Filtro por palavra-chave no título do cargo |

### Interface TypeScript do Schema (`src/types/vaga.ts`)

```typescript
export interface Vaga {
  id: number;
  title: string;
  description: string;       // HTML encodado
  companyName: string;
  companyLogo: string;
  slug: string;
  redirectLink: string;      // ⚠️ Domínio incompleto retornado pela API
  jobType: string;           // "presencial" | "remoto" | "hibrido"
  homeOffice: boolean;
  createdAt: string;         // YYYY-MM-DD
  salary: {
    showRangeToApplicant: boolean;
    finalRange: number;
    negotiable: boolean;
  };
  city: { name: string };
  state: { code: string };
}
```

---

## 💡 Decisões de Arquitetura & Tratamento de Casos de Borda (Edge Cases)

| Desafio Técnico | Diagnóstico da API / Portal | Solução de Engenharia Implementada |
| :--- | :--- | :--- |
| **`redirectLink` Truncado & Rota Obsoleta (404)** | API retorna domínio incompleto e a rota legada `/vacancies/` (que dá erro 404 no portal Sólides) | Função utilitária `buildVagaUrl()` que constrói a URL válida `https://${slug}.vagas.solides.com.br/vaga/${id}` |
| **Atualização Contínua de Dados (Auto-Polling)** | Necessidade de sincronizar vagas ativas sem forçar F5 no navegador | Timer periódico `setInterval` de 5 minutos (300.000 ms) integrado ao ciclo de vida do React (`useEffect`) com cleanup |
| **Tratamento de Salário** | Ausência de faixa salarial ou valor zerado (`finalRange: 0`) | Normalização automática em `formatSalary()` para exibir "A combinar" |
| **Detecção de Vagas Recentes** | Filtragem temporal baseada no timestamp `createdAt` | Algoritmo em `isNova()` (< 48h) para aplicar badge de destaque visual |
| **Resiliência de Rede & Off-line** | API indisponível ou queda de conexão do usuário | Retry com limite de 3 tentativas e fallback de cache no `localStorage` (`VagasCacheData` com expiração de 24h) |



---

## 🚀 Rodando Localmente

### Pré-requisitos
- **Node.js:** `v20.x` ou superior
- **Docker Desktop:** `v24+` *(opcional, caso queira rodar via container)*

### Passo a Passo (Node.js)

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

### Rodando via Docker Container 🐳

```bash
# 1. Construir a imagem Docker
docker build -t garimpo-dev .

# 2. Executar o container na porta 8080
docker run -d -p 8080:80 --name garimpo-app garimpo-dev

# 3. Acessar no navegador: http://localhost:8080

# 4.Para parar: 
docker stop garimpo-app

# 5. Para reiniciar o container: 
docker start garimpo-app

```

---

## 📁 Estrutura do Repositório

```text
garimpo-dev/
├── doc/
│   └── garimpo-dev-docs.pdf      # Especificação completa do projeto
├── public/                       # Favicon e imagens estáticas
├── src/
│   ├── components/               # Componentes de UI modulares
│   │   ├── Badge.tsx             # Rótulos para vagas e modalidades
│   │   ├── CandidaturasView.tsx  # Mini-Kanban do Tracker de Candidaturas
│   │   ├── EmptyState.tsx        # Estado de lista vazia ou erro
│   │   ├── EventoCard.tsx        # Card individual de evento tech
│   │   ├── FiltroBar.tsx         # Barra de busca e filtros de vagas
│   │   ├── FiltroEventos.tsx     # Barra de filtros para eventos tech
│   │   ├── Header.tsx            # Cabeçalho com abas (Vagas, Eventos, Candidaturas)
│   │   ├── Paginacao.tsx         # Navegação por páginas
│   │   ├── RadarOutrasFontes.tsx # Conectores tech (LinkedIn Recife, GeekHunter, Remotar)
│   │   ├── SobreModal.tsx        # Modal institucional do projeto
│   │   ├── StatsBar.tsx          # Painel de estatísticas de vagas
│   │   ├── StatusSelector.tsx    # Seletor visual de status da candidatura + notas
│   │   ├── VagaCard.tsx          # Card individual de exibição da vaga
│   │   ├── VagaDetalhesModal.tsx # Modal de descrição da vaga em HTML
│   │   └── VagaSkeleton.tsx      # Skeleton screen animado (shimmer)
│   ├── data/
│   │   └── eventos.ts            # Base de dados curada de eventos tech em Recife
│   ├── hooks/
│   │   ├── useCandidaturas.ts   # Custom Hook com localStorage para candidaturas
│   │   ├── useFavoritos.ts      # Custom Hook com localStorage para favoritos
│   │   └── useVagas.ts           # Custom Hook com Auto-Polling (5 min) e Multi-slug
│   ├── services/
│   │   └── solides.ts            # Serviço de integração HTTP Axios
│   ├── types/
│   │   ├── candidatura.ts        # Interfaces e estilos do Tracker de Candidaturas
│   │   ├── evento.ts             # Interfaces TypeScript de Eventos Tech
│   │   └── vaga.ts               # Interfaces TypeScript da API Sólides
│   ├── utils/
│   │   └── formatters.ts         # Regras de negócio, formatadores e isEstaSemana
│   ├── App.tsx                   # Aplicação React principal com rotas por aba
│   ├── index.css                 # Estilos globais Tailwind v4
│   └── main.tsx                  # Ponto de entrada React DOM
├── Dockerfile                    # Multi-stage build (Node -> Nginx Alpine)
├── .dockerignore                 # Exclusões do contexto Docker
├── vite.config.ts                # Configuração do Vite com Tailwind
└── package.json                  # Dependências e scripts do projeto
```

---

## 🗺️ Roadmap Consolidado

| Fase / Sprint | Duração | Entrega Principal | Status |
| :--- | :--- | :--- | :--- |
| **Semana 1** | 1 semana | **Setup & Core:** Setup React 19 + Vite, Dockerfile, integração API Sólides, tipagem TypeScript, listagem em cards e README.md. | ✅ **Concluído** |
| **Semana 2** | 1 semana | **Filtros & UX:** Busca em tempo real por título, filtro por modalidade (Remoto/Híbrido/Presencial), badge "NOVA" (<48h) e paginação. | ✅ **Concluído** |
| **Semana 3** | 1 semana | **Múltiplos Slugs & Favoritos:** Mapeamento de empresas residentes (Vsoft, Sólides, etc.), modal de detalhes em HTML e salvamento de favoritas via `localStorage`. | ✅ **Concluído** |
| **Semana 4** | 1 semana | **Polimento & Portfólio:** Radar Tech Multiderivado (Sólides + LinkedIn Recife + GeekHunter/Remotar), Painel de Estatísticas, Skeleton Screens, modal "Sobre" e deploy de produção na Vercel. | ✅ **Concluído** |
| **Semana 5** | 1 semana | **Qualidade & CI/CD:** Suíte de testes automatizados com Vitest (26 testes unitários/integração com Mocks), pipeline de CI/CD automática via GitHub Actions e resiliência de rede com limite de retries. | ✅ **Concluído** |
| **Semana 6** | 1 semana | **Resiliência Offline & Modais:** Cache persistente com fallback automático (expiração 24h), `CacheBanner`, `EventoDetalhesModal` com procedência e suíte expandida para 37 testes automatizados. | ✅ **Concluído** |
| **Semana 7** | 1 semana | **Motor de Analytics de Mercado:** Dashboard `MercadoInsights.tsx`, parser de 15+ stacks com regex estrito, cálculo de mediana salarial, snapshots diários (`Record<string, MercadoSnapshot>`) e suíte expandida para 44 testes automatizados. | ✅ **Concluído** |

---

## 🌐 Deploy de Produção na Vercel

O Garimpo Dev está pronto para deploy contínuo na Vercel em 1 clique:

1. Acesse [vercel.com](https://vercel.com) e faça login com a sua conta do GitHub.
2. Clique em **"Add New"** → **"Project"**.
3. Importe o repositório `jonasferreira-silva1/garimpo-dev`.
4. O Vercel detectará automaticamente as configurações do Vite (`Framework Preset: Vite`).
5. Clique em **Deploy**. Sua aplicação estará no ar em poucos segundos com a URL `https://garimpo-dev.vercel.app`!


---

## 🧪 Testes Automatizados e Qualidade de Código

O projeto possui uma suíte completa de testes automatizados (unitários, integração e componentes com Vitest + Testing Library) e pipeline de CI/CD via GitHub Actions.

```bash
# Executar a suíte de testes automatizados (Vitest)
npm run test

# Executar a verificação de código com Oxlint
npm run lint

# Validar a compilação do TypeScript e bundle
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
