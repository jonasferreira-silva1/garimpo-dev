import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchVagasSolides, fetchVagasMultiplosSlugs } from '../solides';

vi.mock('axios');

describe('Serviço HTTP da Sólides (solides.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchVagasSolides', () => {
    it('deve retornar os dados da API quando a requisição for bem-sucedida', async () => {
      const mockResponse = {
        data: {
          success: true,
          errors: [],
          data: {
            totalPages: 1,
            currentPage: 1,
            count: 2,
            data: [
              {
                id: 1,
                title: 'Desenvolvedor React',
                slug: 'portodigital',
                createdAt: '2026-09-25',
                salary: { type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: 6000, negotiable: false },
                city: { name: 'Recife' },
                state: { code: 'PE' },
              },
              {
                id: 2,
                title: 'Engenheiro de Dados',
                slug: 'portodigital',
                createdAt: '2026-09-25',
                salary: { type: 'simple', showRangeToApplicant: false, initialRange: 0, finalRange: 0, negotiable: true },
                city: { name: 'Recife' },
                state: { code: 'PE' },
              },
            ],
          },
        },
      };

      (axios.get as any).mockResolvedValueOnce(mockResponse);

      const resultado = await fetchVagasSolides({ slug: 'portodigital', page: 1 });
      expect(resultado.success).toBe(true);
      expect(resultado.data.count).toBe(2);
      expect(resultado.data.data[0].title).toBe('Desenvolvedor React');
    });

    it('deve lançar erro amigável se a requisição HTTP falhar', async () => {
      (axios.get as any).mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchVagasSolides({ slug: 'portodigital' })).rejects.toThrow(
        'Não foi possível carregar as vagas'
      );
    });
  });

  describe('fetchVagasMultiplosSlugs', () => {
    it('deve agregar e remover vagas duplicadas de múltiplos slugs', async () => {
      const mockSlug1 = {
        data: {
          success: true,
          data: {
            data: [
              { id: 101, title: 'Dev Frontend', createdAt: '2026-09-18' },
              { id: 102, title: 'Dev Backend', createdAt: '2026-09-19' },
            ],
          },
        },
      };

      const mockSlug2 = {
        data: {
          success: true,
          data: {
            data: [
              { id: 102, title: 'Dev Backend Duplicada', createdAt: '2026-09-19' }, // Duplicado
              { id: 103, title: 'Dev Fullstack', createdAt: '2026-09-20' },
            ],
          },
        },
      };

      (axios.get as any)
        .mockResolvedValueOnce(mockSlug1)
        .mockResolvedValueOnce(mockSlug2);

      const resultado = await fetchVagasMultiplosSlugs(['portodigital', 'vsoft']);

      expect(resultado.success).toBe(true);
      // Deve ter exatamente 3 vagas (101, 102 e 103), ignorando a duplicata 102
      expect(resultado.data.count).toBe(3);
      // A vaga mais recente (103) deve estar no topo
      expect(resultado.data.data[0].id).toBe(103);
    });
  });
});
