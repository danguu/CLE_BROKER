import rateLimit from 'express-rate-limit';
import env from './env';

export function createRateLimiter(options?: { windowMs?: number; max?: number }) {
  const windowMs = options?.windowMs ?? env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000;
  const max = options?.max ?? env.RATE_LIMIT_MAX ?? 100;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Demasiadas solicitudes, intenta nuevamente más tarde.'
  });
}
