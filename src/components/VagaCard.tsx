/**
 * Garimpo Dev — Componente VagaCard
 * 
 * Exibe as informações essenciais de cada vaga em formato de card limpo e responsivo.
 * Inclui botão de favoritar vaga, visualização de detalhes em modal, redirecionamento
 * para candidatura e o seletor de status do Tracker de Candidaturas.
 */

import React from 'react';
import { Building2, MapPin, DollarSign, ExternalLink, Calendar, Star, Eye } from 'lucide-react';
import type { Vaga } from '../types/vaga';
import type { Candidatura, StatusCandidatura } from '../types/candidatura';
import { isNova, formatSalary, formatLocal, buildVagaUrl } from '../utils/formatters';
import { Badge } from './Badge';
import { StatusSelector } from './StatusSelector';

interface VagaCardProps {
  vaga: Vaga;
  isFavorito: boolean;
  onToggleFavorito: (id: number) => void;
  onVerDetalhes: (vaga: Vaga) => void;
  candidatura?: Candidatura;
  onUpdateStatus?: (vagaId: number, status: StatusCandidatura, observacoes?: string) => void;
}

export const VagaCard: React.FC<VagaCardProps> = ({
  vaga,
  isFavorito,
  onToggleFavorito,
  onVerDetalhes,
  candidatura,
  onUpdateStatus,
}) => {
  const nova = isNova(vaga.createdAt);
  const salarioFormatado = formatSalary(vaga.salary);
  const localFormatado = formatLocal(vaga);
  const urlFinal = buildVagaUrl(vaga.slug, vaga.id);

  const getModalityVariant = () => {
    if (vaga.homeOffice || vaga.jobType === 'remoto') return 'remoto';
    if (vaga.jobType === 'hibrido') return 'hibrido';
    return 'presencial';
  };

  return (
    <article className="group bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between gap-4 shadow-lg hover:shadow-amber-500/5 relative">
      
      {/* Cabeçalho do Card (Empresa, Logo, Badges e Botão de Favorito) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {vaga.companyLogo ? (
            <img
              src={vaga.companyLogo}
              alt={vaga.companyName}
              className="w-11 h-11 rounded-lg object-contain bg-slate-800 p-1 border border-slate-700/50"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400">
              <Building2 className="w-5 h-5" />
            </div>
          )}

          <div>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
              {vaga.title}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 font-medium mt-0.5">
              <Building2 className="w-3 h-3 text-slate-500" />
              {vaga.companyName || 'Porto Digital'}
            </p>
          </div>
        </div>

        {/* Grupo de Ações Superiores: Badge NOVA + Estrela Favorito */}
        <div className="flex items-center gap-2 shrink-0">
          {nova && <Badge variant="nova">✨ NOVA</Badge>}
          
          <button
            onClick={() => onToggleFavorito(vaga.id)}
            title={isFavorito ? 'Remover dos favoritos' : 'Favoritar vaga'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorito
                ? 'bg-amber-400/20 border-amber-400/40 text-amber-400'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-amber-400 hover:bg-slate-700'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorito ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Detalhes da Vaga (Localização, Salário, Data) */}
      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{localFormatado}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-emerald-400">{salarioFormatado}</span>
        </div>

        {vaga.createdAt && (
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Publicada em: {new Date(vaga.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      {/* Seletor de Status de Candidatura (Tracker) */}
      {onUpdateStatus && (
        <StatusSelector
          vagaId={vaga.id}
          candidatura={candidatura}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {/* Rótulos e Botões de Ação */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <Badge variant={getModalityVariant()}>
          {vaga.jobType ? vaga.jobType.toUpperCase() : 'PRESENCIAL'}
        </Badge>

        <div className="flex items-center gap-2">
          {/* Botão para Abrir Modal de Detalhes */}
          <button
            onClick={() => onVerDetalhes(vaga)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            Detalhes
          </button>

          {/* Botão de Redirecionamento Direto */}
          <a
            href={urlFinal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md shadow-amber-400/10"
          >
            Ver Vaga
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </article>
  );
};
