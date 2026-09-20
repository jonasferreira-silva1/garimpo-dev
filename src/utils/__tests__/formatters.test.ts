import { describe, it, expect } from 'vitest';
import {
  isNova,
  isEstaSemana,
  formatSalary,
  formatLocal,
  buildVagaUrl,
} from '../formatters';
import type { Vaga, SalarioVaga } from '../../types/vaga';

describe('Utilitários e Formatadores (formatters.ts)', () => {
  describe('isNova', () => {
    it('deve retornar true se a vaga foi criada há menos de 48 horas', () => {
      const dataRecente = new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(); // 10 horas atrás
      expect(isNova(dataRecente)).toBe(true);
    });

    it('deve retornar false se a vaga foi criada há mais de 48 horas', () => {
      const dataAntiga = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(); // 3 dias atrás
      expect(isNova(dataAntiga)).toBe(false);
    });

    it('deve retornar false se a data estiver vazia ou for inválida', () => {
      expect(isNova('')).toBe(false);
    });
  });

  describe('isEstaSemana', () => {
    it('deve retornar true para eventos ocorrendo nos próximos 7 dias', () => {
      const proximoEvento = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      expect(isEstaSemana(proximoEvento)).toBe(true);
    });

    it('deve retornar false para eventos ocorrendo daqui a mais de 7 dias', () => {
      const eventoLonge = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      expect(isEstaSemana(eventoLonge)).toBe(false);
    });
  });

  describe('formatSalary', () => {
    it('deve retornar "A combinar" se showRangeToApplicant for false', () => {
      const salario: SalarioVaga = {
        type: 'simple',
        showRangeToApplicant: false,
        initialRange: 5000,
        finalRange: 6000,
        negotiable: false,
      };
      expect(formatSalary(salario)).toBe('A combinar');
    });

    it('deve retornar "A combinar" se finalRange for 0', () => {
      const salario: SalarioVaga = {
        type: 'simple',
        showRangeToApplicant: true,
        initialRange: 0,
        finalRange: 0,
        negotiable: false,
      };
      expect(formatSalary(salario)).toBe('A combinar');
    });

    it('deve formatar o salário em Reais se finalRange for válido', () => {
      const salario: SalarioVaga = {
        type: 'simple',
        showRangeToApplicant: true,
        initialRange: 0,
        finalRange: 6500,
        negotiable: false,
      };
      expect(formatSalary(salario)).toContain('6.500,00');
    });
  });

  describe('formatLocal', () => {
    it('deve formatar para Remoto se homeOffice for true', () => {
      const vaga = { homeOffice: true, jobType: 'presencial' } as Vaga;
      expect(formatLocal(vaga)).toContain('Remoto');
    });

    it('deve incluir Cidade e Estado no formato Presencial/Híbrido', () => {
      const vaga = {
        homeOffice: false,
        jobType: 'hibrido',
        city: { name: 'Recife' },
        state: { code: 'PE' },
      } as Vaga;
      expect(formatLocal(vaga)).toBe('🔄 Híbrido · Recife/PE');
    });
  });

  describe('buildVagaUrl', () => {
    it('deve construir a URL corrigida com a rota /vaga/ e o domínio da Sólides', () => {
      const url = buildVagaUrl('portodigital', 911262);
      expect(url).toBe('https://portodigital.vagas.solides.com.br/vaga/911262');
    });

    it('deve usar "portodigital" como fallback de slug', () => {
      const url = buildVagaUrl('', 12345);
      expect(url).toBe('https://portodigital.vagas.solides.com.br/vaga/12345');
    });
  });
});
