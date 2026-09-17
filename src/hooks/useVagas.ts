/**
 * Garimpo Dev — Custom Hook useVagas
 * 
 * Este hook encapsula toda a lógica de estado, paginação, filtros e requisição das vagas,
 * permitindo que os componentes visuais permaneçam limpos e focados apenas na renderização.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Vaga, FiltrosVaga } from '../types/vaga';
import { fetchVagasSolides } from '../services/solides';

export const useVagas = (slugInicial: string = 'portodigital') => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de controle de paginação
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Estado de filtros aplicados
  const [filtros, setFiltros] = useState<FiltrosVaga>({
    busca: '',
    modelo: 'todos',
  });

  /**
   * Função para buscar as vagas na API.
   * Utiliza useCallback para evitar recriações desnecessárias.
   */
  const carregarVagas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchVagasSolides({
        slug: slugInicial,
        page,
        take: 12,
        title: filtros.busca,
      });

      if (response && response.success && response.data) {
        setVagas(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.count || 0);
      } else {
        setVagas([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar vagas.');
    } finally {
      setLoading(false);
    }
  }, [slugInicial, page, filtros.busca]);

  // Efeito disparado na montagem ou quando muda a página ou busca
  useEffect(() => {
    carregarVagas();
  }, [carregarVagas]);

  // Aplicação de filtros locais no lado do cliente (ex: filtro por modelo de trabalho)
  const vagasFiltradas = vagas.filter((vaga) => {
    if (filtros.modelo === 'todos') return true;
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
    recarregar: carregarVagas,
  };
};
