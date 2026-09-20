import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCandidaturas } from '../useCandidaturas';

describe('Custom Hook useCandidaturas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com lista vazia de candidaturas', () => {
    const { result } = renderHook(() => useCandidaturas());
    expect(result.current.candidaturasList).toEqual([]);
    expect(result.current.totalCandidaturas).toBe(0);
  });

  it('deve atualizar o status de uma vaga para "aplicado" e salvar no localStorage', () => {
    const { result } = renderHook(() => useCandidaturas());

    act(() => {
      result.current.updateStatus(911262, 'aplicado', 'Usei currículo focado em React');
    });

    const candidatura = result.current.getCandidatura(911262);
    expect(candidatura).toBeDefined();
    expect(candidatura?.status).toBe('aplicado');
    expect(candidatura?.observacoes).toBe('Usei currículo focado em React');
    expect(result.current.totalCandidaturas).toBe(1);
  });

  it('deve atualizar observacoes de uma candidatura existente', () => {
    const { result } = renderHook(() => useCandidaturas());

    act(() => {
      result.current.updateStatus(911262, 'entrevista');
      result.current.updateObservacoes(911262, 'Entrevista marcada para terça-feira');
    });

    const candidatura = result.current.getCandidatura(911262);
    expect(candidatura?.status).toBe('entrevista');
    expect(candidatura?.observacoes).toBe('Entrevista marcada para terça-feira');
  });
});
