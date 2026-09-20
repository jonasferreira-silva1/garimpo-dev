/**
 * Garimpo Dev — Definições de Tipos para o Tracker de Candidaturas
 * 
 * Estrutura o gerenciamento de processos seletivos do usuário,
 * incluindo status, data de aplicação e anotações/observações pessoais.
 */

export type StatusCandidatura = 
  | 'nao_aplicado' 
  | 'aplicado' 
  | 'em_processo' 
  | 'entrevista' 
  | 'recusado' 
  | 'aprovado';

export interface Candidatura {
  vagaId: number;
  status: StatusCandidatura;
  dataAplicacao?: string;       // Formato ISO YYYY-MM-DD
  observacoes?: string;         // ex: "Usei o currículo focado em React/TypeScript"
  historicoModificacao?: string; // Data da última alteração de status
}

// Configuração visual de cores, rótulos e ícones para cada status
export const STATUS_CANDIDATURA_CONFIG: Record<StatusCandidatura, {
  label: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  icon: string;
}> = {
  nao_aplicado: {
    label: 'Não Aplicado',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    borderClass: 'border-slate-800',
    bgClass: 'bg-slate-900/40',
    icon: '⭕',
  },
  aplicado: {
    label: 'Candidatado',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    borderClass: 'border-sky-500/30',
    bgClass: 'bg-sky-950/20',
    icon: '📩',
  },
  em_processo: {
    label: 'Em Análise',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-medium',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-950/20',
    icon: '⏳',
  },
  entrevista: {
    label: 'Entrevista',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30 font-semibold',
    borderClass: 'border-purple-500/30',
    bgClass: 'bg-purple-950/20',
    icon: '🎙️',
  },
  recusado: {
    label: 'Não Selecionado',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    borderClass: 'border-rose-500/30',
    bgClass: 'bg-rose-950/20',
    icon: '❌',
  },
  aprovado: {
    label: 'Aprovado / Oferta',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold animate-pulse',
    borderClass: 'border-emerald-500/40',
    bgClass: 'bg-emerald-950/20',
    icon: '🎉',
  },
};
