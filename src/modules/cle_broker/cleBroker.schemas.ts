import { z } from 'zod';

export const servicioSchema = z.object({
  titulo: z.string().min(3).max(160).trim(),
  descripcionCorta: z.string().min(3).max(300).trim(),
  descripcionLarga: z.string().min(3).max(2000).trim().optional(),
  visible: z.boolean().default(true),
  orden: z.number().int().nonnegative().default(0)
});
