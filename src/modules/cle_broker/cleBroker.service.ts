import prisma from '../../core/prisma';
import { servicioSchema } from './cleBroker.schemas';
import { ApiError } from '../../core/errors';

export async function listServicios(visible?: boolean) {
  return prisma.servicioCleBroker.findMany({
    where: visible === undefined ? {} : { visible },
    orderBy: [{ orden: 'asc' }, { id: 'asc' }]
  });
}

export async function createServicio(data: unknown) {
  const parsed = servicioSchema.parse(data);
  return prisma.servicioCleBroker.create({ data: parsed });
}

export async function updateServicio(id: number, data: unknown) {
  const parsed = servicioSchema.partial().parse(data);
  try {
    return await prisma.servicioCleBroker.update({ where: { id }, data: parsed });
  } catch (error) {
    throw new ApiError(404, 'Servicio no encontrado');
  }
}

export async function deleteServicio(id: number) {
  try {
    await prisma.servicioCleBroker.delete({ where: { id } });
  } catch (error) {
    throw new ApiError(404, 'Servicio no encontrado');
  }
}
