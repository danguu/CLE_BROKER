import request from 'supertest';

jest.mock('../core/prisma', () => require('./utils/prismaMock').default);

import app from '../server';
import prismaMock from './utils/prismaMock';

describe('Tourism routes', () => {
  it('should list visible programs', async () => {
    prismaMock.programaTuristico.findMany.mockResolvedValue([
      { id: 1, titulo: 'Cancún All Inclusive – 4 noches', visible: true },
      { id: 2, titulo: 'Europa Express – 7 días', visible: true }
    ]);

    const response = await request(app).get('/api/tourism/programas').query({ visible: 'true' });

    expect(response.status).toBe(200);
    expect(response.body.programas).toHaveLength(2);
    expect(prismaMock.programaTuristico.findMany).toHaveBeenCalledWith({
      where: { visible: true },
      orderBy: [{ visible: 'desc' }, { id: 'asc' }]
    });
  });
});
