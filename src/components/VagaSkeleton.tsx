/**
 * Garimpo Dev — Componente VagaSkeleton (Sprint 4)
 * 
 * Exibe um cartão de carregamento animado com efeito shimmer
 * enquanto as vagas reais estão sendo buscadas na API.
 */

import React from 'react';

export const VagaSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-800" />
          <div className="space-y-2">
            <div className="w-36 h-4 bg-slate-800 rounded" />
            <div className="w-24 h-3 bg-slate-800/60 rounded" />
          </div>
        </div>
        <div className="w-14 h-5 bg-slate-800 rounded-md" />
      </div>

      <div className="space-y-2 pt-1">
        <div className="w-40 h-3 bg-slate-800/60 rounded" />
        <div className="w-28 h-3 bg-slate-800/60 rounded" />
        <div className="w-32 h-3 bg-slate-800/40 rounded" />
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="w-16 h-4 bg-slate-800 rounded" />
        <div className="w-20 h-7 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};
