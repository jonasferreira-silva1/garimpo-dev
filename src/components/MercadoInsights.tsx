/**
 * Garimpo Dev — Componente MercadoInsights (Sprint 7)
 * 
 * Dashboard de Inteligência de Mercado Tech de Recife e Porto Digital,
 * apresentando distribuição por modalidade, ranking de stacks mais pedidas,
 * níveis de senioridade, faixas salariais e transparência metodológica.
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Briefcase,
  Code,
  Layers,
  Sparkles,
  Info,
  Building,
  Home,
  RefreshCw,
  FileText,
} from 'lucide-react';
import type { Vaga } from '../types/vaga';
import {
  extrairTopStacks,
  calcularModalidades,
  calcularSenioridades,
  calcularSalarioMetricas,
  obterHistoricoMercado,
  gerarSnapshotMercado,
} from '../utils/mercadoAnalytics';
import { formatSalary } from '../utils/formatters';
import { RelatorioModal } from './RelatorioModal';

interface MercadoInsightsProps {
  vagas: Vaga[];
}

export const MercadoInsights: React.FC<MercadoInsightsProps> = ({ vagas }) => {
  const [modalRelatorioOpen, setModalRelatorioOpen] = useState<boolean>(false);

  // Processa as estatísticas com useMemo
  const analytics = useMemo(() => {
    const topStacks = extrairTopStacks(vagas);
    const modalidades = calcularModalidades(vagas);
    const senioridades = calcularSenioridades(vagas);
    const salarios = calcularSalarioMetricas(vagas);
    const historico = obterHistoricoMercado();

    return {
      topStacks,
      modalidades,
      senioridades,
      salarios,
      historicoCount: historico.length,
    };
  }, [vagas]);

  if (!vagas || vagas.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
        <BarChart3 className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
        <h3 className="text-base font-bold text-slate-200">Aguardando dados para análise</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Não há vagas ativas carregadas no momento para gerar os gráficos de inteligência de mercado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Cabeçalho Principal da Seção de Insights */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <BarChart3 className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                  Radar de Inteligência de Mercado Tech
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                  Porto Digital & Recife
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Métricas agregadas em tempo real a partir de <strong>{vagas.length} vagas ativas</strong> no ecossistema.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setModalRelatorioOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-400/10 cursor-pointer"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Exportar Relatório
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/80 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Série Temporal Ativa</span>
            </div>
          </div>
        </div>

        {/* Linha de KPIs Rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Analisado</span>
            <span className="text-lg font-bold text-amber-400">{vagas.length} Vagas</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Trabalho Remoto</span>
            <span className="text-lg font-bold text-sky-400">{analytics.modalidades.pctRemoto}% ({analytics.modalidades.remoto})</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Mediana Salarial</span>
            <span className="text-lg font-bold text-emerald-400">
              {analytics.salarios.mediana > 0
                ? formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: analytics.salarios.mediana, negotiable: false })
                : 'A combinar'}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Top Tech #1</span>
            <span className="text-lg font-bold text-slate-100">
              {analytics.topStacks.length > 0 ? analytics.topStacks[0].name : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Principal de Insights (2 Colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ============================================== */}
        {/* COLUNA 1: MODALIDADES E SENIORIDADE            */}
        {/* ============================================== */}
        <div className="space-y-6">
          
          {/* Card: Distribuição por Modalidade de Trabalho */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Modelo de Trabalho no Ecossistema
              </h3>
              <span className="text-xs text-slate-400">Proporção %</span>
            </div>

            {/* Barra de Progresso Truncada */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${analytics.modalidades.pctRemoto}%` }}
                className="bg-sky-400 h-full transition-all duration-500"
                title={`Remoto: ${analytics.modalidades.pctRemoto}%`}
              />
              <div
                style={{ width: `${analytics.modalidades.pctHibrido}%` }}
                className="bg-purple-500 h-full transition-all duration-500"
                title={`Híbrido: ${analytics.modalidades.pctHibrido}%`}
              />
              <div
                style={{ width: `${analytics.modalidades.pctPresencial}%` }}
                className="bg-amber-400 h-full transition-all duration-500"
                title={`Presencial: ${analytics.modalidades.pctPresencial}%`}
              />
            </div>

            {/* Itens com Ícones e Contagem */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <Home className="w-3.5 h-3.5" />
                  <span>Remoto</span>
                </div>
                <p className="text-slate-200 font-bold text-sm">{analytics.modalidades.pctRemoto}%</p>
                <span className="text-[10px] text-slate-500 block">{analytics.modalidades.remoto} vagas</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Híbrido</span>
                </div>
                <p className="text-slate-200 font-bold text-sm">{analytics.modalidades.pctHibrido}%</p>
                <span className="text-[10px] text-slate-500 block">{analytics.modalidades.hibrido} vagas</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Building className="w-3.5 h-3.5" />
                  <span>Presencial</span>
                </div>
                <p className="text-slate-200 font-bold text-sm">{analytics.modalidades.pctPresencial}%</p>
                <span className="text-[10px] text-slate-500 block">{analytics.modalidades.presencial} vagas</span>
              </div>
            </div>
          </div>

          {/* Card: Distribuição por Senioridade */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Nível de Senioridade Demandado
              </h3>
              <span className="text-xs text-slate-400">Extraído dos Títulos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Júnior / Estágio</span>
                <span className="text-lg font-bold text-slate-100">{analytics.senioridades.junior}</span>
                <span className="text-[10px] text-slate-500 block">oportunidades</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Pleno</span>
                <span className="text-lg font-bold text-slate-100">{analytics.senioridades.pleno}</span>
                <span className="text-[10px] text-slate-500 block">oportunidades</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Sênior / Lead</span>
                <span className="text-lg font-bold text-slate-100">{analytics.senioridades.senior}</span>
                <span className="text-[10px] text-slate-500 block">oportunidades</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Geral / Não Esp.</span>
                <span className="text-lg font-bold text-slate-100">{analytics.senioridades.naoEspecificado}</span>
                <span className="text-[10px] text-slate-500 block">oportunidades</span>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================== */}
        {/* COLUNA 2: TOP TECNOLOGIAS E SALÁRIOS          */}
        {/* ============================================== */}
        <div className="space-y-6">
          
          {/* Card: Top Tecnologias Mais Pedidas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                Tecnologias & Stacks Mais Demandadas
              </h3>
              <span className="text-xs text-amber-400 font-semibold">Top {Math.min(8, analytics.topStacks.length)}</span>
            </div>

            {analytics.topStacks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhuma tecnologia mapeada nesta amostra.</p>
            ) : (
              <div className="space-y-2.5">
                {analytics.topStacks.slice(0, 8).map((stack) => (
                  <div key={stack.name} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        {stack.name}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        <strong className="text-slate-200">{stack.count} vagas</strong> ({stack.percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${stack.percentage}%` }}
                        className={`h-full bg-gradient-to-r ${stack.color} rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Análise de Faixas Salariais Informadas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Análise Salarial (Vagas com Faixa Informada)
              </h3>
              <span className="text-xs text-slate-400">
                {analytics.salarios.totalComSalario} de {vagas.length} vagas com valor
              </span>
            </div>

            {analytics.salarios.totalComSalario === 0 ? (
              <p className="text-xs text-slate-400 italic p-2">
                Nenhuma das vagas ativas nesta busca possui salário aberto informado pela empresa ("A combinar").
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">Média Salarial</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: analytics.salarios.media, negotiable: false })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">Mediana (Central)</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: analytics.salarios.mediana, negotiable: false })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">Maior Oferta</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: analytics.salarios.maior, negotiable: false })}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Nota de Transparência Metodológica */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">Transparência Metodológica & Fonte de Dados</p>
          <p className="leading-relaxed text-[11px]">
            As métricas do Radar de Mercado são calculadas em tempo real a partir das oportunidades ativas capturadas da plataforma Sólides para o Porto Digital. A precisão dos gráficos de tendência temporal se consolida continuamente a cada snapshot diário salvo no seu navegador.
          </p>
        </div>
      </div>

      {/* Modal de Exportação do Relatório */}
      <RelatorioModal
        isOpen={modalRelatorioOpen}
        onClose={() => setModalRelatorioOpen(false)}
        snapshot={gerarSnapshotMercado(vagas)}
      />

    </div>
  );
};
