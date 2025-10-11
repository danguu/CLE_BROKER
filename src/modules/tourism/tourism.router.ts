import { Router } from 'express';
import { z } from 'zod';
import {
  createBeneficio,
  createPrograma,
  createTestimonio,
  deleteBeneficio,
  deletePrograma,
  deleteTestimonio,
  listBeneficios,
  listProgramas,
  listTestimonios,
  parseVisibleQuery,
  updateBeneficio,
  updatePrograma,
  updateTestimonio
} from './tourism.service';
import { ApiError } from '../../core/errors';
import { requireAuth } from '../users/auth.middleware';

const router = Router();

router.get('/programas', async (req, res, next) => {
  try {
    const visible = parseVisibleQuery(req.query.visible);
    const programas = await listProgramas(visible);
    res.json({ programas });
  } catch (error) {
    next(error);
  }
});

router.post('/programas', requireAuth, async (req, res, next) => {
  try {
    const programa = await createPrograma(req.body);
    res.status(201).json({ programa });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.put('/programas/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    const programa = await updatePrograma(id, req.body);
    res.json({ programa });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.delete('/programas/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    await deletePrograma(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/beneficios', async (_req, res, next) => {
  try {
    const beneficios = await listBeneficios();
    res.json({ beneficios });
  } catch (error) {
    next(error);
  }
});

router.post('/beneficios', requireAuth, async (req, res, next) => {
  try {
    const beneficio = await createBeneficio(req.body);
    res.status(201).json({ beneficio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.put('/beneficios/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    const beneficio = await updateBeneficio(id, req.body);
    res.json({ beneficio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.delete('/beneficios/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    await deleteBeneficio(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/testimonios', async (req, res, next) => {
  try {
    const visible = parseVisibleQuery(req.query.visible);
    const testimonios = await listTestimonios(visible);
    res.json({ testimonios });
  } catch (error) {
    next(error);
  }
});

router.post('/testimonios', requireAuth, async (req, res, next) => {
  try {
    const testimonio = await createTestimonio(req.body);
    res.status(201).json({ testimonio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.put('/testimonios/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    const testimonio = await updateTestimonio(id, req.body);
    res.json({ testimonio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.delete('/testimonios/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, 'ID inválido');
    await deleteTestimonio(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
