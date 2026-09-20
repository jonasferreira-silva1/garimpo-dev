import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { EventoDetalhesModal } from '../EventoDetalhesModal';
import type { Evento } from '../../types/evento';

const eventoMock: Evento = {
  id: 5,
  nome: 'REC\'n\'Play 2026 — Festival de Tecnologia & Games',
  descricao: 'O maior festival de tecnologia e inovação do Nordeste.',
  data: '2026-10-05',
  horario: '10:00 - 20:00',
  local: 'Marco Zero & Apolo 235 - Recife Antigo',
  modalidade: 'presencial',
  tema: 'Carreira',
  linkInscricao: 'https://recnplay.pe/',
  gratuito: true,
  organizador: 'Prefeitura do Recife & Porto Digital',
  fonteProcedencia: 'Portal Oficial REC\'n\'Play (recnplay.pe)',
};

describe('Componente EventoDetalhesModal', () => {
  it('não deve renderizar nada se o evento for null', () => {
    const { container } = render(<EventoDetalhesModal evento={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar os detalhes e a procedência do evento quando fornecido', () => {
    render(<EventoDetalhesModal evento={eventoMock} onClose={vi.fn()} />);

    expect(screen.getByText(/REC'n'Play 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Procedência & Origem Verificada pelo Garimpo Dev/i)).toBeInTheDocument();
    expect(screen.getByText(/Portal Oficial REC'n'Play \(recnplay.pe\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Organizado por: Prefeitura do Recife & Porto Digital/i)).toBeInTheDocument();
  });

  it('deve fechar o modal ao clicar no botão de fechar', () => {
    const handleClose = vi.fn();
    render(<EventoDetalhesModal evento={eventoMock} onClose={handleClose} />);

    const botaoFechar = screen.getByRole('button', { name: /Fechar detalhes do evento/i });
    fireEvent.click(botaoFechar);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
