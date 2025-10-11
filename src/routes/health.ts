import { Router } from 'express';
import prisma from '../core/prisma';

const router = Router();

router.get('/healthz', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', details: (error as Error).message });
  }
});

export default router;
