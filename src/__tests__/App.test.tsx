import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';
import type { Vaga } from '../types/vaga';

const mockVaga: Vaga = {
  id: 1,
  title: 'Desenvolvedor Frontend React',
  description: 'Vaga para desenvolvimento web no Porto Digital',
  companyName: 'Empresa Tech',
  companyLogo: 'https://example.com/logo.png',
  slug: 'portodigital',
  redirectLink: 'https://portodigital.vagas.solides.com.br/vaga/1',
  jobType: 'remoto',
  homeOffice: true,
  createdAt: '2026-09-24',
  salary: {
    showRangeToApplicant: true,
    finalRange: 6000,
    negotiable: false,
  },
  city: { name: 'Recife' },
  state: { code: 'PE' },
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
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  it('deve inicializar na aba "mercado" quando ?aba=mercado for fornecido', () => {
    window.location = { ...originalLocation, search: '?aba=mercado' };
    render(<App />);

    // Deve renderizar a visualização de inteligência de mercado
    expect(screen.getByText(/Exportar Relatório/i)).toBeInTheDocument();
  });

  it('deve inicializar na aba "eventos" quando ?aba=eventos for fornecido', () => {
    window.location = { ...originalLocation, search: '?aba=eventos' };
    render(<App />);

    // Deve renderizar a busca de eventos
    expect(screen.getByPlaceholderText(/Buscar evento por nome ou tema/i)).toBeInTheDocument();
  });

  it('deve fazer fallback para "vagas" quando ?aba=qualquercoisa for uma aba inválida', () => {
    window.location = { ...originalLocation, search: '?aba=qualquercoisa' };
    render(<App />);

    expect(screen.getByPlaceholderText(/Buscar por cargo ou tecnologia/i)).toBeInTheDocument();
  });

  it('deve fazer fallback para "vagas" quando a query string estiver vazia', () => {
    window.location = { ...originalLocation, search: '' };
    render(<App />);

    expect(screen.getByPlaceholderText(/Buscar por cargo ou tecnologia/i)).toBeInTheDocument();
  });
});
