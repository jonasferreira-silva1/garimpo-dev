/**
 * Garimpo Dev — Custom Hook useVagas (Sprint 3 & Sprint 5/6 Resiliência + Offline Fallback)
 * 
 * Encapsula a busca por slug único ou múltiplos slugs agregados, controle de paginação,
 * estado da última atualização, filtros locais e fallback de cache persistente em localStorage
 * com tempo limite de expiração de 24 horas.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Vaga, FiltrosVaga, VagasCacheData } from '../types/vaga';
import { fetchVagasSolides, fetchVagasMultiplosSlugs } from '../services/solides';

// Lista de slugs ativos para agregação em modo "Todas as Empresas"
const SLUGS_TECH = ['portodigital', 'vsoft', 'solides'];
const CACHE_KEY = 'garimpo_dev_cache_vagas';

// Tempo máximo de validade do cache offline: 24 horas (em ms)
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000;

export const useVagas = (favoritosIds: number[] = []) => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');
  
  // Estados do Fallback de Cache Offline
  const [isUsingCache, setIsUsingCache] = useState<boolean>(false);
  const [cacheTimestamp, setCacheTimestamp] = useState<number>(0);

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

  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;

  /**
   * Função para carregar o cache salvo no localStorage em caso de falha de rede.
   * Valida se o cache existe, possui vagas e se não ultrapassou o limite de 24h.
   */
  const carregarCacheFallback = useCallback(() => {
    try {
      const rawCache = localStorage.getItem(CACHE_KEY);
      if (rawCache) {
        const cachedData: VagasCacheData = JSON.parse(rawCache);
        if (
          cachedData &&
          Array.isArray(cachedData.vagas) &&
          cachedData.vagas.length > 0 &&
          cachedData.timestamp
        ) {
          const diffMs = Date.now() - cachedData.timestamp;

          // Se o cache for mais antigo que 24h, desconsidera por estar expirado
          if (diffMs > MAX_CACHE_AGE_MS) {
            console.warn('Cache expirado (mais de 24h de idade).');
            return false;
          }

          setVagas(cachedData.vagas);
          setIsUsingCache(true);
          setCacheTimestamp(cachedData.timestamp);
          setError(null); // Limpa a mensagem de erro pois dados cacheados válidos foram exibidos
          return true;
        }
      }
    } catch (e) {
      console.warn('Erro ao ler cache de vagas no localStorage:', e);
    }
    return false;
  }, []);

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
        const listaVagas = response.data.data || [];
        const agora = new Date();
        const horarioStr = agora.toLocaleTimeString('pt-BR');

        setVagas(listaVagas);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.count || 0);
        setRetryCount(0); // Reseta contador de tentativas ao obter sucesso
        setUltimaAtualizacao(horarioStr);
        setIsUsingCache(false);
        setCacheTimestamp(0);

        // Salva a resposta bem-sucedida no cache persistente do localStorage
        if (listaVagas.length > 0) {
          const snapshot: VagasCacheData = {
            vagas: listaVagas,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
        }
      } else {
        setVagas([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err: any) {
      const mensagemBase = err.message || 'Erro inesperado ao carregar vagas.';
      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        setError(`${mensagemBase} (Tentativa ${retryCount + 1}/${MAX_RETRIES} de reconexão...)`);
      } else {
        // Tentativa limite atingida: aciona o fallback de cache se disponível e não expirado
        const usouCache = carregarCacheFallback();
        if (!usouCache) {
          setError(`${mensagemBase} Limite máximo de tentativas atingido. Não há cache recente disponível.`);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [filtros.slugEmpresa, filtros.busca, page, retryCount, carregarCacheFallback]);

  /**
   * Força uma reconexão limpa do zero, resetando o contador de tentativas (retries).
   */
  const recarregar = useCallback(() => {
    setRetryCount(0);
    carregarVagas();
  }, [carregarVagas]);

  // Efeito disparado na montagem: busca inicial + polling automático de 5 em 5 minutos
  useEffect(() => {
    // 1. Busca inicial imediata
    carregarVagas();

    // 2. Configura a busca automática a cada 5 minutos (300.000 ms)
    const INTERVALO_5_MINUTOS = 5 * 60 * 1000;
    const timerPolling = setInterval(() => {
      carregarVagas();
    }, INTERVALO_5_MINUTOS);

    // 3. Limpa o timer ao desmontar o componente ou alterar os filtros principais
    return () => clearInterval(timerPolling);
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
    isUsingCache,
    cacheTimestamp,
    recarregar,
  };
};
