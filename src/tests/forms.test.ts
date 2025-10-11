import request from 'supertest';

jest.mock('../core/prisma', () => require('./utils/prismaMock').default);
const sendMailMock = jest.fn();
jest.mock('../core/mailer', () => ({
  sendMail: sendMailMock
}));

import app from '../server';
import prismaMock from './utils/prismaMock';

const contactoPayload = {
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  whatsapp: '+573001234567',
  destinoInteres: 'Cancún'
};

describe('Forms routes', () => {
  beforeEach(() => {
    sendMailMock.mockReset();
  });

  it('should create a lead from contacto form and send confirmation email', async () => {
    prismaMock.lead.create.mockResolvedValue({ id: 1, ...contactoPayload, origenFormulario: 'contacto' });

    const response = await request(app).post('/api/forms/contacto').send(contactoPayload);

    expect(response.status).toBe(201);
    expect(response.body.leadId).toBe(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it('should create a cotizacion and notify admin and user', async () => {
    prismaMock.lead.create.mockResolvedValue({ id: 10, ...contactoPayload, origenFormulario: 'cotizacion' });
    prismaMock.cotizacion.create.mockResolvedValue({
      id: 5,
      leadId: 10,
      mensaje: 'Me interesa viajar en junio',
      estado: 'pendiente',
      lead: { id: 10, ...contactoPayload, origenFormulario: 'cotizacion' },
      programa: { id: 3, titulo: 'Cancún All Inclusive – 4 noches' }
    });

    const response = await request(app)
      .post('/api/forms/cotizacion')
      .send({ ...contactoPayload, programaId: 3, mensaje: 'Me interesa viajar en junio' });

    expect(response.status).toBe(201);
    expect(response.body.cotizacionId).toBe(5);
    expect(sendMailMock).toHaveBeenCalledTimes(2);
  });
});
