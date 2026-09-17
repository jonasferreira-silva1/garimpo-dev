/**
 * Garimpo Dev — Serviço de Integração HTTP com a API Sólides
 * 
 * Responsável por realizar as chamadas HTTP diretas para a API pública da Sólides,
 * sem necessidade de backend ou proxy (graças ao CORS aberto da Sólides).
 */

import axios from 'axios';
import type { SolidesResponse } from '../types/vaga';

// Endpoint oficial de listagem de vagas da plataforma Sólides
const SOLIDES_API_BASE_URL = 'https://apigw.solides.com.br/jobs/v3/home/vacancy';

export interface GetVagasParams {
  slug?: string;    // Slug da empresa/hub (padrão: "portodigital")
  page?: number;    // Página solicitada (padrão: 1)
  take?: number;    // Quantidade de itens por página (padrão: 12)
  title?: string;   // Filtro opcional por palavra-chave no título
}

/**
 * Busca a lista de vagas da plataforma Sólides.
 * @param params Parâmetros de consulta (slug, página, quantidade e título)
 * @returns Promessa contendo a estrutura SolidesResponse com a lista de vagas e dados de paginação.
 */
export const fetchVagasSolides = async ({
  slug = 'portodigital',
  page = 1,
  take = 12,
  title = '',
}: GetVagasParams = {}): Promise<SolidesResponse> => {
  try {
    const response = await axios.get<SolidesResponse>(SOLIDES_API_BASE_URL, {
      params: {
        slug,
        page,
        take,
        title: title.trim(),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao conectar com a API da Sólides:', error);
    throw new Error('Não foi possível carregar as vagas. Verifique sua conexão.');
  }
};
