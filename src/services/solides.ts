/**
 * Garimpo Dev — Serviço de Integração HTTP com a API Sólides (Sprint 3)
 * 
 * Suporta busca por slug único ou agregação em tempo real de múltiplos slugs
 * de empresas tech utilizando requisições paralelas com Promise.allSettled.
 */

import axios from 'axios';
import type { SolidesResponse, Vaga } from '../types/vaga';
import { solidesResponseSchema } from '../schemas/solidesSchema';

// Endpoint oficial de listagem de vagas da plataforma Sólides
const SOLIDES_API_BASE_URL = 'https://apigw.solides.com.br/jobs/v3/home/vacancy';

export interface GetVagasParams {
  slug?: string;    // Slug da empresa/hub (padrão: "portodigital")
  page?: number;    // Página solicitada (padrão: 1)
  take?: number;    // Quantidade de itens por página (padrão: 12)
  title?: string;   // Filtro opcional por palavra-chave no título
}

/**
 * Busca a lista de vagas de um único slug da plataforma Sólides com validação de schema Zod.
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

    // Validação de Schema em Runtime via Zod
    const parseResult = solidesResponseSchema.safeParse(response.data);
    if (!parseResult.success) {
      console.warn(`[Zod Runtime Notice] Payload da API Sólides teve pequenas variações (slug: ${slug}):`, parseResult.error.issues);
      // Se houver estrutura mínima utilizável, retorna casting defensivo; caso contrário lança erro
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        return response.data;
      }
      throw new Error('Divergência de contrato de dados na API da Sólides.');
    }

    return parseResult.data as unknown as SolidesResponse;
  } catch (error) {
    console.error(`Erro ao conectar com a API da Sólides (slug: ${slug}):`, error);
    throw new Error('Não foi possível carregar as vagas. Verifique sua conexão.');
  }
};

/**
 * RECURSO SPRINT 3: Busca agregada de múltiplos slugs em paralelo.
 * Realiza chamadas concorrentes usando Promise.allSettled para garantir que,
 * se um slug falhar, os demais continuem funcionando normalmente.
 * 
 * @param slugs Lista de slugs para consultar (ex: ['portodigital', 'vsoft', 'solides'])
 * @param title Filtro opcional por palavra-chave
 * @returns Resposta consolidada com todas as vagas combinadas e sem duplicatas.
 */
export const fetchVagasMultiplosSlugs = async (
  slugs: string[],
  title: string = ''
): Promise<SolidesResponse> => {
  try {
    const promessas = slugs.map((slug) =>
      axios.get<SolidesResponse>(SOLIDES_API_BASE_URL, {
        params: {
          slug,
          page: 1,
          take: 24, // Traz mais vagas por slug na agregação
          title: title.trim(),
        },
      })
    );

    const resultados = await Promise.allSettled(promessas);
    const todasVagas: Vaga[] = [];
    let mapaIds = new Set<number>();

    resultados.forEach((res) => {
      if (res.status === 'fulfilled' && res.value.data?.success && res.value.data?.data?.data) {
        res.value.data.data.data.forEach((vaga) => {
          // Evita duplicatas de vagas pelo ID numérico
          if (!mapaIds.has(vaga.id)) {
            mapaIds.add(vaga.id);
            todasVagas.push(vaga);
          }
        });
      }
    });

    // Ordena as vagas combinadas pela data de criação mais recente
    todasVagas.sort((a, b) => {
      const dataA = new Date(a.createdAt || 0).getTime();
      const dataB = new Date(b.createdAt || 0).getTime();
      return dataB - dataA;
    });

    return {
      success: true,
      errors: [],
      data: {
        totalPages: 1,
        currentPage: 1,
        count: todasVagas.length,
        data: todasVagas,
      },
    };
  } catch (error) {
    console.error('Erro na busca agregada de múltiplos slugs:', error);
    throw new Error('Erro ao agregar vagas de múltiplas empresas.');
  }
};
