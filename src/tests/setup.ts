import prismaMock from './utils/prismaMock';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/cle_broker';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'testsecret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@example.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin123!';
process.env.SMTP_HOST = process.env.SMTP_HOST ?? 'smtp.example.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = process.env.SMTP_USER ?? 'user';
process.env.SMTP_PASS = process.env.SMTP_PASS ?? 'pass';
process.env.BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

beforeEach(() => {
  jest.clearAllMocks();
  prismaMock.lead.create.mockReset();
  prismaMock.cotizacion.create.mockReset();
  prismaMock.programaTuristico.findMany.mockReset();
  prismaMock.adminUser.findUnique.mockReset();
});
