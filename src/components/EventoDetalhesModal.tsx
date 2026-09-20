/**
 * Garimpo Dev — Componente EventoDetalhesModal
 * 
 * Exibe um modal completo ao clicar em um card de evento, apresentando
 * a descrição estendida, local no mapa, organizador e procedência oficial verificada.
 */

import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, ExternalLink, Users, ShieldCheck, Navigation } from 'lucide-react';
import type { Evento } from '../types/evento';
import { isEstaSemana } from '../utils/formatters';
import { Badge } from './Badge';

interface EventoDetalhesModalProps {
  evento: Evento | null;
  onClose: () => void;
}

export const EventoDetalhesModal: React.FC<EventoDetalhesModalProps> = ({ evento, onClose }) => {
  // Efeito para fechar o modal com a tecla ESC e travar scroll do fundo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (evento) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [evento, onClose]);

  if (!evento) return null;

  const estaSemana = isEstaSemana(evento.data);

  const getModalityVariant = () => {
    if (evento.modalidade === 'online') return 'remoto';
    if (evento.modalidade === 'hibrido') return 'hibrido';
    return 'presencial';
  };

  const dataFormatada = new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Overlay transparente para fechar ao clicar fora */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteúdo Principal do Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
        
        {/* Cabeçalho do Modal */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {estaSemana && <Badge variant="nova">⚡ ESTA SEMANA</Badge>}
              <Badge variant={getModalityVariant()}>
                {evento.modalidade.toUpperCase()}
              </Badge>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {evento.gratuito ? 'Gratuito' : 'Ingresso Pago'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-100 leading-snug">{evento.nome}</h2>
            
            {evento.organizador && (
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Organizado por: {evento.organizador}
              </p>
            )}
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            aria-label="Fechar detalhes do evento"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações Rápidas de Data, Horário e Local */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="capitalize">{dataFormatada}</span>
          </div>

          {evento.horario && (
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Horário: {evento.horario}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-300 sm:col-span-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{evento.local}</span>
            {evento.mapaUrl && (
              <a
                href={evento.mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1 shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                Ver no Mapa
              </a>
            )}
          </div>
        </div>

        {/* Corpo do Modal (Descrição + Caixa de Procedência Verificada) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          
          {/* Descrição Detalhada */}
          <div>
            <h4 className="text-sm font-semibold text-slate-100 mb-2">Sobre o Evento / Meetup</h4>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
              {evento.descricao}
            </p>
          </div>

          {/* Painel de Procedência e Autenticidade */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Procedência & Origem Verificada pelo Garimpo Dev</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Este evento foi curado e validado diretamente das fontes oficiais do ecossistema de tecnologia de Pernambuco.
            </p>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Fonte Registrada:</span>{' '}
                <strong className="text-slate-200">{evento.fonteProcedencia || 'Fonte Oficial Verificada'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Categoria / Tema:</span>{' '}
                <strong className="text-slate-200">{evento.tema}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé do Modal (Ação de Inscrição Externa) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>

          <a
            href={evento.linkInscricao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
          >
            Acessar Inscrição na Fonte Oficial
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
