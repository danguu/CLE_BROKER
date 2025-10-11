import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import env from './core/env';
import logger from './core/logger';
import { createRateLimiter } from './core/rateLimit';
import routes from './routes';
import { errorHandler, notFoundHandler } from './core/errors';

const app = express();
app.set('trust proxy', true);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : env.BASE_URL,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(createRateLimiter());

app.get('/', (_req, res) => {
  res.json({ name: 'KayrosGo / Cle_Broker API', version: '1.0.0' });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

if (env.NODE_ENV !== 'test') {
  const port = Number(env.PORT ?? 3000);
  app.listen(port, () => {
    logger.info(`Servidor escuchando en puerto ${port}`);
  });
}

export default app;
