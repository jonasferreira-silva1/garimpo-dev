import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';
import type { Vaga } from '../types/vaga';

const mockVaga: Vaga = {
  id: 1,
  title: 'Desenvolvedor Frontend React',
  description: 'Vaga para desenvolvimento web no Porto Digital',
  currentState: 'em_andamento',
  companyName: 'Empresa Tech',
  companyLogo: 'https://example.com/logo.png',
  slug: 'portodigital',
  redirectLink: 'https://portodigital.vagas.solides.com.br/vaga/1',
  jobType: 'remoto',
  homeOffice: true,
  openPositions: 1,
  availablePositions: 1,
  createdAt: '2026-09-24',
  salary: {
    type: 'simple',
    showRangeToApplicant: true,
    initialRange: 0,
    finalRange: 6000,
    negotiable: false,
  },
  city: { id: 1, name: 'Recife', state_id: 1 },
  state: { id: 1, name: 'Pernambuco', code: 'PE' },
};

// Mock do hook useVagas para evitar chamadas de rede durante os testes do App
vi.mock('../hooks/useVagas', () => ({
  useVagas: () => ({
    vagas: [mockVaga],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    setPage: vi.fn(),
    filtros: { busca: '', modelo: 'todos', slugEmpresa: 'todos', apenasFavoritas: false },
    setFiltros: vi.fn(),
    ultimaAtualizacao: '12:00',
    isUsingCache: false,
    cacheTimestamp: Date.now(),
    recarregar: vi.fn(),
  }),
}));

describe('Validação do Deep Linking (?aba=) na Inicialização do App', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
  });

  afterEach(() => {
    (window as any).location = originalLocation;
    vi.restoreAllMocks();
  });

  it('deve inicializar na aba "mercado" quando ?aba=mercado for fornecido', () => {
    (window as any).location = { ...originalLocation, search: '?aba=mercado' };
    render(<App />);

    expect(screen.getByText(/Exportar Relatório/i)).toBeInTheDocument();
  });

  it('deve inicializar na aba "eventos" quando ?aba=eventos for fornecido', () => {
    (window as any).location = { ...originalLocation, search: '?aba=eventos' };
    render(<App />);

    expect(screen.getByPlaceholderText(/Buscar evento por nome ou tema/i)).toBeInTheDocument();
  });

  it('deve fazer fallback para "vagas" quando ?aba=qualquercoisa for uma aba inválida', () => {
    (window as any).location = { ...originalLocation, search: '?aba=qualquercoisa' };
    render(<App />);

    expect(screen.getByPlaceholderText(/Buscar por cargo ou tecnologia/i)).toBeInTheDocument();
  });

  it('deve fazer fallback para "vagas" quando a query string estiver vazia', () => {
    (window as any).location = { ...originalLocation, search: '' };
    render(<App />);

    expect(screen.getByPlaceholderText(/Buscar por cargo ou tecnologia/i)).toBeInTheDocument();
  });
});
