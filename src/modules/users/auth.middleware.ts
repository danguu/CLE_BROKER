import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUserRole } from '@prisma/client';
import env from '../../core/env';
import { ApiError } from '../../core/errors';

export interface AuthTokenPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Autenticación requerida');
  }

  const token = authHeader.substring('Bearer '.length);
  const payload = verifyToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role as AdminUserRole
  };

  next();
}
