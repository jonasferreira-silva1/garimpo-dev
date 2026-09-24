import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MercadoInsights } from '../MercadoInsights';
import type { Vaga } from '../../types/vaga';

const mockVagas: Vaga[] = [
  {
    id: 1,
    title: 'Desenvolvedor React Senior',
    description: 'React e TypeScript',
    currentState: 'em_andamento',
    companyName: 'Porto Digital Tech',
    companyLogo: '',
    slug: 'portodigital',
    redirectLink: 'https://vagas.solides.com.br/1',
    jobType: 'remoto',
    homeOffice: true,
    openPositions: 1,
    availablePositions: 1,
    createdAt: '2026-09-24',
    city: { id: 1, name: 'Recife', state_id: 1 },
    state: { id: 1, name: 'Pernambuco', code: 'PE' },
    salary: { type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: 8000, negotiable: false },
  },
];

describe('Componente MercadoInsights', () => {
  it('deve renderizar o estado de aguardando dados quando a lista de vagas for vazia', () => {
    render(<MercadoInsights vagas={[]} />);
    expect(screen.getByText(/Aguardando dados para análise/i)).toBeInTheDocument();
  });

  it('deve renderizar o dashboard de inteligência com as métricas calculadas', () => {
    render(<MercadoInsights vagas={mockVagas} />);

    expect(screen.getByText(/Radar de Inteligência de Mercado Tech/i)).toBeInTheDocument();
    expect(screen.getByText('1 Vagas')).toBeInTheDocument();
    expect(screen.getByText(/Modelo de Trabalho no Ecossistema/i)).toBeInTheDocument();
    expect(screen.getByText(/Tecnologias & Stacks Mais Demandadas/i)).toBeInTheDocument();
  });
});
