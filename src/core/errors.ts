import { NextFunction, Request, Response } from 'express';
import logger from './logger';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error({ err, details: err.details }, err.message);
    }
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  logger.error({ err }, 'Error inesperado');
  return res.status(500).json({ message: 'Error interno del servidor' });
};
