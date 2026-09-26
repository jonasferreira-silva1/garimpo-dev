import { describe, it, expect } from 'vitest';
import { solidesVagaSchema, solidesResponseSchema } from '../../schemas/solidesSchema';

describe('Validação de Schema Runtime Zod (solidesSchema.ts)', () => {
  it('deve validar com sucesso uma vaga válida da Sólides', () => {
    const rawVaga = {
      id: 101,
      title: 'Desenvolvedor React Senior',
      description: '<p>Vaga no Porto Digital</p>',
      currentState: 'em_andamento',
      companyName: 'Empresa Tech',
      companyLogo: 'https://example.com/logo.png',
      slug: 'portodigital',
      redirectLink: 'https://portodigital.vagas.solides.com.br/vaga/101',
      jobType: 'remoto',
      homeOffice: true,
      openPositions: 2,
      availablePositions: 2,
      createdAt: '2026-09-25',
      salary: {
        type: 'simple',
        showRangeToApplicant: true,
        initialRange: 0,
        finalRange: 7500, // Valor positivo
        negotiable: false,
      },
      city: { id: 1, name: 'Recife', state_id: 1 },
      state: { id: 1, name: 'Pernambuco', code: 'PE' },
    };

    const result = solidesVagaSchema.safeParse(rawVaga);
    expect(result.success).toBe(true);
  });

  it('deve aceitar finalRange = 0 no Zod schema sem considerar erro de validação (negócio trata como A combinar)', () => {
    const rawVaga = {
      id: 102,
      title: 'Desenvolvedor Backend Java',
      createdAt: '2026-09-25',
      salary: {
        type: 'simple',
        showRangeToApplicant: false,
        initialRange: 0,
        finalRange: 0, // 0 é perfeitamente válido do ponto de vista de tipo (number)
        negotiable: true,
      },
      city: { name: 'Recife' },
      state: { code: 'PE' },
    };

    const result = solidesVagaSchema.safeParse(rawVaga);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.salary.finalRange).toBe(0);
    }
  });

  it('deve validar com sucesso a resposta envelopada da API Sólides', () => {
    const rawResponse = {
      success: true,
      errors: [],
      data: {
        totalPages: 1,
        currentPage: 1,
        count: 1,
        data: [
          {
            id: 200,
            title: 'Engenheiro de Dados',
            createdAt: '2026-09-25',
            salary: {
              type: 'simple',
              showRangeToApplicant: true,
              initialRange: 0,
              finalRange: 8000,
              negotiable: false,
            },
            city: { name: 'Recife' },
            state: { code: 'PE' },
          },
        ],
      },
    };

    const result = solidesResponseSchema.safeParse(rawResponse);
    expect(result.success).toBe(true);
  });

  it('deve falhar a validação quando o ID da vaga não for um número', () => {
    const invalidVaga = {
      id: 'id_invalido_string', // Deve ser number
      title: 'Vaga Invalida',
      createdAt: '2026-09-25',
      salary: { type: 'simple', showRangeToApplicant: false, initialRange: 0, finalRange: 0, negotiable: false },
      city: { name: 'Recife' },
      state: { code: 'PE' },
    };

    const result = solidesVagaSchema.safeParse(invalidVaga);
    expect(result.success).toBe(false);
  });
});
