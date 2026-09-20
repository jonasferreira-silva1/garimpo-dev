/**
 * Garimpo Dev — Componente EventoCard
 * 
 * Exibe as informações de um evento ou meetup de tecnologia em Recife,
 * incluindo o badge "Esta Semana", modalidade, gratuito/pago e link de inscrição.
 */

import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Ticket, Users } from 'lucide-react';
import type { Evento } from '../types/evento';
import { isEstaSemana } from '../utils/formatters';
import { Badge } from './Badge';

interface EventoCardProps {
  evento: Evento;
}

export const EventoCard: React.FC<EventoCardProps> = ({ evento }) => {
  const estaSemana = isEstaSemana(evento.data);

  const getModalityVariant = () => {
    if (evento.modalidade === 'online') return 'remoto';
    if (evento.modalidade === 'hibrido') return 'hibrido';
    return 'presencial';
  };

  // Formata a data ISO YYYY-MM-DD para o formato pt-BR estendido
  const dataFormatada = new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between gap-4 shadow-lg hover:shadow-amber-500/5">
      
      {/* Cabeçalho do Card (Organizador, Nome e Badges) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {evento.organizador ? (
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {evento.organizador}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Evento Tech Recife</span>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {estaSemana && <Badge variant="nova">⚡ ESTA SEMANA</Badge>}
            <Badge variant={getModalityVariant()}>
              {evento.modalidade.toUpperCase()}
            </Badge>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-100 line-clamp-2 leading-snug">
          {evento.nome}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {evento.descricao}
        </p>
      </div>

      {/* Detalhes de Data, Horário e Local */}
      <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-200">{dataFormatada}</span>
          </div>

          {evento.horario && (
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{evento.horario}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="line-clamp-1">{evento.local}</span>
        </div>

        <div className="flex items-center gap-2">
          <Ticket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium text-emerald-400">
            {evento.gratuito ? 'Gratuito' : 'Ingresso Pago'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{evento.tema}</span>
        </div>
      </div>

      {/* Botão de Inscrição Externa */}
      <div className="pt-2">
        <a
          href={evento.linkInscricao}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md shadow-amber-400/10"
        >
          Garantir Vaga / Inscrever-se
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </article>
  );
};
