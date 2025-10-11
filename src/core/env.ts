import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatorio'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET es obligatorio'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL debe ser un email válido'),
  ADMIN_PASSWORD: z.string().min(6, 'ADMIN_PASSWORD debe tener al menos 6 caracteres'),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((val) => (val ? val === 'true' : undefined))
    .optional(),
  SMTP_FROM: z.string().email().optional(),
  BASE_URL: z.string().min(1),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().optional(),
  RATE_LIMIT_MAX: z.coerce.number().optional(),
  CORS_ORIGIN: z.string().optional(),
  PUBLIC_CONTACT_EMAIL: z.string().email().optional()
});

const env = envSchema.parse(process.env);

export default env;
