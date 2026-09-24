/**
 * Garimpo Dev — Utilitário relatorioFormatter (Sprint 8)
 * 
 * Gera textos institucionalmente formatados para redes sociais (LinkedIn, WhatsApp)
 * a partir de snapshots de inteligência de mercado, tratando cenários de dados ausentes ou salários ocultos.
 */

import type { MercadoSnapshot } from '../types/mercado';
import { formatSalary } from './formatters';

/**
 * Compila o snapshot de mercado em um resumo em texto otimizado para postagem no LinkedIn / WhatsApp.
 */
export const gerarTextoRelatorioLinkedin = (snapshot: MercadoSnapshot): string => {
  if (!snapshot || snapshot.totalVagas === 0) {
    return '📊 Radar de Mercado Tech Recife — Nenhuma vaga ativa disponível na amostra atual.';
  }

  const dataFormatada = new Date(snapshot.timestamp || Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const { modalidades, topStacks, salarios, totalVagas } = snapshot;

  // Formatação segura de salários para evitar "R$ NaN" ou "R$ 0"
  let informacaoSalario = 'A combinar / Negociáveis com as contratantes';
  if (salarios && salarios.totalComSalario > 0 && salarios.mediana > 0) {
    const medianaStr = formatSalary({
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 0,
      finalRange: salarios.mediana,
      negotiable: false,
    });
    const mediaStr = formatSalary({
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 0,
      finalRange: salarios.media,
      negotiable: false,
    });
    informacaoSalario = `Mediana de ${medianaStr} (Média: ${mediaStr} em ${salarios.totalComSalario} vagas com valor aberto)`;
  }

  // Lista dos top 5 stacks formatados
  const top5Stacks = (topStacks || [])
    .slice(0, 5)
    .map((s) => `  • ${s.name}: ${s.percentage}% das vagas (${s.count})`)
    .join('\n');

  return `🚀 RAIO-X DO MERCADO TECH EM RECIFE & PORTO DIGITAL
📅 Relatório consolidado em ${dataFormatada}

📊 AMOSTRA ANALISADA
  • Total de Vagas Ativas no Radar: ${totalVagas} oportunidades

💼 MODELOS DE TRABALHO
  • 🏢 Presencial: ${modalidades.pctPresencial}% (${modalidades.presencial} vagas)
  • 🔄 Híbrido: ${modalidades.pctHibrido}% (${modalidades.hibrido} vagas)
  • 🏠 Remoto: ${modalidades.pctRemoto}% (${modalidades.remoto} vagas)

🔥 TECNOLOGIAS MAIS DEMANDADAS
${top5Stacks || '  • Nenhuma stack identificada na amostra.'}

💰 FAIXA SALARIAL
  • ${informacaoSalario}

🔍 METODOLOGIA & FONTE DE DADOS
Métricas capturadas em tempo real da plataforma de oportunidades do Porto Digital via Garimpo Dev.

👉 Acesse o radar completo e acompanhe em tempo real:
https://garimpo-dev.vercel.app/?aba=mercado

#PortoDigital #RecifeTech #DesenvolvimentoDeSoftware #CarreiraTech #GarimpoDev`;
};

/**
 * Função utilitária para copiar qualquer texto para a área de transferência do usuário.
 */
export const copiarParaAreaDeTransferencia = async (texto: string): Promise<boolean> => {
  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API falhou, tentando fallback:', err);
  }

  // Fallback para navegadores sem suporte à Clipboard API moderna
  try {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const exito = document.execCommand('copy');
    document.body.removeChild(textarea);
    return exito;
  } catch (e) {
    console.error('Falha ao copiar texto:', e);
    return false;
  }
};
