import { z } from 'zod';

export const programaSchema = z.object({
  titulo: z.string().min(3).max(160).trim(),
  descripcion: z.string().min(10).max(1000).trim(),
  dias: z.number().int().positive(),
  noches: z.number().int().nonnegative(),
  allInclusive: z.boolean().optional(),
  destino: z.string().min(2).max(120).trim(),
  rating: z.number().min(0).max(5).optional(),
  visible: z.boolean().default(true)
});

export const beneficioSchema = z.object({
  titulo: z.string().min(3).max(160).trim(),
  detalle: z.string().min(3).max(400).trim()
});

export const testimonioSchema = z.object({
  autor: z.string().min(2).max(160).trim(),
  contenido: z.string().min(10).max(800).trim(),
  fuente: z.string().max(160).trim().optional(),
  visible: z.boolean().default(true)
});
