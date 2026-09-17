# ⛏️ Garimpo Dev — Radar de Vagas Tech em Recife

> **Plataforma Web de Monitoramento de Vagas Tech em Tempo Real**  
> *Recife & Ecossistema Porto Digital*  
> *"Garimpar as melhores oportunidades tech de Pernambuco, em tempo real, direto da fonte."*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[🚀 Demo ao Vivo (Em breve — Vercel)](https://garimpo-dev.vercel.app) · [🐛 Reportar Bug](https://github.com/jonasferreira-silva1/garimpo-dev/issues) · [💡 Sugerir Feature](https://github.com/jonasferreira-silva1/garimpo-dev/issues)

---

## 🌎 O Contexto

O **Porto Digital** (Recife/PE) é um dos principais parques tecnológicos e polos de inovação da América Latina, abrigando centenas de empresas de tecnologia, startups e centros de P&D.

Entretanto, acompanhar as novas oportunidades de trabalho de forma centralizada costuma ser difícil devido à pulverização de anúncios e sistemas legados de RH. O **Garimpo Dev** nasce como uma ferramenta web responsiva e ultrarrápida para monitorar e consolidar em tempo real as vagas tech publicadas na plataforma Sólides para o Porto Digital e empresas parceiras do ecossistema de Recife.

---

## ✨ O que esse projeto entrega

- 🔍 **Monitoramento em Tempo Real:** Conexão direta com a API pública da Sólides, trazendo vagas atualizadas instantaneamente sem necessidade de intermediários ou proxies.
- ✨ **Badge "NOVA" Dinâmico:** Identificação visual imediata de oportunidades recém-criadas (há menos de 48 horas).
- 🏷️ **Filtros por Modalidade & Palavra-chave:** Busca por cargo/tecnologia e filtragem por trabalho Remoto, Híbrido ou Presencial.
- 🔗 **Correção do Link de Inscrição:** Normalização automática de URLs da Sólides que contêm o bug de domínio incompleto (`redirectLink`).
- 💵 **Tratamento Inteligente de Salários:** Formatação automática de faixas salariais em Real (R$) e rótulo "A combinar" para salários ocultos/negociáveis.
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

## ⚠️ Pontos de Atenção & Soluções Técnicas

| Situação Identificada | Diagnóstico / Comportamento API | Solução Implementada |
| :--- | :--- | :--- |
| **`redirectLink` quebrado** | API retorna `https://portodigital./vacancies/123` sem o domínio | Função `buildVagaUrl(slug, id)` que gera `https://${slug}.vagas.solides.com.br/vacancies/${id}` |
| **Salário não informado** | Campo `finalRange === 0` ou `showRangeToApplicant: false` | Função `formatSalary()` exibe `"A combinar"` |
| **Vagas Recentes** | Data de criação enviada no campo `createdAt` | Função `isNova()` compara diferença de horas (< 48h) para ativar badge |

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
```

---

## 📁 Estrutura do Repositório

```text
garimpo-dev/
├── doc/
│   └── garimpo-dev-docs.pdf      # Especificação completa do projeto
├── public/                       # Favicon e ícones estáticos
├── src/
│   ├── components/               # Componentes de UI modulares
│   │   ├── Badge.tsx             # Rótulos para vagas e modalidades
│   │   ├── EmptyState.tsx        # Estado de lista vazia ou erro
│   │   ├── FiltroBar.tsx         # Barra de pesquisa e seleção de modalidade
│   │   ├── Header.tsx            # Cabeçalho com marca e status
│   │   ├── Paginacao.tsx         # Navegação por páginas
│   │   └── VagaCard.tsx          # Card individual de exibição da vaga
│   ├── hooks/
│   │   └── useVagas.ts           # Custom Hook desacoplado (Estado & Fetch)
│   ├── services/
│   │   └── solides.ts            # Serviço de integração HTTP Axios
│   ├── types/
│   │   └── vaga.ts               # Interfaces TypeScript da API Sólides
│   ├── utils/
│   │   └── formatters.ts         # Regras de negócio e formatadores
│   ├── App.tsx                   # Aplicação React principal
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
| **Semana 3** | 1 semana | **Múltiplos Slugs & Favoritos:** Mapeamento de empresas residentes (CESAR, Vsoft, Accenture) e salvamento de vagas favoritas via `localStorage`. | 🔄 *Em andamento* |
| **Semana 4** | 1 semana | **Polimento & Portfólio:** Sanitização do HTML de descrição, modal expandido de detalhes, página "Sobre" e deploy contínuo na Vercel. | ⏳ *Planejado* |

---

## 🧪 Testes e Qualidade de Código

Para garantir a estabilidade antes de realizar cada commit no repositório GitHub, execute os seguintes testes:

```bash
# Executar a verificação de código com Oxlint
npm run lint

# Validar a compilação do TypeScript
npm run build
```

---

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<p align="center">
  Desenvolvido com ❤️ em Pernambuco, Brasil 🇧🇷<br/>
  <strong>Jonas Ferreira Silva</strong><br/>
</p>
