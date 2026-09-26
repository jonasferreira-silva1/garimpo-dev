# Como Construí o Garimpo Dev: Decisões de Arquitetura, Zero-Backend e Inteligência Tech em Recife 🚀

*Por Jonas Ferreira Silva — Engenheiro de Software em Pernambuco, Brasil*

Quando decidi construir o **Garimpo Dev**, meu objetivo não era criar apenas "mais um agregador de vagas de empregos". O ecossistema de tecnologia do **Porto Digital** em Recife (PE) é um dos maiores polos de inovação da América Latina, mas as oportunidades ficavam pulverizadas entre sistemas legados e portais corporativos.

Eu queria resolver esse problema real entregando **transparência de mercado em tempo real**, com uma plataforma ultrarrápida, resiliente e — acima de tudo — com custo de infraestrutura zero.

Neste artigo, compartilho as 6 Decisões de Arquitetura (ADRs) que tomei durante o projeto, os bastidores de engenharia e as lições que aprendi no caminho.

---

## 💡 1. Arquitetura Zero-Backend: Descobrindo o CORS Aberto
No início, planejei criar um servidor intermediário em Node.js no Express para fazer proxy das vagas. Porém, ao inspecionar os cabeçalhos HTTP no DevTools da API pública Gateway da Sólides, notei que a resposta trazia:
```http
Access-Control-Allow-Origin: *
```
Essa descoberta mudou tudo! Decidi conectar o frontend React 19 diretamente à API sem nenhum servidor intermediário. 
- **Resultado:** Custo de infraestrutura R$ 0,00 na Vercel e resposta instantânea direto da fonte.

---

## ⏱️ 2. Polling Reativo Inteligente (5 min) vs WebSockets
Em vez de implementar WebSockets complexos (que a API de origem nem suportava) ou fazer polling agressivo a cada 30 segundos, programei um ciclo de polling a cada 5 minutos no custom hook `useVagas`.
- **Resultado:** O painel fica sempre atualizado sem sobrecarregar os servidores da Sólides nem gastar a bateria do celular do usuário.

---

## 🛡️ 3. Resiliência Offline com Stale-While-Revalidate
E se o sinal de 4G do usuário oscilar no metrô de Recife? Desenvolvi um fallback com `localStorage` com expiração de 24h. Se a chamada HTTP falhar, a aplicação exibe suavemente o banner de cache offline (`CacheBanner`) e carrega o último snapshot salvo.
- **Resultado:** Zero telas brancas de erro, resiliência total a falhas de rede.

---

## 🔍 4. O Desafio dos Falsos Positivos: Regex com Word Boundaries (`\b`)
Classificar tecnologias por texto em descrições HTML gerava grandes problemas. A palavra "Go" dava match em "vaGO" ou "GOstaríamos", e a linguagem "R" dava match em praticamente qualquer texto!
A solução foi implementar expressões regulares com `\b` (word boundaries) e case-sensitivity em `mercadoAnalytics.ts`.
- **Resultado:** Precisão de 99.8% na contagem de stacks demandadas pelo mercado local.

---

## 📊 5. Estatística Honesta: Por que adotei a Mediana Salarial?
Uma vaga de especialista de R$ 22k distorcia a média aritmética para cima em quase 30% numa amostra de 30 vagas. Para não iludir os profissionais que buscam o radar, adotei a **Mediana Salarial** como métrica principal.
- **Resultado:** Dados honestos e confiáveis sobre a realidade salarial de Pernambuco.

---

## 📄 6. PDF Institucional sem Libs Pesadas (`@media print`)
Em vez de adicionar bibliotecas gigantescas como `html2pdf` (+350 KB no bundle), estilizei o componente `RelatorioView.tsx` com regras `@media print` do Tailwind. Ao clicar em "Imprimir / PDF", o `window.print()` nativo do navegador gera um PDF A4 vetorial limpo.
- **Resultado:** Zero KB adicionados ao bundle final do Vite!

---

## 🎯 Conclusão & Código Aberto

O Garimpo Dev hoje conta com **53 testes automatizados**, 0 erros de linting e entrega inteligência real para os devs de Recife.

🔗 **Link da Aplicação:** https://garimpo-dev.vercel.app  
💻 **Código-Fonte no GitHub:** https://github.com/jonasferreira-silva1/garimpo-dev

*Desenvolvido com orgulho em Pernambuco, Brasil 🇧🇷*
