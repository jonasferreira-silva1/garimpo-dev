/**
 * Garimpo Dev — Componente Header (Sprint 3)
 * 
 * Cabeçalho principal com marca, status de conexão em tempo real,
 * horário da última atualização e botão de recarregar manual.
 */

import React from 'react';
import { Compass, Sparkles, MapPin, RefreshCw } from 'lucide-react';

interface HeaderProps {
  ultimaAtualizacao?: string;
  onRecarregar?: () => void;
  loading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  ultimaAtualizacao,
  onRecarregar,
  loading = false,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Marca & Título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Compass className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                Garimpo Dev
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                v1.5 Sprint 3
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              Radar de vagas tech em Recife & Porto Digital
            </p>
          </div>
        </div>

        {/* Indicador de Status + Última Atualização + Botão Recarregar */}
        <div className="flex items-center gap-3">
          
          {ultimaAtualizacao && (
            <span className="text-xs text-slate-400 hidden md:inline">
              Última atualização: <strong className="text-slate-200">{ultimaAtualizacao}</strong>
            </span>
          )}

          {onRecarregar && (
            <button
              onClick={onRecarregar}
              disabled={loading}
              title="Atualizar lista de vagas agora"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/60 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Multi-API Sólides
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
