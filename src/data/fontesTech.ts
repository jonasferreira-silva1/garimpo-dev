/**
 * Garimpo Dev — Conector Curado de Fontes & Comunidades Tech (Sprint 8)
 * 
 * Mapeamento e documentação transparente de todas as fontes de dados reais,
 * repositórios abertos e comunidades verificadas de Pernambuco e Brasil.
 */

export interface FonteTech {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'api_direta' | 'open_data' | 'comunidade' | 'radar_externo';
  url: string;
  verificada: boolean;
  detalheTecnico: string;
}

export const FONTES_TECH_RECIFE: FonteTech[] = [
  {
    id: 'solides_portodigital',
    nome: 'API Sólides — Hub Porto Digital',
    descricao: 'API Gateway pública sem CORS trazendo anúncios das empresas do Porto Digital.',
    tipo: 'api_direta',
    url: 'https://www.portodigital.org/',
    verificada: true,
    detalheTecnico: 'Integração HTTP via Axios direta com auto-polling a cada 5min',
  },
  {
    id: 'pug_pe',
    nome: 'Python User Group PE (PUG-PE)',
    descricao: 'Comunidade aberta de desenvolvimento Python, IA e Data Science em Pernambuco.',
    tipo: 'comunidade',
    url: 'https://pugpe.github.io/',
    verificada: true,
    detalheTecnico: 'Portal de código aberto hospedado no GitHub Pages',
  },
  {
    id: 'recnplay',
    nome: 'Festival REC\'n\'Play / Porto Digital',
    descricao: 'Maior festival de tecnologia, games e inovação do Nordeste.',
    tipo: 'open_data',
    url: 'https://recnplay.pe/',
    verificada: true,
    detalheTecnico: 'Portal institucional de programação e maratona de código',
  },
  {
    id: 'cesar_school',
    nome: 'CESAR & CESAR School',
    descricao: 'Centro de Estudos e Sistemas Avançados do Recife — Cursos e Tech Talks.',
    tipo: 'comunidade',
    url: 'https://www.cesar.school/',
    verificada: true,
    detalheTecnico: 'Comunidade de inovação e engenharia de testes',
  },
  {
    id: 'linkedin_recife',
    nome: 'LinkedIn Recife Tech Radar',
    descricao: 'Filtro otimizado para cargos de desenvolvimento de software na Região Metropolitana.',
    tipo: 'radar_externo',
    url: 'https://www.linkedin.com/jobs/search/?keywords=desenvolvedor%20tecnologia&location=Recife%2C%20Pernambuco%2C%20Brasil',
    verificada: true,
    detalheTecnico: 'Atalho com query de busca parametrizada para TI',
  },
  {
    id: 'remotar',
    nome: 'Remotar Brasil',
    descricao: 'Plataforma especializada em vagas 100% remotas para desenvolvedores brasileiros.',
    tipo: 'radar_externo',
    url: 'https://remotar.com.br/',
    verificada: true,
    detalheTecnico: 'Curadoria focada em trabalho remoto nacional',
  },
];
