/**
 * Garimpo Dev — Componente VagaDetalhesModal (Sprint 3)
 * 
 * Exibe um modal responsivo com a descrição completa da vaga renderizada em HTML,
 * detalhes adicionais da oportunidade, salário, localização e botão de candidatura direta.
 */

import React, { useEffect } from 'react';
import { X, Building2, MapPin, DollarSign, ExternalLink, Calendar, Star, CheckCircle2 } from 'lucide-react';
import type { Vaga } from '../types/vaga';
import { isNova, formatSalary, formatLocal, buildVagaUrl } from '../utils/formatters';
import { Badge } from './Badge';

interface VagaDetalhesModalProps {
  vaga: Vaga | null;
  onClose: () => void;
  isFavorito: boolean;
  onToggleFavorito: (id: number) => void;
}

export const VagaDetalhesModal: React.FC<VagaDetalhesModalProps> = ({
  vaga,
  onClose,
  isFavorito,
  onToggleFavorito,
}) => {
  // Efeito para fechar o modal com a tecla ESC e bloquear a rolagem do fundo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (vaga) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [vaga, onClose]);

  if (!vaga) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Overlay para fechar ao clicar fora */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteúdo do Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
        
        {/* Cabeçalho do Modal */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
          <div className="flex items-start gap-4">
            {vaga.companyLogo ? (
              <img
                src={vaga.companyLogo}
                alt={vaga.companyName}
                className="w-14 h-14 rounded-xl object-contain bg-slate-800 p-1.5 border border-slate-700/60 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {nova && <Badge variant="nova">✨ NOVA</Badge>}
                <Badge variant={getModalityVariant()}>
                  {vaga.jobType ? vaga.jobType.toUpperCase() : 'PRESENCIAL'}
                </Badge>
              </div>
              
              <h2 className="text-xl font-bold text-slate-100">{vaga.title}</h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {vaga.companyName || 'Porto Digital'}
              </p>
            </div>
          </div>

          {/* Botão de Fechar */}
          <button
            onClick={onClose}
            aria-label="Fechar detalhes da vaga"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações Rápidas */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{localFormatado}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-400">{salarioFormatado}</span>
          </div>
          {vaga.createdAt && (
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Publicada em: {new Date(vaga.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>

        {/* Corpo do Modal: Descrição em HTML */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          
          {/* Benefícios se existirem */}
          {vaga.benefits && vaga.benefits.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-100 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Benefícios Oferecidos:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {vaga.benefits.map((b) => (
                  <span
                    key={b.id || b.name}
                    className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60 text-slate-300 text-xs"
                  >
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Renderização da Descrição em HTML Sanitizado da Sólides */}
          <div>
            <h4 className="text-sm font-semibold text-slate-100 mb-3">Descrição Detalhada da Vaga</h4>
            {vaga.description ? (
              <div
                className="prose prose-invert max-w-none text-slate-300 space-y-3 prose-p:my-2 prose-ul:list-disc prose-ul:pl-4 prose-li:my-1 prose-strong:text-slate-100"
                dangerouslySetInnerHTML={{ __html: vaga.description }}
              />
            ) : (
              <p className="text-slate-400 italic">Nenhuma descrição detalhada informada pela empresa.</p>
            )}
          </div>

        </div>

        {/* Rodapé do Modal (Ações) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          
          {/* Botão de Favorito */}
          <button
            onClick={() => onToggleFavorito(vaga.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFavorito
                ? 'bg-amber-400/15 text-amber-400 border-amber-400/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorito ? 'fill-amber-400 text-amber-400' : ''}`} />
            {isFavorito ? 'Favoritada' : 'Favoritar Vaga'}
          </button>

          {/* Botão de Candidatura Externa */}
          <a
            href={urlFinal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
          >
            Candidatar-se na Sólides
            <ExternalLink className="w-4 h-4" />
          </a>

        </div>

      </div>
    </div>
  );
};
