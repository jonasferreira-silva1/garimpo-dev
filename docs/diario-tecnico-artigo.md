---
title: "Garimpo Dev: Da Ideia a 66 Testes, Zod, Cache Offline, Tracker Kanban e ADRs em React 19 (Sprints 1 a 10)"
published: true
description: "Diário de engenharia sobre a construção do Garimpo Dev: um radar de vagas tech no Porto Digital feito com React 19, Zod, cache offline, Kanban de candidaturas, Hub de Eventos, ADRs e 66 testes automatizados."
tags: react, typescript, webdev, testing
canonical_url: https://github.com/jonasferreira-silva1/garimpo-dev
---

# 🚀 Garimpo Dev: Da Ideia a 66 Testes, Zod, Cache Offline, Tracker Kanban e ADRs

Quando idealizei o **Garimpo Dev**, a motivação principal foi resolver uma necessidade real: acompanhar de forma limpa, rápida e estruturada as vagas de tecnologia no ecossistema do **Porto Digital** em Recife. Para recém-formados e desenvolvedores em busca de oportunidades locais, encontrar vagas relevantes e construir uma rede de contatos nem sempre é uma tarefa centralizada.

O projeto nasceu como uma listagem simples em **React 19** e **TypeScript**. Contudo, ao longo de 10 sprints de desenvolvimento disciplinado, ele se transformou em uma plataforma completa de acompanhamento de carreira, com validação de dados em runtime via **Zod**, estratégia **offline-first**, **Hub de Eventos**, **Tracker de Candidaturas (Kanban)**, relatórios via **CSS `@media print`**, **ADRs** (Architecture Decision Records) e **66 testes automatizados**.

Neste artigo, compartilho em primeira pessoa cada detalhe técnico e decisão de arquitetura dessa jornada.

---

## 🗺️ A Jornada Completa em 10 Sprints

Planejei o desenvolvimento em ciclos incrementais, onde cada entrega trazia valor de uso real e cobertura de testes:

```
[Sprints 1-2] MVP & UI ──► [Sprints 3-4] Eventos & Kanban ──► [Sprints 5-6] Zod & Offline ──► [Sprints 7-8] Radar & Print PDF ──► [Sprints 9-10] ADRs & 66 Testes
```

- **Sprints 1 e 2 (Fundação & UI/UX):** Setup com **React 19**, Vite, TypeScript e Tailwind CSS. Consumo direto da API Sólides, criação de cards com dados formatados, badge de vagas novas (< 48h) e paginação.
- **Sprints 3 e 4 (Múltiplos Slugs, Favoritos, Hub de Eventos & Kanban):** Expansão para múltiplos *slugs* do ecossistema Porto Digital, sistema de favoritos no `localStorage`, **Hub de Eventos Tech** para networking local e **Tracker de Candidaturas (Kanban)** para gestão de processos seletivos (Aguardando, Entrevista, Proposta, Rejeitada).
- **Sprints 5 e 6 (Validação com Zod & Cache Offline):** Schemas **Zod** para validação em runtime contra payloads instáveis da API externa, além de um fallback de **cache offline** acoplado ao componente `CacheBanner.tsx`.
- **Sprints 7 e 8 (Radar de Mercado & PDF Zero-Deps):** Módulo estatístico de vagas com análise de senioridade/modalidade e exportação de relatórios via **CSS `@media print` + `window.print()` (ADR-006)**.
- **Sprints 9 e 10 (Central de ADRs & Suíte de 66 Testes):** Formalização de 6 Registros de Decisão de Arquitetura e consolidação de uma suíte com **66 testes automatizados**.

---

## 🛠️ Tech Stack Real do Projeto

A stack do **Garimpo Dev** foi escolhida priorizando desempenho, leveza de bundle e zero dependências desnecessárias:

- **Core:** React 19 (`react@^19.2.8`) + TypeScript 6 + Vite 8
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Validação em Runtime:** Zod
- **HTTP Client & Linter:** Axios & Oxlint
- **Impressão / PDF:** CSS Nativo `@media print` + `window.print()` (Zero bibliotecas pesadas)
- **Testes Automatizados:** Suíte com 66 testes unitários e de integração
- **Armazenamento Local:** Web Storage API (`localStorage`)

---

## 🧠 Decisões de Arquitetura & ADRs Registradas

A transparência de engenharia é o pilar central do projeto. Por isso, todas as decisões relevantes foram documentadas em **ADRs** acessíveis no repositório e na interface da aplicação:

| ADR | Título | Decisão & Justificativa |
|-----|--------|-------------------------|
| **ADR-001** | Architecture Frontend-Only | Aplicação 100% client-side hospedada na Vercel com custo zero de infraestrutura backend. |
| **ADR-002** | Polling & Atualização Reativa | Atualização automática via polling a cada 5 minutos, escolhida no lugar de WebSockets por simplicidade e por evitar overhead de conexão persistente. |
| **ADR-003** | Cache Offline com Fallback | Persistência temporária no `localStorage` exibida via `CacheBanner` durante instabilidades de rede. |
| **ADR-004** | Extração de Requisitos via Regex | Parsing e categorização de tecnologias a partir das descrições das vagas sem dependências pesadas de NLP. |
| **ADR-005** | Adoção da Mediana Salarial | Uso da **mediana salarial** em vez da média aritmética para anular a distorção de salários *outliers*. |
| **ADR-006** | Relatórios em PDF via `@media print` | Escolha do CSS nativo + `window.print()` descartando `jspdf` ou `html2pdf` para manter o bundle enxuto. |

---

## 💡 Destaque Técnico 1: Por que escolhi a Mediana Salarial? (ADR-005)

Durante a criação do **Radar de Mercado**, deparei-me com uma distorção clássica ao calcular salários por área: uma única vaga sênior com faixa salarial muito acima da média inflacionava o resultado da categoria em mais de 30%.

Em vez de usar a média aritmética tradicional, documentei e implementei a **mediana salarial**:

```typescript
export function calcularMedianaSalariais(valores: number[]): number {
  if (valores.length === 0) return 0;
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);

  if (ordenados.length % 2 === 0) {
    return (ordenados[meio - 1] + ordenados[meio]) / 2;
  }
  return ordenados[meio];
}
```

Essa mudança garantiu que as estatísticas do Radar fossem fiéis à realidade de mercado vivida pelos desenvolvedores em Recife.

---

## 📄 Destaque Técnico 2: PDF com Zero Dependências (ADR-006)

Um erro comum ao adicionar exportação em PDF é instalar pacotes de centenas de kilobytes como `jspdf` ou `html2pdf`. Na **ADR-006**, decidi seguir pelo caminho nativo da web: utilizar regras `@media print` no Tailwind CSS combinadas com `window.print()`.

O resultado foi uma funcionalidade de relatório perfeita, estilizada para impressão, com **zero impacto no tamanho do bundle final**.

```css
@media print {
  body {
    background-color: white;
    color: black;
  }
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
}
```

---

## 🧪 A Suíte de 66 Testes Automatizados

A confiança para refatorar o código ao longo das 10 sprints veio da criação de testes automatizados cobrindo schemas Zod, utilitários, hooks reativos e componentes da interface.

Atualmente, o repositório mantém uma suíte de **66 testes automatizados (100% passing)**, validando desde o parseamento de tipos até a retenção de dados em cache offline e o comportamento dos modais de documentação.

---

## 🎯 Funcionalidades que Apoiam o Desenvolvedor

Além das inovações de código, o **Garimpo Dev** foi desenhado pensando na jornada do candidato:

1. **Tracker de Candidaturas (Kanban):** Permite mover vagas entre colunas (*Aguardando*, *Entrevista*, *Proposta*, *Recusada*) para não perder nenhuma oportunidade de vista.
2. **Hub de Eventos Tech:** Apresenta encontros de comunidades reais em Recife, como **Python Recife**, **Meetup React Recife**, **Porto Digital Summit** e **CESAR Tech Talk**, auxiliando recém-formados a construírem networking real.
3. **Múltiplos Slugs do Ecossistema:** Acompanha não apenas o hub central, mas empresas parceiras da região de Recife.

---

## 📈 Conclusão & Aprendizados

Construir o **Garimpo Dev** reforçou em mim que a transparência de engenharia é o ativo mais valioso de um projeto de portfólio. Substituir estimativas por dados reais, documentar escolhas em ADRs e dizer "não" a dependências pesadas foram decisões que tornaram o sistema resiliente e leve.

- **Repositório no GitHub:** [jonasferreira-silva1/garimpo-dev](https://github.com/jonasferreira-silva1/garimpo-dev)

*Agradeço a leitura! Caso tenha sugestões sobre a arquitetura ou sobre as ADRs adotadas, deixe seu comentário abaixo.*
