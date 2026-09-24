/**
 * Garimpo Dev — Utilitários de Analytics de Mercado (Sprint 7)
 * 
 * Processamento desacoplado e funções puras para extração de tecnologias por regex,
 * cálculo de medianas salariais, estatísticas de modalidade, senioridade e persistência diária.
 */

import type { Vaga } from '../types/vaga';
import type {
  StackCount,
  ModalidadeCount,
  SenioridadeCount,
  SalarioMetric,
  MercadoSnapshot,
} from '../types/mercado';

const HISTORICO_CACHE_KEY = 'garimpo_dev_historico_mercado';

// Definição de regras de regex para extração de stacks sem falsos positivos
const DEFINICOES_STACKS: Array<{ name: string; regex: RegExp; color: string }> = [
  { name: 'React', regex: /\breact\b|\breactjs\b/i, color: 'from-cyan-500 to-blue-500' },
  { name: 'TypeScript', regex: /\btypescript\b|\bts\b/i, color: 'from-blue-600 to-sky-400' },
  { name: 'Node.js', regex: /\bnode\b|\bnodejs\b|\bexpress\b/i, color: 'from-emerald-500 to-green-400' },
  { name: 'JavaScript', regex: /\bjavascript\b|\becmascript\b|(?<!node\.)(?<!node)(?<!react)(?<!vue)\bjs\b/i, color: 'from-amber-400 to-yellow-300' },
  { name: 'Python', regex: /\bpython\b|\bdjango\b|\bfastapi\b/i, color: 'from-sky-500 to-amber-400' },
  { name: 'Java', regex: /\bjava\b(?!script)/i, color: 'from-orange-500 to-amber-600' },
  { name: 'C# / .NET', regex: /\bc#\b|\bdotnet\b|\b\.net\b/i, color: 'from-purple-600 to-indigo-400' },
  { name: 'SQL / Bancos', regex: /\bsql\b|\bpostgres\b|\bmysql\b|\boracle\b/i, color: 'from-indigo-500 to-blue-400' },
  { name: 'Docker / Cloud', regex: /\bdocker\b|\bkubernetes\b|\baws\b|\bdevops\b/i, color: 'from-blue-500 to-cyan-400' },
  { name: 'Angular', regex: /\bangular\b/i, color: 'from-red-600 to-rose-400' },
  { name: 'Vue.js', regex: /\bvue\b|\bvuejs\b/i, color: 'from-emerald-400 to-teal-500' },
  { name: 'PHP / Laravel', regex: /\bphp\b|\blaravel\b/i, color: 'from-indigo-400 to-purple-500' },
  { name: 'Go / Golang', regex: /\bGo\b|\bgolang\b/, color: 'from-teal-400 to-cyan-300' },
  { name: 'Mobile (Flutter/iOS)', regex: /\bflutter\b|\breact native\b|\bio\s*s\b|\bandroid\b/i, color: 'from-violet-500 to-fuchsia-400' },
  { name: 'QA / Testes', regex: /\bqa\b|\btestes\b|\bcypress\b|\bselenium\b/i, color: 'from-rose-500 to-pink-400' },
];

/**
 * Extrai e calcula a presença relativa (%) de tecnologias mencionadas nas vagas.
 */
export const extrairTopStacks = (vagas: Vaga[]): StackCount[] => {
  if (!vagas || vagas.length === 0) return [];

  const contagemMap = new Map<string, { count: number; color: string }>();

  DEFINICOES_STACKS.forEach((stack) => {
    contagemMap.set(stack.name, { count: 0, color: stack.color });
  });

  vagas.forEach((vaga) => {
    const texto = `${vaga.title} ${vaga.description || ''}`;

    DEFINICOES_STACKS.forEach((stack) => {
      if (stack.regex.test(texto)) {
        const item = contagemMap.get(stack.name)!;
        item.count += 1;
      }
    });
  });

  const resultado: StackCount[] = [];
  const total = vagas.length;

  contagemMap.forEach((val, name) => {
    if (val.count > 0) {
      const percentage = Math.round((val.count / total) * 100);
      resultado.push({
        name,
        count: val.count,
        percentage,
        color: val.color,
      });
    }
  });

  // Ordena pelas tecnologias mais frequentes
  return resultado.sort((a, b) => b.count - a.count);
};

/**
 * Calcula a distribuição percentual das modalidades de trabalho.
 */
export const calcularModalidades = (vagas: Vaga[]): ModalidadeCount => {
  const total = vagas.length;
  if (total === 0) {
    return { remoto: 0, hibrido: 0, presencial: 0, pctRemoto: 0, pctHibrido: 0, pctPresencial: 0 };
  }

  let remoto = 0;
  let hibrido = 0;
  let presencial = 0;

  vagas.forEach((v) => {
    if (v.homeOffice || v.jobType === 'remoto') remoto++;
    else if (v.jobType === 'hibrido') hibrido++;
    else presencial++;
  });

  return {
    remoto,
    hibrido,
    presencial,
    pctRemoto: Math.round((remoto / total) * 100),
    pctHibrido: Math.round((hibrido / total) * 100),
    pctPresencial: Math.round((presencial / total) * 100),
  };
};

/**
 * Classifica vagas por nível de senioridade a partir do título.
 */
export const calcularSenioridades = (vagas: Vaga[]): SenioridadeCount => {
  let junior = 0;
  let pleno = 0;
  let senior = 0;
  let naoEspecificado = 0;

  const rxJunior = /\bjúnior\b|\bjunior\b|\bestágio\b|\bestagio\b|\btrainee\b|\baspirante\b/i;
  const rxPleno = /\bpleno\b|\bmid\b|\bpl\b/i;
  const rxSenior = /\bsênior\b|\bsenior\b|\bsr\b|\blead\b|\bespecialista\b|\btech lead\b/i;

  vagas.forEach((v) => {
    const titulo = v.title || '';
    let identificado = false;

    if (rxJunior.test(titulo)) {
      junior++;
      identificado = true;
    }
    if (rxSenior.test(titulo)) {
      senior++;
      identificado = true;
    }
    if (rxPleno.test(titulo) && !rxSenior.test(titulo)) {
      pleno++;
      identificado = true;
    }

    if (!identificado) {
      naoEspecificado++;
    }
  });

  return { junior, pleno, senior, naoEspecificado };
};

/**
 * Calcula a média e a mediana salarial das vagas que informam valores.
 */
export const calcularSalarioMetricas = (vagas: Vaga[]): SalarioMetric => {
  const valores: number[] = [];

  vagas.forEach((v) => {
    if (v.salary && v.salary.showRangeToApplicant && v.salary.finalRange > 0) {
      valores.push(v.salary.finalRange);
    }
  });

  if (valores.length === 0) {
    return { totalComSalario: 0, media: 0, mediana: 0, maior: 0, menor: 0 };
  }

  valores.sort((a, b) => a - b);
  const totalComSalario = valores.length;
  const soma = valores.reduce((acc, curr) => acc + curr, 0);
  const media = Math.round(soma / totalComSalario);

  // Cálculo da Mediana
  const meio = Math.floor(totalComSalario / 2);
  const mediana =
    totalComSalario % 2 !== 0
      ? valores[meio]
      : Math.round((valores[meio - 1] + valores[meio]) / 2);

  return {
    totalComSalario,
    media,
    mediana,
    maior: valores[valores.length - 1],
    menor: valores[0],
  };
};

/**
 * Gera um objeto MercadoSnapshot completo com o resultado consolidado do momento.
 */
export const gerarSnapshotMercado = (vagas: Vaga[]): MercadoSnapshot => {
  const hojeISO = new Date().toISOString().split('T')[0];

  return {
    data: hojeISO,
    timestamp: Date.now(),
    totalVagas: vagas.length,
    modalidades: calcularModalidades(vagas),
    senioridades: calcularSenioridades(vagas),
    salarios: calcularSalarioMetricas(vagas),
    topStacks: extrairTopStacks(vagas),
  };
};

/**
 * Salva o snapshot diário no localStorage, fazendo overwrite do mesmo dia (YYYY-MM-DD)
 * para evitar duplicações por conta do polling e mantendo apenas os últimos 30 dias.
 */
export const salvarSnapshotHistorico = (snapshot: MercadoSnapshot): void => {
  if (!snapshot || snapshot.totalVagas === 0) return;

  try {
    const raw = localStorage.getItem(HISTORICO_CACHE_KEY);
    let mapa: Record<string, MercadoSnapshot> = {};

    if (raw) {
      mapa = JSON.parse(raw) || {};
    }

    // Faz overwrite da data do snapshot
    mapa[snapshot.data] = snapshot;

    // Mantém no máximo os últimos 30 dias ordenados por data
    const datasOrdenadas = Object.keys(mapa).sort();
    if (datasOrdenadas.length > 30) {
      const datasParaRemover = datasOrdenadas.slice(0, datasOrdenadas.length - 30);
      datasParaRemover.forEach((d) => delete mapa[d]);
    }

    localStorage.setItem(HISTORICO_CACHE_KEY, JSON.stringify(mapa));
  } catch (e) {
    console.warn('Erro ao salvar histórico de mercado no localStorage:', e);
  }
};

/**
 * Retorna a lista de snapshots históricos armazenados, ordenados por data crescente.
 */
export const obterHistoricoMercado = (): MercadoSnapshot[] => {
  try {
    const raw = localStorage.getItem(HISTORICO_CACHE_KEY);
    if (!raw) return [];

    const mapa: Record<string, MercadoSnapshot> = JSON.parse(raw);
    const datas = Object.keys(mapa).sort();

    return datas.map((dataKey) => mapa[dataKey]);
  } catch (e) {
    console.warn('Erro ao ler histórico de mercado do localStorage:', e);
    return [];
  }
};
