import { describe, it, expect, beforeEach } from 'vitest';
import type { Vaga } from '../../types/vaga';
import {
  extrairTopStacks,
  calcularModalidades,
  calcularSenioridades,
  calcularSalarioMetricas,
  gerarSnapshotMercado,
  salvarSnapshotHistorico,
  obterHistoricoMercado,
} from '../mercadoAnalytics';

const vagasMock: Vaga[] = [
  {
    id: 1,
    title: 'Desenvolvedor React Senior',
    description: '<p>Vaga para atuar com ReactJS, TypeScript e Node.js</p>',
    currentState: 'em_andamento',
    companyName: 'Vsoft',
    companyLogo: '',
    slug: 'vsoft',
    redirectLink: 'https://vsoft.vagas.solides.com.br/vaga/1',
    jobType: 'remoto',
    homeOffice: true,
    openPositions: 1,
    availablePositions: 1,
    createdAt: '2026-09-24',
    city: { id: 1, name: 'Recife', state_id: 1 },
    state: { id: 1, name: 'PE', code: 'PE' },
    salary: { type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: 9000, negotiable: false },
  },
  {
    id: 2,
    title: 'Engenheiro Java Pleno',
    description: '<p>Requisitos: Java 17, Spring Boot, SQL e Docker</p>',
    currentState: 'em_andamento',
    companyName: 'Porto Digital',
    companyLogo: '',
    slug: 'portodigital',
    redirectLink: 'https://portodigital.vagas.solides.com.br/vaga/2',
    jobType: 'presencial',
    homeOffice: false,
    openPositions: 1,
    availablePositions: 1,
    createdAt: '2026-09-24',
    city: { id: 1, name: 'Recife', state_id: 1 },
    state: { id: 1, name: 'PE', code: 'PE' },
    salary: { type: 'simple', showRangeToApplicant: true, initialRange: 0, finalRange: 6000, negotiable: false },
  },
  {
    id: 3,
    title: 'Desenvolvedor JavaScript Júnior',
    description: '<p>Vaga Júnior para atuar com JS e Python</p>',
    currentState: 'em_andamento',
    companyName: 'Sólides',
    companyLogo: '',
    slug: 'solides',
    redirectLink: 'https://solides.vagas.solides.com.br/vaga/3',
    jobType: 'hibrido',
    homeOffice: false,
    openPositions: 1,
    availablePositions: 1,
    createdAt: '2026-09-24',
    city: { id: 1, name: 'Recife', state_id: 1 },
    state: { id: 1, name: 'PE', code: 'PE' },
    salary: { type: 'simple', showRangeToApplicant: false, initialRange: 0, finalRange: 0, negotiable: true },
  },
];

describe('Utilitários de Analytics de Mercado (mercadoAnalytics.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve extrair tecnologias com regex impedindo conflito entre Java e JavaScript', () => {
    const stacks = extrairTopStacks(vagasMock);

    const javaStack = stacks.find((s) => s.name === 'Java');
    const jsStack = stacks.find((s) => s.name === 'JavaScript');

    // Java deve aparecer exatamente em 1 vaga (vaga 2), não em JavaScript (vaga 3)
    expect(javaStack?.count).toBe(1);
    expect(jsStack?.count).toBe(1);
  });

  it('deve calcular as porcentagens de modalidade corretamente', () => {
    const mods = calcularModalidades(vagasMock);

    expect(mods.remoto).toBe(1);
    expect(mods.hibrido).toBe(1);
    expect(mods.presencial).toBe(1);
    expect(mods.pctRemoto).toBe(33);
    expect(mods.pctHibrido).toBe(33);
    expect(mods.pctPresencial).toBe(33);
  });

  it('deve identificar senioridade a partir dos títulos das vagas', () => {
    const sen = calcularSenioridades(vagasMock);

    expect(sen.junior).toBe(1);
    expect(sen.pleno).toBe(1);
    expect(sen.senior).toBe(1);
  });

  it('deve calcular média e mediana salarial considerando apenas vagas com valor informado', () => {
    const sal = calcularSalarioMetricas(vagasMock);

    expect(sal.totalComSalario).toBe(2); // Vagas 1 (9000) e 2 (6000)
    expect(sal.media).toBe(7500); // (9000 + 6000) / 2
    expect(sal.mediana).toBe(7500);
    expect(sal.maior).toBe(9000);
    expect(sal.menor).toBe(6000);
  });

  it('deve salvar snapshot no localStorage sobrescrevendo o mesmo dia', () => {
    const snapshot = gerarSnapshotMercado(vagasMock);
    salvarSnapshotHistorico(snapshot);

    // Salva novamente para simular o auto-polling no mesmo dia
    salvarSnapshotHistorico(snapshot);

    const historico = obterHistoricoMercado();
    expect(historico).toHaveLength(1);
    expect(historico[0].totalVagas).toBe(3);
  });
});
