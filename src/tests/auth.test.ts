import bcrypt from 'bcryptjs';
import request from 'supertest';

jest.mock('../core/prisma', () => require('./utils/prismaMock').default);

import app from '../server';
import prismaMock from './utils/prismaMock';

describe('Auth routes', () => {
  it('should authenticate admin user and return a token', async () => {
    const password = 'Admin123!';
    const hash = await bcrypt.hash(password, 10);

    prismaMock.adminUser.findUnique.mockResolvedValue({
      id: 1,
      email: 'admin@example.com',
      hash,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('admin@example.com');
  });

  it('should reject invalid credentials', async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue(null as any);

    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
  });
});
