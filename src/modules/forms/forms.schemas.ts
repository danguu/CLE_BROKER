import { z } from 'zod';

export const contactoSchema = z.object({
  nombre: z.string().min(2).max(120).trim(),
  email: z.string().email().trim(),
  whatsapp: z.string().min(6).max(30).trim(),
  destinoInteres: z.string().max(180).trim().optional()
});

export const cotizacionSchema = z
  .object({
    leadId: z.number().int().positive().optional(),
    nombre: z.string().min(2).max(120).trim().optional(),
    email: z.string().email().trim().optional(),
    whatsapp: z.string().min(6).max(30).trim().optional(),
    destinoInteres: z.string().max(180).trim().optional(),
    programaId: z.number().int().positive().optional(),
    mensaje: z.string().max(500).trim().optional()
  })
  .refine((data) => data.leadId || (data.nombre && data.email && data.whatsapp), {
    message: 'Debe proporcionar un leadId existente o los datos completos del lead',
    path: ['lead']
  });
