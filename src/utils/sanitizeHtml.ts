/**
 * Garimpo Dev — Utilitário de Sanitização HTML (Sprint 1 - VULN-001)
 *
 * Sanitiza conteúdos HTML dinâmicos (como descrições de vagas vindas da API da Sólides)
 * utilizando DOMPurify com uma allowlist estrita de tags e atributos permitidos.
 * 
 * Regras de Defesa:
 * - Tags: apenas estruturais de formatação de texto e links.
 * - Atributos: SOMENTE href, target e rel. Proibição de class (previne phishing Tailwind) e style.
 * - Hook afterSanitizeAttributes: força links https:// e mailto: com target="_blank" e rel="noopener noreferrer".
 */

import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'b',
  'i',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'br',
  'div',
  'span',
  'blockquote',
  'code',
  'pre',
  'a',
] as const;

export const ALLOWED_ATTR = ['href', 'target', 'rel'] as const;

let hookConfigurado = false;

/**
 * Registra o hook de pós-sanitização de atributos uma única vez.
 */
function registrarHooks(): void {
  if (hookConfigurado) return;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (href) {
        const trimmed = href.trim();
        if (trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener noreferrer');
        } else {
          node.removeAttribute('href');
          node.removeAttribute('target');
          node.removeAttribute('rel');
        }
      }
    }
  });

  hookConfigurado = true;
}

/**
 * Sanitiza uma string contendo HTML contra ataques de XSS, injeção de iframes,
 * estilos arbitrários e phishing por manipulação de classes.
 *
 * @param dirtyHtml String HTML bruta vinda da API externa ou storage.
 * @returns HTML limpo e seguro para inserção no DOM via dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirtyHtml: string | null | undefined): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  registrarHooks();

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
    FORCE_BODY: false,
  });
}
