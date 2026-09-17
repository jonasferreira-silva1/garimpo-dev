/**
 * Garimpo Dev — Componente Badge
 * 
 * Exibe badges com estilos personalizados para sinalizar vagas NOVAS,
 * modalidade (Remoto/Híbrido/Presencial) e nível de senioridade.
 */

import React from 'react';

interface BadgeProps {
  variant?: 'nova' | 'remoto' | 'hibrido' | 'presencial' | 'default';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  let styleClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (variant === 'nova') {
    styleClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse font-semibold';
  } else if (variant === 'remoto') {
    styleClasses = 'bg-sky-500/15 text-sky-400 border-sky-500/30';
  } else if (variant === 'hibrido') {
    styleClasses = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  } else if (variant === 'presencial') {
    styleClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styleClasses}`}>
      {children}
    </span>
  );
};
