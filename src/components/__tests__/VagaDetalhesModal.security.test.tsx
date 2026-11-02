import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { VagaDetalhesModal } from '../VagaDetalhesModal';
import type { Vaga } from '../../types/vaga';

const baseVaga: Vaga = {
  id: 12345,
  title: 'Desenvolvedor Frontend Sênior',
  description: '',
  currentState: 'em_andamento',
  companyName: 'Tech Recife Corp',
  companyLogo: 'https://cdn.solides.com.br/logo.png',
  slug: 'portodigital',
  redirectLink: 'https://portodigital.vagas.solides.com.br/vaga/12345',
  createdAt: '2026-11-01T12:00:00Z',
  salary: {
    type: 'simple',
    showRangeToApplicant: false,
    initialRange: 0,
    finalRange: 0,
    negotiable: true,
  },
  city: { id: 1, name: 'Recife', state_id: 1 },
  state: { id: 1, name: 'Pernambuco', code: 'PE' },
  homeOffice: true,
  jobType: 'remoto',
  openPositions: 1,
  availablePositions: 1,
  benefits: [],
};

describe('Segurança de VagaDetalhesModal — Mitigação de XSS (VULN-001)', () => {
  it('não deve permitir tags <script> na descrição da vaga', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<h3>Título</h3><script>alert("xss")</script><p>Parágrafo</p>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    const scriptElement = container.querySelector('script');
    expect(scriptElement).toBeNull();
  });

  it('não deve permitir tags <img src=x onerror=...> com manipuladores de eventos', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<p>Vaga Tech</p><img src="x" onerror="alert(1)">',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    // img não está na allowlist de tags seguras e manipuladores de eventos são perigosos
    const imgElement = container.querySelector('.prose img');
    expect(imgElement).toBeNull();
  });

  it('não deve permitir tags <svg onload=...>', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<svg onload="alert(1)"><circle cx="50" cy="50" r="40"/></svg>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    const svgElement = container.querySelector('.prose svg');
    expect(svgElement).toBeNull();
  });

  it('não deve permitir tags <iframe>', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<iframe src="https://phishing.site/login"></iframe>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    const iframeElement = container.querySelector('iframe');
    expect(iframeElement).toBeNull();
  });

  it('deve neutralizar links com esquema javascript: em <a href>', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<a href="javascript:alert(1)">Clique para se candidatar</a>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    const link = container.querySelector('.prose a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBeNull();
  });

  it('deve neutralizar links com esquema data: em <a href>', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<a href="data:text/html,<script>alert(1)</script>">Baixar Edital</a>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    const link = container.querySelector('.prose a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBeNull();
  });

  it('não deve permitir atributo style inline para prevenir defacement visual', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<div style="background-color: red; position: fixed; top: 0;">Alerta</div>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    const styledElement = container.querySelector('.prose [style]');
    expect(styledElement).toBeNull();
  });

  it('não deve permitir atributo class para prevenir phishing via classes Tailwind CSS', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: '<div class="fixed inset-0 z-50 bg-white p-10"><input placeholder="Senha" /></div>',
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    // O atributo class inserido na descrição deve ser removido pelo sanitizador
    const fixedElement = container.querySelector('.prose .fixed');
    expect(fixedElement).toBeNull();
    const elementWithClass = container.querySelector('.prose div[class]');
    expect(elementWithClass).toBeNull();
  });

  it('deve preservar formatações legítimas de HTML e forçar atributos seguros em links https', () => {
    const vaga: Vaga = {
      ...baseVaga,
      description: `
        <h2>Sobre a Vaga</h2>
        <p>Procuramos alguém com <b>vontade</b> e <strong>experiência</strong>.</p>
        <ul>
          <li>React e TypeScript</li>
          <li>Node.js</li>
        </ul>
        <a href="https://empresa.com.br/carreiras">Portal de Carreiras</a>
        <a href="mailto:recrutamento@empresa.com.br">Contato RH</a>
      `,
    };

    const { container } = render(
      <VagaDetalhesModal
        vaga={vaga}
        onClose={vi.fn()}
        isFavorito={false}
        onToggleFavorito={vi.fn()}
      />
    );

    expect(container.querySelector('.prose h2')?.textContent).toBe('Sobre a Vaga');
    expect(container.querySelector('.prose b')?.textContent).toBe('vontade');
    expect(container.querySelector('.prose strong')?.textContent).toBe('experiência');
    expect(container.querySelectorAll('.prose li')).toHaveLength(2);

    const linkHttps = container.querySelector('.prose a[href="https://empresa.com.br/carreiras"]');
    expect(linkHttps).not.toBeNull();
    expect(linkHttps?.getAttribute('target')).toBe('_blank');
    expect(linkHttps?.getAttribute('rel')).toBe('noopener noreferrer');

    const linkMailto = container.querySelector('.prose a[href="mailto:recrutamento@empresa.com.br"]');
    expect(linkMailto).not.toBeNull();
    expect(linkMailto?.getAttribute('target')).toBe('_blank');
    expect(linkMailto?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
