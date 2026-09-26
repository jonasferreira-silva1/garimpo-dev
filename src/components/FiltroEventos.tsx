/**
 * Garimpo Dev — Componente FiltroEventos
 * 
 * Barra de busca e filtros específicos para o catálogo de eventos tech.
 */

import React from 'react';
import { Search, SlidersHorizontal, Ticket } from 'lucide-react';
import type { FiltrosEvento } from '../types/evento';
import { DATA_ULTIMA_CURADORIA_EVENTOS } from '../data/eventos';

interface FiltroEventosProps {
  filtros: FiltrosEvento;
  onFiltrosChange: (novosFiltros: FiltrosEvento) => void;
  totalEventos: number;
}

export const FiltroEventos: React.FC<FiltroEventosProps> = ({
  filtros,
  onFiltrosChange,
  totalEventos,
}) => {
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({ ...filtros, busca: e.target.value });
  };

  const handleModalidadeChange = (modalidade: string) => {
    onFiltrosChange({ ...filtros, modalidade });
  };

  const toggleGratuitos = () => {
    onFiltrosChange({ ...filtros, apenasGratuitos: !filtros.apenasGratuitos });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Campo de Pesquisa de Eventos */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar evento por nome ou tema (ex: React, IA, Frontend, Dados)..."
            value={filtros.busca}
            onChange={handleBuscaChange}
            className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-400 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
          />
        </div>

        {/* Botão de Alternância: Apenas Gratuitos */}
        <button
          onClick={toggleGratuitos}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all shrink-0 w-full md:w-auto ${
            filtros.apenasGratuitos
              ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-400/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Ticket className={`w-4 h-4 ${filtros.apenasGratuitos ? 'fill-slate-950' : 'text-emerald-400'}`} />
          Apenas Gratuitos
        </button>

      </div>

      {/* Seleção de Modalidade do Evento */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            Modalidade:
          </span>

          {[
            { id: 'todas', label: 'Todas' },
            { id: 'presencial', label: '🏢 Presencial' },
            { id: 'online', label: '🌐 Online' },
            { id: 'hibrido', label: '🔄 Híbrido' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModalidadeChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                filtros.modalidade === item.id
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Resumo de Eventos Exibidos & Badge de Curadoria */}
        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Curadoria: {DATA_ULTIMA_CURADORIA_EVENTOS.split('-').reverse().join('/')}
          </span>
          <span>
            Exibindo <strong className="text-amber-400">{totalEventos}</strong> eventos cadastrados
          </span>
        </div>
      </div>
    </div>
  );
};
