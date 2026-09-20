import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavoritos } from '../useFavoritos';

describe('Custom Hook useFavoritos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com lista vazia de favoritos', () => {
    const { result } = renderHook(() => useFavoritos());
    expect(result.current.favoritos).toEqual([]);
    expect(result.current.totalFavoritos).toBe(0);
  });

  it('deve adicionar uma vaga aos favoritos e persistir no localStorage', () => {
    const { result } = renderHook(() => useFavoritos());

    act(() => {
      result.current.toggleFavorito(911262);
    });

    expect(result.current.isFavorito(911262)).toBe(true);
    expect(result.current.totalFavoritos).toBe(1);
    expect(localStorage.getItem('garimpo_dev_favoritos')).toBe(JSON.stringify([911262]));
  });

  it('deve remover uma vaga dos favoritos ao clicar novamente', () => {
    const { result } = renderHook(() => useFavoritos());

    act(() => {
      result.current.toggleFavorito(911262); // Adiciona
    });
    expect(result.current.isFavorito(911262)).toBe(true);

    act(() => {
      result.current.toggleFavorito(911262); // Remove
    });
    expect(result.current.isFavorito(911262)).toBe(false);
    expect(result.current.totalFavoritos).toBe(0);
  });
});
