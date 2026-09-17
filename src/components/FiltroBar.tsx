/**
 * Garimpo Dev — Componente FiltroBar (Sprint 3)
 * 
 * Oferece busca por palavra-chave no título, seletor de empresa/slug,
 * botões de modalidade e alternância para aba "Minhas Favoritas".
 */

import React from 'react';
import { Search, SlidersHorizontal, Building2, Star } from 'lucide-react';
import type { FiltrosVaga } from '../types/vaga';
import { SLUGS_EMPRESAS } from '../types/vaga';

interface FiltroBarProps {
  filtros: FiltrosVaga;
  onFiltrosChange: (novosFiltros: FiltrosVaga) => void;
  totalVagas: number;
  totalFavoritos: number;
}

export const FiltroBar: React.FC<FiltroBarProps> = ({
  filtros,
  onFiltrosChange,
  totalVagas,
  totalFavoritos,
}) => {
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({ ...filtros, busca: e.target.value });
  };

  const handleModeloChange = (modelo: string) => {
    onFiltrosChange({ ...filtros, modelo });
  };

  const handleSlugEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({ ...filtros, slugEmpresa: e.target.value });
  };

  const toggleApenasFavoritas = () => {
    onFiltrosChange({ ...filtros, apenasFavoritas: !filtros.apenasFavoritas });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      
      {/* Linha Superior: Busca por Texto, Seletor de Empresa e Botão Favoritas */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Campo de Busca por Palavra-Chave */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cargo ou tecnologia (ex: React, Java, Python)..."
            value={filtros.busca}
            onChange={handleBuscaChange}
            className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-400 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
          />
        </div>

        {/* Seletor de Empresa / Slug */}
        <div className="relative w-full md:w-60">
          <Building2 className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filtros.slugEmpresa}
            onChange={handleSlugEmpresaChange}
            className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-400 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors appearance-none cursor-pointer"
          >
            {SLUGS_EMPRESAS.map((slug) => (
              <option key={slug.id} value={slug.id} className="bg-slate-900 text-slate-100">
                {slug.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de Alternância: Apenas Favoritas */}
        <button
          onClick={toggleApenasFavoritas}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all shrink-0 w-full md:w-auto ${
            filtros.apenasFavoritas
              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-400/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Star className={`w-4 h-4 ${filtros.apenasFavoritas ? 'fill-slate-950' : 'text-amber-400'}`} />
          Favoritas ({totalFavoritos})
        </button>

      </div>

      {/* Linha Inferior: Seleção por Modalidade e Resumo */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
        
        {/* Filtros por Modalidade */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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

        {/* Resumo de Vagas Exibidas */}
        <div className="text-xs text-slate-400 shrink-0">
          <span>
            Exibindo <strong className="text-amber-400">{totalVagas}</strong> vagas encontradas
          </span>
        </div>

      </div>

    </div>
  );
};
