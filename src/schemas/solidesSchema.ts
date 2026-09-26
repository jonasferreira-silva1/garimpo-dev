/**
 * Garimpo Dev — Zod Schema de Validação Runtime (Sprint 10)
 * 
 * Valida a ESTRUTURA e os TIPOS de dados retornados pela API pública Gateway da Sólides.
 * 
 * ⚠️ NOTA DE ENGENHARIA:
 * O Zod valida contrato técnico e tipos (ex: se `finalRange` é número, se `title` é string).
 * Casos de borda de negócio (como `finalRange: 0` significando 'A combinar' ou `redirectLink` truncado)
 * são intencionalmente válidos no schema e tratados pelas funções de negócio em `formatters.ts`.
 */

import { z } from 'zod';

export const solidesSalarySchema = z.object({
  type: z.string().default('simple'),
  showRangeToApplicant: z.boolean().default(false),
  initialRange: z.number().default(0),
  finalRange: z.number().default(0), // 0 é perfeitamente válido (representa 'A combinar')
  negotiable: z.boolean().default(false),
});

export const solidesCitySchema = z.object({
  id: z.number().optional(),
  name: z.string().default('Recife'),
  state_id: z.number().optional(),
});

export const solidesStateSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  code: z.string().default('PE'),
});

export const solidesVagaSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().default(''),
  currentState: z.string().optional().default('em_andamento'),
  companyName: z.string().default('Empresa Construtora / Porto Digital'),
  companyLogo: z.string().default(''),
  slug: z.string().default('portodigital'),
  redirectLink: z.string().default(''), // Aceita string truncada ou completa retornada pela Sólides
  jobType: z.string().default('presencial'),
  homeOffice: z.boolean().default(false),
  openPositions: z.number().optional().default(1),
  availablePositions: z.number().optional().default(1),
  createdAt: z.string(),
  salary: solidesSalarySchema,
  city: solidesCitySchema,
  state: solidesStateSchema,
});

export const solidesResponseSchema = z.object({
  success: z.boolean().optional(),
  errors: z.array(z.any()).optional(),
  data: z.object({
    totalPages: z.number(),
    currentPage: z.number(),
    count: z.number(),
    data: z.array(solidesVagaSchema),
  }),
});

export type SolidesVagaValidated = z.infer<typeof solidesVagaSchema>;
export type SolidesResponseValidated = z.infer<typeof solidesResponseSchema>;
