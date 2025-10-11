import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../users/auth.middleware';
import {
  createServicio,
  deleteServicio,
  listServicios,
  updateServicio
} from './cleBroker.service';
import { ApiError } from '../../core/errors';

const router = Router();

router.get('/servicios', async (req, res, next) => {
  try {
    const visible = req.query.visible === undefined ? undefined : req.query.visible === 'true';
    const servicios = await listServicios(visible);
    res.json({ servicios });
  } catch (error) {
    next(error);
  }
});

router.post('/servicios', requireAuth, async (req, res, next) => {
  try {
    const servicio = await createServicio(req.body);
    res.status(201).json({ servicio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.put('/servicios/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    const servicio = await updateServicio(id, req.body);
    res.json({ servicio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.delete('/servicios/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    await deleteServicio(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
