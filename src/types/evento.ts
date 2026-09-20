/**
 * Garimpo Dev — Definições de Tipos para Eventos & Palestras Tech
 * 
 * Mapeia os dados de meetups, conferências e workshops de tecnologia em Recife/Porto Digital.
 */

export interface Evento {
  id: number;
  nome: string;              // ex: "RecPlay 2026"
  descricao: string;         // Descrição do evento
  data: string;              // Formato YYYY-MM-DD
  horario?: string;          // ex: "19:00 - 21:00"
  local: string;             // ex: "Porto Digital - Recife Antigo" ou "Online (YouTube)"
  modalidade: 'presencial' | 'online' | 'hibrido';
  tema: string;              // ex: "Frontend", "Inteligência Artificial", "Carreira", "Dados"
  linkInscricao: string;     // URL externa para inscrição
  gratuito: boolean;         // Se o evento é gratuito
  organizador?: string;       // ex: "Comunidade React Recife", "CESAR"
}

export interface FiltrosEvento {
  busca: string;             // Filtro por nome ou palavra-chave
  modalidade: string;        // "todas" | "presencial" | "online" | "hibrido"
  tema: string;              // "todos" ou tema específico
  apenasGratuitos: boolean;  // Filtrar apenas eventos gratuitos
}
