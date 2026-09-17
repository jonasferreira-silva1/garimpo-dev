/**
 * Garimpo Dev — Definições de Tipos TypeScript (Sprint 3)
 * 
 * Este arquivo contém todas as interfaces que mapeiam a resposta da API externa da Sólides,
 * além dos tipos para múltiplos slugs de empresas e sistema de favoritos.
 */

// Slugs mapeados de empresas e hubs no ecossistema
export const SLUGS_EMPRESAS = [
  { id: 'todos', label: 'Todas as Empresas', count: 0 },
  { id: 'portodigital', label: 'Porto Digital (Hub)', count: 0 },
  { id: 'vsoft', label: 'Vsoft Tecnologia', count: 0 },
  { id: 'solides', label: 'Sólides Tech', count: 0 },
] as const;

// Interface para a resposta envelopada da API Sólides
export interface SolidesResponse {
  success: boolean;
  errors: any[];
  data: {
    totalPages: number;   // Total de páginas disponíveis para paginação
    currentPage: number;  // Número da página atual
    count: number;        // Quantidade total de vagas encontradas
    data: Vaga[];         // Lista de vagas retornadas
  };
}

// Interface que representa o Salário da Vaga
export interface SalarioVaga {
  type: string;                    // Ex: "simple"
  showRangeToApplicant: boolean;   // Se deve exibir o valor do salário para o candidato
  initialRange: number;            // Faixa salarial inicial (0 se não informado)
  finalRange: number;              // Faixa salarial final ou valor fixo (0 se a combinar)
  negotiable: boolean;             // Se o salário é negociável
}

// Interface que representa a Cidade da Vaga
export interface CidadeVaga {
  id: number;
  name: string;        // Ex: "Recife", "Brasília"
  state_id: number;
}

// Interface que representa o Estado da Vaga
export interface EstadoVaga {
  id: number;
  name: string;        // Ex: "Pernambuco"
  code: string;        // Ex: "PE"
}

// Interface principal da Vaga retornada pela API
export interface Vaga {
  id: number;                          // ID único da vaga na Sólides
  title: string;                       // Título do cargo (ex: "Desenvolvedor React Senior")
  description: string;                 // Descrição detalhada da vaga em HTML encodado
  currentState: string;                // Estado da vaga (ex: "em_andamento")
  companyName: string;                 // Nome da empresa contratante (ex: "NUCLEO DE GESTAO DO PORTO DIGITAL")
  companyLogo: string;                 // URL do logotipo da empresa
  slug: string;                        // Slug da empresa (ex: "portodigital")
  redirectLink: string;                // URL original da vaga
  jobType: string;                     // Modelo de trabalho: "presencial" | "remoto" | "hibrido"
  homeOffice: boolean;                 // Booleano indicando se permite Home Office
  openPositions: number;               // Vagas abertas no total
  availablePositions: number;          // Vagas ainda disponíveis
  createdAt: string;                   // Data de criação no formato ISO "YYYY-MM-DD"
  
  city: CidadeVaga;                    // Objeto com a cidade
  state: EstadoVaga;                   // Objeto com o estado
  salary: SalarioVaga;                 // Objeto de salário
  
  seniority?: Array<{                  // Nível de senioridade (ex: Júnior, Pleno, Sênior)
    id: number;
    name: string;
  }>;
  
  recruitmentContractType?: Array<{    // Tipo de contrato (ex: CLT, PJ)
    id: number;
    name: string;
  }>;
  
  benefits?: Array<{                   // Benefícios oferecidos
    id: number;
    name: string;
  }>;
  
  occupationAreas?: Array<{            // Área de atuação (ex: Tecnologia)
    id: number;
    name: string;
  }>;
}

// Interface de Filtros expandida para a Sprint 3
export interface FiltrosVaga {
  busca: string;              // Palavra-chave para filtrar pelo título
  modelo: string;             // "todos" | "remoto" | "hibrido" | "presencial"
  slugEmpresa: string;        // "todos" | "portodigital" | "vsoft" | "solides"
  apenasFavoritas: boolean;   // Se deve exibir somente vagas favoritadas pelo usuário
}
