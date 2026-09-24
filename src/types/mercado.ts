/**
 * Garimpo Dev — Definições de Tipos para o Radar de Mercado & Analytics (Sprint 7)
 * 
 * Mapeia as estruturas de dados agregadas para métricas de tecnologias,
 * modalidades de trabalho, distribuição de senioridade e faixas salariais.
 */

export interface StackCount {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ModalidadeCount {
  remoto: number;
  hibrido: number;
  presencial: number;
  pctRemoto: number;
  pctHibrido: number;
  pctPresencial: number;
}

export interface SenioridadeCount {
  junior: number;
  pleno: number;
  senior: number;
  naoEspecificado: number;
}

export interface SalarioMetric {
  totalComSalario: number;
  media: number;
  mediana: number;
  maior: number;
  menor: number;
}

export interface MercadoSnapshot {
  data: string; // Formato YYYY-MM-DD
  timestamp: number;
  totalVagas: number;
  modalidades: ModalidadeCount;
  senioridades: SenioridadeCount;
  salarios: SalarioMetric;
  topStacks: StackCount[];
}
