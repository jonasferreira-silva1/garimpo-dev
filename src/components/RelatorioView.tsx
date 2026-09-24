/**
 * Garimpo Dev — Componente RelatorioView (Sprint 8)
 * 
 * Visão limpa e institucional do Relatório de Inteligência de Mercado Tech,
 * pronta para exibição na tela e otimizada para impressão / exportação em PDF (@media print).
 */

import React, { useMemo } from 'react';
import { Compass, Building2, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { MercadoSnapshot } from '../types/mercado';
import { formatSalary } from '../utils/formatters';

interface RelatorioViewProps {
  snapshot: MercadoSnapshot;
}

export const RelatorioView: React.FC<RelatorioViewProps> = ({ snapshot }) => {
  const dataFormatada = useMemo(() => {
    if (!snapshot || !snapshot.timestamp) return new Date().toLocaleDateString('pt-BR');
    return new Date(snapshot.timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [snapshot]);

  if (!snapshot) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        Nenhum dado disponível no momento para geração do relatório.
      </div>
    );
  }

  const { modalidades, senioridades, salarios, topStacks, totalVagas } = snapshot;

  return (
    <div className="bg-slate-900 text-slate-100 p-4 sm:p-8 border border-slate-800 rounded-2xl max-w-3xl mx-auto space-y-6 shadow-2xl print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0">
      
      {/* Cabeçalho Institucional do Relatório (Estilizado para Print & Tela) */}
      <div className="border-b border-slate-800 print:border-slate-300 pb-4 sm:pb-5 space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 print:border print:border-slate-400">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-100 print:text-slate-900 leading-tight">
                Relatório de Inteligência de Mercado Tech
              </h1>
              <p className="text-xs text-amber-400 print:text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Recife & Ecossistema Porto Digital — Pernambuco, Brasil
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-none print:border-none flex sm:block items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 print:text-slate-600 block">Data de Emissão:</span>
            <span className="text-xs font-bold text-slate-200 print:text-slate-900">{dataFormatada}</span>
          </div>
        </div>
      </div>

      {/* Resumo dos Dados Coletados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:grid-cols-4">
        <div className="p-3 bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">Total Vagas</span>
          <p className="text-base font-extrabold text-amber-400 print:text-amber-700">{totalVagas}</p>
        </div>

        <div className="p-3 bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">% Presencial</span>
          <p className="text-base font-extrabold text-amber-400 print:text-amber-700">{modalidades.pctPresencial}%</p>
        </div>

        <div className="p-3 bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">% Remoto</span>
          <p className="text-base font-extrabold text-sky-400 print:text-sky-700">{modalidades.pctRemoto}%</p>
        </div>

        <div className="p-3 bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">Mediana Salarial</span>
          <p className="text-base font-extrabold text-emerald-400 print:text-emerald-700">
            {salarios.mediana > 0
              ? formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: salarios.mediana, negotiable: false })
              : 'A combinar'}
          </p>
        </div>
      </div>

      {/* Seção 1: Top Stacks Demadas */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 print:text-slate-900 border-b border-slate-800 print:border-slate-300 pb-1.5 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400 print:text-slate-700" />
          Top Tecnologias em Destaque no Ecossistema
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {(topStacks || []).slice(0, 6).map((stack) => (
            <div
              key={stack.name}
              className="p-2.5 rounded-lg bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 flex items-center justify-between"
            >
              <span className="font-semibold text-slate-200 print:text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 print:text-amber-600" />
                {stack.name}
              </span>
              <span className="text-slate-400 print:text-slate-700 font-bold">
                {stack.percentage}% das vagas ({stack.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 2: Senioridades e Faixa Salarial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Senioridade */}
        <div className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 space-y-2">
          <h3 className="font-bold text-slate-200 print:text-slate-900 text-xs">Distribuição por Senioridade</h3>
          <ul className="space-y-1 text-slate-300 print:text-slate-700 text-[11px]">
            <li>• Júnior / Estágio: <strong>{senioridades.junior} vagas</strong></li>
            <li>• Pleno: <strong>{senioridades.pleno} vagas</strong></li>
            <li>• Sênior / Lead: <strong>{senioridades.senior} vagas</strong></li>
            <li>• Geral / Não especificado: <strong>{senioridades.naoEspecificado} vagas</strong></li>
          </ul>
        </div>

        {/* Faixa Salarial */}
        <div className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 space-y-2">
          <h3 className="font-bold text-slate-200 print:text-slate-900 text-xs">Amostragem Salarial</h3>
          {salarios.totalComSalario > 0 ? (
            <ul className="space-y-1 text-slate-300 print:text-slate-700 text-[11px]">
              <li>• Vagas com valor aberto: <strong>{salarios.totalComSalario} de {totalVagas}</strong></li>
              <li>• Média Salarial: <strong>{formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: salarios.media, negotiable: false })}</strong></li>
              <li>• Mediana: <strong>{formatSalary({ type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: salarios.mediana, negotiable: false })}</strong></li>
            </ul>
          ) : (
            <p className="text-[11px] text-slate-400 print:text-slate-600 italic">
              Todas as vagas ativas nesta amostra possuem formato "A combinar" / negociável.
            </p>
          )}
        </div>

      </div>

      {/* Rodapé Metodológico Institucional */}
      <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-start gap-2.5 text-[11px] text-slate-400 print:text-slate-600">
        <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Procedência & Autenticidade:</strong> Este relatório foi gerado automaticamente pela plataforma Garimpo Dev a partir de dados em tempo real da API pública oficial da Sólides para o ecossistema do Porto Digital (Recife/PE).
        </p>
      </div>

    </div>
  );
};
