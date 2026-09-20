import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { EventoCard } from '../EventoCard';
import type { Evento } from '../../types/evento';

const eventoMock: Evento = {
  id: 1,
  nome: 'Porto Digital Summit 2026',
  descricao: 'O maior encontro de inovação',
  data: '2026-09-25',
  horario: '09:00 - 18:00',
  local: 'Cais do Apolo, 222',
  modalidade: 'presencial',
  tema: 'Carreira',
  linkInscricao: 'https://www.portodigital.org/noticias-e-eventos/agenda',
  gratuito: true,
  organizador: 'Porto Digital',
  fonteProcedencia: 'Portal Oficial do Porto Digital',
};

describe('Componente EventoCard', () => {
  it('deve renderizar o nome, organizador e modalidade do evento', () => {
    render(<EventoCard evento={eventoMock} />);

    expect(screen.getByText('Porto Digital Summit 2026')).toBeInTheDocument();
    expect(screen.getByText('Porto Digital')).toBeInTheDocument();
    expect(screen.getByText('PRESENCIAL')).toBeInTheDocument();
  });

  it('deve disparar o callback onVerDetalhes ao clicar no botão Ver Detalhes', () => {
    const handleVerDetalhes = vi.fn();
    render(<EventoCard evento={eventoMock} onVerDetalhes={handleVerDetalhes} />);

    const botaoDetalhes = screen.getByText('Ver Detalhes');
    fireEvent.click(botaoDetalhes);

    expect(handleVerDetalhes).toHaveBeenCalledTimes(1);
    expect(handleVerDetalhes).toHaveBeenCalledWith(eventoMock);
  });
});
