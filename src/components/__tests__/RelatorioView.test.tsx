import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { RelatorioView } from '../RelatorioView';
import type { MercadoSnapshot } from '../../types/mercado';

const mockSnapshot: MercadoSnapshot = {
  data: '2026-09-24',
  timestamp: 1790272800000,
  totalVagas: 18,
  modalidades: {
    remoto: 6,
    hibrido: 6,
    presencial: 6,
    pctRemoto: 33,
    pctHibrido: 33,
    pctPresencial: 33,
  },
  senioridades: {
    junior: 3,
    pleno: 10,
    senior: 5,
    naoEspecificado: 0,
  },
  salarios: {
    totalComSalario: 4,
    media: 7000,
    mediana: 7500,
    maior: 10000,
    menor: 5000,
  },
  topStacks: [
    { name: 'TypeScript', count: 12, percentage: 66, color: 'from-blue-600 to-sky-400' },
  ],
};

describe('Componente RelatorioView', () => {
  it('deve renderizar mensagem amigável para snapshot nulo', () => {
    render(<RelatorioView snapshot={null as any} />);
    expect(screen.getByText(/Nenhum dado disponível no momento/i)).toBeInTheDocument();
  });

  it('deve renderizar o relatório institucional com métricas de vagas e topo de stacks', () => {
    render(<RelatorioView snapshot={mockSnapshot} />);

    expect(screen.getByText(/Relatório de Inteligência de Mercado Tech/i)).toBeInTheDocument();
    expect(screen.getByText(/Recife & Ecossistema Porto Digital/i)).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
    expect(screen.getAllByText(/R\$ 7\.500,00/i)[0]).toBeInTheDocument();
  });
});
