import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { EmptyState } from '../EmptyState';

describe('Componente EmptyState', () => {
  it('deve renderizar a mensagem enviada por props', () => {
    render(<EmptyState mensagem="Nenhuma vaga encontrada para o filtro selecionado." />);
    expect(
      screen.getByText('Nenhuma vaga encontrada para o filtro selecionado.')
    ).toBeInTheDocument();
  });

  it('deve renderizar e acionar o botão de limpar filtros quando fornecido', () => {
    const handleLimpar = vi.fn();
    render(
      <EmptyState
        mensagem="Filtro sem resultados"
        onLimparFiltros={handleLimpar}
      />
    );

    const botao = screen.getByText('Limpar Filtros');
    expect(botao).toBeInTheDocument();

    fireEvent.click(botao);
    expect(handleLimpar).toHaveBeenCalledTimes(1);
  });
});
