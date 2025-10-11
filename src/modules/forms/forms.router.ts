import { Router } from 'express';
import { ApiError } from '../../core/errors';
import { createRateLimiter } from '../../core/rateLimit';
import { handleContacto, handleCotizacion } from './forms.service';
import { z } from 'zod';

const router = Router();
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router.post('/contacto', limiter, async (req, res, next) => {
  try {
    const lead = await handleContacto(req.body, {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
      referer: req.get('referer') ?? undefined
    });
    res.status(201).json({ message: 'Contacto recibido', leadId: lead.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.post('/cotizacion', limiter, async (req, res, next) => {
  try {
    const cotizacion = await handleCotizacion(req.body, {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
      referer: req.get('referer') ?? undefined
    });
    res.status(201).json({ message: 'Cotización creada', cotizacionId: cotizacion.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

export default router;
