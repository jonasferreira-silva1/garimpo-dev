import { describe, it, expect } from 'vitest';
import { sanitizeHtml, ALLOWED_TAGS, ALLOWED_ATTR } from '../sanitizeHtml';

describe('Utilitário sanitizeHtml (VULN-001)', () => {
  it('deve retornar string vazia para entradas nulas, indefinidas ou não-string', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml('')).toBe('');
  });

  it('deve remover tags <script> e seu conteúdo executável', () => {
    const dirty = '<p>Texto</p><script>alert("xss")</script>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('alert("xss")');
    expect(clean).toContain('<p>Texto</p>');
  });

  it('deve descartar manipuladores de eventos inline (onerror, onload, onclick, onmouseover)', () => {
    const dirty = '<img src="x" onerror="alert(1)"><svg onload="alert(2)"><b onclick="alert(3)">Texto</b>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('onload');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('<img');
    expect(clean).not.toContain('<svg');
    expect(clean).toBe('<b>Texto</b>');
  });

  it('deve remover atributo class para mitigar phishing via classes utilitárias do Tailwind', () => {
    const dirty = '<div class="fixed inset-0 z-50 bg-white">Falso Modal</div>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('class');
    expect(clean).not.toContain('fixed');
    expect(clean).toBe('<div>Falso Modal</div>');
  });

  it('deve remover atributo style para evitar defacement ou sequestro visual', () => {
    const dirty = '<p style="color: red; position: fixed;">Texto formatado</p>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('style');
    expect(clean).toBe('<p>Texto formatado</p>');
  });

  it('deve neutralizar esquemas perigosos javascript: e data: em links', () => {
    const jsLink = '<a href="javascript:alert(1)">Clique aqui</a>';
    const dataLink = '<a href="data:text/html,<script>alert(1)</script>">Clique</a>';

    expect(sanitizeHtml(jsLink)).toBe('<a>Clique aqui</a>');
    expect(sanitizeHtml(dataLink)).toBe('<a>Clique</a>');
  });

  it('deve manter URLs https:// e forçar target="_blank" e rel="noopener noreferrer"', () => {
    const link = '<a href="https://example.com/vaga">Candidatar-se</a>';
    const clean = sanitizeHtml(link);

    expect(clean).toContain('href="https://example.com/vaga"');
    expect(clean).toContain('target="_blank"');
    expect(clean).toContain('rel="noopener noreferrer"');
  });

  it('deve manter links mailto: e forçar target="_blank" e rel="noopener noreferrer"', () => {
    const link = '<a href="mailto:rh@empresa.com">Enviar email</a>';
    const clean = sanitizeHtml(link);

    expect(clean).toContain('href="mailto:rh@empresa.com"');
    expect(clean).toContain('target="_blank"');
    expect(clean).toContain('rel="noopener noreferrer"');
  });

  it('deve preservar formatações legítimas de vagas', () => {
    const dirty = `
      <h1>Título</h1>
      <p>Descrição com <strong>negrito</strong>, <em>itálico</em> e <code>código</code>.</p>
      <ul><li>Item 1</li><li>Item 2</li></ul>
      <blockquote>Citação da empresa</blockquote>
    `;
    const clean = sanitizeHtml(dirty);

    expect(clean).toContain('<h1>Título</h1>');
    expect(clean).toContain('<strong>negrito</strong>');
    expect(clean).toContain('<em>itálico</em>');
    expect(clean).toContain('<code>código</code>');
    expect(clean).toContain('<ul><li>Item 1</li><li>Item 2</li></ul>');
    expect(clean).toContain('<blockquote>Citação da empresa</blockquote>');
  });

  it('deve exportar allowlist documentada de tags e atributos', () => {
    expect(ALLOWED_TAGS).toContain('h1');
    expect(ALLOWED_TAGS).toContain('p');
    expect(ALLOWED_TAGS).toContain('a');
    expect(ALLOWED_ATTR).toEqual(['href', 'target', 'rel']);
  });
});
