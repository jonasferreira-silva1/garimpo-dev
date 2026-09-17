/**
 * Garimpo Dev — Componente FiltroBar
 * 
 * Oferece campo de busca por palavra-chave no título e botões de alternância
 * de modalidade (Todos, Remoto, Híbrido, Presencial).
 */

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { FiltrosVaga } from '../types/vaga';

interface FiltroBarProps {
  filtros: FiltrosVaga;
  onFiltrosChange: (novosFiltros: FiltrosVaga) => void;
  totalVagas: number;
}

export const FiltroBar: React.FC<FiltroBarProps> = ({
  filtros,
  onFiltrosChange,
  totalVagas,
}) => {
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({ ...filtros, busca: e.target.value });
  };

  const handleModeloChange = (modelo: string) => {
    onFiltrosChange({ ...filtros, modelo });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Campo de Busca */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cargo ou tecnologia (ex: React, Java)..."
            value={filtros.busca}
            onChange={handleBuscaChange}
            className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-400 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
          />
        </div>

        {/* Seleção de Modalidade */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            Modalidade:
          </span>

          {[
            { id: 'todos', label: 'Todas' },
            { id: 'remoto', label: '🏠 Remoto' },
            { id: 'hibrido', label: '🔄 Híbrido' },
            { id: 'presencial', label: '🏢 Presencial' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModeloChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                filtros.modelo === item.id
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* Contagem de Vagas */}
      <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span>
          Exibindo <strong className="text-amber-400">{totalVagas}</strong> vagas encontradas
        </span>
      </div>
    </div>
  );
};
