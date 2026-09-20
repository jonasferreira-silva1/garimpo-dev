import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Badge } from '../Badge';

describe('Componente Badge', () => {
  it('deve renderizar o texto filho corretamente', () => {
    render(<Badge variant="nova">✨ NOVA</Badge>);
    expect(screen.getByText('✨ NOVA')).toBeInTheDocument();
  });

  it('deve aplicar as classes corretas para a variante "nova"', () => {
    render(<Badge variant="nova">✨ NOVA</Badge>);
    const badge = screen.getByText('✨ NOVA');
    expect(badge.className).toContain('text-emerald-400');
  });

  it('deve aplicar as classes corretas para a variante "remoto"', () => {
    render(<Badge variant="remoto">REMOTO</Badge>);
    const badge = screen.getByText('REMOTO');
    expect(badge.className).toContain('text-sky-400');
  });
});
