import { describe, it, expect } from 'vitest';
import { obterADRs, calcularTelemetriaApp, gerarTextoArtigoEngenharia, ADRS_GARIMPO_DEV } from '../../data/diarioTecnico';

describe('Base de Dados e Utilitários de Diário Técnico (diarioTecnico.ts)', () => {
  it('deve conter exatamente 6 ADRs documentados', () => {
    expect(ADRS_GARIMPO_DEV).toHaveLength(6);
  });

  it('deve filtrar ADRs por categoria corretamente', () => {
    const adrsArquitetura = obterADRs('arquitetura');
    expect(adrsArquitetura.length).toBeGreaterThan(0);
    expect(adrsArquitetura.every((a) => a.categoria === 'arquitetura')).toBe(true);

    const adrsResiliencia = obterADRs('resiliencia');
    expect(adrsResiliencia.length).toBeGreaterThan(0);
    expect(adrsResiliencia.every((a) => a.categoria === 'resiliencia')).toBe(true);
  });

  it('deve buscar ADRs por palavra-chave no título ou contexto', () => {
    const resultado = obterADRs('todas', 'CORS');
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].titulo).toContain('CORS');
  });

  it('deve calcular a telemetria da aplicação sem erros', () => {
    const telemetria = calcularTelemetriaApp(15);
    expect(telemetria.totalVagasCache).toBe(15);
    expect(telemetria.totalTestes).toBeGreaterThanOrEqual(53);
    expect(telemetria.versao).toBe('2.5 Full');
    expect(typeof telemetria.tamanhoCacheKB).toBe('number');
  });

  it('deve gerar o texto do artigo em 1ª pessoa com conteúdo de qualidade', () => {
    const artigo = gerarTextoArtigoEngenharia();
    expect(artigo).toContain('Como Construí o Garimpo Dev');
    expect(artigo).toContain('Jonas Ferreira Silva');
    expect(artigo).toContain('Access-Control-Allow-Origin');
    expect(artigo).toContain('Mediana Salarial');
  });
});
