/**
 * Garimpo Dev — Componente CandidaturasView (Mini-Kanban Tracker)
 * 
 * Exibe o painel consolidado de processos seletivos do usuário,
 * agrupados por fase do processo (Candidatado, Em Análise, Entrevista, Aprovado, Recusado).
 */

import React from 'react';
import type { Candidatura, StatusCandidatura } from '../types/candidatura';
import { STATUS_CANDIDATURA_CONFIG } from '../types/candidatura';
import type { Vaga } from '../types/vaga';
import { VagaCard } from './VagaCard';
import { EmptyState } from './EmptyState';
import { ClipboardList } from 'lucide-react';

interface CandidaturasViewProps {
  candidaturas: Candidatura[];
  vagasMap: Map<number, Vaga>;
  isFavorito: (id: number) => boolean;
  onToggleFavorito: (id: number) => void;
  onVerDetalhes: (vaga: Vaga) => void;
  onUpdateStatus: (vagaId: number, status: StatusCandidatura, observacoes?: string) => void;
}

export const CandidaturasView: React.FC<CandidaturasViewProps> = ({
  candidaturas,
  vagasMap,
  isFavorito,
  onToggleFavorito,
  onVerDetalhes,
  onUpdateStatus,
}) => {
  if (candidaturas.length === 0) {
    return (
      <EmptyState
        mensagem="Você ainda não marcou nenhuma vaga com status de candidatura. Altere o status de qualquer vaga nos cards para iniciar seu acompanhamento!"
      />
    );
  }

  // Agrupa as candidaturas por status
  const grupos: Record<StatusCandidatura, Candidatura[]> = {
    nao_aplicado: [],
    aplicado: [],
    em_processo: [],
    entrevista: [],
    aprovado: [],
    recusado: [],
  };

  candidaturas.forEach((c) => {
    if (grupos[c.status]) {
      grupos[c.status].push(c);
    }
  });

  const fasesAtivas: StatusCandidatura[] = ['aplicado', 'em_processo', 'entrevista', 'aprovado', 'recusado'];

  return (
    <div className="space-y-8">
      
      {/* Resumo do Tracker */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Painel de Candidaturas</h2>
            <p className="text-xs text-slate-400">
              Acompanhe todas as suas candidaturas ativas organizadas por etapa do processo seletivo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {fasesAtivas.map((fase) => {
            const qtd = grupos[fase].length;
            if (qtd === 0) return null;
            const cfg = STATUS_CANDIDATURA_CONFIG[fase];
            return (
              <span key={fase} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${cfg.badgeClass}`}>
                {cfg.icon} {cfg.label}: <strong>{qtd}</strong>
              </span>
            );
          })}
        </div>
      </div>

      {/* Seções por Fase do Processo Seletivo */}
      {fasesAtivas.map((fase) => {
        const lista = grupos[fase];
        if (lista.length === 0) return null;
        const config = STATUS_CANDIDATURA_CONFIG[fase];

        return (
          <section key={fase} className="space-y-4">
            
            {/* Título da Fase */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="text-lg">{config.icon}</span>
              <h3 className="text-base font-bold text-slate-200">{config.label}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {lista.length}
              </span>
            </div>

            {/* Grid de Vagas da Fase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lista.map((item) => {
                const vagaObj = vagasMap.get(item.vagaId);
                
                // Se o objeto completo da vaga estiver em memória
                if (vagaObj) {
                  return (
                    <VagaCard
                      key={item.vagaId}
                      vaga={vagaObj}
                      isFavorito={isFavorito(item.vagaId)}
                      onToggleFavorito={onToggleFavorito}
                      onVerDetalhes={onVerDetalhes}
                      candidatura={item}
                      onUpdateStatus={onUpdateStatus}
                    />
                  );
                }

                // Fallback caso a vaga não esteja na lista filtrada atual da API
                return (
                  <div key={item.vagaId} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded border ${config.badgeClass}`}>
                        {config.icon} {config.label}
                      </span>
                      <span className="text-[10px] text-slate-500">ID Vaga: #{item.vagaId}</span>
                    </div>

                    <p className="text-xs text-slate-300 font-semibold">Vaga #{item.vagaId} salva no tracker</p>
                    
                    {item.observacoes && (
                      <p className="text-xs text-amber-300/90 italic bg-amber-500/5 p-2 rounded border border-amber-500/10">
                        📝 "{item.observacoes}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => onUpdateStatus(item.vagaId, 'nao_aplicado')}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Remover do Tracker
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>
        );
      })}

    </div>
  );
};
