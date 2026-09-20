/**
 * Garimpo Dev — Custom Hook useCandidaturas
 * 
 * Gerencia o estado de candidaturas e status de seleções dos usuários,
 * sincronizando e salvando tudo no `localStorage` do navegador sob a chave `garimpo_dev_candidaturas`.
 */

import { useState, useEffect } from 'react';
import type { Candidatura, StatusCandidatura } from '../types/candidatura';

const STORAGE_KEY = 'garimpo_dev_candidaturas';

export const useCandidaturas = () => {
  // Inicializa o estado lendo do localStorage se disponível
  const [candidaturas, setCandidaturas] = useState<Record<number, Candidatura>>(() => {
    try {
      const salvas = localStorage.getItem(STORAGE_KEY);
      return salvas ? JSON.parse(salvas) : {};
    } catch (e) {
      console.error('Erro ao ler candidaturas do localStorage:', e);
      return {};
    }
  });

  // Salva no localStorage sempre que o objeto de candidaturas for alterado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidaturas));
    } catch (e) {
      console.error('Erro ao salvar candidaturas no localStorage:', e);
    }
  }, [candidaturas]);

  /**
   * Obtém a candidatura armazenada para um ID de vaga específico.
   */
  const getCandidatura = (vagaId: number): Candidatura | undefined => {
    return candidaturas[vagaId];
  };

  /**
   * Atualiza o status e/ou observações de uma vaga no tracker.
   */
  const updateStatus = (vagaId: number, status: StatusCandidatura, observacoes?: string) => {
    const agoraISO = new Date().toISOString();
    setCandidaturas((prev) => {
      const existente = prev[vagaId];
      if (status === 'nao_aplicado' && !observacoes) {
        // Se voltar para não aplicado e não tiver nota, remove do tracker
        const novo = { ...prev };
        delete novo[vagaId];
        return novo;
      }

      return {
        ...prev,
        [vagaId]: {
          vagaId,
          status,
          dataAplicacao: existente?.dataAplicacao || (status !== 'nao_aplicado' ? agoraISO : undefined),
          observacoes: observacoes !== undefined ? observacoes : existente?.observacoes || '',
          historicoModificacao: agoraISO,
        },
      };
    });
  };

  /**
   * Atualiza exclusivamente o campo de anotações/observações de uma vaga.
   */
  const updateObservacoes = (vagaId: number, observacoes: string) => {
    setCandidaturas((prev) => {
      const existente = prev[vagaId];
      const statusAtual = existente?.status || 'aplicado';
      return {
        ...prev,
        [vagaId]: {
          vagaId,
          status: statusAtual,
          dataAplicacao: existente?.dataAplicacao || new Date().toISOString(),
          observacoes,
          historicoModificacao: new Date().toISOString(),
        },
      };
    });
  };

  /**
   * Remove totalmente o registro de candidatura de uma vaga.
   */
  const removeCandidatura = (vagaId: number) => {
    setCandidaturas((prev) => {
      const novo = { ...prev };
      delete novo[vagaId];
      return novo;
    });
  };

  // Lista de todas as candidaturas ativas (com status diferente de nao_aplicado)
  const candidaturasList = Object.values(candidaturas).filter(
    (c) => c.status !== 'nao_aplicado'
  );

  return {
    candidaturas,
    candidaturasList,
    totalCandidaturas: candidaturasList.length,
    getCandidatura,
    updateStatus,
    updateObservacoes,
    removeCandidatura,
  };
};
