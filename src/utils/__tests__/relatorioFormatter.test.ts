import { describe, it, expect } from 'vitest';
import { gerarTextoRelatorioLinkedin } from '../relatorioFormatter';
import type { MercadoSnapshot } from '../../types/mercado';

const mockSnapshot: MercadoSnapshot = {
  data: '2026-09-24',
  timestamp: 1790272800000,
  totalVagas: 25,
  modalidades: {
    remoto: 10,
    hibrido: 5,
    presencial: 10,
    pctRemoto: 40,
    pctHibrido: 20,
    pctPresencial: 40,
  },
  senioridades: {
    junior: 5,
    pleno: 12,
    senior: 8,
    naoEspecificado: 0,
  },
  salarios: {
    totalComSalario: 5,
    media: 7500,
    mediana: 8000,
    maior: 12000,
    menor: 4000,
  },
  topStacks: [
    { name: 'React', count: 15, percentage: 60, color: 'from-cyan-500 to-blue-500' },
    { name: 'Node.js', count: 10, percentage: 40, color: 'from-emerald-500 to-green-400' },
  ],
};

describe('Utilitário relatorioFormatter (relatorioFormatter.ts)', () => {
  it('deve gerar texto formatado para o LinkedIn sem erros', () => {
    const texto = gerarTextoRelatorioLinkedin(mockSnapshot);

    expect(texto).toContain('RAIO-X DO MERCADO TECH EM RECIFE & PORTO DIGITAL');
    expect(texto).toContain('Total de Vagas Ativas no Radar: 25');
    expect(texto).toContain('Presencial: 40%');
    expect(texto).toContain('React: 60% das vagas (15)');
    expect(texto).toContain('Mediana de R$ 8.000,00');
    expect(texto).not.toContain('NaN');
    expect(texto).not.toContain('undefined');
  });

  it('deve tratar com segurança snapshot com salários zerados sem produzir R$ NaN', () => {
    const snapshotSemSalario: MercadoSnapshot = {
      ...mockSnapshot,
      salarios: {
        totalComSalario: 0,
        media: 0,
        mediana: 0,
        maior: 0,
        menor: 0,
      },
    };

    const texto = gerarTextoRelatorioLinkedin(snapshotSemSalario);

    expect(texto).toContain('A combinar / Negociáveis com as contratantes');
    expect(texto).not.toContain('NaN');
    expect(texto).not.toContain('R$ 0,00');
  });

  it('deve retornar mensagem amigável para snapshot nulo ou vazio', () => {
    const texto = gerarTextoRelatorioLinkedin(null as any);
    expect(texto).toContain('Nenhuma vaga ativa disponível');
  });
});
