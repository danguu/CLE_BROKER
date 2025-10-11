import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../../core/errors';
import { login, getMe } from './auth.service';
import { requireAuth } from './auth.middleware';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Datos inválidos', error.flatten()));
      return;
    }
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Autenticación requerida');
    }
    const user = await getMe(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
