/**
 * Garimpo Dev — Componente Paginacao
 * 
 * Controla os botões Anterior e Próximo e exibe a página atual em relação ao total de páginas.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onPageChange: (novaPagina: number) => void;
}

export const Paginacao: React.FC<PaginacaoProps> = ({
  paginaAtual,
  totalPaginas,
  onPageChange,
}) => {
  if (totalPaginas <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-3 pt-6 pb-10" aria-label="Navegação por páginas">
      <button
        onClick={() => onPageChange(paginaAtual - 1)}
        disabled={paginaAtual <= 1}
        className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </button>

      <span className="text-xs text-slate-300 font-medium px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
        Página <strong className="text-amber-400">{paginaAtual}</strong> de {totalPaginas}
      </span>

      <button
        onClick={() => onPageChange(paginaAtual + 1)}
        disabled={paginaAtual >= totalPaginas}
        className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
      >
        Próximo
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
