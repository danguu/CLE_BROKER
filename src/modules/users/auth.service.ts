import bcrypt from 'bcryptjs';
import prisma from '../../core/prisma';
import { ApiError } from '../../core/errors';
import { signToken } from './auth.middleware';

export async function login(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.hash);
  if (!isMatch) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
}

export async function getMe(userId: number) {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true }
  });

  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  return user;
}
