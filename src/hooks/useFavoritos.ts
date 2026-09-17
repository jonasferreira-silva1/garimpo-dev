/**
 * Garimpo Dev — Custom Hook useFavoritos (Sprint 3)
 * 
 * Gerencia a lista de IDs de vagas favoritadas pelo usuário com sincronização
 * e persistência automática no `localStorage` do navegador.
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'garimpo_dev_favoritos';

export const useFavoritos = () => {
  // Inicializa o estado lendo do localStorage se disponível
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    try {
      const salvas = localStorage.getItem(STORAGE_KEY);
      return salvas ? JSON.parse(salvas) : [];
    } catch (e) {
      console.error('Erro ao ler favoritos do localStorage:', e);
      return [];
    }
  });

  // Salva no localStorage sempre que o estado dos favoritos mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch (e) {
      console.error('Erro ao salvar favoritos no localStorage:', e);
    }
  }, [favoritos]);

  /**
   * Alterna o estado de favorito de uma vaga pelo seu ID.
   * Se já estiver salva, remove; se não, adiciona.
   */
  const toggleFavorito = (vagaId: number) => {
    setFavoritos((prev) =>
      prev.includes(vagaId)
        ? prev.filter((id) => id !== vagaId)
        : [...prev, vagaId]
    );
  };

  /**
   * Verifica se uma vaga específica está marcada como favorita.
   */
  const isFavorito = (vagaId: number): boolean => {
    return favoritos.includes(vagaId);
  };

  return {
    favoritos,
    toggleFavorito,
    isFavorito,
    totalFavoritos: favoritos.length,
  };
};
