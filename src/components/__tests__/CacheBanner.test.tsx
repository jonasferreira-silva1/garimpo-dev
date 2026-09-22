import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CacheBanner } from '../CacheBanner';

describe('Componente CacheBanner', () => {
  it('deve renderizar a mensagem de alerta calculando o tempo a partir do timestamp', () => {
    // Timestamp de 10 minutos atrás
    const timestamp10MinAtras = Date.now() - 10 * 60 * 1000;

    render(
      <CacheBanner
        cacheTimestamp={timestamp10MinAtras}
        onRecarregar={vi.fn()}
      />
    );

    expect(screen.getByText(/Modo Resiliente \(Cache Offline Ativo\)/i)).toBeInTheDocument();
    expect(screen.getByText(/há aproximadamente 10 minutos/i)).toBeInTheDocument();
  });

  it('deve acionar o callback onRecarregar ao clicar no botão de reconectar', () => {
    const handleRecarregar = vi.fn();
    render(
      <CacheBanner
        cacheTimestamp={Date.now() - 5 * 60 * 1000}
        onRecarregar={handleRecarregar}
      />
    );

    const botao = screen.getByRole('button', { name: /Tentar Reconectar/i });
    fireEvent.click(botao);

    expect(handleRecarregar).toHaveBeenCalledTimes(1);
  });
});
