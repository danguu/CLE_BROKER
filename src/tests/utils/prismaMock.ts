const prismaMock = {
  lead: {
    create: jest.fn()
  },
  cotizacion: {
    create: jest.fn()
  },
  programaTuristico: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  beneficio: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  testimonio: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  servicioCleBroker: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  adminUser: {
    findUnique: jest.fn(),
    upsert: jest.fn()
  },
  config: {
    findMany: jest.fn(),
    upsert: jest.fn()
  },
  $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  $disconnect: jest.fn()
} as const;

export type PrismaMock = typeof prismaMock;

export default prismaMock;
