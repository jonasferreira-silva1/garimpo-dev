/**
 * Garimpo Dev — Custom Hook useVagas (Sprint 3)
 * 
 * Encapsula a busca por slug único ou múltiplos slugs agregados, controle de paginação,
 * estado da última atualização e filtros locais (modalidade, empresa e favoritas).
 */

import { useState, useEffect, useCallback } from 'react';
import type { Vaga, FiltrosVaga } from '../types/vaga';
import { fetchVagasSolides, fetchVagasMultiplosSlugs } from '../services/solides';

// Lista de slugs ativos para agregação em modo "Todas as Empresas"
const SLUGS_TECH = ['portodigital', 'vsoft', 'solides'];

export const useVagas = (favoritosIds: number[] = []) => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');
  
  // Estados de controle de paginação
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Estado de filtros aplicados
  const [filtros, setFiltros] = useState<FiltrosVaga>({
    busca: '',
    modelo: 'todos',
    slugEmpresa: 'todos',
    apenasFavoritas: false,
  });

  /**
   * Função para buscar as vagas na API.
   * Decide entre busca por slug único ou por múltiplos slugs com base nos filtros.
   */
  const carregarVagas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (filtros.slugEmpresa === 'todos') {
        // Modo Agregado: Busca vagas de todos os slugs mapeados simultaneamente
        response = await fetchVagasMultiplosSlugs(SLUGS_TECH, filtros.busca);
      } else {
        // Modo Específico: Busca vagas de uma empresa/hub específica
        response = await fetchVagasSolides({
          slug: filtros.slugEmpresa,
          page,
          take: 12,
          title: filtros.busca,
        });
      }

      if (response && response.success && response.data) {
        setVagas(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.count || 0);
      } else {
        setVagas([]);
        setTotalPages(1);
        setTotalCount(0);
      }

      // Atualiza o horário da última atualização formatado (ex: "15:39:10")
      const agora = new Date();
      setUltimaAtualizacao(agora.toLocaleTimeString('pt-BR'));
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar vagas.');
    } finally {
      setLoading(false);
    }
  }, [filtros.slugEmpresa, filtros.busca, page]);

  // Efeito disparado na montagem ou quando muda o filtro de empresa, busca ou página
  useEffect(() => {
    carregarVagas();
  }, [carregarVagas]);

  // Aplicação de filtros locais no lado do cliente (modelo de trabalho e filtro de favoritas)
  const vagasFiltradas = vagas.filter((vaga) => {
    // Filtro por favoritas
    if (filtros.apenasFavoritas && !favoritosIds.includes(vaga.id)) {
      return false;
    }

    // Filtro por modalidade
    if (filtros.modelo === 'remoto') return vaga.homeOffice || vaga.jobType === 'remoto';
    if (filtros.modelo === 'hibrido') return vaga.jobType === 'hibrido';
    if (filtros.modelo === 'presencial') return !vaga.homeOffice && vaga.jobType === 'presencial';
    
    return true;
  });

  return {
    vagas: vagasFiltradas,
    totalVagasOriginal: vagas.length,
    loading,
    error,
    page,
    totalPages,
    totalCount,
    setPage,
    filtros,
    setFiltros,
    ultimaAtualizacao,
    recarregar: carregarVagas,
  };
};
