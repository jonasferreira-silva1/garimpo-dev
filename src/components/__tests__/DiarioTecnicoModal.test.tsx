import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { DiarioTecnicoModal } from '../DiarioTecnicoModal';

describe('Componente DiarioTecnicoModal', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<DiarioTecnicoModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar o título, abas e ADRs quando aberto', () => {
    render(<DiarioTecnicoModal isOpen={true} onClose={vi.fn()} vagasCount={12} />);

    expect(screen.getByText(/Diário Técnico & Bastidores de Engenharia/i)).toBeInTheDocument();
    expect(screen.getByText(/Arquitetura Zero-Backend com CORS Direto da API Sólides/i)).toBeInTheDocument();
  });

  it('deve alternar entre as abas do modal ao clicar', () => {
    render(<DiarioTecnicoModal isOpen={true} onClose={vi.fn()} vagasCount={12} />);

    // Clica na aba de Arquitetura & Telemetria
    const abaDiagrama = screen.getByText(/Arquitetura & Telemetria/i);
    fireEvent.click(abaDiagrama);

    expect(screen.getByText(/Topologia de Dados & Fluxo de Reatividade/i)).toBeInTheDocument();

    // Clica na aba do Artigo Completo
    const abaArtigo = screen.getByText(/Artigo Completo \(Markdown\)/i);
    fireEvent.click(abaArtigo);

    expect(screen.getByText(/Como Construí o Garimpo Dev/i)).toBeInTheDocument();
  });
});
