import { PrismaClient } from '@prisma/client';
import env from './env';
import logger from './logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma || new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

prismaClient.$connect().catch((error) => {
  logger.error({ error }, 'No se pudo conectar a la base de datos');
});

export default prismaClient;
