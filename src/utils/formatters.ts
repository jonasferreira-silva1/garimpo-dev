/**
 * Garimpo Dev — Funções Utilitárias e Formatadores
 * 
 * Este arquivo centraliza a lógica de tratamento de dados da API,
 * incluindo a solução para o bug do redirectLink da Sólides,
 * a regra da badge "NOVA" e a formatação de valores em Reais.
 */

import type { SalarioVaga, Vaga } from '../types/vaga';

/**
 * Regra de Negócio: Verifica se a vaga foi publicada nas últimas 48 horas.
 * @param createdAt Data de criação da vaga no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
 * @returns boolean Verdadeiro se a vaga foi criada há menos de 48 horas.
 */
export const isNova = (createdAt: string): boolean => {
  if (!createdAt) return false;
  const dataCriacao = new Date(createdAt).getTime();
  const agora = Date.now();
  const diferencaHoras = (agora - dataCriacao) / (1000 * 60 * 60);
  return diferencaHoras < 48;
};

/**
 * Regra de Negócio: Formatação do salário da vaga conforme retornado pela API.
 * Trata casos de faixa salarial oculta, negociável ou valor zerado.
 * @param salary Objeto de salário retornado da vaga
 * @returns Texto formatado em moeda brasileira (R$) ou estado descritivo.
 */
export const formatSalary = (salary?: SalarioVaga): string => {
  if (!salary || !salary.showRangeToApplicant) return 'A combinar';
  if (salary.negotiable) return 'A combinar / Negociável';
  if (!salary.finalRange || salary.finalRange === 0) return 'A combinar';

  return `R$ ${salary.finalRange.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formata o modelo de trabalho e a localização da vaga para exibição no card.
 * @param vaga Objeto completo da vaga
 * @returns Texto descritivo formatado com ícone/marcador de modalidade.
 */
export const formatLocal = (vaga: Vaga): string => {
  const cidade = vaga.city?.name || 'Recife';
  const estado = vaga.state?.code || 'PE';

  if (vaga.homeOffice || vaga.jobType === 'remoto') {
    return '🏠 Remoto';
  }
  if (vaga.jobType === 'hibrido') {
    return `🔄 Híbrido · ${cidade}/${estado}`;
  }
  return `🏢 Presencial · ${cidade}/${estado}`;
};

/**
 * CORREÇÃO DE BUG (Sólides API):
 * O campo `redirectLink` retornado pela API da Sólides frequentemente vem com o domínio incompleto
 * (ex: "https://portodigital./vacancies/911262").
 * Esta função monta manualmente a URL correta garantindo o domínio .vagas.solides.com.br.
 * 
 * @param slug Slug da empresa (ex: "portodigital")
 * @param id ID numérico da vaga
 * @returns URL completa válida para redirecionar o candidato.
 */
export const buildVagaUrl = (slug: string, id: number): string => {
  const empresaSlug = slug || 'portodigital';
  return `https://${empresaSlug}.vagas.solides.com.br/vacancies/${id}`;
};
