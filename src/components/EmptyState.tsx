/**
 * Garimpo Dev — Componente EmptyState
 * 
 * Exibido quando a busca por vagas não retorna resultados ou quando ocorre um erro na API.
 */

import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  mensagem?: string;
  onLimparFiltros?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  mensagem = 'Nenhuma vaga encontrada com os filtros atuais.',
  onLimparFiltros,
}) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 my-8">
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">Ops! Nada por aqui.</h3>
      <p className="text-xs text-slate-400 max-w-sm">{mensagem}</p>

      {onLimparFiltros && (
        <button
          onClick={onLimparFiltros}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Limpar Filtros
        </button>
      )}
    </div>
  );
};
