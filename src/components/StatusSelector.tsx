/**
 * Garimpo Dev — Componente StatusSelector
 * 
 * Permite que o usuário altere o status do seu processo seletivo para qualquer vaga
 * e adicione anotações/observações personalizadas que persistem no localStorage.
 */

import React, { useState } from 'react';
import type { StatusCandidatura, Candidatura } from '../types/candidatura';
import { STATUS_CANDIDATURA_CONFIG } from '../types/candidatura';
import { FileText, Check } from 'lucide-react';

interface StatusSelectorProps {
  vagaId: number;
  candidatura?: Candidatura;
  onUpdateStatus: (vagaId: number, status: StatusCandidatura, observacoes?: string) => void;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  vagaId,
  candidatura,
  onUpdateStatus,
}) => {
  const currentStatus: StatusCandidatura = candidatura?.status || 'nao_aplicado';
  const config = STATUS_CANDIDATURA_CONFIG[currentStatus];

  const [openObs, setOpenObs] = useState<boolean>(false);
  const [tempObs, setTempObs] = useState<string>(candidatura?.observacoes || '');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoStatus = e.target.value as StatusCandidatura;
    onUpdateStatus(vagaId, novoStatus, tempObs);
  };

  const handleSaveObs = () => {
    onUpdateStatus(vagaId, currentStatus === 'nao_aplicado' ? 'aplicado' : currentStatus, tempObs);
    setOpenObs(false);
  };

  return (
    <div className="space-y-2 pt-2 border-t border-slate-800/80">
      
      {/* Linha Principal do Seletor de Status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <div className="relative inline-block">
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              className={`text-xs px-2.5 py-1 rounded-md border font-medium outline-none cursor-pointer appearance-none pr-6 ${config.badgeClass}`}
            >
              {(Object.keys(STATUS_CANDIDATURA_CONFIG) as StatusCandidatura[]).map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-slate-100 font-normal">
                  {STATUS_CANDIDATURA_CONFIG[st].icon} {STATUS_CANDIDATURA_CONFIG[st].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão para Abrir/Fechar Anotações */}
        <button
          type="button"
          onClick={() => setOpenObs(!openObs)}
          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border transition-colors ${
            candidatura?.observacoes
              ? 'bg-amber-400/15 text-amber-400 border-amber-400/30'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title="Adicionar observação sobre o currículo ou processo"
        >
          <FileText className="w-3 h-3" />
          {candidatura?.observacoes ? 'Nota' : '+ Nota'}
        </button>
      </div>

      {/* Campo Expansível para Anotações Pessoais */}
      {openObs && (
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 animate-fadeIn">
          <label className="block text-[11px] font-semibold text-slate-300">
            Anotações da Candidatura (ex: currículo usado, pretensão):
          </label>
          <textarea
            rows={2}
            value={tempObs}
            onChange={(e) => setTempObs(e.target.value)}
            placeholder="Ex: Apliquei com o currículo focado em React/TypeScript. Contato: recrutador no LinkedIn..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded outline-none focus:border-amber-400 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenObs(false)}
              className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveObs}
              className="flex items-center gap-1 px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded text-[11px] hover:bg-amber-300"
            >
              <Check className="w-3 h-3" />
              Salvar Nota
            </button>
          </div>
        </div>
      )}

      {/* Exibição rápida da nota salva se não estiver editando */}
      {!openObs && candidatura?.observacoes && (
        <p className="text-[11px] text-amber-300/90 italic bg-amber-500/5 border border-amber-500/10 p-1.5 rounded line-clamp-2">
          📝 "{candidatura.observacoes}"
        </p>
      )}

    </div>
  );
};
