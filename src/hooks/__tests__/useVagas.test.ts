import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useVagas } from '../useVagas';
import * as solidesService from '../../services/solides';
import type { Vaga, VagasCacheData } from '../../types/vaga';

const mockVagas: Vaga[] = [
  {
    id: 101,
    title: 'Desenvolvedor Frontend React',
    description: '<p>Vaga React</p>',
    currentState: 'em_andamento',
    companyName: 'Porto Digital Tech',
    companyLogo: '',
    slug: 'portodigital',
    redirectLink: 'https://vagas.solides.com.br/101',
    jobType: 'remoto',
    homeOffice: true,
    openPositions: 2,
    availablePositions: 2,
    createdAt: '2026-09-20',
    city: { id: 1, name: 'Recife', state_id: 17 },
    state: { id: 17, name: 'Pernambuco', code: 'PE' },
    salary: { type: 'simple', showRangeToApplicant: true, initialRange: 5000, finalRange: 8000, negotiable: false },
  },
];

describe('Custom Hook useVagas', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve buscar vagas com sucesso da API e salvar no localStorage', async () => {
    vi.spyOn(solidesService, 'fetchVagasMultiplosSlugs').mockResolvedValueOnce({
      success: true,
      errors: [],
      data: {
        totalPages: 1,
        currentPage: 1,
        count: 1,
        data: mockVagas,
      },
    });

    const { result } = renderHook(() => useVagas());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vagas).toHaveLength(1);
    expect(result.current.vagas[0].title).toBe('Desenvolvedor Frontend React');
    expect(result.current.isUsingCache).toBe(false);

    // Verifica se salvou snapshot no localStorage
    const savedCache = localStorage.getItem('garimpo_dev_cache_vagas');
    expect(savedCache).not.toBeNull();
    const cacheParsed = JSON.parse(savedCache!);
    expect(cacheParsed.vagas).toHaveLength(1);
  });

  it('deve usar o cache do localStorage como fallback em caso de falha de rede', async () => {
    // Prepara cache de 30 minutos atrás no localStorage
    const timestampRecente = Date.now() - 30 * 60 * 1000;
    const cacheInicial: VagasCacheData = {
      vagas: mockVagas,
      timestamp: timestampRecente,
    };
    localStorage.setItem('garimpo_dev_cache_vagas', JSON.stringify(cacheInicial));

    // Simula falha persistente de rede
    vi.spyOn(solidesService, 'fetchVagasMultiplosSlugs').mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useVagas());

    // Aguarda o término das retries e carregamento do cache
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isUsingCache).toBe(true);
      },
      { timeout: 3000 }
    );

    expect(result.current.vagas).toHaveLength(1);
    expect(result.current.isUsingCache).toBe(true);
    expect(result.current.cacheTimestamp).toBe(timestampRecente);
    expect(result.current.error).toBeNull();
  });

  it('não deve utilizar cache expirado (mais de 24 horas)', async () => {
    // Prepara cache antigo de 25 horas atrás no localStorage
    const timestampAntigo = Date.now() - 25 * 60 * 60 * 1000;
    const cacheExpirado: VagasCacheData = {
      vagas: mockVagas,
      timestamp: timestampAntigo,
    };
    localStorage.setItem('garimpo_dev_cache_vagas', JSON.stringify(cacheExpirado));

    // Simula falha de rede
    vi.spyOn(solidesService, 'fetchVagasMultiplosSlugs').mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useVagas());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.isUsingCache).toBe(false);
    expect(result.current.vagas).toHaveLength(0);
    expect(result.current.error).toContain('Limite máximo de tentativas atingido');
  });

  it('deve resetar o contador de retries ao chamar recarregar()', async () => {
    const spyFetch = vi.spyOn(solidesService, 'fetchVagasMultiplosSlugs').mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useVagas());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const chamadasIniciais = spyFetch.mock.calls.length;

    act(() => {
      result.current.recarregar();
    });

    await waitFor(() => {
      expect(spyFetch.mock.calls.length).toBeGreaterThan(chamadasIniciais);
    });
  });
});
