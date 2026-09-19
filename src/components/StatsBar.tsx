/**
 * Garimpo Dev — Componente StatsBar (Sprint 4)
 * 
 * Painel de estatísticas com indicadores em tempo real das vagas encontradas,
 * detalhando distribuição por modalidade (Remoto, Híbrido, Presencial) e vagas recentes.
 */

import React from 'react';
import { Briefcase, Home, RefreshCw, Building, Sparkles } from 'lucide-react';
import type { Vaga } from '../types/vaga';
import { isNova } from '../utils/formatters';

interface StatsBarProps {
  vagas: Vaga[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ vagas }) => {
  const total = vagas.length;
  const remotas = vagas.filter((v) => v.homeOffice || v.jobType === 'remoto').length;
  const hibridas = vagas.filter((v) => v.jobType === 'hibrido').length;
  const presenciais = vagas.filter((v) => !v.homeOffice && v.jobType === 'presencial').length;
  const novas = vagas.filter((v) => isNova(v.createdAt)).length;

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5">
      
      {/* Total de Vagas */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Vagas</p>
          <p className="text-sm font-bold text-slate-100">{total}</p>
        </div>
      </div>

      {/* Vagas Remotas */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
          <Home className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Remoto</p>
          <p className="text-sm font-bold text-sky-400">{remotas}</p>
        </div>
      </div>

      {/* Vagas Híbridas */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Híbrido</p>
          <p className="text-sm font-bold text-purple-400">{hibridas}</p>
        </div>
      </div>

      {/* Vagas Presenciais */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Presencial</p>
          <p className="text-sm font-bold text-amber-400">{presenciais}</p>
        </div>
      </div>

      {/* Vagas Novas (<48h) */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Novas (&lt;48h)</p>
          <p className="text-sm font-bold text-emerald-400">{novas}</p>
        </div>
      </div>

    </div>
  );
};
