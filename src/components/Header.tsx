/**
 * Garimpo Dev — Componente Header
 * 
 * Cabeçalho principal com marca, navegação por abas principais (Vagas, Eventos, Candidaturas),
 * indicador de status em tempo real e atalho "Sobre o Projeto".
 */

import React from 'react';
import { Compass, Sparkles, MapPin, RefreshCw, Info, Briefcase, Calendar, ClipboardList } from 'lucide-react';

export type AbaNavegacao = 'vagas' | 'eventos' | 'candidaturas';

interface HeaderProps {
  abaAtiva: AbaNavegacao;
  onAbaChange: (aba: AbaNavegacao) => void;
  totalCandidaturas?: number;
  ultimaAtualizacao?: string;
  onRecarregar?: () => void;
  onOpenSobre?: () => void;
  loading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  abaAtiva,
  onAbaChange,
  totalCandidaturas = 0,
  ultimaAtualizacao,
  onRecarregar,
  onOpenSobre,
  loading = false,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* Linha Superior: Marca e Ações Globais */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Marca & Título */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                    Garimpo Dev
                  </h1>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium shrink-0">
                    v2.5 Full
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  Radar Tech Recife & Porto Digital
                </p>
              </div>
            </div>

            {/* Selo Ao Vivo no Mobile (à direita) */}
            <div className="flex sm:hidden items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/60 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">Ao Vivo</span>
            </div>
          </div>

          {/* Indicadores & Botões de Ação */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            
            {ultimaAtualizacao && abaAtiva === 'vagas' && (
              <span className="text-xs text-slate-400 hidden lg:inline">
                Atualizado: <strong className="text-slate-200">{ultimaAtualizacao}</strong>
              </span>
            )}

            {onRecarregar && abaAtiva === 'vagas' && (
              <button
                onClick={onRecarregar}
                disabled={loading}
                title="Atualizar vagas agora"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            )}

            {onOpenSobre && (
              <button
                onClick={onOpenSobre}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Sobre</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Ao Vivo
              </span>
            </div>

          </div>

        </div>

        {/* Linha Inferior: Navegação Principal por Abas com Rolagem Horizontal Suave */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none max-w-full pb-0.5">
          
          {/* Aba Vagas */}
          <button
            onClick={() => onAbaChange('vagas')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              abaAtiva === 'vagas'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            Vagas Tech
          </button>

          {/* Aba Eventos Tech */}
          <button
            onClick={() => onAbaChange('eventos')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              abaAtiva === 'eventos'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            Eventos & Meetups
          </button>

          {/* Aba Tracker de Candidaturas */}
          <button
            onClick={() => onAbaChange('candidaturas')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              abaAtiva === 'candidaturas'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            Minhas Candidaturas
            {totalCandidaturas > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                abaAtiva === 'candidaturas'
                  ? 'bg-slate-950 text-amber-400 font-extrabold'
                  : 'bg-amber-400 text-slate-950 font-extrabold'
              }`}>
                {totalCandidaturas}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
