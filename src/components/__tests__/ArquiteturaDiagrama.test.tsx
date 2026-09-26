import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ArquiteturaDiagrama } from '../ArquiteturaDiagrama';

describe('Componente ArquiteturaDiagrama', () => {
  it('deve renderizar a telemetria e a topologia de dados reativa', () => {
    render(<ArquiteturaDiagrama vagasCount={20} />);

    expect(screen.getByText(/Topologia de Dados & Fluxo de Reatividade/i)).toBeInTheDocument();
    expect(screen.getByText(/API Gateway Sólides/i)).toBeInTheDocument();
    expect(screen.getByText(/useVagas \+ localStorage/i)).toBeInTheDocument();
    expect(screen.getByText(/mercadoAnalytics\.ts/i)).toBeInTheDocument();
    expect(screen.getByText(/UI & PDF Export/i)).toBeInTheDocument();
  });
});
