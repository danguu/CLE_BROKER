import { AdminUserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: AdminUserRole;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
