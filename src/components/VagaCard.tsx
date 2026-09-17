/**
 * Garimpo Dev — Componente VagaCard
 * 
 * Exibe as informações essenciais de cada vaga em formato de card limpo e responsivo.
 * Aplica as utilidades de formatação de salário, localização, badge "NOVA"
 * e utiliza a URL corrigida para o redirecionamento.
 */

import React from 'react';
import { Building2, MapPin, DollarSign, ExternalLink, Calendar } from 'lucide-react';
import type { Vaga } from '../types/vaga';
import { isNova, formatSalary, formatLocal, buildVagaUrl } from '../utils/formatters';
import { Badge } from './Badge';

interface VagaCardProps {
  vaga: Vaga;
}

export const VagaCard: React.FC<VagaCardProps> = ({ vaga }) => {
  const nova = isNova(vaga.createdAt);
  const salarioFormatado = formatSalary(vaga.salary);
  const localFormatado = formatLocal(vaga);
  const urlFinal = buildVagaUrl(vaga.slug, vaga.id);

  // Define a variante da badge baseada na modalidade
  const getModalityVariant = () => {
    if (vaga.homeOffice || vaga.jobType === 'remoto') return 'remoto';
    if (vaga.jobType === 'hibrido') return 'hibrido';
    return 'presencial';
  };

  return (
    <article className="group bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between gap-4 shadow-lg hover:shadow-amber-500/5">
      
      {/* Cabeçalho do Card (Empresa, Logo e Badges) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {vaga.companyLogo ? (
            <img
              src={vaga.companyLogo}
              alt={vaga.companyName}
              className="w-11 h-11 rounded-lg object-contain bg-slate-800 p-1 border border-slate-700/50"
              onError={(e) => {
                // Fallback caso a imagem da logo falhe
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

        {/* Badge NOVA se criada nas últimas 48h */}
        {nova && <Badge variant="nova">✨ NOVA</Badge>}
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

      {/* Rótulos e Botão de Ação */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <Badge variant={getModalityVariant()}>
          {vaga.jobType ? vaga.jobType.toUpperCase() : 'PRESENCIAL'}
        </Badge>

        <a
          href={urlFinal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md shadow-amber-400/10"
        >
          Ver Vaga
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </article>
  );
};
