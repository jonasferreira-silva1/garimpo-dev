/**
 * Garimpo Dev — Definições de Tipos para o Diário Técnico & ADRs (Sprint 9)
 * 
 * Mapeia a estrutura de Registros de Decisão de Arquitetura (Architecture Decision Records)
 * e telemetria de performance em tempo real no cliente.
 */

export type CategoriaADR = 'arquitetura' | 'performance' | 'resiliencia' | 'estatistica' | 'exportacao';

export interface ADRItem {
  id: string;                     // Ex: "ADR-001"
  slug: string;                   // Ex: "zero-backend-cors"
  titulo: string;                 // Ex: "Arquitetura Zero-Backend com CORS Direto"
  categoria: CategoriaADR;        // Categoria do ADR
  data: string;                   // Data da decisão "YYYY-MM-DD"
  status: 'Aceito' | 'Implementado';
  contexto: string;               // O problema real / desafio encontrado
  decisao: string;                // A solução de engenharia adotada
  consequencias: string;          // Impactos positivos e compromissos (trade-offs)
  alternativasConsideradas: string[]; // Alternativas descartadas e por quê
  licoesAprendidas: string;       // O aprendizado real de engenharia
}

export interface TelemetriaApp {
  tamanhoCacheKB: number;         // Tamanho ocupado no localStorage em KB
  totalVagasCache: number;        // Quantidade de vagas salvas em memória/cache
  statusConexao: 'online' | 'offline' | 'cache';
  totalTestes: number;            // Total de testes na suíte automatizada (53+)
  versao: string;                 // Versão atual do aplicativo
}
